'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Music } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';

// Variables globales pour conserver l'état entre les navigations de pages
let globalAudio = null;
let wasPlaying = false;
let globalVolume = 0.7;
let globalIsMuted = false;
let globalCurrentTime = 0;
let userConsented = false;
// Variable pour suivre si l'audio a été correctement initialisé
let audioInitialized = false;
// Variables pour l'état du lecteur
let playerClosed = false;
let playerWasClosedByUser = false;
// Indice de la piste actuelle
let currentTrackIndex = 0;

// Playlist de morceaux
const playlist = [
  {
    title: "Rockking around here",
    artist: "Alex Grohl",
    albumCover: "/music/albumCover/AlexGrohl.jpeg",
    audioSrc: "/music/electronic-rock-king-around-here.mp3"
  },
  {
    title: "Summer Vibes",
    artist: "Julia Reed",
    albumCover: "/music/albumCover/JuliaReed.jpeg",
    audioSrc: "/music/summer-vibes.mp3"
  },
  {
    title: "Midnight Jazz",
    artist: "David Carter",
    albumCover: "/music/albumCover/DavidCarter.jpeg",
    audioSrc: "/music/midnight-jazz.mp3"
  },
  {
    title: "Electronic Dreams",
    artist: "Maya Johnson",
    albumCover: "/music/albumCover/MayaJohnson.jpeg",
    audioSrc: "/music/electronic-dreams.mp3"
  }
];

// Cette fonction est appelée en dehors du composant pour éviter les problèmes d'hydratation
function getAudioInstance() {
  if (typeof window === 'undefined') return null;
  
  if (!globalAudio) {
    try {
      globalAudio = new Audio(playlist[currentTrackIndex].audioSrc);
      globalAudio.volume = globalVolume;
      globalAudio.muted = globalIsMuted;
      globalAudio.preload = 'auto'; // Précharger l'audio pour une reprise plus rapide
      
      // Restaurer la position de lecture si elle est disponible
      const savedPosition = localStorage.getItem('audioPosition');
      if (savedPosition) {
        globalCurrentTime = parseFloat(savedPosition);
        globalAudio.currentTime = globalCurrentTime;
      }
      
      // Vérifier si l'utilisateur a déjà consenti
      const consent = localStorage.getItem('audioConsent');
      if (consent === 'true') {
        userConsented = true;
      }
      
      // Configurer les listeners une seule fois
      globalAudio.addEventListener('timeupdate', () => {
        if (!globalAudio) return;
        globalCurrentTime = globalAudio.currentTime;
        // Enregistrer la position toutes les 3 secondes
        if (Math.floor(globalCurrentTime) % 3 === 0) {
          localStorage.setItem('audioPosition', globalCurrentTime.toString());
        }
      });
      
      // Gérer les erreurs de lecture
      globalAudio.addEventListener('error', (e) => {
        console.error('Erreur de lecture audio:', e);
        // Tentative de récupération après erreur
        setTimeout(() => {
          if (globalAudio && wasPlaying) {
            globalAudio.load();
            globalAudio.currentTime = globalCurrentTime;
            globalAudio.play().catch(e => console.warn('Échec de la récupération après erreur:', e));
          }
        }, 1000);
      });
      
      // Marquer l'audio comme initialisé
      audioInitialized = true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'audio:', error);
    }
  }
  
  return globalAudio;
}

// Fonction pour changer de piste
function changeTrack(index) {
  if (!globalAudio) return;
  
  // Sauvegarder l'état actuel
  const wasPlayingBefore = !globalAudio.paused;
  
  // Arrêter la lecture actuelle
  globalAudio.pause();
  
  // Mettre à jour l'indice de la piste
  currentTrackIndex = index;
  
  // Sauvegarder l'indice dans localStorage
  localStorage.setItem('currentTrackIndex', currentTrackIndex.toString());
  
  // Créer une nouvelle instance audio pour la nouvelle piste
  globalAudio = new Audio(playlist[currentTrackIndex].audioSrc);
  globalAudio.volume = globalVolume;
  globalAudio.muted = globalIsMuted;
  globalAudio.preload = 'auto';
  
  // Réinitialiser le temps de lecture
  globalCurrentTime = 0;
  
  // Configurer les écouteurs essentiels
  globalAudio.addEventListener('timeupdate', () => {
    if (!globalAudio) return;
    globalCurrentTime = globalAudio.currentTime;
    if (Math.floor(globalCurrentTime) % 3 === 0) {
      localStorage.setItem('audioPosition', globalCurrentTime.toString());
    }
  });
  
  // Si la piste précédente était en cours de lecture, démarrer la nouvelle
  if (wasPlayingBefore) {
    globalAudio.play().catch(e => console.warn('Erreur lors du changement de piste:', e));
    wasPlaying = true;
  }
  
  return globalAudio;
}

