import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Plus, Check, X, Edit2, Trash2, Calendar, Flag, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { tasksService } from '../services/tasksService';
import { leadsService } from '../services/leadsService';
import { Task, TaskPriority, Lead } from '../types';

type TaskFilter = 'ALL' | 'HIGH' | 'TODAY' | 'COMPLETED';

export const Tasks: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskFilter>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      Promise.all([
        tasksService.fetchTasks(user.id),
        leadsService.fetchLeads(user.id)
      ]).then(([tasksData, leadsData]) => {
        setTasks(tasksData);
        setLeads(leadsData);
        setLoading(false);
      });
    }
  }, [user]);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'COMPLETED') return task.completed;
    if (filter === 'HIGH') return task.priority === TaskPriority.HIGH && !task.completed;
    if (filter === 'TODAY') {
      if (task.completed) return false;
      if (!task.dueDate) return false;
      const today = new Date().toISOString().split('T')[0];
      return task.dueDate === today;
    }
    return !task.completed;
  });

  const handleCreateTask = async (taskData: Partial<Task>) => {
    if (!user) return;
    const created = await tasksService.createTask({
      ...taskData,
      linkedLeadIds: selectedLeads,
    }, user.id);
    if (created) {
      setTasks(prev => [created, ...prev]);
      setIsModalOpen(false);
      setEditingTask(null);
      setSelectedLeads([]);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!user) return;
    const updated = await tasksService.updateTask(taskId, updates, user.id);
    if (updated) {
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
      setEditingTask(null);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    await handleUpdateTask(task.id, { completed: !task.completed });
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;
    const success = await tasksService.deleteTask(taskId, user.id);
    if (success) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'bg-red-100 border-red-300 text-red-700';
      case TaskPriority.MEDIUM:
        return 'bg-amber-100 border-amber-300 text-amber-700';
      case TaskPriority.LOW:
        return 'bg-blue-100 border-blue-300 text-blue-700';
    }
  };

  const getPriorityDot = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'bg-red-500';
      case TaskPriority.MEDIUM:
        return 'bg-amber-500';
      case TaskPriority.LOW:
        return 'bg-blue-400';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Tasks</h1>
          <p className="text-sm text-gray-500">Manage your tasks and stay organized.</p>
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setSelectedLeads([]);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-black to-gray-800 text-white text-sm font-medium hover:from-gray-800 hover:to-gray-700 transition-all shadow-md"
        >
          <Plus size={16} />
          New Task
        </button>
      </header>

      {/* Filters */}
      <div className="flex gap-2">
        {(['ALL', 'HIGH', 'TODAY', 'COMPLETED'] as TaskFilter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              filter === f
                ? 'bg-black text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f === 'ALL' ? 'All Tasks' : f === 'HIGH' ? 'High Priority' : f === 'TODAY' ? 'Due Today' : 'Completed'}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-gray-500">Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Check size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
          <p className="text-sm text-gray-500 mb-6">
            {filter === 'ALL' 
              ? "Create your first task to get started."
              : `No tasks match the "${filter}" filter.`}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition-all"
          >
            Create Task
          </button>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <GlassCard
              key={task.id}
              className={`p-5 hover:border-black/20 hover:shadow-lg transition-all group ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleToggleComplete(task)}
                  className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                >
                  {task.completed && <Check size={12} className="text-white" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3 className={`text-sm font-semibold text-gray-900 mb-1 ${
                        task.completed ? 'line-through text-gray-400' : ''
                      }`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-xs text-gray-500 mb-2">{task.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setSelectedLeads(task.linkedLeadIds);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-bold ${getPriorityColor(task.priority)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${getPriorityDot(task.priority)}`}></div>
                      {task.priority}
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar size={12} />
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    )}
                    {task.linkedLeadIds.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <LinkIcon size={12} />
                        {task.linkedLeadIds.length} lead{task.linkedLeadIds.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Task Modal */}
      {isModalOpen && (
        <TaskModal
          task={editingTask}
          leads={leads}
          selectedLeads={selectedLeads}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
            setSelectedLeads([]);
          }}
          onSave={editingTask ? (updates) => handleUpdateTask(editingTask.id, updates) : handleCreateTask}
          onSelectedLeadsChange={setSelectedLeads}
        />
      )}
    </div>
  );
};

interface TaskModalProps {
  task: Task | null;
  leads: Lead[];
  selectedLeads: string[];
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  onSelectedLeadsChange: (leadIds: string[]) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  leads,
  selectedLeads,
  onClose,
  onSave,
  onSelectedLeadsChange,
}) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate || '',
    priority: task?.priority || TaskPriority.MEDIUM,
    completed: task?.completed || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      linkedLeadIds: selectedLeads,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-lg border border-gray-200 p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors"
        >
          <X size={18} />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {task ? 'Edit Task' : 'Create Task'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Title</label>
            <input
              type="text"
              required
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm transition-all focus:border-black focus:ring-1 focus:ring-black"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
            <textarea
              rows={3}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm transition-all focus:border-black focus:ring-1 focus:ring-black"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Due Date</label>
              <input
                type="date"
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm transition-all focus:border-black focus:ring-1 focus:ring-black"
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Priority</label>
              <select
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm transition-all focus:border-black focus:ring-1 focus:ring-black"
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
              >
                <option value={TaskPriority.HIGH}>High</option>
                <option value={TaskPriority.MEDIUM}>Medium</option>
                <option value={TaskPriority.LOW}>Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Link to Leads</label>
            <div className="border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto">
              {leads.length === 0 ? (
                <p className="text-sm text-gray-400">No leads available</p>
              ) : (
                <div className="space-y-2">
                  {leads.map(lead => (
                    <label key={lead.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            onSelectedLeadsChange([...selectedLeads, lead.id]);
                          } else {
                            onSelectedLeadsChange(selectedLeads.filter(id => id !== lead.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                        <p className="text-xs text-gray-500">{lead.company}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

