import {
  TeacherProfile,
  Student,
  LessonPlan,
  LearningMaterial,
  InteractiveGame,
  StudentFeedback,
  Assignment,
  AssignmentSubmission,
  ActivityLog
} from '../types';

const STORAGE_KEYS = {
  PROFILE: 'troly_gv4_profile',
  STUDENTS: 'troly_gv4_students',
  LESSON_PLANS: 'troly_gv4_lesson_plans',
  MATERIALS: 'troly_gv4_materials',
  GAMES: 'troly_gv4_games',
  FEEDBACKS: 'troly_gv4_feedbacks',
  ASSIGNMENTS: 'troly_gv4_assignments',
  SUBMISSIONS: 'troly_gv4_submissions',
  LOGS: 'troly_gv4_logs',
  INITIALIZED: 'troly_gv4_initialized_v2'
};

export const defaultProfile: TeacherProfile = {
  name: 'Phạm Thị Tính',
  title: 'Giáo viên Tiểu học Hạng II',
  school: 'Trường Tiểu học Khoái Châu 1',
  district: 'Huyện Khoái Châu',
  province: 'Tỉnh Hưng Yên',
  className: '4C',
  academicYear: '2025 - 2026',
  mainSubject: 'Toán, Tiếng Việt & Khoa học 4',
  defaultBookSet: 'Kết nối tri thức với cuộc sống',
  avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
  bio: 'Tận tâm, sáng tạo và luôn tiên phong ứng dụng công nghệ số, trí tuệ nhân tạo Gemini để khơi dậy niềm đam mê học tập của học trò lớp 4.'
};

export const defaultStudents: Student[] = [
  { id: 'hs-01', code: 'HS01', name: 'Nguyễn Minh Quân', gender: 'nam', team: 'Tổ 1', attendanceStatus: 'present', mathLevel: 'T', vietnameseLevel: 'T', strengths: 'Tư duy logic nhạy bén, tính toán nhanh', needsSupport: 'Cần cẩn thận hơn khi vẽ hình', totalPoints: 120, badges: ['Toán học nhí', 'Sao chăm chỉ'] },
  { id: 'hs-02', code: 'HS02', name: 'Trần Bảo Anh', gender: 'nữ', team: 'Tổ 1', attendanceStatus: 'present', mathLevel: 'T', vietnameseLevel: 'T', strengths: 'Chữ viết nắn nót, diễn đạt lưu loát', needsSupport: 'Đôi khi còn rụt rè khi phát biểu lớn', totalPoints: 135, badges: ['Vở sạch chữ đẹp', 'Đọc diễn cảm'] },
  { id: 'hs-03', code: 'HS03', name: 'Lê Gia Huy', gender: 'nam', team: 'Tổ 1', attendanceStatus: 'present', mathLevel: 'H', vietnameseLevel: 'H', strengths: 'Nhanh nhẹn, nhiệt tình giúp đỡ bạn', needsSupport: 'Cần tập trung hơn trong giờ tự học', totalPoints: 95, badges: ['Đồng đội nhiệt tình'] },
  { id: 'hs-04', code: 'HS04', name: 'Hoàng Thùy Dương', gender: 'nữ', team: 'Tổ 1', attendanceStatus: 'present', mathLevel: 'T', vietnameseLevel: 'T', strengths: 'Học đều các môn, năng nổ hoạt động nhóm', needsSupport: 'Phát huy thêm sự tự tin khi thuyết trình', totalPoints: 140, badges: ['Thủ lĩnh nhóm', 'Bông hoa điểm mười'] },
  { id: 'hs-05', code: 'HS05', name: 'Vũ Đức Duy', gender: 'nam', team: 'Tổ 1', attendanceStatus: 'present', mathLevel: 'H', vietnameseLevel: 'H', strengths: 'Thích khám phá khoa học, sáng tạo', needsSupport: 'Cần ghi nhớ công thức toán kĩ hơn', totalPoints: 90, badges: ['Nhà thám hiểm nhí'] },
  { id: 'hs-06', code: 'HS06', name: 'Đỗ Quỳnh Chi', gender: 'nữ', team: 'Tổ 2', attendanceStatus: 'present', mathLevel: 'T', vietnameseLevel: 'T', strengths: 'Giọng đọc truyền cảm, giàu cảm xúc', needsSupport: 'Rèn thêm kĩ năng làm toán có lời văn', totalPoints: 125, badges: ['Giọng đọc vàng'] },
  { id: 'hs-07', code: 'HS07', name: 'Phạm Tuấn Khang', gender: 'nam', team: 'Tổ 2', attendanceStatus: 'present', mathLevel: 'T', vietnameseLevel: 'H', strengths: 'Thông minh, tiếp thu bài nhanh', needsSupport: 'Trình bày vở cần sạch đẹp hơn', totalPoints: 110, badges: ['Tư duy nhanh'] },
  { id: 'hs-08', code: 'HS08', name: 'Bùi Mai Phương', gender: 'nữ', team: 'Tổ 2', attendanceStatus: 'present', mathLevel: 'H', vietnameseLevel: 'T', strengths: 'Chăm chỉ, lễ phép, viết văn mạch lạc', needsSupport: 'Cần tự tin hơn trong các bài toán chia', totalPoints: 105, badges: ['Sao chăm chỉ'] },
  { id: 'hs-09', code: 'HS09', name: 'Ngô Quốc Bảo', gender: 'nam', team: 'Tổ 2', attendanceStatus: 'present', mathLevel: 'H', vietnameseLevel: 'H', strengths: 'Khéo tay, vẽ tranh minh họa đẹp', needsSupport: 'Cần đọc kĩ yêu cầu đề bài trước khi làm', totalPoints: 85, badges: ['Họa sĩ nhí'] },
  { id: 'hs-10', code: 'HS10', name: 'Dương Khánh Linh', gender: 'nữ', team: 'Tổ 2', attendanceStatus: 'present', mathLevel: 'T', vietnameseLevel: 'T', strengths: 'Tự giác hoàn thành bài tập, có tinh thần tương trợ', needsSupport: 'Cần phân bố thời gian làm bài cân đối', totalPoints: 130, badges: ['Bạn tốt lớp 4C'] },
  { id: 'hs-11', code: 'HS11', name: 'Lý Trọng Tấn', gender: 'nam', team: 'Tổ 3', attendanceStatus: 'present', mathLevel: 'H', vietnameseLevel: 'C', strengths: 'Thật thà, hòa đồng, vâng lời thầy cô', needsSupport: 'Cần luyện đọc trôi chảy và mở rộng vốn từ', totalPoints: 75, badges: ['Tiến bộ từng ngày'] },
  { id: 'hs-12', code: 'HS12', name: 'Chu Ngọc Hân', gender: 'nữ', team: 'Tổ 3', attendanceStatus: 'present', mathLevel: 'T', vietnameseLevel: 'T', strengths: 'Nhanh nhẹn, ghi nhớ tốt các mốc lịch sử', needsSupport: 'Giữ vở sạch chữ đẹp hơn nữa', totalPoints: 115, badges: ['Sử gia nhí'] },
  { id: 'hs-13', code: 'HS13', name: 'Đặng Đình Phong', gender: 'nam', team: 'Tổ 3', attendanceStatus: 'present', mathLevel: 'T', vietnameseLevel: 'T', strengths: 'Rất hào hứng với các trò chơi ôn tập AI', needsSupport: 'Cần chú ý lắng nghe bạn nhận xét', totalPoints: 120, badges: ['Vua trò chơi học tập'] },
  { id: 'hs-14', code: 'HS14', name: 'Phan Cẩm Ly', gender: 'nữ', team: 'Tổ 3', attendanceStatus: 'present', mathLevel: 'H', vietnameseLevel: 'H', strengths: 'Hiền lành, cẩn thận, biết nhận lỗi', needsSupport: 'Cần luyện tập thêm các dạng toán tìm x', totalPoints: 90, badges: ['Chăm ngoan'] },
  { id: 'hs-15', code: 'HS15', name: 'Vũ Hải Nam', gender: 'nam', team: 'Tổ 3', attendanceStatus: 'present', mathLevel: 'H', vietnameseLevel: 'H', strengths: 'Thích các bài thực hành công nghệ, tin học', needsSupport: 'Cần rèn luyện tính kiên nhẫn', totalPoints: 88, badges: ['Kĩ sư nhí'] },
  { id: 'hs-16', code: 'HS16', name: 'Tạ Minh Anh', gender: 'nữ', team: 'Tổ 4', attendanceStatus: 'present', mathLevel: 'T', vietnameseLevel: 'T', strengths: 'Học lực xuất sắc, tổ chức nhóm tốt', needsSupport: 'Khích lệ em hướng dẫn thêm cho bạn', totalPoints: 145, badges: ['Sao xuất sắc', 'Trợ giảng nhí'] },
  { id: 'hs-17', code: 'HS17', name: 'Nguyễn Hữu Đạt', gender: 'nam', team: 'Tổ 4', attendanceStatus: 'present', mathLevel: 'H', vietnameseLevel: 'H', strengths: 'Năng động, tích cực phát biểu xây dựng bài', needsSupport: 'Tránh vội vàng khi tính nhẩm', totalPoints: 95, badges: ['Hăng hái'] },
  { id: 'hs-18', code: 'HS18', name: 'Lê Thảo My', gender: 'nữ', team: 'Tổ 4', attendanceStatus: 'present', mathLevel: 'T', vietnameseLevel: 'H', strengths: 'Giải toán hình học rất có năng khiếu', needsSupport: 'Luyện tập thêm phần tập làm văn miêu tả', totalPoints: 108, badges: ['Nhà hình học nhí'] },
  { id: 'hs-19', code: 'HS19', name: 'Trịnh Viết Thành', gender: 'nam', team: 'Tổ 4', attendanceStatus: 'present', mathLevel: 'C', vietnameseLevel: 'H', strengths: 'Ngoan ngoãn, có ý thức cố gắng vươn lên', needsSupport: 'Cần giáo viên kèm thêm kĩ năng đặt tính chia', totalPoints: 70, badges: ['Kiên trì'] },
  { id: 'hs-20', code: 'HS20', name: 'Mai Phương Uyên', gender: 'nữ', team: 'Tổ 4', attendanceStatus: 'present', mathLevel: 'T', vietnameseLevel: 'T', strengths: 'Ý thức tự giác rất cao, đọc sách nhiều', needsSupport: 'Mạnh dạn xung phong điều hành trò chơi', totalPoints: 132, badges: ['Mọt sách thông thái'] }
];

