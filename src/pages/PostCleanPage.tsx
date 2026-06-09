import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Check, X, Minus, Trash2, AlertTriangle } from 'lucide-react';
import { getAreaById, getItemsForArea } from '../lib/data';
import { uploadPhoto } from '../lib/supabase';

type Response = 'acceptable' | 'not_acceptable' | 'na' | null;

interface ItemResponse {
  response: Response;
  photoUrl: string | null;
  notes: string;
}

export default function PostCleanPage() {
  const navigate = useNavigate();
  const areaId = sessionStorage.getItem('selectedArea') || 'macy-production';
  const area = getAreaById(areaId);
  const items = getItemsForArea(areaId, 'post_cleaning');

  const [employeeName, setEmployeeName] = useState('');
  const [goodBags, setGoodBags] = useState('');
  const [badBags, setBadBags] = useState('');
  const [responses, setResponses] = useState<Record<string, ItemResponse>>({});
  const [currentItem, setCurrentItem] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [damageModal, setDamageModal] = useState(false);
  const [damageDesc, setDamageDesc] = useState('');
  const [damageSeverity, setDamageSeverity] = useState<'low' | 'medium' | 'high'>('medium');

  const progress = items.length > 0 ? Math.round((Object.keys(responses).filter(k => responses[k].response).length / items.length) * 100) : 0;

  const setResponse = (itemId: string, response: Response) => {
    setResponses(prev => ({ ...prev, [itemId]: { ...prev[itemId], response } }));
    if (currentItem < items.length - 1) setTimeout(() => setCurrentItem(prev => prev + 1), 300);
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadPhoto(file);
      setResponses(prev => ({ ...prev, [itemId]: { ...prev[itemId], photoUrl: url } }));
    } catch {
      const localUrl = URL.createObjectURL(file);
      setResponses(prev => ({ ...prev, [itemId]: { ...prev[itemId], photoUrl: localUrl } }));
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!employeeName.trim()) { alert('Please enter employee name'); return; }
    const unanswered = items.filter(i => !responses[i.id]?.response);
    if (unanswered.length > 0) { alert(`Please complete all ${unanswered.length} remaining items`); return; }

    setSubmitting(true);
    sessionStorage.setItem(`postClean_${areaId}`, JSON.stringify({
      employeeName, goodBags, badBags, responses, completedAt: new Date().toISOString()
    }));
    await new Promise(r => setTimeout(r, 500));
    setSubmitting(false);
    alert('Post-Cleaning submitted successfully!');
    navigate('/hub');
  }, [employeeName, goodBags, badBags, responses, items, areaId, navigate]);

  if (!area) return null;

  return (
    <div className="min-h-screen px-5 py-6 pb-44" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #162544 40%, #1d3566 100%)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate('/hub')} className="text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">Post-Cleaning</h1>
          <p className="text-xs text-white/50">{area.name} &middot; {items.length} items</p>
        </div>
        <button onClick={() => setDamageModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-300"
          style={{ background: 'rgba(255,71,87,0.15)', border: '1px solid rgba(255,71,87,0.25)' }}>
          <AlertTriangle className="w-3.5 h-3.5" /> Damage
        </button>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #4facfe, #00d084)' }} />
        </div>
        <p className="text-right text-[10px] text-white/40 mt-1">{progress}% complete</p>
      </div>

      {/* Employee + Bag Counts */}
      <div className="mb-5 space-y-3">
        <div>
          <label className="text-xs font-medium text-white/60 mb-1.5 block">Employee Name *</label>
          <input type="text" value={employeeName} onChange={e => setEmployeeName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/30 outline-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)' }} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-white/60 mb-1.5 block">Good Bags</label>
            <input type="number" value={goodBags} onChange={e => setGoodBags(e.target.value)}
              placeholder="0" className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/30 outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)' }} />
          </div>
          <div>
            <label className="text-xs font-medium text-white/60 mb-1.5 block">Bad Bags</label>
            <input type="number" value={badBags} onChange={e => setBadBags(e.target.value)}
              placeholder="0" className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/30 outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)' }} />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4">
        {items.map((item, idx) => {
          const resp = responses[item.id];
          const isActive = idx === currentItem;
          return (
            <div key={item.id} className="rounded-2xl p-4 transition-all duration-300"
              style={{
                background: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                border: isActive ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
                opacity: idx < currentItem ? 0.7 : 1,
              }}
              onClick={() => setCurrentItem(idx)}>
              <div className="flex items-start gap-3 mb-3">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: resp?.response ? 'linear-gradient(135deg, #00d084, #00b894)' : 'rgba(255,255,255,0.1)', color: 'white' }}>
                  {resp?.response ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </span>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-sm leading-snug">{item.title}</h3>
                  <p className="text-white/50 text-xs mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>

              {resp?.photoUrl ? (
                <div className="relative mb-3 rounded-xl overflow-hidden">
                  <img src={resp.photoUrl} alt="Evidence" className="w-full h-40 object-cover rounded-xl" />
                  <button onClick={() => setResponses(p => ({ ...p, [item.id]: { ...p[item.id], photoUrl: null } }))}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500/80 rounded-full flex items-center justify-center text-white">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 w-full py-3 mb-3 rounded-xl border-2 border-dashed border-white/15 text-white/40 text-xs cursor-pointer hover:border-white/30 hover:text-white/60 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <Camera className="w-4 h-4" /> Tap to add photo evidence
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handlePhoto(e, item.id)} />
                </label>
              )}

              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setResponse(item.id, 'acceptable')}
                  className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${resp?.response === 'acceptable' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'}`}>
                  <Check className="w-3.5 h-3.5 inline mr-1" />Acceptable
                </button>
                <button onClick={() => setResponse(item.id, 'not_acceptable')}
                  className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${resp?.response === 'not_acceptable' ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'}`}>
                  <X className="w-3.5 h-3.5 inline mr-1" />Not OK
                </button>
                <button onClick={() => setResponse(item.id, 'na')}
                  className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${resp?.response === 'na' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'}`}>
                  <Minus className="w-3.5 h-3.5 inline mr-1" />N/A
                </button>
              </div>

              {resp?.response === 'not_acceptable' && (
                <textarea placeholder="Describe the issue..." value={resp.notes || ''}
                  onChange={e => setResponses(p => ({ ...p, [item.id]: { ...p[item.id], notes: e.target.value } }))}
                  className="w-full mt-2 px-3 py-2 rounded-xl text-xs text-white placeholder:text-white/30 outline-none resize-none h-16"
                  style={{ background: 'rgba(255,71,87,0.08)', border: '1px solid rgba(255,71,87,0.2)' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Damage Modal */}
      {damageModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-md rounded-t-3xl p-6 animate-in slide-in-from-bottom"
            style={{ background: 'linear-gradient(180deg, #1e3a5f 0%, #0f2240 100%)', border: '1px solid rgba(255,255,255,0.1)', borderBottom: 'none' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Report Damage</h3>
              <button onClick={() => setDamageModal(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">&#10005;</button>
            </div>
            <textarea placeholder="Describe the damage found..." value={damageDesc}
              onChange={e => setDamageDesc(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/30 outline-none resize-none h-24 mb-3"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.15)' }} />
            <label className="text-xs text-white/50 mb-1.5 block">Severity</label>
            <select value={damageSeverity} onChange={e => setDamageSeverity(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none mb-4"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.15)' }}>
              <option value="low" className="text-black">Low - Minor issue</option>
              <option value="medium" className="text-black">Medium - Needs attention</option>
              <option value="high" className="text-black">High - Critical repair needed</option>
            </select>
            <button onClick={() => { setDamageModal(false); setDamageDesc(''); alert('Damage reported!'); }}
              className="w-full py-3.5 rounded-xl font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #ff4757, #e03131)' }}>
              Submit Damage Report
            </button>
          </div>
        </div>
      )}

      {/* Spacer for fixed button */}
      <div className="h-24" />

      {/* Submit */}
      <div className="fixed bottom-0 left-0 right-0 p-4 max-w-lg mx-auto z-50" style={{ background: 'linear-gradient(to top, #0a1628 30%, transparent)' }}>
        <button onClick={handleSubmit} disabled={submitting}
          className="w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #4facfe, #3d8bfe)', boxShadow: '0 8px 32px rgba(79,172,254,0.3)' }}>
          {submitting ? 'Submitting...' : `Submit Post-Cleaning (${progress}%)`}
        </button>
      </div>
    </div>
  );
}
