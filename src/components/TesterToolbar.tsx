import React, { useState } from 'react';
import { Wifi, WifiOff, Link2, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { tokens } from '../theme/tokens';
import { setSimulatedOffline } from '../hooks/useNetworkStatus';
import { setSimulateApiFailure, getSimulateApiFailure } from '../services/api';

interface TesterToolbarProps {
  isOffline: boolean;
  onOpenDeepLink: (url: string) => void;
  onClearStorage: () => void;
  favoritesCount: number;
}

export const TesterToolbar: React.FC<TesterToolbarProps> = ({
  isOffline,
  onOpenDeepLink,
  onClearStorage,
  favoritesCount,
}) => {
  const [deepLinkInput, setDeepLinkInput] = useState('shoplite://product/5');
  const [apiFailed, setApiFailed] = useState(getSimulateApiFailure());
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOffline = () => {
    setSimulatedOffline(!isOffline);
  };

  const handleToggleApiFailure = () => {
    const next = !apiFailed;
    setSimulateApiFailure(next);
    setApiFailed(next);
  };

  const handleDeepLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deepLinkInput.trim()) {
      onOpenDeepLink(deepLinkInput.trim());
    }
  };

  return (
    <div className="w-full bg-slate-900 text-slate-100 text-xs border-b border-slate-800 shrink-0">
      <div className="max-w-xl mx-auto px-3 py-2 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-200">ShopLite Assessment Demo Bar</span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
        >
          {isOpen ? 'Hide Assessment Tools ▲' : 'Show Assessment Scenarios ▼'}
        </button>
      </div>

      {isOpen && (
        <div className="max-w-xl mx-auto px-3 pb-3 pt-1 border-t border-slate-800 flex flex-col gap-2.5">
          {/* Deep link tester */}
          <form onSubmit={handleDeepLinkSubmit} className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
              <Link2 size={13} className="text-indigo-400" />
              <span>Deep Link:</span>
            </div>
            <input
              type="text"
              value={deepLinkInput}
              onChange={(e) => setDeepLinkInput(e.target.value)}
              placeholder="shoplite://product/5"
              className="flex-1 bg-slate-800 text-slate-100 px-2 py-1 rounded text-xs border border-slate-700 outline-none font-mono"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-2.5 py-1 rounded text-xs transition cursor-pointer"
            >
              Test Link
            </button>
          </form>

          {/* Quick Deep Link buttons */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>Quick links:</span>
            <button
              type="button"
              onClick={() => {
                setDeepLinkInput('shoplite://product/5');
                onOpenDeepLink('shoplite://product/5');
              }}
              className="underline text-indigo-300 hover:text-indigo-200 cursor-pointer"
            >
              shoplite://product/5
            </button>
            <span className="text-slate-600">|</span>
            <button
              type="button"
              onClick={() => {
                setDeepLinkInput('shoplite://product/1');
                onOpenDeepLink('shoplite://product/1');
              }}
              className="underline text-indigo-300 hover:text-indigo-200 cursor-pointer"
            >
              shoplite://product/1
            </button>
          </div>

          {/* Scenario quick actions */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {/* Airplane Mode Toggle */}
            <button
              type="button"
              onClick={handleToggleOffline}
              className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-xs font-semibold cursor-pointer transition ${
                isOffline
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Test offline banner & cached first page"
            >
              {isOffline ? <WifiOff size={13} /> : <Wifi size={13} />}
              <span>{isOffline ? 'Airplane Mode ON' : 'Turn On Airplane'}</span>
            </button>

            {/* API Failure Toggle */}
            <button
              type="button"
              onClick={handleToggleApiFailure}
              className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-xs font-semibold cursor-pointer transition ${
                apiFailed
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Test API error & retry recovery"
            >
              <AlertTriangle size={13} />
              <span>{apiFailed ? 'Simulate API: FAIL' : 'Simulate API Fail'}</span>
            </button>

            {/* Clear Storage */}
            <button
              type="button"
              onClick={onClearStorage}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1.5 rounded text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1"
              title="Clear cached favorites and offline cache"
            >
              <RefreshCw size={13} />
              <span>Reset Storage</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
