
import React from 'react';
import { TextileRecord } from '../types';

interface RecordRowProps {
  record: TextileRecord;
  currentUserId: string;
  onEdit: (record: TextileRecord) => void;
  onDelete: (id: string) => void;
}

export const RecordRow: React.FC<RecordRowProps> = ({ record, currentUserId, onEdit, onDelete }) => {
  const isOwner = record.createdBy === currentUserId;

  return (
    <tr className="hover:bg-slate-50/80 transition-all group">
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg ${isOwner ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'} flex items-center justify-center text-[10px] border border-transparent group-hover:border-current/20 transition-all`}>
            <i className="fa-solid fa-barcode"></i>
          </div>
          <span className="font-black text-slate-800 tracking-tighter text-sm uppercase">#{record.id.slice(0, 4)}</span>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="text-sm text-slate-700 font-semibold">{record.doriDetail}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">Specifications</span>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="text-sm text-slate-700 font-medium">{record.warpinDetail}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">Current Progress</span>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="text-sm text-slate-700 font-medium">{record.bheemDetail}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">Unit Status</span>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-start gap-3 max-w-sm">
          <div className="mt-1 p-1 bg-amber-50 rounded text-amber-600">
            <i className="fa-solid fa-truck-fast text-[10px]"></i>
          </div>
          <div>
            <span className="text-slate-600 text-xs italic leading-tight block">{record.deliveryDetail}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">Dispatch Target</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-5 text-right whitespace-nowrap">
        {isOwner ? (
          <div className="flex items-center justify-end gap-1.5 opacity-20 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-2">
            <button 
              onClick={() => onEdit(record)}
              className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90"
              title="Edit Ledger Entry"
            >
              <i className="fa-solid fa-pen-to-square text-xs"></i>
            </button>
            <button 
              onClick={() => onDelete(record.id)}
              className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
              title="Delete Log"
            >
              <i className="fa-solid fa-trash-can text-xs"></i>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-end gap-1 px-2">
             <div className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                {record.createdBy.slice(-6)}
             </div>
             <div className="flex items-center gap-1 text-slate-300">
                <i className="fa-solid fa-lock text-[8px]"></i>
                <span className="text-[8px] font-bold uppercase">View Only</span>
             </div>
          </div>
        )}
      </td>
    </tr>
  );
};
