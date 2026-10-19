import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper for calling Gemini 3.8 Flash
async function callGemini(systemInstruction: string, prompt: string, expectJson = true): Promise<any> {
  if (!ai) {
    throw new Error('Chưa cấu hình GEMINI_API_KEY. Vui lòng thiết lập key trong Secrets/Environment Variables.');
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction,
      temperature: 0.7,
      ...(expectJson ? { responseMimeType: 'application/json' } : {}),
    },
  });

  const text = response.text || '';
  if (expectJson) {
    try {
      // Strip markdown code fences if present
      const cleaned = text.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn('Failed to parse JSON, returning raw text or parsed object:', text);
      return { raw: text };
    }
  }
  return text;
}

// 1. Phân hệ Soạn giảng AI (Lesson Plan)
app.post('/api/ai/lesson-plan', async (req, res) => {
  try {
    const {
      subject = 'Toán',
      bookSet = 'Kết nối tri thức với cuộc sống',
      week = 'Tuần 12',
      period = 'Tiết 1',
      topic = 'Phép nhân với số có một chữ số',
      duration = '35 phút',
      organization = 'Kết hợp cá nhân, nhóm và trò chơi',
      specialRequirements = '',
      layoutStyle = 'two_column'
    } = req.body;

    const systemInstruction = `Bạn là chuyên gia sư phạm tiểu học hàng đầu Việt Nam, am hiểu sâu sắc Chương trình GDPT 2018 và Công văn 2345/BGDĐT-GDTH về xây dựng Kế hoạch bài dạy (Giáo án) lớp 4.
Hãy biên soạn Kế hoạch bài dạy chuẩn mực, chi tiết, khoa học, lấy học sinh làm trung tâm và phát triển phẩm chất, năng lực.
Trả về dữ liệu dưới dạng JSON thuần túy theo schema định sẵn, không chứa định dạng markdown bên ngoài JSON.`;

    const prompt = `Hãy soạn Kế hoạch bài dạy chi tiết cho:
- Môn học: ${subject} lớp 4
- Bộ sách: ${bookSet}
- Bài học: ${topic} (${week}, ${period}, Thời lượng: ${duration})
- Hình thức tổ chức: ${organization}
- Yêu cầu riêng / phân hóa: ${specialRequirements || 'Phù hợp đa dạng đối tượng học sinh lớp 4, tích hợp trò chơi khởi động và vận dụng thực tiễn.'}

Yêu cầu cấu trúc JSON trả về đúng các trường:
{
  "title": "Kế hoạch bài dạy môn...",
  "subject": "${subject}",
  "bookSet": "${bookSet}",
  "grade": "Lớp 4",
  "week": "${week}",
  "period": "${period}",
  "topic": "${topic}",
  "duration": "${duration}",
  "requirements": {
    "competencies": {
      "specific": ["Năng lực đặc thù 1...", "Năng lực đặc thù 2..."],
      "general": ["Năng lực tự chủ và tự học...", "Năng lực giao tiếp và hợp tác...", "Năng lực giải quyết vấn đề và sáng tạo..."]
    },
    "qualities": ["Chăm chỉ...", "Trung thực...", "Trách nhiệm...", "Nhân ái..."]
  },
  "preparation": {
    "teacher": ["Kế hoạch bài dạy, bài giảng điện tử...", "Thiết bị, đồ dùng dạy học...", "Phiếu học tập..."],
    "student": ["Sách giáo khoa, vở ghi...", "Đồ dùng học tập..."]
  },
  "activities": [
    {
      "step": 1,
      "name": "Hoạt động 1: Khởi động (5 phút)",
      "goal": "Tạo tâm thế hứng thú, kết nối kiến thức cũ...",
      "teacherActivity": "Mô tả chi tiết lời dẫn, thao tác của GV...",
      "studentActivity": "Mô tả hành động, câu trả lời của HS...",
      "expectedProduct": "Sản phẩm / kết quả đạt được...",
      "assessment": "Phương pháp đánh giá..."
    },
    {
      "step": 2,
      "name": "Hoạt động 2: Khám phá / Hình thành kiến thức mới (12 phút)",
      "goal": "Học sinh chiếm lĩnh kiến thức...",
      "teacherActivity": "Tổ chức hoạt động dẫn dắt học sinh khám phá...",
      "studentActivity": "Học sinh thực hiện nhiệm vụ...",
      "expectedProduct": "Quy tắc, công thức hoặc kiến thức cốt lõi...",
      "assessment": "Quan sát, nhận xét..."
    },
    {
      "step": 3,
      "name": "Hoạt động 3: Luyện tập, thực hành (12 phút)",
      "goal": "Củng cố kĩ năng, rèn luyện bài tập phân hóa...",
      "teacherActivity": "Giao bài tập mức cơ bản và nâng cao...",
      "studentActivity": "Làm việc cá nhân, chia sẻ theo cặp/nhóm...",
      "expectedProduct": "Kết quả bài làm của học sinh...",
      "assessment": "Đánh giá đồng đẳng, giáo viên chốt đáp án..."
    },
    {
      "step": 4,
      "name": "Hoạt động 4: Vận dụng, trải nghiệm (6 phút)",
      "goal": "Vận dụng vào thực tiễn đời sống...",
      "teacherActivity": "Nêu tình huống thực tế...",
      "studentActivity": "Liên hệ bản thân, xử lý tình huống...",
      "expectedProduct": "Giải pháp hoặc liên hệ thực tế của học sinh...",
      "assessment": "Khen ngợi, khích lệ..."
    }
  ],
  "reflection": "Dự kiến các điểm cần lưu ý hoặc điều chỉnh sau tiết dạy...",
  "suggestedTeacherDialogue": "Lời dẫn gợi ý cho giáo viên ở các bước then chốt..."
}`;

    if (!ai) {
      // High quality fallback
      return res.json(getFallbackLessonPlan(subject, bookSet, topic, week, period));
    }

    const data = await callGemini(systemInstruction, prompt, true);
    res.json(data);
  } catch (err: any) {
    console.error('Error in lesson-plan API:', err);
    res.status(500).json({ error: err.message || 'Lỗi khi tạo giáo án bằng Gemini AI' });
  }
});

