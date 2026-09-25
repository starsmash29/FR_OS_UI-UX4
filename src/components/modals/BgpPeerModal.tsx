import React, { useState } from 'react';

interface BgpPeerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy?: () => void;
}

export const BgpPeerModal: React.FC<BgpPeerModalProps> = ({ isOpen, onClose, onDeploy }) => {
  const [template, setTemplate] = useState('cloudflare');
  const [protoType, setProtoType] = useState<'bgp' | 'ospf'>('bgp');
  const [sessionAlias, setSessionAlias] = useState('peer-upstream-transit-as13335');
  const [sessionDesc, setSessionDesc] = useState('Primary transit link via AS13335 (Cloudflare) on WAN1 eth0');
  const [enabled, setEnabled] = useState(true);
  const [localAsn, setLocalAsn] = useState('64512');
  const [localRouterId, setLocalRouterId] = useState('192.168.1.1');
  const [bindInterface, setBindInterface] = useState('eth0 — 198.51.100.2/24 (WAN1 Primary 10GbE Fiber)');
  const [remoteAsn, setRemoteAsn] = useState('13335');
  const [remoteIp, setRemoteIp] = useState('198.51.100.1');
  const [multihopTtl, setMultihopTtl] = useState(1);
  const [holdTime, setHoldTime] = useState(90);
  const [keepalive, setKeepalive] = useState(30);
  const [md5Key, setMd5Key] = useState('fros_bgp_sec_2025');
  const [showMd5, setShowMd5] = useState(false);
  const [testingHandshake, setTestingHandshake] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const synthesizedConf = `protocol bgp ${sessionAlias} {
  description "${sessionDesc}";
  local 198.51.100.2 as ${localAsn};
  neighbor ${remoteIp} as ${remoteAsn};
  multihop ${multihopTtl}; default bgp_med 100;
  bfd on; password "${md5Key}"; ttl security on;
  hold time ${holdTime}; keepalive time ${keepalive}; graceful restart on;
  ipv4 {
    import filter import_default_and_partial_transit;
    export filter export_own_prefixes_only;
    import limit 50000 action warn;
  };
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-surface-container-lowest/80 backdrop-blur-md overflow-y-auto pointer-events-auto">
      <div className="relative w-full max-w-7xl max-h-[942px] overflow-y-auto bg-surface-container-low rounded-xl shadow-[0_16px_50px_rgba(0,0,0,0.85)] flex flex-col border border-outline-variant/30">
        {/* Top Micro-status Ribbon */}
        <div className="w-full px-space-lg py-space-xs bg-surface-container-low flex items-center justify-between border-b border-outline-variant/30 flex-wrap gap-2">
          <div className="flex items-center gap-space-md flex-wrap">
            <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              <span>BIRD2 / FRR KERNEL ENGINE SYNCD</span>
            </div>
            <span className="text-surface-variant">•</span>
            <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
              <span className="text-outline">DAEMON:</span>
              <span className="font-bold text-on-surface">BIRD v2.13-fros-hardened</span>
            </div>
            <span className="text-surface-variant">•</span>
            <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
              <span className="text-outline">FIB_LOOKUP:</span>
              <span className="text-primary font-bold">READY (TABLE 254)</span>
            </div>
          </div>
          <div className="flex items-center gap-space-lg">
            <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
              <span className="text-outline">NFTABLES TCP/179:</span>
              <span className="text-secondary font-bold">OPEN / ACCEPT</span>
            </div>
            <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
              <span className="text-outline">SESSION ID:</span>
              <span className="font-bold text-tertiary">#BGPD-0x8C4F</span>
            </div>
          </div>
        </div>

        {/* Modal Header */}
        <div className="p-space-lg bg-surface-container flex flex-col lg:flex-row lg:items-center justify-between gap-space-md border-b border-outline-variant/30">
          <div className="flex items-start gap-space-md min-w-0">
            <div className="relative flex-shrink-0 w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center shadow-md border border-outline-variant/30">
              <span className="material-symbols-outlined text-[28px] text-primary">router</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-sm flex-wrap">
                <span className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                  Configure Dynamic Routing Peer
                </span>
                <span className="px-space-xs py-0.5 rounded bg-surface-container-highest text-primary font-label-sm text-label-sm uppercase">
                  RFC 4271 BGP4
                </span>
                <span className="px-space-xs py-0.5 rounded bg-surface-container-highest text-secondary font-label-sm text-label-sm uppercase">
                  eBPF Accelerated
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant truncate max-w-3xl">
                Establish deterministic peering sessions, Autonomous System Numbers (ASN), eBGP multihop, BFD failover, and ingress/egress prefix policies.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-space-md flex-shrink-0 self-end lg:self-center">
            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-xs rounded border border-outline-variant/30">
              <span className="font-label-sm text-label-sm text-outline">TEMPLATE:</span>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="bg-transparent text-on-surface font-label-sm text-label-sm focus:outline-none cursor-pointer pr-space-xs"
              >
                <option value="cloudflare">eBGP Upstream Transit (Default / Cloudflare)</option>
                <option value="spine">iBGP Core Mesh / Leaf-Spine</option>
                <option value="anycast">BGP Peering with Anycast</option>
                <option value="ospf_bb">OSPF Area 0.0.0.0 Backbone</option>
              </select>
            </div>

            <div className="flex items-center p-1 rounded bg-surface-container-low border border-outline-variant/30">
              <button
                type="button"
                onClick={() => setProtoType('bgp')}
                className={`px-space-md py-space-xs rounded font-label-md text-label-md font-bold transition-all ${
                  protoType === 'bgp' ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                BGP Session
              </button>
              <button
                type="button"
                onClick={() => setProtoType('ospf')}
                className={`px-space-md py-space-xs rounded font-label-md text-label-md transition-all ${
                  protoType === 'ospf' ? 'bg-primary-container text-on-primary-container font-bold shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                OSPFv2 / v3
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-space-xs rounded text-on-surface-variant hover:text-error hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-space-lg flex flex-col gap-space-lg max-h-[calc(86vh-140px)] overflow-y-auto">
          {/* SECTION 1: Session Identification */}
          <div className="p-space-md rounded-lg bg-surface-container flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md shadow-sm border border-outline-variant/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md flex-1">
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-sm text-label-sm text-outline flex items-center justify-between">
                  <span>PEER SESSION ALIAS / IDENTIFIER</span>
                  <span className="text-tertiary">ASCII_IDENT</span>
                </label>
                <input
                  className="w-full bg-surface-container-low px-space-md py-space-xs rounded text-on-surface font-body-md text-body-md focus:outline-none border border-outline-variant/30"
                  type="text"
                  value={sessionAlias}
                  onChange={(e) => setSessionAlias(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-sm text-label-sm text-outline flex items-center justify-between">
                  <span>SESSION DESCRIPTION &amp; TOPOLOGY CONTEXT</span>
                  <span className="text-on-surface-variant">OPTIONAL</span>
                </label>
                <input
                  className="w-full bg-surface-container-low px-space-md py-space-xs rounded text-on-surface font-body-md text-body-md focus:outline-none border border-outline-variant/30"
                  type="text"
                  value={sessionDesc}
                  onChange={(e) => setSessionDesc(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between lg:justify-end gap-space-md lg:pl-space-md">
              <div className="flex flex-col text-right">
                <span className="font-label-sm text-label-sm text-outline">ADMINISTRATIVE STATE</span>
                <span className={`font-label-md text-label-md font-bold ${enabled ? 'text-secondary' : 'text-outline'}`}>
                  {enabled ? 'ENABLE PEER SESSION' : 'DISABLED'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="w-5 h-5 accent-secondary rounded cursor-pointer"
              />
            </div>
          </div>

          {/* SECTION 2: BGP Identity (Local vs Remote) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
            {/* Local Node */}
            <div className="p-space-lg rounded-lg bg-surface-container-low flex flex-col gap-space-md shadow-sm border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[18px]">cell_tower</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Local Node BGP Identity</h3>
                </div>
                <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm">
                  NODE: node-01.lab
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-sm text-label-sm text-outline flex items-center justify-between">
                    <span>LOCAL ASN</span>
                    <span className="text-secondary font-normal">Private AS</span>
                  </label>
                  <div className="flex items-center bg-surface-container px-space-md py-space-xs rounded border border-outline-variant/30">
                    <span className="text-outline font-label-sm text-label-sm mr-2 font-bold">AS</span>
                    <input
                      className="w-full bg-transparent text-primary font-metric-display text-headline-md font-bold focus:outline-none"
                      type="text"
                      value={localAsn}
                      onChange={(e) => setLocalAsn(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-sm text-label-sm text-outline">LOCAL ROUTER ID (IPv4)</label>
                  <div className="flex items-center bg-surface-container px-space-md py-space-xs rounded border border-outline-variant/30">
                    <input
                      className="w-full bg-transparent text-on-surface font-body-lg text-body-lg focus:outline-none"
                      type="text"
                      value={localRouterId}
                      onChange={(e) => setLocalRouterId(e.target.value)}
                    />
                    <span className="material-symbols-outlined text-outline text-[16px]">fingerprint</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-space-xs">
                <label className="font-label-sm text-label-sm text-outline">SOURCE IP / OUTGOING BIND INTERFACE</label>
                <div className="relative">
                  <select
                    value={bindInterface}
                    onChange={(e) => setBindInterface(e.target.value)}
                    className="w-full bg-surface-container px-space-md py-space-sm rounded text-on-surface font-body-md text-body-md focus:outline-none appearance-none cursor-pointer border border-outline-variant/30"
                  >
                    <option>eth0 — 198.51.100.2/24 (WAN1 Primary 10GbE Fiber)</option>
                    <option>eth1 — 203.0.113.14/29 (WAN2 Backup Gigabit)</option>
                    <option>lo0 — 10.255.255.1/32 (System Loopback)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-[18px] text-outline pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>

            {/* Remote Neighbor */}
            <div className="p-space-lg rounded-lg bg-surface-container-low flex flex-col gap-space-md shadow-sm border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[18px]">hub</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Remote Neighbor / Peer Identity</h3>
                </div>
                <span className="px-space-xs py-0.5 rounded bg-secondary-container/20 text-secondary font-label-sm text-label-sm font-bold">
                  eBGP SESSION (EXTERNAL)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-sm text-label-sm text-outline flex items-center justify-between">
                    <span>REMOTE PEER ASN</span>
                    <span className="text-tertiary">Cloudflare</span>
                  </label>
                  <div className="flex items-center bg-surface-container px-space-md py-space-xs rounded border border-outline-variant/30">
                    <span className="text-outline font-label-sm text-label-sm mr-2 font-bold">AS</span>
                    <input
                      className="w-full bg-transparent text-secondary font-metric-display text-headline-md font-bold focus:outline-none"
                      type="text"
                      value={remoteAsn}
                      onChange={(e) => setRemoteAsn(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-sm text-label-sm text-outline">NEIGHBOR REMOTE IP</label>
                  <div className="flex items-center bg-surface-container px-space-md py-space-xs rounded border border-outline-variant/30">
                    <input
                      className="w-full bg-transparent text-on-surface font-body-lg text-body-lg focus:outline-none"
                      type="text"
                      value={remoteIp}
                      onChange={(e) => setRemoteIp(e.target.value)}
                    />
                    <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-sm text-label-sm text-outline">MULTIHOP TTL VALUE</label>
                  <div className="flex items-center bg-surface-container px-space-md py-space-xs rounded border border-outline-variant/30">
                    <input
                      className="w-full bg-transparent text-on-surface font-body-md text-body-md focus:outline-none"
                      max="255"
                      min="1"
                      type="number"
                      value={multihopTtl}
                      onChange={(e) => setMultihopTtl(parseInt(e.target.value) || 1)}
                    />
                    <span className="font-label-sm text-label-sm text-outline">HOPS</span>
                  </div>
                </div>
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-sm text-label-sm text-outline">UPDATE-SOURCE OVERRIDE</label>
                  <input
                    className="bg-surface-container px-space-md py-space-xs rounded text-on-surface font-body-md text-body-md focus:outline-none border border-outline-variant/30"
                    type="text"
                    defaultValue="eth0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Timers, BFD & Security */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
            {/* Card 1: Timers */}
            <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-md shadow-sm border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[18px]">timer</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Timers &amp; Convergence</span>
                </div>
                <span className="font-label-sm text-label-sm text-outline">RFC 4724</span>
              </div>
              <div className="grid grid-cols-2 gap-space-sm">
                <div className="p-space-sm rounded bg-surface-container flex flex-col gap-space-xs border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-outline">HOLD TIME</span>
                  <div className="flex items-baseline gap-space-xs">
                    <input
                      type="number"
                      value={holdTime}
                      onChange={(e) => setHoldTime(parseInt(e.target.value) || 90)}
                      className="w-16 bg-transparent font-metric-display text-headline-md font-bold text-on-surface focus:outline-none"
                    />
                    <span className="font-label-sm text-label-sm text-on-surface-variant">sec</span>
                  </div>
                </div>
                <div className="p-space-sm rounded bg-surface-container flex flex-col gap-space-xs border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-outline">KEEPALIVE</span>
                  <div className="flex items-baseline gap-space-xs">
                    <input
                      type="number"
                      value={keepalive}
                      onChange={(e) => setKeepalive(parseInt(e.target.value) || 30)}
                      className="w-16 bg-transparent font-metric-display text-headline-md font-bold text-on-surface focus:outline-none"
                    />
                    <span className="font-label-sm text-label-sm text-on-surface-variant">sec</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: BFD Fast Failover */}
            <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-md shadow-sm border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[18px]">bolt</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">BFD Fast Failover</span>
                </div>
                <span className="font-label-sm text-label-sm text-secondary font-bold">ACTIVE</span>
              </div>
              <div className="grid grid-cols-3 gap-space-xs text-center">
                <div className="p-space-xs rounded bg-surface-container">
                  <span className="font-label-sm text-label-sm text-outline block">MIN TX</span>
                  <span className="font-label-md text-label-md font-bold text-on-surface">300ms</span>
                </div>
                <div className="p-space-xs rounded bg-surface-container">
                  <span className="font-label-sm text-label-sm text-outline block">MIN RX</span>
                  <span className="font-label-md text-label-md font-bold text-on-surface">300ms</span>
                </div>
                <div className="p-space-xs rounded bg-surface-container">
                  <span className="font-label-sm text-label-sm text-outline block">MULTIPLIER</span>
                  <span className="font-label-md text-label-md font-bold text-primary">3x</span>
                </div>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-bold text-center">
                DETECTION TIME: ~900 ms CRITICAL FAULT
              </span>
            </div>

            {/* Card 3: Security & Limits */}
            <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-md shadow-sm border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-tertiary text-[18px]">key</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Security &amp; Limits</span>
                </div>
                <span className="font-label-sm text-label-sm text-tertiary">RFC 5082</span>
              </div>
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-sm text-label-sm text-outline">TCP MD5 PEER KEY</label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container px-space-md py-space-xs rounded text-on-surface font-body-md text-body-md tracking-widest focus:outline-none border border-outline-variant/30"
                    type={showMd5 ? 'text' : 'password'}
                    value={md5Key}
                    onChange={(e) => setMd5Key(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowMd5(!showMd5)}
                    className="material-symbols-outlined absolute right-2.5 top-2 text-[16px] text-outline cursor-pointer hover:text-on-surface"
                  >
                    {showMd5 ? 'visibility_off' : 'visibility'}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-label-sm font-label-sm pt-1">
                <span className="text-outline">MAX PREFIX CEILING:</span>
                <span className="text-primary font-bold">50,000 PFX</span>
              </div>
            </div>
          </div>

          {/* SECTION 4: Synthesized Code Box & Pre-flight check */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
            <div className="lg:col-span-2 rounded-lg bg-surface-container-lowest p-space-md flex flex-col gap-space-xs font-mono shadow-inner border border-outline-variant/30">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-low">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  /etc/bird/peers.d/{sessionAlias}.conf (Synthesized)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(synthesizedConf);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-primary hover:underline text-[12px] flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">content_copy</span>
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-[12px] leading-5 text-on-surface overflow-x-auto pt-space-xs select-all">
                {synthesizedConf}
              </pre>
            </div>

            <div className="rounded-lg bg-surface-container-low p-space-md flex flex-col justify-between shadow-sm border border-outline-variant/20">
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Pre-Flight Check</span>
                  <span className="px-space-xs py-0.5 rounded bg-secondary-container/20 text-secondary font-label-sm text-label-sm font-bold">
                    PASS 4/4
                  </span>
                </div>
                <div className="flex flex-col gap-space-xs mt-space-sm font-label-sm text-label-sm">
                  <div className="flex items-center gap-space-xs p-space-xs rounded bg-surface-container">
                    <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                    <span>Next-hop {remoteIp} ARP reachable</span>
                  </div>
                  <div className="flex items-center gap-space-xs p-space-xs rounded bg-surface-container">
                    <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                    <span>TCP/179 outbound clear in nftables</span>
                  </div>
                  <div className="flex items-center gap-space-xs p-space-xs rounded bg-surface-container">
                    <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                    <span>ASN {remoteAsn} PeeringDB match confirmed</span>
                  </div>
                  <div className="flex items-center gap-space-xs p-space-xs rounded bg-surface-container">
                    <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                    <span>BIRD2 config grammar validated</span>
                  </div>
                </div>
              </div>
              <div className="mt-space-md p-space-xs rounded bg-surface-container flex items-center justify-between text-label-sm font-label-sm">
                <span className="text-outline">Est. Convergence:</span>
                <span className="text-secondary font-bold">&lt; 3.2s after BFD SYN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-space-lg bg-surface-container flex flex-col md:flex-row items-center justify-between gap-space-md border-t border-outline-variant/30">
          <div className="flex items-center gap-space-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-[20px]">layers</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface font-bold">Kernel Netlink FIB Sync</span>
              <span className="font-body-sm text-body-sm text-outline">Routes installed into Linux FIB table 254 (main) without interrupting dataplane</span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap self-end md:self-center">
            <button
              onClick={onClose}
              className="px-space-md py-space-sm rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-label-md transition-colors"
            >
              Cancel &amp; Discard
            </button>
            <button
              onClick={() => {
                setTestingHandshake(true);
                setTimeout(() => setTestingHandshake(false), 2000);
              }}
              className="flex items-center gap-space-xs px-space-md py-space-sm rounded bg-surface-container-high hover:bg-surface-bright text-primary font-label-md text-label-md transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">network_check</span>
              <span>{testingHandshake ? 'Testing Handshake...' : 'Test Handshake (TCP 179 SYN)'}</span>
            </button>
            <button
              onClick={() => {
                setDeployed(true);
                if (onDeploy) onDeploy();
                setTimeout(() => {
                  setDeployed(false);
                  onClose();
                }, 1200);
              }}
              className="flex items-center gap-space-xs px-space-lg py-space-sm rounded bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-label-md text-label-md font-bold transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>{deployed ? 'Deployed to BIRD2 ✓' : 'Deploy & Establish Peering'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
