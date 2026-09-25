export type ViewMode = 
  | 'traffic-shaping' 
  | 'multi-wan' 
  | 'live-log' 
  | 'git-rollback'
  | 'interfaces'
  | 'overview';

export type ActiveModal = 
  | null
  | 'bufferbloat-bench'
  | 'tc-qdisc-inspector'
  | 'fq-codel-tuning'
  | 'htb-configurator'
  | 'create-pbr-rule'
  | 'gateway-watchdog'
  | 'bgp-peer-config'
  | 'create-snapshot'
  | 'route-test'
  | 'quick-search';

export interface SystemTelemetry {
  cpuUsage: number;
  ramUsage: number;
  temperature: number;
  uptime: string;
  throughput: string;
  packetRate: string;
  activeEngine: string;
  activeUplinks: string;
}

export interface FairQueuedStream {
  id: string;
  sourceTarget: string;
  appLabel: string;
  priorityTier: string;
  tierColor: 'secondary' | 'primary' | 'tertiary' | 'on-surface-variant';
  queueDepth: string;
  ecnMarks: number;
  drops: number;
  throughput: string;
}

export interface PbrRule {
  pref: number;
  id: string;
  name: string;
  descriptor: string;
  sourceMatch: string;
  destinationPort: string;
  proto: string;
  dscpMark: string;
  targetTable: string;
  targetGateway: string;
  hitPackets: string;
  state: 'ACTIVE' | 'DISABLED' | 'CORE';
  locked?: boolean;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  subsystem: string;
  verdict: 'DROP' | 'ACCEPT' | 'ALERT' | 'INFO' | 'DEBUG' | 'BLOCK' | 'PASS';
  verdictClass: string;
  interface: string;
  payload: string;
  summary: string;
  srcIp?: string;
  dstIp?: string;
  protocol?: string;
  flags?: string;
  rule?: string;
  hexdump?: string[];
  rawPacket?: {
    etherType: string;
    macDst: string;
    ipSrc: string;
    ipDst: string;
    l4Proto: string;
    ports: string;
    tcpFlags: string;
    window: number;
    ebpfProg: string;
    dropReason: string;
  };
}

export interface GitSnapshot {
  sha: string;
  timeAgo: string;
  message: string;
  author: string;
  filesChanged: number;
  additions: number;
  deletions: number;
  tags?: string[];
  category: 'manual' | 'firewall' | 'pre-flight' | 'wireguard' | 'system';
  isHead?: boolean;
}
