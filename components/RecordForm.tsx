
import React, { useState, useEffect } from 'react';
import { TextileRecord } from '../types';
import { suggestRecordMetadata } from '../services/geminiService';

interface RecordFormProps {
  initialData?: TextileRecord | null;
  onSave: (record: Omit<TextileRecord, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  onCancel: () => void;
}

export const RecordForm: React.FC<RecordFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    doriDetail: '',
    warpinDetail: '',
    bheemDetail: '',
    deliveryDetail: '',
    entryDate: new Date().toISOString().split('T')[0], // Default to YYYY-MM-DD
  });

  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        doriDetail: initialData.doriDetail || '',
        warpinDetail: initialData.warpinDetail || '',
        bheemDetail: initialData.bheemDetail || '',
        deliveryDetail: initialData.deliveryDetail || '',
        entryDate: initialData.entryDate || new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData]);

  const handleAiSuggest = async () => {
    if (!aiInput) return;
    setIsAiLoading(true);
    const suggested = await suggestRecordMetadata(aiInput);
    if (suggested) {
      setFormData(prev => ({ ...prev, ...suggested }));
    }
    setIsAiLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-4">
        <label className="block text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
          <i className="fa-solid fa-wand-magic-sparkles"></i>
          Quick AI Fill (Notes from floor)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g. 1000m dori, bheem ready for dispatch tomorrow"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
          />
          <button
            type="button"
            onClick={handleAiSuggest}
            disabled={isAiLoading || !aiInput}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors shrink-0"
          >
            {isAiLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Extract'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Record For Date</label>
          <input
            required
            type="date"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm"
            value={formData.entryDate}
            onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Dori Detail</label>
          <input
            required
            type="text"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="..."
            value={formData.doriDetail}
            onChange={(e) => setFormData({ ...formData, doriDetail: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Warpin Detail</label>
          <input
            required
            type="text"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="..."
            value={formData.warpinDetail}
            onChange={(e) => setFormData({ ...formData, warpinDetail: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Bheem Detail</label>
          <input
            required
            type="text"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="..."
            value={formData.bheemDetail}
            onChange={(e) => setFormData({ ...formData, bheemDetail: e.target.value })}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Delivery & Remarks</label>
          <textarea
            required
            rows={3}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
            placeholder="Delivery details or general notes..."
            value={formData.deliveryDetail}
            onChange={(e) => setFormData({ ...formData, deliveryDetail: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          {initialData ? 'Update Ledger' : 'Commit Entry'}
        </button>
      </div>
    </form>
  );
};
