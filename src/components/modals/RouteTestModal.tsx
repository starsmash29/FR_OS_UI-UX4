import React, { useState } from 'react';

interface RouteTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInjected?: () => void;
}

export const RouteTestModal: React.FC<RouteTestModalProps> = ({ isOpen, onClose, onInjected }) => {
  const [srcIp, setSrcIp] = useState('192.168.10.45');
  const [dstIp, setDstIp] = useState('142.250.190.46');
  const [protoPort, setProtoPort] = useState('TCP / 443');
  const [dscp, setDscp] = useState('EF (Expedited Forwarding 46)');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInject = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setResult(`Matched Table 100 [wan1_lowlatency] via dev eth0 (198.51.100.1). Packet forwarded.`);
      if (onInjected) onInjected();
      setTimeout(() => {
        setResult(null);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center p-space-md pointer-events-auto">
      <div className="bg-surface-container-low border border-surface-variant w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden flex flex-col">
        <div className="px-space-lg py-space-md bg-surface-container flex items-center justify-between border-b border-outline-variant/30">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[20px]">alt_route</span>
            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
              FIB Route Lookup Simulator (Dry-Run)
            </span>
          </div>
          <button onClick={onClose} className="text-outline hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-space-lg flex flex-col gap-space-md font-body-sm text-body-sm">
          <p className="text-on-surface-variant">
            Trace real-time packet traversal against active Linux <code className="text-primary font-bold">ip rule</code> priorities and destination routing tables.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <label className="text-outline uppercase tracking-wider text-[10px] font-bold">Source IP / CIDR</label>
              <input
                className="bg-surface-container-lowest border border-surface-variant rounded px-space-sm py-1.5 text-on-surface font-body-sm focus:outline-none focus:border-primary"
                type="text"
                value={srcIp}
                onChange={(e) => setSrcIp(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-space-xs">
              <label className="text-outline uppercase tracking-wider text-[10px] font-bold">Destination IP</label>
              <input
                className="bg-surface-container-lowest border border-surface-variant rounded px-space-sm py-1.5 text-on-surface font-body-sm focus:outline-none focus:border-primary"
                type="text"
                value={dstIp}
                onChange={(e) => setDstIp(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-space-xs">
              <label className="text-outline uppercase tracking-wider text-[10px] font-bold">Protocol &amp; Port</label>
              <input
                className="bg-surface-container-lowest border border-surface-variant rounded px-space-sm py-1.5 text-on-surface font-body-sm focus:outline-none focus:border-primary"
                type="text"
                value={protoPort}
                onChange={(e) => setProtoPort(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-space-xs">
              <label className="text-outline uppercase tracking-wider text-[10px] font-bold">DSCP / QoS Marking</label>
              <input
                className="bg-surface-container-lowest border border-surface-variant rounded px-space-sm py-1.5 text-on-surface font-body-sm focus:outline-none focus:border-primary"
                type="text"
                value={dscp}
                onChange={(e) => setDscp(e.target.value)}
              />
            </div>
          </div>

          <div className="p-space-md rounded bg-surface-container-lowest border border-surface-variant flex flex-col gap-space-xs">
            <div className="flex items-center justify-between text-[11px] font-label-sm">
              <span className="text-secondary font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                MATCH FOUND: Rule Pref 200 (VoIP Low-Latency)
              </span>
              <span className="text-outline">Execution time: 0.042 ms</span>
            </div>
            <div className="font-mono text-[11px] text-on-surface-variant space-y-1">
              <div>&gt; ip rule match src {srcIp} dscp 0x2e</div>
              <div>&gt; table 100 [wan1_lowlatency] selected via dev eth0</div>
              <div>&gt; nexthop gateway 198.51.100.1 MTU 1500 MSS 1460 (FIB direct-hit)</div>
            </div>
          </div>

          {result && (
            <div className="p-space-xs rounded bg-secondary/15 text-secondary font-mono text-[11px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>{result}</span>
            </div>
          )}
        </div>

        <div className="px-space-lg py-space-md bg-surface-container flex items-center justify-end gap-space-sm border-t border-outline-variant/30">
          <button
            onClick={onClose}
            className="px-space-md py-1.5 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-sm text-label-sm transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleInject}
            className="px-space-md py-1.5 rounded bg-primary-container hover:bg-primary text-on-primary font-bold font-label-sm text-label-sm transition-all shadow-[0_0_12px_rgba(6,182,212,0.35)]"
          >
            {running ? 'Simulating Injection...' : 'Run Live Injection'}
          </button>
        </div>
      </div>
    </div>
  );
};
