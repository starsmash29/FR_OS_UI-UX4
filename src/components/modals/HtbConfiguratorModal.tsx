import React, { useState } from 'react';

interface HtbConfiguratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HtbConfiguratorModal: React.FC<HtbConfiguratorModalProps> = ({ isOpen, onClose }) => {
  const [selectedClassId, setSelectedClassId] = useState('1:110');
  const [rate, setRate] = useState(20);
  const [ceil, setCeil] = useState(80);
  const [prio, setPrio] = useState(1);
  const [quantum, setQuantum] = useState(2500);
  const [committed, setCommitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectNode = (id: string, defRate: number, defCeil: number, defPrio: number) => {
    setSelectedClassId(id);
    setRate(defRate);
    setCeil(defCeil);
    setPrio(defPrio);
  };

  const generatedCli = `tc class change dev eth0 parent 1:10 classid ${selectedClassId} htb rate ${rate}mbit ceil ${ceil}mbit prio ${prio} quantum ${quantum}`;

  return (
    <div className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-md z-50 flex items-center justify-center p-space-md xl:p-space-lg overflow-y-auto pointer-events-auto">
      <div className="relative w-full max-w-[1260px] max-h-[942px] bg-surface-container-lowest text-on-surface rounded-xl shadow-2xl flex flex-col overflow-hidden my-auto border border-outline-variant/30">
        {/* Modal Header */}
        <div className="px-space-lg py-space-md bg-surface-container flex flex-wrap items-center justify-between gap-space-md shrink-0 border-b border-outline-variant/30">
          <div className="flex items-center gap-space-md min-w-0">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-[20px]">account_tree</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-sm flex-wrap">
                <span className="font-headline-sm text-headline-sm font-semibold tracking-wide text-on-surface">
                  HTB Bandwidth Tree & Class Hierarchy Configurator
                </span>
                <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm tracking-widest uppercase">
                  STATUS: KERNEL_ACTIVE
                </span>
                <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-label-sm tracking-widest uppercase">
                  LINUX TC HTB
                </span>
                <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm tracking-wider">
                  DEF: 1:30 (Best-Effort)
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                // SCH_HTB RFC_CLASS_BASED_QDISC • HIERARCHICAL_TOKEN_BUCKET_V3.17 • NETLINK_SOCKET_SYNCED
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-xs shrink-0">
            <div className="hidden md:flex items-center gap-space-xs bg-surface-container-low px-space-xs py-0.5 rounded border border-outline-variant/30">
              <span className="font-label-sm text-label-sm text-on-surface-variant">PRESET:</span>
              <button
                onClick={() => { setRate(20); setCeil(80); }}
                className="px-space-xs py-0.5 rounded text-primary hover:bg-surface-container-high font-label-sm text-label-sm transition-colors"
              >
                1G/100M Fiber
              </button>
              <span className="text-on-surface-variant text-[10px]">/</span>
              <button
                onClick={() => { setRate(40); setCeil(95); }}
                className="px-space-xs py-0.5 rounded text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-colors"
              >
                500M Work+Game
              </button>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedCli);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-sm text-label-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">terminal</span>
              <span>{copied ? 'Copied!' : 'Raw tc CLI'}</span>
            </button>
            <button
              onClick={() => {
                setQuantum(2500);
                setFeedback('Quantum balanced to MTU scale (2500 bytes per deficit cycle).');
                setTimeout(() => setFeedback(null), 3000);
              }}
              className="flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-sm text-label-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">tune</span>
              <span>Balance Quantum</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded bg-surface-container-high hover:bg-surface-bright flex items-center justify-center text-on-surface-variant hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Subheader Scope Control Bar */}
        <div className="px-space-lg py-space-xs bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm shrink-0 border-b border-outline-variant/20">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Device Scope:</span>
            <div className="flex items-center gap-space-xs">
              <button className="px-space-sm py-0.5 rounded bg-primary-container text-on-primary-container font-label-md text-label-md font-semibold flex items-center gap-space-xs shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest"></span>
                <span>eth0 [WAN Uplink 1000M / 100M]</span>
              </button>
              <button className="px-space-sm py-0.5 rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md">
                eth1 [LAN Trunk 2.5G]
              </button>
              <button className="px-space-sm py-0.5 rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md">
                bond0 [LACP Mesh]
              </button>
            </div>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Token Borrowing:</span>
              <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-label-sm font-medium">
                ENABLED (Ceil Borrow Active)
              </span>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Default Class:</span>
              <span className="font-metric-display text-label-md text-primary font-semibold">1:30</span>
            </div>
          </div>
        </div>

