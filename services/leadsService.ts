import { supabase } from './supabaseClient';
import { Lead, PipelineStage } from '../types';

// Helper to validate stage
const isValidStage = (stage: any): stage is PipelineStage => {
  return Object.values(PipelineStage).includes(stage);
};

// Convert Supabase lead row to our Lead type
const mapLeadFromDB = (row: any): Lead => ({
  id: row.id,
  name: row.name,
  company: row.company || '',
  email: row.email || '',
  value: Number(row.value) || 0,
  stage: row.stage as PipelineStage,
  notes: row.notes || '',
  createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  aiScore: row.ai_score || undefined,
  // Note: ai_summary column doesn't exist in schema yet, so we'll skip it for now
  // aiSummary: row.ai_summary || undefined,
});

// Convert our Lead type to Supabase row format
const mapLeadToDB = (lead: Partial<Lead>, userId: string) => ({
  user_id: userId,
  name: lead.name,
  company: lead.company || null,
  email: lead.email || null,
  value: lead.value || 0,
  stage: lead.stage || PipelineStage.CONTACTER,
  notes: lead.notes || null,
  ai_score: lead.aiScore || null,
});

export const leadsService = {
  // Fetch all leads for the current user (excluding deleted)
  async fetchLeads(userId: string): Promise<Lead[]> {
    let query = supabase
      .from('leads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Try to filter by is_deleted if column exists, otherwise get all
    const { data, error } = await query;

    if (error) {
      // If error is about is_deleted column, try without it
      if (error.message?.includes('is_deleted')) {
        const { data: retryData, error: retryError } = await supabase
          .from('leads')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (retryError) {
          console.error('Error fetching leads:', retryError);
          return [];
        }
        return (retryData || []).map(mapLeadFromDB);
      }
      console.error('Error fetching leads:', error);
      return [];
    }

    // Filter out deleted leads in memory if column exists
    const leads = (data || []).filter(lead => lead.is_deleted !== true);
    return leads.map(mapLeadFromDB);
  },

  // Create a new lead
  async createLead(lead: Partial<Lead>, userId: string): Promise<Lead | null> {
    // Validate and set default stage
    let stage = lead.stage;
    if (!stage || !isValidStage(stage)) {
      stage = PipelineStage.CONTACTER;
    }
    
    // Ensure stage is a string (not enum object)
    const stageValue = typeof stage === 'string' ? stage : String(stage);
    
    const leadData: any = {
      user_id: userId,
      name: lead.name || '',
      company: lead.company || null,
      email: lead.email || null,
      value: lead.value || 0,
      notes: lead.notes || null,
      ai_score: lead.aiScore || null,
    };
    
    // Only include stage if we're sure it's valid, otherwise let DB default handle it
    if (isValidStage(stageValue)) {
      leadData.stage = stageValue;
    }
    
    console.log('Creating lead with data:', leadData);
    
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert(leadData)
        .select()
        .single();

      if (error) {
        console.error('Error creating lead:', error);
        console.error('Lead data attempted:', leadData);
        
        // If error is about stage column, try without it (let DB default handle it)
        if (error.message.includes('stage') || error.message.includes('schema cache')) {
          console.log('Retrying without stage column, using DB default...');
          delete leadData.stage;
          
          const { data: retryData, error: retryError } = await supabase
            .from('leads')
            .insert(leadData)
            .select()
            .single();
            
          if (retryError) {
            console.error('Retry also failed:', retryError);
            alert(`Failed to create lead: ${retryError.message}. Please run the SQL fix script in Supabase.`);
            return null;
          }
          
          console.log('Lead created successfully (without explicit stage):', retryData);
          return mapLeadFromDB(retryData);
        }
        
        // Show user-friendly error
        alert(`Failed to create lead: ${error.message}. Check the browser console for details.`);
        return null;
      }

      console.log('Lead created successfully:', data);
      return mapLeadFromDB(data);
    } catch (err: any) {
      console.error('Unexpected error creating lead:', err);
      alert(`Failed to create lead: ${err.message || 'Unknown error'}`);
      return null;
    }
  },

  // Update an existing lead
  async updateLead(leadId: string, updates: Partial<Lead>, userId: string): Promise<Lead | null> {
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.company !== undefined) updateData.company = updates.company;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.value !== undefined) updateData.value = updates.value;
    if (updates.stage !== undefined) updateData.stage = updates.stage;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.aiScore !== undefined) updateData.ai_score = updates.aiScore;

    const { data, error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', leadId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating lead:', error);
      return null;
    }

    return mapLeadFromDB(data);
  },

  // Delete a lead (soft delete or hard delete if column doesn't exist)
  async deleteLead(leadId: string, userId: string): Promise<boolean> {
    // First try soft delete
    const { error: softDeleteError } = await supabase
      .from('leads')
      .update({ is_deleted: true })
      .eq('id', leadId)
      .eq('user_id', userId);

    // If soft delete fails (column might not exist), try hard delete
    if (softDeleteError) {
      console.warn('Soft delete failed, trying hard delete:', softDeleteError);
      const { error: hardDeleteError } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId)
        .eq('user_id', userId);

      if (hardDeleteError) {
        console.error('Error deleting lead:', hardDeleteError);
        return false;
      }
    }

    return true;
  },

  // Restore a deleted lead (only works if soft delete was used)
  async restoreLead(leadId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('leads')
      .update({ is_deleted: false })
      .eq('id', leadId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error restoring lead (may have been hard deleted):', error);
      return false;
    }

    return true;
  },

  // Get dashboard stats (excluding deleted leads)
  async getDashboardStats(userId: string) {
    let query = supabase
      .from('leads')
      .select('stage, value, is_deleted')
      .eq('user_id', userId);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching stats:', error);
      return {
        totalLeads: 0,
        wonDeals: 0,
        pipelineValue: 0,
        conversionRate: 0,
      };
    }

    // Filter out deleted leads in memory
    const leads = (data || []).filter(l => l.is_deleted !== true);
    const totalLeads = leads.length;
    const wonDeals = leads.filter(l => l.stage === PipelineStage.CLOSED).length;
    const pipelineValue = leads.reduce((sum, l) => sum + (Number(l.value) || 0), 0);
    const conversionRate = totalLeads > 0 ? (wonDeals / totalLeads) * 100 : 0;

    return {
      totalLeads,
      wonDeals,
      pipelineValue,
      conversionRate: Math.round(conversionRate * 10) / 10,
    };
  },
};

