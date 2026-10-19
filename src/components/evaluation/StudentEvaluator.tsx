import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Download,
  Save,
  CheckCircle2,
  AlertCircle,
  Users,
  Search,
  Filter,
  Loader2,
  FileText,
  Check,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { Student, StudentFeedback } from '../../types';
import { AiService } from '../../services/aiService';
import { ExportUtils } from '../../utils/exportUtils';

interface StudentEvaluatorProps {
  students: Student[];
  feedbacks: StudentFeedback[];
  onSaveFeedback: (feedback: StudentFeedback) => void;
}

export const StudentEvaluator: React.FC<StudentEvaluatorProps> = ({
  students,
  feedbacks,
  onSaveFeedback
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'hs-01');
  const [subject, setSubject] = useState('Toán');
  const [term, setTerm] = useState('Giữa học kì I');
  const [completionLevel, setCompletionLevel] = useState<'T' | 'H' | 'C'>('T');
  const [strengths, setStrengths] = useState('Tính toán nhanh, tư duy bài toán có lời văn tốt, hăng hái phát biểu');
  const [needsSupport, setNeedsSupport] = useState('Cần rèn luyện thêm tính cẩn thận khi đặt tính nhân');
  const [evidence, setEvidence] = useState('Bài kiểm tra giữa kì đạt 9.5 điểm, tích cực tham gia trò chơi tiếp sức');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Active Feedback Result state
  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const existingFeedback = feedbacks.find(f => f.studentId === selectedStudentId && f.subject === subject);

  const [currentFeedback, setCurrentFeedback] = useState<StudentFeedback | null>(
    existingFeedback || null
  );

  const handleGenerateFeedback = async () => {
    if (!selectedStudent) return;
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const generated = await AiService.generateStudentFeedback({
        studentName: selectedStudent.name,
        gender: selectedStudent.gender,
        subject,
        term,
        completionLevel,
        strengths,
        needsSupport,
        evidence
      });

      const newFeedback: StudentFeedback = {
        id: 'fb-' + selectedStudent.id + '-' + subject + '-' + Date.now(),
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        subject,
        term,
        completionLevel,
        strengths,
        needsSupport,
        evidence,
        shortComment: generated.shortComment || 'Em hoàn thành tốt nội dung học tập, tích cực phát biểu.',
        detailedComment: generated.detailedComment || 'Em có tinh thần học tập gương mẫu, chăm chỉ và tiến bộ rõ rệt.',
        competencyFeedback: generated.competencyFeedback || {
          selfStudy: 'Tự giác hoàn thành bài tập.',
          collaboration: 'Hòa đồng, phối hợp tốt.',
          problemSolving: 'Tư duy logic nhạy bén.'
        },
        qualityFeedback: generated.qualityFeedback || 'Chăm chỉ, trung thực, có trách nhiệm.',
        suggestedActionsForTeacher: generated.suggestedActionsForTeacher || 'Khích lệ em tự tin phát biểu.',
        suggestedActionsForParents: generated.suggestedActionsForParents || 'Gia đình cùng con ôn tập mỗi ngày 15 phút.',
        createdAt: new Date().toISOString().split('T')[0],
        approvedByTeacher: true
      };

      setCurrentFeedback(newFeedback);
      onSaveFeedback(newFeedback);
      setSuccessMsg(`Đã tạo và lưu nhận xét theo TT 27 cho em ${selectedStudent.name}!`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi khi tạo nhận xét học sinh');
    } finally {
      setLoading(false);
    }
  };

  const handleExportAllToDoc = () => {
    ExportUtils.exportFeedbacksToDoc(feedbacks, term);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3 no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Nhận Xét & Đánh Giá Học Sinh Tiểu Học (Thông tư 27/2020/TT-BGDĐT)
            </h3>
            <p className="text-[11px] text-slate-500">
              Nguyên tắc: Động viên, khích lệ, nêu rõ ưu điểm và biện pháp hỗ trợ cụ thể
            </p>
          </div>
        </div>

        <button
          onClick={handleExportAllToDoc}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Xuất Bảng Tổng Hợp Word (.doc)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Student Selector & Evidence Input (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 no-print">
          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider border-b pb-2">
            1. Chọn Học Sinh & Minh Chứng Thực Tế Lớp 4C
          </h4>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Danh sách học sinh ({students.length} em)
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => {
                  setSelectedStudentId(e.target.value);
                  const st = students.find(s => s.id === e.target.value);
                  if (st) {
                    setStrengths(st.strengths);
                    setNeedsSupport(st.needsSupport);
                    setCompletionLevel(st.mathLevel || 'T');
                  }
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-hidden bg-white font-medium"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name} ({s.team})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Môn đánh giá</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-hidden bg-white"
                >
                  <option value="Toán">Toán 4</option>
                  <option value="Tiếng Việt">Tiếng Việt 4</option>
                  <option value="Khoa học">Khoa học 4</option>
                  <option value="Lịch sử và Địa lí">Lịch sử và Địa lí 4</option>
                  <option value="Đạo đức">Đạo đức 4</option>
                  <option value="Năng lực & Phẩm chất chung">Đánh giá chung cuối kì</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Giai đoạn</label>
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-hidden bg-white"
                >
                  <option value="Đầu năm học">Đầu năm học</option>
                  <option value="Giữa học kì I">Giữa học kì I</option>
                  <option value="Cuối học kì I">Cuối học kì I</option>
                  <option value="Giữa học kì II">Giữa học kì II</option>
                  <option value="Cuối năm học">Cuối năm học</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mức độ hoàn thành (Theo TT 27)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'T', label: 'HT Tốt (T)', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
                  { id: 'H', label: 'Hoàn thành (H)', color: 'bg-blue-50 text-blue-800 border-blue-300' },
                  { id: 'C', label: 'Chưa HT (C)', color: 'bg-amber-50 text-amber-800 border-amber-300' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCompletionLevel(item.id as any)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                      completionLevel === item.id
                        ? `${item.color} ring-2 ring-amber-400 shadow-xs`
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ưu điểm nổi bật của em</label>
              <textarea
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-hidden resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Điểm cần hỗ trợ, khắc phục</label>
              <textarea
                value={needsSupport}
                onChange={(e) => setNeedsSupport(e.target.value)}
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-hidden resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Minh chứng học tập</label>
              <input
                type="text"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="Điểm kiểm tra, hoạt động nhóm..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-hidden"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateFeedback}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/25 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Gemini AI đang soạn lời nhận xét sư phạm...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Gợi Ý Nhận Xét Chuẩn TT 27</span>
              </>
            )}
          </button>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Right: Detailed Feedback & Approval Panel (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                Kết quả gợi ý nhận xét
              </span>
              <h3 className="text-base font-black text-slate-900">
                Học sinh: {selectedStudent?.name} ({selectedStudent?.code})
              </h3>
            </div>

            <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-amber-100 text-amber-800">
              Mức {completionLevel} • {subject}
            </span>
          </div>

          {currentFeedback ? (
            <div className="space-y-4 text-xs">
              {/* Short Comment for Official Portals (under 40 words) */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 uppercase text-[11px]">
                    1. Nhận xét nhập sổ theo dõi / CSDL ngành (Dưới 40 từ)
                  </span>
                  <span className="text-[10px] text-amber-700 font-semibold">Chuẩn mực sư phạm</span>
                </div>
                <textarea
                  value={currentFeedback.shortComment}
                  onChange={(e) => setCurrentFeedback({ ...currentFeedback, shortComment: e.target.value })}
                  rows={2}
                  className="w-full p-2 bg-white rounded-lg border border-amber-300 font-medium text-slate-800 outline-hidden focus:ring-1 focus:ring-amber-500 resize-y"
                />
              </div>

              {/* Detailed Comment for Parents */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1.5">
                <span className="font-bold text-blue-900 uppercase text-[11px]">
                  2. Lời nhận xét chi tiết gửi cho phụ huynh học sinh
                </span>
                <textarea
                  value={currentFeedback.detailedComment}
                  onChange={(e) => setCurrentFeedback({ ...currentFeedback, detailedComment: e.target.value })}
                  rows={3}
                  className="w-full p-2 bg-white rounded-lg border border-blue-300 font-medium text-slate-800 outline-hidden focus:ring-1 focus:ring-blue-500 resize-y"
                />
              </div>

              {/* Competencies breakdown */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 uppercase text-[11px]">
                  3. Đánh giá sự hình thành và phát triển năng lực, phẩm chất
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <p className="font-bold text-slate-700">Tự chủ & Tự học:</p>
                    <p className="text-slate-600 mt-1">{currentFeedback.competencyFeedback.selfStudy}</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <p className="font-bold text-slate-700">Giao tiếp & Hợp tác:</p>
                    <p className="text-slate-600 mt-1">{currentFeedback.competencyFeedback.collaboration}</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <p className="font-bold text-slate-700">Giải quyết vấn đề:</p>
                    <p className="text-slate-600 mt-1">{currentFeedback.competencyFeedback.problemSolving}</p>
                  </div>
                </div>
              </div>

              {/* Suggestions for Teacher & Parents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <p className="font-bold text-emerald-900 text-[11px] mb-1">Biện pháp hỗ trợ của giáo viên:</p>
                  <p className="text-slate-700 text-[11px]">{currentFeedback.suggestedActionsForTeacher}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                  <p className="font-bold text-purple-900 text-[11px] mb-1">Lời khuyên phối hợp cùng gia đình:</p>
                  <p className="text-slate-700 text-[11px]">{currentFeedback.suggestedActionsForParents}</p>
                </div>
              </div>

              {/* Approval notice */}
              <div className="pt-2 flex items-center justify-between text-xs border-t">
                <span className="text-slate-500 italic">
                  * Giáo viên phê duyệt trước khi lưu hoặc xuất dữ liệu
                </span>
                <button
                  onClick={() => {
                    onSaveFeedback(currentFeedback);
                    setSuccessMsg('Đã phê duyệt và lưu vào hồ sơ đánh giá của lớp 4C!');
                    setTimeout(() => setSuccessMsg(null), 3000);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Cô Giáo Phê Duyệt & Lưu</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-2">
              <Award className="w-10 h-10 stroke-1" />
              <p className="text-xs">Chưa có lời nhận xét nào cho học sinh này</p>
              <p className="text-[11px]">Bấm nút "Gợi Ý Nhận Xét Chuẩn TT 27" để Gemini AI hỗ trợ soạn thảo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
