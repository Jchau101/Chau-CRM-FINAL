
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../constants';
import { ChevronDown, Search } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-[#e5e5e5] flex flex-col z-40">
      <div className="p-4 mb-4">
        <div className="flex items-center gap-3 px-2 py-1.5 hover:bg-gray-50 rounded-attio cursor-pointer transition-colors border border-transparent hover:border-gray-200">
          <div className="chau-logo shadow-sm"></div>
          <span className="text-sm font-bold tracking-tight text-gray-900">Chau</span>
          <ChevronDown size={14} className="ml-auto text-gray-400" />
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600 transition-colors" size={14} />
          <input 
            type="text" 
            placeholder="Search... (⌘K)" 
            className="w-full bg-[#f9f9f9] border border-transparent hover:border-gray-200 py-1.5 pl-8 pr-3 text-xs rounded-attio focus:bg-white focus:border-black transition-all"
          />
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        <p className="px-3 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Workspace</p>
        {NAVIGATION_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-1.5 rounded-attio text-sm transition-all duration-150 ${
                isActive 
                  ? 'bg-gray-100 text-black font-semibold' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-black'
              }`
            }
          >
            <span className="opacity-80">
              {React.cloneElement(item.icon as React.ReactElement, { size: 16 })}
            </span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4 border-t border-[#e5e5e5]">
        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-attio transition-colors cursor-pointer group">
          <div className="w-8 h-8 rounded-sm bg-gray-100 border border-gray-200 overflow-hidden">
            <img src="https://picsum.photos/seed/user/100" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-gray-900 truncate">Alex Rivers</p>
            <p className="text-[10px] text-gray-500">Chau Pro</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
