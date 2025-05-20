// src/components/MusicPlayer.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Loader2 as Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Track {
  id: string;
  title?: string;
  artist?: string;
  src: string;
}

interface MusicPlayerProps {
  tracks: Track[];
  triggerPlayAfterInteraction?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ tracks, triggerPlayAfterInteraction = false }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);

  const intentToPlayRef = useRef(triggerPlayAfterInteraction);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const lastSuccessfullySetSrcRef = useRef<string | null>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (triggerPlayAfterInteraction && !intentToPlayRef.current && tracks.length > 0 && currentTrackIndex === 0) {
      intentToPlayRef.current = true;
    }
  }, [triggerPlayAfterInteraction, tracks, currentTrackIndex]);

  const formatTime = (time: number): string => {
    if (isNaN(time) || time === Infinity || time < 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const performPlay = useCallback(() => {
    if (audioRef.current && audioRef.current.src && audioRef.current.readyState >= 2) {
      setIsLoading(true);
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .catch(error => {
            console.error("MusicPlayer: Lỗi khi gọi audio.play() -", error.name, error.message);
            setIsPlaying(false); 
            setIsLoading(false);
            intentToPlayRef.current = false;
            if (error.name === 'NotAllowedError') console.warn("MusicPlayer: Playback bị chặn bởi trình duyệt.");
            else if (error.name === 'NotSupportedError') alert(`Lỗi: Không thể phát bài hát.`);
          });
      }
    } else if (audioRef.current && currentTrack?.src) {
      if(audioRef.current.src !== currentTrack.src) audioRef.current.src = currentTrack.src;
      setIsLoading(true);
      audioRef.current.load();
    }
  }, [currentTrack]);

  const performPause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentTrack?.src) {
      const wasIntendedToPlay = intentToPlayRef.current;
      if (currentTrack.src !== lastSuccessfullySetSrcRef.current) {
        setIsLoading(true); setIsAudioReady(false); setCurrentTime(0); setDuration(0); setIsPlaying(false);
        audio.src = currentTrack.src;
        lastSuccessfullySetSrcRef.current = currentTrack.src;
        audio.load();
        intentToPlayRef.current = wasIntendedToPlay;
      } else if (wasIntendedToPlay && audio.paused && isAudioReady && !isLoading) {
        if (triggerPlayAfterInteraction) {
          performPlay();
        }
      }
    } else if (!currentTrack?.src && audio) {
      if (audio.src || lastSuccessfullySetSrcRef.current) {
        audio.src = ""; audio.removeAttribute('src'); audio.load();
        lastSuccessfullySetSrcRef.current = null;
        setIsPlaying(false); setIsLoading(false); setCurrentTime(0); setDuration(0); setIsAudioReady(false);
        intentToPlayRef.current = false;
      }
    }
  }, [currentTrack, performPlay, isAudioReady, isLoading, triggerPlayAfterInteraction]);

  useEffect(() => {
    if (triggerPlayAfterInteraction && tracks.length > 0 && currentTrackIndex === 0 && 
        intentToPlayRef.current && !isPlaying && !isLoading && isAudioReady && audioRef.current?.paused) {
      performPlay();
    }
    else if (triggerPlayAfterInteraction && tracks.length > 0 && currentTrackIndex === 0 && audioRef.current && !audioRef.current.src && tracks[0]?.src) {
        if (lastSuccessfullySetSrcRef.current !== tracks[0].src) {
            audioRef.current.src = tracks[0].src;
            lastSuccessfullySetSrcRef.current = tracks[0].src;
            setIsLoading(true);
            audioRef.current.load();
            intentToPlayRef.current = true;
        }
    }
  }, [triggerPlayAfterInteraction, tracks, currentTrackIndex, isAudioReady, isPlaying, isLoading, performPlay]);

  const togglePlayPause = useCallback(() => {
    if (isLoading) return;
    if (isPlaying) {
      intentToPlayRef.current = false;
      performPause();
      setIsPlaying(false); 
    } else {
      intentToPlayRef.current = true;
      if (isAudioReady) {
        performPlay();
      } else if (audioRef.current && currentTrack?.src) {
        if (audioRef.current.src !== currentTrack.src || lastSuccessfullySetSrcRef.current !== currentTrack.src) {
            audioRef.current.src = currentTrack.src;
            lastSuccessfullySetSrcRef.current = currentTrack.src;
        }
        setIsLoading(true);
        audioRef.current.load();
      }
    }
  }, [isPlaying, performPause, performPlay, isAudioReady, isLoading, currentTrack]);

  const playNextTrack = useCallback(() => {
    intentToPlayRef.current = true; 
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  }, [tracks.length]);

  const handleTrackEnded = useCallback(() => { playNextTrack(); }, [playNextTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleCanPlayThrough = () => { 
        setIsLoading(false); setIsAudioReady(true); 
        if(audio.duration !== Infinity && !isNaN(audio.duration)) setDuration(audio.duration);
        if (intentToPlayRef.current && audio.paused) {
          if (triggerPlayAfterInteraction ) {
            performPlay();
          }
        }
      };
      const handleWaiting = () => { setIsLoading(true); setIsPlaying(false); };
      const handleErrorEvent = () => { 
        setIsLoading(false); setIsPlaying(false); setIsAudioReady(false);
        intentToPlayRef.current = false;
      };
      const handlePlaying = () => { setIsLoading(false); setIsPlaying(true); setIsAudioReady(true); };
      const handlePauseEvent = () => { if (!isLoading) setIsPlaying(false); };
      const handleLoadedMetadataEvent = () => { 
        if(audio.duration !== Infinity && !isNaN(audio.duration)) setDuration(audio.duration);
       };
      const handleTimeUpdateEvent = () => setCurrentTime(audio.currentTime);
      
      audio.addEventListener('loadedmetadata', handleLoadedMetadataEvent);
      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      audio.addEventListener('playing', handlePlaying);
      audio.addEventListener('pause', handlePauseEvent);
      audio.addEventListener('ended', handleTrackEnded);
      audio.addEventListener('timeupdate', handleTimeUpdateEvent);
      audio.addEventListener('waiting', handleWaiting);
      audio.addEventListener('error', handleErrorEvent);
      
      return () => { 
        audio.removeEventListener('loadedmetadata', handleLoadedMetadataEvent);
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.removeEventListener('playing', handlePlaying);
        audio.removeEventListener('pause', handlePauseEvent);
        audio.removeEventListener('ended', handleTrackEnded);
        audio.removeEventListener('timeupdate', handleTimeUpdateEvent);
        audio.removeEventListener('waiting', handleWaiting);
        audio.removeEventListener('error', handleErrorEvent);
      };
    }
  }, [handleTrackEnded, performPlay, isLoading, triggerPlayAfterInteraction]);

   useEffect(() => {
    if (tracks.length > 0 && audioRef.current && !audioRef.current.src && tracks[0]?.src && !triggerPlayAfterInteraction) {
      if (lastSuccessfullySetSrcRef.current !== tracks[0].src) {
        audioRef.current.src = tracks[0].src;
        lastSuccessfullySetSrcRef.current = tracks[0].src;
        audioRef.current.preload = "metadata";
      }
    }
  }, [tracks, triggerPlayAfterInteraction]);


  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleScrub = (event: React.MouseEvent<HTMLDivElement>) => { 
    if (progressBarRef.current && audioRef.current && duration > 0 && audioRef.current.seekable && audioRef.current.seekable.length > 0) { 
      const progressBar = progressBarRef.current;
      const clickPositionInPixels = event.clientX - progressBar.getBoundingClientRect().left;
      const clickPositionInPercentage = Math.max(0, Math.min(1, clickPositionInPixels / progressBar.offsetWidth));
      const newTime = duration * clickPositionInPercentage;
      
      if (newTime >= (audioRef.current.seekable.length > 0 ? audioRef.current.seekable.start(0) : 0) && 
          newTime <= (audioRef.current.seekable.length > 0 ? audioRef.current.seekable.end(audioRef.current.seekable.length - 1) : duration)) {
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    }
   };

  if (!tracks || tracks.length === 0) return null;
  const progressPercentage = (duration > 0 && duration !== Infinity && !isNaN(duration)) ? (currentTime / duration) * 100 : 0;

  const showInfoPanel = isHovered;

  const playerVariants = {
    collapsed: { width: '2.75rem', background: 'rgba(10, 10, 10, 0.4)', transition: { duration: 0.3, ease: "circOut" } }, 
    expanded: { width: '14rem', background: 'rgba(0, 0, 0, 0.38)', transition: { duration: 0.3, ease: "circOut" } } 
  };
  
  const infoVariants = {
    hidden: { opacity: 0, x: -10, width: 0, marginLeft: '0px' },
    visible: { opacity: 1, x: 0, width: 'auto', marginLeft: '0.5rem', transition: { duration: 0.25, ease: "circOut", delay: 0.1 } },
  };
  
  return (
    <>
      <audio ref={audioRef} loop={tracks.length === 1} />
      <div
        className="fixed bottom-5 left-5 z-[100]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className={`flex items-center h-11 rounded-full shadow-xl backdrop-blur-md overflow-hidden
                      ring-1 ring-gray-700/70 hover:ring-gray-500/70 transition-shadow,ring`}
          variants={playerVariants}
          initial="collapsed"
          animate={showInfoPanel ? "expanded" : "collapsed"} 
        >
          {/* ÁP DỤNG STYLE "NHẸ NHÀNG" CHO NÚT */}
          <button
            onClick={togglePlayPause}
            aria-label={isPlaying ? "Tạm dừng" : "Phát"}
            className={`w-10 h-10 ml-[2px] shrink-0 rounded-full flex items-center justify-center
                        text-slate-300 hover:text-slate-100  {/* Icon color */}
                        bg-slate-800/40 hover:bg-slate-700/50  {/* Button background */}
                        active:bg-slate-800/60 {/* Button active state */}
                        transition-all duration-200 ease-in-out
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-purple-500 
                        relative z-10`}
          >
            {isLoading ? ( <Loader size={20} className="animate-spin text-slate-300" /> ) : 
             isPlaying ? ( <Pause size={20} className="text-slate-300" /> ) : 
                         ( <Play size={20} className="ml-[2px] text-slate-300" /> )
            }
          </button>

          <AnimatePresence> {/* SỬA LỖI TYPO Ở ĐÂY */}
            {showInfoPanel && (
              <motion.div
                variants={infoVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex flex-col justify-center pl-1 pr-3 py-1.5 min-w-0 flex-grow"
                style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
              >
                <p className="text-gray-50 text-xs font-medium truncate" title={currentTrack?.title || "Không có tiêu đề"}>
                  {currentTrack?.title || "Không rõ tiêu đề"}
                </p>
                <div className="mt-1 w-full">
                  <div
                    ref={progressBarRef}
                    onClick={handleScrub}
                    className="h-1.5 bg-gray-600/70 rounded-full cursor-pointer group"
                  >
                    <div
                      className="h-full bg-purple-400 group-hover:bg-purple-300 rounded-full transition-colors duration-150"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence> {/* ĐÓNG THẺ ĐÚNG */}
        </motion.div>
      </div>
    </>
  );
};

export default MusicPlayer;