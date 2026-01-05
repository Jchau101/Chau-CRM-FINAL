
import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { User, Bell, Shield, Palette, Globe } from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { id: 'security', label: 'Security', icon: <Shield size={16} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={16} /> },
    { id: 'integrations', label: 'Integrations', icon: <Globe size={16} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="border-b border-gray-100 pb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-2">Manage your workspace and personal account details.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-56 space-y-0.5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-attio text-sm transition-all duration-150 ${
                activeTab === tab.id 
                  ? 'bg-gray-100 text-black font-semibold' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <span className="opacity-70">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </aside>

        <main className="flex-1">
          <GlassCard className="space-y-10 border-none p-0">
            <section className="space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                <img src="https://picsum.photos/seed/user/128" className="w-16 h-16 rounded-sm border border-gray-200" />
                <div className="space-y-2">
                  <button className="px-3 py-1.5 rounded-attio bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800">Upload Photo</button>
                  <button className="block text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest ml-1">Delete</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                  <input type="text" defaultValue="Alex Rivers" className="w-full bg-white border border-gray-200 rounded-attio px-3 py-2 text-sm focus:border-black transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                  <input type="email" defaultValue="alex@rivers.design" className="w-full bg-white border border-gray-200 rounded-attio px-3 py-2 text-sm focus:border-black transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Workspace Description</label>
                <textarea rows={4} className="w-full bg-white border border-gray-200 rounded-attio px-3 py-2 text-sm focus:border-black transition-all" defaultValue="Design studio specializing in early-stage fintech products." />
              </div>
            </section>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button className="px-6 py-2 rounded-attio bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all">
                Update Profile
              </button>
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  );
};
