import React, { useState } from 'react';
import InputForm from './components/InputForm';
import SimulationDashboard from './components/SimulationDashboard';
import { UserInput, SimulationResult, SimulationStatus } from './types';
import { runSimulation } from './services/geminiService';
import { Activity } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<SimulationStatus>(SimulationStatus.IDLE);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async (input: UserInput) => {
    setStatus(SimulationStatus.LOADING);
    setError(null);
    try {
      const data = await runSimulation(input);
      setResult(data);
      setStatus(SimulationStatus.COMPLETE);
    } catch (err) {
      setError("Simulation Engine Failure. The future is currently indecipherable. Try again.");
      setStatus(SimulationStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(SimulationStatus.IDLE);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30">
      <nav className="border-b border-slate-900 bg-slate-950/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-900 rounded flex items-center justify-center">
               <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="font-bold tracking-tight text-lg text-white">Life<span className="text-cyan-400">Sim</span></span>
          </div>
          <div className="text-xs font-mono text-slate-500 hidden sm:block">
            v1.0.4 // QUANTUM_HORIZON
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {status === SimulationStatus.IDLE || status === SimulationStatus.LOADING ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fade-in">
            <div className="text-center space-y-4 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                Forecast Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Fate</span>
              </h1>
              <p className="text-slate-400 text-lg">
                Input your life decision. We simulate the next 10 years using behavioral economics and risk analysis. 
                <br /><span className="text-rose-400/80 text-sm">Warning: Results may be harsh.</span>
              </p>
            </div>
            <InputForm onSimulate={handleSimulate} status={status} />
            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-200 px-4 py-3 rounded mt-4">
                {error}
              </div>
            )}
          </div>
        ) : (
          result && <SimulationDashboard result={result} onReset={handleReset} />
        )}
      </main>

      <footer className="border-t border-slate-900 mt-auto py-8 text-center">
        <p className="text-slate-600 text-xs font-mono">
          DISCLAIMER: This is a simulation based on LLM probabilistic generation. Not financial, medical, or legal advice. 
          Use at your own risk.
        </p>
      </footer>
    </div>
  );
};

export default App;