export const defaultLessonPlans: LessonPlan[] = [
  {
    id: 'lp-01',
    title: 'Kế hoạch bài dạy môn Toán 4: Phép nhân với số có một chữ số',
    subject: 'Toán',
    bookSet: 'Kết nối tri thức với cuộc sống',
    grade: 'Lớp 4',
    week: 'Tuần 12',
    period: 'Tiết 1',
    topic: 'Phép nhân với số có một chữ số (có nhớ một lần)',
    duration: '35 phút',
    requirements: {
      competencies: {
        specific: [
          'Thực hiện được phép nhân số có nhiều chữ số với số có một chữ số (có nhớ không quá hai lần).',
          'Vận dụng giải được các bài toán thực tế liên quan đến mua sắm, tính chu vi và diện tích.'
        ],
        general: [
          'Năng lực tự chủ và tự học: Tự giác đặt tính và tính đúng theo thứ tự từ phải sang trái.',
          'Năng lực giao tiếp và hợp tác: Chia sẻ cách tính và kiểm tra chéo kết quả cùng bạn cùng bàn.'
        ]
      },
      qualities: [
        'Chăm chỉ: Tỉ mỉ, kiên trì, không bỏ sót bước cộng số nhớ.',
        'Trách nhiệm: Giữ gìn vở toán sạch đẹp, không tẩy xóa cẩu thả.'
      ]
    },
    preparation: {
      teacher: [
        'Giáo án điện tử, máy chiếu tương tác, vòng quay số ngẫu nhiên.',
        'Phiếu học tập phân hóa (Mức 1, Mức 2, Mức 3).',
        'Bộ thẻ bài tính nhẩm tiếp sức.'
      ],
      student: [
        'SGK Toán 4 - Kết nối tri thức, Vở bài tập Toán tập 1.',
        'Bảng con, phấn, khăn lau bảng, bút màu.'
      ]
    },
    activities: [
      {
        step: 1,
        name: 'Hoạt động 1: Khởi động - Trò chơi "Vòng quay tiếp sức" (5 phút)',
        goal: 'Ôn tập bảng nhân từ 2 đến 9, tạo tâm thế vui tươi đầu tiết học.',
        teacherActivity: 'GV quay bánh xe số trên màn hình chiếu, chỉ định ngẫu nhiên học sinh đọc to kết quả phép nhân (ví dụ: 8 x 7, 9 x 6). GV khen ngợi và dẫn dắt vào bài mới.',
        studentActivity: 'HS quan sát vòng quay, đứng dậy trả lời dõng dạc. Cả lớp vỗ tay hưởng ứng.',
        expectedProduct: '100% học sinh ôn lại trôi chảy bảng nhân cơ bản.',
        assessment: 'Đánh giá qua tốc độ phản xạ và sự chính xác của học sinh.'
      },
      {
        step: 2,
        name: 'Hoạt động 2: Khám phá - Hình thành quy tắc đặt tính và tính (12 phút)',
        goal: 'Học sinh nắm vững cách đặt tính thẳng cột và thứ tự thực hiện phép nhân từ phải sang trái.',
        teacherActivity: 'GV nêu bài toán thực tế: "Một thùng khẩu trang có 1 428 chiếc. Hỏi 3 thùng như thế có tất cả bao nhiêu chiếc khẩu trang?". Hướng dẫn học sinh lập phép tính 1 428 x 3 và thực hiện đặt tính.',
        studentActivity: 'HS viết phép tính vào bảng con, thảo luận cặp đôi để tìm ra kết quả: 3 nhân 8 bằng 24, viết 4 nhớ 2; 3 nhân 2 bằng 6 thêm 2 bằng 8...',
        expectedProduct: 'Bảng con có lời giải: 1 428 x 3 = 4 284.',
        assessment: 'GV quan sát thao tác đặt tính thẳng hàng của học sinh trên bảng con.'
      },
      {
        step: 3,
        name: 'Hoạt động 3: Luyện tập, thực hành phân hóa (12 phút)',
        goal: 'Rèn kĩ năng tính thành thạo, phát hiện và sửa các lỗi sai thường gặp khi có nhớ.',
        teacherActivity: 'Giao nhiệm vụ: Bài 1 (Đặt tính rồi tính) - làm cá nhân vào vở; Bài 2 (Tính giá trị biểu thức) - làm việc nhóm đôi; Bài 3 (Bài toán lời văn nâng cao) - dành cho nhóm hoàn thành sớm.',
        studentActivity: 'HS làm bài độc lập vào vở. Đổi vở chấm chéo cùng bạn theo bảng đáp án trên màn hình.',
        expectedProduct: 'Vở bài tập hoàn thành sạch sẽ, lời giải rõ ràng.',
        assessment: 'GV đi quan sát, chấm chữa trực tiếp cho 8 học sinh, nhắc nhở các em hay quên cộng số nhớ.'
      },
      {
        step: 4,
        name: 'Hoạt động 4: Vận dụng - Bác thợ mộc thông thái (6 phút)',
        goal: 'Vận dụng phép nhân vào tính toán chi phí thực tế.',
        teacherActivity: 'Đưa bài toán: "Một mét gỗ có giá 325 000 đồng. Bác thợ mộc cần mua 3 mét gỗ. Em hãy giúp bác tính tổng số tiền nhé!".',
        studentActivity: 'HS tính nhanh ra giấy nháp và giơ tay giải thích cách nhẩm thông minh: 325 nghìn x 3 = 975 nghìn đồng.',
        expectedProduct: 'Học sinh nêu đúng kết quả 975 000 đồng.',
        assessment: 'Tặng sao vàng vinh danh "Nhà toán học tương lai".'
      }
    ],
    reflection: 'Đa số học sinh nắm chắc cách đặt tính. Lưu ý tiết sau cho học sinh rèn thêm các bài toán có chữ số 0 ở hàng chục.',
    suggestedTeacherDialogue: 'Lời dẫn của cô giáo: "Các con thấy không, phép nhân giúp chúng ta tính toán tiền bạc, số lượng đồ vật cực kì nhanh chóng trong đời sống. Ai muốn sau này quản lý tài chính giỏi thì hãy học thật cừ phép tính này nhé!"',
    createdAt: '2026-10-15',
    updatedAt: '2026-10-16',
    isFavorite: true
  },
  {
    id: 'lp-02',
    title: 'Kế hoạch bài dạy Tiếng Việt 4: Luyện từ và câu - Danh từ',
    subject: 'Tiếng Việt',
    bookSet: 'Kết nối tri thức với cuộc sống',
    grade: 'Lớp 4',
    week: 'Tuần 3',
    period: 'Tiết 1',
    topic: 'Danh từ (Khái niệm và nhận biết)',
    duration: '35 phút',
    requirements: {
      competencies: {
        specific: [
          'Nhận biết được danh từ là từ chỉ sự vật (người, vật, hiện tượng, thời gian, con vật...).',
          'Tìm được các danh từ trong đoạn văn và biết đặt câu có sử dụng danh từ.'
        ],
        general: [
          'Năng lực giao tiếp và hợp tác: Tự tin trình bày ý kiến, phối hợp nhóm phân loại từ.',
          'Năng lực tự chủ: Hoàn thành phiếu bài tập cá nhân đúng thời gian quy định.'
        ]
      },
      qualities: [
        'Yêu nước, nhân ái: Cảm nhận được sự phong phú, trong sáng và vẻ đẹp của tiếng Việt.',
        'Chăm chỉ: Tích cực tìm thêm các danh từ phong phú trong đời sống hàng ngày.'
      ]
    },
    preparation: {
      teacher: ['Cây hoa từ ngữ, giỏ đựng thẻ từ, bài trình chiếu tương tác.'],
      student: ['SGK Tiếng Việt 4 tập 1, vở luyện từ và câu, bút chì màu.']
    },
    activities: [
      {
        step: 1,
        name: 'Hoạt động 1: Khởi động - Trò chơi "Thám tử tìm sự vật" (5 phút)',
        goal: 'Học sinh quan sát xung quanh lớp học và gọi tên các sự vật nhìn thấy.',
        teacherActivity: 'GV chiếu hình ảnh một ngôi trường và yêu cầu học sinh thi đua tìm các từ chỉ người, đồ vật, cây cối.',
        studentActivity: 'HS giơ tay kể: cô giáo, học sinh, bảng đen, cây bàng, ánh nắng...',
        expectedProduct: 'Danh sách các từ chỉ sự vật được ghi nhận trên bảng.',
        assessment: 'Khen ngợi tinh thần quan sát tinh tế của học sinh.'
      },
      {
        step: 2,
        name: 'Hoạt động 2: Khám phá - Rút ra bài học về Danh từ (12 phút)',
        goal: 'Học sinh phân loại được từ chỉ người, vật, con vật, hiện tượng và gọi chung là Danh từ.',
        teacherActivity: 'Hướng dẫn học sinh đọc đoạn văn trong SGK. Giao nhiệm vụ xếp từ vào 4 cột: Người / Đồ vật / Con vật / Hiện tượng tự nhiên.',
        studentActivity: 'Làm việc theo nhóm 4 em trên bảng phụ. Đại diện nhóm dán kết quả lên bảng lớp.',
        expectedProduct: 'Bảng phân loại chuẩn xác và định nghĩa: Danh từ là từ chỉ sự vật.',
        assessment: 'Đánh giá qua độ chính xác và tính tương tác của các nhóm.'
      },
      {
        step: 3,
        name: 'Hoạt động 3: Luyện tập - Phân biệt và tìm danh từ (12 phút)',
        goal: 'HS nhận diện đúng danh từ trong ngữ cảnh câu văn hoàn chỉnh.',
        teacherActivity: 'Giao bài tập 1, 2 trong SGK. GV hỗ trợ các em còn nhầm lẫn danh từ chỉ hiện tượng (mưa, gió, nắng) với từ chỉ hoạt động.',
        studentActivity: 'HS gạch chân dưới danh từ trong đoạn văn. Chia sẻ với bạn cùng bàn.',
        expectedProduct: 'Bài làm gạch chân đúng các danh từ: dòng sông, con đò, bầu trời, mùa xuân.',
        assessment: 'Nhận xét trực tiếp bài làm của học sinh.'
      },
      {
        step: 4,
        name: 'Hoạt động 4: Vận dụng - Đặt câu miêu tả lớp học hạnh phúc (6 phút)',
        goal: 'Đặt được câu chứa ít nhất 2 danh từ miêu tả cảm xúc hoặc không gian lớp học.',
        teacherActivity: 'Gợi ý: "Các con hãy viết một câu gửi tặng lớp 4C thân yêu của chúng mình nhé!".',
        studentActivity: 'HS viết câu vào giấy nhớ dán lên "Cây thông điệp hạnh phúc" cuối lớp.',
        expectedProduct: 'Những câu văn ấm áp: "Lớp 4C rộn rã tiếng cười của thầy cô và bạn bè."',
        assessment: 'Tuyên dương những câu văn giàu hình ảnh và đúng ngữ pháp.'
      }
    ],
    reflection: 'Học sinh tiếp thu rất nhanh. Cần lưu ý giải thích kĩ hơn cho các em về danh từ chỉ thời gian (ngày, tháng, năm).',
    suggestedTeacherDialogue: 'Lời dẫn: "Tiếng Việt của chúng ta đẹp lắm các con ạ! Từng danh từ như những viên gạch nhỏ xây nên ngôi nhà ngôn ngữ kì diệu!"',
    createdAt: '2026-10-14',
    updatedAt: '2026-10-15',
    isFavorite: true
  }
];

