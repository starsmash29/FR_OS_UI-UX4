import React, { useState } from 'react';

interface TcQdiscInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TcQdiscInspectorModal: React.FC<TcQdiscInspectorModalProps> = ({ isOpen, onClose }) => {
  const [selectedDev, setSelectedDev] = useState('eth0');
  const [queryMode, setQueryMode] = useState('qdisc');
  const [grepFilter, setGrepFilter] = useState('cake ack-filter');
  const [cliCmd, setCliCmd] = useState('tc qdisc change dev eth0 root cake bandwidth 50mbit diffserv4 ack-filter');
  const [executedFeedback, setExecutedFeedback] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleModifier = (action: string) => {
    if (action === 'bw') {
      setCliCmd('tc qdisc change dev eth0 root cake bandwidth 100mbit diffserv4 ack-filter');
    } else if (action === 'ack') {
      setCliCmd((prev) => prev.includes('ack-filter') ? prev.replace('ack-filter', 'no-ack-filter') : prev + ' ack-filter');
    } else if (action === 'diffserv') {
      setCliCmd((prev) => prev.includes('diffserv4') ? prev.replace('diffserv4', 'diffserv3') : prev.replace('diffserv3', 'diffserv4'));
    } else if (action === 'reset') {
      setCliCmd('tc -s qdisc show dev eth0');
    }
  };

  const executeCmd = (isDryRun = false) => {
    if (isDryRun) {
      setExecutedFeedback('Dry-Run: NETLINK rtnl_talk() syntax validated. No packets dropped.');
    } else {
      setExecutedFeedback('Committed: Netlink socket FD #18 returned EXIT 0. Cake qdisc synchronized.');
    }
    setTimeout(() => setExecutedFeedback(null), 3500);
  };

