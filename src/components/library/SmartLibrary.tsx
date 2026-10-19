import React, { useState } from 'react';
import {
  FolderOpen,
  Search,
  Filter,
  Download,
  Trash2,
  Copy,
  BookOpen,
  FileSpreadsheet,
  Gamepad2,
  Star,
  Upload,
  Plus,
  Eye,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { LessonPlan, LearningMaterial, InteractiveGame } from '../../types';
import { ExportUtils } from '../../utils/exportUtils';

interface SmartLibraryProps {
  plans: LessonPlan[];
  materials: LearningMaterial[];
  games: InteractiveGame[];
  onDeletePlan: (id: string) => void;
  onDeleteMaterial: (id: string) => void;
  onDeleteGame: (id: string) => void;
  onNavigateTab: (tabId: string) => void;
}

export const SmartLibrary: React.FC<SmartLibraryProps> = ({
  plans,
  materials,
  games,
  onDeletePlan,
  onDeleteMaterial,
  onDeleteGame,
  onNavigateTab
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'plans' | 'materials' | 'games' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Preview modal state
  const [previewItem, setPreviewItem] = useState<{ type: string; data: any } | null>(null);

  // Upload modal simulator
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('Toán');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Combine items into unified cards
  const unifiedItems = [
    ...plans.map(p => ({
      id: p.id,
      title: p.title,
      subject: p.subject,
      category: 'plans',
      categoryLabel: 'Kế hoạch bài dạy',
      date: p.updatedAt || p.createdAt,
      details: `${p.bookSet} • ${p.week} • ${p.duration}`,
      isFavorite: p.isFavorite,
      raw: p
    })),
    ...materials.map(m => ({
      id: m.id,
      title: m.title,
      subject: m.subject,
      category: 'materials',
      categoryLabel: `Học liệu (${m.materialType})`,
      date: m.createdAt,
      details: `${m.headerInfo.school} • ${m.sections.length} phần`,
      isFavorite: m.isFavorite,
      raw: m
    })),
    ...games.map(g => ({
      id: g.id,
      title: g.title,
      subject: g.subject,
      category: 'games',
      categoryLabel: `Trò chơi (${g.gameType})`,
      date: g.createdAt,
      details: `Đã chơi ${g.playCount} lần • Kỉ lục: ${g.highestScore}đ`,
      isFavorite: g.isFavorite,
      raw: g
    }))
  ];

  const filteredItems = unifiedItems.filter(item => {
    const matchCategory =
      activeCategory === 'all'
        ? true
        : activeCategory === 'favorites'
        ? item.isFavorite
        : item.category === activeCategory;

    const matchSubject = selectedSubject === 'all' || item.subject === selectedSubject;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSubject && matchSearch;
  });

  const handleDownload = (item: any) => {
    if (item.category === 'plans') {
      ExportUtils.exportLessonPlanToDoc(item.raw);
    } else if (item.category === 'materials') {
      ExportUtils.exportMaterialToDoc(item.raw);
    } else {
      alert(`Đã lưu tệp dữ liệu trò chơi "${item.title}". Bạn có thể trình chiếu trực tiếp trên lớp học!`);
    }
  };

  const handleDelete = (item: any) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa "${item.title}" khỏi thư viện?`)) {
      if (item.category === 'plans') onDeletePlan(item.id);
      else if (item.category === 'materials') onDeleteMaterial(item.id);
      else if (item.category === 'games') onDeleteGame(item.id);
    }
  };

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setShowUploadModal(false);
      setUploadTitle('');
      alert('Tài liệu đã được tải lên và gắn thẻ an toàn cho lớp 4C!');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3 no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Thư Viện Học Liệu Số Thông Minh</h3>
            <p className="text-[11px] text-slate-500">
              Quản lý tập trung bài giảng, phiếu bài tập, đề kiểm tra và trò chơi của cô giáo
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Tải tài liệu lên thư viện</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'all', label: `Tất cả (${unifiedItems.length})` },
            { id: 'plans', label: `Giáo án (${plans.length})` },
            { id: 'materials', label: `Học liệu (${materials.length})` },
            { id: 'games', label: `Trò chơi (${games.length})` },
            { id: 'favorites', label: `Yêu thích ⭐` },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Subject filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tài liệu..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 outline-hidden"
            />
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="text-xs p-2 rounded-xl border border-slate-300 outline-hidden bg-white"
          >
            <option value="all">Mọi môn học</option>
            <option value="Toán">Toán 4</option>
            <option value="Tiếng Việt">Tiếng Việt 4</option>
            <option value="Khoa học">Khoa học 4</option>
            <option value="Lịch sử và Địa lí">Lịch sử và Địa lí 4</option>
            <option value="Đạo đức">Đạo đức 4</option>
          </select>
        </div>
      </div>

      {/* Grid of Items */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {item.categoryLabel}
                  </span>
                  <span className="text-[10px] text-slate-400">{item.date}</span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  Môn {item.subject} • {item.details}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Lớp 4C
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewItem({ type: item.category, data: item.raw })}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Xem nhanh"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(item)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Tải về máy (.doc)"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400 space-y-2">
          <FolderOpen className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
          <p className="text-sm font-bold text-slate-600">Không tìm thấy tài liệu phù hợp</p>
          <p className="text-xs">Hãy thử thay đổi từ khóa tìm kiếm hoặc lọc danh mục khác</p>
        </div>
      )}

      {/* Quick Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase">Xem trước tài liệu</span>
                <h3 className="text-base font-black text-slate-900">{previewItem.data.title}</h3>
              </div>
              <button onClick={() => setPreviewItem(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="text-xs space-y-3 leading-relaxed text-slate-700">
              <p><strong>Môn học:</strong> {previewItem.data.subject} - Lớp 4</p>
              {previewItem.data.topic && <p><strong>Chủ đề:</strong> {previewItem.data.topic}</p>}
              {previewItem.data.reflection && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-800">Điều chỉnh sau tiết dạy:</p>
                  <p>{previewItem.data.reflection}</p>
                </div>
              )}
              {previewItem.data.instructions && (
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="font-bold text-blue-800">Hướng dẫn làm bài:</p>
                  <p>{previewItem.data.instructions}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  handleDownload({ category: previewItem.type, raw: previewItem.data });
                  setPreviewItem(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải tệp Word (.doc)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Simulator Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900">Tải Tài Liệu Lên Thư Viện Lớp 4C</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSimulateUpload} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên tài liệu / bài giảng</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Ví dụ: Đề cương ôn tập Toán tuần 12..."
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Môn học</label>
                <select
                  value={uploadSubject}
                  onChange={(e) => setUploadSubject(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-hidden bg-white"
                >
                  <option value="Toán">Toán 4</option>
                  <option value="Tiếng Việt">Tiếng Việt 4</option>
                  <option value="Khoa học">Khoa học 4</option>
                  <option value="Lịch sử và Địa lí">Lịch sử và Địa lí 4</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-slate-300 p-6 rounded-xl text-center space-y-1">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">Kéo thả tệp hoặc bấm để chọn tệp</p>
                <p className="text-[10px] text-slate-400">Hỗ trợ định dạng .doc, .docx, .pdf, .txt (tối đa 10MB)</p>
              </div>

              {uploadSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Đã kiểm tra an toàn và đồng bộ vào thư viện lớp 4C!</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={uploadSuccess}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
                >
                  Xác nhận tải lên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
