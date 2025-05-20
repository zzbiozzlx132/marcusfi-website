// src/components/MusicPlayer.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Loader2 as Loader } from 'lucide-react';

interface Track {
  id: string;
  title?: string;
  artist?: string;
  src: string;
}

interface MusicPlayerProps {
  tracks: Track[];
  initialAutoplay?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ tracks, initialAutoplay = false }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAttemptedPlay, setHasAttemptedPlay] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = tracks[currentTrackIndex];

  const playAudio = useCallback(() => {
    if (audioRef.current && audioRef.current.src) {
      setIsLoading(true);
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.warn("Lỗi phát nhạc:", error);
          setIsPlaying(false);
          if (error.name === 'NotAllowedError' && !hasAttemptedPlay) {
            // Có thể thông báo cho người dùng cần tương tác
            // alert("Nhấp vào nút Play để bắt đầu nghe nhạc do trình duyệt chặn tự động phát.");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (audioRef.current && currentTrack?.src) {
      audioRef.current.src = currentTrack.src;
      audioRef.current.load();
      playAudio();
    }
  }, [currentTrack, hasAttemptedPlay]); // Thêm hasAttemptedPlay để re-evaluate

  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current && currentTrack?.src) {
      const audio = audioRef.current;
      // Chỉ thay đổi src và load nếu khác bài hiện tại để tránh play lại khi không cần
      if (audio.currentSrc !== currentTrack.src || audio.src !== currentTrack.src) {
        audio.src = currentTrack.src;
        audio.load();
      }
      
      if (isPlaying || (initialAutoplay && !hasAttemptedPlay && tracks.length > 0 && currentTrackIndex === 0)) {
        if (!hasAttemptedPlay) setHasAttemptedPlay(true);
        playAudio();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex, currentTrack?.src]); // isPlaying, initialAutoplay, hasAttemptedPlay, playAudio đã được xử lý cẩn thận hơn

  const togglePlayPause = useCallback(() => {
    setHasAttemptedPlay(true); 
    if (isPlaying) {
      pauseAudio();
    } else {
      if (audioRef.current && (!audioRef.current.src || audioRef.current.currentSrc !== currentTrack?.src) && currentTrack?.src) {
        audioRef.current.src = currentTrack.src;
        audioRef.current.load(); // Load rồi mới play
        // playAudio sẽ được gọi sau khi 'canplaythrough' hoặc người dùng nhấn lại
        // Hoặc gọi playAudio trực tiếp nếu muốn thử ngay
        const promise = audioRef.current.play();
        if (promise !== undefined) {
            promise.then(_ => {
                setIsPlaying(true);
                setIsLoading(false);
            }).catch(error => {
                console.warn("Lỗi khi play sau khi toggle:", error);
                setIsPlaying(false);
                setIsLoading(false);
            });
        }
      } else {
        playAudio();
      }
    }
  }, [isPlaying, playAudio, pauseAudio, currentTrack]);

  const playNextTrack = useCallback(() => {
    setHasAttemptedPlay(true);
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  }, [tracks.length]);

  const handleTrackEnded = useCallback(() => {
    playNextTrack();
  }, [playNextTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleCanPlay = () => { setIsLoading(false); /* if (isPlaying) audio.play(); */ };
      const handleWaiting = () => setIsLoading(true);
      const handleError = (e: Event) => {
        console.error("Lỗi audio element:", e);
        setIsLoading(false);
        setIsPlaying(false);
      };
      const handlePlaying = () => { setIsLoading(false); setIsPlaying(true); };
      const handlePauseEvent = () => { 
        // Chỉ set isPlaying false nếu thực sự do người dùng/hết bài, không phải do đang load
        if (!audio.ended && !audio.seeking && audio.readyState >= audio.HAVE_CURRENT_DATA) {
            setIsPlaying(false);
        }
      };

      audio.addEventListener('ended', handleTrackEnded);
      audio.addEventListener('canplaythrough', handleCanPlay);
      audio.addEventListener('playing', handlePlaying);
      audio.addEventListener('pause', handlePauseEvent);
      audio.addEventListener('waiting', handleWaiting);
      audio.addEventListener('error', handleError);
      
      return () => {
        audio.removeEventListener('ended', handleTrackEnded);
        audio.removeEventListener('canplaythrough', handleCanPlay);
        audio.removeEventListener('playing', handlePlaying);
        audio.removeEventListener('pause', handlePauseEvent);
        audio.removeEventListener('waiting', handleWaiting);
        audio.removeEventListener('error', handleError);
      };
    }
  }, [handleTrackEnded]);

  useEffect(() => {
    if (tracks.length > 0 && audioRef.current && !audioRef.current.src) {
      audioRef.current.src = tracks[0].src;
      audioRef.current.preload = "metadata";
    }
  }, [tracks]);

  if (!tracks || tracks.length === 0) {
    return null;
  }

  return (
    <>
      <audio ref={audioRef} />
      <div
        className="fixed bottom-5 left-5 z-[100]" // << ĐÃ Ở BÊN TRÁI
        title={currentTrack?.title || `Track ${currentTrackIndex + 1}`}
      >
        <button
          onClick={togglePlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
          className={`w-12 h-12  // << KÍCH THƯỚC NHỎ HƠN
                     bg-gray-700 bg-opacity-60 hover:bg-opacity-80  // << MÀU XÁM, HƠI TRONG SUỐT
                     dark:bg-gray-800 dark:bg-opacity-50 dark:hover:bg-opacity-70
                     rounded-full shadow-lg flex items-center justify-center 
                     text-gray-200 hover:text-white // << MÀU ICON
                     transition-all duration-200 ease-in-out 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-purple-500/70
                     active:scale-95`}
        >
          {isLoading ? (
            <Loader size={22} className="animate-spin" /> // Kích thước icon nhỏ hơn
          ) : isPlaying ? (
            <Pause size={22} /> // Kích thước icon nhỏ hơn
          ) : (
            <Play size={22} className="ml-[2px]" /> // Kích thước icon nhỏ hơn, căn chỉnh nhẹ icon Play
          )}
        </button>
      </div>
    </>
  );
};

export default MusicPlayer;