export const defaultMaterials: LearningMaterial[] = [
  {
    id: 'mat-01',
    title: 'Phiếu học tập Toán 4: Ôn tập phân số và các phép tính',
    materialType: 'worksheet',
    subject: 'Toán',
    grade: 'Lớp 4',
    topic: 'Phân số, rút gọn phân số và quy đồng mẫu số',
    headerInfo: {
      school: 'Trường Tiểu học Khoái Châu 1',
      class: 'Lớp 4C',
      subject: 'Toán 4',
      timeLimit: '25 phút'
    },
    instructions: 'Em hãy đọc kĩ đề bài, trình bày cẩn thận vào phiếu và kiểm tra lại kết quả trước khi nộp cho cô giáo nhé!',
    sections: [
      {
        title: 'Phần 1: Trắc nghiệm khách quan (4.0 điểm)',
        questions: [
          {
            id: 1,
            level: 'Nhận biết',
            content: 'Trong phân số 5/8, tử số là số nào?',
            options: ['A. 5', 'B. 8', 'C. 13', 'D. 3'],
            correctAnswer: 'A',
            explanation: 'Trong phân số, tử số là số tự nhiên viết trên gạch ngang. Do đó tử số là 5.'
          },
          {
            id: 2,
            level: 'Thông hiểu',
            content: 'Rút gọn phân số 18/24 về dạng phân số tối giản ta được:',
            options: ['A. 9/12', 'B. 6/8', 'C. 3/4', 'D. 2/3'],
            correctAnswer: 'C',
            explanation: 'Chia cả tử số và mẫu số cho ước chung lớn nhất là 6: 18:6 / 24:6 = 3/4.'
          }
        ]
      },
      {
        title: 'Phần 2: Tự luận và Bài toán thực tế (6.0 điểm)',
        questions: [
          {
            id: 3,
            level: 'Vận dụng',
            content: 'Quy đồng mẫu số hai phân số 2/3 và 5/6.',
            guide: 'Mẫu số chung là 6. Giữ nguyên 5/6, nhân cả tử và mẫu của 2/3 với 2.',
            score: '2.5 điểm',
            modelAnswer: 'Ta có: 2/3 = (2 x 2) / (3 x 2) = 4/6. Giữ nguyên phân số 5/6. Vậy quy đồng mẫu số hai phân số 2/3 và 5/6 ta được 4/6 và 5/6.'
          },
          {
            id: 4,
            level: 'Vận dụng cao',
            content: 'Một bình nước có dung tích 2 lít. Buổi sáng mẹ rót ra 3/4 lít nước, buổi chiều mẹ rót tiếp 1/2 lít nước. Hỏi trong bình còn lại bao nhiêu lít nước?',
            guide: 'Tính tổng lượng nước đã rót: 3/4 + 1/2 = 5/4 lít. Lượng nước còn lại = 2 - 5/4.',
            score: '3.5 điểm',
            modelAnswer: 'Tổng lượng nước mẹ đã rót là: 3/4 + 1/2 = 3/4 + 2/4 = 5/4 (lít).\nTrong bình còn lại số lít nước là: 2 - 5/4 = 8/4 - 5/4 = 3/4 (lít).\nĐáp số: 3/4 lít nước.'
          }
        ]
      }
    ],
    rubric: [
      { criterion: 'Độ chính xác phép tính', excellent: 'Đúng 100% các phép tính và đơn vị', good: 'Sai 1 lỗi nhỏ không đáng kể', needsImprovement: 'Cần ôn lại quy đồng mẫu số' },
      { criterion: 'Trình bày và chữ viết', excellent: 'Sạch sẽ, phân số viết cân đối giữa dòng kẻ', good: 'Trình bày rõ ràng, đôi chỗ gạch xóa nhẹ', needsImprovement: 'Viết gạch ngang phân số cẩu thả' }
    ],
    teacherNotes: 'Lưu ý nhắc học sinh quy đồng mẫu số chung nhỏ nhất để tính toán thuận tiện hơn.',
    createdAt: '2026-10-16',
    isFavorite: true
  }
];

