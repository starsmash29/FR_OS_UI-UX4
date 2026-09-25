import React, { useState } from 'react';
import { GitSnapshot } from '../../types';

interface CreateSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSnapshot: (snap: GitSnapshot) => void;
}

export const CreateSnapshotModal: React.FC<CreateSnapshotModalProps> = ({
  isOpen,
  onClose,
  onCreateSnapshot,
}) => {
  const [message, setMessage] = useState('pre-maintenance: enable cake sqm & prune legacy vlan rules');
  const [tagEnabled, setTagEnabled] = useState(true);
  const [tagName, setTagName] = useState('v4.8.2-pre-sqm');
  const [subFirewall, setSubFirewall] = useState(true);
  const [subInterfaces, setSubInterfaces] = useState(true);
  const [subRouting, setSubRouting] = useState(true);
  const [subDns, setSubDns] = useState(true);
  const [subWireguard, setSubWireguard] = useState(true);
  const [subSysctl, setSubSysctl] = useState(false);
  const [subConntrack, setSubConntrack] = useState(false);
  const [targetLocal, setTargetLocal] = useState(true);
  const [targetRemote, setTargetRemote] = useState(true);
  const [targetS3, setTargetS3] = useState(true);
  const [targetTarball, setTargetTarball] = useState(false);
  const [watchdogArmed, setWatchdogArmed] = useState(true);
  const [isDiffing, setIsDiffing] = useState(false);
  const [diffMsg, setDiffMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCommit = () => {
    setSubmitting(true);
    setTimeout(() => {
      const newSnap: GitSnapshot = {
        sha: Math.random().toString(16).substring(2, 9),
        timeAgo: 'Just now',
        message: message.trim() || 'Manual configuration snapshot',
        author: 'admin',
        filesChanged: 3,
        additions: 18,
        deletions: 4,
        tags: tagEnabled && tagName ? [tagName] : ['Manual'],
        category: 'manual',
        isHead: true,
      };
      onCreateSnapshot(newSnap);
      setSubmitting(false);
      onClose();
    }, 700);
  };

  const handleDryRun = () => {
    setIsDiffing(true);
    setTimeout(() => {
      setIsDiffing(false);
      setDiffMsg('Diff Clean: +14 lines added, -2 lines deleted in /etc/fros/config.json.');
      setTimeout(() => setDiffMsg(null), 3500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-gutter overflow-y-auto bg-surface/80 backdrop-blur-md pointer-events-auto">
      <div className="relative w-full max-w-[760px] my-auto bg-surface-container-low rounded-lg shadow-2xl flex flex-col overflow-hidden text-on-surface border border-outline-variant/30">
        <div className="w-full h-1 bg-gradient-to-r from-primary via-primary-container to-secondary"></div>

        {/* MODAL HEADER */}
        <div className="p-gutter-lg bg-surface-container flex items-start justify-between border-b border-outline-variant/30">
          <div className="flex items-start gap-space-md">
            <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0 shadow-md border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-[24px]">history_toggle_off</span>
            </div>
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-sm flex-wrap">
                <span className="font-headline-sm text-headline-sm uppercase tracking-wider font-bold text-on-surface">FR_OS</span>
                <span className="text-outline-variant font-mono text-label-sm">/</span>
                <span className="bg-surface-container-highest px-space-xs py-0.5 rounded text-primary font-label-sm text-label-sm tracking-widest font-mono">
                  CONFIG SENTINEL
                </span>
                <span className="bg-surface-container-high px-space-xs py-0.5 rounded text-on-surface-variant font-label-sm text-label-sm font-mono">
                  GIT v2.43 + SCHEMA v4.8
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                Create Manual Configuration Snapshot
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xl leading-relaxed">
                Atomically commit live running kernel state, nftables rules, and JSON schema to local Git repository with optional remote mirror push.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded bg-surface-container-high hover:bg-surface-bright flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-gutter-lg flex flex-col gap-gutter bg-surface-container-low max-h-[calc(85vh-140px)] overflow-y-auto">
          {/* 1. SNAPSHOT METADATA */}
          <div className="flex flex-col gap-space-sm bg-surface-container p-space-lg rounded-lg border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">commit</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Snapshot Metadata &amp; Git Commit</span>
              </div>
              <span className="font-label-sm text-label-sm text-error uppercase tracking-wider font-mono font-bold">REQUIRED</span>
            </div>

            <div className="flex flex-col gap-space-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Commit Message / Snapshot Label
              </label>
              <input
                className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md px-space-md py-space-sm rounded focus:outline-none border border-outline-variant/30 font-mono"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
              <div className="bg-surface-container-lowest p-space-sm rounded flex flex-col gap-1 border border-outline-variant/20">
                <div className="font-label-sm text-label-sm text-outline uppercase tracking-wider">AUTHOR &amp; SIGNATURE</div>
                <div className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[16px]">verified_user</span>
                  <span className="font-mono text-on-surface font-bold">admin &lt;admin@node-01.lab.internal&gt;</span>
                </div>
                <div className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                  Key: <span className="text-secondary">ed25519-fros-vault</span> (HSM)
                </div>
              </div>

              <div className="bg-surface-container-lowest p-space-sm rounded flex flex-col justify-between border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">GIT MILESTONE TAG</span>
                  <label className="flex items-center gap-space-xs cursor-pointer">
                    <input
                      checked={tagEnabled}
                      onChange={(e) => setTagEnabled(e.target.checked)}
                      className="accent-primary rounded cursor-pointer"
                      type="checkbox"
                    />
                    <span className="font-label-sm text-label-sm text-on-surface font-mono">Tag Snapshot</span>
                  </label>
                </div>
                <div className="mt-space-xs">
                  <input
                    disabled={!tagEnabled}
                    className={`w-full bg-surface-container px-space-sm py-1 rounded text-primary font-mono font-body-sm text-body-sm focus:outline-none border border-outline-variant/30 ${
                      !tagEnabled ? 'opacity-40' : ''
                    }`}
                    type="text"
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. INCLUDED SUBSYSTEMS */}
          <div className="flex flex-col gap-space-sm bg-surface-container p-space-lg rounded-lg border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">account_tree</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Subsystems Included in declarative.json</span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-mono">CONFIG TREE FILTER</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs font-body-sm text-body-sm">
              <label className="flex items-start gap-space-sm p-space-sm bg-surface-container-lowest rounded hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20">
                <input checked={subFirewall} onChange={(e) => setSubFirewall(e.target.checked)} className="mt-1 accent-primary rounded cursor-pointer" type="checkbox" />
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface">Firewall &amp; NAT Tables</span>
                  <span className="font-mono text-outline font-label-sm text-label-sm">/etc/nftables.nft &amp; conntrack rules</span>
                </div>
              </label>

              <label className="flex items-start gap-space-sm p-space-sm bg-surface-container-lowest rounded hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20">
                <input checked={subInterfaces} onChange={(e) => setSubInterfaces(e.target.checked)} className="mt-1 accent-primary rounded cursor-pointer" type="checkbox" />
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface">Network Interfaces &amp; VLANs</span>
                  <span className="font-mono text-outline font-label-sm text-label-sm">/etc/network/interfaces.d (eth0-4)</span>
                </div>
              </label>

              <label className="flex items-start gap-space-sm p-space-sm bg-surface-container-lowest rounded hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20">
                <input checked={subRouting} onChange={(e) => setSubRouting(e.target.checked)} className="mt-1 accent-primary rounded cursor-pointer" type="checkbox" />
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface">Routing &amp; Policy Rules</span>
                  <span className="font-mono text-outline font-label-sm text-label-sm">Kernel FIB tables &amp; ip rule</span>
                </div>
              </label>

              <label className="flex items-start gap-space-sm p-space-sm bg-surface-container-lowest rounded hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20">
                <input checked={subDns} onChange={(e) => setSubDns(e.target.checked)} className="mt-1 accent-primary rounded cursor-pointer" type="checkbox" />
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface">DNS &amp; DHCP Leases</span>
                  <span className="font-mono text-outline font-label-sm text-label-sm">unbound.conf &amp; static MAC leases</span>
                </div>
              </label>

              <label className="flex items-start gap-space-sm p-space-sm bg-surface-container-lowest rounded hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20">
                <input checked={subWireguard} onChange={(e) => setSubWireguard(e.target.checked)} className="mt-1 accent-primary rounded cursor-pointer" type="checkbox" />
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface">WireGuard &amp; VPN Cryptokeys</span>
                  <span className="font-mono text-outline font-label-sm text-label-sm">wg0.conf (Peer keys only, secrets sanitized)</span>
                </div>
              </label>

              <label className="flex items-start gap-space-sm p-space-sm bg-surface-container-lowest rounded hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20">
                <input checked={subSysctl} onChange={(e) => setSubSysctl(e.target.checked)} className="mt-1 accent-primary rounded cursor-pointer" type="checkbox" />
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface">System Kernel Parameters</span>
                  <span className="font-mono text-outline font-label-sm text-label-sm">/etc/sysctl.d/99-fros.conf</span>
                </div>
              </label>
            </div>
          </div>

          {/* 3. EXPORT TARGETS */}
          <div className="flex flex-col gap-space-sm bg-surface-container p-space-lg rounded-lg border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">cloud_sync</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Target Repositories &amp; Distribution</span>
              </div>
              <span className="font-label-sm text-label-sm text-outline font-mono">SSH / HTTPS</span>
            </div>

            <div className="flex flex-col gap-space-xs font-body-sm text-body-sm">
              <label className="flex items-center justify-between p-space-sm bg-surface-container-lowest rounded hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20">
                <div className="flex items-center gap-space-sm">
                  <input checked={targetLocal} onChange={(e) => setTargetLocal(e.target.checked)} className="accent-primary rounded cursor-pointer" type="checkbox" />
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-secondary text-[16px]">storage</span>
                    <span className="font-bold text-on-surface">Local NVMe Flash Git Repository</span>
                  </div>
                </div>
                <span className="font-mono text-on-surface-variant font-label-sm text-label-sm bg-surface-container px-space-xs py-0.5 rounded">
                  /var/backups/fros.git (Atomic)
                </span>
              </label>

              <label className="flex items-center justify-between p-space-sm bg-surface-container-lowest rounded hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20">
                <div className="flex items-center gap-space-sm">
                  <input checked={targetRemote} onChange={(e) => setTargetRemote(e.target.checked)} className="accent-primary rounded cursor-pointer" type="checkbox" />
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[16px]">terminal</span>
                    <span className="font-bold text-on-surface">Git Remote Upstream (SSH Push)</span>
                  </div>
                </div>
                <span className="font-mono text-on-surface-variant font-label-sm text-label-sm bg-surface-container px-space-xs py-0.5 rounded">
                  git@gitea.lab.internal:fros/node-01.git
                </span>
              </label>

              <label className="flex items-center justify-between p-space-sm bg-surface-container-lowest rounded hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20">
                <div className="flex items-center gap-space-sm">
                  <input checked={targetS3} onChange={(e) => setTargetS3(e.target.checked)} className="accent-primary rounded cursor-pointer" type="checkbox" />
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-tertiary text-[16px]">lock</span>
                    <span className="font-bold text-on-surface">Encrypted Remote S3 Object Storage</span>
                  </div>
                </div>
                <span className="font-mono text-on-surface-variant font-label-sm text-label-sm bg-surface-container px-space-xs py-0.5 rounded">
                  s3://fros-vault-us1/ (AES-256-GCM)
                </span>
              </label>
            </div>
          </div>

          {/* 4. PRE-FLIGHT SYNTAX CHECK */}
          <div className="flex flex-col gap-space-xs bg-surface-container-lowest p-space-md rounded-lg font-mono border border-outline-variant/30">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
              <div className="flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(78,222,163,0.8)]"></span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  PRE-FLIGHT SYNTAX &amp; INTEGRITY VALIDATION
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-primary">PASSED (0.14s)</span>
            </div>
            <div className="flex flex-col gap-1 text-body-sm font-body-sm text-on-surface-variant pt-1">
              <div className="flex items-center gap-space-xs text-secondary">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                <span>JSON Schema v4.8 validation passed (0 syntax errors, 14 config nodes)</span>
              </div>
              <div className="flex items-center gap-space-xs text-secondary">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                <span>nftables dry-run test: valid syntax (42 table rules verified)</span>
              </div>
            </div>
          </div>

          {/* 5. WATCHDOG PROTECTION */}
          <div className="bg-surface-container p-space-md rounded-lg flex items-center justify-between border border-outline-variant/20">
            <label className="flex items-center gap-space-md cursor-pointer select-none">
              <input
                checked={watchdogArmed}
                onChange={(e) => setWatchdogArmed(e.target.checked)}
                className="w-4 h-4 accent-secondary rounded cursor-pointer"
                type="checkbox"
              />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-space-xs">
                  Enable Safe-Revert Watchdog Protection
                  <span className="bg-secondary/20 text-secondary text-label-sm font-label-sm px-1.5 py-0.5 rounded font-mono font-bold">
                    120s TIMER
                  </span>
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Automatically rolls back to snapshot HEAD if administrative SSH/HTTPS connectivity drops after apply.
                </span>
              </div>
            </label>
          </div>

          {diffMsg && (
            <div className="p-space-sm rounded bg-secondary/10 border border-secondary/30 text-secondary font-mono text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">done_all</span>
              <span>{diffMsg}</span>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-gutter-lg bg-surface-container flex flex-col sm:flex-row items-center justify-between gap-space-md border-t border-outline-variant/30">
          <div className="flex items-center gap-space-xs font-mono font-label-sm text-label-sm text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="text-on-surface font-bold">ATOMIC NETLINK TRANSACTION</span>
            <span className="text-outline-variant">//</span>
            <span className="text-secondary">ZERO PACKET LOSS</span>
          </div>

          <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-space-md py-space-sm rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-mono font-body-sm text-body-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDryRun}
              className="px-space-md py-space-sm rounded bg-surface-container-highest hover:bg-surface-bright text-primary font-mono font-body-sm text-body-sm flex items-center gap-space-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">difference</span>
              <span>{isDiffing ? 'Diffing...' : 'Dry-Run Diff'}</span>
            </button>
            <button
              onClick={handleCommit}
              className="px-space-lg py-space-sm rounded bg-primary-container hover:bg-primary text-on-primary-container font-mono font-body-sm text-body-sm font-bold flex items-center gap-space-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">publish</span>
              <span>{submitting ? 'Creating Git Ref...' : 'Commit & Push Snapshot'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