        {/* Top Metrics Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-xs p-space-md bg-surface-container-lowest shrink-0 border-b border-outline-variant/30">
          <div className="p-space-sm rounded bg-surface-container-low flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Root Bandwidth Ceil</span>
              <span className="material-symbols-outlined text-primary text-[16px]">speed</span>
            </div>
            <div className="flex items-baseline gap-space-xs my-space-xs">
              <span className="font-metric-display text-headline-md text-primary font-bold">100.0</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Mbps Egress</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-1 overflow-hidden">
              <div className="bg-primary h-full" style={{ width: '78.4%' }}></div>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">Cur: 78.4 Mbps (78.4% util)</span>
          </div>

          <div className="p-space-sm rounded bg-surface-container-low flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Tree Topology</span>
              <span className="material-symbols-outlined text-secondary text-[16px]">schema</span>
            </div>
            <div className="flex items-baseline gap-space-xs my-space-xs">
              <span className="font-metric-display text-headline-md text-secondary font-bold">7</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Classes Active</span>
            </div>
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>1 Root • 2 Branch • 4 Leaf</span>
              <span className="text-secondary font-medium">0 Errors</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">Hierarchical Depth: 3 levels</span>
          </div>

          <div className="p-space-sm rounded bg-surface-container-low flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Dynamic Borrowing</span>
              <span className="material-symbols-outlined text-primary text-[16px]">swap_horiz</span>
            </div>
            <div className="flex items-baseline gap-space-xs my-space-xs">
              <span className="font-metric-display text-headline-md text-primary font-bold">24.6</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Mbps Shared</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-1 overflow-hidden">
              <div className="bg-secondary h-full" style={{ width: '32%' }}></div>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">From idle Bulk to Interactive</span>
          </div>

          <div className="p-space-sm rounded bg-surface-container-low flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Leaf Discipline</span>
              <span className="material-symbols-outlined text-tertiary text-[16px]">alt_route</span>
            </div>
            <div className="flex items-baseline gap-space-xs my-space-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Hybrid FQ_CoDel</span>
            </div>
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>Active Target: 3ms</span>
              <span className="text-secondary">0 Drops</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">Anti-Bufferbloat Active</span>
          </div>
        </div>

        {/* Main Dual-Column Interactive Body */}
        <div className="flex-1 overflow-y-auto p-space-md grid grid-cols-1 lg:grid-cols-12 gap-space-md">
          {/* Left Column: Interactive Tree Canvas (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-space-sm">
            <div className="flex items-center justify-between px-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">Bandwidth Hierarchy Tree</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">(Interactive Node Inspector)</span>
              </div>
              <div className="flex items-center gap-space-xs bg-surface-container-low p-0.5 rounded border border-outline-variant/20">
                <button className="px-space-sm py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">Tree Graph</button>
                <button className="px-space-sm py-0.5 rounded text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm">Tabular Matrix</button>
              </div>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-md overflow-x-auto border border-outline-variant/30">
              {/* Root Node 1:1 */}
              <div className="relative p-space-md rounded-lg bg-surface-container flex flex-col gap-space-xs shadow-md border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-primary text-on-primary font-metric-display text-label-sm font-bold">1:1</span>
                    <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">Root Shaping Trunk</span>
                    <span className="px-space-xs py-0.5 rounded bg-surface-container-highest text-primary font-label-sm text-label-sm">ROOT DISCIPLINE</span>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Prio: 0</span>
                    <button className="px-space-xs py-0.5 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-sm text-label-sm">+ Child</button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-space-xs mt-space-xs font-label-sm text-label-sm text-on-surface-variant">
                  <div>Rate: <span className="text-on-surface font-semibold">100.0 Mbps</span></div>
                  <div>Ceil: <span className="text-primary font-semibold">100.0 Mbps</span></div>
                  <div className="text-right">Usage: <span className="text-secondary font-semibold">78.4 Mbps</span></div>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: '78.4%' }}></div>
                </div>
              </div>

              {/* Branch Container */}
              <div className="pl-6 flex flex-col gap-space-md relative">
                <div className="absolute left-2 top-0 bottom-4 w-0.5 bg-surface-container-highest"></div>

                {/* Branch 1: 1:10 */}
                <div className="relative flex flex-col gap-space-sm">
                  <div className="absolute -left-4 top-5 w-4 h-0.5 bg-surface-container-highest"></div>
                  <div className="p-space-sm rounded-lg bg-surface-container flex flex-col gap-space-xs shadow-sm border border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs">
                        <span className="px-space-xs py-0.5 rounded bg-surface-container-highest text-secondary font-metric-display text-label-sm font-bold">1:10</span>
                        <span className="font-body-lg text-body-lg font-medium text-on-surface">Interactive & Real-Time</span>
                        <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-label-sm">BRANCH</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-secondary font-medium">Prio 0 • Q: 3000</span>
                    </div>
                    <div className="grid grid-cols-3 gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
                      <div>Rate: <span className="text-on-surface">30.0 Mbps</span></div>
                      <div>Ceil: <span className="text-primary">100.0 Mbps</span></div>
                      <div className="text-right">Cur: <span className="text-secondary font-medium">16.9 Mbps</span></div>
                    </div>
                  </div>

                  {/* Leaves under 1:10 */}
                  <div className="pl-6 flex flex-col gap-space-xs relative">
                    <div className="absolute left-2 top-0 bottom-3 w-0.5 bg-surface-container-highest"></div>

                    {/* Leaf 1:100 */}
                    <div className="relative flex items-center">
                      <div className="absolute -left-4 top-1/2 w-4 h-0.5 bg-surface-container-highest"></div>
                      <div
                        onClick={() => handleSelectNode('1:100', 10, 25, 0)}
                        className={`w-full p-space-sm rounded transition-colors flex items-center justify-between cursor-pointer border ${
                          selectedClassId === '1:100'
                            ? 'bg-surface-container-highest border-primary/50 ring-1 ring-primary/40'
                            : 'bg-surface-container-high hover:bg-surface-variant border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-space-sm">
                          <span className="font-metric-display text-label-md text-primary font-semibold">1:100</span>
                          <div className="flex flex-col">
                            <span className="font-body-md text-body-md text-on-surface font-medium">VoIP & Telephony (CS5/EF)</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">fq_codel • 10M rate / 25M ceil</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-space-md">
                          <div className="text-right">
                            <span className="font-metric-display text-label-md text-secondary font-bold">2.1</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant ml-1">Mbps</span>
                          </div>
                          <span className="px-space-xs py-0.5 rounded bg-surface-container-low text-secondary font-label-sm text-label-sm">Prio 0</span>
                        </div>
                      </div>
                    </div>

                    {/* Leaf 1:110 (Selected) */}
                    <div className="relative flex items-center">
                      <div className="absolute -left-4 top-1/2 w-4 h-0.5 bg-primary"></div>
                      <div
                        onClick={() => handleSelectNode('1:110', 20, 80, 1)}
                        className={`w-full p-space-sm rounded transition-colors flex items-center justify-between cursor-pointer border ${
                          selectedClassId === '1:110'
                            ? 'bg-surface-container-highest border-primary/60 ring-1 ring-primary/40 shadow-md'
                            : 'bg-surface-container-high hover:bg-surface-variant border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-space-sm">
                          <span className="px-space-xs py-0.5 rounded bg-primary text-on-primary font-metric-display text-label-sm font-bold">1:110</span>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-space-xs">
                              <span className="font-body-lg text-body-lg text-primary font-bold">Gaming & Low-Latency UDP</span>
                              <span className="px-space-xs py-0.5 rounded bg-primary-container text-on-primary-container font-label-sm text-label-sm">
                                INSPECTOR TARGET
                              </span>
                            </div>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">fq_codel (target 3ms) • 20M rate / 80M ceil</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-space-md">
                          <div className="text-right">
                            <span className="font-metric-display text-label-md text-primary font-bold">14.8</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant ml-1">Mbps</span>
                          </div>
                          <span className="px-space-xs py-0.5 rounded bg-surface-container-low text-primary font-label-sm text-label-sm font-semibold">Prio 1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Branch 2: 1:20 */}
                <div className="relative flex flex-col gap-space-sm">
                  <div className="absolute -left-4 top-5 w-4 h-0.5 bg-surface-container-highest"></div>
                  <div className="p-space-sm rounded-lg bg-surface-container flex flex-col gap-space-xs shadow-sm border border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs">
                        <span className="px-space-xs py-0.5 rounded bg-surface-container-highest text-tertiary font-metric-display text-label-sm font-bold">1:20</span>
                        <span className="font-body-lg text-body-lg font-medium text-on-surface">General & Workstations</span>
                        <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-tertiary font-label-sm text-label-sm">BRANCH</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Prio 3 • Q: 6000</span>
                    </div>
                    <div className="grid grid-cols-3 gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
                      <div>Rate: <span className="text-on-surface">50.0 Mbps</span></div>
                      <div>Ceil: <span className="text-primary">90.0 Mbps</span></div>
                      <div className="text-right">Cur: <span className="text-secondary font-medium">42.7 Mbps</span></div>
                    </div>
                  </div>

                  {/* Leaves under 1:20 */}
                  <div className="pl-6 flex flex-col gap-space-xs relative">
                    <div className="absolute left-2 top-0 bottom-3 w-0.5 bg-surface-container-highest"></div>
                    <div className="relative flex items-center">
                      <div className="absolute -left-4 top-1/2 w-4 h-0.5 bg-surface-container-highest"></div>
                      <div
                        onClick={() => handleSelectNode('1:200', 35, 70, 3)}
                        className={`w-full p-space-sm rounded transition-colors flex items-center justify-between cursor-pointer border ${
                          selectedClassId === '1:200'
                            ? 'bg-surface-container-highest border-primary/50 ring-1 ring-primary/40'
                            : 'bg-surface-container-high hover:bg-surface-variant border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-space-sm">
                          <span className="font-metric-display text-label-md text-on-surface-variant font-semibold">1:200</span>
                          <div className="flex flex-col">
                            <span className="font-body-md text-body-md text-on-surface font-medium">Office & Dev Workstation SSH/HTTPS</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">fq_codel • 35M rate / 70M ceil</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-space-md">
                          <span className="font-metric-display text-label-md text-on-surface font-semibold">31.2 Mbps</span>
                          <span className="px-space-xs py-0.5 rounded bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">Prio 3</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative flex items-center">
                      <div className="absolute -left-4 top-1/2 w-4 h-0.5 bg-surface-container-highest"></div>
                      <div
                        onClick={() => handleSelectNode('1:210', 15, 60, 4)}
                        className={`w-full p-space-sm rounded transition-colors flex items-center justify-between cursor-pointer border ${
                          selectedClassId === '1:210'
                            ? 'bg-surface-container-highest border-primary/50 ring-1 ring-primary/40'
                            : 'bg-surface-container-high hover:bg-surface-variant border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-space-sm">
                          <span className="font-metric-display text-label-md text-on-surface-variant font-semibold">1:210</span>
                          <div className="flex flex-col">
                            <span className="font-body-md text-body-md text-on-surface font-medium">Streaming & Media CDN Cache</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">sfq perturb 10 • 15M rate / 60M ceil</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-space-md">
                          <span className="font-metric-display text-label-md text-on-surface font-semibold">11.5 Mbps</span>
                          <span className="px-space-xs py-0.5 rounded bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">Prio 4</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Default Leaf: 1:30 */}
                <div className="relative flex items-center">
                  <div className="absolute -left-4 top-1/2 w-4 h-0.5 bg-surface-container-highest"></div>
                  <div
                    onClick={() => handleSelectNode('1:30', 20, 40, 6)}
                    className={`w-full p-space-sm rounded-lg flex items-center justify-between cursor-pointer shadow-sm border ${
                      selectedClassId === '1:30'
                        ? 'bg-surface-container-highest border-primary/50 ring-1 ring-primary/40'
                        : 'bg-surface-container hover:bg-surface-container-high border-outline-variant/20'
                    }`}
                  >
                    <div className="flex items-center gap-space-sm">
                      <span className="px-space-xs py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-metric-display text-label-sm font-bold">1:30</span>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-space-xs">
                          <span className="font-body-lg text-body-lg text-on-surface font-medium">Bulk / Background Downloads</span>
                          <span className="px-space-xs py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm">DEFAULT LEAF</span>
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">sfq • 20M rate / 40M ceil • Borrowing spare tokens</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-md">
                      <span className="font-metric-display text-label-md text-secondary font-bold">18.8 Mbps</span>
                      <span className="px-space-xs py-0.5 rounded bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">Prio 6</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Selected Class Parameter Inspector (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-sm">
            <div className="flex items-center justify-between px-space-xs">
              <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">Class Parameters Inspector</span>
              <span className="px-space-xs py-0.5 rounded bg-primary-container text-on-primary-container font-label-sm text-label-sm font-bold">
                NODE ({selectedClassId})
              </span>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container flex flex-col gap-space-md shadow-sm border border-outline-variant/30">
              <div className="grid grid-cols-3 gap-space-sm">
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Class ID</label>
                  <div className="flex items-center bg-surface-container-lowest px-space-sm py-1.5 rounded border border-outline-variant/30">
                    <span className="text-primary font-metric-display text-body-md font-bold">{selectedClassId}</span>
                  </div>
                </div>
                <div className="col-span-2 flex flex-col gap-space-xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Parent Handle</label>
                  <div className="bg-surface-container-lowest px-space-sm py-1.5 rounded flex items-center justify-between border border-outline-variant/30">
                    <span className="font-metric-display text-body-md text-on-surface">1:10 (Interactive)</span>
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">lock</span>
                  </div>
                </div>
              </div>

              {/* Bandwidth Sliders */}
              <div className="flex flex-col gap-space-md p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
                <div className="flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wider">
                      Guaranteed Rate (`rate`)
                    </span>
                    <span className="font-metric-display text-body-md text-secondary font-bold">{rate}.0 Mbps</span>
                  </div>
                  <input
                    className="w-full accent-secondary bg-surface-container-highest rounded-lg h-1.5 cursor-pointer"
                    max="100"
                    min="1"
                    type="range"
                    value={rate}
                    onChange={(e) => setRate(parseInt(e.target.value))}
                  />
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Committed information rate (CIR) always reserved.</span>
                </div>

                <div className="flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wider">
                      Maximum Burst Cap (`ceil`)
                    </span>
                    <span className="font-metric-display text-body-md text-primary font-bold">{ceil}.0 Mbps</span>
                  </div>
                  <input
                    className="w-full accent-primary bg-surface-container-highest rounded-lg h-1.5 cursor-pointer"
                    max="100"
                    min="1"
                    type="range"
                    value={ceil}
                    onChange={(e) => setCeil(parseInt(e.target.value))}
                  />
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Peak rate borrowed when parent branch has unallocated tokens.</span>
                </div>
              </div>

              {/* Priority Selector */}
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Scheduling Priority (`prio`)</label>
                <div className="grid grid-cols-5 gap-1 bg-surface-container-lowest p-1 rounded border border-outline-variant/30">
                  {[
                    { label: 'P0 Crit', val: 0 },
                    { label: 'P1 High', val: 1 },
                    { label: 'P3 Norm', val: 3 },
                    { label: 'P5 Low', val: 5 },
                    { label: 'P7 Bulk', val: 7 },
                  ].map((p) => (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => setPrio(p.val)}
                      className={`py-1 rounded text-center font-label-sm text-label-sm transition-all ${
                        prio === p.val
                          ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantum & Buffers */}
              <div className="grid grid-cols-3 gap-space-sm">
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Quantum (Bytes)</label>
                  <input
                    className="bg-surface-container-lowest px-space-sm py-1 rounded text-on-surface font-metric-display text-body-sm focus:outline-none border border-outline-variant/30"
                    type="number"
                    value={quantum}
                    onChange={(e) => setQuantum(parseInt(e.target.value) || 2500)}
                  />
                </div>
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Burst Buffer</label>
                  <input
                    className="bg-surface-container-lowest px-space-sm py-1 rounded text-on-surface font-metric-display text-body-sm focus:outline-none border border-outline-variant/30"
                    type="text"
                    defaultValue="1600b"
                  />
                </div>
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Cburst Buffer</label>
                  <input
                    className="bg-surface-container-lowest px-space-sm py-1 rounded text-on-surface font-metric-display text-body-sm focus:outline-none border border-outline-variant/30"
                    type="text"
                    defaultValue="1600b"
                  />
                </div>
              </div>

              {/* Attached Leaf Qdisc */}
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Attached Leaf Qdisc</label>
                <div className="bg-surface-container-lowest px-space-sm py-1.5 rounded flex items-center justify-between text-on-surface font-body-md border border-outline-variant/30">
                  <span>fq_codel (target 3ms, interval 100ms)</span>
                  <span className="material-symbols-outlined text-[18px] text-primary">expand_more</span>
                </div>
              </div>

              {/* Classification Rules */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Classification Rules (3 matches)</label>
                  <button className="font-label-sm text-label-sm text-primary hover:underline">+ Add Match</button>
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="px-space-xs py-0.5 rounded bg-surface-container-lowest text-primary font-label-sm text-label-sm flex items-center gap-1 border border-outline-variant/20">
                    <span>DSCP: EF / CS4</span>
                  </span>
                  <span className="px-space-xs py-0.5 rounded bg-surface-container-lowest text-on-surface font-label-sm text-label-sm flex items-center gap-1 border border-outline-variant/20">
                    <span>Port: 27015-27050 (Steam/UDP)</span>
                  </span>
                  <span className="px-space-xs py-0.5 rounded bg-surface-container-lowest text-secondary font-label-sm text-label-sm flex items-center gap-1 border border-outline-variant/20">
                    <span>Host: 192.168.10.45</span>
                  </span>
                </div>
              </div>

              {/* Sparkline Visualizer */}
              <div className="p-space-sm rounded-lg bg-surface-container-lowest flex flex-col gap-space-xs border border-outline-variant/30">
                <div className="flex items-center justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface-variant">Real-time Class Dispatch Rate (Past 60s)</span>
                  <span className="text-primary font-bold">14.8 Mbps Current</span>
                </div>
                <div className="w-full h-14 relative flex items-end">
                  <svg className="w-full h-full text-primary" fill="none" preserveAspectRatio="none" viewBox="0 0 300 60">
                    <line stroke="currentColor" strokeDasharray="2 2" strokeOpacity="0.25" strokeWidth="1" x1="0" x2="300" y1="6" y2="6"></line>
                    <line stroke="#4edea3" strokeDasharray="3 3" strokeOpacity="0.6" strokeWidth="1" x1="0" x2="300" y1="42" y2="42"></line>
                    <path d="M0,52 Q20,48 40,50 T80,44 T120,46 T160,38 T200,42 T240,46 T280,43 L300,45" fill="none" stroke="currentColor" strokeWidth="2"></path>
                    <path d="M0,52 Q20,48 40,50 T80,44 T120,46 T160,38 T200,42 T240,46 T280,43 L300,45 L300,60 L0,60 Z" fill="currentColor" fillOpacity="0.08"></path>
                  </svg>
                </div>
                <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant pt-1">
                  <span>0 Mbps</span>
                  <span className="text-secondary">Rate: {rate}M</span>
                  <span className="text-primary/60">Ceil: {ceil}M</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Netlink Action Footer */}
        <div className="px-space-lg py-space-sm bg-surface-container flex flex-wrap items-center justify-between gap-space-md shrink-0 border-t border-outline-variant/30">
          <div className="flex items-center gap-space-sm bg-surface-container-lowest px-space-md py-1.5 rounded max-w-xl min-w-0 overflow-hidden border border-outline-variant/30">
            <span className="material-symbols-outlined text-[16px] text-primary shrink-0">terminal</span>
            <span className="font-metric-display text-label-sm text-on-surface truncate select-all">
              {generatedCli}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedCli);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="shrink-0 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
            </button>
          </div>

          <div className="flex items-center gap-space-xs ml-auto">
            {feedback && (
              <span className="text-secondary font-mono text-label-sm mr-2">{feedback}</span>
            )}
            <button
              onClick={() => {
                setRate(20);
                setCeil(80);
              }}
              className="px-space-md py-space-xs rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-label-md transition-colors"
            >
              Revert Changes
            </button>
            <button
              onClick={() => {
                setFeedback('Dry-Run: HTB token bucket calculation balanced. Quantum valid.');
                setTimeout(() => setFeedback(null), 3000);
              }}
              className="px-space-md py-space-xs rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-label-md transition-colors flex items-center gap-space-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
              <span>Dry-Run Test</span>
            </button>
            <button
              onClick={() => {
                setCommitted(true);
                setTimeout(() => {
                  setCommitted(false);
                  onClose();
                }, 1200);
              }}
              className="px-space-lg py-space-xs rounded bg-primary text-on-primary font-headline-sm text-label-md font-bold hover:brightness-110 shadow-lg shadow-primary/20 transition-all flex items-center gap-space-xs"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>{committed ? 'HTB Committed ✓' : 'Commit HTB Tree to Kernel'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
