import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  FileText,
  FileSpreadsheet,
  Gamepad2,
  Award,
  MessageSquare,
  ArrowRight,
  Check
} from 'lucide-react';
import { AiService } from '../../services/aiService';

interface AiCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteAction: (action: string, params: any) => void;
}

export const AiCommandModal: React.FC<AiCommandModalProps> = ({
  isOpen,
  onClose,
  onExecuteAction
}) => {
  const [promptText, setPromptText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: 'Soạn giáo án Toán 4', action: 'lesson_plan', prompt: 'Soạn Kế hoạch bài dạy môn Toán 4 bài Phép nhân với số có một chữ số theo CT GDPT 2018' },
    { label: 'Tạo phiếu bài tập Tiếng Việt', action: 'material', prompt: 'Tạo phiếu học tập Tiếng Việt 4 chủ đề Luyện từ và câu: Danh từ phân hóa 3 mức độ' },
    { label: 'Trò chơi Ai Là Triệu Phú', action: 'game', prompt: 'Tạo trò chơi Ai Là Triệu Phú môn Khoa học 4 ôn tập chủ đề Nước và các thể của nước' },
    { label: 'Nhận xét học sinh theo TT27', action: 'feedback', prompt: 'Gợi ý nhận xét học sinh giỏi môn Toán giữa học kì I theo đúng Thông tư 27' },
    { label: 'Đề kiểm tra định kì', action: 'material', prompt: 'Thiết kế đề kiểm tra 15 phút môn Khoa học 4 có trắc nghiệm và câu hỏi tự luận vận dụng' },
    { label: 'Hỏi chuyên gia sư phạm AI', action: 'chat', prompt: 'Làm thế nào để tổ chức hoạt động khởi động sôi nổi cho học sinh lớp 4?' }
  ];

  const handleRunCommand = async (textToRun = promptText) => {
    if (!textToRun.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const result = await AiService.processQuickCommand(textToRun);
      onExecuteAction(result.action || 'lesson_plan', result);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi khi xử lý lệnh AI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-cyan-200" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">AI Command Center - Trợ Lý Giáo Viên Lớp 4</h3>
              <p className="text-[11px] text-blue-100">Xử lý ngôn ngữ tự nhiên được hỗ trợ bởi Google Gemini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nhập yêu cầu tự nhiên của cô giáo:
            </label>
            <div className="relative">
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleRunCommand();
                  }
                }}
                placeholder="Ví dụ: Soạn giáo án môn Tiếng Việt bài Danh từ, tạo trò chơi vòng quay Toán 4, hoặc nhận xét học sinh..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden resize-none"
              />
            </div>
          </div>

          {/* Quick Chips */}
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Lệnh mẫu gợi ý thường dùng:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPromptText(item.prompt);
                    handleRunCommand(item.prompt);
                  }}
                  className="text-left p-2 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/60 transition-all group flex items-start gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-700">{item.label}</p>
                    <p className="text-[10px] text-slate-500 truncate">{item.prompt}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Nhấn <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">Enter</kbd> để gửi lệnh</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200/80 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={() => handleRunCommand()}
              disabled={loading || !promptText.trim()}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang xử lý Gemini AI...</span>
                </>
              ) : (
                <>
                  <span>Thực thi lệnh</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
