import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  User,
  Bot,
  Trash2,
  BookOpen,
  HelpCircle,
  Loader2,
  ShieldAlert,
  GraduationCap,
  Smile
} from 'lucide-react';
import { ChatMessage } from '../../types';
import { AiService } from '../../services/aiService';

export const EducationalChatbot: React.FC = () => {
  const [persona, setPersona] = useState<'teacher_assistant' | 'grade4_tutor'>('teacher_assistant');
  const [subject, setSubject] = useState('Toán');
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      content: 'Xin chào cô giáo Phạm Thị Tính! Em là Trợ lý Phương pháp Dạy học Lớp 4. Em có thể tư vấn đổi mới phương pháp, gợi ý tình huống sư phạm, hoặc thiết kế trò chơi khởi động hấp dẫn cho tiết dạy của cô!',
      timestamp: '08:00'
    }
  ]);

  const teacherSuggestions = [
    'Gợi ý 3 trò chơi khởi động 5 phút cho môn Toán 4',
    'Cách giải thích khái niệm Phân số bằng đồ dùng trực quan',
    'Biện pháp giúp học sinh mất tập trung chú ý hơn',
    'Cách phân hóa bài tập cho học sinh giỏi môn Tiếng Việt'
  ];

  const studentSuggestions = [
    'Bé Ong ơi, làm sao để quy đồng mẫu số hai phân số?',
    'Giúp tớ hiểu vì sao nước lại bay hơi lên trời thành mây?',
    'Kể cho tớ nghe chiến thắng Bạch Đằng của Ngô Quyền!',
    'Làm thế nào để viết câu văn miêu tả cây bàng thật hay?'
  ];

  // Change persona welcome message
  const handleSwitchPersona = (newPersona: 'teacher_assistant' | 'grade4_tutor') => {
    setPersona(newPersona);
    if (newPersona === 'grade4_tutor') {
      setMessages([
        {
          id: 'welcome-tutor',
          sender: 'assistant',
          content: 'Chào bạn nhỏ ngoan của Bé Ong! 🐝 Hôm nay chúng mình cùng khám phá bài học nào? Bạn cứ hỏi tự nhiên nhé, Bé Ong sẽ gợi mở từng bước để bạn tự tìm ra câu trả lời xuất sắc nhất! ⭐',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else {
      setMessages([
        {
          id: 'welcome-teacher',
          sender: 'assistant',
          content: 'Xin chào cô giáo! Em là Trợ lý Sư phạm dành riêng cho giáo viên tiểu học. Hôm nay cô cần hỗ trợ ý tưởng bài dạy hay phương pháp nào ạ?',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const handleSendMessage = async (textToSend = inputMessage) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await AiService.sendChatMessage({
        persona,
        subject,
        message: textToSend,
        conversationHistory: messages.map(m => ({ sender: m.sender, content: m.content }))
      });

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'assistant',
        content: res.reply || 'Cảm ơn câu hỏi của bạn!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: 'ai-err-' + Date.now(),
        sender: 'assistant',
        content: `Xin lỗi, đã xảy ra gián đoạn kết nối (${err.message}). Bạn vui lòng thử lại nhé!`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-[750px] overflow-hidden">
      {/* Header with Persona Switcher */}
      <div className="p-4 border-b border-slate-200/80 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            persona === 'teacher_assistant' ? 'bg-blue-600 text-white shadow-md' : 'bg-amber-500 text-white shadow-md'
          }`}>
            {persona === 'teacher_assistant' ? <GraduationCap className="w-5 h-5" /> : <Smile className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              {persona === 'teacher_assistant' ? 'Trợ Lý Phương Pháp Giáo Viên Lớp 4' : 'Gia Sư AI Bé Ong Chăm Chỉ'}
            </h3>
            <p className="text-[11px] text-slate-500">
              {persona === 'teacher_assistant' ? 'Tư vấn sư phạm chuẩn GDPT 2018' : 'Gợi mở tư duy từng bước cho học sinh (không giải hộ)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => handleSwitchPersona('teacher_assistant')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                persona === 'teacher_assistant' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Trợ lý Giáo viên
            </button>
            <button
              onClick={() => handleSwitchPersona('grade4_tutor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                persona === 'grade4_tutor' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gia sư AI Bé Ong
            </button>
          </div>

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="text-xs p-2 rounded-xl border border-slate-300 outline-hidden bg-white font-medium"
          >
            <option value="Toán">Toán 4</option>
            <option value="Tiếng Việt">Tiếng Việt 4</option>
            <option value="Khoa học">Khoa học 4</option>
            <option value="Lịch sử và Địa lí">Lịch sử và Địa lí 4</option>
            <option value="Kĩ năng sống">Kĩ năng & Tâm lý</option>
          </select>

          <button
            onClick={() => setMessages([])}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Xóa đoạn hội thoại"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
          Môi trường an toàn cho trẻ em: Trí tuệ nhân tạo chỉ đóng vai trò hỗ trợ, gợi mở, không thu thập dữ liệu riêng tư.
        </span>
        <span className="text-slate-400 font-semibold">Gemini 3.8 Flash Engine</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white ${
              msg.sender === 'user' ? 'bg-slate-800' : persona === 'teacher_assistant' ? 'bg-blue-600' : 'bg-amber-500'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed space-y-1 ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/80 shadow-xs'
            }`}>
              <div className="flex items-center justify-between text-[10px] opacity-70 mb-1">
                <span className="font-bold">{msg.sender === 'user' ? 'Cô giáo' : persona === 'teacher_assistant' ? 'Trợ lý AI' : 'Bé Ong'}</span>
                <span>{msg.timestamp}</span>
              </div>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 p-4 rounded-2xl text-xs flex items-center gap-2 text-slate-600">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Đang suy nghĩ câu trả lời phù hợp nhất...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-bold text-slate-400 shrink-0">Hỏi nhanh:</span>
        {(persona === 'teacher_assistant' ? teacherSuggestions : studentSuggestions).map((sug, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(sug)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 shrink-0 transition-all truncate max-w-xs"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-slate-200/80 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={persona === 'teacher_assistant' ? 'Nhập câu hỏi sư phạm, tình huống lên lớp...' : 'Bé Ong ơi, giải thích giúp tớ...'}
            className="flex-1 text-xs p-3 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Gửi</span>
          </button>
        </form>
      </div>
    </div>
  );
};
