import { supabase } from './supabaseClient';
import { SavedList } from '../types';

const mapSavedListFromDB = (row: any, leadIds: string[] = []): SavedList => ({
  id: row.id,
  listName: row.list_name,
  leadIds,
  createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
});

export const savedListsService = {
  async fetchSavedLists(userId: string): Promise<SavedList[]> {
    const { data: lists, error } = await supabase
      .from('saved_lists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved lists:', error);
      return [];
    }

    // Fetch leads for each list
    const listsWithLeads = await Promise.all(
      (lists || []).map(async (list) => {
        const { data: links } = await supabase
          .from('saved_list_leads')
          .select('lead_id')
          .eq('list_id', list.id);

        const leadIds = (links || []).map(l => l.lead_id);
        return mapSavedListFromDB(list, leadIds);
      })
    );

    return listsWithLeads;
  },

  async createSavedList(listName: string, leadIds: string[], userId: string): Promise<SavedList | null> {
    const { data, error } = await supabase
      .from('saved_lists')
      .insert({
        user_id: userId,
        list_name: listName,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating saved list:', error);
      return null;
    }

    // Link leads
    if (leadIds.length > 0) {
      await supabase
        .from('saved_list_leads')
        .insert(
          leadIds.map(leadId => ({
            list_id: data.id,
            lead_id: leadId,
          }))
        );
    }

    return mapSavedListFromDB(data, leadIds);
  },

  async updateSavedList(listId: string, listName: string, leadIds: string[], userId: string): Promise<SavedList | null> {
    const { data, error } = await supabase
      .from('saved_lists')
      .update({ list_name: listName })
      .eq('id', listId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating saved list:', error);
      return null;
    }

    // Update linked leads
    await supabase
      .from('saved_list_leads')
      .delete()
      .eq('list_id', listId);

    if (leadIds.length > 0) {
      await supabase
        .from('saved_list_leads')
        .insert(
          leadIds.map(leadId => ({
            list_id: listId,
            lead_id: leadId,
          }))
        );
    }

    return mapSavedListFromDB(data, leadIds);
  },

  async deleteSavedList(listId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('saved_lists')
      .delete()
      .eq('id', listId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting saved list:', error);
      return false;
    }

    return true;
  },
};

