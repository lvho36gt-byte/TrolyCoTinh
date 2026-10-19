import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storageService';
import {
  TeacherProfile,
  Student,
  LessonPlan,
  LearningMaterial,
  InteractiveGame,
  StudentFeedback,
  Assignment,
  AssignmentSubmission,
  ActivityLog,
  UserRole
} from './types';

// Layout
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Modals
import { AiCommandModal } from './components/modals/AiCommandModal';

// Modules
import { Dashboard } from './components/dashboard/Dashboard';
import { LessonPlanner } from './components/lesson/LessonPlanner';
import { MaterialStudio } from './components/material/MaterialStudio';
import { GameHub } from './components/game/GameHub';
import { StudentEvaluator } from './components/evaluation/StudentEvaluator';
import { DigitalClassroom } from './components/classroom/DigitalClassroom';
import { EducationalChatbot } from './components/chat/EducationalChatbot';
import { SmartLibrary } from './components/library/SmartLibrary';
import { AwardDossier } from './components/dossier/AwardDossier';
import { ProfileSettings } from './components/profile/ProfileSettings';
import { StudentPortal } from './components/student/StudentPortal';

export default function App() {
  // Initialize storage
  useEffect(() => {
    StorageService.initialize();
  }, []);

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [role, setRole] = useState<UserRole>('teacher');
  const [isProjectorMode, setIsProjectorMode] = useState<boolean>(false);
  const [isQuickAiModalOpen, setIsQuickAiModalOpen] = useState<boolean>(false);

  // App Data State
  const [profile, setProfile] = useState<TeacherProfile>(() => StorageService.getProfile());
  const [students, setStudents] = useState<Student[]>(() => StorageService.getStudents());
  const [plans, setPlans] = useState<LessonPlan[]>(() => StorageService.getLessonPlans());
  const [materials, setMaterials] = useState<LearningMaterial[]>(() => StorageService.getMaterials());
  const [games, setGames] = useState<InteractiveGame[]>(() => StorageService.getGames());
  const [feedbacks, setFeedbacks] = useState<StudentFeedback[]>(() => StorageService.getFeedbacks());
  const [assignments, setAssignments] = useState<Assignment[]>(() => StorageService.getAssignments());
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => StorageService.getSubmissions());
  const [logs, setLogs] = useState<ActivityLog[]>(() => StorageService.getLogs());

  // Reload logs
  const refreshLogs = () => {
    setLogs(StorageService.getLogs());
  };

  // CRUD Handlers
  const handleUpdateProfile = (newProfile: TeacherProfile) => {
    StorageService.saveProfile(newProfile);
    setProfile(newProfile);
    refreshLogs();
  };

  const handleSavePlan = (plan: LessonPlan) => {
    StorageService.saveLessonPlan(plan);
    setPlans(StorageService.getLessonPlans());
    refreshLogs();
  };

  const handleDeletePlan = (id: string) => {
    StorageService.deleteLessonPlan(id);
    setPlans(StorageService.getLessonPlans());
    refreshLogs();
  };

  const handleSaveMaterial = (mat: LearningMaterial) => {
    StorageService.saveMaterial(mat);
    setMaterials(StorageService.getMaterials());
    refreshLogs();
  };

  const handleDeleteMaterial = (id: string) => {
    StorageService.deleteMaterial(id);
    setMaterials(StorageService.getMaterials());
    refreshLogs();
  };

  const handleSaveGame = (game: InteractiveGame) => {
    StorageService.saveGame(game);
    setGames(StorageService.getGames());
    refreshLogs();
  };

  const handleDeleteGame = (id: string) => {
    StorageService.deleteGame(id);
    setGames(StorageService.getGames());
    refreshLogs();
  };

  const handleRecordGameScore = (gameId: string, score: number) => {
    StorageService.recordGamePlay(gameId, score);
    setGames(StorageService.getGames());
    refreshLogs();
  };

  const handleSaveFeedback = (feedback: StudentFeedback) => {
    StorageService.saveFeedback(feedback);
    setFeedbacks(StorageService.getFeedbacks());
    refreshLogs();
  };

  const handleUpdateAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    StorageService.updateStudentAttendance(studentId, status);
    setStudents(StorageService.getStudents());
    refreshLogs();
  };

  const handleSaveAssignment = (assign: Assignment) => {
    StorageService.saveAssignment(assign);
    setAssignments(StorageService.getAssignments());
    refreshLogs();
  };

  const handleSubmitAssignment = (sub: AssignmentSubmission) => {
    StorageService.saveSubmission(sub);
    setSubmissions(StorageService.getSubmissions());
    refreshLogs();
  };

  const handleResetAllData = () => {
    StorageService.resetAllData();
    setProfile(StorageService.getProfile());
    setStudents(StorageService.getStudents());
    setPlans(StorageService.getLessonPlans());
    setMaterials(StorageService.getMaterials());
    setGames(StorageService.getGames());
    setFeedbacks(StorageService.getFeedbacks());
    setAssignments(StorageService.getAssignments());
    setSubmissions(StorageService.getSubmissions());
    setLogs(StorageService.getLogs());
  };

  // AI Command Router execution
  const handleExecuteAiAction = (action: string, result: any) => {
    if (action === 'lesson_plan') {
      setCurrentTab('lesson');
    } else if (action === 'material') {
      setCurrentTab('material');
    } else if (action === 'game') {
      setCurrentTab('game');
    } else if (action === 'feedback') {
      setCurrentTab('evaluation');
    } else if (action === 'chat') {
      setCurrentTab('chat');
    } else if (action === 'classroom') {
      setCurrentTab('classroom');
    }
  };

  const tabTitles: Record<string, string> = {
    dashboard: 'Tổng Quan & AI Command Center',
    lesson: 'Phân Hệ 1: Trợ Lý Soạn Giảng AI',
    material: 'Phân Hệ 2: Xưởng Tạo Học Liệu AI',
    game: 'Phân Hệ 3: Trò Chơi Học Tập Tương Tác',
    evaluation: 'Phân Hệ 4: Nhận Xét Học Sinh (Thông tư 27)',
    classroom: 'Phân Hệ 5: Lớp Học Số 4C',
    chat: 'Phân Hệ 6: Chatbot Học Tập',
    library: 'Phân Hệ 7: Thư Viện Thông Minh',
    dossier: 'Phân Hệ 8: Hồ Sơ Dự Thi & Minh Chứng 2026',
    settings: 'Phân Hệ 9: Hồ Sơ Giáo Viên & Cài Đặt'
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-800 ${isProjectorMode ? 'projector-mode' : ''}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        role={role}
        onOpenQuickAi={() => setIsQuickAiModalOpen(true)}
        onResetData={handleResetAllData}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <Header
          profile={profile}
          role={role}
          setRole={setRole}
          logs={logs}
          onOpenQuickAi={() => setIsQuickAiModalOpen(true)}
          onOpenProfile={() => setCurrentTab('settings')}
          isProjectorMode={isProjectorMode}
          toggleProjectorMode={() => setIsProjectorMode(!isProjectorMode)}
          currentTabName={tabTitles[currentTab] || 'Trợ Lý AI Cho Giáo Viên Lớp 4'}
        />

        {/* View Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* If role is student and on dashboard, render StudentPortal */}
          {role === 'student' && currentTab === 'dashboard' ? (
            <StudentPortal
              student={students[0] || { id: 'hs-01', code: 'HS01', name: 'Nguyễn Minh Quân', gender: 'nam', team: 'Tổ 1', attendanceStatus: 'present', mathLevel: 'T', vietnameseLevel: 'T', strengths: '', needsSupport: '', totalPoints: 120, badges: ['Toán học nhí'] }}
              assignments={assignments}
              games={games}
              feedbacks={feedbacks}
              onTakeQuiz={(a) => {
                setCurrentTab('classroom');
              }}
              onPlayGame={(g) => {
                setCurrentTab('game');
              }}
              onChatWithBee={() => {
                setCurrentTab('chat');
              }}
            />
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <Dashboard
                  profile={profile}
                  plans={plans}
                  materials={materials}
                  games={games}
                  students={students}
                  logs={logs}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                  onOpenQuickAiWithPrompt={(prompt) => {
                    setIsQuickAiModalOpen(true);
                  }}
                />
              )}

              {currentTab === 'lesson' && (
                <LessonPlanner
                  plans={plans}
                  onSavePlan={handleSavePlan}
                  onDeletePlan={handleDeletePlan}
                />
              )}

              {currentTab === 'material' && (
                <MaterialStudio
                  materials={materials}
                  onSaveMaterial={handleSaveMaterial}
                  onDeleteMaterial={handleDeleteMaterial}
                />
              )}

              {currentTab === 'game' && (
                <GameHub
                  games={games}
                  onSaveGame={handleSaveGame}
                  onRecordScore={handleRecordGameScore}
                  isProjectorMode={isProjectorMode}
                  toggleProjectorMode={() => setIsProjectorMode(!isProjectorMode)}
                />
              )}

              {currentTab === 'evaluation' && (
                <StudentEvaluator
                  students={students}
                  feedbacks={feedbacks}
                  onSaveFeedback={handleSaveFeedback}
                />
              )}

              {currentTab === 'classroom' && (
                <DigitalClassroom
                  students={students}
                  assignments={assignments}
                  submissions={submissions}
                  role={role}
                  onUpdateAttendance={handleUpdateAttendance}
                  onSaveAssignment={handleSaveAssignment}
                  onSubmitAssignment={handleSubmitAssignment}
                />
              )}

              {currentTab === 'chat' && <EducationalChatbot />}

              {currentTab === 'library' && (
                <SmartLibrary
                  plans={plans}
                  materials={materials}
                  games={games}
                  onDeletePlan={handleDeletePlan}
                  onDeleteMaterial={handleDeleteMaterial}
                  onDeleteGame={handleDeleteGame}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                />
              )}

              {currentTab === 'dossier' && (
                <AwardDossier
                  plans={plans}
                  materials={materials}
                  games={games}
                  students={students}
                  submissions={submissions}
                />
              )}

              {currentTab === 'settings' && (
                <ProfileSettings
                  profile={profile}
                  onUpdateProfile={handleUpdateProfile}
                  onResetAllData={handleResetAllData}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* AI Command Center Modal */}
      <AiCommandModal
        isOpen={isQuickAiModalOpen}
        onClose={() => setIsQuickAiModalOpen(false)}
        onExecuteAction={handleExecuteAiAction}
      />
    </div>
  );
}