export const defaultGames: InteractiveGame[] = [
  {
    id: 'game-01',
    title: 'Ai Là Triệu Phú Tri Thức: Ôn tập Khoa học & Lịch sử 4',
    gameType: 'millionaire',
    subject: 'Khoa học',
    topic: 'Nước, không khí và các mốc lịch sử hào hùng',
    data: {
      questions: [
        {
          id: 1,
          level: 1,
          point: 100,
          question: 'Nước tồn tại ở những thể nào trong tự nhiên?',
          options: ['A. Thể lỏng, thể khí, thể rắn', 'B. Chỉ có thể lỏng', 'C. Thể mềm và thể cứng', 'D. Thể sương mù và thể nước đá'],
          correctIndex: 0,
          hint: 'Nước uống là thể lỏng, băng là thể rắn, hơi nước là thể khí.',
          funFact: 'Nước bao phủ khoảng 71% bề mặt Trái Đất của chúng ta!'
        },
        {
          id: 2,
          level: 2,
          point: 200,
          question: 'Không khí có những tính chất nào sau đây?',
          options: ['A. Có màu trắng và mùi thơm', 'B. Không màu, không mùi, không vị, không có hình dạng nhất định', 'C. Nặng hơn sắt thép', 'D. Chỉ có ở trên bầu trời cao'],
          correctIndex: 1,
          hint: 'Xung quanh chúng ta luôn có không khí nhưng mắt thường không nhìn thấy.',
          funFact: 'Oxy trong không khí là dưỡng khí tối quan trọng cho mọi sinh vật sống.'
        },
        {
          id: 3,
          level: 3,
          point: 500,
          question: 'Vua Lý Thái Tổ quyết định dời đô từ Hoa Lư về Đại La (Thăng Long) vào năm nào?',
          options: ['A. Năm 938', 'B. Năm 1010', 'C. Năm 1288', 'D. Năm 1428'],
          correctIndex: 1,
          hint: 'Năm kỉ niệm nghìn năm Thăng Long là năm 2010.',
          funFact: 'Tương truyền khi đến chân thành Đại La, vua thấy rồng vàng bay lên nên đặt tên là Thăng Long.'
        },
        {
          id: 4,
          level: 4,
          point: 1000,
          question: 'Khí nào trong không khí cần thiết cho sự cháy và sự hô hấp của con người?',
          options: ['A. Khí Ô-xi (Oxygen)', 'B. Khí Ni-tơ (Nitrogen)', 'C. Khí Các-bô-níc (CO2)', 'D. Khí Hê-li (Helium)'],
          correctIndex: 0,
          hint: 'Cây xanh nhả khí này vào ban ngày khi quang hợp.',
          funFact: 'Khí oxy chiếm khoảng 21% thể tích bầu khí quyển Trái Đất.'
        },
        {
          id: 5,
          level: 5,
          point: 2000,
          question: 'Chiến thắng Bạch Đằng năm 938 gắn liền với tên tuổi vị anh hùng dân tộc nào?',
          options: ['A. Ngô Quyền', 'B. Đinh Bộ Lĩnh', 'C. Lê Hoàn', 'D. Trần Hưng Đạo'],
          correctIndex: 0,
          hint: 'Kế sách cắm cọc gỗ đầu bịt sắt trên sông Bạch Đằng đánh tan quân Nam Hán.',
          funFact: 'Chiến thắng Bạch Đằng đã chấm dứt hơn 1000 năm Bắc thuộc, mở ra kỉ nguyên độc lập lâu dài cho dân tộc Việt Nam.'
        }
      ]
    },
    createdAt: '2026-10-15',
    playCount: 18,
    highestScore: 2000,
    isFavorite: true
  },
  {
    id: 'game-02',
    title: 'Ghép Đôi Kiến Thức: Toán học & Đơn vị đo lường Lớp 4',
    gameType: 'match',
    subject: 'Toán',
    topic: 'Bảng đơn vị đo khối lượng và diện tích',
    data: {
      pairs: [
        { id: 1, left: '1 tấn', right: '1 000 kg' },
        { id: 2, left: '1 tạ', right: '100 kg' },
        { id: 3, left: '1 yến', right: '10 kg' },
        { id: 4, left: '1 m²', right: '100 dm²' },
        { id: 5, left: '1 dm²', right: '100 cm²' },
        { id: 6, left: '1 thế kỉ', right: '100 năm' }
      ]
    },
    createdAt: '2026-10-14',
    playCount: 24,
    highestScore: 600,
    isFavorite: true
  },
  {
    id: 'game-03',
    title: 'Ô Cửa Bí Mật: Vòng tuần hoàn của nước trong tự nhiên',
    gameType: 'secret_doors',
    subject: 'Khoa học',
    topic: 'Vòng tuần hoàn của nước',
    data: {
      secretKeyword: 'VÒNG TUẦN HOÀN CỦA NƯỚC',
      doors: [
        { doorNumber: 1, question: 'Hiện tượng nước chuyển từ thể lỏng sang thể khí dưới sức nóng mặt trời gọi là gì?', answer: 'Bay hơi', revealedClue: 'Mảnh ghép 1: Mặt trời tỏa nắng trên mặt biển' },
        { doorNumber: 2, question: 'Hơi nước bay lên cao gặp lạnh ngưng tụ lại thành gì?', answer: 'Những đám mây', revealedClue: 'Mảnh ghép 2: Mây trắng tích tụ trên bầu trời cao' },
        { doorNumber: 3, question: 'Khi các giọt nước trong đám mây nặng dần và rơi xuống thì tạo thành gì?', answer: 'Mưa', revealedClue: 'Mảnh ghép 3: Những giọt mưa rơi xuống mặt đất' },
        { doorNumber: 4, question: 'Nước mưa ngấm vào đất và chảy theo các dòng sông trở về đâu?', answer: 'Biển và đại dương', revealedClue: 'Mảnh ghép 4: Sông ngòi chảy về biển khơi khép kín vòng tuần hoàn' }
      ]
    },
    createdAt: '2026-10-13',
    playCount: 15,
    highestScore: 400,
    isFavorite: true
  },
  {
    id: 'game-04',
    title: 'Vòng Quay May Mắn: Thử tài Toán học Lớp 4',
    gameType: 'wheel',
    subject: 'Toán',
    topic: 'Tính nhẩm nhanh và hình học',
    data: {
      sectors: [
        { id: 1, label: '100 Điểm', points: 100, question: 'Phép tính: 25 x 4 bằng bao nhiêu?', options: ['A. 100', 'B. 80', 'C. 120', 'D. 90'], correct: 'A' },
        { id: 2, label: '200 Điểm', points: 200, question: 'Hình bình hành có mấy cặp cạnh đối diện song song?', options: ['A. 1 cặp', 'B. 2 cặp', 'C. 3 cặp', 'D. 4 cặp'], correct: 'B' },
        { id: 3, label: 'May Mắn +50đ', points: 50, question: 'Góc vuông có số đo bằng bao nhiêu độ?', options: ['A. 60°', 'B. 90°', 'C. 180°', 'D. 45°'], correct: 'B' },
        { id: 4, label: '300 Điểm', points: 300, question: 'Trung bình cộng của 3 số: 10, 20, 30 là:', options: ['A. 15', 'B. 20', 'C. 25', 'D. 30'], correct: 'B' },
        { id: 5, label: '500 Điểm', points: 500, question: 'Số tự nhiên bé nhất có 5 chữ số là:', options: ['A. 10 000', 'B. 10 001', 'C. 99 999', 'D. 11 111'], correct: 'A' },
        { id: 6, label: 'Nhân Đôi', points: 400, question: 'Một năm nhuận có bao nhiêu ngày?', options: ['A. 365 ngày', 'B. 366 ngày', 'C. 364 ngày', 'D. 360 ngày'], correct: 'B' }
      ]
    },
    createdAt: '2026-10-12',
    playCount: 31,
    highestScore: 1200,
    isFavorite: true
  },
  {
    id: 'game-05',
    title: 'Thẻ Ghi Nhớ Flashcard: Lịch sử và Địa lí 4',
    gameType: 'flashcard',
    subject: 'Lịch sử và Địa lí',
    topic: 'Thiên nhiên và con người vùng đồng bằng Bắc Bộ',
    data: {
      cards: [
        { id: 1, front: 'Đồng bằng Bắc Bộ do những con sông lớn nào bồi đắp nên?', back: 'Được bồi đắp bởi phù sa của sông Hồng và sông Thái Bình.', mnemonic: 'Mẹo nhớ: "Hồng - Thái" bồi đắp phù sa màu mỡ' },
        { id: 2, front: 'Hệ thống đê ở đồng bằng Bắc Bộ có tác dụng gì?', back: 'Ngăn lũ lụt từ sông, bảo vệ mùa màng, làng xóm và cuộc sống của người dân.', mnemonic: 'Khẩu hiệu: "Đê vững mùa vàng - Dân an cơm ấm"' },
        { id: 3, front: 'Đồng bằng Bắc Bộ là vựa lúa lớn thứ mấy của nước ta?', back: 'Là vựa lúa lớn thứ hai của cả nước (sau đồng bằng sông Cửu Long).', mnemonic: 'Vị trí: Số 1 là Nam Bộ, Số 2 là Bắc Bộ' }
      ]
    },
    createdAt: '2026-10-11',
    playCount: 22,
    highestScore: 300,
    isFavorite: true
  }
];