// 2. Phân hệ Xưởng tạo học liệu AI (Material Studio)
app.post('/api/ai/material', async (req, res) => {
  try {
    const {
      materialType = 'worksheet', // worksheet | exam | differentiated | rubric | mindmap | task_cards
      subject = 'Toán',
      topic = 'Các phép tính với phân số',
      grade = 'Lớp 4',
      levels = ['Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao'],
      questionCount = 6,
      versions = 1,
      extraNotes = ''
    } = req.body;

    const systemInstruction = `Bạn là chuyên gia kiểm tra đánh giá và thiết kế học liệu tiểu học Việt Nam chuẩn Chương trình GDPT 2018.
Tạo tài liệu học tập chính xác, thẩm mỹ, đúng lứa tuổi lớp 4.
Đối với môn Toán, các phép tính và phân số phải trình bày rõ ràng, không lỗi định dạng.
Trả về định dạng JSON thuần túy theo schema.`;

    const prompt = `Hãy thiết kế học liệu chi tiết:
- Thể loại: ${materialType}
- Môn: ${subject} ${grade}
- Chủ đề: ${topic}
- Các cấp độ tư duy: ${levels.join(', ')}
- Số lượng câu hỏi / mục: ${questionCount} câu
- Ghi chú thêm: ${extraNotes || 'Phù hợp học sinh lớp 4, lời văn thân thiện, kích thích tư duy, có đáp án và lời giải chi tiết.'}

Cấu trúc JSON yêu cầu:
{
  "title": "Tiêu đề học liệu...",
  "materialType": "${materialType}",
  "subject": "${subject}",
  "grade": "${grade}",
  "topic": "${topic}",
  "headerInfo": {
    "school": "Trường Tiểu học Khoái Châu 1",
    "class": "Lớp 4C",
    "subject": "${subject}",
    "timeLimit": "20 - 30 phút"
  },
  "instructions": "Hướng dẫn làm bài cho học sinh...",
  "sections": [
    {
      "title": "Phần I. Trắc nghiệm khách quan",
      "questions": [
        {
          "id": 1,
          "level": "Nhận biết",
          "content": "Nội dung câu hỏi...",
          "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
          "correctAnswer": "A",
          "explanation": "Lời giải thích ngắn gọn, dễ hiểu..."
        }
      ]
    },
    {
      "title": "Phần II. Tự luận / Vận dụng thực tiễn",
      "questions": [
        {
          "id": 2,
          "level": "Vận dụng",
          "content": "Bài toán thực tế...",
          "guide": "Gợi ý hoặc các bước giải...",
          "score": "2.0 điểm",
          "modelAnswer": "Bài giải chi tiết..."
        }
      ]
    }
  ],
  "rubric": [
    {"criterion": "Tính chính xác", "excellent": "Làm đúng toàn bộ...", "good": "Sai dưới 1 lỗi...", "needsImprovement": "Cần luyện tập thêm..."}
  ],
  "teacherNotes": "Lưu ý cho giáo viên khi phát phiếu / chấm bài..."
}`;

    if (!ai) {
      return res.json(getFallbackMaterial(materialType, subject, topic));
    }

    const data = await callGemini(systemInstruction, prompt, true);
    res.json(data);
  } catch (err: any) {
    console.error('Error in material API:', err);
    res.status(500).json({ error: err.message || 'Lỗi khi tạo học liệu bằng Gemini AI' });
  }
});

