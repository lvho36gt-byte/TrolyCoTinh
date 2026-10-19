import { LessonPlan, LearningMaterial, StudentFeedback, Student } from '../types';

export const ExportUtils = {
  // Export Lesson Plan to Word (.doc)
  exportLessonPlanToDoc(plan: LessonPlan) {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${plan.title}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.4; margin: 20mm; }
          h1 { font-size: 18pt; text-align: center; text-transform: uppercase; color: #1e3a8a; margin-bottom: 4px; }
          h2 { font-size: 15pt; color: #1e40af; margin-top: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
          h3 { font-size: 14pt; color: #0369a1; margin-top: 10px; }
          .header-box { text-align: center; margin-bottom: 20px; }
          .meta-info { font-style: italic; margin-bottom: 15px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 15px; }
          th, td { border: 1px solid #334155; padding: 8px; text-align: left; vertical-align: top; }
          th { background-color: #f1f5f9; font-weight: bold; }
          ul { margin-top: 4px; margin-bottom: 6px; padding-left: 20px; }
          .footer { margin-top: 30px; text-align: right; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="header-box">
          <p style="margin: 0; font-weight: bold; text-transform: uppercase;">PHÒNG GD&ĐT HUYỆN KHOÁI CHÂU - TRƯỜNG TH KHOÁI CHÂU 1</p>
          <p style="margin: 0; font-style: italic;">Năm học: 2025 - 2026 | Lớp: 4C</p>
          <h1>KẾ HOẠCH BÀI DẠY</h1>
          <p style="font-size: 16pt; font-weight: bold; color: #0284c7; margin: 4px 0;">MÔN: ${plan.subject.toUpperCase()} - LỚP 4</p>
          <p style="margin: 0; font-weight: bold;">BÀI: ${plan.topic.toUpperCase()}</p>
          <p class="meta-info">Bộ sách: ${plan.bookSet} | ${plan.week} - ${plan.period} | Thời lượng: ${plan.duration}</p>
        </div>

        <h2>I. YÊU CẦU CẦN ĐẠT</h2>
        <h3>1. Năng lực đặc thù:</h3>
        <ul>
          ${plan.requirements.competencies.specific.map(c => `<li>${c}</li>`).join('')}
        </ul>

        <h3>2. Năng lực chung:</h3>
        <ul>
          ${plan.requirements.competencies.general.map(c => `<li>${c}</li>`).join('')}
        </ul>

        <h3>3. Phẩm chất chủ yếu:</h3>
        <ul>
          ${plan.requirements.qualities.map(q => `<li>${q}</li>`).join('')}
        </ul>

        <h2>II. ĐỒ DÙNG DẠY HỌC</h2>
        <p><strong>1. Giáo viên:</strong> ${plan.preparation.teacher.join('; ')}</p>
        <p><strong>2. Học sinh:</strong> ${plan.preparation.student.join('; ')}</p>

        <h2>III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU</h2>
        <table>
          <thead>
            <tr>
              <th style="width: 50%;">Hoạt động của Giáo viên</th>
              <th style="width: 50%;">Hoạt động của Học sinh</th>
            </tr>
          </thead>
          <tbody>
            ${plan.activities.map(act => `
              <tr>
                <td colspan="2" style="background-color: #e2e8f0; font-weight: bold;">
                  ${act.name}<br/>
                  <span style="font-weight: normal; font-style: italic;">* Mục tiêu: ${act.goal}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Lời dẫn & Chỉ đạo của GV:</strong><br/>
                  ${act.teacherActivity.replace(/\n/g, '<br/>')}
                </td>
                <td>
                  <strong>Nhiệm vụ & Sản phẩm của HS:</strong><br/>
                  ${act.studentActivity.replace(/\n/g, '<br/>')}
                  <br/><br/>
                  <em>- Sản phẩm dự kiến: ${act.expectedProduct}</em><br/>
                  <em>- Đánh giá: ${act.assessment}</em>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>IV. ĐIỀU CHỈNH SAU BÀI DẠY</h2>
        <p>${plan.reflection || 'Không có điều chỉnh đặc biệt. Học sinh nắm vững nội dung bài học.'}</p>

        <div class="footer">
          <p>Khoái Châu, ngày ..... tháng ..... năm 2026<br/><strong>Giáo viên soạn giảng</strong><br/><br/><br/><strong>Phạm Thị Tính</strong></p>
        </div>
      </body>
      </html>
    `;

    this.downloadBlob(htmlContent, `${plan.subject}_Lop4_${plan.week}_GiaoAn.doc`, 'application/msword');
  },

  // Export Material to Word (.doc)
  exportMaterialToDoc(mat: LearningMaterial) {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${mat.title}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.5; margin: 20mm; }
          .header-table { width: 100%; border: none; margin-bottom: 20px; }
          .header-table td { border: none; padding: 4px; }
          h1 { text-align: center; font-size: 16pt; text-transform: uppercase; margin: 10px 0; }
          .inst { font-style: italic; background-color: #f8fafc; border-left: 3px solid #0284c7; padding: 8px; margin-bottom: 16px; }
          .section-title { font-weight: bold; font-size: 14pt; color: #1e3a8a; margin-top: 16px; border-bottom: 1px dashed #94a3b8; }
          .question-item { margin-bottom: 14px; }
          .opt-grid { display: block; margin-left: 20px; margin-top: 4px; }
        </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td style="width: 50%;">
              <strong>${mat.headerInfo.school.toUpperCase()}</strong><br/>
              Lớp: ${mat.headerInfo.class}<br/>
              Họ và tên học sinh: ............................................
            </td>
            <td style="width: 50%; text-align: right;">
              <strong>${mat.title.toUpperCase()}</strong><br/>
              Môn: ${mat.subject} - Lớp 4<br/>
              Thời gian: ${mat.headerInfo.timeLimit}
            </td>
          </tr>
        </table>

        <h1>${mat.title}</h1>
        <p style="text-align: center; font-style: italic; margin-top: -6px;">Chủ đề: ${mat.topic}</p>

        <div class="inst">
          <strong>Hướng dẫn:</strong> ${mat.instructions}
        </div>

        ${mat.sections.map((sec, idx) => `
          <div class="section-title">${sec.title}</div>
          <div style="margin-top: 10px;">
            ${sec.questions.map((q, qIdx) => `
              <div class="question-item">
                <p><strong>Câu ${qIdx + 1} (${q.level}${q.score ? ` - ${q.score}` : ''}):</strong> ${q.content}</p>
                ${q.options ? `
                  <div class="opt-grid">
                    ${q.options.map(opt => `<p style="margin: 2px 0;">${opt}</p>`).join('')}
                  </div>
                ` : ''}
                ${q.guide ? `<p style="font-style: italic; color: #475569; margin-left: 15px;">(Gợi ý: ${q.guide})</p>` : ''}
              </div>
            `).join('')}
          </div>
        `).join('')}

        <br/>
        <hr/>
        <div style="page-break-before: always; margin-top: 30px;">
          <h2 style="text-align: center; color: #0f172a;">HƯỚNG DẪN CHẤM & ĐÁP ÁN CHI TIẾT</h2>
          ${mat.sections.map(sec => `
            <h3>${sec.title}</h3>
            ${sec.questions.map((q, qIdx) => `
              <p><strong>Câu ${qIdx + 1}:</strong> ${q.correctAnswer ? `Đáp án đúng: <strong>${q.correctAnswer}</strong>` : ''}</p>
              ${q.explanation ? `<p style="margin-left: 15px; color: #334155;"><em>Giải thích:</em> ${q.explanation}</p>` : ''}
              ${q.modelAnswer ? `<p style="margin-left: 15px; color: #334155;"><em>Lời giải chi tiết:</em><br/>${q.modelAnswer.replace(/\n/g, '<br/>')}</p>` : ''}
            `).join('')}
          `).join('')}
        </div>
      </body>
      </html>
    `;

    this.downloadBlob(htmlContent, `${mat.subject}_Lop4_HocLieu.doc`, 'application/msword');
  },

  // Export Feedback Table to Word (.doc)
  exportFeedbacksToDoc(feedbacks: StudentFeedback[], term: string) {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Bảng Tổng Hợp Nhận Xét Học Sinh Lớp 4C</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; margin: 15mm; }
          h1 { text-align: center; text-transform: uppercase; font-size: 16pt; color: #1e3a8a; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #334155; padding: 6px; font-size: 11pt; }
          th { background-color: #f1f5f9; text-align: center; }
          .center { text-align: center; }
        </style>
      </head>
      <body>
        <p style="text-align: center; font-weight: bold; margin: 0;">TRƯỜNG TIỂU HỌC KHOÁI CHÂU 1 - LỚP 4C</p>
        <p style="text-align: center; margin: 0;">Năm học: 2025 - 2026 | GVCN: Phạm Thị Tính</p>
        <h1>BẢNG NHẬN XÉT ĐÁNH GIÁ THƯỜNG XUYÊN HỌC SINH</h1>
        <p style="text-align: center; font-style: italic;">Theo quy định Thông tư 27/2020/TT-BGDĐT | Giai đoạn: ${term}</p>

        <table>
          <thead>
            <tr>
              <th style="width: 5%;">STT</th>
              <th style="width: 20%;">Họ và tên học sinh</th>
              <th style="width: 10%;">Môn học</th>
              <th style="width: 10%;">Mức ĐG</th>
              <th style="width: 35%;">Lời nhận xét sổ theo dõi (dưới 40 từ)</th>
              <th style="width: 20%;">Biện pháp hỗ trợ / Phối hợp</th>
            </tr>
          </thead>
          <tbody>
            ${feedbacks.map((fb, idx) => `
              <tr>
                <td class="center">${idx + 1}</td>
                <td><strong>${fb.studentName}</strong></td>
                <td class="center">${fb.subject}</td>
                <td class="center"><strong>${fb.completionLevel === 'T' ? 'HT Tốt (T)' : fb.completionLevel === 'H' ? 'Hoàn thành (H)' : 'Chưa HT (C)'}</strong></td>
                <td>${fb.shortComment}</td>
                <td>${fb.suggestedActionsForTeacher}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 30px; float: right; text-align: center;">
          <p>Khoái Châu, ngày ..... tháng ..... năm 2026<br/><strong>Giáo viên chủ nhiệm</strong><br/><br/><br/><strong>Phạm Thị Tính</strong></p>
        </div>
      </body>
      </html>
    `;

    this.downloadBlob(htmlContent, `NhanXet_Lop4C_${term.replace(/\s+/g, '_')}.doc`, 'application/msword');
  },

  // Helper trigger browser print
  printDocument() {
    window.print();
  },

  // Helper download blob
  downloadBlob(content: string, filename: string, mimeType: string) {
    const blob = new Blob(['\ufeff' + content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