// Fonction pour passer à la piste suivante
function nextTrack() {
  const nextIndex = (currentTrackIndex + 1) % playlist.length;
  return changeTrack(nextIndex);
}

// Fonction pour passer à la piste précédente
function prevTrack() {
  const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  return changeTrack(prevIndex);
}

// Fonction améliorée pour reprendre la lecture après une navigation
function resumePlaybackIfNeeded() {
  if (!globalAudio || !wasPlaying || !userConsented || !audioInitialized) return;
  
  // Restaurer la position
  if (globalCurrentTime && !isNaN(globalCurrentTime)) {
    globalAudio.currentTime = globalCurrentTime;
  }
  
  // Utiliser la politique de lecture robuste
  const startPlayback = () => {
    if (!globalAudio) return;
    
    const playPromise = globalAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('Tentative de lecture échouée:', error);
        // Si la lecture automatique est bloquée, nous réessayons avec une nouvelle approche
        setTimeout(() => {
          if (globalAudio) {
            // Recharger et réessayer
            globalAudio.load();
            globalAudio.currentTime = globalCurrentTime;
            globalAudio.play().catch(e => console.warn('Échec de la seconde tentative:', e));
          }
        }, 100);
      });
    }
  };
  
  // Tenter de reprendre la lecture immédiatement
  startPlayback();
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
  const [playerState, setPlayerState] = useState({
    isClosed: playerClosed,
    wasClosedByUser: playerWasClosedByUser
  });
  const [trackInfo, setTrackInfo] = useState(playlist[currentTrackIndex]);

  // Références pour les éléments DOM et le suivi de l'initialisation
  const progressBar = useRef(null);
  const isInitialized = useRef(false);
  const updateInterval = useRef(null);
  const navigationInProgress = useRef(false);
  
  // Utiliser ces hooks pour détecter les navigations
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Fonction pour passer à la piste suivante
  const handleNextTrack = () => {
    const audio = nextTrack();
    setTrackInfo(playlist[currentTrackIndex]);
    setCurrentTime(0);
    setDuration(0);
    
    // Réinitialiser la barre de progression
    if (progressBar.current) {
      progressBar.current.value = "0";
    }
    
    // Mettre à jour la durée une fois disponible
    if (audio) {
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
        if (progressBar.current) {
          progressBar.current.max = audio.duration.toString();
        }
      });
    }
  };
  
  // Fonction pour passer à la piste précédente
  const handlePrevTrack = () => {
    const audio = prevTrack();
    setTrackInfo(playlist[currentTrackIndex]);
    setCurrentTime(0);
    setDuration(0);
    
    // Réinitialiser la barre de progression
    if (progressBar.current) {
      progressBar.current.value = "0";
    }
    
    // Mettre à jour la durée une fois disponible
    if (audio) {
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
        if (progressBar.current) {
          progressBar.current.max = audio.duration.toString();
        }
      });
    }
  };

  // Loggez les états pour le débogage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('État du lecteur:', {
        showPlayer,
        userConsented,
        playerClosed,
        playerWasClosedByUser,
        playerState,
      });
    }
  }, [showPlayer, playerState]);
  
  // Effet pour initialiser le lecteur
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Toujours logger le premier rendu
    console.log('Premier rendu - initialisation du lecteur');
    console.log('isInitialized.current:', isInitialized.current);
    
    if (isInitialized.current) return;
    isInitialized.current = true;
    
    try {
      // Vérifier le consentement de l'utilisateur et l'état du lecteur
      const consent = localStorage.getItem('audioConsent');
      const playerClosedState = localStorage.getItem('playerClosed');
      const savedTrackIndex = localStorage.getItem('currentTrackIndex');
      
      console.log('Consentement:', consent);
      console.log('État fermé:', playerClosedState);
      
      // Restaurer l'indice de piste s'il existe
      if (savedTrackIndex !== null) {
        const index = parseInt(savedTrackIndex);
        if (!isNaN(index) && index >= 0 && index < playlist.length) {
          currentTrackIndex = index;
          setTrackInfo(playlist[currentTrackIndex]);
        }
      }
      
      // Définir les états initiaux en fonction du stockage local
      if (consent === 'true') {
        userConsented = true;
        
        // Vérifier si le lecteur était fermé précédemment par l'utilisateur
        if (playerClosedState === 'true') {
          playerClosed = true;
          playerWasClosedByUser = true;
          setPlayerState({ isClosed: true, wasClosedByUser: true });
          setShowPlayer(false);
        } else {
          // Forcer l'affichage du lecteur si aucune préférence de fermeture n'est trouvée
          playerClosed = false;
          playerWasClosedByUser = false;
          setPlayerState({ isClosed: false, wasClosedByUser: false });
          setShowPlayer(true);
        }
      } else if (consent === 'false') {
        // L'utilisateur a explicitement refusé, ne rien faire
        userConsented = false;
        setShowPlayer(false);
      } else {
        // Si aucune préférence n'est stockée, afficher la boîte de dialogue
        setShowPrompt(true);
        setShowPlayer(false);
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
        // Ne pas mettre à jour wasPlaying pendant la navigation
        if (!navigationInProgress.current) {
          setIsPlaying(false);
          wasPlaying = false;
        } else {
          // Si en navigation, conserver l'état de lecture précédent
          setIsPlaying(false);
        }
      };
      
      const onEnded = () => {
        // Passer automatiquement à la piste suivante quand la piste actuelle se termine
        nextTrack();
        // Mettre à jour l'état de l'interface utilisateur
        setTrackInfo(playlist[currentTrackIndex]);
        setIsPlaying(true);
        setCurrentTime(0);
        
        // Réinitialiser la barre de progression
        if (progressBar.current) {
          progressBar.current.value = "0";
        }
      };
      
      audio.addEventListener('timeupdate', onTimeUpdate);
      audio.addEventListener('durationchange', onDurationChange);
      audio.addEventListener('play', onPlay);
      audio.addEventListener('pause', onPause);
      audio.addEventListener('ended', onEnded);
      
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
      
      // Nettoyer les écouteurs mais garder l'instance audio
      return () => {
        if (audio) {
          audio.removeEventListener('timeupdate', onTimeUpdate);
          audio.removeEventListener('durationchange', onDurationChange);
          audio.removeEventListener('play', onPlay);
          audio.removeEventListener('pause', onPause);
          audio.removeEventListener('ended', onEnded);
        }
        
        // Nettoyer l'intervalle
        if (updateInterval.current) {
          clearInterval(updateInterval.current);
        }
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du lecteur audio:', error);
      return undefined;
    }
  }, []);

  // Effet pour gérer les navigations
  useEffect(() => {
    // Cet effet se déclenche à chaque changement de route
    console.log('Navigation détectée:', pathname);
    
    // Marquer le début de la navigation
    navigationInProgress.current = true;
    
    // Capturer l'état actuel
    const audio = getAudioInstance();
    const wasPlayingBeforeNavigation = wasPlaying;
    
    // Utiliser requestAnimationFrame pour s'assurer que le code s'exécute dans le prochain cycle de rendu
    requestAnimationFrame(() => {
      if (wasPlayingBeforeNavigation && userConsented && audio) {
        console.log('Tentative de reprise de la lecture après navigation');
        
        // Séquence robuste de reprise de lecture
        const resumeSequence = () => {
          if (!audio) return;
          
          // S'assurer que le temps courant est correct
          audio.currentTime = globalCurrentTime;
          
          // Tentative de lecture
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(e => {
              console.warn('Échec de la reprise automatique:', e);
              
              // Réessayer après un court délai
              setTimeout(() => {
                if (audio) {
                  audio.currentTime = globalCurrentTime;
                  audio.play().catch(e => console.warn('Échec de la seconde tentative:', e));
                }
              }, 100);
            });
          }
        };
        
        // Exécuter immédiatement
        resumeSequence();
        
        // Et réessayer plusieurs fois avec des intervalles différents
        setTimeout(resumeSequence, 50);
        setTimeout(resumeSequence, 300);
        setTimeout(resumeSequence, 800);
      }
      
      // Marquer la fin de la navigation après un délai
      setTimeout(() => {
        navigationInProgress.current = false;
        
        // Synchroniser l'état d'interface si nécessaire
        if (audio) {
          setIsPlaying(!audio.paused);
        }
      }, 1000);
    });
  }, [pathname, searchParams]);
  
  // Effet pour démarrer la lecture lorsque l'utilisateur accepte
  useEffect(() => {
    console.log('Effet showPlayer/userConsented déclenché:', { showPlayer, userConsented });
    
    if (!showPlayer || !userConsented) return;
    
    const audio = getAudioInstance();
    if (!audio) return;
    
    // Si l'utilisateur vient d'accepter, démarrer la lecture
    if (!wasPlaying) {
      audio.currentTime = globalCurrentTime;
      audio.play().catch(e => console.warn('Impossible de démarrer la lecture:', e));
    }
  }, [showPlayer]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };
  
  const togglePlayPause = () => {
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
  
  const changeRange = () => {
    const audio = getAudioInstance();
    if (!audio || !progressBar.current) return;
    
    const newTime = parseFloat(progressBar.current.value);
    audio.currentTime = newTime;
    globalCurrentTime = newTime;
    setCurrentTime(newTime);
    localStorage.setItem('audioPosition', newTime.toString());
  };
  
  const toggleMute = () => {
    const audio = getAudioInstance();
    if (!audio) return;
    
    const newMuteState = !audio.muted;
    audio.muted = newMuteState;
    setIsMuted(newMuteState);
    globalIsMuted = newMuteState;
  };
  
  const changeVolume = (e) => {
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
  
  const handleUserResponse = (choice) => {
    setShowPrompt(false);
    localStorage.setItem('audioConsent', choice.toString());
    userConsented = choice;
    
    if (choice) {
      setShowPlayer(true);
    }
  };
  
  // Fonction pour fermer le lecteur
  const closePlayer = () => {
    setShowPlayer(false);
    const audio = getAudioInstance();
    if (audio) {
      audio.pause();
      wasPlaying = false;
    }
    // Ne pas modifier le consentement mais marquer le lecteur comme fermé
    localStorage.setItem('playerClosed', 'true');
    playerClosed = true;
    playerWasClosedByUser = true;
    setPlayerState({ isClosed: true, wasClosedByUser: true });
  };
  
  // Fonction pour rouvrir le lecteur
  const reopenPlayer = () => {
    setShowPlayer(true);
    setPlayerState({ isClosed: false, wasClosedByUser: false });
    playerClosed = false;
    playerWasClosedByUser = false;
    localStorage.removeItem('playerClosed');
    
    // Si l'audio était en cours de lecture avant la fermeture, le reprendre
    const audio = getAudioInstance();
    if (audio && wasPlaying) {
      audio.currentTime = globalCurrentTime;
      audio.play().catch(e => console.warn('Impossible de reprendre la lecture:', e));
    }
  };



  return (
<div className="audio-player-wrapper fixed top-4 left-4 z-50">    
      {/* Bouton de réouverture du lecteur */}
      {userConsented && !showPlayer && (
        <div 
          className="flex items-center gap-2 bg-emerald-600 text-white rounded-lg px-3 py-2 shadow-md cursor-pointer hover:bg-emerald-700 transition-colors animate-pulse"
          onClick={reopenPlayer}
          title="Rouvrir le lecteur audio"
        >
          <Music size={18} />
          <span className="text-sm font-medium">Lecteur audio</span>
        </div>
      )}
      
      {/* Boîte de dialogue demandant à l'utilisateur s'il souhaite jouer de la musique */}
      {showPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-10">
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
        <div className="bg-slate-800 text-white rounded-lg p-3 shadow-md w-72 border border-slate-700 relative">
          {/* Bouton fermeture (croix rouge) - AMÉLIORÉ */}
          <button 
            onClick={closePlayer}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center shadow-md hover:bg-red-700 transition-colors border border-red-800"
            aria-label="Fermer le lecteur"
          >
            <X size={12} color="white" />
          </button>
          
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
              <button 
                onClick={handlePrevTrack} 
                className="text-slate-300 hover:text-white transition"
              >
                <SkipBack size={16} />
              </button>
              <button 
                onClick={togglePlayPause} 
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-1.5 transition"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button 
                onClick={handleNextTrack} 
                className="text-slate-300 hover:text-white transition"
              >
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
                className="w-20 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// Composant principal
export default function AudioPlayer() {
  return (
    <Suspense fallback={<div>Chargement du lecteur audio...</div>}>
      <AudioPlayerContent />
    </Suspense>
  );
}
