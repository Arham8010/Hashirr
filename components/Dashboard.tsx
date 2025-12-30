
import React from 'react';
import { TextileRecord } from '../types';

interface DashboardProps {
  records: TextileRecord[];
}

export const Dashboard: React.FC<DashboardProps> = ({ records }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
          <i className="fa-solid fa-clipboard-list text-xl"></i>
        </div>
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase">Total Batches</p>
          <h4 className="text-2xl font-black text-slate-800">{records.length}</h4>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
          <i className="fa-solid fa-bolt text-xl"></i>
        </div>
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase">Active Stocks</p>
          <h4 className="text-2xl font-black text-slate-800">{records.length}</h4>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-100">
          <i className="fa-solid fa-clock-rotate-left text-xl"></i>
        </div>
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase">Recent Updates</p>
          <h4 className="text-2xl font-black text-slate-800">
            {records.length > 0 ? 'Today' : 'None'}
          </h4>
        </div>
      </div>
    </div>
  );
};