// 3. Phân hệ Trò chơi học tập tương tác (Games)
app.post('/api/ai/game-questions', async (req, res) => {
  try {
    const {
      gameType = 'millionaire', // millionaire | match | secret_doors | wheel | flashcard
      subject = 'Khoa học',
      topic = 'Nước và các thể của nước',
      count = 8
    } = req.body;

    const systemInstruction = `Bạn là chuyên gia gamification giáo dục tiểu học tại Việt Nam.
Tạo bộ câu hỏi trò chơi hấp dẫn, sôi nổi, chính xác khoa học và kiến thức SGK lớp 4.
Trả về dữ liệu JSON thuần túy phù hợp với từng định dạng trò chơi.`;

    const prompt = `Tạo bộ câu hỏi cho trò chơi "${gameType}" môn ${subject} lớp 4, chủ đề: "${topic}".
Số lượng: ${count} mục.

Nếu gameType = "millionaire" (Ai là triệu phú):
{
  "gameType": "millionaire",
  "title": "Trò chơi Ai Là Triệu Phú: ${topic}",
  "subject": "${subject}",
  "questions": [
    {
      "id": 1,
      "level": 1,
      "point": 100,
      "question": "Câu hỏi...",
      "options": ["A. Lựa chọn 1", "B. Lựa chọn 2", "C. Lựa chọn 3", "D. Lựa chọn 4"],
      "correctIndex": 0,
      "hint": "Gợi ý trợ giúp...",
      "funFact": "Kiến thức mở rộng thú vị..."
    }
  ]
}

Nếu gameType = "match" (Ghép đôi nối cột):
{
  "gameType": "match",
  "title": "Trò chơi Ghép Đôi: ${topic}",
  "pairs": [
    {"id": 1, "left": "Thuật ngữ / Khái niệm", "right": "Ý nghĩa / Đặc điểm tương ứng"}
  ]
}

Nếu gameType = "secret_doors" (Ô cửa bí mật):
{
  "gameType": "secret_doors",
  "title": "Trò chơi Ô Cửa Bí Mật: ${topic}",
  "secretKeyword": "Từ khóa ẩn sau bức tranh",
  "doors": [
    {"doorNumber": 1, "question": "Câu hỏi mở ô 1...", "answer": "Đáp án...", "revealedClue": "Mảnh ghép 1..."}
  ]
}

Nếu gameType = "wheel" (Vòng quay tri thức):
{
  "gameType": "wheel",
  "title": "Vòng Quay Tri Thức: ${topic}",
  "sectors": [
    {"id": 1, "label": "Câu 100đ", "points": 100, "question": "Câu hỏi...", "options": ["A", "B", "C", "D"], "correct": "A"}
  ]
}

Nếu gameType = "flashcard" (Thẻ ghi nhớ thông minh):
{
  "gameType": "flashcard",
  "title": "Bộ Flashcard: ${topic}",
  "cards": [
    {"id": 1, "front": "Câu hỏi / Khái niệm", "back": "Đáp án / Giải thích", "mnemonic": "Mẹo ghi nhớ vui vẻ"}
  ]
}`;

    if (!ai) {
      return res.json(getFallbackGame(gameType, subject, topic));
    }

    const data = await callGemini(systemInstruction, prompt, true);
    res.json(data);
  } catch (err: any) {
    console.error('Error in game API:', err);
    res.status(500).json({ error: err.message || 'Lỗi khi tạo trò chơi bằng Gemini AI' });
  }
});

// 4. Phân hệ Nhận xét đánh giá học sinh theo Thông tư 27 (Student Feedback)
app.post('/api/ai/student-feedback', async (req, res) => {
  try {
    const {
      studentName = 'Nguyễn Minh Quân',
      gender = 'nam',
      subject = 'Toán',
      term = 'Giữa học kì I',
      completionLevel = 'T', // T: Hoàn thành tốt, H: Hoàn thành, C: Chưa hoàn thành
      strengths = 'Nhanh nhẹn, tính toán chính xác, tích cực phát biểu',
      needsSupport = 'Trình bày còn hơi ẩu, đôi khi nhầm lẫn tên đơn vị đo',
      evidence = 'Bài kiểm tra giữa kì đạt 9 điểm, thường xuyên giải được bài toán mở rộng'
    } = req.body;

    const systemInstruction = `Bạn là chuyên gia hướng dẫn đánh giá học sinh tiểu học theo Thông tư 27/2020/TT-BGDĐT của Bộ Giáo dục và Đào tạo Việt Nam.
Nguyên tắc nhận xét:
- Động viên, khích lệ sự tiến bộ của học sinh;
- Nêu rõ ưu điểm nổi bật và biện pháp cụ thể giúp học sinh khắc phục hạn chế;
- Không dùng từ ngữ so sánh học sinh này với học sinh khác, không dùng từ ngữ mang tính tiêu cực, phê phán;
- Đúng chuẩn mực văn phong sư phạm Việt Nam, ngắn gọn, súc tích (dưới 50 từ đối với nhận xét vào sổ theo dõi/học bạ).`;

    const prompt = `Hãy soạn thảo lời nhận xét học sinh lớp 4:
- Tên học sinh: ${studentName} (${gender})
- Môn học: ${subject}
- Giai đoạn: ${term}
- Mức độ hoàn thành: ${completionLevel === 'T' ? 'Hoàn thành tốt' : completionLevel === 'H' ? 'Hoàn thành' : 'Chưa hoàn thành'}
- Ưu điểm thực tế: ${strengths}
- Điểm cần khắc phục: ${needsSupport}
- Minh chứng học tập: ${evidence}

Hãy trả về JSON với cấu trúc:
{
  "studentName": "${studentName}",
  "subject": "${subject}",
  "term": "${term}",
  "shortComment": "Lời nhận xét ngắn gọn dưới 40 từ chuẩn mực để nhập vào cổng CSDL ngành / vnEdu / SMAS...",
  "detailedComment": "Lời nhận xét chi tiết gửi cho phụ huynh và trao đổi với học sinh (khoảng 60-80 từ)...",
  "competencyFeedback": {
    "selfStudy": "Đánh giá về năng lực tự chủ và tự học...",
    "collaboration": "Đánh giá về năng lực giao tiếp và hợp tác...",
    "problemSolving": "Đánh giá về năng lực giải quyết vấn đề..."
  },
  "qualityFeedback": "Nhận xét về phẩm chất (chăm chỉ, trách nhiệm, nhân ái)...",
  "suggestedActionsForTeacher": "Biện pháp hỗ trợ giáo viên nên áp dụng...",
  "suggestedActionsForParents": "Lời khuyên phối hợp cùng gia đình..."
}`;

    if (!ai) {
      return res.json(getFallbackFeedback(studentName, subject, term, completionLevel, strengths, needsSupport));
    }

    const data = await callGemini(systemInstruction, prompt, true);
    res.json(data);
  } catch (err: any) {
    console.error('Error in student feedback API:', err);
    res.status(500).json({ error: err.message || 'Lỗi khi tạo nhận xét học sinh' });
  }
});

