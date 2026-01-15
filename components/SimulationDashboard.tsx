import React from 'react';
import { SimulationResult } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { AlertOctagon, TrendingUp, Skull, Scale, Zap, Eye, RefreshCw, AlertTriangle } from 'lucide-react';

interface SimulationDashboardProps {
  result: SimulationResult;
  onReset: () => void;
}

const SimulationDashboard: React.FC<SimulationDashboardProps> = ({ result, onReset }) => {
  return (
    <div className="w-full animate-fade-in space-y-8 pb-12">
      
      {/* Header / Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Simulation Complete</h1>
          <p className="text-slate-400 text-sm mt-1">Based on provided vectors and historical probabilities.</p>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 rounded transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          New Simulation
        </button>
      </div>

      {/* Assumptions Banner */}
      <div className="bg-slate-900/50 border-l-4 border-cyan-500 p-4 rounded-r-lg">
        <h3 className="text-xs font-mono uppercase text-cyan-400 mb-2 flex items-center gap-2">
          <Eye className="w-3 h-3" /> System Assumptions
        </h3>
        <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside opacity-80">
          {result.assumptions.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </div>

      {/* Trajectory Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="text-cyan-400" /> Projected Trajectory
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={result.timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" tickFormatter={(val) => `Year ${val}`} />
              <YAxis stroke="#64748b" domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" dataKey="financialStability" name="Financial Health" stroke="#22d3ee" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="mentalHealth" name="Mental Health" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="regretProbability" name="Regret Probability" stroke="#f43f5e" strokeWidth={2} />
              <Line type="monotone" dataKey="relationships" name="Relationships" stroke="#a78bfa" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Timeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {result.timeline.map((point) => (
          <div key={point.year} className="bg-slate-900 border border-slate-800 p-5 rounded-lg flex flex-col hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/30 px-2 py-1 rounded">YEAR {point.year}</span>
              <span className="text-xs text-slate-500 uppercase">{point.label}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4 flex-grow">
              {point.narrative}
            </p>
            <div className="pt-4 border-t border-slate-800 mt-auto">
              <p className="text-xs font-bold text-rose-400 mb-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Hidden Risks
              </p>
              <ul className="text-xs text-slate-400 space-y-1">
                {point.hiddenRisks.map((risk, i) => (
                  <li key={i}>• {risk}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Brutal Truths & Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Brutal Truths */}
        <div className="md:col-span-1 bg-red-950/10 border border-red-900/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-rose-500 mb-4 flex items-center gap-2">
            <Skull className="w-5 h-5" /> Brutal Truths
          </h3>
          <ul className="space-y-3">
            {result.brutalTruths.map((truth, i) => (
              <li key={i} className="text-sm text-rose-200/80 leading-relaxed border-l-2 border-rose-800 pl-3">
                {truth}
              </li>
            ))}
          </ul>
        </div>

        {/* Scenarios */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
              <h4 className="text-xs font-mono uppercase text-emerald-400 mb-2">Best Case Scenario</h4>
              <p className="text-sm text-slate-300">{result.bestCase}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
              <h4 className="text-xs font-mono uppercase text-rose-400 mb-2">Worst Case Scenario</h4>
              <p className="text-sm text-slate-300">{result.worstCase}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
             <h4 className="text-xs font-mono uppercase text-purple-400 mb-2 flex items-center gap-2">
               <Scale className="w-3 h-3" /> Key Decision Forks
             </h4>
             <div className="space-y-3">
               {result.keyForks.map((fork, i) => (
                 <div key={i} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0"></div>
                    <div>
                      <span className="text-sm font-semibold text-slate-200">{fork.decisionPoint}</span>
                      <p className="text-xs text-slate-400">{fork.implication}</p>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-950/30 to-slate-900 border border-cyan-900/30 rounded-lg p-5">
            <h4 className="text-xs font-mono uppercase text-cyan-400 mb-2 flex items-center gap-2">
              <Zap className="w-3 h-3" /> Alternative Strategy
            </h4>
            <p className="text-sm text-slate-200 italic">"{result.alternativeStrategy}"</p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default SimulationDashboard;