export const defaultFeedbacks: StudentFeedback[] = [
  {
    id: 'fb-01',
    studentId: 'hs-01',
    studentName: 'Nguyễn Minh Quân',
    subject: 'Toán',
    term: 'Giữa học kì I',
    completionLevel: 'T',
    strengths: 'Tính toán nhanh nhạy, giải quyết tốt các bài toán nâng cao',
    needsSupport: 'Cần chú ý cẩn thận khi trình bày bài toán hình',
    evidence: 'Kiểm tra giữa kì đạt 9.5 điểm, tích cực tham gia trò chơi toán học',
    shortComment: 'Em nắm rất vững kiến thức, tư duy toán học logic, hoàn thành xuất sắc các bài tập.',
    detailedComment: 'Trong giai đoạn giữa học kì I, em Quân thể hiện năng lực toán học vượt trội. Em tính toán nhanh, chính xác và luôn tìm tòi những cách giải hay. Cô khen ngợi tinh thần tự giác của em!',
    competencyFeedback: {
      selfStudy: 'Tự giác hoàn thành bài tập, có khả năng tự học rất tốt.',
      collaboration: 'Hăng hái giúp đỡ bạn bè trong giờ học nhóm.',
      problemSolving: 'Tư duy sắc bén, vận dụng quy tắc linh hoạt vào thực tế.'
    },
    qualityFeedback: 'Chăm chỉ, trung thực, có tinh thần trách nhiệm cao.',
    suggestedActionsForTeacher: 'Giao thêm các bài toán tư duy mở rộng để phát huy tối đa năng khiếu.',
    suggestedActionsForParents: 'Gia đình khích lệ con giữ gìn vở sạch chữ đẹp hơn nữa.',
    createdAt: '2026-10-16',
    approvedByTeacher: true
  },
  {
    id: 'fb-02',
    studentId: 'hs-02',
    studentName: 'Trần Bảo Anh',
    subject: 'Tiếng Việt',
    term: 'Giữa học kì I',
    completionLevel: 'T',
    strengths: 'Chữ viết nắn nót, viết đoạn văn giàu hình ảnh và cảm xúc',
    needsSupport: 'Mạnh dạn phát biểu to, rõ ràng hơn trước tập thể',
    evidence: 'Bài tập làm văn đạt điểm 9, đạt giải thưởng Vở sạch chữ đẹp cấp trường',
    shortComment: 'Em học rất tốt môn Tiếng Việt, câu văn trong sáng giàu cảm xúc, chữ viết sạch đẹp.',
    detailedComment: 'Em Bảo Anh có năng khiếu văn học, giàu trí tưởng tượng và khả năng dùng từ rất tinh tế. Em cần mạnh dạn hơn khi chia sẻ bài viết trước lớp để lan tỏa tình yêu tiếng Việt đến các bạn!',
    competencyFeedback: {
      selfStudy: 'Ý thức tự học mẫu mực, luôn chuẩn bị bài chu đáo.',
      collaboration: 'Biết lắng nghe, hòa nhã với bạn cùng bàn.',
      problemSolving: 'Biết chọn lọc hình ảnh sinh động khi miêu tả.'
    },
    qualityFeedback: 'Lễ phép, nhân ái, khiêm tốn và chăm chỉ.',
    suggestedActionsForTeacher: 'Thường xuyên mời em đọc bài văn mẫu trước lớp để tăng sự tự tin.',
    suggestedActionsForParents: 'Khuyến khích con tham gia câu lạc bộ kể chuyện của trường.',
    createdAt: '2026-10-16',
    approvedByTeacher: true
  }
];

