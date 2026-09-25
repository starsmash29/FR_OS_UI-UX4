import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Play, 
  Pause, 
  Trash2, 
  Filter, 
  Download, 
  Copy, 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileCode, 
  Binary,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { LogEntry } from '../../types';

interface LiveLogViewProps {
  logs: LogEntry[];
  onClearLogs?: () => void;
}

export const LiveLogView: React.FC<LiveLogViewProps> = ({ logs: initialLogs, onClearLogs }) => {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(initialLogs[0] || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [subsystemFilter, setSubsystemFilter] = useState<string>('ALL');
  const [verdictFilter, setVerdictFilter] = useState<string>('ALL');
  const [copiedHex, setCopiedHex] = useState<boolean>(false);

  // Auto append fake live logs if streaming is true
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      const randomPort = Math.floor(1024 + Math.random() * 60000);
      const isDrop = Math.random() > 0.6;
      const newEntry: LogEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        subsystem: isDrop ? 'xdp_drop' : 'nft_filter',
        verdict: isDrop ? 'DROP' : 'ACCEPT',
        verdictClass: isDrop ? 'bg-error/20 text-error' : 'bg-secondary-container/30 text-secondary',
        interface: 'eth0',
        payload: isDrop 
          ? `XDP_DROP proto=TCP src=198.51.100.${Math.floor(Math.random()*254)}:${randomPort} dst=192.168.1.1:443 tcp_flags=[SYN] reason="Rate limit"`
          : `NFT_ACCEPT proto=UDP src=192.168.1.100:${randomPort} dst=1.1.1.1:53 bytes=74`,
        summary: isDrop ? 'XDP Port Scan Threshold Exceeded' : 'DNS Resolver Query Forwarded',
        srcIp: `198.51.100.${Math.floor(Math.random()*254)}:${randomPort}`,
        dstIp: isDrop ? '192.168.1.1:443' : '1.1.1.1:53',
        protocol: isDrop ? 'TCP (6)' : 'UDP (17)',
        flags: isDrop ? '0x002 [SYN]' : '-',
        rule: isDrop ? 'XDP_SYNPROXY_RULE_3' : 'NFT_CONNTRACK_ESTABLISHED',
        hexdump: [
          '52 54 00 12 34 56 00 1b  21 34 56 78 08 00 45 00  RT..4V..!4Vx..E.',
          '00 3c 1a 2b 40 00 40 06  b2 1a c6 33 64 2c c0 a8  .<.+@.@....3d,..',
          '01 01 d4 31 00 16 00 00  00 00 00 00 00 00 a0 02  ...1............',
        ],
        rawPacket: {
          etherType: 'IPv4 (0x0800)',
          macDst: '52:54:00:12:34:56 (FR_OS Gateway)',
          ipSrc: `198.51.100.${Math.floor(Math.random()*254)}`,
          ipDst: isDrop ? '192.168.1.1' : '1.1.1.1',
          l4Proto: isDrop ? 'TCP (6)' : 'UDP (17)',
          ports: `${randomPort} -> ${isDrop ? '443' : '53'}`,
          tcpFlags: isDrop ? '0x002 [SYN]' : 'N/A',
          window: 1024,
          ebpfProg: isDrop ? 'xdp_ratelimit.o' : 'nft_fastpath.o',
          dropReason: isDrop ? 'RATE_BURST_EXCEEDED' : 'FORWARD_SUCCESS',
        }
      };

      setLogs(prev => [newEntry, ...prev.slice(0, 49)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.payload.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.subsystem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubsystem = subsystemFilter === 'ALL' || log.subsystem === subsystemFilter;
    const matchesVerdict = verdictFilter === 'ALL' || log.verdict === verdictFilter;
    return matchesSearch && matchesSubsystem && matchesVerdict;
  });

  const handleCopyHex = () => {
    if (!selectedLog?.hexdump) return;
    navigator.clipboard?.writeText(selectedLog.hexdump.join('\n'));
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stream Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-low border border-outline-variant/50 p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold border ${
              isStreaming
                ? 'bg-secondary/15 text-secondary border-secondary/30'
                : 'bg-surface-container text-on-surface-variant border-outline-variant'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isStreaming ? 'bg-secondary animate-pulse' : 'bg-on-surface-variant'}`}></span>
              {isStreaming ? 'RING BUFFER ACTIVE (eBPF PERF)' : 'STREAM PAUSED'}
            </span>
            <span className="text-xs font-mono text-on-surface-variant">eBPF Tracepoint: /sys/kernel/debug/tracing/events/net</span>
          </div>
          <h1 className="text-xl font-bold text-on-surface font-headline tracking-wide mt-1">
            Real-Time Kernel Netfilter & eBPF Packet Inspector
          </h1>
          <p className="text-xs text-on-surface-variant max-w-2xl mt-0.5">
            Zero-copy packet telemetry captured at the NIC driver layer (XDP native) and Netfilter forward chains with payload hexdump.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-semibold transition ${
              isStreaming
                ? 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant'
                : 'bg-secondary hover:bg-secondary/90 text-on-secondary shadow-sm'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-4 h-4 text-secondary" />
                <span>Pause Stream</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Resume Stream</span>
              </>
            )}
          </button>

          <button
            onClick={() => setLogs([])}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container hover:bg-error/20 text-on-surface-variant hover:text-error border border-outline-variant rounded-lg text-xs font-mono transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Buffer</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Subsystem Dropdown */}
          <div className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1 rounded-lg border border-outline-variant text-xs font-mono">
            <span className="text-on-surface-variant">Subsystem:</span>
            <select
              value={subsystemFilter}
              onChange={(e) => setSubsystemFilter(e.target.value)}
              className="bg-transparent text-on-surface font-bold focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Sources</option>
              <option value="xdp_drop">XDP Fastpath</option>
              <option value="nft_filter">Netfilter NFT</option>
              <option value="suricata">Suricata IDS</option>
              <option value="bird_bgp">BIRD BGP</option>
            </select>
          </div>

          {/* Verdict Filter */}
          <div className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1 rounded-lg border border-outline-variant text-xs font-mono">
            <span className="text-on-surface-variant">Verdict:</span>
            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              className="bg-transparent text-on-surface font-bold focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Verdicts</option>
              <option value="DROP">DROP</option>
              <option value="ACCEPT">ACCEPT</option>
              <option value="ALERT">ALERT</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search payload, IP, flags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-surface-container border border-outline-variant rounded-lg text-xs font-mono text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary w-full md:w-64"
          />
        </div>
      </div>

      {/* Main Split View: Stream on Left, Deep Packet Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Stream List */}
        <div className="lg:col-span-7 bg-surface-container-low border border-outline-variant/60 rounded-xl overflow-hidden flex flex-col h-[580px]">
          <div className="p-3 border-b border-outline-variant/40 bg-surface-container flex items-center justify-between text-xs font-mono text-on-surface-variant">
            <span>Live Kernel Events ({filteredLogs.length})</span>
            <span>Click entry for raw dissection</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/20 font-mono text-xs">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant">
                No logs match the current filters.
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`p-3 cursor-pointer transition flex flex-col gap-1.5 ${
                    selectedLog?.id === log.id 
                      ? 'bg-surface-container-high/80 border-l-2 border-primary' 
                      : 'hover:bg-surface-container/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        log.verdict === 'DROP'
                          ? 'bg-error/20 text-error border border-error/30'
                          : log.verdict === 'ALERT'
                          ? 'bg-tertiary/20 text-tertiary border border-tertiary/30'
                          : 'bg-secondary/20 text-secondary border border-secondary/30'
                      }`}>
                        {log.verdict}
                      </span>
                      <span className="text-primary font-bold text-[11px]">{log.subsystem}</span>
                      <span className="text-on-surface-variant text-[10px]">[{log.interface}]</span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant">{log.timestamp.slice(11, 23)}</span>
                  </div>

                  <div className="text-[11px] text-on-surface truncate">
                    {log.payload}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-on-surface-variant">
                    <span>{log.summary}</span>
                    {log.rule && <span className="text-secondary/80">Rule: {log.rule}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Deep Packet Dissection & Hex Dump */}
        <div className="lg:col-span-5 bg-surface-container-low border border-outline-variant/60 rounded-xl overflow-hidden flex flex-col h-[580px]">
          <div className="p-3 border-b border-outline-variant/40 bg-surface-container flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-on-surface flex items-center gap-1.5">
              <Binary className="w-4 h-4 text-primary" />
              Packet Dissection & Hexdump
            </span>
            {selectedLog && (
              <button
                onClick={handleCopyHex}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high hover:bg-surface-bright text-[10px] text-on-surface transition"
              >
                {copiedHex ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-secondary" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Hex</span>
                  </>
                )}
              </button>
            )}
          </div>

          {selectedLog ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
              {/* Header Breakdown */}
              <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/50 space-y-2">
                <div className="text-[11px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5" />
                  Kernel Protocol Dissection
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-on-surface-variant block text-[10px]">Source Socket</span>
                    <span className="text-on-surface font-bold">{selectedLog.srcIp || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[10px]">Destination Socket</span>
                    <span className="text-primary font-bold">{selectedLog.dstIp || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[10px]">L4 Protocol</span>
                    <span className="text-on-surface">{selectedLog.protocol || 'TCP'}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[10px]">TCP Flags</span>
                    <span className="text-tertiary">{selectedLog.flags || '-'}</span>
                  </div>
                </div>

                {selectedLog.rawPacket && (
                  <div className="pt-2 border-t border-outline-variant/30 text-[10px] text-on-surface-variant space-y-1">
                    <div>eBPF Engine: <strong className="text-secondary">{selectedLog.rawPacket.ebpfProg}</strong></div>
                    <div>Drop / Forward Reason: <strong className="text-error">{selectedLog.rawPacket.dropReason}</strong></div>
                  </div>
                )}
              </div>

              {/* Raw Hex Dump */}
              <div>
                <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Raw Frame Hexdump (Offset / Hex / ASCII)
                </div>
                <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40 font-mono text-[10px] leading-relaxed text-secondary/90 overflow-x-auto">
                  {selectedLog.hexdump && selectedLog.hexdump.length > 0 ? (
                    selectedLog.hexdump.map((line, idx) => (
                      <div key={idx} className="whitespace-pre">
                        <span className="text-on-surface-variant mr-2">{(idx * 16).toString(16).padStart(4, '0')}:</span>
                        {line}
                      </div>
                    ))
                  ) : (
                    <div className="text-on-surface-variant">No raw payload capture for this event.</div>
                  )}
                </div>
              </div>

              {/* Quick Mitigation Action */}
              <div className="p-3 bg-surface-container rounded-lg border border-outline-variant flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-on-surface">Immediate Rule Action</div>
                  <div className="text-[10px] text-on-surface-variant">Inject drop rule into XDP native blacklist</div>
                </div>
                <button
                  onClick={() => alert(`Injected drop rule for IP ${selectedLog.srcIp?.split(':')[0]} into XDP map!`)}
                  className="px-3 py-1.5 bg-error/20 hover:bg-error/30 text-error border border-error/40 rounded text-xs font-bold transition"
                >
                  Block IP in eBPF
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-on-surface-variant text-xs">
              Select a log entry to inspect deep packet headers.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
