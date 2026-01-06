import React, { useState, useEffect } from 'react';
import { Plus, X, Edit2, Trash2, List } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { savedListsService } from '../services/savedListsService';
import { SavedList } from '../types';

interface SavedListsProps {
  selectedLeadIds: string[];
  onListSelect: (leadIds: string[]) => void;
  currentListId: string | null;
  onCurrentListChange: (listId: string | null) => void;
}

export const SavedLists: React.FC<SavedListsProps> = ({
  selectedLeadIds,
  onListSelect,
  currentListId,
  onCurrentListChange,
}) => {
  const { user } = useAuth();
  const [lists, setLists] = useState<SavedList[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingList, setEditingList] = useState<SavedList | null>(null);
  const [listName, setListName] = useState('');

  useEffect(() => {
    if (user) {
      loadLists();
    }
  }, [user]);

  const loadLists = async () => {
    if (!user) return;
    const data = await savedListsService.fetchSavedLists(user.id);
    setLists(data);
  };

  const handleCreateList = async () => {
    if (!user || !listName.trim() || selectedLeadIds.length === 0) return;
    
    const created = await savedListsService.createSavedList(listName.trim(), selectedLeadIds, user.id);
    if (created) {
      setLists(prev => [created, ...prev]);
      setIsModalOpen(false);
      setListName('');
    }
  };

  const handleUpdateList = async () => {
    if (!user || !editingList || !listName.trim()) return;
    
    const updated = await savedListsService.updateSavedList(
      editingList.id,
      listName.trim(),
      selectedLeadIds,
      user.id
    );
    if (updated) {
      setLists(prev => prev.map(l => l.id === editingList.id ? updated : l));
      setIsModalOpen(false);
      setEditingList(null);
      setListName('');
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!user) return;
    if (!confirm('Are you sure you want to delete this list?')) return;
    
    const success = await savedListsService.deleteSavedList(listId, user.id);
    if (success) {
      setLists(prev => prev.filter(l => l.id !== listId));
      if (currentListId === listId) {
        onCurrentListChange(null);
        onListSelect([]);
      }
    }
  };

  const handleListClick = (list: SavedList) => {
    if (currentListId === list.id) {
      // Deselect if clicking the same list
      onCurrentListChange(null);
      onListSelect([]);
    } else {
      onCurrentListChange(list.id);
      onListSelect(list.leadIds); // Pass the list's lead IDs
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Saved Lists</h3>
        <button
          onClick={() => {
            if (selectedLeadIds.length === 0) {
              alert('Please select leads first');
              return;
            }
            setEditingList(null);
            setListName('');
            setIsModalOpen(true);
          }}
          className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-all"
          title="Save selected leads to a new list"
        >
          <Plus size={14} />
        </button>
      </div>

      {lists.length === 0 ? (
        <div className="text-center py-8 px-4 border border-dashed border-gray-200 rounded-lg">
          <List size={24} className="mx-auto mb-2 text-gray-300" />
          <p className="text-xs text-gray-400 mb-2">No saved lists yet</p>
          <p className="text-[10px] text-gray-400">Select leads and click + to create a list</p>
        </div>
      ) : (
        <div className="space-y-2">
          {lists.map(list => (
            <div
              key={list.id}
              className={`group flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                currentListId === list.id
                  ? 'bg-blue-50 border-blue-300'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleListClick(list)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{list.listName}</p>
                <p className="text-xs text-gray-500">{list.leadIds.length} leads</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingList(list);
                    setListName(list.listName);
                    setIsModalOpen(true);
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteList(list.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-lg border border-gray-200 p-6 shadow-xl relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setEditingList(null);
                setListName('');
              }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black transition-colors"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingList ? 'Edit List' : 'Create Saved List'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                  List Name
                </label>
                <input
                  type="text"
                  value={listName}
                  onChange={e => setListName(e.target.value)}
                  placeholder="e.g., Q1 Prospects"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black"
                  autoFocus
                />
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">
                  {selectedLeadIds.length} lead{selectedLeadIds.length !== 1 ? 's' : ''} selected
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingList(null);
                    setListName('');
                  }}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={editingList ? handleUpdateList : handleCreateList}
                  disabled={!listName.trim() || selectedLeadIds.length === 0}
                  className="flex-1 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingList ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