export const defaultAssignments: Assignment[] = [
  {
    id: 'assign-01',
    title: 'Bài tự luyện trực tuyến: Phép nhân và Phân số Lớp 4',
    subject: 'Toán',
    topic: 'Toán học 4 tuần 12',
    dueDate: '2026-10-25',
    durationMinutes: 15,
    totalPoints: 10,
    status: 'active',
    createdAt: '2026-10-16',
    questions: [
      {
        id: 1,
        question: 'Kết quả của phép tính: 1 250 x 4 là bao nhiêu?',
        options: ['4 800', '5 000', '5 200', '6 000'],
        correctAnswer: 1,
        explanation: 'Ta thực hiện: 1 250 x 4 = 5 000.'
      },
      {
        id: 2,
        question: 'Rút gọn phân số 15/25 về tối giản ta được:',
        options: ['3/5', '1/5', '5/3', '3/10'],
        correctAnswer: 0,
        explanation: 'Chia cả tử và mẫu cho 5: 15:5 / 25:5 = 3/5.'
      },
      {
        id: 3,
        question: 'Một hình chữ nhật có chiều dài 15m, chiều rộng 8m. Chu vi của hình đó là:',
        options: ['120m', '46m', '23m', '92m'],
        correctAnswer: 1,
        explanation: 'Chu vi = (15 + 8) x 2 = 23 x 2 = 46m.'
      },
      {
        id: 4,
        question: 'Phân số nào sau đây lớn hơn 1?',
        options: ['4/5', '7/7', '9/8', '2/3'],
        correctAnswer: 2,
        explanation: 'Phân số có tử số lớn hơn mẫu số thì phân số đó lớn hơn 1. Ở đây 9 > 8 nên 9/8 > 1.'
      },
      {
        id: 5,
        question: 'Số trung bình cộng của 30 và 50 là:',
        options: ['35', '40', '45', '80'],
        correctAnswer: 1,
        explanation: 'Trung bình cộng = (30 + 50) : 2 = 80 : 2 = 40.'
      }
    ]
  }
];

