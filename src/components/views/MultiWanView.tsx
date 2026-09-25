import React, { useState } from 'react';
import { 
  Network, 
  Plus, 
  ShieldAlert, 
  Radio, 
  Shuffle, 
  SlidersHorizontal, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  Search, 
  ArrowDownUp, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  Globe,
  Compass,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { ActiveModal, PbrRule } from '../../types';

interface MultiWanViewProps {
  onOpenModal: (modal: ActiveModal) => void;
  pbrRules: PbrRule[];
  onToggleRule: (ruleId: string) => void;
  onDeleteRule?: (ruleId: string) => void;
}

export const MultiWanView: React.FC<MultiWanViewProps> = ({
  onOpenModal,
  pbrRules,
  onToggleRule,
  onDeleteRule,
}) => {
  const [multipathWeight, setMultipathWeight] = useState<number>(70);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterState, setFilterState] = useState<'ALL' | 'ACTIVE' | 'DISABLED'>('ALL');

  const filteredRules = pbrRules.filter((r) => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.sourceMatch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.targetTable.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.descriptor.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterState === 'ALL') return matchesSearch;
    return matchesSearch && r.state === filterState;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-low border border-outline-variant/50 p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-secondary/15 text-secondary font-semibold border border-secondary/30">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse mr-1.5"></span>
              MULTI-WAN LOAD BALANCER ONLINE
            </span>
            <span className="text-xs font-mono text-on-surface-variant">FIB Kernel Tables: 100, 200, 300</span>
          </div>
          <h1 className="text-xl font-bold text-on-surface font-headline tracking-wide mt-1">
            Policy-Based Routing (PBR) & Multi-WAN Gateway
          </h1>
          <p className="text-xs text-on-surface-variant max-w-2xl mt-0.5">
            Rule-based packet steering by source CIDR, TCP/UDP port, protocol, and DSCP tags with automatic BFD/ICMP watchdog failover.
          </p>
        </div>

        {/* Modal Launch Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenModal('create-pbr-rule')}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary hover:bg-primary-dim text-on-primary rounded-lg text-xs font-mono font-semibold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create PBR Rule</span>
          </button>

          <button
            onClick={() => onOpenModal('gateway-watchdog')}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant rounded-lg text-xs font-mono transition"
          >
            <ShieldAlert className="w-4 h-4 text-tertiary" />
            <span>Gateway Watchdog</span>
          </button>

          <button
            onClick={() => onOpenModal('route-test')}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant rounded-lg text-xs font-mono transition"
          >
            <Compass className="w-4 h-4 text-secondary" />
            <span>FIB Simulator</span>
          </button>

          <button
            onClick={() => onOpenModal('bgp-peer-config')}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant rounded-lg text-xs font-mono transition"
          >
            <Globe className="w-4 h-4 text-primary" />
            <span>BGP/OSPF Peer</span>
          </button>
        </div>
      </div>

      {/* Gateway Uplink Status Dual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* WAN 1 - Primary Fiber */}
        <div className="bg-surface-container-low border border-secondary/30 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-secondary animate-pulse shadow-sm shadow-secondary/50"></div>
              <div>
                <h3 className="text-sm font-bold text-on-surface font-mono">WAN 1: Direct Gigabit Fiber</h3>
                <span className="text-[11px] font-mono text-on-surface-variant">Interface: eth0 (VLAN 100 PPPoE)</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-secondary/20 text-secondary border border-secondary/40 font-bold uppercase">
              PRIMARY TIER 1
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 text-center">
            <div className="bg-surface-container p-2 rounded-lg border border-outline-variant/50">
              <span className="text-[10px] font-mono text-on-surface-variant">RTT Ping (1.1.1.1)</span>
              <div className="text-base font-mono font-bold text-secondary mt-0.5">3.8 ms</div>
            </div>
            <div className="bg-surface-container p-2 rounded-lg border border-outline-variant/50">
              <span className="text-[10px] font-mono text-on-surface-variant">Packet Loss</span>
              <div className="text-base font-mono font-bold text-secondary mt-0.5">0.00 %</div>
            </div>
            <div className="bg-surface-container p-2 rounded-lg border border-outline-variant/50">
              <span className="text-[10px] font-mono text-on-surface-variant">Jitter (stddev)</span>
              <div className="text-base font-mono font-bold text-on-surface mt-0.5">0.14 ms</div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-on-surface-variant pt-2 border-t border-outline-variant/30">
            <span>Gateway IP: 198.51.100.1</span>
            <span className="text-secondary font-bold">Health: 100% HEALTHY</span>
          </div>
        </div>

        {/* WAN 2 - Secondary 5G / Backup */}
        <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-sm shadow-primary/50"></div>
              <div>
                <h3 className="text-sm font-bold text-on-surface font-mono">WAN 2: 5G Ultra-Wideband Backup</h3>
                <span className="text-[11px] font-mono text-on-surface-variant">Interface: eth1 (DHCP Carrier)</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary/20 text-primary border border-primary/40 font-bold uppercase">
              STANDBY / SPILLOVER
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 text-center">
            <div className="bg-surface-container p-2 rounded-lg border border-outline-variant/50">
              <span className="text-[10px] font-mono text-on-surface-variant">RTT Ping (8.8.8.8)</span>
              <div className="text-base font-mono font-bold text-primary mt-0.5">24.2 ms</div>
            </div>
            <div className="bg-surface-container p-2 rounded-lg border border-outline-variant/50">
              <span className="text-[10px] font-mono text-on-surface-variant">Packet Loss</span>
              <div className="text-base font-mono font-bold text-secondary mt-0.5">0.00 %</div>
            </div>
            <div className="bg-surface-container p-2 rounded-lg border border-outline-variant/50">
              <span className="text-[10px] font-mono text-on-surface-variant">Jitter (stddev)</span>
              <div className="text-base font-mono font-bold text-on-surface mt-0.5">2.8 ms</div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-on-surface-variant pt-2 border-t border-outline-variant/30">
            <span>Gateway IP: 203.0.113.1</span>
            <span className="text-primary font-bold">Health: STANDBY READY</span>
          </div>
        </div>
      </div>

      {/* Weighted Multipath Balance Bar */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Shuffle className="w-4 h-4 text-secondary" />
            <h3 className="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">
              Kernel ECMP Multipath Ratio (FIB NextHop Multi-Hop Weight)
            </h3>
          </div>
          <div className="text-xs font-mono text-on-surface-variant">
            <span>WAN 1: <strong className="text-secondary">{multipathWeight}%</strong></span>
            <span className="mx-2">|</span>
            <span>WAN 2: <strong className="text-primary">{100 - multipathWeight}%</strong></span>
          </div>
        </div>

        <input
          type="range"
          min="10"
          max="90"
          value={multipathWeight}
          onChange={(e) => setMultipathWeight(Number(e.target.value))}
          className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary"
        />
        <div className="flex justify-between text-[10px] font-mono text-on-surface-variant mt-1.5">
          <span>Heavy WAN1 (90/10)</span>
          <span>Balanced Equal-Cost (50/50)</span>
          <span>Heavy WAN2 (10/90)</span>
        </div>
      </div>

      {/* PBR Rules Management Section */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm">
        {/* Table Filter / Header Bar */}
        <div className="p-4 border-b border-outline-variant/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-on-surface font-headline flex items-center gap-2">
              <Network className="w-4 h-4 text-primary" />
              Policy Routing Rules (ip rule / fib_rules)
            </h3>
            <span className="text-xs font-mono bg-surface-container text-on-surface-variant px-2 py-0.5 rounded border border-outline-variant">
              {filteredRules.length} rules
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Filter rules, CIDR, port..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-surface-container border border-outline-variant rounded-lg text-xs font-mono text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary w-52"
              />
            </div>

            {/* Filter Toggle Buttons */}
            <div className="flex bg-surface-container p-0.5 rounded-lg border border-outline-variant">
              {(['ALL', 'ACTIVE', 'DISABLED'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterState(tab)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition ${
                    filterState === tab
                      ? 'bg-primary text-on-primary font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PBR Rules Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-surface-container border-b border-outline-variant text-on-surface-variant text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3 font-semibold text-center w-12">Pref</th>
                <th className="py-2.5 px-4 font-semibold">Rule Name / Descriptor</th>
                <th className="py-2.5 px-3 font-semibold">Match Criteria</th>
                <th className="py-2.5 px-3 font-semibold">Port / Protocol</th>
                <th className="py-2.5 px-3 font-semibold">DSCP Mark</th>
                <th className="py-2.5 px-4 font-semibold">Target Route Table</th>
                <th className="py-2.5 px-3 font-semibold text-right">Hit Packets</th>
                <th className="py-2.5 px-3 font-semibold text-center">State</th>
                <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-on-surface">
              {filteredRules.map((rule) => (
                <tr 
                  key={rule.id} 
                  className={`hover:bg-surface-container-high/40 transition ${
                    rule.state === 'DISABLED' ? 'opacity-50 bg-surface-dim/30' : ''
                  }`}
                >
                  <td className="py-3 px-3 text-center font-bold text-primary">
                    {rule.pref}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-sans font-bold text-on-surface">{rule.name}</div>
                    <div className="text-[10px] text-on-surface-variant font-mono">{rule.descriptor}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-secondary">
                    {rule.sourceMatch}
                  </td>
                  <td className="py-3 px-3 text-on-surface-variant">
                    <div>{rule.destinationPort}</div>
                    <div className="text-[10px] text-on-surface-variant/70">{rule.proto}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-surface-container text-on-surface border border-outline-variant">
                      {rule.dscpMark}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-primary">{rule.targetTable}</div>
                    <div className="text-[10px] text-on-surface-variant">{rule.targetGateway}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-on-surface">
                    {rule.hitPackets}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => !rule.locked && onToggleRule(rule.id)}
                      disabled={rule.locked}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        rule.state === 'ACTIVE'
                          ? 'bg-secondary/20 text-secondary border border-secondary/30'
                          : rule.state === 'CORE'
                          ? 'bg-primary/20 text-primary border border-primary/30 cursor-not-allowed'
                          : 'bg-surface-container text-on-surface-variant border border-outline-variant'
                      }`}
                    >
                      {rule.state === 'ACTIVE' ? (
                        <>
                          <ToggleRight className="w-3.5 h-3.5 text-secondary" />
                          <span>ACTIVE</span>
                        </>
                      ) : rule.state === 'CORE' ? (
                        <>
                          <span>KERNEL CORE</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-3.5 h-3.5 text-on-surface-variant" />
                          <span>DISABLED</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenModal('route-test')}
                        title="Simulate route lookup in FIB"
                        className="p-1 hover:bg-surface-container text-on-surface-variant hover:text-secondary rounded transition"
                      >
                        <Compass className="w-3.5 h-3.5" />
                      </button>
                      {!rule.locked && onDeleteRule && (
                        <button
                          onClick={() => onDeleteRule(rule.id)}
                          title="Delete rule"
                          className="p-1 hover:bg-error/20 text-on-surface-variant hover:text-error rounded transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
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
