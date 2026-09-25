import React, { useState } from 'react';
import { 
  Network, 
  ArrowDownLeft, 
  ArrowUpRight, 
  CheckCircle2, 
  Sliders, 
  RefreshCw, 
  Activity, 
  Zap, 
  Settings2,
  HardDrive
} from 'lucide-react';
import { ActiveModal } from '../../types';

interface InterfaceCard {
  name: string;
  type: 'WAN' | 'LAN' | 'BOND' | 'VPN';
  mac: string;
  ip: string;
  speed: string;
  duplex: string;
  mtu: number;
  status: 'UP' | 'DOWN';
  rxBytes: string;
  txBytes: string;
  rxPackets: string;
  txPackets: string;
  xdpStatus: string;
  driver: string;
}

const initialInterfaces: InterfaceCard[] = [
  {
    name: 'eth0',
    type: 'WAN',
    mac: '52:54:00:12:34:56',
    ip: '198.51.100.44 / 24',
    speed: '2500 Mbps (2.5 GbE)',
    duplex: 'Full',
    mtu: 1500,
    status: 'UP',
    rxBytes: '14.8 GB',
    txBytes: '4.2 GB',
    rxPackets: '11.2 M',
    txPackets: '3.8 M',
    xdpStatus: 'Native Driver (eBPF)',
    driver: 'igc (Intel I225-V)',
  },
  {
    name: 'eth1',
    type: 'WAN',
    mac: '52:54:00:12:34:57',
    ip: '203.0.113.15 / 24',
    speed: '1000 Mbps (1 GbE)',
    duplex: 'Full',
    mtu: 1500,
    status: 'UP',
    rxBytes: '2.1 GB',
    txBytes: '820 MB',
    rxPackets: '1.9 M',
    txPackets: '740 K',
    xdpStatus: 'Generic SKB',
    driver: 'e1000e (Intel I219-LM)',
  },
  {
    name: 'eth2',
    type: 'LAN',
    mac: '52:54:00:ab:cd:01',
    ip: '192.168.1.1 / 24',
    speed: '10000 Mbps (10 GbE SFP+)',
    duplex: 'Full',
    mtu: 9000,
    status: 'UP',
    rxBytes: '48.9 GB',
    txBytes: '52.1 GB',
    rxPackets: '38.4 M',
    txPackets: '41.2 M',
    xdpStatus: 'Offloaded (Hardware)',
    driver: 'mlx5_core (ConnectX-6 Dx)',
  },
  {
    name: 'bond0',
    type: 'BOND',
    mac: '52:54:00:ab:cd:01',
    ip: '192.168.10.1 / 24',
    speed: '20000 Mbps (20 GbE LACP)',
    duplex: 'Full (802.3ad)',
    mtu: 9000,
    status: 'UP',
    rxBytes: '12.4 GB',
    txBytes: '14.1 GB',
    rxPackets: '9.8 M',
    txPackets: '11.0 M',
    xdpStatus: 'Aggregated Ring',
    driver: 'bonding (LACP balance-rr)',
  },
  {
    name: 'wg0',
    type: 'VPN',
    mac: 'N/A (Point-to-Point)',
    ip: '10.80.0.1 / 16',
    speed: 'WireGuard Tunnel',
    duplex: 'Virtual',
    mtu: 1420,
    status: 'UP',
    rxBytes: '4.8 GB',
    txBytes: '5.2 GB',
    rxPackets: '3.4 M',
    txPackets: '3.6 M',
    xdpStatus: 'ChaCha20 Kernel',
    driver: 'wireguard.ko',
  },
];

interface InterfacesViewProps {
  onOpenModal: (modal: ActiveModal) => void;
}

