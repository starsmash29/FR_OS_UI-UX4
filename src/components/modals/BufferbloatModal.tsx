import React, { useState, useEffect } from 'react';

interface BufferbloatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommitSettings?: () => void;
}

export const BufferbloatModal: React.FC<BufferbloatModalProps> = ({
  isOpen,
  onClose,
  onCommitSettings,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progressPhase, setProgressPhase] = useState<number>(4);
  const [progressSec, setProgressSec] = useState<number>(15.0);
  const [profile, setProfile] = useState('Standard 64-Stream Saturation (Recommended)');
  const [duration, setDuration] = useState('15s (5s Base / 5s Sat / 5s Rec)');
  const [node, setNode] = useState('Frankfurt Edge (1.1.1.1 - 4.2ms)');
  const [cliToast, setCliToast] = useState(false);
  const [committed, setCommitted] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isRunning) {
      setProgressSec(0);
      setProgressPhase(1);
      const interval = 250;
      timer = setInterval(() => {
        setProgressSec((prev) => {
          const next = +(prev + 0.25).toFixed(2);
          if (next <= 5.0) setProgressPhase(1);
          else if (next <= 10.0) setProgressPhase(2);
          else if (next <= 15.0) setProgressPhase(3);
          else if (next <= 17.0) setProgressPhase(4);
          else {
            setIsRunning(false);
            clearInterval(timer);
            return 17.0;
          }
          return next;
        });
      }, interval);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md overflow-y-auto bg-surface-container-lowest/80 backdrop-blur-xl">
      <div className="relative w-full max-w-[1120px] my-auto bg-surface-container-low rounded-xl shadow-2xl flex flex-col overflow-hidden text-on-surface border border-outline-variant/30">
        {/* Subtle Ambient Vector Glow Line Top Edge */}
        <div className="h-1 w-full bg-gradient-to-r from-primary/20 via-primary to-secondary"></div>

        {/* Top Utility / Header Bar */}
        <div className="px-space-xl pt-space-lg pb-space-md bg-surface-container-lowest flex flex-col gap-space-md border-b border-outline-variant/30">
          <div className="flex items-start justify-between gap-space-lg">
            <div className="flex items-center gap-space-lg">
              <div className="h-10 w-36 flex items-center justify-center overflow-hidden rounded bg-surface-container-high px-space-sm border border-outline-variant/30">
                <img
                  alt="FR_OS Hex Vault Logo"
                  className="h-7 w-auto object-contain"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1WPKRcOXkcZgtJ0SxofeSvq-4XjCZ3kYiWwzevdFqjei30cX5hu2FUKswPX-5iMepGKSoGk7Xf-jJHwM8P-nBZCEOZq2bJY3HR0X94n_tggpvGknSy8r__Xnb0uDTUE7-zTTSUz3VvqUbSEq5056hvwVCWnpuVj_613KyMY5wEpb1YaX4mnGrxqmxc17T9d7MIJ1sRh92OzwudOzbmlNkmz1UFok-yvGfCEMhR7c_gtZgOxN8lUCn_Uf-9o"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-space-sm flex-wrap">
                  <span className="font-headline-md text-headline-md text-on-surface tracking-tight font-semibold">
                    Bufferbloat Saturation Benchmark & Latency-Under-Load Probe
                  </span>
                  <span className="px-space-xs py-0.5 rounded bg-surface-variant font-label-sm text-label-sm text-outline uppercase tracking-wider">
                    RFC_8290_BUFFERBLOAT_TESTER
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-space-md gap-y-space-xs mt-0.5 font-label-sm text-label-sm text-on-surface-variant">
                  <span className="flex items-center gap-space-xs text-primary font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    RUNNER: fping & curl-loader eBPF engine
                  </span>
                  <span className="text-outline-variant">•</span>
                  <span>TEST PROTOCOL: ICMP + Bi-Directional HTTP/3 TCP-BBR Saturation</span>
                  <span className="text-outline-variant">•</span>
                  <span className="text-secondary font-medium">TARGET: Cloudflare Edge / SpeedTest Mesh</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-space-xs shrink-0">
              <button
                onClick={() => {
                  setCliToast(true);
                  setTimeout(() => setCliToast(false), 2000);
                }}
                className="h-8 px-space-sm rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm flex items-center gap-space-xs transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px] text-primary">terminal</span>
                <span>{cliToast ? 'CLI Copied!' : 'Raw CLI Run'}</span>
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify({ verdict: 'A+', unloaded: '0.28ms', loaded_down: '+0.34ms', loaded_up: '+0.42ms' }, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'bufferbloat_rfc8290.json';
                  a.click();
                }}
                className="h-8 px-space-sm rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm flex items-center gap-space-xs transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px] text-secondary">file_download</span>
                <span>Export RFC (.json)</span>
              </button>
              <button
                onClick={onClose}
                className="h-8 w-8 ml-space-xs rounded bg-surface-container hover:bg-error-container text-on-surface-variant hover:text-error flex items-center justify-center transition-colors"
                title="Close Diagnostics"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>

          {/* Configuration Bar & Control Trigger */}
          <div className="mt-space-xs pt-space-xs grid grid-cols-1 md:grid-cols-12 gap-space-md items-center bg-surface-container-high/40 p-space-sm rounded-lg border border-outline-variant/30">
            <div className="md:col-span-4 flex flex-col gap-space-xs">
              <label className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Saturation Profile</label>
              <div className="relative flex items-center">
                <select
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                  className="w-full bg-surface-container-lowest text-on-surface font-body-sm text-body-sm px-space-sm py-1.5 rounded appearance-none cursor-pointer focus:outline-none border border-outline-variant/30"
                >
                  <option>Standard 64-Stream Saturation (Recommended)</option>
                  <option>Extreme UDP Flood Stress (100k pps)</option>
                  <option>Asymmetric DSL/Coax Profile (100:10)</option>
                  <option>Custom Shaper Calibration (Strict FQ)</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 pointer-events-none text-outline text-[16px]">expand_more</span>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col gap-space-xs">
              <label className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Duration</label>
              <div className="relative flex items-center">
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-surface-container-lowest text-on-surface font-body-sm text-body-sm px-space-sm py-1.5 rounded appearance-none cursor-pointer focus:outline-none border border-outline-variant/30"
                >
                  <option>15s (5s Base / 5s Sat / 5s Rec)</option>
                  <option>30s High-Entropy Endurance</option>
                  <option>60s Continuous Soak Probe</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 pointer-events-none text-outline text-[16px]">expand_more</span>
              </div>
            </div>

            <div className="md:col-span-3 flex flex-col gap-space-xs">
              <label className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Benchmark Node</label>
              <div className="relative flex items-center">
                <select
                  value={node}
                  onChange={(e) => setNode(e.target.value)}
                  className="w-full bg-surface-container-lowest text-on-surface font-body-sm text-body-sm px-space-sm py-1.5 rounded appearance-none cursor-pointer focus:outline-none border border-outline-variant/30"
                >
                  <option>Frankfurt Edge (1.1.1.1 - 4.2ms)</option>
                  <option>Vienna VIX Gateway (8.1ms)</option>
                  <option>London LNX Node (14.2ms)</option>
                  <option>Local Gateway Subnet (192.168.1.1)</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 pointer-events-none text-outline text-[16px]">expand_more</span>
              </div>
            </div>

            <div className="md:col-span-3 flex items-end justify-end gap-space-xs pt-2 md:pt-4">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`h-9 px-space-md rounded font-label-md text-label-md flex items-center gap-space-xs shadow-md transition-all ${
                  isRunning
                    ? 'bg-secondary text-on-secondary animate-pulse'
                    : 'bg-primary text-on-primary hover:bg-primary-fixed'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isRunning ? 'sync' : 'play_arrow'}
                </span>
                <span className="tracking-wide">
                  {isRunning ? `Running (${progressSec}s)...` : 'Run Benchmark'}
                </span>
              </button>
              <button
                onClick={() => setIsRunning(false)}
                className="h-9 px-space-sm rounded bg-surface-container hover:bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm transition-colors"
                title="Abort Active Probe"
                type="button"
              >
                <span>Stop</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-space-xl flex flex-col gap-space-lg bg-surface-container-low max-h-[calc(88vh-140px)] overflow-y-auto">
          {/* Score & KPI Highlights Banner */}
          <div className="grid grid-cols-12 gap-space-md">
            {/* Master Grade Tile */}
            <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-space-md rounded-xl flex flex-col justify-between relative overflow-hidden shadow-sm border border-outline-variant/30">
              <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-secondary/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">RFC-8290 Verdict</span>
                <span className="px-space-xs py-0.5 rounded bg-secondary/15 text-secondary font-label-sm text-label-sm font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  ACTIVE CAKE PROFILE
                </span>
              </div>
              <div className="my-space-sm flex items-baseline gap-space-md">
                <span className="font-headline-xl text-headline-xl text-secondary font-bold tracking-tight">A+</span>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
                    BUFFERBLOAT MITIGATED
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">Queue delay remains below 0.50 ms</span>
                </div>
              </div>
              <div className="bg-surface-container p-space-xs rounded font-body-sm text-body-sm text-on-surface-variant flex items-center justify-between">
                <span>Unloaded: <strong className="text-on-surface">0.28 ms</strong></span>
                <span className="text-outline-variant">|</span>
                <span>Loaded Down: <strong className="text-secondary">+0.34 ms</strong></span>
                <span className="text-outline-variant">|</span>
                <span>Loaded Up: <strong className="text-secondary">+0.42 ms</strong></span>
              </div>
            </div>

            {/* Metric 1 */}
            <div className="col-span-6 lg:col-span-2 bg-surface-container-lowest p-space-md rounded-xl flex flex-col justify-between shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between text-outline font-label-sm text-label-sm">
                <span className="uppercase tracking-wider">Idle Baseline</span>
                <span className="material-symbols-outlined text-[16px] text-primary">speed</span>
              </div>
              <div className="my-space-xs">
                <div className="font-metric-display text-metric-display text-on-surface font-bold tracking-tight">
                  0.28<span className="font-body-md text-body-md text-on-surface-variant font-normal ml-1">ms</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5 font-label-sm text-label-sm text-on-surface-variant">
                <div className="flex justify-between"><span>Jitter:</span><span className="text-on-surface font-mono">0.04 ms</span></div>
                <div className="flex justify-between"><span>Loss:</span><span className="text-secondary font-mono">0.00%</span></div>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="col-span-6 lg:col-span-2 bg-surface-container-lowest p-space-md rounded-xl flex flex-col justify-between shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between text-outline font-label-sm text-label-sm">
                <span className="uppercase tracking-wider">Download Load</span>
                <span className="material-symbols-outlined text-[16px] text-primary">download</span>
              </div>
              <div className="my-space-xs">
                <div className="font-metric-display text-metric-display text-primary font-bold tracking-tight">
                  942.5<span className="font-body-md text-body-md text-on-surface-variant font-normal ml-1">M</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5 font-label-sm text-label-sm text-on-surface-variant">
                <div className="flex justify-between"><span>Load Delta:</span><span className="text-secondary font-mono">+0.34 ms</span></div>
                <div className="flex justify-between"><span>ECN Marks:</span><span className="text-tertiary font-mono">18 pkts</span></div>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="col-span-6 lg:col-span-2 bg-surface-container-lowest p-space-md rounded-xl flex flex-col justify-between shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between text-outline font-label-sm text-label-sm">
                <span className="uppercase tracking-wider">Upload Load</span>
                <span className="material-symbols-outlined text-[16px] text-secondary">upload</span>
              </div>
              <div className="my-space-xs">
                <div className="font-metric-display text-metric-display text-secondary font-bold tracking-tight">
                  49.2<span className="font-body-md text-body-md text-on-surface-variant font-normal ml-1">M</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5 font-label-sm text-label-sm text-on-surface-variant">
                <div className="flex justify-between"><span>Load Delta:</span><span className="text-secondary font-mono">+0.42 ms</span></div>
                <div className="flex justify-between"><span>ACK-Filter:</span><span className="text-primary font-mono">Active</span></div>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="col-span-6 lg:col-span-2 bg-surface-container-lowest p-space-md rounded-xl flex flex-col justify-between shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between text-outline font-label-sm text-label-sm">
                <span className="uppercase tracking-wider">Kernel Queue</span>
                <span className="material-symbols-outlined text-[16px] text-secondary">tune</span>
              </div>
              <div className="my-space-xs">
                <div className="font-metric-display text-metric-display text-on-surface font-bold tracking-tight">
                  0<span className="font-body-md text-body-md text-on-surface-variant font-normal ml-1">drops</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5 font-label-sm text-label-sm text-on-surface-variant">
                <div className="flex justify-between"><span>Cobalt Target:</span><span className="text-on-surface font-mono">5.0 ms</span></div>
                <div className="flex justify-between"><span>Flow Bins:</span><span className="text-primary font-mono">1,024</span></div>
              </div>
            </div>
          </div>

          {/* Telemetry Oscilloscope Split Grid */}
          <div className="grid grid-cols-12 gap-space-md">
            {/* Left Chart */}
            <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest p-space-lg rounded-xl flex flex-col justify-between shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between pb-space-sm flex-wrap gap-2">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-[18px]">show_chart</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Latency Under Heavy Load Oscilloscope
                  </span>
                </div>
                <div className="flex items-center gap-space-md font-label-sm text-label-sm">
                  <span className="flex items-center gap-1.5 text-primary">
                    <span className="w-2.5 h-0.5 bg-primary rounded"></span> CAKE SQM (+0.42ms max)
                  </span>
                  <span className="flex items-center gap-1.5 text-error">
                    <span className="w-2.5 h-0.5 bg-error border border-dashed border-error rounded"></span> Raw FIFO (+128ms)
                  </span>
                </div>
              </div>

              {/* Latency Curve Canvas */}
              <div className="relative w-full h-52 bg-surface-container-low rounded-lg p-space-sm flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-x-2 top-2 bottom-6 flex flex-col justify-between pointer-events-none opacity-20">
                  <div className="w-full h-px bg-outline"></div>
                  <div className="w-full h-px bg-outline"></div>
                  <div className="w-full h-px bg-outline"></div>
                  <div className="w-full h-px bg-outline"></div>
                </div>

                <div className="absolute inset-x-0 top-[28%] flex items-center justify-between px-space-sm pointer-events-none z-10">
                  <div className="h-px w-full bg-tertiary/40"></div>
                  <span className="ml-2 font-label-sm text-label-sm text-tertiary bg-surface-container-lowest px-1 rounded whitespace-nowrap">
                    Cobalt 5.0ms Ceiling
                  </span>
                </div>

                <div className="absolute inset-0 pt-6 px-2 flex items-end">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 160">
                    <defs>
                      <linearGradient id="unshapedGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#ffb4ab" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="cakeGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Unshaped Bloat Spike Path */}
                    <path
                      d="M 0,148 L 150,148 Q 180,145 220,40 T 320,10 T 420,25 T 480,140 L 600,148"
                      fill="url(#unshapedGrad)"
                    />
                    <path
                      d="M 0,148 L 150,148 Q 180,145 220,40 T 320,10 T 420,25 T 480,140 L 600,148"
                      fill="none"
                      stroke="#ffb4ab"
                      strokeDasharray="4,3"
                      strokeWidth="2"
                    />
                    {/* CAKE SQM Precision Flat Line */}
                    <path
                      d="M 0,150 L 150,150 Q 200,148 240,147 T 340,146 T 440,147 T 480,149 L 600,150 L 600,160 L 0,160 Z"
                      fill="url(#cakeGrad)"
                    />
                    <path
                      d="M 0,150 L 150,150 Q 200,148 240,147 T 340,146 T 440,147 T 480,149 L 600,150"
                      fill="none"
                      stroke="#4cd7f6"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>

                <div className="relative z-20 flex justify-between font-label-sm text-label-sm text-outline pt-2">
                  <span>0.0s (Idle)</span>
                  <span>4.0s (Baseline)</span>
                  <span>8.0s (Sat Peak)</span>
                  <span>12.0s (Bi-Dir Load)</span>
                  <span>15.0s (Recovery)</span>
                </div>
              </div>

              <div className="mt-space-sm flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant bg-surface-container p-space-xs rounded">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
                  Bufferbloat suppressed: <strong className="text-secondary ml-1">127.98 ms avoided</strong>
                </span>
                <span className="font-mono text-outline">Target Jitter: <strong className="text-on-surface">&lt;0.05ms</strong></span>
              </div>
            </div>

            {/* Right Chart */}
            <div className="col-span-12 lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-xl flex flex-col justify-between shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between pb-space-sm">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-secondary text-[18px]">equalizer</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Throughput Saturation Waveform
                  </span>
                </div>
                <div className="font-label-sm text-label-sm text-outline font-mono">
                  Ingress: 942M / Egress: 49M
                </div>
              </div>

              <div className="relative w-full h-52 bg-surface-container-low rounded-lg p-space-sm flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 p-2 flex items-end">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 160">
                    <defs>
                      <linearGradient id="dlFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
                      </linearGradient>
                      <linearGradient id="ulFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#4edea3" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#4edea3" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0,155 L 80,155 Q 110,20 160,18 L 300,18 Q 340,20 370,155 L 400,155 Z"
                      fill="url(#dlFill)"
                    />
                    <path
                      d="M 0,155 L 80,155 Q 110,20 160,18 L 300,18 Q 340,20 370,155 L 400,155"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2"
                    />
                    <path
                      d="M 0,158 L 120,158 Q 150,90 200,88 L 300,88 Q 330,90 360,158 L 400,158 Z"
                      fill="url(#ulFill)"
                    />
                    <path
                      d="M 0,158 L 120,158 Q 150,90 200,88 L 300,88 Q 330,90 360,158 L 400,158"
                      fill="none"
                      stroke="#4edea3"
                      strokeWidth="1.8"
                    />
                  </svg>
                </div>

                <div className="relative z-20 flex items-center justify-between font-label-sm text-label-sm">
                  <div className="px-space-xs py-0.5 rounded bg-surface-container-high/80 text-primary font-mono">
                    ▼ Ingress Peak: 950.4 Mbps
                  </div>
                  <div className="px-space-xs py-0.5 rounded bg-surface-container-high/80 text-secondary font-mono">
                    ▲ Egress Peak: 49.8 Mbps
                  </div>
                </div>

                <div className="relative z-20 flex flex-col gap-1 mt-auto">
                  <div className="flex items-center justify-between font-label-sm text-label-sm text-outline">
                    <span>CAKE Diffserv4 Queue Partitioning</span>
                    <span>100% Link Allocation</span>
                  </div>
                  <div className="w-full h-2 rounded bg-surface-container-highest overflow-hidden flex">
                    <div className="h-full bg-primary" style={{ width: '55%' }} title="Bulk: 55%"></div>
                    <div className="h-full bg-secondary" style={{ width: '25%' }} title="Video: 25%"></div>
                    <div className="h-full bg-tertiary" style={{ width: '15%' }} title="Interactive: 15%"></div>
                    <div className="h-full bg-primary-fixed" style={{ width: '5%' }} title="VoIP/DNS: 5%"></div>
                  </div>
                </div>
              </div>

              <div className="mt-space-sm flex items-center justify-between font-label-sm text-label-sm text-outline flex-wrap gap-2">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary"></span>Bulk (55%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-secondary"></span>Video (25%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-tertiary"></span>Interactive (15%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary-fixed"></span>VoIP/DNS (5%)</span>
              </div>
            </div>
          </div>

          {/* Per-Phase Latency Histogram & Stream Forensic Table */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-sm border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-primary">table_chart</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Test Phase Progression & Latency Forensic Breakdown
                </span>
              </div>
              <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-outline">
                <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                <span className="text-secondary font-semibold">4 / 4 Benchmarks Passed RFC Validation</span>
              </div>
            </div>

            <div className="overflow-x-auto rounded bg-surface-container-low border border-outline-variant/20">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead className="bg-surface-container text-outline font-label-sm text-label-sm uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-space-md">Phase Designation</th>
                    <th className="py-2.5 px-space-md">Time Window</th>
                    <th className="py-2.5 px-space-md">Active Flow Stress</th>
                    <th className="py-2.5 px-space-md text-right">Avg Latency</th>
                    <th className="py-2.5 px-space-md text-right">Latency Min / Max</th>
                    <th className="py-2.5 px-space-md text-right">Added Bloat Delta</th>
                    <th className="py-2.5 px-space-md text-right">Loss / ECN Marks</th>
                    <th className="py-2.5 px-space-md text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y-0 text-on-surface font-mono">
                  <tr className={`hover:bg-surface-container-high/60 transition-colors ${progressPhase >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                    <td className="py-2.5 px-space-md font-sans font-medium text-on-surface">Phase 1: Idle Baseline Ping</td>
                    <td className="py-2.5 px-space-md text-outline">0.0s – 5.0s</td>
                    <td className="py-2.5 px-space-md text-outline">0 active payload flows (ICMP only)</td>
                    <td className="py-2.5 px-space-md text-right text-on-surface font-bold">0.28 ms</td>
                    <td className="py-2.5 px-space-md text-right text-outline">0.26 / 0.32 ms</td>
                    <td className="py-2.5 px-space-md text-right text-secondary font-bold">+0.00 ms</td>
                    <td className="py-2.5 px-space-md text-right text-outline">0.0% / 0 ECN</td>
                    <td className="py-2.5 px-space-md text-center">
                      <span className="px-2 py-0.5 rounded bg-secondary/15 text-secondary font-label-sm text-label-sm font-bold">CLEAN</span>
                    </td>
                  </tr>
                  <tr className={`hover:bg-surface-container-high/60 transition-colors ${progressPhase >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                    <td className="py-2.5 px-space-md font-sans font-medium text-on-surface">Phase 2: Ingress Saturation</td>
                    <td className="py-2.5 px-space-md text-outline">5.0s – 10.0s</td>
                    <td className="py-2.5 px-space-md text-outline">64 Concurrent HTTP/3 TCP-BBR Streams</td>
                    <td className="py-2.5 px-space-md text-right text-primary font-bold">0.62 ms</td>
                    <td className="py-2.5 px-space-md text-right text-outline">0.31 / 1.18 ms</td>
                    <td className="py-2.5 px-space-md text-right text-secondary font-bold">+0.34 ms</td>
                    <td className="py-2.5 px-space-md text-right text-on-surface">0.0% / 18 ECN</td>
                    <td className="py-2.5 px-space-md text-center">
                      <span className="px-2 py-0.5 rounded bg-secondary/15 text-secondary font-label-sm text-label-sm font-bold">OPTIMAL</span>
                    </td>
                  </tr>
                  <tr className={`hover:bg-surface-container-high/60 transition-colors ${progressPhase >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                    <td className="py-2.5 px-space-md font-sans font-medium text-on-surface">Phase 3: Bi-Directional Stress</td>
                    <td className="py-2.5 px-space-md text-outline">10.0s – 15.0s</td>
                    <td className="py-2.5 px-space-md text-outline">64 Downstream + 16 Upstream Flows</td>
                    <td className="py-2.5 px-space-md text-right text-secondary font-bold">0.70 ms</td>
                    <td className="py-2.5 px-space-md text-right text-outline">0.35 / 1.45 ms</td>
                    <td className="py-2.5 px-space-md text-right text-secondary font-bold">+0.42 ms</td>
                    <td className="py-2.5 px-space-md text-right text-on-surface">0.0% / 44 ECN</td>
                    <td className="py-2.5 px-space-md text-center">
                      <span className="px-2 py-0.5 rounded bg-secondary/15 text-secondary font-label-sm text-label-sm font-bold">CONVERGED</span>
                    </td>
                  </tr>
                  <tr className={`hover:bg-surface-container-high/60 transition-colors ${progressPhase >= 4 ? 'opacity-100' : 'opacity-40'}`}>
                    <td className="py-2.5 px-space-md font-sans font-medium text-on-surface">Phase 4: Instant Recovery</td>
                    <td className="py-2.5 px-space-md text-outline">15.0s – 17.0s</td>
                    <td className="py-2.5 px-space-md text-outline">Teardown / Zero Queue Flush</td>
                    <td className="py-2.5 px-space-md text-right text-on-surface font-bold">0.29 ms</td>
                    <td className="py-2.5 px-space-md text-right text-outline">0.27 / 0.31 ms</td>
                    <td className="py-2.5 px-space-md text-right text-secondary font-bold">+0.01 ms</td>
                    <td className="py-2.5 px-space-md text-right text-outline">0.0% / 0 ECN</td>
                    <td className="py-2.5 px-space-md text-center">
                      <span className="px-2 py-0.5 rounded bg-secondary/15 text-secondary font-label-sm text-label-sm font-bold">&lt; 12ms FLUSH</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-space-xl py-space-md bg-surface-container-lowest flex flex-col md:flex-row items-center justify-between gap-space-md border-t border-outline-variant/30">
          <div className="flex items-center gap-space-sm w-full md:w-auto font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low px-space-md py-1.5 rounded border border-outline-variant/30">
            <span className="text-primary font-mono">$</span>
            <span className="font-mono text-outline truncate">fr-benchmark --target 1.1.1.1 --streams 64 --cake-dev eth0 --duration 15s</span>
            <span className="ml-auto md:ml-2 text-secondary font-label-sm text-label-sm font-mono">[EXIT 0]</span>
          </div>

          <div className="flex items-center gap-space-sm w-full md:w-auto justify-end">
            <button
              onClick={() => {
                alert('Diagnostic PCAP packet capture generated: fros_bufferbloat_probe.pcap (48.2 MB)');
              }}
              className="h-9 px-space-md rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-space-xs transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] text-tertiary">download</span>
              <span>Download Diagnostic .pcap</span>
            </button>
            <button
              onClick={() => {
                setCommitted(true);
                if (onCommitSettings) onCommitSettings();
                setTimeout(() => setCommitted(false), 2000);
              }}
              className="h-9 px-space-md rounded bg-secondary-container hover:bg-secondary text-on-secondary font-label-md text-label-md flex items-center gap-space-xs shadow-md transition-all font-semibold"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">{committed ? 'done_all' : 'check_circle'}</span>
              <span>{committed ? 'CAKE Committed to Kernel ✓' : 'Commit CAKE Settings to Kernel'}</span>
            </button>
            <button
              onClick={onClose}
              className="h-9 px-space-md rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-label-md transition-colors"
              type="button"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
