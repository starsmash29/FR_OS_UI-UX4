import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Sliders, 
  Zap, 
  ShieldCheck, 
  RefreshCw, 
  Cpu, 
  Radio, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Terminal, 
  Layers, 
  Gauge, 
  CheckCircle2, 
  Settings2,
  Sparkles,
  Info
} from 'lucide-react';
import { ActiveModal, FairQueuedStream } from '../../types';

interface TrafficShapingViewProps {
  onOpenModal: (modal: ActiveModal) => void;
  streams: FairQueuedStream[];
  onRefreshStreams?: () => void;
}

export const TrafficShapingView: React.FC<TrafficShapingViewProps> = ({ 
  onOpenModal, 
  streams: initialStreamList 
}) => {
  const [streams, setStreams] = useState<FairQueuedStream[]>(initialStreamList);
  const [activeQdisc, setActiveQdisc] = useState<'cake' | 'fq_codel' | 'htb'>('cake');
  const [downlinkRate, setDownlinkRate] = useState<number>(940);
  const [uplinkRate, setUplinkRate] = useState<number>(940);
  const [diffservMode, setDiffservMode] = useState<string>('diffserv4');
  const [hostIsolation, setHostIsolation] = useState<boolean>(true);
  const [ackFilter, setAckFilter] = useState<boolean>(true);
  const [washHeaders, setWashHeaders] = useState<boolean>(true);
  const [rttPreset, setRTTpreset] = useState<string>('internet');
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [applySuccess, setApplySuccess] = useState<boolean>(false);

  // Live jittering throughput
  const [liveJitter, setLiveJitter] = useState({
    downCurrent: 782,
    upCurrent: 144,
    ecnRate: 42,
    dropsRate: 0,
    bufferDelay: 0.8
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveJitter(prev => ({
        downCurrent: Math.round(760 + Math.random() * 60),
        upCurrent: Math.round(135 + Math.random() * 25),
        ecnRate: Math.round(38 + Math.random() * 8),
        dropsRate: 0,
        bufferDelay: +(0.6 + Math.random() * 0.4).toFixed(1)
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleApplyConfig = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setApplySuccess(true);
      setTimeout(() => setApplySuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb & High-Level Telemetry */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-low border border-outline-variant/50 p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-secondary/15 text-secondary font-semibold border border-secondary/30">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse mr-1.5"></span>
              KERNEL ACTIVE (tc-adv)
            </span>
            <span className="text-xs font-mono text-on-surface-variant">Qdisc Subsystem: Linux 5.15-rt-bpf</span>
          </div>
          <h1 className="text-xl font-bold text-on-surface font-headline tracking-wide mt-1">
            Active Queue Management & Bufferbloat Mitigation
          </h1>
          <p className="text-xs text-on-surface-variant max-w-2xl mt-0.5">
            CAKE (Common Applications Kept Enhanced) and FQ_CoDel shaping with sub-millisecond Fair Queuing, DSCP DiffServ prioritization, and eBPF hardware offload.
          </p>
        </div>

        {/* Quick Launch Action Modals */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenModal('bufferbloat-bench')}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 text-primary border border-primary/40 rounded-lg text-xs font-mono font-medium transition shadow-sm"
          >
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <span>Bufferbloat Bench</span>
          </button>

          <button
            onClick={() => onOpenModal('tc-qdisc-inspector')}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant rounded-lg text-xs font-mono transition"
          >
            <Terminal className="w-4 h-4 text-on-surface-variant" />
            <span>tc Inspector</span>
          </button>

          <button
            onClick={() => onOpenModal('fq-codel-tuning')}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant rounded-lg text-xs font-mono transition"
          >
            <Sliders className="w-4 h-4 text-secondary" />
            <span>FQ_CoDel Tuning</span>
          </button>

          <button
            onClick={() => onOpenModal('htb-configurator')}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant rounded-lg text-xs font-mono transition"
          >
            <Layers className="w-4 h-4 text-tertiary" />
            <span>HTB Hierarchy</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Buffer Delay */}
        <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">Induced Latency</span>
            <span className="text-[10px] font-mono bg-secondary/20 text-secondary px-1.5 py-0.5 rounded border border-secondary/30">Grade A+</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-secondary">+{liveJitter.bufferDelay}</span>
            <span className="text-xs font-mono text-on-surface-variant">ms bufferbloat</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
            <span>Zero Queue Bloat</span>
            <span className="text-secondary flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> FQ Verified
            </span>
          </div>
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-secondary/30"></div>
        </div>

        {/* Card 2: Ingress Shaping */}
        <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">Ingress Shaping (eth0)</span>
            <ArrowDownLeft className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-primary">{liveJitter.downCurrent}</span>
            <span className="text-xs font-mono text-on-surface-variant">/ {downlinkRate} Mbps</span>
          </div>
          <div className="mt-3 w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, (liveJitter.downCurrent / downlinkRate) * 100)}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-mono text-on-surface-variant">
            <span>Load: {Math.round((liveJitter.downCurrent / downlinkRate) * 100)}%</span>
            <span>Overhead: ATM / None</span>
          </div>
        </div>

        {/* Card 3: Egress Shaping */}
        <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">Egress Shaping (eth0)</span>
            <ArrowUpRight className="w-4 h-4 text-tertiary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-tertiary">{liveJitter.upCurrent}</span>
            <span className="text-xs font-mono text-on-surface-variant">/ {uplinkRate} Mbps</span>
          </div>
          <div className="mt-3 w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-tertiary h-full transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, (liveJitter.upCurrent / uplinkRate) * 100)}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-mono text-on-surface-variant">
            <span>Load: {Math.round((liveJitter.upCurrent / uplinkRate) * 100)}%</span>
            <span>Flow Hash: 8-Way DRR</span>
          </div>
        </div>

        {/* Card 4: ECN Marks vs Drops */}
        <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">Congestion Signaling</span>
            <Zap className="w-4 h-4 text-secondary" />
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <div>
              <span className="text-3xl font-mono font-bold text-on-surface">{liveJitter.ecnRate}</span>
              <span className="text-xs font-mono text-secondary ml-1">ECN/s</span>
            </div>
            <div className="border-l border-outline-variant pl-3">
              <span className="text-2xl font-mono font-bold text-on-surface-variant">0</span>
              <span className="text-xs font-mono text-on-surface-variant ml-1">drops</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
            <span>RFC 3168 Congestion</span>
            <span className="text-secondary">Zero-Drop Backpressure</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Parameters on Left, Applied State & Graphs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Qdisc & Tuning Engine */}
        <div className="lg:col-span-7 bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 space-y-6">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4">
            <div>
              <h2 className="text-base font-bold text-on-surface font-headline flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-primary" />
                Kernel Qdisc Discipline Configuration
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Dynamic queue discipline orchestration on Linux network scheduler
              </p>
            </div>

            {/* Qdisc Engine Selector */}
            <div className="flex bg-surface-container p-1 rounded-lg border border-outline-variant">
              {(['cake', 'fq_codel', 'htb'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setActiveQdisc(mode)}
                  className={`px-3 py-1 rounded text-xs font-mono transition uppercase font-semibold ${
                    activeQdisc === mode
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {mode === 'cake' ? 'CAKE (L7 SQM)' : mode === 'fq_codel' ? 'FQ_CoDel' : 'HTB Tree'}
                </button>
              ))}
            </div>
          </div>

          {/* Bandwidth Limits */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
              <span>1. Bandwidth Ceilings & Overhead Accounting</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface-container p-3 rounded-lg border border-outline-variant">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-mono text-on-surface flex items-center gap-1">
                    <ArrowDownLeft className="w-3.5 h-3.5 text-primary" /> Downlink Shaper Rate
                  </label>
                  <span className="text-xs font-mono font-bold text-primary">{downlinkRate} Mbps</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="2500"
                  step="10"
                  value={downlinkRate}
                  onChange={(e) => setDownlinkRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] font-mono text-on-surface-variant mt-1.5">
                  <span>Conservative: 90% link</span>
                  <span>Max: 2.5 GbE</span>
                </div>
              </div>

              <div className="bg-surface-container p-3 rounded-lg border border-outline-variant">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-mono text-on-surface flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5 text-tertiary" /> Uplink Shaper Rate
                  </label>
                  <span className="text-xs font-mono font-bold text-tertiary">{uplinkRate} Mbps</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="2500"
                  step="10"
                  value={uplinkRate}
                  onChange={(e) => setUplinkRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-tertiary"
                />
                <div className="flex justify-between text-[10px] font-mono text-on-surface-variant mt-1.5">
                  <span>Bufferbloat Shield Active</span>
                  <span>Max: 2.5 GbE</span>
                </div>
              </div>
            </div>
          </div>

          {/* CAKE Specific Options */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
              <span>2. Traffic Isolation & Prioritization Modes</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div 
                onClick={() => setDiffservMode('diffserv4')}
                className={`p-3 rounded-lg border cursor-pointer transition ${
                  diffservMode === 'diffserv4' 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'bg-surface-container border-outline-variant hover:border-outline text-on-surface-variant'
                }`}
              >
                <div className="font-mono text-xs font-bold text-on-surface">DiffServ4 (RFC 4594)</div>
                <div className="text-[11px] mt-1 text-on-surface-variant">4 Tiers: Bulk, Best Effort, Video, Voice</div>
              </div>

              <div 
                onClick={() => setDiffservMode('diffserv3')}
                className={`p-3 rounded-lg border cursor-pointer transition ${
                  diffservMode === 'diffserv3' 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'bg-surface-container border-outline-variant hover:border-outline text-on-surface-variant'
                }`}
              >
                <div className="font-mono text-xs font-bold text-on-surface">DiffServ3 (RFC 2597)</div>
                <div className="text-[11px] mt-1 text-on-surface-variant">3 Tiers: Bulk, Best Effort, Voice/Latency</div>
              </div>

              <div 
                onClick={() => setDiffservMode('besteffort')}
                className={`p-3 rounded-lg border cursor-pointer transition ${
                  diffservMode === 'besteffort' 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'bg-surface-container border-outline-variant hover:border-outline text-on-surface-variant'
                }`}
              >
                <div className="font-mono text-xs font-bold text-on-surface">Best Effort (Single)</div>
                <div className="text-[11px] mt-1 text-on-surface-variant">Pure Fair Queuing without DSCP split</div>
              </div>
            </div>

            {/* Smart Hardware & Flow Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <label className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-container border border-outline-variant cursor-pointer hover:bg-surface-container-high transition">
                <input
                  type="checkbox"
                  checked={hostIsolation}
                  onChange={(e) => setHostIsolation(e.target.checked)}
                  className="rounded border-outline-variant text-secondary focus:ring-0 w-4 h-4"
                />
                <div>
                  <div className="text-xs font-mono font-medium text-on-surface">Host Isolation</div>
                  <div className="text-[10px] text-on-surface-variant">Fair share per LAN IP (NAT wash)</div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-container border border-outline-variant cursor-pointer hover:bg-surface-container-high transition">
                <input
                  type="checkbox"
                  checked={ackFilter}
                  onChange={(e) => setAckFilter(e.target.checked)}
                  className="rounded border-outline-variant text-secondary focus:ring-0 w-4 h-4"
                />
                <div>
                  <div className="text-xs font-mono font-medium text-on-surface">ACK-Filter (Upload)</div>
                  <div className="text-[10px] text-on-surface-variant">Prune redundant TCP ACKs</div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-container border border-outline-variant cursor-pointer hover:bg-surface-container-high transition">
                <input
                  type="checkbox"
                  checked={washHeaders}
                  onChange={(e) => setWashHeaders(e.target.checked)}
                  className="rounded border-outline-variant text-secondary focus:ring-0 w-4 h-4"
                />
                <div>
                  <div className="text-xs font-mono font-medium text-on-surface">Wash DSCP</div>
                  <div className="text-[10px] text-on-surface-variant">Strip untrusted WAN DSCP marks</div>
                </div>
              </label>
            </div>
          </div>

          {/* RTT Target & Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant/40">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-on-surface-variant">Target RTT:</span>
              <select
                value={rttPreset}
                onChange={(e) => setRTTpreset(e.target.value)}
                className="bg-surface-container border border-outline-variant rounded px-2.5 py-1 text-on-surface font-mono text-xs focus:outline-none focus:border-primary"
              >
                <option value="internet">Internet (100ms)</option>
                <option value="metro">Metro Fiber (30ms)</option>
                <option value="datacenter">Datacenter (10ms)</option>
                <option value="oceanic">Intercontinental (300ms)</option>
              </select>
            </div>

            <button
              onClick={handleApplyConfig}
              disabled={isApplying}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono font-semibold transition shadow-md ${
                applySuccess
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-primary hover:bg-primary-dim text-on-primary'
              }`}
            >
              {isApplying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Pushing to RTNetlink...</span>
                </>
              ) : applySuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kernel Synchronized</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Apply & Commit to eBPF/tc</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Kernel Command Preview & Live Stream Queues */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Command Line Preview Box */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/50">
              <span className="text-on-surface-variant text-[11px] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-secondary" />
                Synthesized Linux tc Command (Netlink RTNETLINK)
              </span>
              <span className="text-[10px] bg-surface-container px-2 py-0.5 rounded text-secondary font-bold">
                DRY-RUN OK
              </span>
            </div>
            <pre className="text-secondary/90 bg-surface-dim/70 p-3 rounded-lg overflow-x-auto text-[11px] leading-relaxed mt-2.5 border border-outline-variant/30">
{`# 1. Clean root queue
tc qdisc del dev eth0 root 2>/dev/null || true

# 2. Attach CAKE SQM Shaper
tc qdisc add dev eth0 root cake \\
  bandwidth ${uplinkRate}mbit \\
  ${diffservMode} \\
  ${hostIsolation ? 'nat ' : ''}\\
  ${washHeaders ? 'wash ' : ''}\\
  ${ackFilter ? 'ack-filter ' : ''}\\
  rtt ${rttPreset === 'metro' ? '30ms' : rttPreset === 'datacenter' ? '10ms' : '100ms'} \\
  split-gso atm none`}
            </pre>
            <div className="mt-2 text-[10px] text-on-surface-variant flex items-center justify-between">
              <span>Netlink Status: Socket #14 connected</span>
              <span className="text-secondary flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Safety Rollback Armed
              </span>
            </div>
          </div>

          {/* Quick Engine Status Card */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-on-surface-variant flex items-center justify-between mb-3">
              <span>Fair Queuing Buffer Distribution</span>
              <span className="text-secondary text-[11px]">8 / 8 Active Tiers</span>
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-secondary font-semibold">Tier 1: Voice (EF) / Low Latency</span>
                  <span className="text-on-surface">0 pkts queued (0.1ms delay)</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5">
                  <div className="bg-secondary h-1.5 rounded-full" style={{ width: '4%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-primary font-semibold">Tier 2: Interactive / Gaming (CS4)</span>
                  <span className="text-on-surface">1 pkt queued (0.4ms delay)</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-on-surface font-semibold">Tier 3: Best Effort / Web (CS0)</span>
                  <span className="text-on-surface">12 pkts queued (1.8ms delay)</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5">
                  <div className="bg-outline h-1.5 rounded-full" style={{ width: '38%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-tertiary font-semibold">Tier 4: Bulk Transfer / Backups (CS1)</span>
                  <span className="text-on-surface">19 pkts queued (2.4ms delay)</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5">
                  <div className="bg-tertiary h-1.5 rounded-full" style={{ width: '55%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Fair-Queued Active Streams Table */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-on-surface font-headline flex items-center gap-2">
              <Radio className="w-4 h-4 text-secondary animate-pulse" />
              Active Sub-Flow Fair-Queued Streams (eBPF Sched Inspection)
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Live kernel flow buckets managed by DRR++ deficit round-robin and CoDel queue state
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-on-surface-variant">Flows: {streams.length}</span>
            <button
              onClick={() => {
                setStreams(prev => [
                  ...prev.map(s => ({
                    ...s,
                    ecnMarks: s.ecnMarks + Math.floor(Math.random() * 3),
                  }))
                ]);
              }}
              className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface text-xs font-mono rounded flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3 h-3 text-secondary" />
              <span>Poll Flows</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-surface-container border-b border-outline-variant text-on-surface-variant text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Flow ID / Peer</th>
                <th className="py-2.5 px-4 font-semibold">Application / Protocol</th>
                <th className="py-2.5 px-4 font-semibold">Priority Tier</th>
                <th className="py-2.5 px-4 font-semibold">Queue Depth</th>
                <th className="py-2.5 px-4 font-semibold">ECN Marks</th>
                <th className="py-2.5 px-4 font-semibold">Drops</th>
                <th className="py-2.5 px-4 font-semibold">Throughput</th>
                <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-on-surface">
              {streams.map((stream) => (
                <tr key={stream.id} className="hover:bg-surface-container-high/40 transition">
                  <td className="py-3 px-4 font-bold text-primary flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    {stream.sourceTarget}
                  </td>
                  <td className="py-3 px-4 text-on-surface">
                    <span className="font-sans font-medium">{stream.appLabel}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      stream.tierColor === 'secondary'
                        ? 'bg-secondary/20 text-secondary border border-secondary/40'
                        : stream.tierColor === 'primary'
                        ? 'bg-primary/20 text-primary border border-primary/40'
                        : stream.tierColor === 'tertiary'
                        ? 'bg-tertiary/20 text-tertiary border border-tertiary/40'
                        : 'bg-surface-container text-on-surface-variant border border-outline-variant'
                    }`}>
                      {stream.priorityTier}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant">{stream.queueDepth}</td>
                  <td className="py-3 px-4 font-bold text-secondary">{stream.ecnMarks}</td>
                  <td className="py-3 px-4 text-error font-bold">{stream.drops}</td>
                  <td className="py-3 px-4 font-bold text-on-surface">{stream.throughput}</td>
                  <td className="py-3 px-4 text-right">
                    <button 
                      onClick={() => onOpenModal('fq-codel-tuning')}
                      className="text-primary hover:underline text-[11px]"
                    >
                      Tune Bucket
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
