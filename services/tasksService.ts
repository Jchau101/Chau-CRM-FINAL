import { supabase } from './supabaseClient';
import { Task, TaskPriority } from '../types';

const mapTaskFromDB = (row: any, linkedLeadIds: string[] = []): Task => ({
  id: row.id,
  title: row.title,
  description: row.description || '',
  dueDate: row.due_date ? new Date(row.due_date).toISOString().split('T')[0] : undefined,
  priority: row.priority as TaskPriority,
  completed: row.completed || false,
  linkedLeadIds,
  createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
});

const mapTaskToDB = (task: Partial<Task>, userId: string) => ({
  user_id: userId,
  title: task.title,
  description: task.description || null,
  due_date: task.dueDate || null,
  priority: task.priority || TaskPriority.MEDIUM,
  completed: task.completed || false,
});

export const tasksService = {
  async fetchTasks(userId: string): Promise<Task[]> {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }

    // Fetch linked leads for each task
    const tasksWithLeads = await Promise.all(
      (tasks || []).map(async (task) => {
        const { data: links } = await supabase
          .from('task_leads')
          .select('lead_id')
          .eq('task_id', task.id);

        const linkedLeadIds = (links || []).map(l => l.lead_id);
        return mapTaskFromDB(task, linkedLeadIds);
      })
    );

    return tasksWithLeads;
  },

  async createTask(task: Partial<Task>, userId: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .insert(mapTaskToDB(task, userId))
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return null;
    }

    // Link leads if provided
    if (task.linkedLeadIds && task.linkedLeadIds.length > 0) {
      await supabase
        .from('task_leads')
        .insert(
          task.linkedLeadIds.map(leadId => ({
            task_id: data.id,
            lead_id: leadId,
          }))
        );
    }

    return mapTaskFromDB(data, task.linkedLeadIds || []);
  },

  async updateTask(taskId: string, updates: Partial<Task>, userId: string): Promise<Task | null> {
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.completed !== undefined) updateData.completed = updates.completed;

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      return null;
    }

    // Update linked leads if provided
    if (updates.linkedLeadIds !== undefined) {
      // Delete existing links
      await supabase
        .from('task_leads')
        .delete()
        .eq('task_id', taskId);

      // Insert new links
      if (updates.linkedLeadIds.length > 0) {
        await supabase
          .from('task_leads')
          .insert(
            updates.linkedLeadIds.map(leadId => ({
              task_id: taskId,
              lead_id: leadId,
            }))
          );
      }
    }

    const { data: links } = await supabase
      .from('task_leads')
      .select('lead_id')
      .eq('task_id', taskId);

    const linkedLeadIds = (links || []).map(l => l.lead_id);
    return mapTaskFromDB(data, linkedLeadIds);
  },

  async deleteTask(taskId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting task:', error);
      return false;
    }

    return true;
  },
};

