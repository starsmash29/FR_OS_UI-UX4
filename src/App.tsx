import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ActiveModal, GitSnapshot, LogEntry, PbrRule, SystemTelemetry, ViewMode } from './types';
import { 
  initialLogs, 
  initialPbrRules, 
  initialSnapshots, 
  initialStreams, 
  initialTelemetry 
} from './data/mockData';

// Views
import { TrafficShapingView } from './components/views/TrafficShapingView';
import { MultiWanView } from './components/views/MultiWanView';
import { LiveLogView } from './components/views/LiveLogView';
import { GitRollbackView } from './components/views/GitRollbackView';
import { OverviewView } from './components/views/OverviewView';
import { InterfacesView } from './components/views/InterfacesView';

// Modals
import { BufferbloatModal } from './components/modals/BufferbloatModal';
import { TcQdiscInspectorModal } from './components/modals/TcQdiscInspectorModal';
import { FqCodelModal } from './components/modals/FqCodelModal';
import { HtbConfiguratorModal } from './components/modals/HtbConfiguratorModal';
import { CreatePbrRuleModal } from './components/modals/CreatePbrRuleModal';
import { GatewayWatchdogModal } from './components/modals/GatewayWatchdogModal';
import { BgpPeerModal } from './components/modals/BgpPeerModal';
import { CreateSnapshotModal } from './components/modals/CreateSnapshotModal';
import { RouteTestModal } from './components/modals/RouteTestModal';
import { QuickSearchModal } from './components/modals/QuickSearchModal';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('traffic-shaping');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // Core Data States
  const [telemetry, setTelemetry] = useState<SystemTelemetry>(initialTelemetry);
  const [streams, setStreams] = useState(initialStreams);
  const [pbrRules, setPbrRules] = useState<PbrRule[]>(initialPbrRules);
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [snapshots, setSnapshots] = useState<GitSnapshot[]>(initialSnapshots);

  // Live telemetry subtle jitter
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        cpuUsage: +(12.5 + Math.random() * 4).toFixed(1),
        temperature: Math.round(40 + Math.random() * 2),
        throughput: `${(4.1 + Math.random() * 0.3).toFixed(2)} Gbps`,
        packetRate: `${(140 + Math.random() * 6).toFixed(1)} kpps`,
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Global Keyboard Shortcuts (Ctrl/Cmd + K for Quick Search, Esc to close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveModal(prev => (prev === 'quick-search' ? null : 'quick-search'));
      }
      if (e.key === 'Escape' && activeModal) {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal]);

  // PBR Rule Handlers
  const handleTogglePbrRule = (ruleId: string) => {
    setPbrRules(prev =>
      prev.map(r => {
        if (r.id === ruleId && !r.locked) {
          const nextState = r.state === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
          return { ...r, state: nextState };
        }
        return r;
      })
    );
  };

  const handleAddPbrRule = (newRule: PbrRule) => {
    setPbrRules(prev => [newRule, ...prev]);
    setActiveModal(null);
  };

  const handleDeletePbrRule = (ruleId: string) => {
    setPbrRules(prev => prev.filter(r => r.id !== ruleId));
  };

  // Git Snapshot Handlers
  const handleCreateSnapshot = (newSnap: GitSnapshot) => {
    setSnapshots(prev => [
      newSnap,
      ...prev.map(s => ({ ...s, isHead: false }))
    ]);
    setActiveModal(null);
  };

  const handleRollback = (sha: string) => {
    setSnapshots(prev =>
      prev.map(s => ({
        ...s,
        isHead: s.sha === sha,
      }))
    );
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans selection:bg-primary/30 selection:text-primary">
      {/* Top Header Navigation */}
      <Header
        currentView={currentView}
        onSelectView={setCurrentView}
        onOpenSearch={() => setActiveModal('quick-search')}
        cpu={telemetry.cpuUsage}
        ram={telemetry.ramUsage}
        temp={telemetry.temperature}
        notificationCount={2}
      />

      {/* Main Body with Fixed Sidebar & Scrolling Main Canvas */}
      <div className="flex flex-1 pt-14">
        {/* Left System Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          onOpenModal={setActiveModal}
          throughput={telemetry.throughput}
          packetRate={telemetry.packetRate}
          uptime={telemetry.uptime}
        />

        {/* View Content Area */}
        <main className="flex-1 ml-64 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {currentView === 'overview' && (
              <OverviewView
                telemetry={telemetry}
                onSelectView={setCurrentView}
                onOpenModal={setActiveModal}
              />
            )}

            {currentView === 'traffic-shaping' && (
              <TrafficShapingView
                onOpenModal={setActiveModal}
                streams={streams}
              />
            )}

            {currentView === 'multi-wan' && (
              <MultiWanView
                onOpenModal={setActiveModal}
                pbrRules={pbrRules}
                onToggleRule={handleTogglePbrRule}
                onDeleteRule={handleDeletePbrRule}
              />
            )}

            {currentView === 'live-log' && (
              <LiveLogView
                logs={logs}
                onClearLogs={() => setLogs([])}
              />
            )}

            {currentView === 'git-rollback' && (
              <GitRollbackView
                onOpenModal={setActiveModal}
                snapshots={snapshots}
                onRollback={handleRollback}
              />
            )}

            {currentView === 'interfaces' && (
              <InterfacesView
                onOpenModal={setActiveModal}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modals Collection */}
      <BufferbloatModal
        isOpen={activeModal === 'bufferbloat-bench'}
        onClose={() => setActiveModal(null)}
      />

      <TcQdiscInspectorModal
        isOpen={activeModal === 'tc-qdisc-inspector'}
        onClose={() => setActiveModal(null)}
      />

      <FqCodelModal
        isOpen={activeModal === 'fq-codel-tuning'}
        onClose={() => setActiveModal(null)}
      />

      <HtbConfiguratorModal
        isOpen={activeModal === 'htb-configurator'}
        onClose={() => setActiveModal(null)}
      />

      <CreatePbrRuleModal
        isOpen={activeModal === 'create-pbr-rule'}
        onClose={() => setActiveModal(null)}
        onAddRule={handleAddPbrRule}
      />

      <GatewayWatchdogModal
        isOpen={activeModal === 'gateway-watchdog'}
        onClose={() => setActiveModal(null)}
      />

      <BgpPeerModal
        isOpen={activeModal === 'bgp-peer-config'}
        onClose={() => setActiveModal(null)}
      />

      <CreateSnapshotModal
        isOpen={activeModal === 'create-snapshot'}
        onClose={() => setActiveModal(null)}
        onCreateSnapshot={handleCreateSnapshot}
      />

      <RouteTestModal
        isOpen={activeModal === 'route-test'}
        onClose={() => setActiveModal(null)}
      />

      <QuickSearchModal
        isOpen={activeModal === 'quick-search'}
        onClose={() => setActiveModal(null)}
        onSelectView={setCurrentView}
        onOpenModal={setActiveModal}
      />
    </div>
  );
}
