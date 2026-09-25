import React, { useState } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  RotateCcw, 
  Plus, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  FileDiff, 
  RefreshCcw, 
  Download, 
  AlertOctagon,
  RefreshCw,
  FolderGit2
} from 'lucide-react';
import { ActiveModal, GitSnapshot } from '../../types';

interface GitRollbackViewProps {
  onOpenModal: (modal: ActiveModal) => void;
  snapshots: GitSnapshot[];
  onRollback?: (sha: string) => void;
}

export const GitRollbackView: React.FC<GitRollbackViewProps> = ({
  onOpenModal,
  snapshots,
  onRollback,
}) => {
  const [selectedSnapshot, setSelectedSnapshot] = useState<GitSnapshot>(snapshots[0]);
  const [isRollingBack, setIsRollingBack] = useState<boolean>(false);
  const [rollbackSuccess, setRollbackSuccess] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);

  const handleRollback = () => {
    if (window.confirm(`Initiate safe rollback to snapshot ${selectedSnapshot.sha}? Sentinel watchdog will verify gateway health for 180s.`)) {
      setIsRollingBack(true);
      setTimeout(() => {
        setIsRollingBack(false);
        setRollbackSuccess(true);
        if (onRollback) onRollback(selectedSnapshot.sha);
        setTimeout(() => setRollbackSuccess(false), 4000);
      }, 1500);
    }
  };

  const handleSyncRemote = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-low border border-outline-variant/50 p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-secondary/15 text-secondary font-semibold border border-secondary/30">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse mr-1.5"></span>
              GIT REPOSITORY CLEAN (branch: main)
            </span>
            <span className="text-xs font-mono text-on-surface-variant">Storage: /etc/fr_os/git (Bare Mirror)</span>
          </div>
          <h1 className="text-xl font-bold text-on-surface font-headline tracking-wide mt-1">
            Configuration Version Control & Safety Rollback Sentinel
          </h1>
          <p className="text-xs text-on-surface-variant max-w-2xl mt-0.5">
            Atomic declarative snapshots tracked in Git. Every firewall, SQM, or route modification is versioned with automated 180-second connectivity watchdog reversal.
          </p>
        </div>

        {/* Modal Launch Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenModal('create-snapshot')}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary hover:bg-primary-dim text-on-primary rounded-lg text-xs font-mono font-semibold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Snapshot</span>
          </button>

          <button
            onClick={handleSyncRemote}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant rounded-lg text-xs font-mono transition"
          >
            {isSyncing ? (
              <RefreshCw className="w-4 h-4 text-primary animate-spin" />
            ) : syncSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-secondary" />
            ) : (
              <RefreshCcw className="w-4 h-4 text-secondary" />
            )}
            <span>{isSyncing ? 'Syncing...' : syncSuccess ? 'Mirror Updated' : 'Push Remote Mirror'}</span>
          </button>
        </div>
      </div>

      {/* Sentinel Health Status Bar */}
      <div className="bg-surface-container-low border border-secondary/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-secondary/10 text-secondary rounded-lg border border-secondary/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-on-surface font-mono">
              Rollback Sentinel Active (Auto-Revert Armed)
            </div>
            <p className="text-xs text-on-surface-variant">
              If management connectivity or WAN gateway probes fail after applying a snapshot, kernel reverts in 180s.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <span className="text-on-surface-variant block text-[10px]">CURRENT HEAD</span>
            <span className="text-primary font-bold">{snapshots[0]?.sha || '8f2d9a1'} (Active)</span>
          </div>
          <div className="border-l border-outline-variant pl-4 text-right">
            <span className="text-on-surface-variant block text-[10px]">TOTAL COMMITS</span>
            <span className="text-on-surface font-bold">{snapshots.length + 84}</span>
          </div>
        </div>
      </div>

      {/* Split View: Commit Timeline on Left, Diff / Actions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Timeline List */}
        <div className="lg:col-span-5 bg-surface-container-low border border-outline-variant/60 rounded-xl overflow-hidden flex flex-col h-[600px]">
          <div className="p-3 border-b border-outline-variant/40 bg-surface-container flex items-center justify-between text-xs font-mono text-on-surface-variant">
            <span>Snapshot Timeline</span>
            <span>Branch: main</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/30 font-mono text-xs">
            {snapshots.map((snap) => {
              const isSelected = selectedSnapshot.sha === snap.sha;
              return (
                <div
                  key={snap.sha}
                  onClick={() => setSelectedSnapshot(snap)}
                  className={`p-3.5 cursor-pointer transition flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-surface-container-high/80 border-l-2 border-primary'
                      : 'hover:bg-surface-container/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GitCommit className={`w-3.5 h-3.5 ${snap.isHead ? 'text-secondary' : 'text-primary'}`} />
                      <span className="font-bold text-primary text-[11px]">{snap.sha}</span>
                      {snap.isHead && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-secondary/20 text-secondary border border-secondary/30">
                          HEAD
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {snap.timeAgo}
                    </span>
                  </div>

                  <div className="text-xs font-sans font-medium text-on-surface line-clamp-2">
                    {snap.message}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-on-surface-variant">
                    <span className="text-on-surface-variant/80">by @{snap.author}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-secondary font-bold">+{snap.additions}</span>
                      <span className="text-error font-bold">-{snap.deletions}</span>
                      <span className="text-on-surface-variant">{snap.filesChanged} files</span>
                    </div>
                  </div>

                  {snap.tags && snap.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {snap.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded text-[9px] bg-surface-container border border-outline-variant text-on-surface-variant"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Diff Viewer and Rollback Execution */}
        <div className="lg:col-span-7 bg-surface-container-low border border-outline-variant/60 rounded-xl overflow-hidden flex flex-col h-[600px]">
          {/* Header */}
          <div className="p-3 border-b border-outline-variant/40 bg-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <FileDiff className="w-4 h-4 text-primary" />
              <span className="font-bold text-on-surface">
                Diff Viewer: HEAD vs <strong className="text-primary">{selectedSnapshot.sha}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRollback}
                disabled={isRollingBack || selectedSnapshot.isHead}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold transition ${
                  selectedSnapshot.isHead
                    ? 'bg-surface-container text-on-surface-variant/50 cursor-not-allowed border border-outline-variant/30'
                    : isRollingBack
                    ? 'bg-error text-on-error animate-pulse'
                    : rollbackSuccess
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-error/20 hover:bg-error/30 text-error border border-error/40'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>
                  {selectedSnapshot.isHead 
                    ? 'Already at HEAD' 
                    : isRollingBack 
                    ? 'Applying Rollback...' 
                    : rollbackSuccess 
                    ? 'Rolled Back!' 
                    : `Rollback to ${selectedSnapshot.sha}`}
                </span>
              </button>
            </div>
          </div>

          {/* Visual Diff View */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
            {/* Snapshot metadata */}
            <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/50 space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-on-surface-variant text-[11px]">
                <span>Commit: <strong className="text-primary">{selectedSnapshot.sha}</strong></span>
                <span>Date: {selectedSnapshot.timeAgo}</span>
              </div>
              <p className="font-sans font-medium text-sm text-on-surface">
                {selectedSnapshot.message}
              </p>
              <div className="text-[10px] text-on-surface-variant flex items-center justify-between pt-1">
                <span>Committed by {selectedSnapshot.author} (via Web Console)</span>
                <span>Files affected: {selectedSnapshot.filesChanged}</span>
              </div>
            </div>

            {/* Simulated Git Diff Output */}
            <div>
              <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                diff --git a/etc/fr_os/routing.json b/etc/fr_os/routing.json
              </div>

              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40 font-mono text-[11px] leading-relaxed overflow-x-auto text-on-surface">
                <div className="text-on-surface-variant">--- a/etc/fr_os/routing.json (HEAD)</div>
                <div className="text-on-surface-variant">+++ b/etc/fr_os/routing.json ({selectedSnapshot.sha})</div>
                <div className="text-primary/70">@@ -14,8 +14,14 @@ "policy_routing": [</div>
                <div className="text-on-surface-variant pl-4">  &#123; "pref": 100, "name": "dns-force" &#125;,</div>
                <div className="bg-error/15 text-error pl-2 border-l-2 border-error">
                  - &#123; "pref": 200, "name": "voip-sip", "target": "table 100", "state": "ACTIVE" &#125;
                </div>
                <div className="bg-secondary/15 text-secondary pl-2 border-l-2 border-secondary">
                  + &#123; "pref": 200, "name": "voip-sip", "target": "table 100", "state": "DISABLED" &#125;
                </div>
                <div className="bg-secondary/15 text-secondary pl-2 border-l-2 border-secondary">
                  + &#123; "pref": 250, "name": "sip-backup-route", "target": "table 200", "state": "ACTIVE" &#125;
                </div>
                <div className="text-on-surface-variant pl-4">  &#123; "pref": 300, "name": "sticky-tls" &#125;</div>
                <div className="text-primary/70">@@ -42,6 +48,9 @@ "sqm_cake": &#123;</div>
                <div className="bg-error/15 text-error pl-2 border-l-2 border-error">
                  -   "shaper_rate": "1000mbit",
                </div>
                <div className="bg-secondary/15 text-secondary pl-2 border-l-2 border-secondary">
                  +   "shaper_rate": "940mbit",
                </div>
                <div className="text-on-surface-variant pl-4">    "diffserv": "diffserv4",</div>
                <div className="text-on-surface-variant pl-4">    "host_isolation": true</div>
              </div>
            </div>

            {/* Watchdog Note */}
            <div className="p-3 bg-surface-container rounded-lg border border-outline-variant flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-tertiary" />
                <span className="text-on-surface-variant">Rollback will reload FIB & tc schedulers without reboot</span>
              </div>
              <span className="text-secondary font-bold text-[10px]">Zero Downtime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