export const InterfacesView: React.FC<InterfacesViewProps> = ({ onOpenModal }) => {
  const [interfaces, setInterfaces] = useState<InterfaceCard[]>(initialInterfaces);
  const [selectedIface, setSelectedIface] = useState<InterfaceCard>(initialInterfaces[0]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-low border border-outline-variant/50 p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-secondary/15 text-secondary font-semibold border border-secondary/30">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse mr-1.5"></span>
              ALL PHY LINKS UP (5 / 5 Active)
            </span>
            <span className="text-xs font-mono text-on-surface-variant">Kernel Netdev Subsystem: ethtool / netlink</span>
          </div>
          <h1 className="text-xl font-bold text-on-surface font-headline tracking-wide mt-1">
            Physical Network Adapters & Virtual Links
          </h1>
          <p className="text-xs text-on-surface-variant max-w-2xl mt-0.5">
            Hardware NIC offloads, 10G SFP+ optical transceivers, LACP 802.3ad trunking, and WireGuard secure interfaces.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenModal('tc-qdisc-inspector')}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant rounded-lg text-xs font-mono transition"
          >
            <Sliders className="w-4 h-4 text-primary" />
            <span>tc Queue Map</span>
          </button>
        </div>
      </div>

      {/* Interfaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {interfaces.map((iface) => (
          <div
            key={iface.name}
            onClick={() => setSelectedIface(iface)}
            className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
              selectedIface.name === iface.name
                ? 'bg-surface-container-high/80 border-primary ring-1 ring-primary/40'
                : 'bg-surface-container-low border-outline-variant/60 hover:border-outline'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-on-surface">{iface.name}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                    iface.type === 'WAN' 
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : iface.type === 'LAN'
                      ? 'bg-secondary/20 text-secondary border border-secondary/30'
                      : iface.type === 'BOND'
                      ? 'bg-tertiary/20 text-tertiary border border-tertiary/30'
                      : 'bg-surface-container text-on-surface border border-outline-variant'
                  }`}>
                    {iface.type}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-secondary">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  {iface.status}
                </span>
              </div>

              <div className="mt-2 text-xs font-mono text-on-surface font-semibold">{iface.ip}</div>
              <div className="text-[11px] font-mono text-on-surface-variant mt-0.5">{iface.mac}</div>

              <div className="mt-3 pt-3 border-t border-outline-variant/40 space-y-1 text-[11px] font-mono">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Link Speed:</span>
                  <span className="text-on-surface font-medium">{iface.speed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">MTU Size:</span>
                  <span className="text-on-surface font-medium">{iface.mtu} Bytes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">eBPF XDP:</span>
                  <span className="text-secondary font-medium">{iface.xdpStatus}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1 text-primary">
                <ArrowDownLeft className="w-3.5 h-3.5" /> {iface.rxBytes}
              </span>
              <span className="flex items-center gap-1 text-tertiary">
                <ArrowUpRight className="w-3.5 h-3.5" /> {iface.txBytes}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Interface Hardware Diagnostics */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-5">
        <h3 className="text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-3 flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-primary" />
          Hardware NIC Diagnostics: {selectedIface.name} ({selectedIface.driver})
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/40">
            <span className="text-on-surface-variant text-[10px]">RX Ring Buffer</span>
            <div className="text-base font-bold text-on-surface mt-1">4096 / 4096</div>
            <span className="text-[10px] text-secondary">Zero Overruns</span>
          </div>

          <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/40">
            <span className="text-on-surface-variant text-[10px]">TX Ring Buffer</span>
            <div className="text-base font-bold text-on-surface mt-1">4096 / 4096</div>
            <span className="text-[10px] text-secondary">Zero Collisions</span>
          </div>

          <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/40">
            <span className="text-on-surface-variant text-[10px]">Hardware Offload</span>
            <div className="text-base font-bold text-secondary mt-1">TSO, LRO, GRO</div>
            <span className="text-[10px] text-on-surface-variant">ASIC Accelerated</span>
          </div>

          <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/40">
            <span className="text-on-surface-variant text-[10px]">Transceiver SFP+</span>
            <div className="text-base font-bold text-primary mt-1">10G-SR (850nm)</div>
            <span className="text-[10px] text-on-surface-variant">Optical DDM: -2.4 dBm</span>
          </div>
        </div>
      </div>
    </div>
  );
};
