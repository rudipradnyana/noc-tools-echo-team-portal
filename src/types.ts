export type ToolCategory = 'ALL' | 'BNG' | 'DHCP' | 'LOOKUP' | 'CHECK' | 'REPORT' | 'ROUTING' | 'CONFIG';

export interface NocTool {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  subtext?: string;
  iconName: string;
  status: 'ONLINE' | 'STANDBY' | 'MAINTENANCE';
  latencyMs: number;
  internalPath: string; // Internal route e.g. /tools/cek-ea-pop (NO external port redirect!)
  tags: string[];
  isFavorite?: boolean;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskType = 'Harian' | 'Terencana';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface EchoTask {
  id: string;
  title: string;
  status: TaskStatus;
  type: TaskType;
  priority: TaskPriority;
  assignee: {
    name: string;
    username: string;
    avatarBg: string;
    initial: string;
  };
  subtasksCompleted?: number;
  subtasksTotal?: number;
  createdAt: string;
  dueDate?: string;
  category?: string;
  notes?: string;
}

export interface EAPopRecord {
  eaNumber: string;
  customer: string;
  serviceType: string;
  popLocation: string;
  routerName: string;
  interfacePort: string;
  vlan: number;
  bandwidth: string;
  status: 'UP' | 'DOWN' | 'DEGRADED';
  opticalPower: string;
  lastFlap: string;
}

export interface PublicIPRecord {
  ip: string;
  subnet: string;
  popLocation: string;
  asn: string;
  asnName: string;
  bngGateway: string;
  status: 'Allocated' | 'Pool Available' | 'Reserved';
  usageType: 'Corporate DIA' | 'Broadband Retail' | 'CDN Cache' | 'Infrastructure';
}

export interface AradialLogRecord {
  id: string;
  timestamp: string;
  username: string;
  mac: string;
  nasIp: string;
  ipAssigned: string;
  action: 'ACCESS-ACCEPT' | 'ACCESS-REJECT' | 'STOP-ACCOUNTING' | 'SESSION-DISCONNECT';
  sessionTime: string;
  uploadBytes: string;
  downloadBytes: string;
  rejectReason?: string;
}

export interface DHCPLogRecord {
  timestamp: string;
  mac: string;
  circuitId: string;
  offeredIp: string;
  bngDevice: string;
  state: 'ACKNOWLEDGED' | 'OFFERED' | 'DISCOVERED' | 'EXPIRED';
  leaseRemaining: string;
}

export interface BackboneLink {
  id: string;
  segmentName: string;
  origin: string;
  destination: string;
  interfaceName: string;
  capacityGbps: number;
  currentTrafficGbps: number;
  utilizationPercent: number;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  latencyMs: number;
  packetLossPercent: number;
}

export interface VvipClient {
  id: string;
  clientName: string;
  serviceId: string;
  primaryPath: string;
  backupPath: string;
  slaUptime: number;
  status: 'OPERATIONAL' | 'DEGRADED' | 'DOWN';
  currentLatency: number;
  jitter: number;
}

export interface AlarmItem {
  id: string;
  eaCode: string;
  customerName: string;
  pop: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  alarmMessage: string;
  raisedAt: string;
  acknowledged: boolean;
  assignedEngineer: string;
}

export interface ShiftLogEntry {
  id: string;
  timestamp: string;
  shift: 'Pagi (08:00 - 16:00)' | 'Sore (16:00 - 00:00)' | 'Malam (00:00 - 08:00)';
  officer: string;
  title: string;
  details: string;
  status: 'RESOLVED' | 'HANDOVER' | 'MONITORING';
  impact: 'High' | 'Medium' | 'Low';
}

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  initial: string;
  avatarBg?: string;
  shift?: string;
  gatewayIp?: string;
  loggedInAt?: string;
}