// 5. Phân hệ Chatbot học tập (Teacher Assistant & Grade 4 AI Tutor)
app.post('/api/ai/chat', async (req, res) => {
  try {
    const {
      persona = 'teacher_assistant', // 'teacher_assistant' | 'grade4_tutor'
      subject = 'Toán',
      message = '',
      conversationHistory = []
    } = req.body;

    let systemInstruction = '';
    if (persona === 'grade4_tutor') {
      systemInstruction = `Bạn là "Bé Ong Chăm Chỉ" - Gia sư AI thân thiện, thông minh dành riêng cho học sinh Lớp 4 (9-10 tuổi) tại Việt Nam.
Quy tắc tương tác với học sinh:
- Luôn xưng hô "Thầy/Cô Bé Ong" hoặc "Bé Ong" và gọi em là "bạn nhỏ", "học trò ngoan" hoặc tên bạn ấy;
- Dùng giọng điệu vui tươi, khích lệ, nhiều biểu tượng cảm xúc gần gũi 🐝 ⭐ 🌱;
- QUAN TRỌNG: TUYỆT ĐỐI KHÔNG làm bài tập giải sẵn nguyên xi cho học sinh. Hãy áp dụng phương pháp gợi mở từng bước (Socratic): khen ngợi nỗ lực -> hỏi lại kiến thức nền -> gợi ý từng bước nhỏ -> khuyến khích em tự rút ra đáp án;
- Nếu học sinh hỏi kiến thức chưa phù hợp lứa tuổi hoặc nhạy cảm, nhẹ nhàng chuyển hướng về bài học;
- Sử dụng tiếng Việt chuẩn mực, rõ ràng, giàu hình ảnh.`;
    } else {
      systemInstruction = `Bạn là Trợ lý AI Cấp cao dành cho Giáo viên Lớp 4 tại Việt Nam, đồng hành cùng cô giáo Phạm Thị Tính - Trường Tiểu học Khoái Châu 1.
Chuyên môn của bạn:
- Nắm vững Chương trình Giáo dục Phổ thông 2018 (sách Kết nối tri thức, Cánh diều, Chân trời sáng tạo);
- Tư vấn phương pháp dạy học tích cực (trò chơi học tập, khăn trải bàn, mảnh ghép, sơ đồ tư duy);
- Xử lý tình huống sư phạm tiểu học khéo léo, giàu yêu thương và tôn trọng học sinh;
- Thiết kế hoạt động phân hóa cho học sinh giỏi và học sinh cần hỗ trợ;
- Văn phong sư phạm chuẩn mực, ấm áp, thực tế, mạch lạc.`;
    }

    const contextPrompt = `Môn học đang quan tâm: ${subject}
Câu hỏi / yêu cầu hiện tại: ${message}`;

    if (!ai) {
      const fallbackReply = persona === 'grade4_tutor'
        ? `Chào bạn nhỏ ngoan của Bé Ong! 🐝 Về môn ${subject}, Bé Ong rất vui được học cùng bạn! Hãy thử đọc lại đề bài xem chúng mình đã có những dữ kiện nào rồi nhỉ? Bạn đã thử làm đến bước nào rồi, kể cho Bé Ong nghe nhé! ⭐`
        : `Chào cô giáo! Đối với bài học môn ${subject} này, em xin gợi ý cô có thể mở đầu bằng trò chơi "Khởi động nhanh 3 phút" hoặc sử dụng phương pháp thảo luận nhóm đôi để kích hoạt sự tò mò của học sinh lớp 4. Cô cần em hỗ trợ chi tiết hoạt động nào (Khám phá, Luyện tập hay Vận dụng) không ạ?`;
      return res.json({ reply: fallbackReply });
    }

    const reply = await callGemini(systemInstruction, contextPrompt, false);
    res.json({ reply });
  } catch (err: any) {
    console.error('Error in chat API:', err);
    res.status(500).json({ error: err.message || 'Lỗi xử lý chatbot' });
  }
});

// 6. AI Command Center - Router tự nhiên
app.post('/api/ai/quick-command', async (req, res) => {
  try {
    const { promptText = '' } = req.body;

    const systemInstruction = `Bạn là bộ não điều phối AI Command Center cho ứng dụng Trợ Lý Giáo Viên Lớp 4.
Phân tích yêu cầu tự nhiên của giáo viên và phân loại vào 1 trong các phân hệ:
1. "lesson_plan": Soạn giáo án, kế hoạch bài dạy
2. "material": Tạo phiếu học tập, đề thi, bài tập
3. "game": Tạo trò chơi học tập (Ai là triệu phú, ghép đôi, ô cửa, vòng quay)
4. "feedback": Nhận xét học sinh
5. "chat": Trao đổi, hỏi đáp sư phạm
6. "classroom": Quản lý lớp học, điểm danh, giao bài

Trả về JSON:
{
  "action": "lesson_plan" | "material" | "game" | "feedback" | "chat" | "classroom",
  "subject": "Toán" | "Tiếng Việt" | "Khoa học" | "Lịch sử và Địa lí" | "Đạo đức" | "Công nghệ" | "Tin học" | "Hoạt động trải nghiệm",
  "topic": "Chủ đề bài học trích xuất được",
  "summary": "Tóm tắt ý định của giáo viên",
  "suggestedParams": {}
}`;

    if (!ai) {
      let action = 'lesson_plan';
      const lower = promptText.toLowerCase();
      if (lower.includes('phiếu') || lower.includes('đề') || lower.includes('bài tập')) action = 'material';
      else if (lower.includes('trò chơi') || lower.includes('game') || lower.includes('triệu phú')) action = 'game';
      else if (lower.includes('nhận xét') || lower.includes('đánh giá')) action = 'feedback';
      else if (lower.includes('hỏi') || lower.includes('tư vấn')) action = 'chat';

      return res.json({
        action,
        subject: lower.includes('tiếng việt') ? 'Tiếng Việt' : lower.includes('khoa học') ? 'Khoa học' : 'Toán',
        topic: promptText || 'Bài học lớp 4',
        summary: `Thực hiện yêu cầu: ${promptText}`,
        suggestedParams: {}
      });
    }

    const data = await callGemini(systemInstruction, `Yêu cầu của giáo viên: "${promptText}"`, true);
    res.json(data);
  } catch (err: any) {
    console.error('Error in quick-command API:', err);
    res.status(500).json({ error: err.message || 'Lỗi điều phối câu lệnh AI' });
  }
});

