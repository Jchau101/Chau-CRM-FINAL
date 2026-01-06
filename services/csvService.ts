import Papa from 'papaparse';
import { Lead, PipelineStage } from '../types';

export interface CSVMapping {
  csvColumn: string;
  crmField: 'name' | 'company' | 'email' | 'value' | 'stage' | 'notes' | 'skip';
}

export interface CSVImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
  preview: Partial<Lead>[];
}

// Fuzzy match CSV columns to CRM fields
const fuzzyMatch = (csvColumn: string): 'name' | 'company' | 'email' | 'value' | 'stage' | 'notes' | 'skip' => {
  const lower = csvColumn.toLowerCase();
  
  if (lower.includes('name') && !lower.includes('company')) return 'name';
  if (lower.includes('company') || lower.includes('organization') || lower.includes('org')) return 'company';
  if (lower.includes('email') || lower.includes('e-mail')) return 'email';
  if (lower.includes('value') || lower.includes('amount') || lower.includes('deal') || lower.includes('revenue')) return 'value';
  if (lower.includes('stage') || lower.includes('status') || lower.includes('phase')) return 'stage';
  if (lower.includes('note') || lower.includes('comment') || lower.includes('description')) return 'notes';
  
  return 'skip';
};

export const csvService = {
  parseCSV(file: File): Promise<Papa.ParseResult<any>> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results),
        error: (error) => reject(error),
      });
    });
  },

  suggestMappings(csvHeaders: string[]): CSVMapping[] {
    return csvHeaders.map(header => ({
      csvColumn: header,
      crmField: fuzzyMatch(header),
    }));
  },

  validateAndMap(
    csvData: any[],
    mappings: CSVMapping[]
  ): CSVImportResult {
    const errors: string[] = [];
    const preview: Partial<Lead>[] = [];
    let imported = 0;
    let skipped = 0;

    const mappingMap = new Map(mappings.map(m => [m.csvColumn, m.crmField]));

    csvData.forEach((row, index) => {
      const lead: Partial<Lead> = {
        name: '',
        company: '',
        email: '',
        value: 0,
        stage: PipelineStage.PROSPECTING,
        notes: '',
      };

      let hasErrors = false;
      const rowErrors: string[] = [];

      // Map each CSV column to CRM field
      Object.keys(row).forEach(csvCol => {
        const crmField = mappingMap.get(csvCol);
        if (!crmField || crmField === 'skip') return;

        const value = row[csvCol]?.toString().trim() || '';

        switch (crmField) {
          case 'name':
            lead.name = value;
            break;
          case 'company':
            lead.company = value || 'N/A';
            break;
          case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
              rowErrors.push(`Invalid email: ${value}`);
              hasErrors = true;
            } else {
              lead.email = value;
            }
            break;
          case 'value':
            const numValue = parseFloat(value.replace(/[^\d.]/g, '')) || 0;
            lead.value = numValue;
            break;
          case 'stage':
            // Try to match stage
            const upperValue = value.toUpperCase();
            if (Object.values(PipelineStage).includes(upperValue as PipelineStage)) {
              lead.stage = upperValue as PipelineStage;
            }
            break;
          case 'notes':
            lead.notes = value;
            break;
        }
      });

      // Validation: name and email are required
      if (!lead.name) {
        rowErrors.push('Missing required field: Name');
        hasErrors = true;
      }
      if (!lead.email) {
        rowErrors.push('Missing required field: Email');
        hasErrors = true;
      }

      if (hasErrors) {
        skipped++;
        errors.push(`Row ${index + 2}: ${rowErrors.join(', ')}`);
      } else {
        imported++;
        if (preview.length < 5) {
          preview.push(lead);
        }
      }
    });

    return {
      success: imported > 0,
      imported,
      skipped,
      errors,
      preview,
    };
  },

  exportToCSV(leads: Lead[]): string {
    const csvData = leads.map(lead => ({
      Name: lead.name,
      Company: lead.company,
      Email: lead.email,
      Value: lead.value,
      Stage: lead.stage,
      Notes: lead.notes || '',
      'Created At': lead.createdAt,
    }));

    return Papa.unparse(csvData);
  },

  downloadCSV(csvContent: string, filename: string) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};

