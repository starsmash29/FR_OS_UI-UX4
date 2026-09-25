import React from 'react';
import { 
  Cpu, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Network, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Radio, 
  Layers, 
  GitBranch, 
  Terminal, 
  Server, 
  Thermometer, 
  Clock, 
  Compass, 
  ChevronRight,
  Sparkles,
  Sliders
} from 'lucide-react';
import { ActiveModal, SystemTelemetry, ViewMode } from '../../types';

interface OverviewViewProps {
  telemetry: SystemTelemetry;
  onSelectView: (view: ViewMode) => void;
  onOpenModal: (modal: ActiveModal) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  telemetry,
  onSelectView,
  onOpenModal,
}) => {
  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-low border border-outline-variant/50 p-5 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-secondary/15 text-secondary font-semibold border border-secondary/30">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse mr-1.5"></span>
              ALL SUBSYSTEMS NOMINAL
            </span>
            <span className="text-xs font-mono text-on-surface-variant">FR_OS v4.8.2-enterprise • Host: node-01.lab.internal</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface font-headline tracking-wide mt-1.5">
            Network Operations & Real-Time Kernel Orchestration
          </h1>
          <p className="text-xs text-on-surface-variant max-w-3xl mt-1">
            Carrier-grade Linux routing platform with kernel-level eBPF packet acceleration, CAKE/FQ_CoDel zero-bufferbloat queuing, and automated Multi-WAN policy steering.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenModal('bufferbloat-bench')}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary hover:bg-primary-dim text-on-primary rounded-lg text-xs font-mono font-bold transition shadow-sm"
          >
            <Activity className="w-4 h-4" />
            <span>Run Benchmark</span>
          </button>
          <button
            onClick={() => onOpenModal('tc-qdisc-inspector')}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant rounded-lg text-xs font-mono transition"
          >
            <Terminal className="w-4 h-4 text-on-surface-variant" />
            <span>tc Inspector</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: System Load */}
        <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">CPU Load (8 Cores)</span>
            <Cpu className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-on-surface">{telemetry.cpuUsage}%</span>
            <span className="text-xs font-mono text-secondary">Governor: Schedutil</span>
          </div>
          <div className="mt-3 w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: `${telemetry.cpuUsage}%` }}></div>
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-mono text-on-surface-variant">
            <span>SoftIRQ: 1.8%</span>
            <span>Temp: {telemetry.temperature}°C</span>
          </div>
        </div>

        {/* Metric 2: Memory & Buffers */}
        <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">RAM (DDR5 ECC)</span>
            <Server className="w-4 h-4 text-secondary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-on-surface">{telemetry.ramUsage}%</span>
            <span className="text-xs font-mono text-on-surface-variant">6.1 / 16.0 GB</span>
          </div>
          <div className="mt-3 w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: `${telemetry.ramUsage}%` }}></div>
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-mono text-on-surface-variant">
            <span>SKB Cache: 1.2 GB</span>
            <span>Zero OOM</span>
          </div>
        </div>

        {/* Metric 3: Real-Time Aggregate Throughput */}
        <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">Active Throughput</span>
            <Zap className="w-4 h-4 text-tertiary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-tertiary">{telemetry.throughput}</span>
            <span className="text-xs font-mono text-on-surface-variant">{telemetry.packetRate}</span>
          </div>
          <div className="mt-3 w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
            <div className="bg-tertiary h-full rounded-full" style={{ width: '42%' }}></div>
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-mono text-on-surface-variant">
            <span>NIC Offload: Active</span>
            <span>RX/TX Ring: 4096</span>
          </div>
        </div>

        {/* Metric 4: Bufferbloat Rating */}
        <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">SQM Bufferbloat</span>
            <span className="text-[10px] font-mono bg-secondary/20 text-secondary px-1.5 py-0.5 rounded border border-secondary/30">Grade A+</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-secondary">+0.8 ms</span>
            <span className="text-xs font-mono text-on-surface-variant">under load</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
            <span>Qdisc: CAKE diffserv4</span>
            <span className="text-secondary font-bold">FQ Verified</span>
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-mono text-on-surface-variant">
            <span>Uptime: {telemetry.uptime}</span>
            <span className="text-primary cursor-pointer hover:underline" onClick={() => onOpenModal('bufferbloat-bench')}>Retest</span>
          </div>
        </div>
      </div>

      {/* Navigation Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Traffic Control & CAKE */}
        <div 
          onClick={() => onSelectView('traffic-shaping')}
          className="bg-surface-container-low border border-outline-variant/60 hover:border-primary/50 p-5 rounded-xl cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition">
              <Sliders className="w-5 h-5" />
            </div>
            <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition group-hover:translate-x-1" />
          </div>
          <h3 className="text-base font-bold text-on-surface mt-3">Traffic Shaping & SQM</h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Configure CAKE, FQ_CoDel, HTB bandwidth hierarchy, host isolation, and sub-flow fair queuing.
          </p>
          <div className="mt-3 text-[11px] font-mono text-primary flex items-center gap-1">
            <span>Manage Queues</span> &rarr;
          </div>
        </div>

        {/* Card 2: Multi-WAN & Routing */}
        <div 
          onClick={() => onSelectView('multi-wan')}
          className="bg-surface-container-low border border-outline-variant/60 hover:border-secondary/50 p-5 rounded-xl cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-secondary/10 text-secondary group-hover:bg-secondary/20 transition">
              <Network className="w-5 h-5" />
            </div>
            <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:text-secondary transition group-hover:translate-x-1" />
          </div>
          <h3 className="text-base font-bold text-on-surface mt-3">Policy-Based Routing & Multi-WAN</h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Manage Wan1/Wan2 failover, FIB routing tables, ECMP balance, and dynamic BGP/OSPF sessions.
          </p>
          <div className="mt-3 text-[11px] font-mono text-secondary flex items-center gap-1">
            <span>Configure Routing</span> &rarr;
          </div>
        </div>

        {/* Card 3: Real-Time Packet Inspector */}
        <div 
          onClick={() => onSelectView('live-log')}
          className="bg-surface-container-low border border-outline-variant/60 hover:border-tertiary/50 p-5 rounded-xl cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-tertiary/10 text-tertiary group-hover:bg-tertiary/20 transition">
              <Terminal className="w-5 h-5" />
            </div>
            <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:text-tertiary transition group-hover:translate-x-1" />
          </div>
          <h3 className="text-base font-bold text-on-surface mt-3">Kernel Netfilter & eBPF Logs</h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Inspect live dropped packets, XDP native security blocks, raw packet hexdump, and protocol decodes.
          </p>
          <div className="mt-3 text-[11px] font-mono text-tertiary flex items-center gap-1">
            <span>Open Log Console</span> &rarr;
          </div>
        </div>
      </div>

      {/* Network Subsystem Architecture Pipeline */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-5">
        <h3 className="text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-secondary" />
          FR_OS Kernel Packet Path & Datapath Architecture
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/40">
            <div className="text-[10px] font-mono text-on-surface-variant uppercase">Phase 1: Ingress Driver</div>
            <div className="font-mono text-xs font-bold text-primary mt-1">NIC XDP Driver Hook</div>
            <div className="text-[10px] text-on-surface-variant mt-1">eBPF native filter, DDoS SYN-proxy, zero-copy packet drop</div>
          </div>

          <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/40">
            <div className="text-[10px] font-mono text-on-surface-variant uppercase">Phase 2: Netfilter / NFT</div>
            <div className="font-mono text-xs font-bold text-on-surface mt-1">Conntrack & NAT44</div>
            <div className="text-[10px] text-on-surface-variant mt-1">Flow table acceleration, port forwarding, state tracking</div>
          </div>

          <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/40">
            <div className="text-[10px] font-mono text-on-surface-variant uppercase">Phase 3: Route Lookup</div>
            <div className="font-mono text-xs font-bold text-secondary mt-1">FIB PBR Dispatcher</div>
            <div className="text-[10px] text-on-surface-variant mt-1">Rule preference tables (100, 200), multi-WAN next-hop</div>
          </div>

          <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/40">
            <div className="text-[10px] font-mono text-on-surface-variant uppercase">Phase 4: Traffic Qdisc</div>
            <div className="font-mono text-xs font-bold text-tertiary mt-1">CAKE / FQ_CoDel SQM</div>
            <div className="text-[10px] text-on-surface-variant mt-1">DiffServ 4-tier queuing, ACK filter, sub-ms latency control</div>
          </div>

          <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/40">
            <div className="text-[10px] font-mono text-on-surface-variant uppercase">Phase 5: Wire Output</div>
            <div className="font-mono text-xs font-bold text-on-surface mt-1">Hardware Transmit Ring</div>
            <div className="text-[10px] text-on-surface-variant mt-1">TSO/GSO segmentation offload, fiber physical egress</div>
          </div>
        </div>
      </div>
    </div>
  );
};