  return (
    <div className="fixed inset-0 bg-surface-dim/80 backdrop-blur-md z-50 flex items-center justify-center p-gutter pointer-events-auto overflow-y-auto">
      <div className="relative w-full max-w-[1420px] max-h-[962px] flex flex-col bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden border border-outline-variant/40">
        {/* Glowing hairline highlight accents */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/80 to-transparent"></div>

        {/* 1. MODAL HEADER */}
        <header className="relative px-space-xl py-space-md bg-surface-container-low flex flex-wrap items-center justify-between gap-space-md shrink-0 border-b border-outline-variant/30">
          <div className="flex items-center gap-space-md min-w-0">
            <div className="flex items-center gap-space-sm shrink-0">
              <img
                alt="FR_OS Logo"
                className="h-7 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1WPKRcOXkcZgtJ0SxofeSvq-4XjCZ3kYiWwzevdFqjei30cX5hu2FUKswPX-5iMepGKSoGk7Xf-jJHwM8P-nBZCEOZq2bJY3HR0X94n_tggpvGknSy8r__Xnb0uDTUE7-zTTSUz3VvqUbSEq5056hvwVCWnpuVj_613KyMY5wEpb1YaX4mnGrxqmxc17T9d7MIJ1sRh92OzwudOzbmlNkmz1UFok-yvGfCEMhR7c_gtZgOxN8lUCn_Uf-9o"
              />
              <span className="font-headline-sm text-headline-sm font-semibold tracking-wider text-on-surface">FR_OS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            </div>
            <div className="h-6 w-px bg-surface-bright hidden sm:block"></div>
            <div className="min-w-0">
              <div className="flex items-center gap-space-sm flex-wrap">
                <h1 className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">
                  tc qdisc Raw Kernel Queue Inspector & Tree Topology
                </h1>
                <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-surface-container text-primary font-mono tracking-normal">
                  // KERNEL_NET_SCHED_SUBSYSTEM_V5.15
                </span>
              </div>
              <div className="flex items-center gap-space-md mt-1 font-label-sm text-label-sm text-outline flex-wrap">
                <span className="flex items-center gap-1.5 text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> NETLINK RTNETLINK SOCK: CONNECTED
                </span>
                <span className="text-surface-bright">|</span>
                <span className="text-on-surface-variant">KERNEL HOOK: <span className="text-on-surface">clsact / root / ingress / egress</span></span>
                <span className="text-surface-bright">|</span>
                <span className="text-on-surface-variant">DRIVER OFFLOAD: <span className="text-primary-container font-mono">eBPF XDP / TC-ACT</span></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-space-sm shrink-0">
            <button
              onClick={() => {
                setExecutedFeedback('Netlink dump auto-refreshed (0.01ms query time).');
                setTimeout(() => setExecutedFeedback(null), 2500);
              }}
              className="flex items-center gap-1.5 px-space-sm py-space-xs rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-label-md transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
              <span>Live Refresh (1s)</span>
            </button>
            <button
              onClick={() => {
                const dump = `qdisc cake 8001: root refcnt 2 bandwidth 50Mbit besteffort diffserv4 ack-filter\nSent 19320849208 bytes 142850912 pkt (dropped 0, overlimits 142)`;
                const blob = new Blob([dump], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `tc_qdisc_dump_${selectedDev}.txt`;
                a.click();
              }}
              className="flex items-center gap-1 px-space-sm py-space-xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Export Dump</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(cliCmd);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-1 px-space-sm py-space-xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              <span>{copied ? 'Copied!' : 'Copy CLI'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors ml-1"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </header>

        {/* 2. QUICK INTERFACE SELECTOR & QUERY CONTROLS */}
        <section className="px-space-xl py-space-sm bg-surface-container-lowest flex flex-col gap-space-sm shrink-0 border-b border-outline-variant/20">
          <div className="flex items-center justify-between gap-space-md flex-wrap">
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider mr-1">Target Dev:</span>
              <button
                onClick={() => setSelectedDev('eth0')}
                className={`flex items-center gap-1.5 px-space-md py-1 rounded font-label-md text-label-md font-semibold transition-all ${
                  selectedDev === 'eth0'
                    ? 'bg-primary-container text-on-primary-container shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">lan</span>
                <span>eth0 (WAN Fiber - 10G SFP+) [ACTIVE: CAKE root]</span>
              </button>
              <button
                onClick={() => setSelectedDev('eth1')}
                className={`flex items-center gap-1.5 px-space-md py-1 rounded font-label-md text-label-md transition-all ${
                  selectedDev === 'eth1'
                    ? 'bg-primary-container text-on-primary-container shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">lan</span>
                <span>eth1 (LAN Core - 2.5G) [FQ_CoDel]</span>
              </button>
              <button
                onClick={() => setSelectedDev('vlan20')}
                className={`flex items-center gap-1.5 px-space-md py-1 rounded font-label-md text-label-md transition-all ${
                  selectedDev === 'vlan20'
                    ? 'bg-primary-container text-on-primary-container shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">alt_route</span>
                <span>vlan20 (IoT Sandbox) [HTB+TBF]</span>
              </button>
              <button
                onClick={() => setSelectedDev('bond0')}
                className={`flex items-center gap-1.5 px-space-md py-1 rounded font-label-md text-label-md transition-all ${
                  selectedDev === 'bond0'
                    ? 'bg-primary-container text-on-primary-container shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">hub</span>
                <span>bond0 (LACP Trunk)</span>
              </button>
            </div>
            <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-secondary">
              <span className="material-symbols-outlined text-[16px]">speed</span>
              <span>SHAPER ENGAGED: 50.0 Mbit/s</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-space-md flex-wrap pt-space-xs">
            <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded">
              <button
                onClick={() => setQueryMode('qdisc')}
                className={`px-space-sm py-1 rounded font-label-sm text-label-sm font-semibold transition-all ${
                  queryMode === 'qdisc' ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                tc -s -d qdisc show dev {selectedDev}
              </button>
              <button
                onClick={() => setQueryMode('class')}
                className={`px-space-sm py-1 rounded font-label-sm text-label-sm transition-all ${
                  queryMode === 'class' ? 'bg-surface-container-highest text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                tc -s class show dev {selectedDev}
              </button>
              <button
                onClick={() => setQueryMode('filter')}
                className={`px-space-sm py-1 rounded font-label-sm text-label-sm transition-all ${
                  queryMode === 'filter' ? 'bg-surface-container-highest text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                tc filter show dev {selectedDev}
              </button>
              <button
                onClick={() => setQueryMode('events')}
                className={`px-space-sm py-1 rounded font-label-sm text-label-sm transition-all ${
                  queryMode === 'events' ? 'bg-surface-container-highest text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Raw Netlink Netfilter Events
              </button>
            </div>

            <div className="relative flex-1 max-w-md min-w-[260px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[16px]">filter_alt</span>
              <input
                className="w-full pl-9 pr-3 py-1.5 bg-surface-container-low rounded font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container transition-all border border-outline-variant/30"
                placeholder="Grep params, handles, tins, or drop metrics..."
                type="text"
                value={grepFilter}
                onChange={(e) => setGrepFilter(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* 3. TELEMETRY & QUEUE METRICS RIBBON (4 KPI Cards) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm px-space-xl py-space-sm bg-surface-container-low shrink-0 border-b border-outline-variant/30">
          <div className="bg-surface-container p-space-sm rounded flex flex-col justify-between">
            <div className="flex items-center justify-between text-outline font-label-sm text-label-sm mb-1">
              <span className="uppercase tracking-wider">Root Qdisc</span>
              <span className="text-secondary font-mono">ACTIVE</span>
            </div>
            <div className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate flex items-center gap-1.5">
              <span className="text-primary font-mono text-[14px]">8001:</span>
              <span>cake handle root</span>
            </div>
            <div className="text-outline font-body-sm text-body-sm mt-1 truncate">
              Target: <span className="text-on-surface">5.0ms</span> | BW: <span className="text-primary">50.0 Mbit</span>
            </div>
            <div className="text-on-surface-variant font-label-sm text-label-sm mt-0.5 truncate">
              diffserv4 // dual-srchost
            </div>
          </div>

          <div className="bg-surface-container p-space-sm rounded flex flex-col justify-between">
            <div className="flex items-center justify-between text-outline font-label-sm text-label-sm mb-1">
              <span className="uppercase tracking-wider">Aggregated Sent & Rate</span>
              <span className="material-symbols-outlined text-[16px] text-primary">analytics</span>
            </div>
            <div className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">
              184.2 GB <span className="text-outline font-normal text-body-sm">/ 142.8M pkts</span>
            </div>
            <div className="text-outline font-body-sm text-body-sm mt-1 truncate">
              Current Rate: <span className="text-secondary font-semibold">48.2 Mbps</span>
            </div>
            <div className="text-on-surface-variant font-label-sm text-label-sm mt-0.5 truncate">
              Throughput: 4,120 pps
            </div>
          </div>

          <div className="bg-surface-container p-space-sm rounded flex flex-col justify-between">
            <div className="flex items-center justify-between text-outline font-label-sm text-label-sm mb-1">
              <span className="uppercase tracking-wider">Backlog & Queue Depth</span>
              <span className="text-secondary font-label-sm text-label-sm">HEALTHY</span>
            </div>
            <div className="font-headline-sm text-headline-sm text-secondary font-semibold truncate">
              0 bytes <span className="text-outline font-normal text-body-sm">/ 0 pkts</span>
            </div>
            <div className="text-outline font-body-sm text-body-sm mt-1 truncate">
              Drops: <span className="text-secondary">0 req</span> | Overlimits: <span className="text-primary">142</span>
            </div>
            <div className="text-on-surface-variant font-label-sm text-label-sm mt-0.5 truncate">
              ECN Marks: <span className="text-tertiary">84 marked</span>
            </div>
          </div>

          <div className="bg-surface-container p-space-sm rounded flex flex-col justify-between">
            <div className="flex items-center justify-between text-outline font-label-sm text-label-sm mb-1">
              <span className="uppercase tracking-wider">Slab & Flow Memory</span>
              <span className="text-outline font-mono">1,024 BINS</span>
            </div>
            <div className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">
              38.4 KB <span className="text-outline font-normal text-body-sm">/ 4,096 KB</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-1 mt-1.5 overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '8%' }}></div>
            </div>
            <div className="text-outline font-body-sm text-body-sm mt-1 flex justify-between items-center truncate">
              <span>Way Collisions: <span className="text-secondary">0</span></span>
              <span className="text-primary font-mono text-[10px]">COBALT ACTIVE</span>
            </div>
          </div>
        </section>

        {/* 4. DUAL PANE VIEW: Tree vs Terminal */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter px-space-xl py-space-md flex-1 overflow-y-auto bg-surface">
          {/* Left Pane: Tree Hierarchy */}
          <div className="lg:col-span-5 flex flex-col gap-space-md min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[18px] text-primary">account_tree</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-medium">Qdisc Tree & Tin Topology</span>
              </div>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono">
                {selectedDev}::tree
              </span>
            </div>

            <div className="flex flex-col gap-space-sm">
              <div className="p-space-md rounded-lg bg-surface-container-low shadow-sm border border-outline-variant/30">
                <div className="flex items-start justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[18px]">dns</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-label-md text-label-md font-bold text-primary font-mono">root 8001:</span>
                        <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-highest text-secondary uppercase font-mono">
                          CAKE
                        </span>
                      </div>
                      <div className="font-body-sm text-body-sm text-outline mt-0.5">
                        dev {selectedDev} // refcnt 2 // rtt 100.0ms
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-md text-label-md text-secondary font-mono font-semibold">50.0 Mbit</span>
                    <div className="font-label-sm text-label-sm text-outline">diffserv4</div>
                  </div>
                </div>

                <div className="mt-space-md ml-3.5 pl-space-md flex flex-col gap-space-sm relative">
                  <div className="absolute left-0 top-0 bottom-3 w-px bg-surface-bright"></div>

                  {/* Tin 0: Bulk */}
                  <div className="relative bg-surface-container p-space-sm rounded">
                    <div className="absolute -left-[17px] top-4 w-3.5 h-px bg-surface-bright"></div>
                    <div className="flex items-center justify-between gap-space-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-outline"></span>
                        <span className="font-label-md text-label-md font-bold text-on-surface">Tin 0: Bulk</span>
                        <span className="font-label-sm text-label-sm text-outline font-mono">(CS1)</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface font-mono font-semibold">3.12 Mbps</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 pt-2 bg-surface-container-low/50 p-1.5 rounded font-body-sm text-body-sm">
                      <div><span className="text-outline block text-[10px]">DELAY</span><span className="text-on-surface font-mono">4.8 ms</span></div>
                      <div><span className="text-outline block text-[10px]">DROPS</span><span className="text-secondary font-mono">0</span></div>
                      <div><span className="text-outline block text-[10px]">BACKLOG</span><span className="text-outline font-mono">0 pkts</span></div>
                    </div>
                  </div>

                  {/* Tin 1: Best Effort */}
                  <div className="relative bg-surface-container p-space-sm rounded shadow-sm border border-primary/30">
                    <div className="absolute -left-[17px] top-4 w-3.5 h-px bg-surface-bright"></div>
                    <div className="flex items-center justify-between gap-space-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        <span className="font-label-md text-label-md font-bold text-primary">Tin 1: Best Effort</span>
                        <span className="font-label-sm text-label-sm text-outline font-mono">(CS0)</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-primary font-mono font-semibold">34.2 Mbps</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 pt-2 bg-surface-container-low/50 p-1.5 rounded font-body-sm text-body-sm">
                      <div><span className="text-outline block text-[10px]">DELAY</span><span className="text-on-surface font-mono">1.8 ms</span></div>
                      <div><span className="text-outline block text-[10px]">DROPS</span><span className="text-secondary font-mono">0</span></div>
                      <div><span className="text-outline block text-[10px]">ECN MARKS</span><span className="text-tertiary font-mono">62</span></div>
                    </div>
                  </div>

                  {/* Tin 2: Video */}
                  <div className="relative bg-surface-container p-space-sm rounded">
                    <div className="absolute -left-[17px] top-4 w-3.5 h-px bg-surface-bright"></div>
                    <div className="flex items-center justify-between gap-space-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-secondary"></span>
                        <span className="font-label-md text-label-md font-bold text-on-surface">Tin 2: Video / Interactive</span>
                        <span className="font-label-sm text-label-sm text-outline font-mono">(CS4)</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface font-mono font-semibold">10.5 Mbps</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 pt-2 bg-surface-container-low/50 p-1.5 rounded font-body-sm text-body-sm">
                      <div><span className="text-outline block text-[10px]">DELAY</span><span className="text-on-surface font-mono">0.8 ms</span></div>
                      <div><span className="text-outline block text-[10px]">DROPS</span><span className="text-secondary font-mono">0</span></div>
                      <div><span className="text-outline block text-[10px]">ECN MARKS</span><span className="text-tertiary font-mono">22</span></div>
                    </div>
                  </div>

                  {/* Tin 3: Voice */}
                  <div className="relative bg-surface-container p-space-sm rounded">
                    <div className="absolute -left-[17px] top-4 w-3.5 h-px bg-surface-bright"></div>
                    <div className="flex items-center justify-between gap-space-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                        <span className="font-label-md text-label-md font-bold text-tertiary">Tin 3: Voice / Priority</span>
                        <span className="font-label-sm text-label-sm text-outline font-mono">(EF)</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface font-mono font-semibold">2.1 Mbps</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 pt-2 bg-surface-container-low/50 p-1.5 rounded font-body-sm text-body-sm">
                      <div><span className="text-outline block text-[10px]">DELAY</span><span className="text-secondary font-mono font-semibold">0.0 ms</span></div>
                      <div><span className="text-outline block text-[10px]">DROPS</span><span className="text-secondary font-mono">0</span></div>
                      <div><span className="text-outline block text-[10px]">ACK-FILTER</span><span className="text-primary font-mono">820 ack</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingress Hook Branch */}
              <div className="p-space-sm rounded bg-surface-container-low flex items-center justify-between border border-outline-variant/30">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">memory</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-label-md text-label-md font-mono text-tertiary">qdisc clsact ffff:</span>
                      <span className="font-label-sm text-label-sm px-1 py-0.2 rounded bg-tertiary/10 text-tertiary font-mono">INGRESS / EGRESS</span>
                    </div>
                    <div className="font-body-sm text-body-sm text-outline">
                      filter: prog_xdp_tc_filter.o [id 419] direct-action
                    </div>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
              </div>
            </div>
          </div>

          {/* Right Pane: Live Terminal Canvas */}
          <div className="lg:col-span-7 flex flex-col bg-surface-container-lowest rounded-lg overflow-hidden shadow-lg min-w-0 border border-outline-variant/30">
            <div className="px-space-md py-space-xs bg-surface-container-low flex items-center justify-between gap-space-sm border-b border-outline-variant/30">
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-error/60"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary/60"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary/60"></span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-mono truncate">
                  Live Console // tc -s -d -p qdisc show dev {selectedDev}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-label-sm text-label-sm font-mono">
                  3 Grep Hits
                </span>
              </div>
            </div>

            <div className="p-space-md overflow-x-auto overflow-y-auto flex-1 font-body-sm text-body-sm leading-relaxed text-on-surface bg-surface-container-lowest font-mono select-text space-y-1">
              <div className="text-outline"># Kernel Traffic Control Subsystem v5.15-rt (x86_64)</div>
              <div className="text-outline"># Real-time Netlink socket stream query on interface {selectedDev}...</div>
              <div className="pt-1">
                <span className="text-primary font-bold">qdisc</span> <span className="text-secondary font-semibold">cake</span> <span className="text-tertiary font-bold">8001:</span> <span className="text-primary font-bold">root</span> <span className="text-on-surface-variant">refcnt 2</span> <span className="text-primary font-semibold">bandwidth</span> <span className="text-secondary">50Mbit</span> <span className="text-on-surface-variant">besteffort triple-isolate nonat</span> <span className="bg-primary/20 text-primary px-1 rounded font-bold">diffserv4</span> <span className="text-on-surface-variant">zero_rates</span> <span className="text-on-surface-variant">ptm</span> <span className="text-on-surface-variant">no-split-gso</span> <span className="text-on-surface-variant">rtt 100ms nohelp</span> <span className="bg-primary/20 text-primary px-1 rounded font-bold">ack-filter</span>
              </div>
              <div className="text-on-surface-variant pl-4">
                Sent 19320849208 bytes 142850912 pkt (dropped 0, overlimits 142 requeues 0)
              </div>
              <div className="text-outline pl-4">
                backlog <span className="text-secondary">0b</span> <span className="text-secondary">0p</span> requeues 0
              </div>
              <div className="text-outline pl-4">
                memory used: <span className="text-primary font-medium">393216b</span> of <span className="text-on-surface">4194304b</span>
              </div>
              <div className="text-outline pl-4">
                capacity estimate: <span className="text-secondary font-medium">50Mbit</span> | min netlen 46b | max netlen 1514b
              </div>

              <div className="pt-2 text-primary font-semibold">// TIN DECOMPOSITION & COBALT ALGORITHM STATUS:</div>
              <div className="bg-surface-container-low/40 p-1.5 rounded space-y-1 font-mono text-[11px]">
                <div>
                  <span className="text-outline font-bold">tin 0 (Bulk)</span> <span className="text-on-surface-variant">quota 1514b delay</span> <span className="text-on-surface">4.8ms</span> <span className="text-outline">target 5.0ms</span>
                </div>
                <div className="text-outline pl-4">
                  pkts 128490 bytes 192840192 <span className="text-secondary">drops 0</span> marks 0 <span className="text-primary font-medium">ack-drops 12</span>
                </div>
              </div>
              <div className="bg-surface-container-low/80 p-1.5 rounded space-y-1 font-mono text-[11px] border border-primary/20">
                <div>
                  <span className="text-primary font-bold">tin 1 (Best Effort)</span> <span className="text-on-surface-variant">quota 1514b delay</span> <span className="text-primary">1.8ms</span> <span className="text-outline">target 5.0ms</span>
                </div>
                <div className="text-outline pl-4">
                  pkts 8920194 bytes 1294801928 <span className="text-secondary">drops 0</span> <span className="text-tertiary font-bold">marks 62</span> <span className="text-primary font-bold">ack-drops 820</span>
                </div>
              </div>
              <div className="bg-surface-container-low/40 p-1.5 rounded space-y-1 font-mono text-[11px]">
                <div>
                  <span className="text-secondary font-bold">tin 2 (Video)</span> <span className="text-on-surface-variant">quota 1514b delay</span> <span className="text-secondary">0.8ms</span> <span className="text-outline">target 5.0ms</span>
                </div>
                <div className="text-outline pl-4">
                  pkts 412098 bytes 49201920 <span className="text-secondary">drops 0</span> <span className="text-tertiary">marks 22</span>
                </div>
              </div>
              <div className="bg-surface-container-low/40 p-1.5 rounded space-y-1 font-mono text-[11px]">
                <div>
                  <span className="text-tertiary font-bold">tin 3 (Voice)</span> <span className="text-on-surface-variant">quota 1514b delay</span> <span className="text-secondary font-bold">0.0ms</span> <span className="text-outline">target 5.0ms</span>
                </div>
                <div className="text-outline pl-4">
                  pkts 92840 bytes 12849102 <span className="text-secondary">drops 0</span> marks 0
                </div>
              </div>

              <div className="pt-2">
                <span className="text-primary font-bold">qdisc</span> <span className="text-tertiary font-semibold">clsact</span> <span className="text-tertiary font-bold">ffff:</span> <span className="text-on-surface-variant">dev {selectedDev}</span> <span className="text-outline">root refcnt 2</span>
              </div>
              <div className="text-outline pl-4">
                filter protocol all pref 49152 bpf direct-action obj <span className="text-on-surface font-semibold">prog_xdp_tc_filter.o</span> [tc_ingress] id 419
              </div>

              <div className="flex items-center gap-1 text-secondary pt-1">
                <span className="animate-pulse">❯</span>
                <span className="text-outline">// End of active netlink dump. Auto-refreshed 0.2s ago.</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. INTERACTIVE CLI RUNNER */}
        <section className="px-space-xl py-space-sm bg-surface-container-low shrink-0 flex flex-col gap-space-xs border-t border-outline-variant/30">
          <div className="flex items-center justify-between gap-space-md flex-wrap">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-primary">terminal</span>
              <span>Real-time Kernel tc Command Staging:</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => handleModifier('bw')}
                className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm transition-colors"
              >
                + Set Bandwidth
              </button>
              <button
                onClick={() => handleModifier('ack')}
                className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm transition-colors"
              >
                + Toggle ACK-Filter
              </button>
              <button
                onClick={() => handleModifier('diffserv')}
                className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm transition-colors"
              >
                + DiffServ Tin Preset
              </button>
              <button
                onClick={() => handleModifier('reset')}
                className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-error font-label-sm text-label-sm transition-colors"
              >
                + Reset Counters
              </button>
            </div>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap sm:flex-nowrap">
            <div className="flex-1 flex items-center bg-surface-container-lowest px-space-md py-space-xs rounded min-w-0 border border-outline-variant/30">
              <span className="font-label-md text-label-md text-primary font-mono mr-2 select-none">tc#</span>
              <input
                className="w-full bg-transparent font-body-sm text-body-sm text-secondary font-mono focus:outline-none placeholder:text-outline"
                type="text"
                value={cliCmd}
                onChange={(e) => setCliCmd(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-space-xs shrink-0 w-full sm:w-auto justify-end">
              <button
                onClick={() => executeCmd(true)}
                className="px-space-md py-space-xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors"
              >
                Dry-Run Test
              </button>
              <button
                onClick={() => executeCmd(false)}
                className="px-space-md py-space-xs rounded bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-fixed-dim transition-colors shadow-sm flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                <span>Execute tc Command</span>
              </button>
            </div>
          </div>

          {executedFeedback && (
            <div className="text-secondary font-mono text-[11px] pt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span>{executedFeedback}</span>
            </div>
          )}
        </section>

        {/* 6. MODAL FOOTER */}
        <footer className="px-space-xl py-space-sm bg-surface-container-lowest flex flex-wrap items-center justify-between gap-space-md shrink-0 border-t border-outline-variant/30">
          <div className="flex items-center gap-space-md font-label-sm text-label-sm text-outline flex-wrap">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span>Linux Kernel 5.15.0-89-generic</span>
            </span>
            <span>|</span>
            <span>SCH_CAKE: <span className="text-on-surface font-mono">built-in</span></span>
            <span>|</span>
            <span>NETLINK_ROUTE: <span className="text-secondary font-mono">FD #18 (OK)</span></span>
          </div>

          <div className="flex items-center gap-space-sm">
            <button
              onClick={() => {
                navigator.clipboard.writeText(`#!/bin/bash\n# FR_OS Netlink script\n${cliCmd}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface font-label-md text-label-md px-space-sm py-1 rounded hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">terminal</span>
              <span>Copy as Bash Script</span>
            </button>
            <button
              onClick={onClose}
              className="px-space-md py-1 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-label-md transition-colors"
            >
              Close Inspector
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