// Fallback high-fidelity sample data generators when offline/mock
function getFallbackLessonPlan(subject: string, bookSet: string, topic: string, week: string, period: string) {
  return {
    title: `Kế hoạch bài dạy môn ${subject} lớp 4`,
    subject,
    bookSet,
    grade: 'Lớp 4',
    week,
    period,
    topic,
    duration: '35 phút',
    requirements: {
      competencies: {
        specific: [
          `Hình thành và phát triển năng lực tư duy toán học thông qua bài học "${topic}".`,
          `Thực hành thành thạo các quy tắc và tính toán chính xác, biết trình bày bài khoa học.`
        ],
        general: [
          'Năng lực tự chủ và tự học: Tự giác hoàn thành các nhiệm vụ cá nhân trên phiếu học tập.',
          'Năng lực giao tiếp và hợp tác: Tích cực thảo luận cặp đôi, chia sẻ cách làm trước lớp.',
          'Năng lực giải quyết vấn đề và sáng tạo: Vận dụng kiến thức bài học để giải quyết tình huống thực tế.'
        ]
      },
      qualities: [
        'Chăm chỉ: Có tinh thần kiên trì, cẩn thận trong từng phép tính.',
        'Trách nhiệm: Có ý thức giữ gìn sách vở, hợp tác tốt với bạn bè.'
      ]
    },
    preparation: {
      teacher: [
        'Kế hoạch bài dạy chi tiết, bài giảng tương tác trên máy chiếu.',
        'Bộ thẻ số, phiếu học tập nhóm, vòng quay trò chơi tri thức.',
        'Phần thưởng ngôi sao tích cực cho các nhóm học sinh.'
      ],
      student: [
        'Sách giáo khoa, vở bài tập môn ' + subject + ' lớp 4.',
        'Bút chì, thước kẻ, bảng con, bút dạ.'
      ]
    },
    activities: [
      {
        step: 1,
        name: 'Hoạt động 1: Khởi động - Trò chơi "Tiếp sức tri thức" (5 phút)',
        goal: 'Tạo không khí lớp học hào hứng, ôn tập kiến thức nền liên quan đến bài mới.',
        teacherActivity: 'GV phổ biến luật chơi: 2 đội thi đua nối tiếp viết nhanh kết quả các phép tính trên bảng. GV nhận xét, tuyên dương và dẫn dắt vào bài mới.',
        studentActivity: 'HS tích cực tham gia chơi tiếp sức theo tổ. Cả lớp cổ vũ sôi nổi và quan sát, nhận xét bài bạn.',
        expectedProduct: 'Bảng con hoàn thành chính xác 100% các câu hỏi khởi động.',
        assessment: 'GV quan sát tinh thần học tập và tính chính xác, tặng hoa điểm mười.'
      },
      {
        step: 2,
        name: 'Hoạt động 2: Khám phá - Hình thành kiến thức mới (12 phút)',
        goal: 'Học sinh tự khám phá quy tắc và xây dựng kiến thức bài ' + topic + '.',
        teacherActivity: 'GV trình chiếu tình huống thực tế từ cuộc sống. Hướng dẫn học sinh phân tích đề, đặt câu hỏi gợi mở: "Để giải bài toán này, chúng ta cần thực hiện phép tính gì?".',
        studentActivity: 'HS thảo luận theo nhóm bàn (cặp đôi), sử dụng đồ dùng trực quan hoặc nháp để tìm phương án giải.',
        expectedProduct: 'HS nêu được quy tắc tính và cách trình bày chuẩn mực vào vở.',
        assessment: 'Đánh giá qua câu trả lời miệng và sản phẩm nháp của các nhóm.'
      },
      {
        step: 3,
        name: 'Hoạt động 3: Luyện tập, thực hành phân hóa (12 phút)',
        goal: 'Rèn luyện kĩ năng từ mức độ Nhận biết đến Vận dụng, hỗ trợ kịp thời HS còn lúng túng.',
        teacherActivity: 'GV giao bài tập: Bài 1 (cơ bản làm cá nhân), Bài 2 (vận dụng làm vào vở), Bài 3 (mở rộng dành cho nhóm nhanh). GV đi quanh lớp bao quát, hướng dẫn riêng HS yếu.',
        studentActivity: 'HS làm bài độc lập vào vở. Đổi chéo vở kiểm tra kết quả cùng bạn cùng bàn.',
        expectedProduct: 'Vở bài tập sạch đẹp, trình bày khoa học, đúng quy trình.',
        assessment: 'GV chấm chữa trực tiếp một số bài, nhận xét kịp thời theo Thông tư 27.'
      },
      {
        step: 4,
        name: 'Hoạt động 4: Vận dụng - Em là nhà toán học nhí (6 phút)',
        goal: 'Kết nối kiến thức đã học vào tình huống thực tế trong gia đình hoặc trường học.',
        teacherActivity: 'GV đưa tình huống: "Mẹ nhờ em tính tiền mua dụng cụ học tập...". Yêu cầu học sinh chia sẻ giải pháp.',
        studentActivity: 'HS hào hứng xung phong đóng vai giải quyết tình huống thực tế.',
        expectedProduct: 'Câu trả lời thông minh, thực tế và gắn liền với đời sống hàng ngày.',
        assessment: 'Khen ngợi tinh thần sáng tạo, trao biểu tượng "Bàn tay vàng tính toán".'
      }
    ],
    reflection: 'Học sinh nắm bài tốt, hào hứng với hoạt động nhóm. Cần lưu ý nhắc một số em trình bày thẳng cột phép tính.',
    suggestedTeacherDialogue: 'Lời dẫn gợi cảm: "Các con thân mến, toán học không hề khô khan mà luôn ẩn chứa những điều kì diệu quanh ta. Hôm nay, cô trò mình cùng trở thành những nhà thám hiểm tài ba nhé!"'
  };
}