export const defaultSubmissions: AssignmentSubmission[] = [
  {
    id: 'sub-01',
    assignmentId: 'assign-01',
    studentId: 'hs-01',
    studentName: 'Nguyễn Minh Quân',
    score: 10,
    totalScore: 10,
    answers: { 1: 1, 2: 0, 3: 1, 4: 2, 5: 1 },
    submittedAt: '2026-10-17 08:30',
    timeSpentSeconds: 245
  },
  {
    id: 'sub-02',
    assignmentId: 'assign-01',
    studentId: 'hs-02',
    studentName: 'Trần Bảo Anh',
    score: 10,
    totalScore: 10,
    answers: { 1: 1, 2: 0, 3: 1, 4: 2, 5: 1 },
    submittedAt: '2026-10-17 09:15',
    timeSpentSeconds: 310
  },
  {
    id: 'sub-03',
    assignmentId: 'assign-01',
    studentId: 'hs-03',
    studentName: 'Lê Gia Huy',
    score: 8,
    totalScore: 10,
    answers: { 1: 1, 2: 0, 3: 0, 4: 2, 5: 1 }, // câu 3 nhầm chu vi thành diện tích
    submittedAt: '2026-10-17 10:00',
    timeSpentSeconds: 420
  }
];

export const defaultLogs: ActivityLog[] = [
  { id: 'log-01', type: 'system', title: 'Hệ thống khởi tạo thành công', description: 'Cấu hình lớp minh họa 4C Trường TH Khoái Châu 1 sẵn sàng.', timestamp: '2026-10-17 08:00' },
  { id: 'log-02', type: 'plan', title: 'Soạn giáo án Toán 4', description: 'Đã tạo và lưu Kế hoạch bài dạy "Phép nhân với số có một chữ số".', timestamp: '2026-10-17 08:15' },
  { id: 'log-03', type: 'material', title: 'Tạo phiếu học tập Toán 4', description: 'Xuất bản phiếu học tập phân hóa về Phân số.', timestamp: '2026-10-17 08:45' },
  { id: 'log-04', type: 'game', title: 'Tổ chức trò chơi Ai Là Triệu Phú', description: 'Lớp 4C đã tham gia trò chơi Khoa học 4 với điểm số cao.', timestamp: '2026-10-17 09:30' },
  { id: 'log-05', type: 'feedback', title: 'Gợi ý nhận xét Thông tư 27', description: 'Đã hoàn thành nhận xét cho 2 học sinh xuất sắc.', timestamp: '2026-10-17 10:15' }
];

