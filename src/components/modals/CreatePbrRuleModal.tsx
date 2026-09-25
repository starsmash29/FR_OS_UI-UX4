import React, { useState } from 'react';
import { PbrRule } from '../../types';

interface CreatePbrRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRule: (rule: PbrRule) => void;
}

export const CreatePbrRuleModal: React.FC<CreatePbrRuleModalProps> = ({
  isOpen,
  onClose,
  onAddRule,
}) => {
  const [pref, setPref] = useState(250);
  const [name, setName] = useState('VoIP-Telephony-Direct-Fiber');
  const [isActive, setIsActive] = useState(true);
  const [iif, setIif] = useState('eth1');
  const [srcIp, setSrcIp] = useState('192.168.10.0/24');
  const [srcPort, setSrcPort] = useState('Any');
  const [proto, setProto] = useState('udp');
  const [dstIp, setDstIp] = useState('0.0.0.0/0');
  const [dstPort, setDstPort] = useState('5060, 10000-20000');
  const [dscp, setDscp] = useState('46');
  const [fwmark, setFwmark] = useState('0x0');
  const [suppress, setSuppress] = useState(0);
  const [action, setAction] = useState('lookup');
  const [targetTable, setTargetTable] = useState('100');
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [dryRunValid, setDryRunValid] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePreset = (preset: string) => {
    if (preset === 'voip') {
      setPref(250);
      setName('VoIP-Telephony-Direct-Fiber');
      setIif('eth1');
      setSrcIp('192.168.10.0/24');
      setDstIp('0.0.0.0/0');
      setDstPort('5060, 10000-20000');
      setProto('udp');
      setDscp('46');
      setTargetTable('100');
    } else if (preset === 's3') {
      setPref(800);
      setName('Bulk-S3-Backup-Spillover');
      setIif('any');
      setSrcIp('192.168.20.0/24');
      setDstIp('0.0.0.0/0');
      setDstPort('443');
      setProto('tcp');
      setDscp('8');
      setTargetTable('200');
    } else if (preset === 'vpn') {
      setPref(150);
      setName('VPN-Wireguard-Corporate-Overlay');
      setIif('vlan10');
      setSrcIp('10.0.10.0/24');
      setDstIp('10.80.0.0/16');
      setDstPort('Any');
      setProto('all');
      setDscp('none');
      setTargetTable('300');
    } else if (preset === 'fintech') {
      setPref(300);
      setName('Finance-Banking-Session-Pinning');
      setIif('any');
      setSrcIp('0.0.0.0/0');
      setDstIp('0.0.0.0/0');
      setDstPort('443');
      setProto('tcp');
      setFwmark('0x44');
      setTargetTable('100');
    } else if (preset === 'dns') {
      setPref(100);
      setName('DNS-DoH-Intercept-Local-Unbound');
      setIif('any');
      setSrcIp('0.0.0.0/0');
      setDstIp('0.0.0.0/0');
      setDstPort('53, 853');
      setProto('all');
      setTargetTable('100');
    }
  };

  const buildCli = () => {
    let cli = `ip rule add pref ${pref}`;
    if (iif && iif !== 'any') cli += ` iif ${iif}`;
    if (srcIp && srcIp !== '0.0.0.0/0') cli += ` from ${srcIp}`;
    if (dstIp && dstIp !== '0.0.0.0/0') cli += ` to ${dstIp}`;
    if (proto && proto !== 'all') cli += ` ipproto ${proto}`;
    if (dstPort && dstPort.toLowerCase() !== 'any') cli += ` dport ${dstPort.replace(/\s+/g, '')}`;
    if (dscp && dscp !== 'none') cli += ` dscp ${dscp}`;
    if (fwmark && fwmark !== '0x0') cli += ` fwmark ${fwmark}`;
    if (suppress > 0) cli += ` suppress_prefixlength ${suppress}`;
    if (action === 'lookup') cli += ` table ${targetTable}`;
    else cli += ` ${action}`;
    return cli;
  };

  const handleCommit = () => {
    const newRule: PbrRule = {
      pref,
      id: `pbr-${Date.now()}`,
      name,
      descriptor: name.toLowerCase().replace(/\s+/g, '_'),
      sourceMatch: srcIp,
      destinationPort: dstPort === 'Any' ? 'Any' : `Port ${dstPort}`,
      proto: proto.toUpperCase(),
      dscpMark: dscp !== 'none' ? `DSCP ${dscp}` : '-',
      targetTable: `table ${targetTable}`,
      targetGateway: targetTable === '100' ? 'via eth0 (Direct Fiber)' : targetTable === '200' ? 'dev eth1 (5G / Spillover)' : 'dev wg0',
      hitPackets: '0',
      state: isActive ? 'ACTIVE' : 'DISABLED',
    };
    onAddRule(newRule);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-gutter md:p-space-xl overflow-y-auto bg-surface-dim/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl my-auto bg-surface-container-low rounded-xl shadow-2xl overflow-hidden flex flex-col border border-outline-variant/30">
        {/* Top Accent Luminous Beam */}
        <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-primary-container"></div>

        {/* 1. MODAL HEADER */}
        <div className="bg-surface-container-lowest px-space-xl py-space-lg flex flex-col md:flex-row md:items-center justify-between gap-space-md shadow-sm border-b border-outline-variant/30">
          <div className="flex items-start gap-space-md">
            <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center p-1.5 shrink-0 shadow-md border border-outline-variant/30">
              <img
                alt="FR_OS Logo"
                className="w-full h-full object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1WPKRcOXkcZgtJ0SxofeSvq-4XjCZ3kYiWwzevdFqjei30cX5hu2FUKswPX-5iMepGKSoGk7Xf-jJHwM8P-nBZCEOZq2bJY3HR0X94n_tggpvGknSy8r__Xnb0uDTUE7-zTTSUz3VvqUbSEq5056hvwVCWnpuVj_613KyMY5wEpb1YaX4mnGrxqmxc17T9d7MIJ1sRh92OzwudOzbmlNkmz1UFok-yvGfCEMhR7c_gtZgOxN8lUCn_Uf-9o"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-sm flex-wrap">
                <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase">FR_OS // FIB DISPATCHER</span>
                <span className="font-label-sm text-label-sm text-outline">|</span>
                <div className="flex items-center gap-1.5 px-space-xs py-0.5 rounded bg-surface-container-high">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                  <span className="font-label-sm text-label-sm text-secondary">RTNETLINK SYNC</span>
                </div>
                <span className="px-space-xs py-0.5 rounded bg-surface-container-high font-label-sm text-label-sm text-on-surface-variant">KERNEL v5.15+</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-0.5 font-bold">
                Create Policy-Based Routing (PBR) Rule
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Deterministic routing selector mapping source, destination, DSCP mark, or fwmark to Linux FIB routing tables (<span className="font-label-sm text-primary">/etc/iproute2/rt_tables</span>).
              </p>
            </div>
          </div>

          {/* Template Selector */}
          <div className="flex items-center gap-space-sm self-end md:self-center shrink-0">
            <div className="flex flex-col items-end">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">Load Template Preset</span>
              <div className="relative inline-block text-left">
                <select
                  onChange={(e) => handlePreset(e.target.value)}
                  className="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-space-md py-space-sm rounded-lg focus:outline-none cursor-pointer pr-8 hover:bg-surface-bright transition-colors shadow-sm border border-outline-variant/30"
                >
                  <option value="voip">VoIP / Low-Latency Priority to WAN1</option>
                  <option value="custom">Custom Clean Rule</option>
                  <option value="s3">Bulk Backup / S3 Spillover to WAN2</option>
                  <option value="fintech">FinTech / Banking Strict Session Pinning</option>
                  <option value="dns">DNS & DoH Intercept to Local Unbound</option>
                  <option value="vpn">VPN Tunnel Forwarding (wg0)</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-2 text-outline pointer-events-none text-[16px]">expand_more</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors ml-space-xs"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* MAIN FORM SCROLL AREA */}
        <div className="p-space-xl space-y-space-lg max-h-[calc(85vh-160px)] overflow-y-auto">
          {/* 2. RULE PRIORITY & IDENTIFICATION */}
          <div className="bg-surface-container p-space-lg rounded-xl grid grid-cols-1 md:grid-cols-12 gap-space-lg shadow-sm border border-outline-variant/20">
            <div className="md:col-span-3 flex flex-col">
              <div className="flex items-center justify-between mb-space-xs">
                <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="rule-pref">
                  Priority (Preference)
                </label>
                <span className="font-label-sm text-label-sm text-primary font-bold">pref {pref}</span>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-md text-outline text-[18px]">sort</span>
                <input
                  className="w-full bg-surface-container-lowest text-on-surface font-label-md text-label-md pl-10 pr-space-md py-space-sm rounded-lg focus:outline-none border border-outline-variant/30"
                  max="32765"
                  min="1"
                  type="number"
                  value={pref}
                  onChange={(e) => setPref(parseInt(e.target.value) || 1)}
                />
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 leading-snug">
                Evaluated before default table (range 1–32765).
              </span>
            </div>

            <div className="md:col-span-6 flex flex-col">
              <div className="flex items-center justify-between mb-space-xs">
                <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="rule-name">
                  Rule Name / Descriptor
                </label>
                <span className="font-label-sm text-label-sm text-outline">Identifier</span>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-md text-outline text-[18px]">badge</span>
                <input
                  className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md pl-10 pr-space-md py-space-sm rounded-lg focus:outline-none border border-outline-variant/30"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-1.5">
                Kernel descriptor alias tagged in routing engine log stream.
              </span>
            </div>

            <div className="md:col-span-3 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-md text-label-md text-on-surface font-semibold">Engine State</span>
                <span className={`font-label-sm text-label-sm font-bold uppercase tracking-wider ${isActive ? 'text-secondary' : 'text-outline'}`}>
                  {isActive ? 'ACTIVE' : 'DISABLED'}
                </span>
              </div>
              <div className="flex items-center gap-space-sm h-10 px-space-md bg-surface-container-lowest rounded-lg border border-outline-variant/30">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-secondary rounded cursor-pointer"
                />
                <span className="font-label-sm text-label-sm text-on-surface">Enable in FIB Dispatcher</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">Controls immediate kernel bytecode sync.</span>
            </div>
          </div>

          {/* 3. TRAFFIC MATCH CRITERIA (2-Column Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
            {/* LEFT COLUMN: Source & Ingress */}
            <div className="bg-surface-container p-space-lg rounded-xl flex flex-col space-y-space-md shadow-sm border border-outline-variant/20">
              <div className="flex items-center justify-between pb-space-xs">
                <div className="flex items-center gap-space-xs text-primary">
                  <span className="material-symbols-outlined text-[18px]">input</span>
                  <span className="font-headline-sm text-headline-sm font-semibold tracking-wide">Ingress & Source Selector</span>
                </div>
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">LAYER 3 / IP</span>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-label-md text-label-md text-on-surface">Incoming Interface (iif)</label>
                <div className="relative">
                  <select
                    value={iif}
                    onChange={(e) => setIif(e.target.value)}
                    className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md px-space-md py-space-sm rounded-lg appearance-none cursor-pointer focus:outline-none border border-outline-variant/30"
                  >
                    <option value="any">Any Ingress Interface (*)</option>
                    <option value="eth1">eth1 (LAN Core - 2.5G SFP+)</option>
                    <option value="vlan10">vlan10 (Admin Management Net)</option>
                    <option value="vlan20">vlan20 (IoT Sandbox Isolation)</option>
                    <option value="wg0">wg0 (Corporate WireGuard Remote)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-space-md top-2.5 text-outline pointer-events-none text-[18px]">expand_more</span>
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface">Source Network (from CIDR)</label>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setSrcIp('192.168.10.45/32')} className="px-space-xs py-0.5 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface-variant font-label-sm text-label-sm">/32</button>
                    <button type="button" onClick={() => setSrcIp('192.168.10.0/24')} className="px-space-xs py-0.5 rounded bg-surface-container-high hover:bg-surface-bright text-primary font-label-sm text-label-sm">/24</button>
                    <button type="button" onClick={() => setSrcIp('192.168.0.0/16')} className="px-space-xs py-0.5 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface-variant font-label-sm text-label-sm">/16</button>
                    <button type="button" onClick={() => setSrcIp('0.0.0.0/0')} className="px-space-xs py-0.5 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface-variant font-label-sm text-label-sm">Any</button>
                  </div>
                </div>
                <input
                  className="w-full bg-surface-container-lowest text-primary font-body-md text-body-md px-space-md py-space-sm rounded-lg focus:outline-none border border-outline-variant/30"
                  type="text"
                  value={srcIp}
                  onChange={(e) => setSrcIp(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-label-md text-label-md text-on-surface">Source Port / Ephemeral Range</label>
                <input
                  className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md px-space-md py-space-sm rounded-lg focus:outline-none border border-outline-variant/30"
                  type="text"
                  value={srcPort}
                  onChange={(e) => setSrcPort(e.target.value)}
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Destination & L4 */}
            <div className="bg-surface-container p-space-lg rounded-xl flex flex-col space-y-space-md shadow-sm border border-outline-variant/20">
              <div className="flex items-center justify-between pb-space-xs">
                <div className="flex items-center gap-space-xs text-secondary">
                  <span className="material-symbols-outlined text-[18px]">output</span>
                  <span className="font-headline-sm text-headline-sm font-semibold tracking-wide">Egress & Target Classifier</span>
                </div>
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">LAYER 4 / TRANSPORT</span>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-label-md text-label-md text-on-surface">IP Protocol Match</label>
                <div className="grid grid-cols-5 gap-1 p-1 bg-surface-container-lowest rounded-lg border border-outline-variant/30">
                  {['all', 'tcp', 'udp', 'icmp', 'esp'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setProto(p)}
                      className={`py-1 rounded text-center font-label-sm text-label-sm uppercase transition-all ${
                        proto === p
                          ? 'bg-primary text-on-primary font-bold shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface">Destination Network (to CIDR)</label>
                  <button type="button" onClick={() => setDstIp('0.0.0.0/0')} className="text-primary font-label-sm text-label-sm hover:underline">
                    Set 0.0.0.0/0 (Global)
                  </button>
                </div>
                <input
                  className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md px-space-md py-space-sm rounded-lg focus:outline-none border border-outline-variant/30"
                  type="text"
                  value={dstIp}
                  onChange={(e) => setDstIp(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface">Destination Port / Service Filter</label>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setDstPort('5060, 10000-20000')} className="px-space-xs py-0.5 rounded bg-surface-container-high hover:bg-surface-bright text-secondary font-label-sm text-label-sm">VoIP (5060)</button>
                    <button type="button" onClick={() => setDstPort('80, 443')} className="px-space-xs py-0.5 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface-variant font-label-sm text-label-sm">Web (80,443)</button>
                    <button type="button" onClick={() => setDstPort('53, 853')} className="px-space-xs py-0.5 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface-variant font-label-sm text-label-sm">DNS (53)</button>
                  </div>
                </div>
                <input
                  className="w-full bg-surface-container-lowest text-secondary font-body-md text-body-md px-space-md py-space-sm rounded-lg focus:outline-none border border-outline-variant/30"
                  type="text"
                  value={dstPort}
                  onChange={(e) => setDstPort(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 4. ADVANCED PACKET MARKING */}
          <div className="bg-surface-container rounded-xl overflow-hidden shadow-sm border border-outline-variant/20">
            <div
              className="p-space-lg flex items-center justify-between cursor-pointer hover:bg-surface-bright/50 transition-colors"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-tertiary text-[20px]">tune</span>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Advanced Packet Marking & eBPF DSCP / Fwmark
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Classify based on DSCP ToS bits, iptables MARK, or suppress default prefixes.
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-[20px]">
                {showAdvanced ? 'expand_less' : 'expand_more'}
              </span>
            </div>

            {showAdvanced && (
              <div className="px-space-xl pb-space-xl grid grid-cols-1 md:grid-cols-3 gap-space-lg pt-space-xs">
                <div className="flex flex-col space-y-1">
                  <label className="font-label-md text-label-md text-on-surface">DSCP / DiffServ CodePoint</label>
                  <select
                    value={dscp}
                    onChange={(e) => setDscp(e.target.value)}
                    className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md px-space-md py-space-sm rounded-lg focus:outline-none border border-outline-variant/30"
                  >
                    <option value="none">None (Ignore DSCP)</option>
                    <option value="46">DSCP EF (46) - Expedited Forwarding</option>
                    <option value="8">DSCP CS1 (8) - Bulk / Scavenger</option>
                    <option value="34">DSCP AF41 (34) - High-Rate Interactive</option>
                    <option value="48">DSCP CS6 (48) - Network Control</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="font-label-md text-label-md text-on-surface">Fwmark / Mangle Mark (Hex)</label>
                  <input
                    className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md px-space-md py-space-sm rounded-lg focus:outline-none border border-outline-variant/30"
                    type="text"
                    value={fwmark}
                    onChange={(e) => setFwmark(e.target.value)}
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="font-label-md text-label-md text-on-surface">Suppress Prefix Length</label>
                  <input
                    className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md px-space-md py-space-sm rounded-lg focus:outline-none border border-outline-variant/30"
                    max="32"
                    min="0"
                    type="number"
                    value={suppress}
                    onChange={(e) => setSuppress(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 5. TARGET ROUTING TABLE */}
          <div className="bg-surface-container p-space-lg rounded-xl flex flex-col space-y-space-lg shadow-sm border border-outline-variant/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-xs text-primary">
                <span className="material-symbols-outlined text-[20px]">alt_route</span>
                <span className="font-headline-sm text-headline-sm font-semibold tracking-wide">Target FIB Action & Forwarding Table</span>
              </div>
              <div className="flex items-center gap-1 p-1 bg-surface-container-lowest rounded-lg border border-outline-variant/30">
                {['lookup', 'unreachable', 'prohibit', 'blackhole'].map((act) => (
                  <button
                    key={act}
                    type="button"
                    onClick={() => setAction(act)}
                    className={`px-space-md py-1 rounded font-label-sm text-label-sm capitalize transition-all ${
                      action === act
                        ? 'bg-primary text-on-primary font-bold shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              <label
                onClick={() => setTargetTable('100')}
                className={`cursor-pointer relative flex flex-col p-space-md rounded-lg transition-all shadow-sm border ${
                  targetTable === '100'
                    ? 'bg-surface-container-lowest border-primary ring-1 ring-primary/40'
                    : 'bg-surface-container-lowest hover:bg-surface-bright border-outline-variant/20'
                }`}
              >
                <div className="flex items-center justify-between mb-space-xs">
                  <span className="px-space-xs py-0.5 rounded bg-primary/20 text-primary font-label-sm text-label-sm font-bold">table 100</span>
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                </div>
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">wan1_lowlatency</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">Direct Fiber 1Gbps Uplink</span>
                <div className="mt-space-md pt-space-xs flex items-center justify-between text-outline font-label-sm text-label-sm">
                  <span>Latency: ~4ms</span>
                  <span className="text-secondary font-bold">Primary</span>
                </div>
              </label>

              <label
                onClick={() => setTargetTable('200')}
                className={`cursor-pointer relative flex flex-col p-space-md rounded-lg transition-all shadow-sm border ${
                  targetTable === '200'
                    ? 'bg-surface-container-lowest border-primary ring-1 ring-primary/40'
                    : 'bg-surface-container-lowest hover:bg-surface-bright border-outline-variant/20'
                }`}
              >
                <div className="flex items-center justify-between mb-space-xs">
                  <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-bold">table 200</span>
                  <span className="w-2 h-2 rounded-full bg-outline"></span>
                </div>
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">wan2_backup</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">5G Wireless Failover Uplink</span>
                <div className="mt-space-md pt-space-xs flex items-center justify-between text-outline font-label-sm text-label-sm">
                  <span>Latency: ~22ms</span>
                  <span className="text-on-surface-variant font-bold">Spillover</span>
                </div>
              </label>

              <label
                onClick={() => setTargetTable('300')}
                className={`cursor-pointer relative flex flex-col p-space-md rounded-lg transition-all shadow-sm border ${
                  targetTable === '300'
                    ? 'bg-surface-container-lowest border-primary ring-1 ring-primary/40'
                    : 'bg-surface-container-lowest hover:bg-surface-bright border-outline-variant/20'
                }`}
              >
                <div className="flex items-center justify-between mb-space-xs">
                  <span className="px-space-xs py-0.5 rounded bg-tertiary-container/20 text-tertiary font-label-sm text-label-sm font-bold">table 300</span>
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                </div>
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">wg_tunnel0</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">Corporate WireGuard Overlay</span>
                <div className="mt-space-md pt-space-xs flex items-center justify-between text-outline font-label-sm text-label-sm">
                  <span>Latency: ~14ms</span>
                  <span className="text-tertiary font-bold">Encrypted</span>
                </div>
              </label>
            </div>
          </div>

          {/* 6. REAL-TIME CLI PREVIEW */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg space-y-space-sm shadow-inner border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-outline text-[16px]">terminal</span>
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Kernel iprule2 Execution Vector</span>
              </div>
              <div className="flex items-center gap-space-sm">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(buildCli());
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">content_copy</span>
                  <span>{copied ? 'Copied!' : 'Copy Script'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDryRunValid(true);
                    setTimeout(() => setDryRunValid(false), 3000);
                  }}
                  className="px-space-sm py-1 rounded bg-surface-container-high hover:bg-surface-bright text-secondary font-label-sm text-label-sm flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">fact_check</span>
                  <span>Dry-Run Validation Test</span>
                </button>
              </div>
            </div>

            <div className="relative bg-surface p-space-md rounded-lg font-label-sm text-label-sm space-y-1 overflow-x-auto shadow-inner border border-outline-variant/20">
              <div className="flex items-center gap-space-sm">
                <span className="text-outline select-none">#</span>
                <span className="text-primary font-bold">{buildCli()}</span>
              </div>
              <div className="flex items-center gap-space-sm">
                <span className="text-outline select-none">#</span>
                <span className="text-on-surface-variant">ip route flush cache</span>
              </div>
              {dryRunValid && (
                <div className="mt-2 pt-2 text-secondary flex items-center gap-space-xs font-mono">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>SYNTAX & FIB OK: Zero collision with tables 1..254. Routing bytecode compiled without warnings.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 7. MODAL FOOTER */}
        <div className="bg-surface-container-lowest px-space-xl py-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md shadow-lg border-t border-outline-variant/30">
          <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-secondary text-[16px]">cable</span>
            <span>Kernel Netlink: <span className="text-on-surface font-semibold">NETLINK_ROUTE connected</span> // Zero downtime</span>
          </div>

          <div className="flex items-center gap-space-md w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-space-md py-space-sm rounded-lg bg-surface-container hover:bg-surface-bright text-on-surface font-label-md text-label-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCommit}
              className="px-space-lg py-space-sm rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold flex items-center gap-2 shadow-lg transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>Commit PBR Rule to Kernel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
