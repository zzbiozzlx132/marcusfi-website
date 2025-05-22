// src/components/TimerBlock.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Plus, Check, Clock, ListChecks, Settings as SettingsIcon, /* BellRing, */ ChevronDown, X as XIcon, Trash2, Volume2, Save, XCircle } from 'lucide-react'; // Removed BellRing
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  name: string;
  status: 'in_progress' | 'completed';
  cyclesCompleted: number;
  estimatedCycles: number;
}

interface TimerSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  cyclesBeforeLongBreak: number;
  includeMusic: boolean;
  alarmSoundRepeat: number;
  darkModeOnStart: boolean;
  selectedNotificationSound: string;
  currentMusicTrackIndex: number;
}

const NOTIFICATION_SOUNDS = [
  { name: "Thông báo 1", url: "/marcusfi-website/sound/ntf-snd-01.mp3" },
  { name: "Thông báo 2", url: "/marcusfi-website/sound/ntf-snd-02.mp3" },
  { name: "Thông báo 3", url: "/marcusfi-website/sound/ntf-snd-03.mp3" },
  { name: "Thông báo 4", url: "/marcusfi-website/sound/ntf-snd-04.mp3" },
  { name: "Thông báo 5", url: "/marcusfi-website/sound/ntf-snd-05.mp3" },
  { name: "Thông báo 6", url: "/marcusfi-website/sound/ntf-snd-06.mp3" },
];

const BACKGROUND_MUSIC_TRACKS = [
  { id: 'local_track1', title: 'Nhạc Nền 1', src: '/marcusfi-website/music1.mp3' },
  { id: 'local_track2', title: 'Nhạc Nền 2', src: '/marcusfi-website/music2.mp3' },
  { id: 'local_track3', title: 'Nhạc Nền 3', src: '/marcusfi-website/music3.mp3' },
  { id: 'local_track4', title: 'Nhạc Nền 4', src: '/marcusfi-website/music4.mp3' },
  { id: 'local_track5', title: 'Nhạc Nền 5', src: '/marcusfi-website/music5.mp3' },
  { id: 'local_track6', title: 'Nhạc Nền 6', src: '/marcusfi-website/music6.mp3' },
  { id: 'local_track7', title: 'Nhạc Nền 7', src: '/marcusfi-website/music7.mp3' },
  { id: 'local_track8', title: 'Nhạc Nền 8', src: '/marcusfi-website/music8.mp3' },
  { id: 'local_track9', title: 'Nhạc Nền 9', src: '/marcusfi-website/music9.mp3' },
  { id: 'local_track10', title: 'Nhạc Nền 10', src: '/marcusfi-website/music10.mp3' },
];

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  cyclesBeforeLongBreak: 4,
  includeMusic: false,
  alarmSoundRepeat: 1,
  darkModeOnStart: true,
  selectedNotificationSound: NOTIFICATION_SOUNDS[0].url,
  currentMusicTrackIndex: 0,
};

interface TimerBlockProps {
  setIsPageInFocusMode: (isFocus: boolean) => void;
}