// Storage Service API
export const StorageService = {
  initialize() {
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      this.resetAllData();
    }
  },

  resetAllData() {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(defaultProfile));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(defaultStudents));
    localStorage.setItem(STORAGE_KEYS.LESSON_PLANS, JSON.stringify(defaultLessonPlans));
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(defaultMaterials));
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(defaultGames));
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(defaultFeedbacks));
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(defaultAssignments));
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(defaultSubmissions));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(defaultLogs));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  },

  // Profile
  getProfile(): TeacherProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return raw ? JSON.parse(raw) : defaultProfile;
  },
  saveProfile(profile: TeacherProfile) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    this.addLog('system', 'Cập nhật hồ sơ giáo viên', `Hồ sơ cô ${profile.name} đã được lưu.`);
  },

  // Students
  getStudents(): Student[] {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return raw ? JSON.parse(raw) : defaultStudents;
  },
  saveStudents(students: Student[]) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },
  updateStudentAttendance(studentId: string, status: 'present' | 'absent' | 'late') {
    const students = this.getStudents();
    const updated = students.map(s => s.id === studentId ? { ...s, attendanceStatus: status } : s);
    this.saveStudents(updated);
  },

  // Lesson Plans
  getLessonPlans(): LessonPlan[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LESSON_PLANS);
    return raw ? JSON.parse(raw) : defaultLessonPlans;
  },
  saveLessonPlan(plan: LessonPlan) {
    const list = this.getLessonPlans();
    const idx = list.findIndex(p => p.id === plan.id);
    if (idx >= 0) {
      list[idx] = { ...plan, updatedAt: new Date().toISOString().split('T')[0] };
    } else {
      list.unshift(plan);
    }
    localStorage.setItem(STORAGE_KEYS.LESSON_PLANS, JSON.stringify(list));
    this.addLog('plan', 'Lưu kế hoạch bài dạy', plan.title);
  },
  deleteLessonPlan(id: string) {
    const list = this.getLessonPlans().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.LESSON_PLANS, JSON.stringify(list));
  },

  // Materials
  getMaterials(): LearningMaterial[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    return raw ? JSON.parse(raw) : defaultMaterials;
  },
  saveMaterial(mat: LearningMaterial) {
    const list = this.getMaterials();
    const idx = list.findIndex(m => m.id === mat.id);
    if (idx >= 0) {
      list[idx] = mat;
    } else {
      list.unshift(mat);
    }
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(list));
    this.addLog('material', 'Lưu học liệu mới', mat.title);
  },
  deleteMaterial(id: string) {
    const list = this.getMaterials().filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(list));
  },

  // Games
  getGames(): InteractiveGame[] {
    const raw = localStorage.getItem(STORAGE_KEYS.GAMES);
    return raw ? JSON.parse(raw) : defaultGames;
  },
  saveGame(game: InteractiveGame) {
    const list = this.getGames();
    const idx = list.findIndex(g => g.id === game.id);
    if (idx >= 0) {
      list[idx] = game;
    } else {
      list.unshift(game);
    }
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(list));
    this.addLog('game', 'Lưu trò chơi học tập', game.title);
  },
  recordGamePlay(gameId: string, score: number) {
    const list = this.getGames();
    const updated = list.map(g => {
      if (g.id === gameId) {
        return {
          ...g,
          playCount: g.playCount + 1,
          highestScore: Math.max(g.highestScore, score)
        };
      }
      return g;
    });
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(updated));
  },
  deleteGame(id: string) {
    const list = this.getGames().filter(g => g.id !== id);
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(list));
  },

  // Feedbacks
  getFeedbacks(): StudentFeedback[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FEEDBACKS);
    return raw ? JSON.parse(raw) : defaultFeedbacks;
  },
  saveFeedback(fb: StudentFeedback) {
    const list = this.getFeedbacks();
    const idx = list.findIndex(f => f.id === fb.id);
    if (idx >= 0) {
      list[idx] = fb;
    } else {
      list.unshift(fb);
    }
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(list));
    this.addLog('feedback', 'Lưu nhận xét học sinh', `Đã lưu nhận xét cho em ${fb.studentName}`);
  },

  // Assignments
  getAssignments(): Assignment[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    return raw ? JSON.parse(raw) : defaultAssignments;
  },
  saveAssignment(assignment: Assignment) {
    const list = this.getAssignments();
    list.unshift(assignment);
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(list));
    this.addLog('assignment', 'Giao bài tập mới', assignment.title);
  },

  // Submissions
  getSubmissions(): AssignmentSubmission[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    return raw ? JSON.parse(raw) : defaultSubmissions;
  },
  saveSubmission(submission: AssignmentSubmission) {
    const list = this.getSubmissions();
    list.unshift(submission);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(list));
    this.addLog('assignment', 'Học sinh nộp bài', `Em ${submission.studentName} hoàn thành bài với ${submission.score}/${submission.totalScore} điểm.`);
  },

  // Activity Logs
  getLogs(): ActivityLog[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    return raw ? JSON.parse(raw) : defaultLogs;
  },
  addLog(type: ActivityLog['type'], title: string, description: string) {
    const logs = this.getLogs();
    const newLog: ActivityLog = {
      id: 'log-' + Date.now(),
      type,
      title,
      description,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
    };
    logs.unshift(newLog);
    if (logs.length > 50) logs.pop();
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  },

  // Export JSON Backup
  exportBackup(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      students: this.getStudents(),
      lessonPlans: this.getLessonPlans(),
      materials: this.getMaterials(),
      games: this.getGames(),
      feedbacks: this.getFeedbacks(),
      assignments: this.getAssignments(),
      submissions: this.getSubmissions(),
      logs: this.getLogs()
    };
    return JSON.stringify(backup, null, 2);
  },

  // Import JSON Backup
  importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data.profile));
      if (data.students) localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(data.students));
      if (data.lessonPlans) localStorage.setItem(STORAGE_KEYS.LESSON_PLANS, JSON.stringify(data.lessonPlans));
      if (data.materials) localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(data.materials));
      if (data.games) localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(data.games));
      if (data.feedbacks) localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(data.feedbacks));
      if (data.assignments) localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(data.assignments));
      if (data.submissions) localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(data.submissions));
      if (data.logs) localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(data.logs));
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }
};
