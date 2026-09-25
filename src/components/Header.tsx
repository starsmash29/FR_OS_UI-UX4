import React from 'react';
import { ViewMode } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onOpenSearch: () => void;
  cpu: number;
  ram: number;
  temp: number;
  notificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  onOpenSearch,
  cpu,
  ram,
  temp,
  notificationCount = 2,
}) => {
  return (
    <header className="fixed top-0 w-full z-40 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.65)] border-b border-outline-variant/30">
      <div className="h-14 w-full px-margin flex items-center justify-between gap-space-lg">
        {/* Left: Brand & Telemetry */}
        <div className="flex items-center gap-space-lg">
          <div className="flex items-center gap-space-sm cursor-pointer" onClick={() => onSelectView('traffic-shaping')}>
            <div className="h-8 w-auto flex items-center justify-center overflow-hidden rounded bg-surface-container-high px-1.5 border border-outline-variant/30">
              <img
                alt="FR_OS Logo"
                className="h-6 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1WPKRcOXkcZgtJ0SxofeSvq-4XjCZ3kYiWwzevdFqjei30cX5hu2FUKswPX-5iMepGKSoGk7Xf-jJHwM8P-nBZCEOZq2bJY3HR0X94n_tggpvGknSy8r__Xnb0uDTUE7-zTTSUz3VvqUbSEq5056hvwVCWnpuVj_613KyMY5wEpb1YaX4mnGrxqmxc17T9d7MIJ1sRh92OzwudOzbmlNkmz1UFok-yvGfCEMhR7c_gtZgOxN8lUCn_Uf-9o"
              />
            </div>
            <div className="flex items-baseline gap-space-xs">
              <span className="font-headline-md text-headline-md tracking-tight font-bold text-on-surface">
                FR<span className="text-primary">·</span>OS
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
                v4.8.2
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-surface-variant hidden sm:block"></div>

          {/* Node Online Status */}
          <div className="flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container text-secondary font-label-sm text-label-sm border border-outline-variant/20">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span>node-01.lab.internal</span>
            <span className="text-on-surface-variant font-normal">[Online]</span>
          </div>

          {/* Real-time Hardware Telemetry */}
          <div className="hidden xl:flex items-center gap-space-sm">
            <div className="flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant border border-outline-variant/20">
              <span className="text-outline">CPU</span>
              <span className="font-bold text-on-surface">{cpu}%</span>
            </div>
            <div className="flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant border border-outline-variant/20">
              <span className="text-outline">RAM</span>
              <span className="font-bold text-on-surface">{ram}%</span>
            </div>
            <div className="flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant border border-outline-variant/20">
              <span className="text-outline">TEMP</span>
              <span className="font-bold text-secondary">{temp}°C</span>
            </div>
          </div>
        </div>

        {/* Center: Top Navigation Links */}
        <nav className="hidden lg:flex items-center gap-space-xs font-headline-sm text-headline-sm">
          <button
            type="button"
            onClick={() => onSelectView('traffic-shaping')}
            className={`px-space-md py-space-xs rounded transition-all font-medium ${
              currentView === 'traffic-shaping'
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            Traffic Shaping
          </button>
          <button
            type="button"
            onClick={() => onSelectView('multi-wan')}
            className={`px-space-md py-space-xs rounded transition-all font-medium ${
              currentView === 'multi-wan'
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            Multi-WAN & FIB
          </button>
          <button
            type="button"
            onClick={() => onSelectView('live-log')}
            className={`px-space-md py-space-xs rounded transition-all font-medium ${
              currentView === 'live-log'
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            Diagnostics & Logs
          </button>
          <button
            type="button"
            onClick={() => onSelectView('git-rollback')}
            className={`px-space-md py-space-xs rounded transition-all font-medium ${
              currentView === 'git-rollback'
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            Git Rollback
          </button>
        </nav>

        {/* Right: Actions, Search, Notifications, Profile */}
        <div className="flex items-center gap-space-md">
          <button
            className="hidden sm:flex items-center gap-space-xs px-space-md py-space-xs rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-label-md transition-colors border border-outline-variant/30"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">security_update_good</span>
            <span>Engine Active</span>
          </button>

          {/* Quick Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-space-sm px-space-sm py-space-xs rounded bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm border border-outline-variant/30 cursor-pointer hover:bg-surface-container"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">search</span>
            <span className="hidden md:inline text-outline">Quick Search</span>
            <kbd className="hidden md:inline px-1 py-0.5 rounded bg-surface-container font-mono text-[9px] text-outline">⌘K</kbd>
          </button>

          {/* Notifications */}
          <div className="relative flex items-center justify-center">
            <button
              onClick={() => onSelectView('live-log')}
              className="relative p-space-xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
              type="button"
              title="System Alerts"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary-container ring-2 ring-surface-container-lowest"></span>
              )}
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-space-xs pl-space-xs">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-outline hover:text-on-surface cursor-pointer hidden sm:block">
              arrow_drop_down
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
