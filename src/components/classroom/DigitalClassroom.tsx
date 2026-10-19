import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Trophy,
  Search,
  BookOpen,
  Calendar,
  Sparkles,
  Send,
  HelpCircle,
  Check,
  Award,
  Play,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, Assignment, AssignmentSubmission, UserRole } from '../../types';

interface DigitalClassroomProps {
  students: Student[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  role: UserRole;
  onUpdateAttendance: (studentId: string, status: 'present' | 'absent' | 'late') => void;
  onSaveAssignment: (assignment: Assignment) => void;
  onSubmitAssignment: (submission: AssignmentSubmission) => void;
}

export const DigitalClassroom: React.FC<DigitalClassroomProps> = ({
  students,
  assignments,
  submissions,
  role,
  onUpdateAttendance,
  onSaveAssignment,
  onSubmitAssignment
}) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'attendance' | 'assignments' | 'student_take'>('roster');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTeam, setFilterTeam] = useState('all');

  // Student quiz taker state
  const [activeQuiz, setActiveQuiz] = useState<Assignment>(assignments[0] || null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTimeSpent, setQuizTimeSpent] = useState(0);

  // New assignment modal
  const [showNewAssignmentModal, setShowNewAssignmentModal] = useState(false);
  const [newAssignTitle, setNewAssignTitle] = useState('Bài tự luyện tuần 12: Phép nhân và Phân số');
  const [newAssignSubject, setNewAssignSubject] = useState('Toán');

  const filteredStudents = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTeam = filterTeam === 'all' || s.team === filterTeam;
    return matchSearch && matchTeam;
  });

  const presentCount = students.filter(s => s.attendanceStatus === 'present').length;
  const absentCount = students.filter(s => s.attendanceStatus === 'absent').length;
  const lateCount = students.filter(s => s.attendanceStatus === 'late').length;

  const handleStartQuiz = (assign: Assignment) => {
    setActiveQuiz(assign);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizTimeSpent(0);
    setActiveTab('student_take');
  };

  const handleSelectQuizAnswer = (qId: number, optionIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;
    let correct = 0;
    activeQuiz.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const finalScore = Math.round((correct / activeQuiz.questions.length) * 10);
    setQuizScore(finalScore);
    setQuizSubmitted(true);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const newSub: AssignmentSubmission = {
      id: 'sub-' + Date.now(),
      assignmentId: activeQuiz.id,
      studentId: 'hs-01',
      studentName: 'Nguyễn Minh Quân (Học sinh mẫu)',
      score: finalScore,
      totalScore: 10,
      answers: quizAnswers,
      submittedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
      timeSpentSeconds: 180
    };

    onSubmitAssignment(newSub);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3 no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Không Gian Lớp Học Số 4C</h3>
            <p className="text-[11px] text-slate-500">
              Trường TH Khoái Châu 1 • GVCN: Phạm Thị Tính • Sĩ số: {students.length} học sinh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'roster' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Danh sách lớp ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'attendance' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Điểm danh điện tử
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'assignments' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Nhiệm vụ & Bài tự luyện ({assignments.length})
          </button>
        </div>
      </div>

      {/* TAB 1: ROSTER */}
      {activeTab === 'roster' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm học sinh theo tên/mã..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 outline-hidden"
                />
              </div>

              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="text-xs p-2 rounded-xl border border-slate-300 outline-hidden bg-white"
              >
                <option value="all">Tất cả các tổ</option>
                <option value="Tổ 1">Tổ 1</option>
                <option value="Tổ 2">Tổ 2</option>
                <option value="Tổ 3">Tổ 3</option>
                <option value="Tổ 4">Tổ 4</option>
              </select>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Tốt (T): {students.filter(s => s.mathLevel === 'T').length}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                Đạt (H): {students.filter(s => s.mathLevel === 'H').length}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Cần hỗ trợ (C): {students.filter(s => s.mathLevel === 'C').length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-200">
                  <th className="p-3 font-bold w-16">Mã HS</th>
                  <th className="p-3 font-bold">Họ và tên</th>
                  <th className="p-3 font-bold">Tổ</th>
                  <th className="p-3 font-bold">Môn Toán</th>
                  <th className="p-3 font-bold">Tiếng Việt</th>
                  <th className="p-3 font-bold">Ưu điểm nổi bật</th>
                  <th className="p-3 font-bold text-center">Huy hiệu</th>
                  <th className="p-3 font-bold text-right">Điểm tích lũy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-500">{st.code}</td>
                    <td className="p-3 font-bold text-slate-900">{st.name}</td>
                    <td className="p-3 font-medium text-slate-600">{st.team}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        st.mathLevel === 'T' ? 'bg-emerald-100 text-emerald-800' : st.mathLevel === 'H' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        Mức {st.mathLevel}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        st.vietnameseLevel === 'T' ? 'bg-emerald-100 text-emerald-800' : st.vietnameseLevel === 'H' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        Mức {st.vietnameseLevel}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 max-w-xs truncate">{st.strengths}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {st.badges.map((b, bIdx) => (
                          <span key={bIdx} className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded font-semibold truncate">
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-right font-black text-amber-600">{st.totalPoints}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <h4 className="font-bold text-sm text-slate-800">Sổ Điểm Danh Điện Tử - Hôm Nay</h4>
              <p className="text-xs text-slate-500">Bấm nút để chuyển đổi trạng thái điểm danh cho từng học sinh</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg">
                Có mặt: {presentCount}
              </span>
              <span className="text-rose-700 bg-rose-100 px-3 py-1 rounded-lg">
                Vắng: {absentCount}
              </span>
              <span className="text-amber-700 bg-amber-100 px-3 py-1 rounded-lg">
                Đi muộn: {lateCount}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {students.map((st) => (
              <div
                key={st.id}
                className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between hover:shadow-xs transition-all"
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-400">{st.code}</span>
                  <p className="font-bold text-xs text-slate-900">{st.name}</p>
                  <p className="text-[10px] text-slate-500">{st.team}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateAttendance(st.id, 'present')}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                      st.attendanceStatus === 'present'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                    title="Có mặt"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => onUpdateAttendance(st.id, 'late')}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                      st.attendanceStatus === 'late'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                    title="Đi muộn"
                  >
                    M
                  </button>
                  <button
                    onClick={() => onUpdateAttendance(st.id, 'absent')}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                      st.attendanceStatus === 'absent'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                    title="Vắng mặt"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ASSIGNMENTS & SUBMISSIONS */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((assign) => (
              <div
                key={assign.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      {assign.subject} • Tự luyện online
                    </span>
                    <span className="text-[10px] text-slate-400">Hạn: {assign.dueDate}</span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900">{assign.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Gồm {assign.questions.length} câu hỏi trắc nghiệm tự chấm điểm • Thời gian: {assign.durationMinutes} phút
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                  <span className="text-xs font-semibold text-emerald-600">
                    {submissions.filter(s => s.assignmentId === assign.id).length} học sinh đã nộp bài
                  </span>
                  <button
                    onClick={() => handleStartQuiz(assign)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Làm thử bài tự luyện này</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Submissions List */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-sm text-slate-800">Kết Quả Học Sinh Nộp Bài Trực Tuyến</h4>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 border-b border-slate-200">
                    <th className="p-3 font-bold">Họ và tên học sinh</th>
                    <th className="p-3 font-bold">Bài tập</th>
                    <th className="p-3 font-bold text-center">Điểm số</th>
                    <th className="p-3 font-bold text-center">Thời gian làm</th>
                    <th className="p-3 font-bold text-right">Thời điểm nộp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{sub.studentName}</td>
                      <td className="p-3 text-slate-700">{assignments.find(a => a.id === sub.assignmentId)?.title || 'Bài tự luyện'}</td>
                      <td className="p-3 text-center">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black">
                          {sub.score} / {sub.totalScore}
                        </span>
                      </td>
                      <td className="p-3 text-center text-slate-600">{Math.round(sub.timeSpentSeconds / 60)} phút</td>
                      <td className="p-3 text-right text-slate-400">{sub.submittedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STUDENT QUIZ TAKER INTERFACE */}
      {activeTab === 'student_take' && activeQuiz && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-md max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                Giao diện học sinh làm bài tự luyện
              </span>
              <h3 className="text-base md:text-lg font-black text-slate-900">
                {activeQuiz.title}
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('assignments')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Quay lại danh sách
            </button>
          </div>

          {quizSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
              <Trophy className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
              <h3 className="text-2xl font-black text-emerald-900">
                Chúc mừng em! Điểm của em: {quizScore} / 10
              </h3>
              <p className="text-xs text-slate-600">
                Hệ thống AI đã tự động chấm điểm bài làm và gửi kết quả về sổ theo dõi của cô giáo!
              </p>
              <button
                onClick={() => {
                  setQuizSubmitted(false);
                  setQuizAnswers({});
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Làm lại bài này
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {activeQuiz.questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                  <div className="flex items-start gap-2 font-bold text-slate-900">
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white shrink-0 text-[10px]">
                      Câu {idx + 1}
                    </span>
                    <span className="leading-relaxed text-sm">{q.question}</span>
                  </div>

                  <div className="space-y-2 pl-6">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = quizAnswers[q.id] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleSelectQuizAnswer(q.id, oIdx)}
                          className={`w-full text-left p-3 rounded-xl border font-medium text-xs transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                              : 'bg-white hover:bg-blue-50 border-slate-200 text-slate-800'
                          }`}
                        >
                          <span className="font-bold mr-2">{String.fromCharCode(65 + oIdx)}.</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(quizAnswers).length === 0}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-md transition-all"
                >
                  Nộp bài và nhận điểm ngay
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
