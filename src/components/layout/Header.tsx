import React, { useState } from 'react';
import {
  Bell,
  Sparkles,
  User,
  Monitor,
  Calendar,
  Search,
  CheckCircle2,
  ChevronDown,
  Info,
  ShieldCheck,
  Award
} from 'lucide-react';
import { TeacherProfile, UserRole, ActivityLog } from '../../types';

interface HeaderProps {
  profile: TeacherProfile;
  role: UserRole;
  setRole: (role: UserRole) => void;
  logs: ActivityLog[];
  onOpenQuickAi: () => void;
  onOpenProfile: () => void;
  isProjectorMode: boolean;
  toggleProjectorMode: () => void;
  currentTabName: string;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  role,
  setRole,
  logs,
  onOpenQuickAi,
  onOpenProfile,
  isProjectorMode,
  toggleProjectorMode,
  currentTabName
}) => {
  const [showLogs, setShowLogs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const roleLabels: Record<UserRole, { label: string; badge: string; color: string }> = {
    teacher: { label: 'Cô giáo Phạm Thị Tính', badge: 'Giáo viên 4C', color: 'bg-blue-600 text-white' },
    student: { label: 'Học sinh Lớp 4C', badge: 'Học viên', color: 'bg-emerald-600 text-white' },
    judge: { label: 'Ban Giám Khảo', badge: 'Hội đồng 2026', color: 'bg-amber-600 text-white' }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between shadow-xs sticky top-0 z-30 no-print">
      {/* Left: Tab Title & Class Info */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>{currentTabName}</span>
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-blue-600">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              {profile.school}
            </span>
            <span>•</span>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-[11px]">
              Lớp {profile.className}
            </span>
            <span>•</span>
            <span className="text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {profile.academicYear}
            </span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Projector Mode Toggle */}
        <button
          onClick={toggleProjectorMode}
          title="Bật/Tắt Chế độ Máy chiếu (Độ tương phản cao cho lớp học)"
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
            isProjectorMode
              ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Máy chiếu</span>
        </button>

        {/* AI Quick Command Button */}
        <button
          onClick={onOpenQuickAi}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
          <span className="hidden sm:inline">Hỏi AI</span>
        </button>

        {/* Activity Logs Notification */}
        <div className="relative">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 relative transition-all"
            title="Lịch sử hoạt động gần đây"
          >
            <Bell className="w-4 h-4" />
            {logs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {Math.min(logs.length, 9)}
              </span>
            )}
          </button>

          {showLogs && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Hoạt động gần đây</span>
                <span className="text-[11px] text-blue-600 font-medium">{logs.length} sự kiện</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {logs.slice(0, 8).map((log) => (
                  <div key={log.id} className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-semibold text-slate-800 line-clamp-1">{log.title}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{log.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{log.description}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                <p className="text-[10px] text-slate-500">Hệ thống tự động ghi nhật ký bài giảng và đánh giá</p>
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs font-medium transition-all"
          >
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${roleLabels[role].color}`}>
              {roleLabels[role].badge}
            </span>
            <span className="hidden md:inline font-semibold">{roleLabels[role].label}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chuyển vai trò trải nghiệm</p>
                <p className="text-[11px] text-slate-500">Giúp BGK & Giáo viên kiểm thử toàn diện luồng</p>
              </div>

              <div className="p-1 space-y-1">
                <button
                  onClick={() => { setRole('teacher'); setShowRoleMenu(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
                    role === 'teacher' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <p className="font-semibold">Cô giáo Phạm Thị Tính</p>
                    <p className="text-[10px] text-slate-500">Soạn giảng, tạo học liệu, chấm điểm & quản lý</p>
                  </div>
                  {role === 'teacher' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </button>

                <button
                  onClick={() => { setRole('student'); setShowRoleMenu(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
                    role === 'student' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <p className="font-semibold">Học sinh Lớp 4C (Minh Quân)</p>
                    <p className="text-[10px] text-slate-500">Làm bài tập online, chơi game & xem điểm</p>
                  </div>
                  {role === 'student' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>

                <button
                  onClick={() => { setRole('judge'); setShowRoleMenu(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
                    role === 'judge' ? 'bg-amber-50 text-amber-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <p className="font-semibold">Ban Giám Khảo Cuộc Thi 2026</p>
                    <p className="text-[10px] text-slate-500">Xem hồ sơ sáng kiến, số liệu minh chứng thật</p>
                  </div>
                  {role === 'judge' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <button
          onClick={onOpenProfile}
          className="w-8 h-8 rounded-full ring-2 ring-blue-500/30 overflow-hidden bg-slate-200 shrink-0 hover:ring-blue-600 transition-all"
          title="Hồ sơ giáo viên"
        >
          <img
            src={profile.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};
