import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Download,
  Printer,
  Copy,
  Save,
  Trash2,
  RefreshCw,
  Columns2,
  Layout,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  Search,
  Share2
} from 'lucide-react';
import { LessonPlan, LessonPlanActivity } from '../../types';
import { AiService } from '../../services/aiService';
import { ExportUtils } from '../../utils/exportUtils';

interface LessonPlannerProps {
  plans: LessonPlan[];
  onSavePlan: (plan: LessonPlan) => void;
  onDeletePlan: (id: string) => void;
}

export const LessonPlanner: React.FC<LessonPlannerProps> = ({
  plans,
  onSavePlan,
  onDeletePlan
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'create' | 'list'>('create');
  const [layoutMode, setLayoutMode] = useState<'table' | 'cards'>('table');

  // Form State
  const [subject, setSubject] = useState('Toán');
  const [bookSet, setBookSet] = useState('Kết nối tri thức với cuộc sống');
  const [week, setWeek] = useState('Tuần 12');
  const [period, setPeriod] = useState('Tiết 1');
  const [topic, setTopic] = useState('Phép nhân với số có một chữ số (có nhớ)');
  const [duration, setDuration] = useState('35 phút');
  const [organization, setOrganization] = useState('Kết hợp cá nhân, thảo luận nhóm đôi và trò chơi tiếp sức');
  const [specialRequirements, setSpecialRequirements] = useState('Phân hóa theo năng lực, chú trọng rèn học sinh kĩ năng cộng số nhớ và trình bày thẳng cột.');

  // AI & Editor State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<LessonPlan | null>(plans[0] || null);

  // Search in list
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');

  const subjects = [
    'Toán',
    'Tiếng Việt',
    'Khoa học',
    'Lịch sử và Địa lí',
    'Đạo đức',
    'Công nghệ',
    'Tin học',
    'Hoạt động trải nghiệm'
  ];

  const bookSets = [
    'Kết nối tri thức với cuộc sống',
    'Chân trời sáng tạo',
    'Cánh diều'
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const generated = await AiService.generateLessonPlan({
        subject,
        bookSet,
        week,
        period,
        topic,
        duration,
        organization,
        specialRequirements,
        layoutStyle: layoutMode === 'table' ? 'two_column' : 'card'
      });

      const newPlan: LessonPlan = {
        id: 'lp-' + Date.now(),
        title: generated.title || `Kế hoạch bài dạy môn ${subject}: ${topic}`,
        subject: generated.subject || subject,
        bookSet: generated.bookSet || bookSet,
        grade: 'Lớp 4',
        week: generated.week || week,
        period: generated.period || period,
        topic: generated.topic || topic,
        duration: generated.duration || duration,
        requirements: generated.requirements || {
          competencies: { specific: [], general: [] },
          qualities: []
        },
        preparation: generated.preparation || { teacher: [], student: [] },
        activities: generated.activities || [],
        reflection: generated.reflection || '',
        suggestedTeacherDialogue: generated.suggestedTeacherDialogue || '',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        isFavorite: false
      };

      setCurrentPlan(newPlan);
      onSavePlan(newPlan);
      setSuccessMsg('Kế hoạch bài dạy đã được Gemini AI tạo và lưu thành công!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi khi tạo giáo án bằng Gemini AI');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCurrent = () => {
    if (!currentPlan) return;
    onSavePlan(currentPlan);
    setSuccessMsg('Đã lưu các chỉnh sửa vào thư viện bài dạy!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleExportWord = () => {
    if (!currentPlan) return;
    ExportUtils.exportLessonPlanToDoc(currentPlan);
  };

  const handlePrint = () => {
    ExportUtils.printDocument();
  };

  const handleDuplicate = () => {
    if (!currentPlan) return;
    const duplicated: LessonPlan = {
      ...currentPlan,
      id: 'lp-' + Date.now(),
      title: `${currentPlan.title} (Bản sao)`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setCurrentPlan(duplicated);
    onSavePlan(duplicated);
    setSuccessMsg('Đã nhân bản kế hoạch bài dạy thành công!');
  };

  const filteredPlans = plans.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSubject = filterSubject === 'all' || p.subject === filterSubject;
    return matchSearch && matchSubject;
  });

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3 no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('create')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'create'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Soạn bài mới với Gemini AI
          </button>
          <button
            onClick={() => setActiveSubTab('list')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'list'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Thư viện giáo án của cô ({plans.length})
          </button>
        </div>

        {currentPlan && activeSubTab === 'create' && (
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setLayoutMode('table')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  layoutMode === 'table' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Bảng 2 cột chuẩn hoạt động GV & HS"
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span>Bảng 2 cột</span>
              </button>
              <button
                onClick={() => setLayoutMode('cards')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  layoutMode === 'cards' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Bố cục thẻ chi tiết"
              >
                <Layout className="w-3.5 h-3.5" />
                <span>Thẻ nội dung</span>
              </button>
            </div>

            <button
              onClick={handleSaveCurrent}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu</span>
            </button>
            <button
              onClick={handleExportWord}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải Word (.doc)</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In A4</span>
            </button>
          </div>
        )}
      </div>

      {activeSubTab === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel: Configuration Form (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 no-print">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Thiết Lập Bài Học Lớp 4</h3>
                <p className="text-[11px] text-slate-500">Chuẩn GDPT 2018 & CV 2345</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Môn học</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white"
                >
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bộ sách giáo khoa</label>
                <select
                  value={bookSet}
                  onChange={(e) => setBookSet(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white"
                >
                  {bookSets.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tuần học</label>
                  <input
                    type="text"
                    value={week}
                    onChange={(e) => setWeek(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tiết số</label>
                  <input
                    type="text"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên bài học</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Nhập tên bài học..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Thời lượng tiết dạy</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hình thức tổ chức</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Yêu cầu riêng / Phân hóa</label>
                <textarea
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini AI đang soạn giáo án...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Soạn Giáo Án Với Gemini AI</span>
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

          {/* Right Panel: Interactive Editor & Preview (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs min-h-[600px] print-card">
            {currentPlan ? (
              <div className="space-y-6">
                {/* School & Lesson Header */}
                <div className="text-center border-b border-slate-200 pb-5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    TRƯỜNG TIỂU HỌC KHOÁI CHÂU 1 - LỚP 4C
                  </p>
                  <h2 className="text-xl font-black text-blue-900 mt-1 uppercase tracking-tight">
                    KẾ HOẠCH BÀI DẠY (GIÁO ÁN)
                  </h2>
                  <p className="text-base font-bold text-blue-600 mt-0.5">
                    MÔN: {currentPlan.subject.toUpperCase()} - LỚP 4
                  </p>
                  <input
                    type="text"
                    value={currentPlan.topic}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, topic: e.target.value })}
                    className="text-center text-sm font-bold text-slate-800 border-b border-dashed border-slate-300 w-full max-w-lg mt-1 focus:outline-hidden"
                  />
                  <p className="text-xs text-slate-500 italic mt-1">
                    Bộ sách: {currentPlan.bookSet} • {currentPlan.week} - {currentPlan.period} • Thời lượng: {currentPlan.duration}
                  </p>
                </div>

                {/* Section I: Yêu cầu cần đạt */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-blue-900 uppercase border-b border-blue-100 pb-1 flex items-center justify-between">
                    <span>I. Yêu Cầu Cần Đạt</span>
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="font-bold text-slate-800">1. Năng lực đặc thù:</p>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700 mt-1">
                        {currentPlan.requirements.competencies.specific.map((item, idx) => (
                          <li key={idx}>
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const updated = [...currentPlan.requirements.competencies.specific];
                                updated[idx] = e.target.value;
                                setCurrentPlan({
                                  ...currentPlan,
                                  requirements: {
                                    ...currentPlan.requirements,
                                    competencies: { ...currentPlan.requirements.competencies, specific: updated }
                                  }
                                });
                              }}
                              className="w-full bg-transparent hover:bg-slate-50 p-1 rounded focus:bg-white focus:ring-1 focus:ring-blue-300 outline-hidden"
                            />
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-bold text-slate-800">2. Năng lực chung:</p>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700 mt-1">
                        {currentPlan.requirements.competencies.general.map((item, idx) => (
                          <li key={idx}>
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const updated = [...currentPlan.requirements.competencies.general];
                                updated[idx] = e.target.value;
                                setCurrentPlan({
                                  ...currentPlan,
                                  requirements: {
                                    ...currentPlan.requirements,
                                    competencies: { ...currentPlan.requirements.competencies, general: updated }
                                  }
                                });
                              }}
                              className="w-full bg-transparent hover:bg-slate-50 p-1 rounded focus:bg-white focus:ring-1 focus:ring-blue-300 outline-hidden"
                            />
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-bold text-slate-800">3. Phẩm chất chủ yếu:</p>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700 mt-1">
                        {currentPlan.requirements.qualities.map((item, idx) => (
                          <li key={idx}>
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const updated = [...currentPlan.requirements.qualities];
                                updated[idx] = e.target.value;
                                setCurrentPlan({
                                  ...currentPlan,
                                  requirements: {
                                    ...currentPlan.requirements,
                                    qualities: updated
                                  }
                                });
                              }}
                              className="w-full bg-transparent hover:bg-slate-50 p-1 rounded focus:bg-white focus:ring-1 focus:ring-blue-300 outline-hidden"
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Section II: Đồ dùng dạy học */}
                <div className="space-y-2 text-xs">
                  <h3 className="text-sm font-black text-blue-900 uppercase border-b border-blue-100 pb-1">
                    II. Đồ Dùng Dạy Học
                  </h3>
                  <p>
                    <strong>1. Giáo viên:</strong>{' '}
                    <input
                      type="text"
                      value={currentPlan.preparation.teacher.join('; ')}
                      onChange={(e) => {
                        setCurrentPlan({
                          ...currentPlan,
                          preparation: { ...currentPlan.preparation, teacher: e.target.value.split('; ') }
                        });
                      }}
                      className="w-4/5 bg-transparent hover:bg-slate-50 p-1 rounded focus:bg-white focus:ring-1 focus:ring-blue-300 outline-hidden"
                    />
                  </p>
                  <p>
                    <strong>2. Học sinh:</strong>{' '}
                    <input
                      type="text"
                      value={currentPlan.preparation.student.join('; ')}
                      onChange={(e) => {
                        setCurrentPlan({
                          ...currentPlan,
                          preparation: { ...currentPlan.preparation, student: e.target.value.split('; ') }
                        });
                      }}
                      className="w-4/5 bg-transparent hover:bg-slate-50 p-1 rounded focus:bg-white focus:ring-1 focus:ring-blue-300 outline-hidden"
                    />
                  </p>
                </div>

                {/* Section III: Các hoạt động dạy học */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-blue-900 uppercase border-b border-blue-100 pb-1 flex items-center justify-between">
                    <span>III. Các Hoạt Động Dạy Học Chủ Yếu</span>
                    <span className="text-[11px] font-normal text-slate-500 lowercase">
                      {layoutMode === 'table' ? '(Bảng 2 cột GV & HS)' : '(Dạng thẻ)'}
                    </span>
                  </h3>

                  {layoutMode === 'table' ? (
                    <div className="overflow-x-auto border border-slate-300 rounded-xl">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                            <th className="p-3 w-1/2 border-r border-slate-300 font-bold">Hoạt động của Giáo viên</th>
                            <th className="p-3 w-1/2 font-bold">Hoạt động của Học sinh</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {currentPlan.activities.map((act, idx) => (
                            <React.Fragment key={idx}>
                              <tr className="bg-blue-50/70 border-b border-slate-200">
                                <td colSpan={2} className="p-2.5 font-bold text-blue-900">
                                  <span>{act.name}</span>
                                  <p className="text-[11px] font-normal text-slate-600 italic">Mục tiêu: {act.goal}</p>
                                </td>
                              </tr>
                              <tr className="align-top divide-x divide-slate-200">
                                <td className="p-3 space-y-2">
                                  <p className="font-semibold text-slate-800">Lời dẫn & Chỉ đạo của GV:</p>
                                  <textarea
                                    value={act.teacherActivity}
                                    onChange={(e) => {
                                      const updated = [...currentPlan.activities];
                                      updated[idx].teacherActivity = e.target.value;
                                      setCurrentPlan({ ...currentPlan, activities: updated });
                                    }}
                                    rows={4}
                                    className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs outline-hidden focus:border-blue-500 resize-y"
                                  />
                                </td>
                                <td className="p-3 space-y-2">
                                  <p className="font-semibold text-slate-800">Nhiệm vụ & Sản phẩm của HS:</p>
                                  <textarea
                                    value={act.studentActivity}
                                    onChange={(e) => {
                                      const updated = [...currentPlan.activities];
                                      updated[idx].studentActivity = e.target.value;
                                      setCurrentPlan({ ...currentPlan, activities: updated });
                                    }}
                                    rows={3}
                                    className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs outline-hidden focus:border-blue-500 resize-y"
                                  />
                                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-[11px]">
                                    <p><strong>Sản phẩm:</strong> {act.expectedProduct}</p>
                                    <p><strong>Đánh giá:</strong> {act.assessment}</p>
                                  </div>
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentPlan.activities.map((act, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                          <div className="flex items-center justify-between font-bold text-blue-900 border-b border-slate-200 pb-1.5">
                            <span>{act.name}</span>
                            <span className="text-[11px] font-normal text-slate-500">{act.goal}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            <div>
                              <p className="font-semibold text-slate-800 mb-1">Hoạt động giáo viên:</p>
                              <textarea
                                value={act.teacherActivity}
                                onChange={(e) => {
                                  const updated = [...currentPlan.activities];
                                  updated[idx].teacherActivity = e.target.value;
                                  setCurrentPlan({ ...currentPlan, activities: updated });
                                }}
                                rows={4}
                                className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs outline-hidden resize-y"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 mb-1">Hoạt động học sinh:</p>
                              <textarea
                                value={act.studentActivity}
                                onChange={(e) => {
                                  const updated = [...currentPlan.activities];
                                  updated[idx].studentActivity = e.target.value;
                                  setCurrentPlan({ ...currentPlan, activities: updated });
                                }}
                                rows={4}
                                className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs outline-hidden resize-y"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section IV: Điều chỉnh sau bài dạy */}
                <div className="space-y-1.5 text-xs">
                  <h3 className="text-sm font-black text-blue-900 uppercase border-b border-blue-100 pb-1">
                    IV. Điều Chỉnh Sau Bài Dạy
                  </h3>
                  <textarea
                    value={currentPlan.reflection}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, reflection: e.target.value })}
                    rows={2}
                    placeholder="Ghi chú điều chỉnh sau tiết dạy thực tế trên lớp 4C..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-hidden"
                  />
                </div>

                {/* Bottom Signature Preview */}
                <div className="pt-6 border-t border-slate-200 flex justify-between text-xs text-slate-600">
                  <div className="text-center">
                    <p className="font-bold">BAN GIÁM HIỆU DUYỆT</p>
                    <p className="italic text-[11px] mt-8">(Ký và ghi rõ họ tên)</p>
                  </div>
                  <div className="text-center">
                    <p className="italic">Khoái Châu, ngày ..... tháng ..... năm 2026</p>
                    <p className="font-bold">GIÁO VIÊN SOẠN BÀI</p>
                    <p className="font-bold text-slate-900 mt-8">Phạm Thị Tính</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
                <BookOpen className="w-12 h-12 stroke-1 mb-2" />
                <p className="text-sm font-semibold">Chưa có kế hoạch bài dạy nào</p>
                <p className="text-xs">Vui lòng điền thông tin bên trái và nhấn nút "Soạn Giáo Án Với Gemini AI"</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Saved Lesson Plans List */
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên bài học..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
                />
              </div>

              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="text-xs p-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white"
              >
                <option value="all">Tất cả môn học</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <button
              onClick={() => setActiveSubTab('create')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Soạn bài mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                      {plan.subject}
                    </span>
                    <span className="text-[11px] text-slate-400">{plan.week} • {plan.period}</span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{plan.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    Bộ sách: {plan.bookSet} • Thời lượng: {plan.duration}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-3">
                  <span className="text-[10px] text-slate-400">Cập nhật: {plan.updatedAt}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setCurrentPlan(plan);
                        setActiveSubTab('create');
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      Mở sửa
                    </button>
                    <button
                      onClick={() => ExportUtils.exportLessonPlanToDoc(plan)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      title="Tải Word (.doc)"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeletePlan(plan.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Xóa giáo án"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
