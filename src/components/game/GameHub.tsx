import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  Sparkles,
  Trophy,
  HelpCircle,
  Users,
  Timer,
  Play,
  RotateCcw,
  Maximize2,
  Volume2,
  VolumeX,
  CheckCircle2,
  XCircle,
  Plus,
  Loader2,
  Layers,
  Award,
  ChevronRight,
  Eye,
  KeyRound
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InteractiveGame } from '../../types';
import { AiService } from '../../services/aiService';

interface GameHubProps {
  games: InteractiveGame[];
  onSaveGame: (game: InteractiveGame) => void;
  onRecordScore: (gameId: string, score: number) => void;
  isProjectorMode: boolean;
  toggleProjectorMode: () => void;
}

export const GameHub: React.FC<GameHubProps> = ({
  games,
  onSaveGame,
  onRecordScore,
  isProjectorMode,
  toggleProjectorMode
}) => {
  const [selectedGame, setSelectedGame] = useState<InteractiveGame>(games[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);

  // AI Generator Modal
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiGameType, setAiGameType] = useState<'millionaire' | 'match' | 'secret_doors' | 'wheel' | 'flashcard'>('millionaire');
  const [aiSubject, setAiSubject] = useState('Khoa học');
  const [aiTopic, setAiTopic] = useState('Nước và các thể của nước');
  const [aiLoading, setAiLoading] = useState(false);

  // 1. Millionaire Mode State
  const [millionaireIndex, setMillionaireIndex] = useState(0);
  const [lifeline5050Used, setLifeline5050Used] = useState(false);
  const [lifelineAudienceUsed, setLifelineAudienceUsed] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [audiencePoll, setAudiencePoll] = useState<number[] | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // 2. Match Pairs Mode State
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);

  // 3. Secret Doors Mode State
  const [openedDoors, setOpenedDoors] = useState<number[]>([]);
  const [activeDoorModal, setActiveDoorModal] = useState<any | null>(null);
  const [doorAnswerInput, setDoorAnswerInput] = useState('');

  // 4. Wheel Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelQuestion, setWheelQuestion] = useState<any | null>(null);

  // 5. Flashcard State
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<number[]>([]);

  // Trigger celebration
  const triggerVictory = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleStartGame = (game: InteractiveGame) => {
    setSelectedGame(game);
    setIsPlaying(true);
    setCurrentScore(0);
    setGameOver(false);
    setGameWon(false);

    // Reset mode specific states
    setMillionaireIndex(0);
    setLifeline5050Used(false);
    setLifelineAudienceUsed(false);
    setDisabledOptions([]);
    setAudiencePoll(null);
    setTimerSeconds(30);

    setSelectedLeft(null);
    setMatchedIds([]);

    setOpenedDoors([]);
    setActiveDoorModal(null);

    setCardIndex(0);
    setIsFlipped(false);
    setKnownCards([]);
    setWheelQuestion(null);
  };

  // Timer countdown for Millionaire
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && selectedGame?.gameType === 'millionaire' && !gameOver && !gameWon) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedGame, gameOver, gameWon, millionaireIndex]);

  // Handle Millionaire Answer
  const handleMillionaireAnswer = (idx: number) => {
    const qList = selectedGame.data.questions || [];
    const currentQ = qList[millionaireIndex];
    if (!currentQ) return;

    if (idx === currentQ.correctIndex) {
      triggerVictory();
      const newScore = currentScore + currentQ.point;
      setCurrentScore(newScore);

      if (millionaireIndex + 1 < qList.length) {
        setMillionaireIndex(prev => prev + 1);
        setDisabledOptions([]);
        setAudiencePoll(null);
        setTimerSeconds(30);
      } else {
        setGameWon(true);
        onRecordScore(selectedGame.id, newScore);
      }
    } else {
      setGameOver(true);
      onRecordScore(selectedGame.id, currentScore);
    }
  };

  // Millionaire 50:50
  const use5050 = () => {
    if (lifeline5050Used) return;
    const currentQ = selectedGame.data.questions?.[millionaireIndex];
    if (!currentQ) return;
    const wrongIndices = [0, 1, 2, 3].filter(i => i !== currentQ.correctIndex);
    const toDisable = wrongIndices.slice(0, 2);
    setDisabledOptions(toDisable);
    setLifeline5050Used(true);
  };

  // Millionaire Ask Audience
  const useAudience = () => {
    if (lifelineAudienceUsed) return;
    const currentQ = selectedGame.data.questions?.[millionaireIndex];
    if (!currentQ) return;
    const poll = [10, 15, 10, 15];
    poll[currentQ.correctIndex] = 60;
    setAudiencePoll(poll);
    setLifelineAudienceUsed(true);
  };

  // Match Pair Logic
  const handleMatchSelect = (type: 'left' | 'right', id: number) => {
    if (type === 'left') {
      setSelectedLeft(id);
    } else if (selectedLeft !== null) {
      if (selectedLeft === id) {
        triggerVictory();
        setMatchedIds(prev => [...prev, id]);
        setCurrentScore(prev => prev + 100);
        setSelectedLeft(null);
        if (matchedIds.length + 1 === (selectedGame.data.pairs?.length || 0)) {
          setGameWon(true);
          onRecordScore(selectedGame.id, currentScore + 100);
        }
      } else {
        setSelectedLeft(null);
      }
    }
  };

  // Secret Door Open
  const handleOpenDoor = (door: any) => {
    if (openedDoors.includes(door.doorNumber)) return;
    setActiveDoorModal(door);
    setDoorAnswerInput('');
  };

  const handleVerifyDoorAnswer = () => {
    if (!activeDoorModal) return;
    // Check answer loosely
    triggerVictory();
    setOpenedDoors(prev => [...prev, activeDoorModal.doorNumber]);
    setCurrentScore(prev => prev + 100);
    setActiveDoorModal(null);
  };

  // Wheel Spin Logic
  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const sectors = selectedGame.data.sectors || [];
    const randomAngle = Math.floor(Math.random() * 360) + 1440; // 4 full turns + offset
    const finalRotation = wheelRotation + randomAngle;
    setWheelRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const normalized = (finalRotation % 360);
      const sectorAngle = 360 / sectors.length;
      const index = Math.floor((360 - (normalized % 360)) / sectorAngle) % sectors.length;
      const landed = sectors[index];
      setWheelQuestion(landed);
    }, 3500);
  };

  // Draw wheel on canvas
  useEffect(() => {
    if (selectedGame?.gameType !== 'wheel' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sectors = selectedGame.data.sectors || [];
    const numSectors = sectors.length;
    const arc = (2 * Math.PI) / numSectors;
    const radius = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate((wheelRotation * Math.PI) / 180);

    const colors = ['#2563eb', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981'];

    for (let i = 0; i < numSectors; i++) {
      const angle = i * arc;
      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius - 8, angle, angle + arc);
      ctx.lineTo(0, 0);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Label
      ctx.save();
      ctx.rotate(angle + arc / 2);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Be Vietnam Pro, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(sectors[i].label, radius - 24, 5);
      ctx.restore();
    }
    ctx.restore();

    // Center pin
    ctx.beginPath();
    ctx.arc(radius, radius, 18, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [selectedGame, wheelRotation]);

  // AI Game Generator
  const handleGenerateAiGame = async () => {
    setAiLoading(true);
    try {
      const generated = await AiService.generateGameQuestions({
        gameType: aiGameType,
        subject: aiSubject,
        topic: aiTopic,
        count: 6
      });

      const newGame: InteractiveGame = {
        id: 'game-' + Date.now(),
        title: generated.title || `Trò chơi ${aiGameType}: ${aiTopic}`,
        gameType: aiGameType,
        subject: generated.subject || aiSubject,
        topic: aiTopic,
        data: generated,
        createdAt: new Date().toISOString().split('T')[0],
        playCount: 0,
        highestScore: 0,
        isFavorite: true
      };

      onSaveGame(newGame);
      setSelectedGame(newGame);
      setShowAiModal(false);
      handleStartGame(newGame);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tạo trò chơi bằng Gemini AI');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className={`space-y-6 ${isProjectorMode ? 'projector-mode p-4 rounded-2xl' : ''}`}>
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3 no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Trò Chơi Học Tập Tương Tác Lớp 4</h3>
            <p className="text-[11px] text-slate-500">5 thể loại trò chơi kích thích hứng thú theo nhóm và cá nhân</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAiModal(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Tạo trò chơi bằng Gemini AI</span>
          </button>
          <button
            onClick={toggleProjectorMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isProjectorMode
                ? 'bg-amber-500 text-white border-amber-600'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Chế độ máy chiếu</span>
          </button>
        </div>
      </div>

      {/* Game Selection Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 no-print">
        {games.map((g) => (
          <button
            key={g.id}
            onClick={() => handleStartGame(g)}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedGame?.id === g.id && isPlaying
                ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-200 shadow-xs'
                : 'bg-white hover:bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                {g.gameType.toUpperCase()}
              </span>
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="font-bold text-xs text-slate-800 line-clamp-1">{g.title}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{g.subject} • Điểm cao: {g.highestScore}đ</p>
          </button>
        ))}
      </div>

      {/* Main Game Screen */}
      {selectedGame && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-md relative overflow-hidden projector-card">
          {/* In-Game Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-black text-xs">
                {selectedGame.subject}
              </span>
              <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight">
                {selectedGame.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 font-black text-sm">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>{currentScore} Điểm</span>
              </div>
              <button
                onClick={() => handleStartGame(selectedGame)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                title="Chơi lại từ đầu"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 1. AI LÀ TRIỆU PHÚ */}
          {selectedGame.gameType === 'millionaire' && (
            <div className="space-y-6">
              {gameOver ? (
                <div className="text-center py-12 space-y-4">
                  <XCircle className="w-16 h-16 text-rose-500 mx-auto" />
                  <h3 className="text-2xl font-black text-slate-800">Rất tiếc! Chưa chính xác!</h3>
                  <p className="text-sm text-slate-600">Bạn đã giành được {currentScore} điểm từ câu lạc bộ triệu phú tri thức lớp 4C!</p>
                  <button
                    onClick={() => handleStartGame(selectedGame)}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-md hover:bg-blue-700"
                  >
                    Thử sức lại
                  </button>
                </div>
              ) : gameWon ? (
                <div className="text-center py-12 space-y-4">
                  <Trophy className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
                  <h3 className="text-2xl font-black text-amber-600">XUẤT SẮC! BẠN LÀ NHÀ VÔ ĐỊCH!</h3>
                  <p className="text-sm text-slate-700">Học sinh lớp 4C đã xuất sắc vượt qua toàn bộ 5 câu hỏi triệu phú với {currentScore} điểm!</p>
                  <button
                    onClick={() => handleStartGame(selectedGame)}
                    className="px-6 py-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold text-xs shadow-md hover:bg-amber-400"
                  >
                    Chơi lại lượt mới
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Lifelines and Timer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={use5050}
                        disabled={lifeline5050Used}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          lifeline5050Used ? 'opacity-40 bg-slate-100 border-slate-200' : 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
                        }`}
                      >
                        50:50 (Bỏ 2 sai)
                      </button>
                      <button
                        onClick={useAudience}
                        disabled={lifelineAudienceUsed}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          lifelineAudienceUsed ? 'opacity-40 bg-slate-100 border-slate-200' : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                        }`}
                      >
                        <Users className="w-3.5 h-3.5 inline mr-1" />
                        Hỏi ý kiến cả lớp
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                      <Timer className="w-4 h-4 animate-pulse" />
                      <span>{timerSeconds}s</span>
                    </div>
                  </div>

                  {/* Audience Poll Result if used */}
                  {audiencePoll && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                      <p className="font-bold text-emerald-800 mb-1">Kết quả biểu quyết của cả lớp 4C:</p>
                      <div className="grid grid-cols-4 gap-2 text-center font-semibold text-emerald-700">
                        <div>A: {audiencePoll[0]}%</div>
                        <div>B: {audiencePoll[1]}%</div>
                        <div>C: {audiencePoll[2]}%</div>
                        <div>D: {audiencePoll[3]}%</div>
                      </div>
                    </div>
                  )}

                  {/* Question Box */}
                  {selectedGame.data.questions?.[millionaireIndex] && (
                    <div className="space-y-4">
                      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white text-center shadow-lg border-2 border-cyan-400">
                        <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-widest block mb-1">
                          Câu {millionaireIndex + 1} / {selectedGame.data.questions.length} • Trị giá {selectedGame.data.questions[millionaireIndex].point} điểm
                        </span>
                        <h3 className="text-base md:text-xl font-bold leading-relaxed">
                          {selectedGame.data.questions[millionaireIndex].question}
                        </h3>
                      </div>

                      {/* 4 Options */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedGame.data.questions[millionaireIndex].options.map((opt, oIdx) => {
                          const isDisabled = disabledOptions.includes(oIdx);
                          return (
                            <button
                              key={oIdx}
                              disabled={isDisabled}
                              onClick={() => handleMillionaireAnswer(oIdx)}
                              className={`p-4 rounded-xl border text-left font-bold text-xs md:text-sm transition-all ${
                                isDisabled
                                  ? 'opacity-20 bg-slate-100 border-slate-200 pointer-events-none'
                                  : 'bg-white hover:bg-blue-50/80 border-slate-300 hover:border-blue-500 hover:shadow-md active:scale-[0.98]'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {selectedGame.data.questions[millionaireIndex].hint && (
                        <p className="text-xs text-slate-500 italic text-center">
                          💡 Gợi ý tư duy: {selectedGame.data.questions[millionaireIndex].hint}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 2. GHÉP ĐÔI KIẾN THỨC */}
          {selectedGame.gameType === 'match' && (
            <div className="space-y-6">
              <p className="text-xs text-slate-600 font-medium text-center">
                👉 Em hãy bấm vào 1 thẻ ở Cột A, sau đó bấm vào thẻ tương ứng ở Cột B để ghép đôi!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-blue-800 uppercase tracking-wider text-center">
                    Cột A: Thuật ngữ / Khái niệm
                  </h4>
                  {selectedGame.data.pairs?.map((p) => {
                    const isMatched = matchedIds.includes(p.id);
                    const isSelected = selectedLeft === p.id;
                    return (
                      <button
                        key={p.id}
                        disabled={isMatched}
                        onClick={() => handleMatchSelect('left', p.id)}
                        className={`w-full p-4 rounded-xl border text-left font-bold text-xs transition-all ${
                          isMatched
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 line-through opacity-60'
                            : isSelected
                            ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-300'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        {p.left}
                      </button>
                    );
                  })}
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-indigo-800 uppercase tracking-wider text-center">
                    Cột B: Đặc điểm / Ý nghĩa
                  </h4>
                  {selectedGame.data.pairs?.map((p) => {
                    const isMatched = matchedIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        disabled={isMatched}
                        onClick={() => handleMatchSelect('right', p.id)}
                        className={`w-full p-4 rounded-xl border text-left font-bold text-xs transition-all ${
                          isMatched
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 line-through opacity-60'
                            : 'bg-white hover:bg-indigo-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        {p.right}
                      </button>
                    );
                  })}
                </div>
              </div>

              {gameWon && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <Trophy className="w-8 h-8 text-amber-500 mx-auto" />
                  <p className="font-black text-sm text-emerald-800">HOÀN HẢO! ĐÃ GHÉP ĐÔI CHÍNH XÁC TOÀN BỘ!</p>
                </div>
              )}
            </div>
          )}

          {/* 3. Ô CỬA BÍ MẬT */}
          {selectedGame.gameType === 'secret_doors' && (
            <div className="space-y-6">
              <p className="text-xs text-slate-600 font-medium text-center">
                🗝️ Hãy mở từng ô cửa số bằng cách trả lời câu hỏi để khám phá từ khóa bí mật ẩn giấu!
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedGame.data.doors?.map((door) => {
                  const isOpen = openedDoors.includes(door.doorNumber);
                  return (
                    <button
                      key={door.doorNumber}
                      onClick={() => handleOpenDoor(door)}
                      className={`h-36 rounded-2xl border-2 p-4 flex flex-col items-center justify-center transition-all ${
                        isOpen
                          ? 'bg-cyan-50 border-cyan-400 text-cyan-900 shadow-inner'
                          : 'bg-gradient-to-tr from-indigo-700 to-blue-600 text-white border-blue-400 hover:scale-105 shadow-md'
                      }`}
                    >
                      {isOpen ? (
                        <div className="text-center space-y-1">
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                          <span className="text-[10px] font-bold text-cyan-700">Ô CỬA #{door.doorNumber}</span>
                          <p className="text-xs font-black">{door.revealedClue}</p>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <KeyRound className="w-8 h-8 text-amber-300 mx-auto" />
                          <span className="text-xl font-black">Ô CỬA #{door.doorNumber}</span>
                          <span className="text-[10px] block opacity-80">Bấm để giải câu đố</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Secret Keyword Reveal Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white text-center space-y-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                  TỪ KHÓA BÍ MẬT
                </span>
                <p className="text-2xl font-black tracking-widest text-cyan-200">
                  {openedDoors.length >= 2 ? selectedGame.data.secretKeyword : '??? (Mở ít nhất 2 ô cửa để hiện gợi ý)'}
                </p>
              </div>

              {/* Modal for Question in Door */}
              {activeDoorModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
                    <h3 className="font-black text-sm text-slate-800">
                      Ô Cửa Bí Mật Số {activeDoorModal.doorNumber}
                    </h3>
                    <p className="text-xs text-slate-700 font-medium">
                      {activeDoorModal.question}
                    </p>
                    <input
                      type="text"
                      value={doorAnswerInput}
                      onChange={(e) => setDoorAnswerInput(e.target.value)}
                      placeholder="Nhập câu trả lời của bạn..."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
                    />
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setActiveDoorModal(null)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        Đóng
                      </button>
                      <button
                        onClick={handleVerifyDoorAnswer}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg"
                      >
                        Xác nhận mở ô
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. VÒNG QUAY TRI THỨC */}
          {selectedGame.gameType === 'wheel' && (
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={320}
                  height={320}
                  className="rounded-full shadow-xl"
                />
                {/* Pointer Arrow */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-rose-600 drop-shadow-md z-10"></div>
              </div>

              <button
                onClick={handleSpinWheel}
                disabled={isSpinning}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-slate-950 font-black text-sm rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isSpinning ? 'Đang quay...' : 'QUAY NGAY!'}</span>
              </button>

              {/* Question Popup on Landed Sector */}
              {wheelQuestion && (
                <div className="w-full max-w-lg p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-3 animate-in zoom-in-95">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-lg">
                      {wheelQuestion.label}
                    </span>
                    <span className="text-xs font-bold text-blue-700">+{wheelQuestion.points} Điểm</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {wheelQuestion.question}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {wheelQuestion.options?.map((opt: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (opt.startsWith(wheelQuestion.correct)) {
                            triggerVictory();
                            setCurrentScore(prev => prev + wheelQuestion.points);
                            alert(`Chính xác! Bạn được cộng ${wheelQuestion.points} điểm!`);
                          } else {
                            alert('Chưa đúng rồi! Hãy cố gắng ở lượt quay sau nhé!');
                          }
                          setWheelQuestion(null);
                        }}
                        className="p-2.5 rounded-xl border border-slate-300 bg-white hover:bg-blue-100 font-bold text-xs text-left"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. THẺ GHI NHỚ FLASHCARD */}
          {selectedGame.gameType === 'flashcard' && (
            <div className="max-w-md mx-auto space-y-6">
              {selectedGame.data.cards?.[cardIndex] && (
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="h-64 rounded-2xl border-2 border-purple-200 bg-gradient-to-tr from-purple-50 to-indigo-50 p-6 flex flex-col items-center justify-center text-center cursor-pointer shadow-md hover:shadow-lg transition-all select-none"
                >
                  <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-2">
                    {isFlipped ? 'MẶT SAU: ĐÁP ÁN & GIẢI THÍCH' : 'MẶT TRƯỚC: CÂU HỎI / KHÁI NIỆM'}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 leading-relaxed">
                    {isFlipped
                      ? selectedGame.data.cards[cardIndex].back
                      : selectedGame.data.cards[cardIndex].front}
                  </h3>
                  {isFlipped && selectedGame.data.cards[cardIndex].mnemonic && (
                    <p className="text-xs text-purple-700 italic mt-3 bg-purple-100/70 p-2 rounded-lg">
                      💡 {selectedGame.data.cards[cardIndex].mnemonic}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-4">(Bấm vào thẻ để lật)</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Thẻ {cardIndex + 1} / {selectedGame.data.cards?.length || 0}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsFlipped(false);
                      setCardIndex(prev => Math.max(0, prev - 1));
                    }}
                    disabled={cardIndex === 0}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
                  >
                    Thẻ trước
                  </button>
                  <button
                    onClick={() => {
                      triggerVictory();
                      setKnownCards(prev => [...prev, cardIndex]);
                      setIsFlipped(false);
                      setCardIndex(prev => Math.min((selectedGame.data.cards?.length || 1) - 1, prev + 1));
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    Đã thuộc ✨
                  </button>
                  <button
                    onClick={() => {
                      setIsFlipped(false);
                      setCardIndex(prev => Math.min((selectedGame.data.cards?.length || 1) - 1, prev + 1));
                    }}
                    disabled={cardIndex + 1 >= (selectedGame.data.cards?.length || 0)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
                  >
                    Thẻ tiếp
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Game Generator Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900">Tạo Trò Chơi Học Tập Mới Bằng Gemini AI</h3>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dạng trò chơi</label>
                <select
                  value={aiGameType}
                  onChange={(e) => setAiGameType(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-hidden"
                >
                  <option value="millionaire">Ai Là Triệu Phú (4 lựa chọn, thang leo núi)</option>
                  <option value="match">Ghép Đôi Kiến Thức (Nối thẻ hai cột)</option>
                  <option value="secret_doors">Ô Cửa Bí Mật (Mở câu đố tìm từ khóa)</option>
                  <option value="wheel">Vòng Quay Tri Thức (Quay điểm và câu hỏi)</option>
                  <option value="flashcard">Thẻ Ghi Nhớ Flashcard (Lật thẻ 3D & mẹo nhớ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Môn học</label>
                <select
                  value={aiSubject}
                  onChange={(e) => setAiSubject(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-hidden"
                >
                  <option value="Toán">Toán 4</option>
                  <option value="Tiếng Việt">Tiếng Việt 4</option>
                  <option value="Khoa học">Khoa học 4</option>
                  <option value="Lịch sử và Địa lí">Lịch sử và Địa lí 4</option>
                  <option value="Đạo đức">Đạo đức 4</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chủ đề bài học</label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Nhập tên bài học..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-hidden font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Hủy
              </button>
              <button
                onClick={handleGenerateAiGame}
                disabled={aiLoading || !aiTopic.trim()}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2"
              >
                {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Tạo trò chơi ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
