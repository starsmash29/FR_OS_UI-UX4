import React, { useState } from 'react';

interface GatewayWatchdogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivate?: () => void;
}

export const GatewayWatchdogModal: React.FC<GatewayWatchdogModalProps> = ({
  isOpen,
  onClose,
  onActivate,
}) => {
  const [lossTrigger, setLossTrigger] = useState(25);
  const [latencyDegraded, setLatencyDegraded] = useState(85);
  const [maxJitter, setMaxJitter] = useState(20);
  const [failCount, setFailCount] = useState(3);
  const [recoveryHold, setRecoveryHold] = useState(10);
  const [aggressiveProbe, setAggressiveProbe] = useState(true);
  const [flushConntrack, setFlushConntrack] = useState(true);
  const [failoverMode, setFailoverMode] = useState<'active-standby' | 'ecmp' | 'service-split'>('active-standby');
  const [testingProbe, setTestingProbe] = useState(false);
  const [activated, setActivated] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-surface-container-lowest/80 backdrop-blur-md overflow-y-auto pointer-events-auto">
      <div className="relative w-full max-w-5xl max-h-[942px] overflow-y-auto bg-surface-container-low rounded-xl shadow-[0_16px_50px_rgba(0,0,0,0.85)] flex flex-col border border-outline-variant/30">
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"></div>

        {/* Modal Header */}
        <div className="p-space-lg bg-surface-container-lowest flex items-start justify-between gap-space-lg border-b border-outline-variant/30">
          <div className="flex items-start gap-space-md">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shadow-sm mt-0.5 border border-outline-variant/30">
              <span className="material-symbols-outlined text-[24px]">alt_route</span>
            </div>
            <div>
              <div className="flex items-center gap-space-xs flex-wrap mb-1">
                <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm tracking-widest uppercase">
                  FR_OS // GATEWAY SENTINEL
                </span>
                <span className="text-on-surface-variant text-[10px]">•</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">DPDK/eBPF HEALTH ENGINE v4.8</span>
                <span className="text-on-surface-variant text-[10px]">•</span>
                <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                  FPING_PROBE: ACTIVE
                </span>
              </div>
              <h1 className="font-headline-md text-headline-md font-semibold text-on-surface tracking-tight">
                Multi-WAN Gateway Watchdog &amp; Failover Policy
                <span className="text-on-surface-variant font-body-sm text-body-sm font-normal ml-space-xs">
                  (Automatikus Átváltási Rendszer)
                </span>
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 max-w-2xl">
                Configure ICMP/TCP synthetic health probes, loss/jitter hysteresis thresholds, and automatic Netlink FIB route failover triggers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-space-lg space-y-space-lg">
          {/* SECTION 1: Monitored Gateways */}
          <div className="space-y-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface uppercase tracking-wide">
                  Section 01 // Monitored Uplink Gateways &amp; Health Probes
                </h2>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">MULTI-TARGET CONSENSUS VOTING</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
              {/* WAN1 */}
              <div className="bg-surface-container p-space-md rounded-lg flex flex-col justify-between space-y-space-sm relative overflow-hidden border border-outline-variant/30">
                <div>
                  <div className="flex items-start justify-between mb-space-xs">
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">WAN1 Primary Gateway</span>
                        <span className="px-space-xs py-0.5 rounded bg-surface-container-highest text-primary font-label-sm text-label-sm uppercase">DEFAULT FIB</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">eth0 • 198.51.100.1 • Fiber Transit AS13335</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-secondary/15 text-secondary font-label-sm text-label-sm font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                      ONLINE / ACTIVE
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-space-xs bg-surface-container-lowest p-space-xs rounded my-space-sm font-label-md text-label-md border border-outline-variant/20">
                    <div className="text-center">
                      <span className="text-on-surface-variant text-[10px] block">LATENCY</span>
                      <span className="text-secondary font-semibold">4.2 ms</span>
                    </div>
                    <div className="text-center">
                      <span className="text-on-surface-variant text-[10px] block">JITTER</span>
                      <span className="text-on-surface font-semibold">0.3 ms</span>
                    </div>
                    <div className="text-center">
                      <span className="text-on-surface-variant text-[10px] block">PKT LOSS</span>
                      <span className="text-secondary font-semibold">0.00 %</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Multi-Target Consensus:</span>
                    <div className="space-y-1 font-body-sm text-body-sm">
                      <div className="flex items-center justify-between px-space-sm py-1 rounded bg-surface-container-high">
                        <span className="text-on-surface">1.1.1.1 <span className="text-on-surface-variant">(Cloudflare Anycast)</span></span>
                        <div className="flex items-center gap-space-sm">
                          <span className="text-on-surface">4.1ms</span>
                          <span className="px-1 rounded bg-secondary/20 text-secondary font-label-sm text-label-sm font-bold">PASS</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-space-sm py-1 rounded bg-surface-container-high">
                        <span className="text-on-surface">8.8.8.8 <span className="text-on-surface-variant">(Google Public DNS)</span></span>
                        <div className="flex items-center gap-space-sm">
                          <span className="text-on-surface">4.4ms</span>
                          <span className="px-1 rounded bg-secondary/20 text-secondary font-label-sm text-label-sm font-bold">PASS</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-space-sm py-1 rounded bg-surface-container-high">
                        <span className="text-on-surface">198.51.100.1 <span className="text-on-surface-variant">(ISP Next-Hop GW)</span></span>
                        <div className="flex items-center gap-space-sm">
                          <span className="text-on-surface">1.2ms</span>
                          <span className="px-1 rounded bg-secondary/20 text-secondary font-label-sm text-label-sm font-bold">PASS</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-space-xs text-[11px] font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between bg-surface-container-low px-space-sm py-1 rounded border border-outline-variant/20">
                  <span>METHOD: <span className="text-primary font-medium">ICMP fping(0-copy)</span></span>
                  <span>INT: <span className="text-on-surface font-medium">500ms</span></span>
                  <span>TIMEOUT: <span className="text-on-surface font-medium">1000ms</span></span>
                  <span>BURST: <span className="text-on-surface font-medium">5 pkts</span></span>
                </div>
              </div>

              {/* WAN2 */}
              <div className="bg-surface-container p-space-md rounded-lg flex flex-col justify-between space-y-space-sm relative overflow-hidden border border-outline-variant/30">
                <div>
                  <div className="flex items-start justify-between mb-space-xs">
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">WAN2 Standby Gateway</span>
                        <span className="px-space-xs py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm uppercase">STANDBY FIB</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">eth1 • 203.0.113.1 • Starlink LEO Backup</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-primary/15 text-primary font-label-sm text-label-sm font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      STANDBY / READY
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-space-xs bg-surface-container-lowest p-space-xs rounded my-space-sm font-label-md text-label-md border border-outline-variant/20">
                    <div className="text-center">
                      <span className="text-on-surface-variant text-[10px] block">LATENCY</span>
                      <span className="text-primary font-semibold">38.6 ms</span>
                    </div>
                    <div className="text-center">
                      <span className="text-on-surface-variant text-[10px] block">JITTER</span>
                      <span className="text-on-surface font-semibold">4.8 ms</span>
                    </div>
                    <div className="text-center">
                      <span className="text-on-surface-variant text-[10px] block">PKT LOSS</span>
                      <span className="text-secondary font-semibold">0.00 %</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Multi-Target Consensus:</span>
                    <div className="space-y-1 font-body-sm text-body-sm">
                      <div className="flex items-center justify-between px-space-sm py-1 rounded bg-surface-container-high">
                        <span className="text-on-surface">1.0.0.1 <span className="text-on-surface-variant">(Cloudflare Secondary)</span></span>
                        <div className="flex items-center gap-space-sm">
                          <span className="text-on-surface">36.8ms</span>
                          <span className="px-1 rounded bg-secondary/20 text-secondary font-label-sm text-label-sm font-bold">PASS</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-space-sm py-1 rounded bg-surface-container-high">
                        <span className="text-on-surface">9.9.9.9 <span className="text-on-surface-variant">(Quad9 Security DNS)</span></span>
                        <div className="flex items-center gap-space-sm">
                          <span className="text-on-surface">41.2ms</span>
                          <span className="px-1 rounded bg-secondary/20 text-secondary font-label-sm text-label-sm font-bold">PASS</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-space-sm py-1 rounded bg-surface-container-high">
                        <span className="text-on-surface">203.0.113.1 <span className="text-on-surface-variant">(Dish Terminal v3)</span></span>
                        <div className="flex items-center gap-space-sm">
                          <span className="text-on-surface">1.8ms</span>
                          <span className="px-1 rounded bg-secondary/20 text-secondary font-label-sm text-label-sm font-bold">PASS</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-space-xs text-[11px] font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between bg-surface-container-low px-space-sm py-1 rounded border border-outline-variant/20">
                  <span>METHOD: <span className="text-primary font-medium">ICMP + TCP:443</span></span>
                  <span>INT: <span className="text-on-surface font-medium">1000ms</span></span>
                  <span>TIMEOUT: <span className="text-on-surface font-medium">2000ms</span></span>
                  <span>BURST: <span className="text-on-surface font-medium">3 pkts</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Health Thresholds & Flap Damping */}
          <div className="space-y-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface uppercase tracking-wide">
                  Section 02 // Health Thresholds &amp; Flap Damping (Hysteresis)
                </h2>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-bold">ANTI-FLAPPING STABILIZER ACTIVE</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
              <div className="bg-surface-container p-space-md rounded-lg space-y-space-md border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">Threshold Trigger Matrix</span>
                
                <div className="space-y-1">
                  <div className="flex justify-between font-label-md text-label-md">
                    <span className="text-on-surface">Packet Loss Down Trigger</span>
                    <span className="text-error font-semibold">&gt; {lossTrigger}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={lossTrigger}
                    onChange={(e) => setLossTrigger(parseInt(e.target.value))}
                    className="w-full accent-error bg-surface-container-highest rounded-full h-2 cursor-pointer"
                  />
                  <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                    <span>Evaluated over rolling 10-probe consensus</span>
                    <span>Drop Egress</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-label-md text-label-md">
                    <span className="text-on-surface">Latency Degraded Threshold</span>
                    <span className="text-primary font-semibold">&gt; {latencyDegraded} ms</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="200"
                    value={latencyDegraded}
                    onChange={(e) => setLatencyDegraded(parseInt(e.target.value))}
                    className="w-full accent-primary bg-surface-container-highest rounded-full h-2 cursor-pointer"
                  />
                  <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                    <span>Marks link DEGRADED (PBR reroutes low-latency packets)</span>
                    <span>{latencyDegraded} ms</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-label-md text-label-md">
                    <span className="text-on-surface">Max Jitter Variance</span>
                    <span className="text-tertiary-fixed-dim font-semibold">&gt; {maxJitter} ms</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={maxJitter}
                    onChange={(e) => setMaxJitter(parseInt(e.target.value))}
                    className="w-full accent-tertiary bg-surface-container-highest rounded-full h-2 cursor-pointer"
                  />
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Deviation threshold across sliding 60s window</span>
                </div>
              </div>

              <div className="bg-surface-container p-space-md rounded-lg space-y-space-md flex flex-col justify-between border border-outline-variant/20">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-space-sm">
                    Route Stability &amp; Damping Parameters
                  </span>
                  <div className="grid grid-cols-2 gap-space-sm font-label-md text-label-md">
                    <div className="bg-surface-container-low p-space-sm rounded border border-outline-variant/20">
                      <span className="text-on-surface-variant text-[11px] block">MARK GW DOWN AFTER</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-error font-headline-sm text-headline-sm font-bold">{failCount}</span>
                        <span className="text-on-surface-variant text-body-sm text-body-sm">burst fails</span>
                      </div>
                      <span className="text-[10px] text-on-surface-variant block mt-0.5">~1.5s detection latency</span>
                    </div>
                    <div className="bg-surface-container-low p-space-sm rounded border border-outline-variant/20">
                      <span className="text-on-surface-variant text-[11px] block">RECOVERY HOLD TIME</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-secondary font-headline-sm text-headline-sm font-bold">{recoveryHold}</span>
                        <span className="text-on-surface-variant text-body-sm text-body-sm">healthy probes</span>
                      </div>
                      <span className="text-[10px] text-on-surface-variant block mt-0.5">30s cooldown before fallback</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-space-xs pt-space-xs font-body-sm text-body-sm">
                  <label className="flex items-start gap-space-sm p-space-xs rounded bg-surface-container-low cursor-pointer border border-outline-variant/10">
                    <input
                      checked={aggressiveProbe}
                      onChange={(e) => setAggressiveProbe(e.target.checked)}
                      className="mt-0.5 rounded bg-surface-container-highest border-0 text-primary focus:ring-0"
                      type="checkbox"
                    />
                    <div className="flex-1">
                      <span className="text-on-surface font-medium block">Enable Aggressive Probe on First Packet Drop</span>
                      <span className="text-on-surface-variant text-[11px] block">Accelerates ping frequency from 500ms to 100ms when loss is detected.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-space-sm p-space-xs rounded bg-surface-container-low cursor-pointer border border-outline-variant/10">
                    <input
                      checked={flushConntrack}
                      onChange={(e) => setFlushConntrack(e.target.checked)}
                      className="mt-0.5 rounded bg-surface-container-highest border-0 text-primary focus:ring-0"
                      type="checkbox"
                    />
                    <div className="flex-1">
                      <span className="text-on-surface font-medium block">Flush Conntrack Sessions on Failover</span>
                      <span className="text-on-surface-variant text-[11px] block">Terminates stale TCP states in kernel conntrack to force instant reconnect over WAN2.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Failover Policy Mode */}
          <div className="space-y-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface uppercase tracking-wide">
                  Section 03 // Failover Routing Policy &amp; Switch Actions
                </h2>
              </div>
              <span className="font-label-sm text-label-sm text-primary">eBPF MULTIPATH / NETLINK 254</span>
            </div>

            <div className="bg-surface-container p-space-md rounded-lg space-y-space-md border border-outline-variant/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                <div
                  onClick={() => setFailoverMode('active-standby')}
                  className={`p-space-md rounded-lg flex flex-col justify-between cursor-pointer border transition-all ${
                    failoverMode === 'active-standby'
                      ? 'bg-surface-container-high border-primary ring-1 ring-primary/40'
                      : 'bg-surface-container-low hover:bg-surface-container-high border-outline-variant/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-headline-sm text-headline-sm font-semibold text-primary">Active / Standby</span>
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        {failoverMode === 'active-standby' ? 'radio_button_checked' : 'radio_button_unchecked'}
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm text-secondary uppercase block mb-1">Graceful Fallback Mode</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">All default egress routes to WAN1. Flips all FIB rules to WAN2 upon failure. Auto-returns after cooldown window.</p>
                  </div>
                  <span className="mt-space-sm font-label-sm text-label-sm text-on-surface-variant">PRIORITY 100 / 200</span>
                </div>

                <div
                  onClick={() => setFailoverMode('ecmp')}
                  className={`p-space-md rounded-lg flex flex-col justify-between cursor-pointer border transition-all ${
                    failoverMode === 'ecmp'
                      ? 'bg-surface-container-high border-primary ring-1 ring-primary/40'
                      : 'bg-surface-container-low hover:bg-surface-container-high border-outline-variant/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">Weighted ECMP</span>
                      <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                        {failoverMode === 'ecmp' ? 'radio_button_checked' : 'radio_button_unchecked'}
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">Bandwidth Ratio 80:20</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Simultaneous dual-WAN routing. Watchdog alters weights dynamically if jitter or latency degrades.</p>
                  </div>
                  <span className="mt-space-sm font-label-sm text-label-sm text-on-surface-variant">MULTIPATH EQUAL COST</span>
                </div>

                <div
                  onClick={() => setFailoverMode('service-split')}
                  className={`p-space-md rounded-lg flex flex-col justify-between cursor-pointer border transition-all ${
                    failoverMode === 'service-split'
                      ? 'bg-surface-container-high border-primary ring-1 ring-primary/40'
                      : 'bg-surface-container-low hover:bg-surface-container-high border-outline-variant/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">Per-Service Split</span>
                      <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                        {failoverMode === 'service-split' ? 'radio_button_checked' : 'radio_button_unchecked'}
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">L4/L7 Policy Driven</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Critical &amp; VoIP pinned to Fiber WAN1; Bulk downloads sent to WAN2. Dynamic shift during fiber drop.</p>
                  </div>
                  <span className="mt-space-sm font-label-sm text-label-sm text-on-surface-variant">APPLICATION AWARE</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Live Probe Simulation Sparkline */}
          <div className="bg-surface-container-lowest p-space-md rounded-lg space-y-space-xs border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[16px]">show_chart</span>
                <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider">
                  Live Synthetic Health Probe Stream (Rolling 30s Window)
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">RESOLUTION: 100MS TICKS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm pt-space-xs">
              <div className="bg-surface-container-low p-space-xs rounded border border-outline-variant/20">
                <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-1">
                  <span className="text-primary font-semibold">WAN1 (Fiber Transit 10G)</span>
                  <span className="text-secondary font-medium">Avg: 4.2ms • Stable</span>
                </div>
                <svg className="w-full h-8 overflow-hidden text-secondary" preserveAspectRatio="none" viewBox="0 0 300 32">
                  <path d="M0 24 L20 23 L40 25 L60 24 L80 23 L100 24 L120 22 L140 24 L160 25 L180 24 L200 23 L220 24 L240 22 L260 24 L280 23 L300 24" fill="none" stroke="currentColor" strokeWidth="1.75"></path>
                  <path d="M0 24 L20 23 L40 25 L60 24 L80 23 L100 24 L120 22 L140 24 L160 25 L180 24 L200 23 L220 24 L240 22 L260 24 L280 23 L300 24 L300 32 L0 32 Z" fill="currentColor" fillOpacity="0.12"></path>
                </svg>
              </div>

              <div className="bg-surface-container-low p-space-xs rounded border border-outline-variant/20">
                <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-1">
                  <span className="text-primary font-semibold">WAN2 (Starlink LEO 5G)</span>
                  <span className="text-primary font-medium">Avg: 38.6ms • Jitter ±3.2ms</span>
                </div>
                <svg className="w-full h-8 overflow-hidden text-primary" preserveAspectRatio="none" viewBox="0 0 300 32">
                  <path d="M0 16 L20 18 L40 12 L60 22 L80 14 L100 19 L120 11 L140 20 L160 16 L180 14 L200 24 L220 15 L240 18 L260 12 L280 20 L300 16" fill="none" stroke="currentColor" strokeWidth="1.75"></path>
                  <path d="M0 16 L20 18 L40 12 L60 22 L80 14 L100 19 L120 11 L140 20 L160 16 L180 14 L200 24 L220 15 L240 18 L260 12 L280 20 L300 16 L300 32 L0 32 Z" fill="currentColor" fillOpacity="0.12"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-space-lg bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-space-md border-t border-outline-variant/30">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>DAEMON: <span className="text-on-surface">/usr/sbin/fros-gateway-watchdogd</span></span>
            <span className="text-outline">[PID: 1420, eBPF XDP sock]</span>
          </div>

          <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-space-md py-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md text-body-md transition-colors"
            >
              Cancel &amp; Discard
            </button>
            <button
              onClick={() => {
                setTestingProbe(true);
                setTimeout(() => setTestingProbe(false), 2000);
              }}
              className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-body-md text-body-md flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] animate-pulse">radar</span>
              <span>{testingProbe ? 'Probing 6 Targets...' : 'Test Health Probe (Dry-Run)'}</span>
            </button>
            <button
              onClick={() => {
                setActivated(true);
                if (onActivate) onActivate();
                setTimeout(() => {
                  setActivated(false);
                  onClose();
                }, 1200);
              }}
              className="px-space-lg py-space-xs rounded-lg bg-primary-container hover:bg-primary text-surface-container-lowest font-headline-sm text-headline-sm font-semibold shadow-[0_0_16px_rgba(6,182,212,0.35)] transition-all font-bold"
            >
              {activated ? 'Watchdog Active ✓' : 'Save & Activate Watchdog'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