// Specific type for items in the timeInputFields array
interface TimeInputFieldItem {
    label: string;
    field: 'workDuration' | 'shortBreakDuration' | 'longBreakDuration';
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: TimerSettings;
  onSaveSettings: (newSettings: TimerSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentSettings: initialSettings, onSaveSettings }) => {
  const [settingsData, setSettingsData] = useState<TimerSettings>(initialSettings);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setSettingsData(initialSettings);
  }, [initialSettings]);

  const handleChange = (field: keyof TimerSettings, value: string | number | boolean) => {
    let processedValue = value;
    if (typeof value === 'string' && (field === 'workDuration' || field === 'shortBreakDuration' || field === 'longBreakDuration' || field === 'cyclesBeforeLongBreak' || field === 'alarmSoundRepeat')) {
        let numericValue = parseInt(value, 10);
        if (isNaN(numericValue) || numericValue < 1) numericValue = 1;
        processedValue = numericValue;
    }

    if (field === 'alarmSoundRepeat' && typeof processedValue === 'number') {
      processedValue = Math.max(1, Math.min(5, processedValue));
    } else if ( (field === 'workDuration' || field === 'shortBreakDuration' || field === 'longBreakDuration' || field === 'cyclesBeforeLongBreak') && typeof processedValue === 'number' ) {
      processedValue = Math.max(1, processedValue);
    }
    // For boolean fields, processedValue remains boolean. For string fields, it remains string.
    setSettingsData(prev => ({ ...prev, [field]: processedValue }));
  };

  const handleSave = () => {
    onSaveSettings(settingsData);
    onClose();
  };

  const handlePreviewSound = () => {
    if (!previewAudioRef.current) {
      previewAudioRef.current = new Audio();
    }
    const soundUrl = new URL(settingsData.selectedNotificationSound, window.location.origin).href;
    previewAudioRef.current.src = soundUrl;
    previewAudioRef.current.play().catch(e => console.error("Lỗi nghe thử âm báo:", e.name, e.message));
  };

  if (!isOpen) return null;

  const timeInputFields: TimeInputFieldItem[] = [
    {label: 'Pomodoro', field: 'workDuration'},
    {label: 'Short Break', field: 'shortBreakDuration'},
    {label: 'Long Break', field: 'longBreakDuration'},
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Cài đặt Timer</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <XIcon size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
            {/* Timer Durations Section */}
            <div>
              <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                <Clock size={16} className="mr-1.5" />
                <span className="text-xs font-semibold uppercase tracking-wider">TIMER</span>
              </div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1.5">Time (minutes)</label>
              <div className="grid grid-cols-3 gap-x-3">
                {timeInputFields.map((item: TimeInputFieldItem) => ( // Explicitly type item here
                    <div key={item.field}>
                        <label htmlFor={item.field} className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">{item.label}</label>
                        <input 
                            type="number" 
                            id={item.field}
                            min="1" 
                            value={settingsData[item.field]} // This should now be fine as settingsData[item.field] is number
                            onChange={(e) => handleChange(item.field, e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-center"
                        />
                    </div>
                ))}
              </div>
            </div>
            
            {/* Notification Sound - Moved Up */}
            <div>
              <label htmlFor="notificationSound" className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Âm thanh thông báo</label>
              <div className="flex items-center space-x-2">
                <select
                  id="notificationSound"
                  value={settingsData.selectedNotificationSound}
                  onChange={(e) => handleChange('selectedNotificationSound', e.target.value)}
                  className="flex-grow px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                >
                  {NOTIFICATION_SOUNDS.map(sound => (
                    <option key={sound.url} value={sound.url}>{sound.name}</option>
                  ))}
                </select>
                <button
                  onClick={handlePreviewSound}
                  title="Nghe thử"
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                >
                  <Volume2 size={18} />
                </button>
              </div>
            </div>

            {/* Cycles before long break & Alarm repeat - In one row */}
            <div className="grid grid-cols-2 gap-x-3">
                <div>
                    <label htmlFor="cyclesBeforeLongBreak" className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Chu kỳ / Nghỉ dài</label>
                    <input type="number" id="cyclesBeforeLongBreak" min="1" value={settingsData.cyclesBeforeLongBreak}
                    onChange={(e) => handleChange('cyclesBeforeLongBreak', e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-center"/>
                </div>
                <div>
                    <label htmlFor="alarmRepeat" className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Số lần lặp âm báo (1-5)</label>
                    <input type="number" id="alarmRepeat" min="1" max="5" value={settingsData.alarmSoundRepeat}
                    onChange={(e) => handleChange('alarmSoundRepeat', e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-center"/>
                </div>
            </div>
            
            {/* Checkboxes */}
            <div className="flex items-center justify-between pt-2 space-x-4">
                <div className="flex items-center">
                    <input type="checkbox" id="modalIncludeMusic" checked={settingsData.includeMusic}
                    onChange={(e) => handleChange('includeMusic', e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-offset-0 focus:ring-1 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded"/>
                    <label htmlFor="modalIncludeMusic" className="ml-2 block text-sm text-gray-700 dark:text-gray-200">Nhạc nền (Work mode)</label>
                </div>
                <div className="flex items-center">
                    <input type="checkbox" id="modalDarkModeOnStart" checked={settingsData.darkModeOnStart}
                    onChange={(e) => handleChange('darkModeOnStart', e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-offset-0 focus:ring-1 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded"/>
                    <label htmlFor="modalDarkModeOnStart" className="ml-2 block text-sm text-gray-700 dark:text-gray-200">Dark Mode khi Start (Work)</label>
                </div>
            </div>
        </div>
        <button
            onClick={handleSave}
            className="w-full mt-6 py-2.5 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
            Lưu Cài Đặt
        </button>
      </motion.div>
    </motion.div>
  );
};


// ... (The rest of your TimerBlock component, ConfirmTaskActionModal, and TimerBlock implementation remains the same)
// Make sure to include the rest of the TimerBlock.tsx content here. For brevity, I'm only showing the changed SettingsModal and related types/constants.

interface ConfirmTaskActionModalProps {
    isOpen: boolean;
    taskName: string;
    onMarkAsCompleted: () => void;
    onDeletePermanently: () => void;
    onCancel: () => void;
}

const ConfirmTaskActionModal: React.FC<ConfirmTaskActionModalProps> = ({ isOpen, taskName, onMarkAsCompleted, onDeletePermanently, onCancel }) => {
    if (!isOpen) return null;
    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onCancel}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-lg shadow-xl w-full max-w-xs text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Hoàn Thành Công Việc!</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
                    Tuyệt vời! Bạn đã hoàn thành: <span className="font-medium text-purple-600 dark:text-purple-400">"{taskName}"</span>.
                    <br/>Chọn hành động tiếp theo:
                </p>
                <div className="space-y-2.5">
                    <button
                        onClick={onMarkAsCompleted}
                        className="w-full px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                        Đánh dấu Hoàn thành
                    </button>
                    <button
                        onClick={onDeletePermanently}
                        className="w-full px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition flex items-center justify-center"
                    >
                        <Trash2 size={16} className="mr-2"/> Xoá khỏi danh sách
                    </button>
                    <button onClick={onCancel} className="w-full mt-1 py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">Để sau</button>
                </div>
            </motion.div>
        </motion.div>
    );
};


const TimerBlock: React.FC<TimerBlockProps> = ({ setIsPageInFocusMode }) => {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const savedSettings = localStorage.getItem('timerSettings_v2');
    try {
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        const validatedSettings = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          selectedNotificationSound: parsed.selectedNotificationSound && NOTIFICATION_SOUNDS.some(s => s.url === parsed.selectedNotificationSound) ? parsed.selectedNotificationSound : DEFAULT_SETTINGS.selectedNotificationSound,
          currentMusicTrackIndex: typeof parsed.currentMusicTrackIndex === 'number' && parsed.currentMusicTrackIndex >=0 && parsed.currentMusicTrackIndex < BACKGROUND_MUSIC_TRACKS.length ? parsed.currentMusicTrackIndex : DEFAULT_SETTINGS.currentMusicTrackIndex,
          alarmSoundRepeat: typeof parsed.alarmSoundRepeat === 'number' ? Math.max(1, Math.min(5, parsed.alarmSoundRepeat)) : DEFAULT_SETTINGS.alarmSoundRepeat,
        };
        return validatedSettings;
      }
    } catch (error) {
      console.error("Lỗi parse settings từ localStorage:", error);
    }
    return DEFAULT_SETTINGS;
  });

  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentMode, setCurrentMode] = useState<'work' | 'short_break' | 'long_break'>('work');
  const [cycleCount, setCycleCount] = useState(0);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false); 

  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('timerTasks_v2');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks) as any[];
        if (Array.isArray(parsedTasks)) {
          const mappedTasks: Task[] = parsedTasks.map((task: any): Task => {
            let validStatus: Task['status'] = 'in_progress';
            if (task.status === 'in_progress' || task.status === 'completed') {
              validStatus = task.status;
            } else if (task.status === 'hidden') { // Legacy status mapping
              validStatus = 'completed';
            }
            return {
              id: String(task.id || Date.now() + Math.random()),
              name: String(task.name || 'Công việc không tên'),
              status: validStatus,
              cyclesCompleted: typeof task.cyclesCompleted === 'number' ? task.cyclesCompleted : 0,
              estimatedCycles: typeof task.estimatedCycles === 'number' && task.estimatedCycles > 0 ? task.estimatedCycles : 1,
            };
          }).filter((task): task is Task =>
             task !== null &&
             typeof task.id === 'string' &&
             typeof task.name === 'string' &&
             (task.status === 'in_progress' || task.status === 'completed') &&
             typeof task.cyclesCompleted === 'number' &&
             typeof task.estimatedCycles === 'number'
          );
          return mappedTasks;
        }
      } catch (error) { console.error("Lỗi khi parse tasks từ localStorage:", error); return []; }
    }
    return [];
  });

  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskEstimatedCycles, setNewTaskEstimatedCycles] = useState(1);

  const [activeTaskId, setActiveTaskId] = useState<string | null>(() => {
    const savedActiveTask = localStorage.getItem('timerActiveTaskId');
    if (savedActiveTask && savedActiveTask !== "undefined" && savedActiveTask !== "null") {
        try {
            const activeId = JSON.parse(savedActiveTask);
            return typeof activeId === 'string' ? activeId : null;
        } catch (error) { console.error("Lỗi parse activeTaskId:", error); return null; }
    }
    return null;
  });

  useEffect(() => {
    if (activeTaskId) {
        const taskExists = tasks.some(task => task.id === activeTaskId && task.status === 'in_progress');
        if (!taskExists) setActiveTaskId(null);
    }
  }, [tasks, activeTaskId]);

  const [isInFocusMode, setIsInFocusMode] = useState(false);
  const [showControlsInFocus, setShowControlsInFocus] = useState(false);
  const [taskToConfirm, setTaskToConfirm] = useState<Task | null>(null);
  const [showCompletedTasksSection, setShowCompletedTasksSection] = useState(true);

  const backgroundMusicAudioRef = useRef<HTMLAudioElement | null>(null);
  const notificationSoundAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number>();
  const alarmPlayedCountRef = useRef(0); 
  const initialUserInteractionRef = useRef(false); 

  useEffect(() => {
    localStorage.setItem('timerSettings_v2', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!isRunning) { 
      let newFullDuration;
      if (currentMode === 'work') newFullDuration = settings.workDuration * 60;
      else if (currentMode === 'short_break') newFullDuration = settings.shortBreakDuration * 60;
      else newFullDuration = settings.longBreakDuration * 60;
      setTimeLeft(newFullDuration);
    }
  }, [currentMode, settings.workDuration, settings.shortBreakDuration, settings.longBreakDuration, settings.cyclesBeforeLongBreak, isRunning]);

  useEffect(() => { localStorage.setItem('timerTasks_v2', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => {
    activeTaskId === null ? localStorage.removeItem('timerActiveTaskId') : localStorage.setItem('timerActiveTaskId', JSON.stringify(activeTaskId));
  }, [activeTaskId]);

  useEffect(() => {
    const newFocusModeState = isRunning && settings.darkModeOnStart && currentMode === 'work';
    if (newFocusModeState !== isInFocusMode) {
      setIsInFocusMode(newFocusModeState);
      setIsPageInFocusMode(newFocusModeState);
      if (!newFocusModeState) setShowControlsInFocus(false);
    }
  }, [isRunning, settings.darkModeOnStart, currentMode, setIsPageInFocusMode, isInFocusMode]);

  useEffect(() => {
    if (notificationSoundAudioRef.current && settings.selectedNotificationSound) {
        const soundUrl = new URL(settings.selectedNotificationSound, window.location.origin).href;
        if (notificationSoundAudioRef.current.src !== soundUrl) {
            notificationSoundAudioRef.current.src = soundUrl;
        }
    }
  }, [settings.selectedNotificationSound]);


  const playNotificationSound = useCallback(() => {
    if (!notificationSoundAudioRef.current || settings.alarmSoundRepeat <= 0) {
      return;
    }
    const audio = notificationSoundAudioRef.current;
    const soundUrl = new URL(settings.selectedNotificationSound, window.location.origin).href;
    
    if (audio.src !== soundUrl) {
      audio.src = soundUrl;
    }

    alarmPlayedCountRef.current = 0; 
    
    const playCurrentSequence = () => {
      if (alarmPlayedCountRef.current < settings.alarmSoundRepeat) {
        audio.currentTime = 0;
        audio.play()
          .catch(e => {
            console.error("[Notification] Lỗi phát âm báo:", e.name, e.message);
            audio.removeEventListener('ended', onEndedHandler); 
          });
      } else {
        audio.removeEventListener('ended', onEndedHandler); 
      }
    };

    const onEndedHandler = () => {
      alarmPlayedCountRef.current++; 
      playCurrentSequence(); 
    };

    audio.removeEventListener('ended', onEndedHandler); 
    audio.addEventListener('ended', onEndedHandler);
    
    playCurrentSequence(); 
  }, [settings.selectedNotificationSound, settings.alarmSoundRepeat]);

  const handleCycleComplete = useCallback(() => {
    playNotificationSound();
    if(backgroundMusicAudioRef.current && !backgroundMusicAudioRef.current.paused) {
        backgroundMusicAudioRef.current.pause();
    }
    let nextMode: 'work' | 'short_break' | 'long_break';
    let newCycleCountForState = cycleCount;
    if (currentMode === 'work') {
      if (activeTaskId) {
        setTasks((prevTasks): Task[] => prevTasks.map((task) =>
          task.id === activeTaskId
            ? { ...task, cyclesCompleted: task.cyclesCompleted + 1 }
            : task
        ));
      }
      newCycleCountForState = cycleCount + 1;
      if (newCycleCountForState >= settings.cyclesBeforeLongBreak) {
        nextMode = 'long_break'; setCycleCount(0);
      } else {
        nextMode = 'short_break'; setCycleCount(newCycleCountForState);
      }
      if (typeof Notification !== 'undefined' && Notification.permission === "granted") {
        new Notification('Đến giờ giải lao rồi!', { body: `Hãy đứng dậy, di chuyển hoặc thư giãn một chút nhé. ${nextMode === 'short_break' ? 'Nghỉ ngắn' : 'Nghỉ dài'} sắp bắt đầu.`, icon: '/marcusfi-website/favicon.ico'});
      } else if (typeof Notification !== 'undefined' && Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => { if (permission === "granted") { new Notification('Đến giờ giải lao rồi!', { body: `Hãy đứng dậy, di chuyển hoặc thư giãn một chút nhé. ${nextMode === 'short_break' ? 'Nghỉ ngắn' : 'Nghỉ dài'} sắp bắt đầu.`, icon: '/marcusfi-website/favicon.ico'});}});
      }
    } else {
      nextMode = 'work';
    }
    setIsRunning(false); 
    setCurrentMode(nextMode); 
  }, [activeTaskId, cycleCount, settings, playNotificationSound, currentMode, setTasks]); // settings should be enough here

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as number); 
            handleCycleComplete(); 
            return 0; 
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isRunning || timeLeft === 0) {
      clearInterval(timerRef.current as number);
    }
    return () => { clearInterval(timerRef.current as number); };
  }, [isRunning, timeLeft, handleCycleComplete]);

  useEffect(() => {
    const audio = backgroundMusicAudioRef.current;
    if (!audio) return;
    const handleMusicEnded = () => {
      const nextTrackIndex = (settings.currentMusicTrackIndex + 1) % BACKGROUND_MUSIC_TRACKS.length;
      setSettings(prev => ({ ...prev, currentMusicTrackIndex: nextTrackIndex }));
    };
    audio.removeEventListener('ended', handleMusicEnded);
    audio.addEventListener('ended', handleMusicEnded);

    if (settings.includeMusic && currentMode === 'work') {
      const currentTrackObject = BACKGROUND_MUSIC_TRACKS[settings.currentMusicTrackIndex];
      if (!currentTrackObject) {
        if (!audio.paused) audio.pause();
        return;
      }
      const newSrc = new URL(currentTrackObject.src, window.location.origin).href;
      if (audio.src !== newSrc) {
        audio.src = newSrc; 
        audio.load(); // Important to load new src
      }
      if (isRunning && audio.paused) {
        // Delay play slightly after src change if needed, or ensure it's playable
        audio.play().catch(e => console.error("Lỗi phát nhạc nền:", e.name, e.message));
      } else if (!isRunning && !audio.paused) {
        audio.pause();
      }
    } else {
      if (!audio.paused) {
        audio.pause();
      }
    }
    return () => {
      audio.removeEventListener('ended', handleMusicEnded);
    };
  }, [isRunning, currentMode, settings.includeMusic, settings.currentMusicTrackIndex, setSettings]); // Added setSettings

  const handleStart = () => {
    if (currentMode === 'work' && !activeTaskId) {
      alert("Vui lòng chọn một công việc để bắt đầu phiên làm việc."); return;
    }
    if (timeLeft === 0) {
        let newTime;
        if (currentMode === 'work') newTime = settings.workDuration * 60;
        else if (currentMode === 'short_break') newTime = settings.shortBreakDuration * 60;
        else newTime = settings.longBreakDuration * 60;
        setTimeLeft(newTime);
    }

    if (!initialUserInteractionRef.current) {
        if (notificationSoundAudioRef.current) {
            const audioNtf = notificationSoundAudioRef.current;
            if (!audioNtf.src && settings.selectedNotificationSound) {
                 audioNtf.src = new URL(settings.selectedNotificationSound, window.location.origin).href;
            }
            if(audioNtf.src){ 
                const wasMuted = audioNtf.muted;
                audioNtf.muted = true; 
                audioNtf.play()
                .then(() => {
                    audioNtf.pause();
                    audioNtf.currentTime = 0;
                    audioNtf.muted = wasMuted; 
                })
                .catch(() => { // Mark err as unused or log it
                    audioNtf.muted = wasMuted;
                });
            }
        }
         if (backgroundMusicAudioRef.current && settings.includeMusic) {
            const audioBg = backgroundMusicAudioRef.current;
             if (!audioBg.src && BACKGROUND_MUSIC_TRACKS[settings.currentMusicTrackIndex]) {
                 audioBg.src = new URL(BACKGROUND_MUSIC_TRACKS[settings.currentMusicTrackIndex].src, window.location.origin).href;
             }
            if(audioBg.src){
                const wasMuted = audioBg.muted;
                audioBg.muted = true;
                audioBg.play()
                .then(() => {
                    audioBg.pause();
                    audioBg.currentTime = 0;
                    audioBg.muted = wasMuted;
                })
                .catch(() => { // Mark err as unused or log it
                    audioBg.muted = wasMuted;
                });
            }
        }
        initialUserInteractionRef.current = true;
    }
    setIsRunning(true);
  };
  const handlePause = () => {
    setIsRunning(false);
  };
  const handleReset = () => {
    setIsRunning(false); 
    let newTime; 
    if (currentMode === 'work') newTime = settings.workDuration * 60;
    else if (currentMode === 'short_break') newTime = settings.shortBreakDuration * 60;
    else newTime = settings.longBreakDuration * 60;
    setTimeLeft(newTime); 
  };
  const handleSkipBreak = () => {
    if (currentMode !== 'work') {
      setIsRunning(false); 
      setCurrentMode('work'); 
    }
  };

  const addTask = () => {
    if (newTaskName.trim()) {
      const newTask: Task = {
        id: String(Date.now() + Math.random()), name: newTaskName.trim(), status: 'in_progress',
        cyclesCompleted: 0, estimatedCycles: newTaskEstimatedCycles > 0 ? newTaskEstimatedCycles : 1,
      };
      setTasks((prev): Task[] => [...prev, newTask].sort(taskSortLogic));
      setNewTaskName(''); setNewTaskEstimatedCycles(1);
      setShowTaskForm(false); 
    }
  };

  const taskSortLogic = (a: Task, b: Task): number => {
    const statusOrder: { [key in Task['status']]: number } = { 'in_progress': 1, 'completed': 2 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
    }
    // Optional: Sort by name or another criteria if statuses are the same
    // return a.name.localeCompare(b.name); 
    return 0;
  };

  const toggleTaskStatus = (taskId: string) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;
    if (taskToUpdate.status === 'in_progress') {
        setTaskToConfirm(taskToUpdate);
    } else if (taskToUpdate.status === 'completed') {
        setTasks((prevTasks): Task[] =>
            prevTasks.map((task): Task =>
                task.id === taskId ? { ...task, status: 'in_progress' } : task // Optionally reset cyclesCompleted: 0
            ).sort(taskSortLogic)
        );
    }
  };

  const handleMarkTaskAsCompleted = () => {
    if (taskToConfirm) {
      setTasks((prev): Task[] =>
        prev.map((t): Task => t.id === taskToConfirm.id ? { ...t, status: 'completed' } : t)
            .sort(taskSortLogic)
      );
      if (activeTaskId === taskToConfirm.id) setActiveTaskId(null);
      setTaskToConfirm(null);
    }
  };

  const handleDeleteTaskPermanently = () => {
    if (taskToConfirm) {
      setTasks(prev => prev.filter(t => t.id !== taskToConfirm.id));
      if (activeTaskId === taskToConfirm.id) setActiveTaskId(null);
      setTaskToConfirm(null);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateEstimatedCompletionDateTime = (task: Task): string => {
    if (!task || task.status === 'completed') return "Hoàn thành";
    const cyclesAlreadyDoneForThisTask = task.cyclesCompleted;
    const cyclesNeeded = task.estimatedCycles - cyclesAlreadyDoneForThisTask;
    if (cyclesNeeded <= 0) return "Sắp xong!";
    let totalMinutesRequired = 0;
    let currentPomodoroCycleCount = cycleCount;
    
    let initialTimeOffset = 0;
    if (activeTaskId === task.id && currentMode === 'work' && isRunning) {
        initialTimeOffset = (settings.workDuration * 60 - timeLeft) / 60; 
        if (initialTimeOffset >= settings.workDuration && settings.workDuration > 0) { // Cap offset
            initialTimeOffset = settings.workDuration - (1/60) ; 
        } else if (initialTimeOffset < 0) {
            initialTimeOffset = 0;
        }
    }


    for (let i = 0; i < cyclesNeeded; i++) {
        if (i === 0) { 
            totalMinutesRequired += Math.max(0, settings.workDuration - initialTimeOffset);
        } else {
            totalMinutesRequired += settings.workDuration;
        }

        if (i < cyclesNeeded - 1) { 
            currentPomodoroCycleCount++;
            if (currentPomodoroCycleCount >= settings.cyclesBeforeLongBreak) {
                totalMinutesRequired += settings.longBreakDuration; currentPomodoroCycleCount = 0;
            } else {
                totalMinutesRequired += settings.shortBreakDuration;
            }
        }
    }
    const completionDate = new Date(Date.now() + totalMinutesRequired * 60 * 1000);
    const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' };
    return completionDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) +
           ", " + completionDate.toLocaleDateString('vi-VN', dateOptions);
  };

  const activeTaskDetails = activeTaskId ? tasks.find(t => t.id === activeTaskId) : null;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').sort(taskSortLogic);
  const completedTasks = tasks.filter(task => task.status === 'completed').sort(taskSortLogic);

  return (
    <div
      className={`max-w-xl mx-auto p-4 sm:p-6 rounded-2xl shadow-xl transition-all duration-300 ease-in-out relative
             ${isInFocusMode 
               ? 'bg-black min-h-[380px] sm:min-h-[420px] flex flex-col justify-center items-center' 
               : 'bg-gray-50 dark:bg-gray-800'
             }`}
      onMouseEnter={() => { if (isInFocusMode) setShowControlsInFocus(true); }}
      onMouseLeave={() => { if (isInFocusMode) setShowControlsInFocus(false); }}
    >
        <AnimatePresence>
            {!isInFocusMode && (
                 <motion.div
                    initial={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="mb-4 text-center"
                 >
                    <button
                        onClick={() => setShowSettingsModal(true)}
                        className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors py-1.5 px-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                    >
                        <SettingsIcon size={15} className="mr-1.5" />
                        Cài đặt Timer
                    </button>
                </motion.div>
            )}
        </AnimatePresence>

      <div className={`text-center transition-opacity duration-300 ${showSettingsModal ? 'opacity-10 pointer-events-none' : 'opacity-100'}`}>
        <AnimatePresence mode="wait">
            <motion.h2
                key={currentMode}
                initial={{ opacity: 0, y: isInFocusMode ? 0 : -10 }}
                animate={{ opacity: isInFocusMode ? 0 : 1, y: 0 }}
                exit={{ opacity: 0, y: isInFocusMode ? 0 : 10 }}
                transition={{ duration: 0.25 }}
                className={`text-3xl sm:text-4xl font-bold mb-2
                            ${isInFocusMode ? 'h-0 overflow-hidden pointer-events-none' :
                                             (currentMode === 'work' ? 'text-gray-800 dark:text-gray-100' :
                                              currentMode === 'short_break' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400')}`}
            >
            {currentMode === 'work' ? 'Thời Gian Tập Trung' : currentMode === 'short_break' ? 'Nghỉ Ngắn' : 'Nghỉ Dài'}
            </motion.h2>
        </AnimatePresence>

        <div className={`text-6xl font-mono font-bold mb-4 ${isInFocusMode ? 'text-white' : 'text-purple-600 dark:text-purple-400'}`}>
          {formatTime(timeLeft)}
        </div>
        <div
          className={`flex justify-center space-x-3 sm:space-x-4 mb-6 transition-opacity duration-300
                     ${isInFocusMode && !showControlsInFocus ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <button
            onClick={isRunning ? handlePause : handleStart}
            disabled={!isRunning && currentMode === 'work' && !activeTaskId}
            className={`p-3 rounded-full text-white transition-all duration-200 ease-in-out transform hover:scale-105
                       ${isRunning ? 'bg-red-500 hover:bg-red-600 shadow-md' : 'bg-purple-600 hover:bg-purple-700 shadow-md'}
                       ${!isRunning && currentMode === 'work' && !activeTaskId ? 'opacity-50 cursor-not-allowed' : ''}
                       ${isInFocusMode ? (isRunning ? 'bg-red-500/70 hover:bg-red-600/90' : 'bg-purple-600/70 hover:bg-purple-500/90') : ''}
                      `}
            title={!isRunning && currentMode === 'work' && !activeTaskId ? "Vui lòng chọn công việc" : (isRunning ? "Tạm dừng" : "Bắt đầu")}
          >
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button onClick={handleReset}
            className={`p-3 rounded-full transition-colors transform hover:scale-105 shadow-sm
                       ${isInFocusMode ? 'bg-gray-600/60 hover:bg-gray-500/80 text-gray-200' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}
                      `}>
            <RotateCcw size={24} />
          </button>
          {currentMode !== 'work' && !isRunning && (
            <button onClick={handleSkipBreak}
              className={`p-3 rounded-full text-white transition-colors transform hover:scale-105 shadow-sm
                         ${isInFocusMode ? 'bg-amber-600/60 hover:bg-amber-500/80' : 'bg-amber-500 hover:bg-amber-600'}
                        `}>
              <SkipForward size={24} />
            </button>
          )}
        </div>
      </div>

      {isInFocusMode && activeTaskDetails && (
        <div className="mt-4 sm:mt-6 text-center absolute bottom-6 left-1/2 -translate-x-1/2 w-full px-4">
          <p className="text-lg sm:text-xl text-white font-semibold truncate" title={activeTaskDetails.name}>
            {activeTaskDetails.name}
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {activeTaskDetails.cyclesCompleted} / {activeTaskDetails.estimatedCycles} sessions - Dự kiến: {calculateEstimatedCompletionDateTime(activeTaskDetails)}
          </p>
        </div>
      )}

      <div className={`border-t border-gray-200 dark:border-gray-700 pt-6 mt-4 transition-opacity duration-300 ${isInFocusMode || showSettingsModal ? 'opacity-10 pointer-events-none h-0 overflow-hidden' : 'opacity-100'}`}>
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Công việc của bạn</h3>
            {!showTaskForm && (
                <button 
                    onClick={() => setShowTaskForm(true)}
                    className="p-1.5 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    title="Thêm công việc mới"
                >
                    <Plus size={20}/>
                </button>
            )}
        </div>
        
        <AnimatePresence>
        {showTaskForm && (
            <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={(e) => { e.preventDefault(); addTask(); }} 
                className="flex flex-col sm:flex-row gap-2 mb-4 items-end p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
            >
            <div className="flex-1 w-full sm:w-auto">
                <label htmlFor="newTaskName" className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-0.5">Tên công việc</label>
                <input type="text" id="newTaskName" value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Thêm công việc mới..."
                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"/>
            </div>
            <div className="w-full sm:w-20">
                <label htmlFor="newTaskCycles" className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-0.5">Cycles</label>
                <input type="number" id="newTaskCycles" min="1" value={newTaskEstimatedCycles}
                onChange={(e) => setNewTaskEstimatedCycles(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"/>
            </div>
            <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button type="submit"
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors self-end h-[34px] text-sm flex items-center justify-center gap-1">
                    <Save size={16} /> Lưu
                </button>
                <button type="button" onClick={() => setShowTaskForm(false)}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors self-end h-[34px] text-sm flex items-center justify-center gap-1">
                    <XCircle size={16} /> Hủy
                </button>
            </div>
            </motion.form>
        )}
        </AnimatePresence>


        {inProgressTasks.length > 0 && <div className="text-sm mb-2 text-gray-500 dark:text-gray-400 font-medium">Đang thực hiện:</div>}
        <div className="space-y-2">
          {inProgressTasks.length === 0 && completedTasks.length === 0 && !showTaskForm &&
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-3 italic">Chưa có công việc nào. Nhấn + để thêm.</p>
          }
          {inProgressTasks.map(task => (
            <div key={task.id} className={`p-3 rounded-lg border transition-all duration-200 
                ${activeTaskId === task.id 
                    ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-500 dark:border-purple-600 shadow-lg ring-1 ring-purple-500 dark:ring-purple-600' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                    <button onClick={() => toggleTaskStatus(task.id)}
                        className={`p-1.5 rounded-full transition-colors flex-shrink-0 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400`}>
                        <Check size={14} />
                    </button>
                    <span className={`text-sm truncate text-gray-800 dark:text-gray-100`} title={task.name}>
                        {task.name}
                    </span>
                    </div>
                    <button onClick={() => {
                        if (task.status === 'in_progress') {
                            setActiveTaskId(activeTaskId === task.id ? null : task.id)
                        }
                      }}
                    disabled={task.status !== 'in_progress'}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                        activeTaskId === task.id
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-purple-800/50 hover:text-purple-700 dark:hover:text-purple-300'}`}>
                    {activeTaskId === task.id ? 'Đang làm' : 'Chọn làm'}
                    </button>
                </div>
                <div className="mt-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-500 dark:text-gray-400 pl-9 space-y-1 sm:space-y-0">
                    <span className="flex items-center" title="Số chu kỳ đã hoàn thành / Số chu kỳ dự kiến">
                    <ListChecks size={14} className="mr-1 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                    {task.cyclesCompleted} / {task.estimatedCycles} cycles
                    </span>
                    {task.status === 'in_progress' && task.estimatedCycles > task.cyclesCompleted && (
                        <span className="flex items-center" title="Thời gian dự kiến hoàn thành">
                        <Clock size={14} className="mr-1 text-orange-500 dark:text-orange-400 flex-shrink-0" />
                        Dự kiến: {calculateEstimatedCompletionDateTime(task)}
                        </span>
                    )}
                </div>
            </div>
          ))}
        </div>

        {completedTasks.length > 0 && (
            <div className="mt-5 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setShowCompletedTasksSection(!showCompletedTasksSection)}
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 flex items-center w-full justify-between py-1"
                >
                    <span>Công việc đã hoàn thành ({completedTasks.length})</span>
                    <ChevronDown size={18} className={`transition-transform ${showCompletedTasksSection ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                {showCompletedTasksSection && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-2 space-y-2"
                    >
                    {completedTasks.map(task => (
                        <div key={task.id} className={`p-3 rounded-lg border opacity-70 bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                                <button onClick={() => toggleTaskStatus(task.id)}
                                    className={`p-1.5 rounded-full transition-colors flex-shrink-0 bg-green-500 hover:bg-green-600 text-white`}>
                                    <Check size={14} />
                                </button>
                                <span className={`text-sm truncate line-through text-gray-500 dark:text-gray-400`} title={task.name}>
                                    {task.name}
                                </span>
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 cursor-default whitespace-nowrap">
                                    Đã xong
                                </span>
                            </div>
                             <div className="mt-2 flex items-center text-xs text-gray-400 dark:text-gray-500 pl-9">
                                <ListChecks size={14} className="mr-1 text-blue-400 dark:text-blue-500 flex-shrink-0" />
                                Hoàn thành {task.cyclesCompleted} / {task.estimatedCycles} cycles
                            </div>
                        </div>
                    ))}
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        )}
      </div>

      <audio ref={backgroundMusicAudioRef} loop={false}/>
      <audio ref={notificationSoundAudioRef} />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        currentSettings={settings}
        onSaveSettings={(newSettings) => {
          const oldSettings = {...settings}; 
          setSettings(newSettings); 

          if (backgroundMusicAudioRef.current) {
            if (oldSettings.includeMusic && !newSettings.includeMusic && !backgroundMusicAudioRef.current.paused) {
              backgroundMusicAudioRef.current.pause();
            }
            if (newSettings.includeMusic && oldSettings.currentMusicTrackIndex !== newSettings.currentMusicTrackIndex) {
                const track = BACKGROUND_MUSIC_TRACKS[newSettings.currentMusicTrackIndex];
                if (track) {
                    backgroundMusicAudioRef.current.src = new URL(track.src, window.location.origin).href;
                    if (isRunning && currentMode === 'work' && initialUserInteractionRef.current) { // Only play if user interacted
                        backgroundMusicAudioRef.current.play().catch(e => console.error("Error playing new track:", e));
                    }
                }
            }
          }
        }}
      />
      {taskToConfirm && (
        <ConfirmTaskActionModal
            isOpen={!!taskToConfirm}
            taskName={taskToConfirm.name}
            onMarkAsCompleted={handleMarkTaskAsCompleted}
            onDeletePermanently={handleDeleteTaskPermanently}
            onCancel={() => setTaskToConfirm(null)}
        />
      )}
    </div>
  );
};

export default TimerBlock;