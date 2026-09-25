import React, { useState, useEffect } from 'react';
import { ActiveModal, ViewMode } from '../../types';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: ViewMode) => void;
  onOpenModal: (modal: ActiveModal) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectView,
  onOpenModal,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { label: 'Traffic Control & SQM (CAKE)', category: 'View', view: 'traffic-shaping' as ViewMode, icon: 'speed' },
    { label: 'Policy-Based Routing & Multi-WAN (FIB Dispatcher)', category: 'View', view: 'multi-wan' as ViewMode, icon: 'alt_route' },
    { label: 'Live System Log & XDP Kernel Console', category: 'View', view: 'live-log' as ViewMode, icon: 'terminal' },
    { label: 'Configuration Snapshots & Git Rollback', category: 'View', view: 'git-rollback' as ViewMode, icon: 'history_toggle_off' },
    { label: 'Run Bufferbloat Benchmark Probe (RFC 8290)', category: 'Diagnostic Tool', modal: 'bufferbloat-bench' as ActiveModal, icon: 'network_check' },
    { label: 'tc qdisc Raw Kernel Queue Inspector & Tree Topology', category: 'Diagnostic Tool', modal: 'tc-qdisc-inspector' as ActiveModal, icon: 'account_tree' },
    { label: 'FQ_CoDel Engine Tuning & Parameters', category: 'Diagnostic Tool', modal: 'fq-codel-tuning' as ActiveModal, icon: 'tune' },
    { label: 'HTB Bandwidth Tree & Class Hierarchy Configurator', category: 'Diagnostic Tool', modal: 'htb-configurator' as ActiveModal, icon: 'schema' },
    { label: 'Create Policy-Based Routing (PBR) Rule', category: 'Action', modal: 'create-pbr-rule' as ActiveModal, icon: 'add_circle' },
    { label: 'Multi-WAN Gateway Watchdog & Failover Settings', category: 'Action', modal: 'gateway-watchdog' as ActiveModal, icon: 'shield_with_heart' },
    { label: 'Configure Dynamic Routing Peer (BGP/OSPF)', category: 'Action', modal: 'bgp-peer-config' as ActiveModal, icon: 'router' },
    { label: 'Create Manual Configuration Git Snapshot', category: 'Action', modal: 'create-snapshot' as ActiveModal, icon: 'save' },
    { label: 'Test FIB Route Lookup Simulator', category: 'Action', modal: 'route-test' as ActiveModal, icon: 'play_circle' },
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-gutter bg-surface/80 backdrop-blur-md pointer-events-auto">
      <div className="relative w-full max-w-2xl bg-surface-container-low rounded-xl shadow-2xl overflow-hidden border border-outline-variant/40 flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-space-sm px-space-md py-space-sm bg-surface-container-lowest border-b border-outline-variant/30">
          <span className="material-symbols-outlined text-primary text-[20px]">search</span>
          <input
            autoFocus
            type="text"
            className="w-full bg-transparent font-body-md text-on-surface focus:outline-none placeholder:text-outline"
            placeholder="Quick Search or jump to tool... (e.g. CAKE, BGP, Watchdog, Diff)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="px-1.5 py-0.5 rounded bg-surface-container font-mono text-[10px] text-outline">ESC</kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-space-xs flex flex-col gap-1 font-body-sm">
          {filtered.length === 0 ? (
            <div className="p-space-md text-center text-outline">No tools or views match "{query}"</div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (item.view) onSelectView(item.view);
                  if (item.modal) onOpenModal(item.modal);
                  onClose();
                }}
                className="w-full px-space-md py-2.5 rounded-lg flex items-center justify-between text-left hover:bg-surface-container-high transition-colors group"
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-[18px] group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="text-on-surface font-medium">{item.label}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-container text-outline font-label-sm text-[10px]">
                  {item.category}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="p-space-xs bg-surface-container-lowest border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-outline px-space-md">
          <span>FR_OS Precision Search</span>
          <div className="flex items-center gap-space-xs">
            <span>Press</span>
            <kbd className="px-1 rounded bg-surface-container">Enter</kbd>
            <span>to execute</span>
          </div>
        </div>
      </div>
    </div>
  );
};
