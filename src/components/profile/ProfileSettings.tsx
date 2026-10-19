import React, { useState } from 'react';
import {
  User,
  School,
  BookOpen,
  Calendar,
  Save,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Database,
  Lock
} from 'lucide-react';
import { TeacherProfile } from '../../types';
import { StorageService } from '../../services/storageService';

interface ProfileSettingsProps {
  profile: TeacherProfile;
  onUpdateProfile: (profile: TeacherProfile) => void;
  onResetAllData: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profile,
  onUpdateProfile,
  onResetAllData
}) => {
  const [formData, setFormData] = useState<TeacherProfile>({ ...profile });
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSuccessMsg('Thông tin hồ sơ giáo viên đã được cập nhật thành công!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleExportBackup = () => {
    const jsonStr = StorageService.exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SaoLuu_TroLyAI_GiaoVienLop4_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setSuccessMsg('Đã tải xuống bản sao lưu toàn bộ dữ liệu hệ thống (JSON)!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = StorageService.importBackup(content);
      if (success) {
        setSuccessMsg('Đã khôi phục dữ liệu thành công từ tệp sao lưu!');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setImportError('Tệp sao lưu không đúng cấu trúc hoặc bị lỗi!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-3">
        <h3 className="font-bold text-base text-slate-900">Hồ Sơ Giáo Viên & Quản Lý Dữ Liệu</h3>
        <p className="text-xs text-slate-500">
          Chỉnh sửa thông tin trường lớp, quản lý sao lưu hoặc khôi phục dữ liệu demo
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {importError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{importError}</span>
        </div>
      )}

      {/* Teacher Profile Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
          <User className="w-4 h-4 text-blue-600" />
          <span>Thông Tin Cô Giáo & Đơn Vị Giảng Dạy</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên giáo viên</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Chức danh nghề nghiệp</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Trường học</label>
            <input
              type="text"
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              required
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Địa phương</label>
            <input
              type="text"
              value={`${formData.district}, ${formData.province}`}
              onChange={(e) => {
                const parts = e.target.value.split(',');
                setFormData({ ...formData, district: parts[0]?.trim() || '', province: parts[1]?.trim() || '' });
              }}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Lớp chủ nhiệm & giảng dạy</label>
            <input
              type="text"
              value={formData.className}
              onChange={(e) => setFormData({ ...formData, className: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Năm học</label>
            <input
              type="text"
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bộ sách giáo khoa mặc định</label>
            <select
              value={formData.defaultBookSet}
              onChange={(e) => setFormData({ ...formData, defaultBookSet: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white"
            >
              <option value="Kết nối tri thức với cuộc sống">Kết nối tri thức với cuộc sống</option>
              <option value="Chân trời sáng tạo">Chân trời sáng tạo</option>
              <option value="Cánh diều">Cánh diều</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Môn dạy chính</label>
            <input
              type="text"
              value={formData.mainSubject}
              onChange={(e) => setFormData({ ...formData, mainSubject: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Thông điệp giáo dục / Phương châm</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={2}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden resize-none"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Lưu Thông Tin Hồ Sơ</span>
          </button>
        </div>
      </form>

      {/* Data Management & Backup */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
          <Database className="w-4 h-4 text-indigo-600" />
          <span>Quản Lý Dữ Liệu & Sao Lưu</span>
        </h4>

        <p className="text-xs text-slate-600 leading-relaxed">
          Toàn bộ kế hoạch bài dạy, học liệu, ngân hàng câu hỏi trò chơi và nhận xét học sinh được lưu trữ an toàn ngay trên trình duyệt máy tính của cô giáo. Cô có thể sao lưu tệp JSON để mang sang máy tính khác hoặc nộp minh chứng cho Ban giám hiệu.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Xuất bản sao lưu dữ liệu (JSON)</span>
          </button>

          <label className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all">
            <Upload className="w-4 h-4" />
            <span>Khôi phục từ tệp sao lưu JSON</span>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Khôi phục lại toàn bộ dữ liệu demo lớp 4C chuẩn ban đầu?')) {
                onResetAllData();
                setSuccessMsg('Đã khôi phục toàn bộ dữ liệu minh họa lớp 4C gốc!');
                setTimeout(() => window.location.reload(), 1000);
              }
            }}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Đặt lại dữ liệu mẫu gốc</span>
          </button>
        </div>
      </div>

      {/* Privacy and Child Safety Policy */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-600">
        <h4 className="font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Chính Sách Bảo Vệ Quyền Riêng Tư Của Trẻ Em & Tuân Thủ Đạo Đức AI</span>
        </h4>
        <p className="leading-relaxed">
          - Ứng dụng tuân thủ nghiêm ngặt Luật Trẻ em Việt Nam và các hướng dẫn về an toàn số học đường.
        </p>
        <p className="leading-relaxed">
          - Dữ liệu học sinh chỉ sử dụng mã nội bộ (HS01, HS02...) và tên thông thường để hiển thị sư phạm trong lớp, tuyệt đối không lưu trữ hay gửi bất kì thông tin nhạy cảm nào như Căn cước công dân, ngày tháng năm sinh, địa chỉ nhà riêng hay số điện thoại của học sinh lên máy chủ công cộng.
        </p>
        <p className="leading-relaxed">
          - Mô hình Gemini AI chỉ xử lý yêu cầu sư phạm và tạo học liệu thô; giáo viên luôn là người chủ trì kiểm duyệt trước khi áp dụng vào giảng dạy thực tế.
        </p>
      </div>
    </div>
  );
};
