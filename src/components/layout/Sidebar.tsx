import React from 'react';
import {
  LayoutDashboard,
  FileText,
  FileSpreadsheet,
  Gamepad2,
  Award,
  Users,
  MessageSquare,
  FolderOpen,
  FileCheck2,
  Settings,
  Sparkles,
  School,
  Database
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  role: UserRole;
  onOpenQuickAi: () => void;
  onResetData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  role,
  onOpenQuickAi,
  onResetData
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard, badge: '' },
    { id: 'lesson', label: 'Trợ lý soạn giảng AI', icon: FileText, badge: 'GDPT 2018' },
    { id: 'material', label: 'Xưởng tạo học liệu AI', icon: FileSpreadsheet, badge: 'Đề/Phiếu' },
    { id: 'game', label: 'Trò chơi học tập', icon: Gamepad2, badge: '5 Dạng' },
    { id: 'evaluation', label: 'Nhận xét học sinh', icon: Award, badge: 'TT 27' },
    { id: 'classroom', label: 'Lớp học số 4C', icon: Users, badge: '35 HS' },
    { id: 'chat', label: 'Chatbot học tập', icon: MessageSquare, badge: 'Song hành' },
    { id: 'library', label: 'Thư viện thông minh', icon: FolderOpen, badge: '' },
    { id: 'dossier', label: 'Hồ sơ dự thi 2026', icon: FileCheck2, badge: 'Vinh danh' },
    { id: 'settings', label: 'Hồ sơ & Cài đặt', icon: Settings, badge: '' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800 select-none no-print transition-all duration-300">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-2 ring-blue-400/30">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-white">TRỢ LÝ AI</span>
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm">
                LỚP 4
              </span>
            </div>
            <p className="text-[11px] text-blue-200/70 font-medium">Tiểu học Khoái Châu 1</p>
          </div>
        </div>

        {/* Competition Badge */}
        <div className="mt-3 bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-transparent border border-amber-500/30 rounded-lg p-2 text-[11px] text-amber-200 flex items-center gap-2">
          <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate font-medium">Giải Tiên phong AI GD 2026</span>
        </div>
      </div>

      {/* Quick AI Command trigger */}
      <div className="px-3 py-3">
        <button
          onClick={onOpenQuickAi}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] border border-blue-400/30"
        >
          <Sparkles className="w-4 h-4 text-cyan-300 animate-spin-slow" />
          <span>Lệnh AI Siêu Tốc</span>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2.5 py-1 space-y-1 overflow-y-auto scrollbar-thin">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/50">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Dữ liệu demo lưu máy
          </span>
          <button
            onClick={onResetData}
            title="Khôi phục dữ liệu mẫu gốc"
            className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 underline"
          >
            <Database className="w-3 h-3" />
            Mẫu gốc
          </button>
        </div>
        <p className="text-[10px] text-slate-500 leading-tight">
          GV: Phạm Thị Tính • Lớp 4C
        </p>
      </div>
    </aside>
  );
};
