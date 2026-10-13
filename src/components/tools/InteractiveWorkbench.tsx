import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Globe, 
  Server, 
  Terminal, 
  Search, 
  Cpu, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Sliders, 
  FileCode2, 
  Radio,
  Layers,
  HardDrive,
  Shield,
  Activity,
  ArrowRight,
  Users,
  Kanban
} from 'lucide-react';
import { 
  NocTool, 
  EAPopRecord, 
  PublicIPRecord, 
  AradialLogRecord, 
  DHCPLogRecord 
} from '../../types';
import { 
  MOCK_EA_POP_DATA, 
  MOCK_PUBLIC_IPS, 
  MOCK_ARADIAL_LOGS, 
  MOCK_DHCP_LOGS 
} from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';
import { useActivity } from '../../context/ActivityContext';
import { DataTerminasiTool } from './DataTerminasiTool';
import { CekConfigCNGTool } from './CekConfigCNGTool';
import CekAradialBngTool from "./CekAradialBngTool";
import LogDhcpBngTool from "./LogDhcpBngTool";
import CekEaPopTool from "./CekEaPopTool";
import CekIpPublik from "./CekIpPublik";
import CekBBIPJawaBali from "./CekBBIPJawaBali";
import VVIPServiceCheck from "./VVIPServiceCheck";
import TracemplsCisco from './TracemplsCisco';
import WhoisLookup from './WhoisLookup';
import MacVendorLookup from './MacVendorLookup';

interface InteractiveWorkbenchProps {
  initialToolId?: string;
  tools: NocTool[];
  isEmbedded?: boolean;
  hideSelectorStrip?: boolean;
  onSelectTool?: (toolId: string) => void;
  onNavigateEcho?: () => void;
}

interface DataTerminasiRow {
  hostid?: string | number;
  hostname: string;
  ip_loopback: string;
  port: string;
}

