import React from 'react';
import { ActiveModal, ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onOpenModal: (modal: ActiveModal) => void;
  throughput: string;
  packetRate: string;
  uptime: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onOpenModal,
  throughput,
  packetRate,
  uptime,
}) => {
  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 bg-surface-container-lowest z-30 flex flex-col justify-between py-space-md shadow-[2px_0_12px_rgba(0,0,0,0.45)] border-r border-outline-variant/30">
      <div className="flex flex-col gap-space-md px-space-md overflow-y-auto">
        {/* Active Engine Badge */}
        <div className="px-space-sm py-space-xs flex items-center justify-between text-outline font-label-sm text-label-sm uppercase tracking-wider bg-surface-container-low rounded border border-outline-variant/20">
          <span>Active Engine</span>
          <span className="text-secondary font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            L7 DPI / eBPF
          </span>
        </div>

        {/* Section 1: Network Stack */}
        <div className="flex flex-col gap-1">
          <div className="px-space-sm text-[10px] uppercase tracking-wider text-outline font-label-sm font-bold">
            Network Stack
          </div>
          <nav className="flex flex-col gap-space-xs">
            <button
              onClick={() => onSelectView('traffic-shaping')}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded font-headline-sm text-headline-sm text-left transition-all ${
                currentView === 'traffic-shaping'
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">speed</span>
              <span>Traffic Shaping</span>
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary"></span>
            </button>

            <button
              onClick={() => onSelectView('multi-wan')}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded font-headline-sm text-headline-sm text-left transition-all ${
                currentView === 'multi-wan'
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">alt_route</span>
              <span>Multi-WAN & FIB</span>
            </button>

            <button
              onClick={() => onOpenModal('gateway-watchdog')}
              className="flex items-center gap-space-sm px-space-md py-space-sm rounded font-headline-sm text-headline-sm text-left text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">shield_with_heart</span>
              <span>Gateway Watchdog</span>
            </button>

            <button
              onClick={() => onOpenModal('bgp-peer-config')}
              className="flex items-center gap-space-sm px-space-md py-space-sm rounded font-headline-sm text-headline-sm text-left text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">router</span>
              <span>Dynamic BGP / OSPF</span>
            </button>
          </nav>
        </div>

        {/* Section 2: Diagnostics & System Management */}
        <div className="flex flex-col gap-1 pt-space-xs border-t border-outline-variant/20">
          <div className="px-space-sm text-[10px] uppercase tracking-wider text-outline font-label-sm font-bold">
            Diagnostics & SysOps
          </div>
          <nav className="flex flex-col gap-space-xs">
            <button
              onClick={() => onSelectView('live-log')}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded font-headline-sm text-headline-sm text-left transition-all ${
                currentView === 'live-log'
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">terminal</span>
              <span>Live Log & XDP</span>
              <span className="ml-auto px-1.5 py-0.2 rounded bg-error-container text-error text-[10px] font-bold">3 Alert</span>
            </button>

            <button
              onClick={() => onSelectView('git-rollback')}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded font-headline-sm text-headline-sm text-left transition-all ${
                currentView === 'git-rollback'
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">history_toggle_off</span>
              <span>Git Rollback & Backup</span>
            </button>

            <button
              onClick={() => onOpenModal('bufferbloat-bench')}
              className="flex items-center gap-space-sm px-space-md py-space-sm rounded font-headline-sm text-headline-sm text-left text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">network_check</span>
              <span>Bufferbloat Tester</span>
            </button>

            <button
              onClick={() => onOpenModal('tc-qdisc-inspector')}
              className="flex items-center gap-space-sm px-space-md py-space-sm rounded font-headline-sm text-headline-sm text-left text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
            >
              <span className="material-symbols-outlined text-[18px] text-tertiary">data_object</span>
              <span>tc qdisc Tree Inspector</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom Telemetry & Uptime Card */}
      <div className="px-space-md flex flex-col gap-space-sm pt-space-xs border-t border-outline-variant/30">
        <div className="p-space-sm rounded bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/20">
          <div className="flex items-center justify-between text-outline font-label-sm text-label-sm">
            <span>Throughput</span>
            <span className="text-primary font-bold">{throughput}</span>
          </div>
          <div className="w-full h-1 rounded bg-surface-container-highest overflow-hidden">
            <div className="h-full bg-primary rounded" style={{ width: '68%' }}></div>
          </div>
          <div className="flex items-center justify-between text-outline font-label-sm text-label-sm">
            <span>Packets/s</span>
            <span className="text-on-surface">{packetRate}</span>
          </div>
        </div>

        <div className="px-space-sm py-space-xs rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center justify-between border border-outline-variant/20">
          <span className="text-outline">Uptime</span>
          <span className="text-on-surface font-bold">{uptime}</span>
        </div>

        <div className="px-space-sm py-0.5 text-center text-outline text-[10px] font-mono">
          CORE L3 <span className="text-secondary font-bold">v4.18.2-rt</span>
        </div>
      </div>
    </aside>
  );
};
