import React, { useState } from 'react';

interface FqCodelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FqCodelModal: React.FC<FqCodelModalProps> = ({ isOpen, onClose }) => {
  const [target, setTarget] = useState(5.0);
  const [interval, setInterval] = useState(100);
  const [quantum, setQuantum] = useState(1514);
  const [flows, setFlows] = useState(1024);
  const [limit, setLimit] = useState(10240);
  const [ecn, setEcn] = useState(true);
  const [ceThreshold, setCeThreshold] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState('fiber1g');
  const [dryRunActive, setDryRunActive] = useState(false);
  const [committed, setCommitted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePreset = (preset: string) => {
    setSelectedPreset(preset);
    if (preset === 'fiber1g') {
      setTarget(5.0);
      setInterval(100);
      setFlows(1024);
      setQuantum(1514);
      setLimit(10240);
      setEcn(true);
      setCeThreshold(0);
    } else if (preset === 'gaming') {
      setTarget(2.5);
      setInterval(50);
      setFlows(1024);
      setQuantum(800);
      setLimit(4096);
      setEcn(true);
      setCeThreshold(500);
    } else if (preset === 'aggressive') {
      setTarget(3.0);
      setInterval(80);
      setFlows(2048);
      setQuantum(1514);
      setLimit(2048);
      setEcn(true);
      setCeThreshold(0);
    } else if (preset === 'server10g') {
      setTarget(8.0);
      setInterval(120);
      setFlows(4096);
      setQuantum(9000);
      setLimit(32768);
      setEcn(true);
      setCeThreshold(1000);
    }
  };

  const getCmdString = () => {
    let cmd = `tc qdisc replace dev eth0 root fq_codel target ${target}ms interval ${interval}ms quantum ${quantum} flows ${flows} limit ${limit}`;
    if (ecn) cmd += ' ecn';
    if (ceThreshold > 0) cmd += ` ce_threshold ${ceThreshold}us`;
    return cmd;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-gutter bg-surface-container-lowest/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-7xl max-h-[942px] flex flex-col bg-surface-container-low rounded-xl shadow-2xl overflow-hidden border border-outline-variant/30">
        {/* Top Neon Atmospheric Accent Glow */}
        <div className="absolute -top-24 left-1/3 w-96 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* 1. MODAL HEADER */}
        <div className="relative z-10 shrink-0 px-space-xl py-space-lg bg-surface-container-lowest flex flex-col lg:flex-row lg:items-center justify-between gap-space-md border-b border-outline-variant/30">
          <div className="flex items-start sm:items-center gap-space-md">
            <div className="relative flex items-center justify-center w-11 h-11 shrink-0 bg-surface-container rounded-lg p-space-xs border border-outline-variant/30">
              <svg className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(76,215,246,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 36 36">
                <polygon className="text-primary" points="18,2 32,10 32,26 18,34 4,26 4,10" strokeWidth="1.75"></polygon>
                <line className="text-on-surface" strokeWidth="1.5" x1="18" x2="18" y1="8" y2="28"></line>
                <line className="text-on-surface" strokeWidth="1.5" x1="9" x2="27" y1="13" y2="23"></line>
                <line className="text-on-surface" strokeWidth="1.5" x1="9" x2="27" y1="23" y2="13"></line>
                <circle className="text-secondary" cx="18" cy="18" fill="currentColor" r="2.5"></circle>
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-space-sm">
                <span className="font-headline-md text-headline-md text-on-surface font-semibold tracking-wide">FR_OS</span>
                <span className="text-outline">/</span>
                <h2 className="font-headline-md text-headline-md text-on-surface font-medium">
                  FQ_CoDel Engine Tuning & Kernel Qdisc Parameterization
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-space-xs mt-1">
                <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm">// RFC_8289_FQ_CODEL</span>
                <span className="px-space-xs py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">Linux clsact / sch_fq_codel v5.15</span>
                <span className="flex items-center gap-1 px-space-xs py-0.5 rounded bg-secondary/10 text-secondary font-label-sm text-label-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
                  <span>STATUS: KERNEL_ACTIVE</span>
                </span>
                <span className="px-space-xs py-0.5 rounded bg-surface-container text-outline font-label-sm text-label-sm">NETLINK FD: #24</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-space-sm self-end lg:self-center">
            <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-xs rounded text-on-surface border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-[18px]">tune</span>
              <select
                className="bg-transparent font-label-md text-label-md text-on-surface outline-none cursor-pointer pr-space-xs"
                value={selectedPreset}
                onChange={(e) => handlePreset(e.target.value)}
              >
                <option className="bg-surface-container text-on-surface" value="fiber1g">1G Fiber Default (Standard)</option>
                <option className="bg-surface-container text-on-surface" value="gaming">Low-Latency Gaming / VoIP</option>
                <option className="bg-surface-container text-on-surface" value="aggressive">Bufferbloat Aggressive</option>
                <option className="bg-surface-container text-on-surface" value="server10g">High-Bandwidth 10G Server</option>
              </select>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded flex items-center justify-center bg-surface-container hover:bg-surface-bright text-on-surface-variant hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* SCROLLABLE MODAL BODY */}
        <div className="relative z-10 flex-1 overflow-y-auto px-space-xl py-space-lg space-y-gutter-lg">
          {/* 2. INTERFACE & HOOK */}
          <div className="p-space-md rounded-xl bg-surface-container flex flex-col xl:flex-row xl:items-center justify-between gap-space-md shadow-md border border-outline-variant/20">
            <div className="flex flex-wrap items-center gap-space-md">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Target Interface:</span>
              <div className="flex flex-wrap items-center gap-space-xs">
                <button className="px-space-md py-space-xs rounded bg-primary-container text-on-primary-container font-label-md text-label-md flex items-center gap-space-xs font-semibold">
                  <span className="material-symbols-outlined text-[16px]">settings_ethernet</span>
                  <span>eth0 [WAN Fiber 1G/50M]</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary ml-1"></span>
                </button>
                <button className="px-space-md py-space-xs rounded bg-surface-container-high hover:bg-surface-bright text-on-surface-variant font-label-md text-label-md">
                  <span>eth1 [LAN Core 2.5G]</span>
                </button>
                <button className="px-space-md py-space-xs rounded bg-surface-container-high hover:bg-surface-bright text-on-surface-variant font-label-md text-label-md">
                  <span>bond0 [LACP Trunk]</span>
                </button>
                <button className="px-space-md py-space-xs rounded bg-surface-container-high hover:bg-surface-bright text-on-surface-variant font-label-md text-label-md">
                  <span>vlan10 [Admin]</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-space-lg">
              <div className="flex items-center gap-space-xs">
                <span className="font-label-sm text-label-sm text-outline">HOOK:</span>
                <div className="flex items-center bg-surface-container-lowest rounded p-0.5 border border-outline-variant/20">
                  <button className="px-space-sm py-0.5 rounded bg-surface-container-highest text-primary font-label-sm text-label-sm font-semibold">Root Qdisc</button>
                  <button className="px-space-sm py-0.5 rounded text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm">Ingress</button>
                  <button className="px-space-sm py-0.5 rounded text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm">Egress Branch</button>
                </div>
              </div>
              <div className="flex items-center gap-space-sm bg-surface-container-lowest px-space-md py-space-xs rounded border border-outline-variant/20">
                <span className="font-label-md text-label-md text-on-surface font-medium">FQ_CoDel Active</span>
                <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(78,222,163,0.8)]"></span>
              </div>
            </div>
          </div>

          {/* 3. LIVE KERNEL METRICS (4 KPI Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            <div className="p-space-lg rounded-xl bg-surface-container flex flex-col justify-between shadow-sm border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Active Target / Interval</span>
                <span className="material-symbols-outlined text-primary text-[18px]">timer</span>
              </div>
              <div className="mt-space-sm">
                <div className="font-metric-display text-metric-display text-primary flex items-baseline gap-space-xs">
                  <span>{target.toFixed(1)}</span>
                  <span className="font-label-md text-label-md text-outline">ms</span>
                  <span className="text-outline-variant font-light mx-0.5">/</span>
                  <span className="text-on-surface">{interval}</span>
                  <span className="font-label-md text-label-md text-outline">ms</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">AQM latency threshold window</p>
              </div>
              <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden mt-space-sm">
                <div className="bg-primary h-full" style={{ width: `${(target / 25) * 100}%` }}></div>
              </div>
            </div>

            <div className="p-space-lg rounded-xl bg-surface-container flex flex-col justify-between shadow-sm border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">CoDel Dropping State</span>
                <span className="flex items-center gap-1.5 px-space-xs py-0.5 rounded bg-secondary/15 text-secondary font-label-sm text-label-sm">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  <span>CLEAR</span>
                </span>
              </div>
              <div className="mt-space-sm">
                <div className="font-metric-display text-metric-display text-secondary">
                  NOT DROPPING
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Queue delay: <span className="text-secondary font-semibold font-body-md text-body-md">0.24 ms</span> (&lt; {target}ms target)
                </p>
              </div>
              <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden mt-space-sm">
                <div className="bg-secondary h-full w-[4.8%]"></div>
              </div>
            </div>

            <div className="p-space-lg rounded-xl bg-surface-container flex flex-col justify-between shadow-sm border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Flow Buckets & Isolation</span>
                <span className="material-symbols-outlined text-tertiary text-[18px]">account_tree</span>
              </div>
              <div className="mt-space-sm">
                <div className="font-metric-display text-metric-display text-on-surface flex items-baseline gap-space-xs">
                  <span>{flows.toLocaleString()}</span>
                  <span className="font-label-md text-label-md text-outline">Bins</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Active hash bins: <span className="text-on-surface font-semibold">14</span> | Collisions: <span className="text-secondary font-semibold">0</span>
                </p>
              </div>
              <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden mt-space-sm">
                <div className="bg-tertiary h-full w-[1.3%]"></div>
              </div>
            </div>

            <div className="p-space-lg rounded-xl bg-surface-container flex flex-col justify-between shadow-sm border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">ECN & Packet Discards</span>
                <span className="material-symbols-outlined text-primary text-[18px]">notification_important</span>
              </div>
              <div className="mt-space-sm">
                <div className="font-metric-display text-metric-display text-on-surface flex items-baseline gap-space-xs">
                  <span className="text-secondary">0</span>
                  <span className="font-label-md text-label-md text-outline">Drops</span>
                  <span className="text-outline-variant font-light mx-0.5">/</span>
                  <span className="text-primary font-bold">42</span>
                  <span className="font-label-md text-label-md text-outline">Marks</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">TOS CE Marking Active (RFC 3168)</p>
              </div>
              <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden mt-space-sm">
                <div className="bg-primary h-full w-full"></div>
              </div>
            </div>
          </div>

          {/* 4 & 5. MAIN SPLIT: TUNING FORM & REAL-TIME VISUALIZER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg">
            {/* PARAMETER FORM (7 Cols) */}
            <div className="lg:col-span-7 space-y-space-md">
              <div className="flex items-center justify-between px-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold uppercase tracking-wider">
                    Kernel Qdisc Parameters
                  </h3>
                </div>
                <span className="font-label-sm text-label-sm text-outline">Strict Netlink Binding</span>
              </div>

              <div className="grid grid-cols-1 gap-space-sm">
                {/* Target Delay */}
                <div className="p-space-md rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs mb-space-xs">
                    <div>
                      <span className="font-label-md text-label-md text-primary font-bold font-mono">target</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface font-medium ml-2">Target Queue Delay</span>
                    </div>
                    <div className="flex items-center gap-space-xs">
                      <input
                        className="w-20 px-space-sm py-0.5 rounded bg-surface-container-lowest text-primary font-label-md text-label-md text-right font-bold focus:outline-none border border-outline-variant/30"
                        max="25.0"
                        min="1.0"
                        step="0.5"
                        type="number"
                        value={target}
                        onChange={(e) => setTarget(parseFloat(e.target.value) || 1.0)}
                      />
                      <span className="font-label-sm text-label-sm text-outline">ms</span>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                    Minimum queue delay CoDel tries to achieve before initiating packet drops or TOS ECN marks.
                  </p>
                  <div className="flex items-center gap-space-md">
                    <span className="font-label-sm text-label-sm text-outline">1.0ms</span>
                    <input
                      className="w-full accent-primary bg-surface-container-highest h-1.5 rounded-lg cursor-pointer"
                      max="25.0"
                      min="1.0"
                      step="0.5"
                      type="range"
                      value={target}
                      onChange={(e) => setTarget(parseFloat(e.target.value))}
                    />
                    <span className="font-label-sm text-label-sm text-outline">25.0ms</span>
                  </div>
                </div>

                {/* Interval */}
                <div className="p-space-md rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs mb-space-xs">
                    <div>
                      <span className="font-label-md text-label-md text-primary font-bold font-mono">interval</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface font-medium ml-2">Observation Window</span>
                    </div>
                    <div className="flex items-center gap-space-xs">
                      <input
                        className="w-20 px-space-sm py-0.5 rounded bg-surface-container-lowest text-primary font-label-md text-label-md text-right font-bold focus:outline-none border border-outline-variant/30"
                        max="200"
                        min="20"
                        step="5"
                        type="number"
                        value={interval}
                        onChange={(e) => setInterval(parseInt(e.target.value) || 20)}
                      />
                      <span className="font-label-sm text-label-sm text-outline">ms</span>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                    Sliding observation duration used to distinguish sustained persistent bufferbloat from brief, normal bursts.
                  </p>
                  <div className="flex items-center gap-space-md">
                    <span className="font-label-sm text-label-sm text-outline">20ms</span>
                    <input
                      className="w-full accent-primary bg-surface-container-highest h-1.5 rounded-lg cursor-pointer"
                      max="200"
                      min="20"
                      step="5"
                      type="range"
                      value={interval}
                      onChange={(e) => setInterval(parseInt(e.target.value))}
                    />
                    <span className="font-label-sm text-label-sm text-outline">200ms</span>
                  </div>
                </div>

                {/* Quantum & Flows */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  <div className="p-space-md rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/20">
                    <div>
                      <div className="flex items-center justify-between mb-space-xs">
                        <span className="font-label-md text-label-md text-primary font-bold font-mono">quantum</span>
                        <span className="font-label-sm text-label-sm text-secondary font-semibold">1514 (MTU)</span>
                      </div>
                      <span className="font-headline-sm text-headline-sm text-on-surface font-medium block">DRR Round Quantum</span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        Bytes allocated per round of Deficit Round Robin scheduling.
                      </p>
                    </div>
                    <div className="mt-space-md">
                      <div className="flex items-center gap-space-xs">
                        <input
                          className="w-full px-space-sm py-space-xs rounded bg-surface-container-lowest text-on-surface font-label-md text-label-md focus:outline-none border border-outline-variant/30"
                          max="9000"
                          min="300"
                          step="64"
                          type="number"
                          value={quantum}
                          onChange={(e) => setQuantum(parseInt(e.target.value) || 1514)}
                        />
                        <span className="font-label-sm text-label-sm text-outline">bytes</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-space-md rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/20">
                    <div>
                      <div className="flex items-center justify-between mb-space-xs">
                        <span className="font-label-md text-label-md text-primary font-bold font-mono">flows</span>
                        <span className="font-label-sm text-label-sm text-outline">Hash Bins</span>
                      </div>
                      <span className="font-headline-sm text-headline-sm text-on-surface font-medium block">Flow Bucket Count</span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        Per-flow stochastic hashing buckets preventing hog flows.
                      </p>
                    </div>
                    <div className="mt-space-md grid grid-cols-4 gap-1">
                      {[512, 1024, 2048, 4096].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setFlows(num)}
                          className={`py-1 rounded font-label-sm text-label-sm font-mono text-center transition-all ${
                            flows === num
                              ? 'bg-primary text-on-primary font-bold'
                              : 'bg-surface-container-high hover:bg-surface-bright text-on-surface-variant'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Limit & ECN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  <div className="p-space-md rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/20">
                    <div>
                      <div className="flex items-center justify-between mb-space-xs">
                        <span className="font-label-md text-label-md text-primary font-bold font-mono">limit</span>
                        <span className="font-label-sm text-label-sm text-outline">Tail-Drop Ceil</span>
                      </div>
                      <span className="font-headline-sm text-headline-sm text-on-surface font-medium block">Queue Packet Limit</span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        Hard queue envelope depth across all queues before tail-dropping.
                      </p>
                    </div>
                    <div className="mt-space-md flex items-center gap-space-xs">
                      <input
                        className="w-full px-space-sm py-space-xs rounded bg-surface-container-lowest text-on-surface font-label-md text-label-md focus:outline-none border border-outline-variant/30"
                        max="65535"
                        min="1024"
                        step="512"
                        type="number"
                        value={limit}
                        onChange={(e) => setLimit(parseInt(e.target.value) || 10240)}
                      />
                      <span className="font-label-sm text-label-sm text-outline">pkts</span>
                    </div>
                  </div>

                  <div className="p-space-md rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/20">
                    <div>
                      <div className="flex items-center justify-between mb-space-xs">
                        <span className="font-label-md text-label-md text-primary font-bold font-mono">ecn / ce_threshold</span>
                        <span className="flex items-center gap-1 font-label-sm text-label-sm text-secondary">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>RFC 3168
                        </span>
                      </div>
                      <span className="font-headline-sm text-headline-sm text-on-surface font-medium block">ECN & CE Threshold</span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        Set Congestion Experienced (CE) mark instead of dropping.
                      </p>
                    </div>
                    <div className="mt-space-md flex items-center justify-between gap-space-sm">
                      <label className="flex items-center gap-space-xs cursor-pointer">
                        <input
                          checked={ecn}
                          onChange={(e) => setEcn(e.target.checked)}
                          className="w-4 h-4 rounded bg-surface-container-lowest border-0 accent-primary text-primary focus:ring-0"
                          type="checkbox"
                        />
                        <span className="font-label-sm text-label-sm text-on-surface">ECN Enabled</span>
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          className="w-16 px-space-xs py-space-xs rounded bg-surface-container-lowest text-on-surface font-label-sm text-label-sm text-right focus:outline-none border border-outline-variant/30"
                          max="5000"
                          min="0"
                          step="100"
                          type="number"
                          value={ceThreshold}
                          onChange={(e) => setCeThreshold(parseInt(e.target.value) || 0)}
                        />
                        <span className="font-label-sm text-label-sm text-outline">µs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* REAL-TIME AQM OSCILLOSCOPE (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-space-md">
              <div className="flex items-center justify-between px-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[20px]">show_chart</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold uppercase tracking-wider">
                    Queue Oscilloscope & AQM State
                  </h3>
                </div>
                <span className="px-space-xs py-0.5 rounded bg-secondary/10 text-secondary font-label-sm text-label-sm font-semibold">
                  LIVE FEED (50ms)
                </span>
              </div>

              <div className="p-space-lg rounded-xl bg-surface-container-lowest flex flex-col justify-between flex-1 shadow-inner relative overflow-hidden border border-outline-variant/30">
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #4cd7f6 1px, transparent 1px), linear-gradient(to bottom, #4cd7f6 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                ></div>

                <div className="relative z-10 flex items-center justify-between font-label-sm text-label-sm text-outline flex-wrap gap-2">
                  <div className="flex items-center gap-space-md">
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-0.5 bg-primary inline-block"></span>
                      <span className="text-primary font-mono">SoURN Delay (0.35ms)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-0.5 border-b border-dashed border-error inline-block"></span>
                      <span className="text-error font-mono">Drop Line (15ms)</span>
                    </div>
                  </div>
                  <span className="text-secondary font-mono">STATUS: REGULATED</span>
                </div>

                <div className="relative z-10 my-space-md flex-1 flex items-center justify-center">
                  <svg className="w-full h-44 overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 160">
                    <defs>
                      <linearGradient id="cyanGradWave" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Max Threshold */}
                    <line opacity="0.8" stroke="#ffb4ab" strokeDasharray="4,4" strokeWidth="1.25" x1="0" x2="400" y1="20" y2="20"></line>
                    <text fill="#ffb4ab" fontFamily="JetBrains Mono" fontSize="9" textAnchor="end" x="395" y="16">
                      MAX THRESHOLD (15ms)
                    </text>
                    {/* AQM Target */}
                    <line opacity="0.6" stroke="#4cd7f6" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="400" y1="80" y2="80"></line>
                    <text fill="#4cd7f6" fontFamily="JetBrains Mono" fontSize="9" textAnchor="end" x="395" y="76">
                      AQM TARGET ({target.toFixed(1)}ms)
                    </text>
                    {/* 0ms Baseline */}
                    <line stroke="#3d494c" strokeWidth="1" x1="0" x2="400" y1="145" y2="145"></line>
                    <text fill="#869397" fontFamily="JetBrains Mono" fontSize="9" x="5" y="156">0.0ms Base</text>

                    {/* Glowing Delay Path Fill */}
                    <path
                      d="M 0,140 Q 25,135 50,138 T 100,128 T 150,134 T 200,118 T 240,122 T 280,105 T 320,130 T 360,136 T 400,132 L 400,145 L 0,145 Z"
                      fill="url(#cyanGradWave)"
                    ></path>
                    <path
                      d="M 0,140 Q 25,135 50,138 T 100,128 T 150,134 T 200,118 T 240,122 T 280,105 T 320,130 T 360,136 T 400,132"
                      fill="none"
                      stroke="#4cd7f6"
                      strokeWidth="2.5"
                    ></path>
                    {/* Active Point */}
                    <circle cx="280" cy="105" fill="#4edea3" r="3"></circle>
                    <circle cx="280" cy="105" fill="none" opacity="0.7" r="6" stroke="#4edea3" strokeWidth="1" className="animate-ping"></circle>
                    <text fill="#4edea3" fontFamily="JetBrains Mono" fontSize="8" textAnchor="middle" x="280" y="98">
                      ECN MARK (1.8ms)
                    </text>
                  </svg>
                </div>

                <div className="relative z-10 grid grid-cols-3 gap-space-xs pt-space-sm bg-surface-container-low/70 rounded p-space-xs text-center border border-outline-variant/20">
                  <div>
                    <span className="font-label-sm text-label-sm text-outline block">CoDel Drops</span>
                    <span className="font-headline-sm text-headline-sm text-secondary font-bold font-mono">0</span>
                  </div>
                  <div>
                    <span className="font-label-sm text-label-sm text-outline block">Overlimits</span>
                    <span className="font-headline-sm text-headline-sm text-primary font-bold font-mono">12</span>
                  </div>
                  <div>
                    <span className="font-label-sm text-label-sm text-outline block">Requeues</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold font-mono">0</span>
                  </div>
                </div>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container flex items-center justify-between text-on-surface border border-outline-variant/20">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">memory</span>
                  </div>
                  <div>
                    <span className="font-label-md text-label-md font-semibold text-on-surface block">Ring Buffer Memory Footprint</span>
                    <span className="font-body-sm text-body-sm text-outline">Preallocated SLAB pool: 1.20 MB / 32.0 MB Max</span>
                  </div>
                </div>
                <span className="px-space-xs py-0.5 rounded bg-surface-container-highest text-secondary font-label-sm text-label-sm font-mono">
                  3.75% CAPACITY
                </span>
              </div>
            </div>
          </div>

          {/* 6. COMMAND STAGING */}
          <div className="p-space-md rounded-xl bg-surface-container-lowest space-y-space-xs border border-outline-variant/30">
            <div className="flex flex-wrap items-center justify-between gap-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">code</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold uppercase tracking-wider">
                  Kernel Command Staging Buffer
                </span>
                <span className="px-space-xs py-0.5 rounded bg-surface-container text-primary font-label-sm text-label-sm">
                  tc-rtnetlink
                </span>
              </div>
              <div className="flex items-center gap-space-xs">
                <button
                  onClick={() => handlePreset('fiber1g')}
                  className="px-space-sm py-1 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">history</span>
                  <span>Reset to RFC Defaults</span>
                </button>
                <button
                  onClick={() => {
                    setDryRunActive(true);
                    setTimeout(() => setDryRunActive(false), 3000);
                  }}
                  className="px-space-sm py-1 rounded bg-surface-container-high hover:bg-surface-bright text-secondary font-label-sm text-label-sm flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">play_circle</span>
                  <span>Dry-Run Check</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getCmdString());
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-space-sm py-1 rounded bg-primary text-on-primary font-label-sm text-label-sm font-semibold flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">content_copy</span>
                  <span>{copied ? 'Copied!' : 'Copy tc CLI'}</span>
                </button>
              </div>
            </div>

            <div className="p-space-sm rounded bg-surface-dim font-body-sm text-body-sm font-mono text-primary overflow-x-auto flex items-center justify-between select-all border border-outline-variant/20">
              <code className="whitespace-nowrap">{getCmdString()}</code>
              <span className="material-symbols-outlined text-outline shrink-0 ml-space-md text-[16px]">terminal</span>
            </div>

            {dryRunActive && (
              <div className="px-space-xs py-1 rounded bg-secondary/10 text-secondary font-label-sm text-label-sm font-mono flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>Kernel dry-run netlink check [NETLINK_ROUTE dev eth0]: VALID. Zero packet loss anticipated.</span>
              </div>
            )}
          </div>
        </div>

        {/* 7. MODAL FOOTER */}
        <div className="shrink-0 px-space-xl py-space-md bg-surface-container-lowest flex flex-col sm:flex-row sm:items-center justify-between gap-space-md border-t border-outline-variant/30">
          <div className="flex items-center gap-space-xs font-body-sm text-body-sm text-outline">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-mono">Linux netlink: NETLINK_ROUTE connected</span>
            <span className="text-outline-variant">|</span>
            <span className="font-mono text-on-surface-variant">eBPF XDP hook: PASS</span>
          </div>

          <div className="flex items-center gap-space-sm self-end sm:self-center">
            <button
              onClick={onClose}
              className="px-space-lg py-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors"
            >
              Cancel & Discard
            </button>
            <button
              onClick={() => {
                setCommitted(true);
                setTimeout(() => {
                  setCommitted(false);
                  onClose();
                }, 1500);
              }}
              className="px-space-xl py-space-xs rounded-lg bg-primary hover:bg-surface-tint text-on-primary font-label-md text-label-md font-bold tracking-wide transition-all shadow-[0_0_12px_rgba(76,215,246,0.35)] flex items-center gap-space-xs"
            >
              <span className="material-symbols-outlined text-[18px]">publish</span>
              <span>{committed ? 'Applied to Kernel ✓' : 'Apply & Commit to Kernel'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
