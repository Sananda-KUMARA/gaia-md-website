'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';

// Variables globales pour conserver l'état entre les navigations de pages
let globalAudio: HTMLAudioElement | null = null;
let wasPlaying = false;
let globalVolume = 0.7;
let globalIsMuted = false;
let globalCurrentTime = 0;
let userConsented = false;

interface TrackInfo {
  title: string;
  artist: string;
  albumCover: string;
}

// Cette fonction est appelée en dehors du composant pour éviter les problèmes d'hydratation
function getAudioInstance() {
  if (typeof window === 'undefined') return null;
  
  if (!globalAudio) {
    globalAudio = new Audio('/music/electronic-rock-king-around-here.mp3');
    globalAudio.volume = globalVolume;
    globalAudio.muted = globalIsMuted;
    
    // Restaurer la position de lecture si elle est disponible
    const savedPosition = localStorage.getItem('audioPosition');
    if (savedPosition) {
      globalCurrentTime = parseFloat(savedPosition);
    }
    
    // Vérifier si l'utilisateur a déjà consenti
    const consent = localStorage.getItem('audioConsent');
    if (consent === 'true') {
      userConsented = true;
    }
    
    // Configurer les listeners une seule fois
    globalAudio.addEventListener('timeupdate', () => {
      globalCurrentTime = globalAudio.currentTime;
      // Enregistrer la position toutes les 5 secondes
      if (Math.floor(globalCurrentTime) % 5 === 0) {
        localStorage.setItem('audioPosition', globalCurrentTime.toString());
      }
    });
    
    // Gérer les erreurs de lecture
    globalAudio.addEventListener('error', (e) => {
      console.error('Erreur de lecture audio:', e);
    });
  }
  
  return globalAudio;
}

// Fonction pour reprendre la lecture après une navigation
function resumePlaybackIfNeeded() {
  if (!globalAudio || !wasPlaying || !userConsented) return;
  
  // Restaurer la position et reprendre la lecture
  if (globalCurrentTime) {
    globalAudio.currentTime = globalCurrentTime;
  }
  
  // Tenter de reprendre la lecture avec une approche progressive
  const playPromise = globalAudio.play();
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      // Si la lecture automatique est bloquée, nous réessayons après une interaction utilisateur
      console.warn('Lecture automatique bloquée. L\'utilisateur devra interagir avec la page.', error);
    });
  }
}

