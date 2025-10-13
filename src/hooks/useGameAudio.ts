import { useState, useCallback, useRef } from "react";
import successSound from "@/assets/sounds/success.mp3";
import errorSound from "@/assets/sounds/error-game.mp3";
import clickSound from "@/assets/sounds/button-click.mp3";
import backgroundMusic from "@/assets/sounds/background-music.mp3";
import menuMusic from "@/assets/sounds/menu-music.mp3";

interface UseGameAudioReturn {
  isMuted: boolean;
  toggleMute: () => void;
  playSuccessSound: () => void;
  playErrorSound: () => void;
  playClickSound: () => void;
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  playMenuMusic: () => void;
  stopMenuMusic: () => void;
}

export const useGameAudio = (): UseGameAudioReturn => {
  const [isMuted, setIsMuted] = useState(false);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const menuMusicRef = useRef<HTMLAudioElement | null>(null);
  const hasInteractedRef = useRef(false);
  const activeMusicRef = useRef<'menu' | 'background' | null>(null);

  const playAudioFile = useCallback((audioSrc: string, volume: number = 0.5) => {
    if (isMuted) return;
    
    try {
      const audio = new Audio(audioSrc);
      audio.volume = volume;
      audio.play().catch(error => {
        console.log('Audio playback failed:', error);
      });
    } catch (error) {
      console.log('Audio not supported or blocked by browser');
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      if (newMuted) {
        if (backgroundMusicRef.current && !backgroundMusicRef.current.paused) {
          backgroundMusicRef.current.pause();
        }
        if (menuMusicRef.current && !menuMusicRef.current.paused) {
          menuMusicRef.current.pause();
        }
      } else {
        // Retoma apenas a música que deveria estar ativa
        if (activeMusicRef.current === 'background' && backgroundMusicRef.current && hasInteractedRef.current) {
          backgroundMusicRef.current.play().catch(console.log);
        } else if (activeMusicRef.current === 'menu' && menuMusicRef.current && hasInteractedRef.current) {
          menuMusicRef.current.play().catch(console.log);
        }
      }
      return newMuted;
    });
  }, []);

  const playSuccessSound = useCallback(() => {
    playAudioFile(successSound, 0.6);
  }, [playAudioFile]);

  const playErrorSound = useCallback(() => {
    playAudioFile(errorSound, 0.6);
  }, [playAudioFile]);

  const playClickSound = useCallback(() => {
    playAudioFile(clickSound, 0.4);
  }, [playAudioFile]);

  const playBackgroundMusic = useCallback(() => {
    if (isMuted) return;
    
    // Para a música do menu se estiver tocando
    if (menuMusicRef.current && !menuMusicRef.current.paused) {
      menuMusicRef.current.pause();
      menuMusicRef.current.currentTime = 0;
    }
    
    activeMusicRef.current = 'background';
    
    if (!backgroundMusicRef.current) {
      backgroundMusicRef.current = new Audio(backgroundMusic);
      backgroundMusicRef.current.loop = true;
      backgroundMusicRef.current.volume = 0.3;
    }
    
    // Só toca se não estiver já tocando
    if (backgroundMusicRef.current.paused) {
      backgroundMusicRef.current.play().catch(error => {
        console.log('Background music playback failed:', error);
      });
    }
  }, [isMuted]);

  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
    }
    if (activeMusicRef.current === 'background') {
      activeMusicRef.current = null;
    }
  }, []);

  const playMenuMusic = useCallback(() => {
    if (isMuted) return;
    
    // Para a música de jogo se estiver tocando
    if (backgroundMusicRef.current && !backgroundMusicRef.current.paused) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
    }
    
    activeMusicRef.current = 'menu';
    
    if (!menuMusicRef.current) {
      menuMusicRef.current = new Audio(menuMusic);
      menuMusicRef.current.loop = true;
      menuMusicRef.current.volume = 0.3;
    }
    
    // Se já está tocando, não faz nada
    if (!menuMusicRef.current.paused) return;
    
    const attemptPlay = () => {
      menuMusicRef.current?.play().then(() => {
        hasInteractedRef.current = true;
      }).catch(error => {
        console.log('Menu music playback failed:', error);
        // Se falhar, tenta novamente após primeira interação do usuário
        if (!hasInteractedRef.current) {
          const playOnInteraction = () => {
            hasInteractedRef.current = true;
            if (menuMusicRef.current && !isMuted && activeMusicRef.current === 'menu') {
              menuMusicRef.current.play().catch(console.log);
            }
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('touchstart', playOnInteraction);
          };
          document.addEventListener('click', playOnInteraction, { once: true });
          document.addEventListener('touchstart', playOnInteraction, { once: true });
        }
      });
    };
    
    attemptPlay();
  }, [isMuted]);

  const stopMenuMusic = useCallback(() => {
    if (menuMusicRef.current) {
      menuMusicRef.current.pause();
      menuMusicRef.current.currentTime = 0;
    }
    if (activeMusicRef.current === 'menu') {
      activeMusicRef.current = null;
    }
  }, []);

  return {
    isMuted,
    toggleMute,
    playSuccessSound,
    playErrorSound,
    playClickSound,
    playBackgroundMusic,
    stopBackgroundMusic,
    playMenuMusic,
    stopMenuMusic,
  };
};