export const InteractiveWorkbench: React.FC<InteractiveWorkbenchProps> = ({
  initialToolId = 'cek-ea-pop',
  tools,
  isEmbedded = false,
  hideSelectorStrip = false,
  onSelectTool,
  onNavigateEcho,
}) => {
  const { isDark } = useTheme();
  const { logToolAccess, logActivity } = useActivity();
  const [selectedToolId, setSelectedToolId] = useState<string>(initialToolId);

  // Sync selected tool if initialToolId prop changes
  useEffect(() => {
    if (initialToolId) {
      setSelectedToolId(initialToolId);
    }
  }, [initialToolId]);

  const handleSelectTool = (toolId: string) => {
    setSelectedToolId(toolId);
    if (onSelectTool) onSelectTool(toolId);
    const target = tools.find((t) => t.id === toolId);
    if (target) {
      logToolAccess(target);
    } else {
      logToolAccess({ id: toolId, name: toolId.toUpperCase() });
    }
  };

  // Cek EA State
  const [eaQuery, setEaQuery] = useState('EA-0912-CORP-PLN');
  const [eaResult, setEaResult] = useState<EAPopRecord | null>(MOCK_EA_POP_DATA[0]);
  const [eaTesting, setEaTesting] = useState(false);
  const [eaConsoleLog, setEaConsoleLog] = useState<string[]>([
    'System ready. Query executed via internal microservice /api/v1/ea-pop (Port 3000)',
    'Connected to PE-JKT-ASR9K-01 via internal telemetry stream',
  ]);

  // Cek IP Publik State
  const [ipQuery, setIpQuery] = useState('103.147.22.45');
  const [ipResult, setIpResult] = useState<PublicIPRecord | null>(MOCK_PUBLIC_IPS[0]);

  // Data Terminasi: real data comes from the Flask/MySQL API, never directly from MySQL.
  const [terminasiQuery, setTerminasiQuery] = useState('');
  const [terminasiRows, setTerminasiRows] = useState<DataTerminasiRow[]>([]);
  const [terminasiLoading, setTerminasiLoading] = useState(false);
  const [terminasiError, setTerminasiError] = useState<string | null>(null);

  // Aradial BNG State
  const [aradialUserQuery, setAradialUserQuery] = useState('cust_pln_du01@metro.corp');
  const [aradialLogs, setAradialLogs] = useState<AradialLogRecord[]>(MOCK_ARADIAL_LOGS);
  const [kickSuccessNotice, setKickSuccessNotice] = useState<string | null>(null);

  // TraceMPLS Cisco State
  const [sourcePE, setSourcePE] = useState('PE-JKT-ASR9K-01');
  const [destTarget, setDestTarget] = useState('103.147.22.45');
  const [vrfName, setVrfName] = useState('VRF-CORPORATE');
  const [isTracing, setIsTracing] = useState(false);
  const [traceLogs, setTraceLogs] = useState<string[]>([
    'PE-JKT-ASR9K-01# traceroute mpls ipv4 103.147.22.45/32 vrf VRF-CORPORATE',
    'Tracing MPLS TE / LDP Label Switched Path to 103.147.22.45, timeout is 2 seconds:',
    '  1 10.250.0.2 [MPLS: Labels 24012/19, Exp 0] 1.82 ms 1.74 ms 1.69 ms',
    '  2 10.250.2.1 [MPLS: Label 19, Exp 0] 7.12 ms 7.05 ms 7.09 ms',
    '  3 103.147.22.45 [AS 136052 PE-SBY-MX960] 12.44 ms 12.38 ms 12.41 ms',
    'Success: Path verified with 0 packet loss.',
  ]);

  // Whois State
  const [whoisQuery, setWhoisQuery] = useState('jozzlabs.net.id');
  const [whoisOutput, setWhoisOutput] = useState({
    domain: 'jozzlabs.net.id',
    registrar: 'PANDI / IDNIC Member 091',
    asn: 'AS136052 (PT JOZZLABS NETWORK PRIMA)',
    prefix: '103.147.22.0/24, 103.56.208.0/24',
    status: 'ACTIVE / OK',
    dnsA: '103.147.22.10',
    dnsMx: 'mail.jozzlabs.net.id (priority 10)',
    contact: 'noc@jozzlabs.net.id / +62-21-5098xxxx',
  });

  // MAC Vendor State
  const [macQuery, setMacQuery] = useState('70:69:79:B4:9C:12');
  const [macVendorResult, setMacVendorResult] = useState<{
    mac: string;
    vendor: string;
    oui: string;
    type: string;
    country: string;
  } | null>({
    mac: '70:69:79:B4:9C:12',
    vendor: 'Cisco Systems, Inc',
    oui: '70-69-79',
    type: 'Enterprise Routing & Optical SFP Interface',
    country: 'United States',
  });

  // Config COST NCS State
  const [ncsRouter, setNcsRouter] = useState('NCS-5501-JKT-01');
  const [costValue, setCostValue] = useState('5000');
  const [interfaceTarget, setInterfaceTarget] = useState('Bundle-Ether10 (DWDM-Pantura)');
  const [copiedCli, setCopiedCli] = useState(false);

  // Generic Tool Runner State (for any tool not in the top 8)
  const [genericQuery, setGenericQuery] = useState('');
  const [genericLoading, setGenericLoading] = useState(false);
  const [genericLogs, setGenericLogs] = useState<string[]>([]);

  // Handlers
  const handleSearchEA = (e: React.FormEvent) => {
    e.preventDefault();
    setEaTesting(true);
    logActivity({
      title: `Checked EA / POP: ${eaQuery}`,
      actor: 'Rudi',
      badge: 'Diagnostic',
      iconName: 'Search',
      iconBg: 'bg-[#0284c7]',
      actionToolId: 'cek-ea-pop',
    });
    setTimeout(() => {
      const match = MOCK_EA_POP_DATA.find(
        (item) =>
          item.eaNumber.toLowerCase().includes(eaQuery.toLowerCase()) ||
          item.customer.toLowerCase().includes(eaQuery.toLowerCase()) ||
          item.popLocation.toLowerCase().includes(eaQuery.toLowerCase())
      ) || MOCK_EA_POP_DATA[0];

      setEaResult(match);
      setEaConsoleLog((prev) => [
        `[${new Date().toLocaleTimeString()}] Query EA: ${eaQuery} -> Found ${match.eaNumber} (${match.customer})`,
        `Optical power read: ${match.opticalPower}, Port: ${match.interfacePort}, Status: ${match.status}`,
        ...prev.slice(0, 4),
      ]);
      setEaTesting(false);
    }, 400);
  };

  const handlePingTestEA = () => {
    if (!eaResult) return;
    setEaTesting(true);
    logActivity({
      title: `Ping test EA interface: ${eaResult.eaNumber}`,
      actor: 'Rudi',
      badge: 'Diagnostic',
      iconName: 'Radio',
      iconBg: 'bg-blue-600',
      actionToolId: 'cek-ea-pop',
    });
    setEaConsoleLog((prev) => [
      `[${new Date().toLocaleTimeString()}] Executing ICMP Ping from ${eaResult.routerName} to customer interface...`,
      'Sending 5, 100-byte ICMP Echos to PE gateway, timeout is 2 seconds:',
      '!!!!! (5/5 success rate, min/avg/max = 1.2/1.8/2.1 ms)',
      ...prev,
    ]);
    setTimeout(() => setEaTesting(false), 500);
  };

  const handleSearchIP = (e: React.FormEvent) => {
    e.preventDefault();
    logActivity({
      title: `Looked up Public IP: ${ipQuery}`,
      actor: 'Rudi',
      badge: 'Diagnostic',
      iconName: 'Globe',
      iconBg: 'bg-[#0284c7]',
      actionToolId: 'cek-ip-publik',
    });
    const match = MOCK_PUBLIC_IPS.find((item) =>
      item.ip.includes(ipQuery) || item.subnet.includes(ipQuery)
    ) || {
      ip: ipQuery,
      subnet: `${ipQuery}/24`,
      popLocation: 'POP-JKT-CYBER01 (Jakarta)',
      asn: 'AS136052',
      asnName: 'PT JOZZLABS NETWORK PRIMA',
      bngGateway: 'BNG-JKT-ASR9K-01',
      status: 'Allocated',
      usageType: 'Corporate DIA',
    };
    setIpResult(match);
  };

  const handleSearchTerminasi = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = terminasiQuery.trim();
    if (!query) return;

    setTerminasiLoading(true);
    setTerminasiError(null);
    setTerminasiRows([]);
    logActivity({
      title: `Lookup Data Terminasi: ${query}`,
      actor: 'Rudi',
      badge: 'Diagnostic',
      iconName: 'Search',
      iconBg: 'bg-blue-600',
      actionToolId: 'data-terminasi',
    });

    try {
      const baseUrl = import.meta.env.VITE_DATA_TERMINASI_API_URL || 'http://localhost:5009/api/data-terminasi';
      const url = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}service_id=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API mengembalikan HTTP ${response.status}`);
      const payload = await response.json();
      const rows = Array.isArray(payload) ? payload : payload.results;
      if (!Array.isArray(rows)) throw new Error('Format response API tidak dikenali');
      setTerminasiRows(rows);
    } catch (error) {
      setTerminasiError(error instanceof Error ? error.message : 'Gagal menghubungi API Data Terminasi');
    } finally {
      setTerminasiLoading(false);
    }
  };

  const handleRunTraceroute = () => {
    setIsTracing(true);
    logActivity({
      title: `Executed MPLS Traceroute to ${destTarget}`,
      actor: 'Rudi',
      badge: 'Diagnostic',
      iconName: 'Terminal',
      iconBg: 'bg-[#059669]',
      actionToolId: 'tracempls-cisco',
    });
    setTraceLogs(['Initializing MPLS trace from ' + sourcePE + ' to ' + destTarget + '...']);
    setTimeout(() => {
      setTraceLogs([
        `${sourcePE}# traceroute mpls ipv4 ${destTarget}/32 vrf ${vrfName}`,
        `Tracing MPLS TE / LDP Label Switched Path to ${destTarget}, timeout is 2 seconds:`,
        `  1 10.250.0.2 [MPLS: Labels 24012/19, Exp 0, TTL 1] 1.82 ms 1.74 ms 1.69 ms`,
        `  2 10.250.2.1 [MPLS: Label 19, Exp 0, TTL 2] 7.12 ms 7.05 ms 7.09 ms`,
        `  3 ${destTarget} [AS 136052 PE-SBY-MX960, TTL 3] 12.44 ms 12.38 ms 12.41 ms`,
        `[OK] End-to-end LSP active with zero packet drop across DWDM Java core.`,
      ]);
      setIsTracing(false);
    }, 600);
  };

  const handleKickSession = (username: string) => {
    setKickSuccessNotice(`Session ${username} berhasil di-disconnect dari BNG-JKT-ASR9K-01 (RADIUS CoA Ack).`);
    logActivity({
      title: `Kicked Aradial BNG session: ${username}`,
      actor: 'Rudi',
      badge: 'Tool Access',
      iconName: 'Server',
      iconBg: 'bg-[#dc2626]',
      actionToolId: 'cek-aradial-bng',
    });
    setTimeout(() => setKickSuccessNotice(null), 4000);
  };

  const handleSearchMac = (e: React.FormEvent) => {
    e.preventDefault();
    logActivity({
      title: `OUI MAC lookup: ${macQuery}`,
      actor: 'Rudi',
      badge: 'Diagnostic',
      iconName: 'Cpu',
      iconBg: 'bg-[#7c3aed]',
      actionToolId: 'mac-vendor-lookup',
    });
    const cleanMac = macQuery.toUpperCase();
    if (cleanMac.startsWith('00:04:96') || cleanMac.startsWith('00-04-96')) {
      setMacVendorResult({
        mac: macQuery,
        vendor: 'Extreme Networks, Inc.',
        oui: '00-04-96',
        type: 'Summit Core Switch / Aggregation',
        country: 'United States',
      });
    } else if (cleanMac.startsWith('E4:95:6E') || cleanMac.startsWith('E4-95-6E')) {
      setMacVendorResult({
        mac: macQuery,
        vendor: 'Huawei Technologies Co., Ltd',
        oui: 'E4-95-6E',
        type: 'SmartAX GPON OLT / ONT CPE',
        country: 'China',
      });
    } else {
      setMacVendorResult({
        mac: macQuery,
        vendor: 'Cisco Systems, Inc',
        oui: '70-69-79',
        type: 'Enterprise Routing & Optical SFP Interface',
        country: 'United States',
      });
    }
  };

  const handleRunGenericTool = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setGenericLoading(true);
    logActivity({
      title: `Executed ${currentTool.name}`,
      actor: 'Rudi',
      badge: 'Tool Access',
      iconName: 'Terminal',
      iconBg: 'bg-blue-600',
      actionToolId: currentTool.id,
    });
    setGenericLogs([
      `[${new Date().toLocaleTimeString()}] Dispatching internal call to ${currentTool.internalPath}...`,
      `Protocol: RESTCONF / SNMP Telemetry v3`,
      `Target: ${genericQuery || 'ALL_TARGETS'}`,
    ]);
    setTimeout(() => {
      setGenericLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Response 200 OK received in ${currentTool.latencyMs || 15}ms`,
        `Synchronized telemetry payload with local edge cache`,
        `Operation finished successfully. No external redirects triggered.`,
      ]);
      setGenericLoading(false);
    }, 600);
  };

  const currentTool = tools.find((t) => t.id === selectedToolId) || tools[0];

  // Tool buttons list
  const PRIMARY_TOOLS = [
    { id: 'cek-ea-pop', label: 'CEK EA POP', icon: Network },
    { id: 'cek-ip-publik', label: 'CEK IP PUBLIK', icon: Globe },
    { id: 'cek-aradial-bng', label: 'CEK ARADIAL BNG', icon: Server },
    { id: 'cek-log-dhcp-bng', label: 'LOG DHCP BNG', icon: FileCode2 },
    { id: 'tracempls-cisco', label: 'TRACEMPLS CISCO', icon: Terminal },
    { id: 'mac-vendor-lookup', label: 'MAC VENDOR', icon: Cpu },
    { id: 'whois-lookup', label: 'WHOIS LOOKUP', icon: Search },
    { id: 'config-cost-ncs', label: 'CONFIG COST NCS', icon: Sliders },
    { id: 'data-terminasi', label: 'DATA TERMINASI', icon: HardDrive },
    { id: 'cek-config-cng', label: 'CEK CONFIG CNG', icon: Server },
    {id: 'cek-bb-ip-jawa-bali', label: 'CEK BB IP JAWA BALI', icon: Network },
    { id: "vvip-service-check", label: "VVIP SERVICE CHECK", icon: Radio },

  ];

  // Check if current tool is one of the custom UI tools
  const isCustomTool = PRIMARY_TOOLS.some((t) => t.id === selectedToolId) || selectedToolId === 'echo-team';

  const toolContent = (
    <div className={`border rounded-2xl shadow-xs overflow-hidden transition-colors ${
      isDark ? 'bg-[#0c1322] border-[#16233b]' : 'bg-white border-slate-200'
    }`}>
      
      {/* Header of Active Tool */}
      <div className={`p-4 sm:p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50/80 border-slate-200'
      }`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                isDark 
                  ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400' 
                  : 'bg-blue-50 border border-blue-200 text-blue-600'
              }`}>
                {currentTool.name.slice(0, 2)}
              </div>
              <div>
                <h2 className={`text-base font-bold flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  <span>{currentTool.name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-normal border ${
                    isDark 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    ACTIVE IN-PORTAL
                  </span>
                </h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {currentTool.description} &bull; {currentTool.subtext}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Target Protocol:</span>
              <span className={`font-mono px-2 py-0.5 rounded border text-[11px] ${
                isDark 
                  ? 'text-slate-200 bg-slate-800 border-slate-700' 
                  : 'text-slate-700 bg-slate-100 border-slate-200'
              }`}>
                SNMP / NETCONF / RESTCONF
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            

            {/* 8. CONFIG COST NCS WORKBENCH */}
            {selectedToolId === 'config-cost-ncs' && (
              <div className="space-y-6">
                <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
                  isDark 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                    isDark ? 'text-amber-400' : 'text-amber-600'
                  }`} />
                  <div>
                    <span className="font-bold block mb-1">Impact Gangguan DWDM (Traffic Engineering Helper):</span>
                    Gunakan konfigurasi ini untuk menaikkan OSPF metric cost pada router Cisco NCS ketika terjadi degradasi atau fiber-cut, sehingga traffic beralih ke rute proteksi tanpa loop.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={`text-xs block mb-1 font-medium ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>Pilih Router Cisco NCS:</label>
                    <select
                      value={ncsRouter}
                      onChange={(e) => setNcsRouter(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl border text-sm transition-colors focus:outline-none focus:border-blue-500 ${
                        isDark ? 'bg-[#0c1220] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-2xs'
                      }`}
                    >
                      <option value="NCS-5501-JKT-01">NCS-5501-JKT-01 (Jakarta Core)</option>
                      <option value="NCS-5501-SBY-01">NCS-5501-SBY-01 (Surabaya Core)</option>
                      <option value="NCS-5501-SMG-01">NCS-5501-SMG-01 (Semarang Core)</option>
                    </select>
                  </div>

                  <div>
                    <label className={`text-xs block mb-1 font-medium ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>Interface Link DWDM:</label>
                    <select
                      value={interfaceTarget}
                      onChange={(e) => setInterfaceTarget(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl border text-sm transition-colors focus:outline-none focus:border-blue-500 ${
                        isDark ? 'bg-[#0c1220] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-2xs'
                      }`}
                    >
                      <option value="Bundle-Ether10 (DWDM-Pantura)">Bundle-Ether10 (DWDM-Pantura)</option>
                      <option value="Bundle-Ether20 (DWDM-Mahameru-Selatan)">Bundle-Ether20 (DWDM-Mahameru-Selatan)</option>
                      <option value="TenGigE0/0/0/4 (DWDM-Kabel-Laut)">TenGigE0/0/0/4 (DWDM-Kabel-Laut)</option>
                    </select>
                  </div>

                  <div>
                    <label className={`text-xs block mb-1 font-medium ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>OSPF Cost Target:</label>
                    <input
                      type="number"
                      value={costValue}
                      onChange={(e) => setCostValue(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl border text-sm font-mono transition-colors focus:outline-none focus:border-blue-500 ${
                        isDark ? 'bg-[#0c1220] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-2xs'
                      }`}
                    />
                  </div>
                </div>

                {/* Generated Copyable CLI */}
                <div className={`border rounded-xl p-4 font-mono text-xs ${
                  isDark ? 'bg-[#070b13] border-slate-800 text-slate-200' : 'bg-slate-900 border-slate-800 text-slate-100 shadow-md'
                }`}>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
                    <span>Generated Cisco IOS-XR Config Command:</span>
                    <button
                      onClick={() => {
                        const cmd = `configure terminal\nrouter ospf 1\n area 0\n  interface ${interfaceTarget.split(' ')[0]}\n   cost ${costValue}\n  exit\n exit\ncommit\nend`;
                        navigator.clipboard.writeText(cmd);
                        setCopiedCli(true);
                        setTimeout(() => setCopiedCli(false), 2000);
                      }}
                      className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-sans cursor-pointer transition-colors"
                    >
                      {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCli ? 'Tersalin!' : 'Salin CLI'}</span>
                    </button>
                  </div>
                  <pre className="text-blue-400 leading-relaxed overflow-x-auto">
{`configure terminal
router ospf 1
 area 0
  interface ${interfaceTarget.split(' ')[0]}
   cost ${costValue}
  exit
 exit
commit
end`}
                  </pre>
                </div>
              </div>
            )}

            {/* ECHO TEAM DEDICATED IN-PORTAL WORKBENCH VIEW */}
            {selectedToolId === 'echo-team' && (
              <div className="space-y-6">
                <div className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isDark ? 'bg-[#10192b] border-[#18263e]' : 'bg-indigo-50/50 border-indigo-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          Echo Team Taskboard &amp; Workload
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          ON-DUTY
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Pusat kolaborasi regu piket, pembagian beban kerja tim, dan eskalasi penanganan tiket gangguan NOC
                      </p>
                    </div>
                  </div>

                  {onNavigateEcho && (
                    <button
                      type="button"
                      onClick={onNavigateEcho}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer shrink-0"
                    >
                      <Kanban className="w-4 h-4" />
                      <span>Buka Full Kanban Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Metric Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#111927] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className={`text-[11px] block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Tiket / Task</span>
                    <span className={`text-2xl font-extrabold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>20</span>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#111927] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[11px] block font-medium text-amber-500">To Do</span>
                    <span className={`text-2xl font-extrabold font-mono ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>07</span>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#111927] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[11px] block font-medium text-blue-500">In Progress</span>
                    <span className={`text-2xl font-extrabold font-mono ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>04</span>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#111927] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[11px] block font-medium text-emerald-500">Completed (Done)</span>
                    <span className={`text-2xl font-extrabold font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>09</span>
                  </div>
                </div>

              </div>
            )}

            {/* DATA TERMINASI: real lookup through backend API */}
            
            {selectedToolId === "cek-ip-publik" && <CekIpPublik />}
            {selectedToolId === "whois-lookup" && ( <WhoisLookup />)}
            {selectedToolId === "mac-vendor-lookup" && (<MacVendorLookup />)}
            {selectedToolId === "tracempls-cisco" && (<TracemplsCisco />)} 
            {selectedToolId === "cek-bb-ip-jawa-bali" && (<CekBBIPJawaBali />)}
            {selectedToolId === "vvip-service-check" && (<VVIPServiceCheck />)}
            {selectedToolId === "cek-ea-pop" && <CekEaPopTool />}
            {selectedToolId === "cek-log-dhcp-bng" && ( <LogDhcpBngTool />)}
            {selectedToolId === 'cek-aradial-bng' && (<CekAradialBngTool />)}
            {selectedToolId === 'cek-config-cng' && ( <CekConfigCNGTool /> )}
            {selectedToolId === 'data-terminasi' && <DataTerminasiTool />}
            
            {false && (
              <div className="rounded-2xl bg-slate-50 p-4 sm:p-6 text-slate-900">
                <div className="rounded-2xl bg-white border border-slate-200 shadow-xl p-5 sm:p-7">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                    <h2 className="text-xl font-bold text-blue-600">🔎 Data Terminasi Service ID</h2>
                    <span className="text-xs text-slate-500">Network Configuration Lookup</span>
                  </div>

                  <form onSubmit={handleSearchTerminasi} className="flex flex-col sm:flex-row gap-3 mb-6">
                  <input
                    type="text"
                    value={terminasiQuery}
                    onChange={(e) => setTerminasiQuery(e.target.value)}
                    placeholder="Masukkan Service ID"
                    required
                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={terminasiLoading}
                    className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {terminasiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    Search
                  </button>
                </form>

                {terminasiError && (
                  <div className="rounded-lg border border-amber-300 bg-amber-50 text-amber-700 p-4 text-sm mb-4">
                    API Data Terminasi belum terhubung: {terminasiError}
                    <div className="text-xs mt-1 opacity-80">Set VITE_DATA_TERMINASI_API_URL ke alamat backend Flask.</div>
                  </div>
                )}

                {terminasiQuery && !terminasiLoading && !terminasiError && terminasiRows.length === 0 && (
                  <div className="rounded-lg border border-amber-300 bg-amber-50 text-amber-700 p-4 text-sm">⚠️ Service ID &quot;{terminasiQuery}&quot; tidak ditemukan.</div>
                )}

                {terminasiRows.length > 0 && (
                  <>
                    <h5 className="mb-3 text-base font-semibold">Hasil pencarian untuk: <span className="text-red-600">{terminasiQuery}</span></h5>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-800 text-white">
                          <tr><th className="px-4 py-3">Hostname</th><th className="px-4 py-3">IP Loopback</th><th className="px-4 py-3">Port</th></tr>
                      </thead>
                        <tbody>
                          {terminasiRows.map((row, index) => (
                            <tr key={`${row.hostname}-${row.port}-${index}`} className="border-t border-slate-200 hover:bg-slate-50 align-middle">
                              <td className="px-4 py-3 font-semibold">{row.hostname}</td>
                              <td className="px-4 py-3 font-mono">{row.ip_loopback}</td>
                              <td className="px-4 py-3">{row.port}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
                </div>
              </div>
            )}

            {/* 9. GENERIC DIAGNOSTIC RUNNER (FOR ANY OTHER TOOL IN THE 24 CATALOG) */}
            {!isCustomTool && (
              <div className="space-y-6">
                <form onSubmit={handleRunGenericTool} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={genericQuery}
                      onChange={(e) => setGenericQuery(e.target.value)}
                      placeholder={`Target IP, Hostname, atau filter parameter untuk ${currentTool.name}...`}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-mono transition-colors focus:outline-none focus:border-blue-500 ${
                        isDark 
                          ? 'bg-[#0c1220] border-slate-700 text-white placeholder-slate-500' 
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-2xs'
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={genericLoading}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 transition-all"
                  >
                    {genericLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    <span>Jalankan {currentTool.name}</span>
                  </button>
                </form>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className={`p-4 rounded-xl border transition-colors ${
                    isDark ? 'bg-[#111927] border-slate-800' : 'bg-slate-50/80 border-slate-200'
                  }`}>
                    <span className={`block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Kategori Modul:</span>
                    <span className="font-semibold text-blue-500">{currentTool.category}</span>
                  </div>
                  <div className={`p-4 rounded-xl border transition-colors ${
                    isDark ? 'bg-[#111927] border-slate-800' : 'bg-slate-50/80 border-slate-200'
                  }`}>
                    <span className={`block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Status Endpoint:</span>
                    <span className={`font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{currentTool.status}</span>
                  </div>
                  <div className={`p-4 rounded-xl border transition-colors ${
                    isDark ? 'bg-[#111927] border-slate-800' : 'bg-slate-50/80 border-slate-200'
                  }`}>
                    <span className={`block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Avg Latency API:</span>
                    <span className={`font-mono font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {currentTool.latencyMs || 15} ms
                    </span>
                  </div>
                  <div className={`p-4 rounded-xl border transition-colors ${
                    isDark ? 'bg-[#111927] border-slate-800' : 'bg-slate-50/80 border-slate-200'
                  }`}>
                    <span className={`block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Origin Route:</span>
                    <span className={`font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{currentTool.internalPath}</span>
                  </div>
                </div>

                {/* Console Logs */}
                <div className={`rounded-xl border p-4 font-mono text-xs shadow-inner ${
                  isDark ? 'bg-[#070b13] border-slate-800 text-slate-300' : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[11px]">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-blue-400" />
                      <span>Console Diagnostik &bull; {currentTool.name}</span>
                    </div>
                    <span>Daemon Active</span>
                  </div>
                  <div className="space-y-1">
                    {genericLogs.length === 0 ? (
                      <div className="text-slate-500 italic py-2">
                        Siap menjalankan fungsi diagnostic {currentTool.name}. Masukkan parameter di atas lalu tekan "Jalankan {currentTool.name}".
                      </div>
                    ) : (
                      genericLogs.map((log, idx) => (
                        <div key={idx} className="leading-relaxed">
                          <span className="text-blue-400 select-none">&gt; </span>
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
  );

  if (isEmbedded) {
    return toolContent;
  }

  return (
    <div className={`min-h-screen pb-16 transition-colors duration-200 ${
      isDark ? 'bg-[#0b101b] text-slate-100' : 'bg-slate-100/70 text-slate-900'
    }`}>
      {/* Top Banner explaining In-App Workbench */}
      <div className={`border-b px-4 lg:px-6 py-4 transition-colors ${
        isDark ? 'bg-[#101726] border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${
                isDark 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                Single-Origin Integration
              </span>
              <h1 className={`text-xl font-bold flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <Terminal className="w-5 h-5 text-blue-500" />
                Interactive NOC Tools Workbench
              </h1>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Fungsi-fungsi NOC dijalankan langsung di dalam sistem ini (
              <code className={isDark ? 'text-blue-400' : 'text-blue-600 font-semibold'}>
                /api/tools/*
              </code>
              ), tanpa berpindah alamat IP atau port eksternal.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className={`px-3 py-1.5 rounded-lg border font-mono flex items-center gap-2 ${
              isDark 
                ? 'bg-slate-900 border-slate-700/60 text-slate-300' 
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>URI: {window.location.host}{currentTool.internalPath}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-6">
        {!hideSelectorStrip && (
          <div className="mb-6">
            <label className={`text-xs font-semibold uppercase tracking-wider block mb-2 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Pilih Alat Diagnostik Internal:
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {PRIMARY_TOOLS.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedToolId === item.id;
                return (
                  <button
                    key={item.id}
                    id={`select-workbench-tool-${item.id}`}
                    onClick={() => handleSelectTool(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-400'
                        : isDark
                          ? 'bg-[#131c2d] text-slate-300 hover:bg-[#19253d] border border-slate-800'
                          : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 shadow-2xs'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {!isCustomTool && currentTool && (
                <button
                  id={`select-workbench-tool-${currentTool.id}`}
                  onClick={() => handleSelectTool(currentTool.id)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-400"
                >
                  <Activity className="w-4 h-4" />
                  <span>{currentTool.name}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {toolContent}
      </div>
    </div>
  );
};
