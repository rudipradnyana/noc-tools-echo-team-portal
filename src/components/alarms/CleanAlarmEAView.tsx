import React, { useState } from 'react';
import {
  List,
  Clock,
  BarChart2,
  Users,
  Activity
} from 'lucide-react';
import { AlarmListView } from './AlarmListView';
import { LogAktivitasView } from './LogAktivitasView';
import { ProgressChartView } from './ProgressChartView';
import { FollowUpPusatView } from './FollowUpPusatView';

export type CleanAlarmSubTab = 'alarm_list' | 'log_aktivitas' | 'progress_chart' | 'followup_pusat';

interface CleanAlarmEAViewProps {
  initialTab?: CleanAlarmSubTab;
  currentTab?: CleanAlarmSubTab;
  onTabChange?: (tab: CleanAlarmSubTab) => void;
  showTabHeader?: boolean;
}

export const CleanAlarmEAView: React.FC<CleanAlarmEAViewProps> = ({
  initialTab = 'alarm_list',
  currentTab,
  onTabChange,
  showTabHeader = false,
}) => {
  const [internalTab, setInternalTab] = useState<CleanAlarmSubTab>(initialTab);

  const activeTab = currentTab !== undefined ? currentTab : internalTab;

  const handleSelectTab = (tab: CleanAlarmSubTab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  return (
    <div className="flex-1 bg-[#f8fafc] text-slate-800 min-h-screen">
      {/* Optional In-Page Tab Navigation (if rendered standalone) */}
      {showTabHeader && (
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => handleSelectTab('alarm_list')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'alarm_list'
                ? 'bg-blue-50 text-blue-600 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Alarm List</span>
          </button>

          <button
            onClick={() => handleSelectTab('log_aktivitas')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'log_aktivitas'
                ? 'bg-blue-50 text-blue-600 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Log Aktivitas</span>
          </button>

          <button
            onClick={() => handleSelectTab('progress_chart')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'progress_chart'
                ? 'bg-blue-50 text-blue-600 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Progress Chart</span>
          </button>

          <button
            onClick={() => handleSelectTab('followup_pusat')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'followup_pusat'
                ? 'bg-blue-50 text-blue-600 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>FollowUp Pusat</span>
          </button>
        </div>
      )}

      {/* Render selected sub-view */}
      <div>
        {activeTab === 'alarm_list' && <AlarmListView />}
        {activeTab === 'log_aktivitas' && <LogAktivitasView />}
        {activeTab === 'progress_chart' && <ProgressChartView />}
        {activeTab === 'followup_pusat' && <FollowUpPusatView />}
      </div>
    </div>
  );
};