// Composant qui utilise useSearchParams et qui sera enveloppé dans Suspense
function AudioPlayerContent() {
  // États locaux pour l'interface utilisateur
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(globalVolume);
  const [isMuted, setIsMuted] = useState(globalIsMuted);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [trackInfo, setTrackInfo] = useState({
    title: "Rockking around here",
    artist: "Alex Grohl",
    albumCover: "/music/albumCover/AlexGrohl.jpeg",
  });

  // Références pour les éléments DOM et le suivi de l'initialisation
  const progressBar = useRef<HTMLInputElement>(null);
  const isInitialized = useRef(false);
  const updateInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Utiliser ces hooks pour détecter les navigations
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Effet pour initialiser le lecteur
  useEffect(() => {
    if (typeof window === 'undefined' || isInitialized.current) return;
    isInitialized.current = true;
    
    // Vérifier le consentement de l'utilisateur
    const consent = localStorage.getItem('audioConsent');
    if (consent === 'true') {
      userConsented = true;
      setShowPlayer(true);
    } else if (consent === 'false') {
      // L'utilisateur a explicitement refusé, ne rien faire
    } else {
      // Si aucune préférence n'est stockée, afficher la boîte de dialogue
      setShowPrompt(true);
    }
    
    // Initialiser l'audio et les écouteurs
    const audio = getAudioInstance();
    if (!audio) return;
    
    // Configurer les écouteurs spécifiques à l'interface utilisateur
    const onTimeUpdate = () => {
      if (!audio) return;
      setCurrentTime(audio.currentTime);
      if (progressBar.current) {
        progressBar.current.value = audio.currentTime.toString();
      }
    };
    
    const onDurationChange = () => {
      if (!audio) return;
      setDuration(audio.duration);
      if (progressBar.current) {
        progressBar.current.max = audio.duration.toString();
      }
    };
    
    const onPlay = () => {
      setIsPlaying(true);
      wasPlaying = true;
    };
    
    const onPause = () => {
      setIsPlaying(false);
      wasPlaying = false;
    };
    
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    
    // Mettre à jour la durée si déjà disponible
    if (audio.duration) {
      onDurationChange();
    }
    
    // Mettre à jour le temps si déjà disponible
    if (audio.currentTime) {
      onTimeUpdate();
    }
    
    // Synchroniser l'état d'interface avec l'état global
    setIsPlaying(audio.paused === false);
    setVolume(audio.volume);
    setIsMuted(audio.muted);
    
    // Configurer un intervalle de mise à jour pour une synchronisation plus fiable
    updateInterval.current = setInterval(() => {
      if (audio && !audio.paused) {
        setCurrentTime(audio.currentTime);
        if (progressBar.current) {
          progressBar.current.value = audio.currentTime.toString();
        }
      }
    }, 250);
    
    return () => {
      // Nettoyer les écouteurs mais garder l'instance audio
      if (audio) {
        audio.removeEventListener('timeupdate', onTimeUpdate);
        audio.removeEventListener('durationchange', onDurationChange);
        audio.removeEventListener('play', onPlay);
        audio.removeEventListener('pause', onPause);
      }
      
      // Nettoyer l'intervalle
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
    };
  }, []);
  
  // Effet pour gérer les navigations
  useEffect(() => {
    // Cet effet se déclenche à chaque changement de route
    console.log('Navigation détectée:', pathname);
    
    // Reprendre la lecture si nécessaire après un délai pour laisser la transition se terminer
    if (wasPlaying && userConsented) {
      // Approche plus agressive: vérifier et reprendre périodiquement sur une courte durée
      const checkAndResume = () => {
        const audio = getAudioInstance();
        if (audio && wasPlaying && userConsented && audio.paused) {
          console.log('Tentative de reprise de la lecture après navigation');
          audio.currentTime = globalCurrentTime;
          audio.play().catch(e => console.warn('Échec de la reprise automatique:', e));
        }
      };
      
      // Vérifier immédiatement
      checkAndResume();
      
      // Puis vérifier plusieurs fois avec de courts intervalles
      setTimeout(checkAndResume, 100);
      setTimeout(checkAndResume, 500);
      setTimeout(checkAndResume, 1000);
    }
  }, [pathname, searchParams]);
  
  // Effet pour démarrer la lecture lorsque l'utilisateur accepte
  useEffect(() => {
    if (!showPlayer || !userConsented) return;
    
    const audio = getAudioInstance();
    if (!audio) return;
    
    // Si l'utilisateur vient d'accepter, démarrer la lecture
    if (!wasPlaying) {
      audio.currentTime = globalCurrentTime;
      audio.play().catch(e => console.warn('Impossible de démarrer la lecture:', e));
    }
  }, [showPlayer]);
  
  const calculateTime = (secs: number): string => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };
  
  const togglePlayPause = (): void => {
    const audio = getAudioInstance();
    if (!audio) return;
    
    if (audio.paused) {
      audio.currentTime = globalCurrentTime;
      audio.play().catch(e => console.error("Erreur de lecture:", e));
      wasPlaying = true;
    } else {
      audio.pause();
      wasPlaying = false;
    }
  };
  
  const changeRange = (): void => {
    const audio = getAudioInstance();
    if (!audio || !progressBar.current) return;
    
    const newTime = parseFloat(progressBar.current.value);
    audio.currentTime = newTime;
    globalCurrentTime = newTime;
    setCurrentTime(newTime);
    localStorage.setItem('audioPosition', newTime.toString());
  };
  
  const toggleMute = (): void => {
    const audio = getAudioInstance();
    if (!audio) return;
    
    const newMuteState = !audio.muted;
    audio.muted = newMuteState;
    setIsMuted(newMuteState);
    globalIsMuted = newMuteState;
  };
  
  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const audio = getAudioInstance();
    if (!audio) return;
    
    const newVolume = parseFloat(e.target.value) / 100;
    audio.volume = newVolume;
    setVolume(newVolume);
    globalVolume = newVolume;
    
    if (newVolume === 0) {
      audio.muted = true;
      setIsMuted(true);
      globalIsMuted = true;
    } else if (audio.muted) {
      audio.muted = false;
      setIsMuted(false);
      globalIsMuted = false;
    }
  };
  
  const handleUserResponse = (choice: boolean): void => {
    setShowPrompt(false);
    localStorage.setItem('audioConsent', choice.toString());
    userConsented = choice;
    
    if (choice) {
      setShowPlayer(true);
    }
  };
  
  return (
    <>
      {/* Boîte de dialogue demandant à l'utilisateur s'il souhaite jouer de la musique */}
      {showPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-sm shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Activer la musique ?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
              Souhaitez-vous écouter de la musique pendant votre visite sur notre site ?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => handleUserResponse(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Non merci
              </button>
              <button
                onClick={() => handleUserResponse(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-md transition-colors"
              >
                Oui, j'accepte
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lecteur audio */}
      {showPlayer && (
        <div className="fixed bottom-6 left-6 bg-slate-800 text-white rounded-lg p-3 shadow-md max-w-sm z-50">
          <div className="flex items-center mb-2">
            <div className="mr-2">
              <img 
                src={trackInfo.albumCover} 
                alt="Album cover" 
                className="w-10 h-10 rounded-md shadow-sm"
              />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-medium text-sm truncate">{trackInfo.title}</h3>
              <p className="text-slate-300 text-xs truncate">{trackInfo.artist}</p>
            </div>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>{calculateTime(currentTime)}</span>
              <span>{(duration && !isNaN(duration)) ? calculateTime(duration) : "00:00"}</span>
            </div>
            <input
              type="range"
              ref={progressBar}
              defaultValue="0"
              onChange={changeRange}
              className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button className="text-slate-300 hover:text-white transition">
                <SkipBack size={16} />
              </button>
              <button 
                onClick={togglePlayPause} 
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-1.5 transition"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button className="text-slate-300 hover:text-white transition">
                <SkipForward size={16} />
              </button>
            </div>
            
            <div className="flex items-center space-x-1">
              <button onClick={toggleMute} className="text-slate-300 hover:text-white transition">
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={changeVolume}
                className="w-16 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Composant principal enveloppé dans Suspense
const AudioPlayer: React.FC = () => {
  return (
    <Suspense fallback={<div className="fixed bottom-6 left-6 bg-slate-800 text-white rounded-lg p-3 shadow-md">Chargement du lecteur...</div>}>
      <AudioPlayerContent />
    </Suspense>
  );
};

export default AudioPlayer;