import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, Wrench, ClipboardList, ShieldAlert } from 'lucide-react';
import { getAreaById } from '../lib/data';

interface Task {
  id: string;
  title: string;
  source: 'pre-clean' | 'post-clean' | 'damage';
  completed: boolean;
  completedBy?: string;
}

export default function HandoverPage() {
  const navigate = useNavigate();
  const areaId = sessionStorage.getItem('selectedArea') || 'macy-production';
  const area = getAreaById(areaId);
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Repair conveyor belt scrappers in ' + area?.name, source: 'damage', completed: false },
    { id: '2', title: 'Replace worn gasket on hopper unit', source: 'post-clean', completed: false },
    { id: '3', title: 'Clean icing residue from Manifold A', source: 'pre-clean', completed: true, completedBy: 'John D.' },
  ]);
  const [newTask, setNewTask] = useState('');
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [completerName, setCompleterName] = useState('');

  const openTasks = tasks.filter(t => !t.completed);
  const doneTasks = tasks.filter(t => t.completed);

  const completeTask = (id: string) => {
    if (!completerName.trim()) { alert('Enter your name'); return; }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true, completedBy: completerName } : t));
    setCompletingId(null);
    setCompleterName('');
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: Date.now().toString(), title: newTask, source: 'damage', completed: false }]);
    setNewTask('');
  };

  if (!area) return null;

  return (
    <div className="min-h-[100dvh] px-5 py-6 pb-24" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #162544 40%, #1d3566 100%)' }}>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/hub')} className="text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">Handover</h1>
          <p className="text-xs text-white/50">{area.name} &middot; Resolve open tasks</p>
        </div>
      </div>

      {/* Status Banner */}
      {openTasks.length === 0 ? (
        <div className="flex items-center gap-3 p-4 rounded-2xl mb-6 text-emerald-300"
          style={{ background: 'rgba(0,208,132,0.1)', border: '1px solid rgba(0,208,132,0.2)' }}>
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">All tasks resolved! Ready for verification.</span>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 rounded-2xl mb-6 text-orange-300"
          style={{ background: 'rgba(255,140,66,0.1)', border: '1px solid rgba(255,140,66,0.2)' }}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{openTasks.length} open task{openTasks.length > 1 ? 's' : ''} need{openTasks.length === 1 ? 's' : ''} resolution</span>
        </div>
      )}

      {/* Open Tasks */}
      {openTasks.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-semibold tracking-wider uppercase text-white/40 mb-3">Open Tasks</h2>
          <div className="space-y-3">
            {openTasks.map(task => (
              <div key={task.id} className="rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
                <div className="flex items-start gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${
                    task.source === 'damage' ? 'bg-red-500/15 text-red-300' :
                    task.source === 'pre-clean' ? 'bg-purple-500/15 text-purple-300' :
                    'bg-blue-500/15 text-blue-300'}`}>
                    {task.source === 'damage' ? <ShieldAlert className="w-3 h-3 inline mr-0.5" /> :
                     task.source === 'pre-clean' ? <ClipboardList className="w-3 h-3 inline mr-0.5" /> :
                     <Wrench className="w-3 h-3 inline mr-0.5" />}
                    {task.source}
                  </span>
                  <p className="text-white/80 text-sm flex-1">{task.title}</p>
                </div>
                {completingId === task.id ? (
                  <div className="mt-3 flex gap-2">
                    <input type="text" value={completerName} onChange={e => setCompleterName(e.target.value)}
                      placeholder="Your name" className="flex-1 px-3 py-2 rounded-xl text-xs text-white placeholder:text-white/30 outline-none"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)' }} />
                    <button onClick={() => completeTask(task.id)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
                      style={{ background: 'linear-gradient(135deg, #00d084, #00b894)' }}>Done</button>
                  </div>
                ) : (
                  <button onClick={() => setCompletingId(task.id)}
                    className="mt-3 w-full py-2.5 rounded-xl text-xs font-semibold text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/10 transition-colors">
                    Mark as Completed
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {doneTasks.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-semibold tracking-wider uppercase text-white/40 mb-3">Completed</h2>
          <div className="space-y-2">
            {doneTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl opacity-60"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-white/60 text-sm flex-1 line-through">{task.title}</span>
                <span className="text-[10px] text-white/30">by {task.completedBy}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Task */}
      <div className="rounded-2xl p-4"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h3 className="text-sm font-semibold text-white mb-2">Create New Handover Task</h3>
        <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)}
          placeholder="Describe the task..."
          className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder:text-white/30 outline-none mb-2"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)' }} />
        <button onClick={addTask}
          className="w-full py-2.5 rounded-xl text-xs font-semibold text-white/80 border border-white/15 hover:bg-white/5 transition-colors">
          + Add Task
        </button>
      </div>
    </div>
  );
}
