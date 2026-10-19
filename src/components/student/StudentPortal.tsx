import React from 'react';
import {
  Sparkles,
  Trophy,
  Gamepad2,
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  Award,
  Star,
  MessageSquare
} from 'lucide-react';
import { Student, Assignment, InteractiveGame, StudentFeedback } from '../../types';

interface StudentPortalProps {
  student: Student;
  assignments: Assignment[];
  games: InteractiveGame[];
  feedbacks: StudentFeedback[];
  onTakeQuiz: (assignment: Assignment) => void;
  onPlayGame: (game: InteractiveGame) => void;
  onChatWithBee: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  student,
  assignments,
  games,
  feedbacks,
  onTakeQuiz,
  onPlayGame,
  onChatWithBee
}) => {
  const studentFeedback = feedbacks.find(f => f.studentId === student.id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Student Welcome Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
              <span>🌟 Học Sinh Lớp 4C • Trường TH Khoái Châu 1</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              Chào bạn nhỏ {student.name}!
            </h2>
            <p className="text-sm text-emerald-100 font-medium">
              Hôm nay chúng mình cùng học thật vui và tích lũy thật nhiều ngôi sao nhé!
            </p>

            {/* Badges Earned */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-bold text-white/90">Huy hiệu của bạn:</span>
              {student.badges.map((b, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs shadow-xs flex items-center gap-1"
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{b}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0 min-w-44">
            <Trophy className="w-8 h-8 text-amber-300 mx-auto mb-1 animate-bounce" />
            <span className="text-xs font-bold text-emerald-100 block">Điểm thưởng tích lũy</span>
            <span className="text-3xl font-black text-white">{student.totalPoints}đ</span>
            <span className="text-[10px] text-emerald-200 block mt-0.5">Xếp hạng: Xuất sắc</span>
          </div>
        </div>
      </div>

      {/* Teacher's Praise & Feedback for this student */}
      {studentFeedback && (
        <div className="bg-amber-50 rounded-2xl border-2 border-amber-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-800">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="font-black text-sm uppercase tracking-wide">
              Lời Khen Từ Cô Giáo Phạm Thị Tính
            </h3>
          </div>
          <p className="text-xs md:text-sm text-slate-800 italic leading-relaxed pl-7">
            "{studentFeedback.detailedComment}"
          </p>
        </div>
      )}

      {/* Grid: My Assignments & Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bài Tự Luyện Online */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-800">Bài Tự Luyện Được Cô Giao</h3>
            </div>
            <span className="text-xs text-blue-600 font-bold">{assignments.length} bài</span>
          </div>

          <div className="space-y-3">
            {assignments.map((assign) => (
              <div
                key={assign.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 flex items-center justify-between transition-all"
              >
                <div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    {assign.subject}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 mt-1">{assign.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {assign.questions.length} câu • Hạn: {assign.dueDate}
                  </p>
                </div>

                <button
                  onClick={() => onTakeQuiz(assign)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Làm bài</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Trò Chơi Học Tập Vui Nhộn */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-sm text-slate-800">Đấu Trường Trò Chơi Lớp 4C</h3>
            </div>
            <span className="text-xs text-purple-600 font-bold">{games.length} trò chơi</span>
          </div>

          <div className="space-y-3">
            {games.slice(0, 4).map((game) => (
              <div
                key={game.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-purple-400 bg-purple-50/40 flex items-center justify-between transition-all"
              >
                <div>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    {game.gameType.toUpperCase()}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 mt-1 line-clamp-1">{game.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Môn {game.subject} • Điểm cao nhất: {game.highestScore}đ
                  </p>
                </div>

                <button
                  onClick={() => onPlayGame(game)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Chơi ngay</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Socratic AI Tutor Quick Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
            🐝
          </div>
          <div>
            <h3 className="font-black text-sm">Cần gợi ý bài học? Trò chuyện cùng Bé Ong Chăm Chỉ!</h3>
            <p className="text-xs text-amber-100">Gia sư AI Lớp 4 sẽ hướng dẫn bạn tự suy nghĩ giải bài tập từng bước một!</p>
          </div>
        </div>

        <button
          onClick={onChatWithBee}
          className="px-5 py-2.5 bg-white text-slate-900 font-black text-xs rounded-xl shadow-md hover:bg-amber-50 transition-all shrink-0"
        >
          Hỏi Bé Ong ngay
        </button>
      </div>
    </div>
  );
};