function getFallbackMaterial(type: string, subject: string, topic: string) {
  return {
    title: `Phiếu Học Tập Tương Tác: ${topic}`,
    materialType: type,
    subject,
    grade: 'Lớp 4',
    topic,
    headerInfo: {
      school: 'Trường Tiểu học Khoái Châu 1',
      class: 'Lớp 4C',
      subject,
      timeLimit: '25 phút'
    },
    instructions: 'Em hãy đọc kĩ đề bài, suy nghĩ cẩn thận và hoàn thành các bài tập dưới đây. Chúc em làm bài thật tốt!',
    sections: [
      {
        title: 'Phần I. Trắc nghiệm (4.0 điểm - Chọn câu trả lời đúng)',
        questions: [
          {
            id: 1,
            level: 'Nhận biết',
            content: `Trong bài học "${topic}", phát biểu nào sau đây là chính xác nhất?`,
            options: [
              'A. Quy tắc được áp dụng theo thứ tự từ trái sang phải',
              'B. Không cần thực hiện theo các bước',
              'C. Kết quả luôn bằng 0',
              'D. Chỉ áp dụng cho số tự nhiên chẵn'
            ],
            correctAnswer: 'A',
            explanation: 'Theo quy ước kiến thức SGK lớp 4, chúng ta luôn thực hiện phép tính theo đúng thứ tự ưu tiên từ trái sang phải.'
          },
          {
            id: 2,
            level: 'Thông hiểu',
            content: `Phân số nào sau đây bằng phân số 3/4?`,
            options: [
              'A. 6/8',
              'B. 9/15',
              'C. 5/6',
              'D. 12/20'
            ],
            correctAnswer: 'A',
            explanation: 'Khi nhân cả tử số và mẫu số của 3/4 với 2, ta được phân số bằng nó là: (3 x 2)/(4 x 2) = 6/8.'
          }
        ]
      },
      {
        title: 'Phần II. Tự luận & Vận dụng thực tiễn (6.0 điểm)',
        questions: [
          {
            id: 3,
            level: 'Vận dụng',
            content: 'Một mảnh vườn hình chữ nhật có chiều dài 24m, chiều rộng bằng 2/3 chiều dài. Tính diện tích mảnh vườn đó.',
            guide: 'Bước 1: Tìm chiều rộng mảnh vườn (24 x 2 : 3). Bước 2: Tính diện tích (Dài x Rộng).',
            score: '3.0 điểm',
            modelAnswer: 'Chiều rộng mảnh vườn là: 24 x 2 : 3 = 16 (m).\nDiện tích mảnh vườn là: 24 x 16 = 384 (m²).\nĐáp số: 384 m².'
          },
          {
            id: 4,
            level: 'Vận dụng cao',
            content: 'Bác nông dân thu hoạch được 350 kg cam. Ngày thứ nhất bác bán được 2/5 số cam. Ngày thứ hai bác bán được số cam bằng 3/4 ngày thứ nhất. Hỏi sau hai ngày bác còn lại bao nhiêu ki-lô-gam cam?',
            guide: 'Tính số cam ngày 1 -> Tính số cam ngày 2 -> Tính tổng 2 ngày -> Lấy tổng trừ đi.',
            score: '3.0 điểm',
            modelAnswer: 'Số cam ngày thứ nhất bán được là: 350 x 2 : 5 = 140 (kg).\nSố cam ngày thứ hai bán được là: 140 x 3 : 4 = 105 (kg).\nSố cam còn lại là: 350 - (140 + 105) = 105 (kg).\nĐáp số: 105 kg cam.'
          }
        ]
      }
    ],
    rubric: [
      { criterion: 'Kĩ năng tính toán', excellent: 'Tính chính xác 100%, ghi rõ đơn vị', good: 'Sai không quá 1 phép tính nhỏ', needsImprovement: 'Cần chú ý cẩn thận khi nhân chia' },
      { criterion: 'Trình bày bài giải', excellent: 'Chữ viết sạch đẹp, lời giải mạch lạc', good: 'Trình bày rõ ràng, đôi chỗ tẩy xóa nhẹ', needsImprovement: 'Cần viết lời giải đầy đủ' }
    ],
    teacherNotes: 'Giáo viên hướng dẫn học sinh đọc kĩ bài 4, khích lệ các em vẽ sơ đồ đoạn thẳng để dễ hình dung bài toán.'
  };
}

