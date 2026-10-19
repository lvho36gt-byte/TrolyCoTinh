import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  FileSpreadsheet,
  Gamepad2,
  Award,
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Send,
  Loader2,
  ChevronRight,
  Star,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { TeacherProfile, LessonPlan, LearningMaterial, InteractiveGame, Student, ActivityLog } from '../../types';

interface DashboardProps {
  profile: TeacherProfile;
  plans: LessonPlan[];
  materials: LearningMaterial[];
  games: InteractiveGame[];
  students: Student[];
  logs: ActivityLog[];
  onNavigateTab: (tabId: string) => void;
  onOpenQuickAiWithPrompt: (prompt: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  plans,
  materials,
  games,
  students,
  logs,
  onNavigateTab,
  onOpenQuickAiWithPrompt
}) => {
  const [quickInput, setQuickInput] = useState('');

  const stats = [
    { label: 'Kế hoạch bài dạy', count: plans.length, sub: 'Chuẩn GDPT 2018', icon: BookOpen, color: 'from-blue-600 to-indigo-600', tab: 'lesson' },
    { label: 'Học liệu & Đề thi', count: materials.length, sub: 'Phiếu phân hóa A4', icon: FileSpreadsheet, color: 'from-cyan-500 to-blue-600', tab: 'material' },
    { label: 'Trò chơi tương tác', count: games.length, sub: '5 thể loại sinh động', icon: Gamepad2, color: 'from-purple-600 to-pink-600', tab: 'game' },
    { label: 'Học sinh Lớp 4C', count: students.length, sub: '100% chuyên cần', icon: Users, color: 'from-emerald-500 to-teal-600', tab: 'classroom' },
    { label: 'Hoàn thành tốt (T)', count: `${Math.round((students.filter(s => s.mathLevel === 'T').length / (students.length || 1)) * 100)}%`, sub: 'Theo Thông tư 27', icon: Award, color: 'from-amber-500 to-orange-500', tab: 'evaluation' },
  ];

  const quickActionChips = [
    { label: 'Giáo án GDPT 2018', prompt: 'Soạn giáo án môn Toán 4 bài Phép nhân với số có một chữ số', tab: 'lesson' },
    { label: 'Phiếu học tập phân hóa', prompt: 'Tạo phiếu học tập môn Tiếng Việt 4 bài Luyện từ và câu Danh từ', tab: 'material' },
    { label: 'Trò chơi Ai Là Triệu Phú', prompt: 'Tạo trò chơi Ai Là Triệu Phú môn Khoa học 4 Nước và các thể của nước', tab: 'game' },
    { label: 'Nhận xét học sinh TT27', prompt: 'Gợi ý nhận xét học sinh cuối học kì theo Thông tư 27', tab: 'evaluation' },
    { label: 'Đề kiểm tra 15 phút', prompt: 'Tạo đề kiểm tra 15 phút môn Toán 4 có đáp án và ma trận', tab: 'material' },
    { label: 'Hỏi Gia sư AI Bé Ong', prompt: 'Gợi ý phương pháp dạy phân số dễ hiểu cho học sinh lớp 4', tab: 'chat' }
  ];

  const upcomingSchedule = [
    { period: 'Tiết 1', subject: 'Toán', topic: 'Phép nhân với số có một chữ số (Tiết 1)', time: '07:30 - 08:05', status: 'ready' },
    { period: 'Tiết 2', subject: 'Tiếng Việt', topic: 'Luyện từ và câu: Danh từ', time: '08:15 - 08:50', status: 'ready' },
    { period: 'Tiết 3', subject: 'Khoa học', topic: 'Nước và các thể của nước (Trò chơi ôn tập)', time: '09:10 - 09:45', status: 'game_ready' },
    { period: 'Tiết 4', subject: 'Lịch sử & Địa lí', topic: 'Đồng bằng Bắc Bộ', time: '09:55 - 10:30', status: 'ready' }
  ];

  const handleSubmitQuick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onOpenQuickAiWithPrompt(quickInput);
    setQuickInput('');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner with AI Robot Identity */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white p-6 md:p-8 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-cyan-200 text-xs font-semibold border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin-slow" />
              <span>Giải thưởng Tiên phong Ứng dụng AI trong Giáo dục Việt Nam 2026</span>
            </div>

            <h2 className="text-xl md:text-3xl font-black tracking-tight leading-snug">
              Xin chào cô giáo {profile.name}!
            </h2>
            <p className="text-sm md:text-base text-blue-100 font-medium">
              Tôi là Trợ lý AI, sẵn sàng hỗ trợ dạy học lớp 4 của cô!
            </p>
            <p className="text-xs text-cyan-200/90 italic flex items-center gap-1.5 pt-1">
              <HeartHandshake className="w-3.5 h-3.5" />
              "Đồng hành cùng giáo viên – Kiến tạo lớp học hạnh phúc" • Lớp {profile.className} - {profile.school}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('lesson')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white text-blue-800 font-bold text-xs shadow-lg hover:bg-blue-50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-blue-700" />
              <span>Soạn Giáo Án Mới</span>
            </button>
            <button
              onClick={() => onNavigateTab('game')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg hover:bg-cyan-300 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Mở Trò Chơi Lớp Học</span>
            </button>
          </div>
        </div>

        {/* Natural Input Box (Command Center at Dashboard) */}
        <div className="mt-6 pt-5 border-t border-white/15">
          <form onSubmit={handleSubmitQuick} className="relative flex items-center">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="Nhập yêu cầu của cô giáo... Ví dụ: Soạn giáo án Tiếng Việt 4 bài Danh từ, tạo phiếu bài tập Toán, trò chơi ôn tập..."
              className="w-full bg-white/10 backdrop-blur-md text-white placeholder-blue-200/70 text-xs md:text-sm pl-4 pr-32 py-3.5 rounded-xl border border-white/20 focus:outline-hidden focus:bg-white/20 focus:border-cyan-300 transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tạo nhanh</span>
            </button>
          </form>

          {/* Quick prompt chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-[11px] text-blue-200 font-medium">Gợi ý nhanh:</span>
            {quickActionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => onOpenQuickAiWithPrompt(chip.prompt)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-blue-100 hover:text-white border border-white/15 transition-all hover:scale-[1.02]"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onNavigateTab(item.tab)}
              className="bg-white p-4 rounded-xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all text-left group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
                  {item.label}
                </span>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-xs`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{item.count}</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">{item.sub}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Schedule & Core Modules Quick Launch */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lịch dạy tuần 12 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Lịch Dạy Hôm Nay - Tuần 12 (Lớp 4C)</h3>
                  <p className="text-[11px] text-slate-500">Kế hoạch bài dạy và học liệu tương tác đã sẵn sàng</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('lesson')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Xem tất cả</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingSchedule.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold shrink-0">
                      {item.period}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-700">{item.subject}</span>
                        <span className="text-xs text-slate-800 font-medium">• {item.topic}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status === 'game_ready' ? (
                      <button
                        onClick={() => onNavigateTab('game')}
                        className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs font-bold flex items-center gap-1"
                      >
                        <Gamepad2 className="w-3.5 h-3.5" />
                        <span>Chơi trò chơi</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onNavigateTab('lesson')}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Mở giáo án</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hệ thống phân hệ chính */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => onNavigateTab('material')}
              className="p-5 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-blue-200/80 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                Xưởng Tạo Học Liệu AI
              </h4>
              <p className="text-xs text-slate-600 mt-1 mb-3">
                Thiết kế phiếu học tập, đề kiểm tra định kì, câu hỏi phân hóa 4 mức độ tư duy đúng lứa tuổi lớp 4.
              </p>
              <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                <span>Tạo phiếu A4 ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div
              onClick={() => onNavigateTab('evaluation')}
              className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-700 transition-colors">
                Nhận Xét Học Sinh Theo TT 27
              </h4>
              <p className="text-xs text-slate-600 mt-1 mb-3">
                Gợi ý nhận xét sư phạm chuẩn mực, động viên học sinh, không áp đặt, xuất bảng tổng hợp dễ dàng.
              </p>
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                <span>Nhận xét sổ theo dõi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Recent Activities & Class 4C Quick Insights */}
        <div className="space-y-6">
          {/* Lớp 4C Snapshot */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-800">Điểm Nổi Bật Lớp 4C</h3>
              <button
                onClick={() => onNavigateTab('classroom')}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Chi tiết
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-medium text-slate-700">Chuyên cần hôm nay</span>
                </div>
                <span className="text-xs font-bold text-emerald-600">35/35 HS (100%)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span className="text-xs font-medium text-slate-700">Tự luyện trực tuyến</span>
                </div>
                <span className="text-xs font-bold text-blue-600">Đạt 8.8/10 TB</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-xs font-medium text-slate-700">Sao chăm chỉ tuần này</span>
                </div>
                <span className="text-xs font-bold text-amber-600">12 học sinh</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="font-bold text-sm text-slate-800 mb-3">Hoạt Động Gần Đây</h3>
            <div className="space-y-3">
              {logs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 line-clamp-1">{log.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{log.description}</p>
                    <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
