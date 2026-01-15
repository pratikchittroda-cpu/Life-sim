import React, { useState } from 'react';
import { UserInput, SimulationStatus } from '../types';
import { BrainCircuit, Play, AlertTriangle } from 'lucide-react';

interface InputFormProps {
  onSimulate: (input: UserInput) => void;
  status: SimulationStatus;
}

const InputForm: React.FC<InputFormProps> = ({ onSimulate, status }) => {
  const [formData, setFormData] = useState<UserInput>({
    decision: '',
    currentAge: 25,
    currentStatus: '',
    riskTolerance: 'Medium',
    goals: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === SimulationStatus.LOADING) return;
    onSimulate(formData);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <BrainCircuit className="text-cyan-400 w-8 h-8" />
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Initialization Vector</h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest">Define Simulation Parameters</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div>
          <label className="block text-xs font-mono text-cyan-400 mb-1 uppercase">The Decision (Input Required)</label>
          <textarea
            name="decision"
            required
            value={formData.decision}
            onChange={handleChange}
            placeholder="e.g., Quit my stable job to start a bakery, Buy a house with 5% down, Move to a new country for love..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all h-24 resize-none placeholder-slate-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Current Age</label>
            <input
              type="number"
              name="currentAge"
              required
              min={16}
              max={99}
              value={formData.currentAge}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:border-cyan-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Risk Tolerance</label>
            <select
              name="riskTolerance"
              value={formData.riskTolerance}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:border-cyan-500 outline-none"
            >
              <option value="Low">Low (Safety First)</option>
              <option value="Medium">Medium (Calculated)</option>
              <option value="High">High (Aggressive)</option>
              <option value="Degen">Degen (All In)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Current Status / Context</label>
          <input
            type="text"
            name="currentStatus"
            value={formData.currentStatus}
            onChange={handleChange}
            placeholder="e.g., $10k savings, single, burn out..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:border-cyan-500 outline-none placeholder-slate-600"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Core Motivation / Goals</label>
          <input
            type="text"
            name="goals"
            value={formData.goals}
            onChange={handleChange}
            placeholder="e.g., Financial freedom, Peace of mind..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:border-cyan-500 outline-none placeholder-slate-600"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={status === SimulationStatus.LOADING}
            className={`w-full flex items-center justify-center gap-2 font-mono font-bold uppercase tracking-wider py-4 rounded-lg transition-all
              ${status === SimulationStatus.LOADING 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-cyan-900 hover:bg-cyan-800 text-cyan-100 border border-cyan-700 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]'
              }`}
          >
            {status === SimulationStatus.LOADING ? (
              <>Running Simulation...</>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Run Simulation
              </>
            )}
          </button>
        </div>
        
        {status === SimulationStatus.LOADING && (
           <div className="text-center text-xs text-slate-500 animate-pulse font-mono">
             Analyzing compounding effects... calculating regret probability...
           </div>
        )}
      </form>
    </div>
  );
};

export default InputForm;