function getFallbackGame(gameType: string, subject: string, topic: string) {
  if (gameType === 'match') {
    return {
      gameType: 'match',
      title: `Trò chơi Ghép Đôi: ${topic}`,
      subject,
      pairs: [
        { id: 1, left: 'Phân số tối giản', right: 'Tử số và mẫu số không cùng chia hết cho số nào lớn hơn 1' },
        { id: 2, left: 'Hình bình hành', right: 'Có hai cặp cạnh đối diện song song và bằng nhau' },
        { id: 3, left: 'Hình thoi', right: 'Có bốn cạnh bằng nhau và hai đường chéo vuông góc' },
        { id: 4, left: 'Số trung bình cộng', right: 'Tổng các số chia cho số các số hạng' }
      ]
    };
  }

  if (gameType === 'secret_doors') {
    return {
      gameType: 'secret_doors',
      title: `Ô Cửa Bí Mật: ${topic}`,
      secretKeyword: 'VÒNG TUẦN HOÀN CỦA NƯỚC',
      doors: [
        { doorNumber: 1, question: 'Hiện tượng nước chuyển từ thể lỏng sang thể khí gọi là gì?', answer: 'Sự bay hơi', revealedClue: 'Mảnh ghép: Ánh nắng mặt trời làm ấm mặt nước' },
        { doorNumber: 2, question: 'Hiện tượng hơi nước chuyển thành các giọt nước nhỏ gọi là gì?', answer: 'Sự ngưng tụ', revealedClue: 'Mảnh ghép: Mây trắng tích tụ trên bầu trời' },
        { doorNumber: 3, question: 'Nước ở thể rắn tồn tại dưới dạng nào?', answer: 'Nước đá / Băng tuyết', revealedClue: 'Mảnh ghép: Đỉnh núi tuyết phủ' },
        { doorNumber: 4, question: 'Nước mưa sau khi rơi xuống đất sẽ chảy đi đâu?', answer: 'Chảy ra ao, hồ, sông, suối và thấm vào lòng đất', revealedClue: 'Mảnh ghép: Dòng sông uốn lượn trở về biển cả' }
      ]
    };
  }

  if (gameType === 'wheel') {
    return {
      gameType: 'wheel',
      title: `Vòng Quay Tri Thức: ${topic}`,
      sectors: [
        { id: 1, label: '100 Điểm', points: 100, question: 'Số 45 670 có chữ số hàng nghìn là mấy?', options: ['A. 4', 'B. 5', 'C. 6', 'D. 7'], correct: 'B' },
        { id: 2, label: '200 Điểm', points: 200, question: '1 thế kỉ bằng bao nhiêu năm?', options: ['A. 10 năm', 'B. 50 năm', 'C. 100 năm', 'D. 1000 năm'], correct: 'C' },
        { id: 3, label: 'May Mắn +50đ', points: 50, question: 'Góc bẹt bằng bao nhiêu góc vuông?', options: ['A. 1', 'B. 2', 'C. 3', 'D. 4'], correct: 'B' },
        { id: 4, label: '300 Điểm', points: 300, question: 'Kết quả của phép tính: 25 x 4 = ?', options: ['A. 100', 'B. 80', 'C. 120', 'D. 90'], correct: 'A' },
        { id: 5, label: 'Thử Thách 500đ', points: 500, question: 'Trung bình cộng của 20 và 40 là bao nhiêu?', options: ['A. 25', 'B. 30', 'C. 35', 'D. 60'], correct: 'B' },
        { id: 6, label: 'Nhân Đôi Điểm', points: 400, question: 'Tên trường tiểu học của lớp 4C là gì?', options: ['A. TH Khoái Châu 1', 'B. TH Khoái Châu 2', 'C. TH Ba Đình', 'D. TH Dịch Vọng'], correct: 'A' }
      ]
    };
  }

  if (gameType === 'flashcard') {
    return {
      gameType: 'flashcard',
      title: `Thẻ Ghi Nhớ Nhanh: ${topic}`,
      cards: [
        { id: 1, front: 'Nước có những tính chất gì?', back: 'Nước là chất lỏng trong suốt, không màu, không mùi, không vị, không có hình dạng nhất định, chảy từ cao xuống thấp và lan ra khắp phía.', mnemonic: 'Mẹo nhớ: "4 Không - 2 Chảy" (Không màu, mùi, vị, hình; Chảy dốc & lan)' },
        { id: 2, front: 'Ba thể của nước trong tự nhiên là gì?', back: 'Thể lỏng (nước thường), Thể khí (hơi nước), Thể rắn (băng đá).', mnemonic: 'Mẹo nhớ: Nước uống - Hơi sương - Đá lạnh' },
        { id: 3, front: 'Tại sao cần phải tiết kiệm nước sạch?', back: 'Vì nguồn nước ngọt dùng được trên Trái Đất có hạn, nước rất quý giá đối với sự sống của con người, động vật và thực vật.', mnemonic: 'Khẩu hiệu: "Khóa chặt vòi nước - Tiết kiệm từng giọt"' }
      ]
    };
  }

  // Default: millionaire
  return {
    gameType: 'millionaire',
    title: `Ai Là Triệu Phú Tri Thức: ${topic}`,
    subject,
    questions: [
      {
        id: 1,
        level: 1,
        point: 100,
        question: 'Muốn tìm số trung bình cộng của nhiều số, ta làm thế nào?',
        options: [
          'A. Lấy tổng các số chia cho số các số hạng',
          'B. Lấy số lớn nhất cộng số bé nhất',
          'C. Lấy tích các số chia cho 2',
          'D. Lấy số đầu tiên trừ số cuối cùng'
        ],
        correctIndex: 0,
        hint: 'Hãy nhớ lại công thức: (a + b + c) : 3',
        funFact: 'Số trung bình cộng giúp chúng ta ước lượng nhanh giá trị đại diện cho một tập hợp dữ liệu!'
      },
      {
        id: 2,
        level: 2,
        point: 200,
        question: 'Dãy số nào dưới đây gồm các số tự nhiên chẵn liên tiếp?',
        options: [
          'A. 10; 12; 14; 16',
          'B. 1; 3; 5; 7',
          'C. 2; 5; 8; 11',
          'D. 10; 20; 30; 45'
        ],
        correctIndex: 0,
        hint: 'Các số chẵn có chữ số tận cùng là 0, 2, 4, 6, 8.',
        funFact: 'Hai số chẵn liên tiếp luôn hơn kém nhau 2 đơn vị.'
      },
      {
        id: 3,
        level: 3,
        point: 500,
        question: 'Năm 1010, vua Lý Thái Tổ dời đô về Thăng Long. Năm đó thuộc thế kỉ nào?',
        options: [
          'A. Thế kỉ X',
          'B. Thế kỉ XI',
          'C. Thế kỉ XII',
          'D. Thế kỉ IX'
        ],
        correctIndex: 1,
        hint: 'Từ năm 1001 đến năm 1100 là thế kỉ thứ 11 (XI).',
        funFact: 'Năm 2010, thủ đô Hà Nội đã tổ chức Đại lễ kỉ niệm 1000 năm Thăng Long - Hà Nội!'
      },
      {
        id: 4,
        level: 4,
        point: 1000,
        question: 'Bác Hồ đọc bản Tuyên ngôn Độc lập khai sinh ra nước Việt Nam Dân chủ Cộng hòa vào ngày tháng năm nào?',
        options: [
          'A. 02/09/1945',
          'B. 19/08/1945',
          'C. 30/04/1975',
          'D. 07/05/1954'
        ],
        correctIndex: 0,
        hint: 'Ngày Quốc khánh của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.',
        funFact: 'Quảng trường Ba Đình lịch sử là nơi Bác Hồ đã đọc bản Tuyên ngôn Độc lập thiêng liêng.'
      },
      {
        id: 5,
        level: 5,
        point: 2000,
        question: 'Một hình chữ nhật có chu vi 40cm, chiều dài hơn chiều rộng 4cm. Diện tích hình chữ nhật đó là:',
        options: [
          'A. 96 cm²',
          'B. 84 cm²',
          'C. 100 cm²',
          'D. 160 cm²'
        ],
        correctIndex: 0,
        hint: 'Nửa chu vi = 20cm. Chiều dài = (20 + 4) : 2 = 12cm, Chiều rộng = 8cm.',
        funFact: 'Diện tích = Dài x Rộng = 12 x 8 = 96 cm².'
      }
    ]
  };
}

