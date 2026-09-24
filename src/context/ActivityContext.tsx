import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  LucideIcon, 
  Search, 
  Server, 
  Check, 
  Settings as SettingsIcon, 
  BarChart3, 
  Terminal, 
  Cpu, 
  Globe, 
  Sliders,
  FileCode2,
  Network,
  Radio,
  Activity as ActivityIcon,
  ShieldCheck,
  Zap
} from 'lucide-react';

export interface UserActivity {
  id: string;
  time: string;
  timestamp: number;
  iconName: string;
  iconBg: string;
  title: string;
  actor: string;
  badge: 'Tool Access' | 'Task Update' | 'Report' | 'Diagnostic';
  badgeClass?: string;
  actionToolId?: string;
  targetNav?: string;
}

interface ActivityContextType {
  activities: UserActivity[];
  logActivity: (activity: Omit<UserActivity, 'id' | 'time' | 'timestamp'>) => void;
  logToolAccess: (tool: { id: string; name: string; category?: string; iconName?: string }) => void;
  clearActivities: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

const INITIAL_ACTIVITIES: UserActivity[] = [
  {
    id: 'act-init-1',
    time: '14:32',
    timestamp: Date.now() - 1000 * 60 * 12,
    iconName: 'Search',
    iconBg: 'bg-[#0284c7]',
    title: 'Checked EA / POP information',
    actor: 'Rudi',
    badge: 'Tool Access',
    actionToolId: 'cek-ea-pop',
  },
  {
    id: 'act-init-2',
    time: '14:20',
    timestamp: Date.now() - 1000 * 60 * 24,
    iconName: 'Server',
    iconBg: 'bg-[#dc2626]',
    title: 'DHCP BNG log reviewed',
    actor: 'Rudi Pradnyana',
    badge: 'Tool Access',
    actionToolId: 'cek-log-dhcp-bng',
  },
  {
    id: 'act-init-3',
    time: '13:56',
    timestamp: Date.now() - 1000 * 60 * 48,
    iconName: 'Check',
    iconBg: 'bg-[#059669]',
    title: 'Task moved to Done',
    actor: 'Ahmad Farisy',
    badge: 'Task Update',
    targetNav: 'echo',
  },
  {
    id: 'act-init-4',
    time: '13:41',
    timestamp: Date.now() - 1000 * 60 * 63,
    iconName: 'Settings',
    iconBg: 'bg-[#7c3aed]',
    title: 'Config CNG checked',
    actor: 'Dallas Permadi',
    badge: 'Tool Access',
    actionToolId: 'cek-config-cng',
  },
  {
    id: 'act-init-5',
    time: '13:20',
    timestamp: Date.now() - 1000 * 60 * 84,
    iconName: 'BarChart3',
    iconBg: 'bg-[#d97706]',
    title: 'Backbone report generated',
    actor: 'Moch. Fahrizal',
    badge: 'Report',
    actionToolId: 'report-pe-cisco',
  },
];

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<UserActivity[]>(() => {
    try {
      const stored = localStorage.getItem('noc_real_recent_activities');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_ACTIVITIES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('noc_real_recent_activities', JSON.stringify(activities));
    } catch {
      // ignore
    }
  }, [activities]);

  const logActivity = (newAct: Omit<UserActivity, 'id' | 'time' | 'timestamp'>) => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;

    const created: UserActivity = {
      ...newAct,
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      time,
      timestamp: Date.now(),
    };

    setActivities((prev) => [created, ...prev.slice(0, 29)]); // Keep latest 30 real activities
  };

  const logToolAccess = (tool: { id: string; name: string; category?: string; iconName?: string }) => {
    // Determine icon and color based on tool category or id
    let iconName = 'Terminal';
    let iconBg = 'bg-blue-600';

    const cat = (tool.category || '').toUpperCase();
    const id = tool.id.toLowerCase();

    if (cat === 'LOOKUP' || id.includes('ea') || id.includes('whois') || id.includes('ip-publik')) {
      iconName = id.includes('whois') || id.includes('ip') ? 'Globe' : 'Search';
      iconBg = 'bg-[#0284c7]';
    } else if (cat === 'BNG' || id.includes('bng') || id.includes('aradial') || id.includes('session')) {
      iconName = 'Server';
      iconBg = 'bg-[#dc2626]';
    } else if (cat === 'DHCP' || id.includes('dhcp')) {
      iconName = 'FileCode2';
      iconBg = 'bg-[#e11d48]';
    } else if (cat === 'CHECK' || id.includes('cisco') || id.includes('trace') || id.includes('route')) {
      iconName = 'Terminal';
      iconBg = 'bg-[#059669]';
    } else if (cat === 'REPORT' || id.includes('report') || id.includes('bb-ip') || id.includes('backbone')) {
      iconName = 'BarChart3';
      iconBg = 'bg-[#d97706]';
    } else if (id.includes('mac') || id.includes('vendor')) {
      iconName = 'Cpu';
      iconBg = 'bg-[#7c3aed]';
    } else if (id.includes('config') || id.includes('cost') || id.includes('ncs')) {
      iconName = 'Sliders';
      iconBg = 'bg-[#8b5cf6]';
    }

    setActivities((prev) => {
      // Prevent duplicate logging if user clicked the same tool within 3 seconds
      const latest = prev[0];
      if (latest && latest.actionToolId === tool.id && Date.now() - latest.timestamp < 3000) {
        return prev;
      }

      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const time = `${hours}:${minutes}`;

      const newAct: UserActivity = {
        id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        time,
        timestamp: Date.now(),
        iconName,
        iconBg,
        title: `Accessed ${tool.name}`,
        actor: 'Rudi',
        badge: cat === 'REPORT' ? 'Report' : 'Tool Access',
        actionToolId: tool.id,
      };

      return [newAct, ...prev.slice(0, 29)];
    });
  };

  const clearActivities = () => {
    setActivities([]);
    try {
      localStorage.removeItem('noc_real_recent_activities');
    } catch {
      // ignore
    }
  };

  return (
    <ActivityContext.Provider value={{ activities, logActivity, logToolAccess, clearActivities }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = (): ActivityContextType => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};

// Helper mapping for iconName to actual Lucide component
export const getActivityIcon = (iconName: string): LucideIcon => {
  switch (iconName) {
    case 'Search': return Search;
    case 'Server': return Server;
    case 'Check': return Check;
    case 'Settings': return SettingsIcon;
    case 'BarChart3': return BarChart3;
    case 'Terminal': return Terminal;
    case 'Cpu': return Cpu;
    case 'Globe': return Globe;
    case 'Sliders': return Sliders;
    case 'FileCode2': return FileCode2;
    case 'Network': return Network;
    case 'Radio': return Radio;
    case 'Activity': return ActivityIcon;
    case 'ShieldCheck': return ShieldCheck;
    case 'Zap': return Zap;
    default: return Terminal;
  }
};
