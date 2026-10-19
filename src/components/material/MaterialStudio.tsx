import React, { useState } from 'react';
import {
  Sparkles,
  FileSpreadsheet,
  Download,
  Printer,
  Save,
  Trash2,
  Copy,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Search,
  Eye,
  FileText,
  Sliders,
  Check
} from 'lucide-react';
import { LearningMaterial, MaterialSection } from '../../types';
import { AiService } from '../../services/aiService';
import { ExportUtils } from '../../utils/exportUtils';

interface MaterialStudioProps {
  materials: LearningMaterial[];
  onSaveMaterial: (mat: LearningMaterial) => void;
  onDeleteMaterial: (id: string) => void;
}

export const MaterialStudio: React.FC<MaterialStudioProps> = ({
  materials,
  onSaveMaterial,
  onDeleteMaterial
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');
  const [showAnswerKey, setShowAnswerKey] = useState(true);

  // Form states
  const [materialType, setMaterialType] = useState<'worksheet' | 'exam' | 'differentiated' | 'rubric' | 'mindmap' | 'task_cards'>('worksheet');
  const [subject, setSubject] = useState('Toán');
  const [topic, setTopic] = useState('Phân số và các phép tính với phân số');
  const [questionCount, setQuestionCount] = useState(4);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao']);
  const [extraNotes, setExtraNotes] = useState('Bao gồm câu hỏi trắc nghiệm khách quan và bài toán giải có lời văn thực tế.');

  // AI & Current state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [currentMaterial, setCurrentMaterial] = useState<LearningMaterial | null>(materials[0] || null);

  const materialTypeOptions = [
    { id: 'worksheet', label: 'Phiếu học tập tự luyện' },
    { id: 'exam', label: 'Đề kiểm tra định kì (15p / 1 tiết)' },
    { id: 'differentiated', label: 'Bài tập phân hóa năng lực' },
    { id: 'task_cards', label: 'Thẻ nhiệm vụ nhóm (Task Cards)' },
    { id: 'rubric', label: 'Rubric tiêu chí đánh giá' },
    { id: 'mindmap', label: 'Sơ đồ tóm tắt kiến thức cốt lõi' },
  ];

  const levels = ['Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao'];

  const toggleLevel = (lvl: string) => {
    if (selectedLevels.includes(lvl)) {
      if (selectedLevels.length > 1) {
        setSelectedLevels(selectedLevels.filter(l => l !== lvl));
      }
    } else {
      setSelectedLevels([...selectedLevels, lvl]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const generated = await AiService.generateMaterial({
        materialType,
        subject,
        topic,
        grade: 'Lớp 4',
        levels: selectedLevels,
        questionCount,
        versions: 1,
        extraNotes
      });

      const newMaterial: LearningMaterial = {
        id: 'mat-' + Date.now(),
        title: generated.title || `Phiếu học tập ${subject} 4: ${topic}`,
        materialType,
        subject: generated.subject || subject,
        grade: 'Lớp 4',
        topic: generated.topic || topic,
        headerInfo: generated.headerInfo || {
          school: 'Trường Tiểu học Khoái Châu 1',
          class: 'Lớp 4C',
          subject: `${subject} 4`,
          timeLimit: '25 phút'
        },
        instructions: generated.instructions || 'Em hãy đọc kĩ đề bài và hoàn thành cẩn thận nhé!',
        sections: generated.sections || [],
        rubric: generated.rubric || [],
        teacherNotes: generated.teacherNotes || '',
        createdAt: new Date().toISOString().split('T')[0],
        isFavorite: false
      };

      setCurrentMaterial(newMaterial);
      onSaveMaterial(newMaterial);
      setSuccessMsg('Học liệu đã được Gemini AI tạo và lưu vào kho tài liệu!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi khi tạo học liệu bằng Gemini AI');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCurrent = () => {
    if (!currentMaterial) return;
    onSaveMaterial(currentMaterial);
    setSuccessMsg('Đã lưu các chỉnh sửa của học liệu!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleExportDoc = () => {
    if (!currentMaterial) return;
    ExportUtils.exportMaterialToDoc(currentMaterial);
  };

  const handlePrint = () => {
    ExportUtils.printDocument();
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3 no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'create'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Thiết kế học liệu mới
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'list'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Kho học liệu lớp 4C ({materials.length})
          </button>
        </div>

        {currentMaterial && activeTab === 'create' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAnswerKey(!showAnswerKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                showAnswerKey ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showAnswerKey ? 'Ẩn đáp án' : 'Hiện đáp án & lời giải'}</span>
            </button>

            <button
              onClick={handleSaveCurrent}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu</span>
            </button>
            <button
              onClick={handleExportDoc}
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

      {activeTab === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel: Form Settings (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 no-print">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Thông Số Học Liệu AI</h3>
                <p className="text-[11px] text-slate-500">Đúng năng lực lứa tuổi học sinh lớp 4</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Loại học liệu</label>
                <select
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-cyan-500 outline-hidden bg-white"
                >
                  {materialTypeOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Môn học</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-cyan-500 outline-hidden bg-white"
                >
                  <option value="Toán">Toán 4</option>
                  <option value="Tiếng Việt">Tiếng Việt 4</option>
                  <option value="Khoa học">Khoa học 4</option>
                  <option value="Lịch sử và Địa lí">Lịch sử và Địa lí 4</option>
                  <option value="Đạo đức">Đạo đức 4</option>
                  <option value="Công nghệ">Công nghệ 4</option>
                  <option value="Tin học">Tin học 4</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chủ đề bài học</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ví dụ: Rút gọn phân số, Danh từ..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-cyan-500 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Cấp độ tư duy (Phân hóa)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {levels.map((lvl) => {
                    const isSelected = selectedLevels.includes(lvl);
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => toggleLevel(lvl)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-cyan-50 border-cyan-400 text-cyan-800 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{lvl}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Số lượng câu hỏi: <span className="text-cyan-700 font-bold">{questionCount} câu</span>
                </label>
                <input
                  type="range"
                  min={2}
                  max={10}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full accent-cyan-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú thêm</label>
                <textarea
                  value={extraNotes}
                  onChange={(e) => setExtraNotes(e.target.value)}
                  rows={2}
                  placeholder="Yêu cầu cụ thể cho bài tập..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-cyan-500 outline-hidden resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/25 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini AI đang tạo học liệu...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Tạo Học Liệu Phân Hóa</span>
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

          {/* Right Panel: Interactive A4 Sheet Preview (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs min-h-[600px] print-card">
            {currentMaterial ? (
              <div className="space-y-6">
                {/* School Standard Vietnamese Exam/Sheet Header */}
                <div className="border-b-2 border-slate-800 pb-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-800 uppercase tracking-wide">
                        {currentMaterial.headerInfo.school}
                      </p>
                      <p className="font-medium text-slate-600">
                        Lớp: <span className="font-bold text-slate-900">{currentMaterial.headerInfo.class}</span>
                      </p>
                      <p className="text-slate-500 italic mt-1">
                        Họ và tên học sinh: ..............................................................
                      </p>
                    </div>

                    <div className="mt-2 sm:mt-0 text-left sm:text-right">
                      <p className="font-bold text-blue-800 uppercase">
                        MÔN: {currentMaterial.subject.toUpperCase()} LỚP 4
                      </p>
                      <p className="text-slate-600">
                        Thời gian: <span className="font-semibold">{currentMaterial.headerInfo.timeLimit}</span>
                      </p>
                      <div className="mt-1 border border-slate-400 px-3 py-1 inline-block rounded text-center">
                        <span className="text-[10px] text-slate-500 block">Điểm số</span>
                        <span className="font-bold text-slate-800">..... / 10</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <h2 className="text-lg font-black text-slate-900 uppercase">
                      {currentMaterial.title}
                    </h2>
                    <p className="text-xs text-slate-600 italic">Chủ đề: {currentMaterial.topic}</p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 italic">
                  <strong>Hướng dẫn làm bài:</strong> {currentMaterial.instructions}
                </div>

                {/* Question Sections */}
                <div className="space-y-6">
                  {currentMaterial.sections.map((section, sIdx) => (
                    <div key={sIdx} className="space-y-3">
                      <h4 className="font-bold text-sm text-blue-900 border-b border-dashed border-slate-300 pb-1">
                        {section.title}
                      </h4>

                      <div className="space-y-4">
                        {section.questions.map((q, qIdx) => (
                          <div key={q.id || qIdx} className="text-xs space-y-2">
                            <div className="flex items-start gap-2">
                              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold shrink-0 text-[10px]">
                                Câu {qIdx + 1}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] shrink-0 font-medium">
                                {q.level}
                              </span>
                              {q.score && (
                                <span className="text-slate-500 font-semibold text-[10px]">
                                  ({q.score})
                                </span>
                              )}
                              <p className="font-medium text-slate-900 flex-1 leading-relaxed">
                                {q.content}
                              </p>
                            </div>

                            {/* Multiple Choice Options */}
                            {q.options && q.options.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                                {q.options.map((opt, oIdx) => (
                                  <div
                                    key={oIdx}
                                    className={`p-2 rounded-lg border text-xs ${
                                      showAnswerKey && q.correctAnswer && opt.startsWith(q.correctAnswer)
                                        ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900'
                                        : 'bg-white border-slate-200 text-slate-700'
                                    }`}
                                  >
                                    {opt}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Model Answer & Explanation for Teacher / Preview */}
                            {showAnswerKey && (
                              <div className="ml-6 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                                {q.correctAnswer && (
                                  <p>
                                    <strong>Đáp án:</strong> {q.correctAnswer}
                                  </p>
                                )}
                                {q.explanation && (
                                  <p>
                                    <strong>Giải thích:</strong> {q.explanation}
                                  </p>
                                )}
                                {q.modelAnswer && (
                                  <div>
                                    <strong>Lời giải chi tiết:</strong>
                                    <pre className="font-sans whitespace-pre-wrap text-slate-700 mt-0.5">
                                      {q.modelAnswer}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rubric Criteria Table if available */}
                {currentMaterial.rubric && currentMaterial.rubric.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-slate-200">
                    <h4 className="font-bold text-xs text-slate-800 uppercase">
                      Tiêu chí đánh giá (Rubric)
                    </h4>
                    <table className="w-full text-[11px] border border-slate-300">
                      <thead>
                        <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                          <th className="p-2 border-r border-slate-300 text-left">Tiêu chí</th>
                          <th className="p-2 border-r border-slate-300 text-left">Mức 3 (Tốt)</th>
                          <th className="p-2 border-r border-slate-300 text-left">Mức 2 (Đạt)</th>
                          <th className="p-2 text-left">Mức 1 (Cần cố gắng)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {currentMaterial.rubric.map((item, rIdx) => (
                          <tr key={rIdx} className="align-top">
                            <td className="p-2 border-r border-slate-200 font-semibold">{item.criterion}</td>
                            <td className="p-2 border-r border-slate-200 text-emerald-800">{item.excellent}</td>
                            <td className="p-2 border-r border-slate-200 text-blue-800">{item.good}</td>
                            <td className="p-2 text-slate-600">{item.needsImprovement}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
                <FileSpreadsheet className="w-12 h-12 stroke-1 mb-2" />
                <p className="text-sm font-semibold">Chưa có học liệu nào</p>
                <p className="text-xs">Chọn thông số bên trái và nhấn "Tạo Học Liệu Phân Hóa"</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Saved Materials Grid */
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800">Kho Tài Liệu Đã Biên Soạn</h3>
            <button
              onClick={() => setActiveTab('create')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Biên soạn tài liệu mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materials.map((mat) => (
              <div
                key={mat.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-cyan-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800">
                      {mat.subject} • {mat.materialType}
                    </span>
                    <span className="text-[10px] text-slate-400">{mat.createdAt}</span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{mat.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    Chủ đề: {mat.topic} • {mat.headerInfo.school}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-3">
                  <span className="text-[10px] text-slate-400">
                    {mat.sections.reduce((acc, s) => acc + s.questions.length, 0)} câu hỏi
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setCurrentMaterial(mat);
                        setActiveTab('create');
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-cyan-700 hover:bg-cyan-50 rounded-lg"
                    >
                      Xem & Sửa
                    </button>
                    <button
                      onClick={() => ExportUtils.exportMaterialToDoc(mat)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      title="Tải Word (.doc)"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteMaterial(mat.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Xóa học liệu"
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