function getFallbackFeedback(studentName: string, subject: string, term: string, level: string, strengths: string, needsSupport: string) {
  const isTop = level === 'T';
  return {
    studentName,
    subject,
    term,
    shortComment: isTop
      ? `Em nắm vững kiến thức, kĩ năng tính toán nhanh và chuẩn xác. Chăm chỉ, tích cực tương tác trong giờ học.`
      : `Em có nhiều cố gắng, hoàn thành cơ bản nội dung bài học. Cần cẩn thận hơn khi trình bày và luyện tập thêm.`,
    detailedComment: isTop
      ? `Trong đợt học tập ${term}, em ${studentName} thể hiện sự tiến bộ rõ nét môn ${subject}. Em ${strengths}. Cô khen ngợi tinh thần tự giác của em và khích lệ em tiếp tục duy trì thành tích tốt này!`
      : `Em ${studentName} có ý thức học tập, ngoan ngoãn và biết lắng nghe. Em ${strengths}. Tuy nhiên, ${needsSupport}. Cô mong em thường xuyên rèn luyện thêm ở nhà để ngày càng tự tin hơn.`,
    competencyFeedback: {
      selfStudy: isTop ? 'Có khả năng tự hoàn thành bài tập tốt, biết tự kiểm tra kết quả.' : 'Biết chuẩn bị bài nhưng cần người lớn nhắc nhở thêm thời gian làm bài.',
      collaboration: 'Hòa đồng, biết lắng nghe ý kiến của bạn bè khi hoạt động nhóm.',
      problemSolving: isTop ? 'Tư duy logic tốt, biết vận dụng công thức giải quyết bài toán thực tế.' : 'Hiểu bài ở mức cơ bản, cần thêm thời gian tư duy các bài toán nhiều bước.'
    },
    qualityFeedback: 'Trung thực, chăm chỉ đến lớp đúng giờ, lễ phép với thầy cô và thân thiện với bạn bè.',
    suggestedActionsForTeacher: `Tăng cường giao thêm các bài tập mở rộng phát triển năng lực; tiếp tục khích lệ sự tự tin của em ${studentName}.`,
    suggestedActionsForParents: `Gia đình tiếp tục động viên tinh thần tự học của con mỗi ngày 15-20 phút, cùng con chia sẻ niềm vui học tập.`
  };
}

// Development or Production Vite handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 EdTech Server "Trợ Lý AI Cho Giáo Viên Lớp 4" running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
