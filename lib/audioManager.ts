'use client';

/**
 * HAKUMI — Audio Architecture & Sound Manager
 * Gestiona BGM (Background Music) con transiciones exclusivas y SFX (Efectos de Sonido).
 */

export interface BGMTrack {
  id: string;
  title: string;
  src: string;
  fallbackSrc?: string;
  loop?: boolean;
  volume?: number;
}

export type SFXType =
  | 'choice_click'
  | 'thought_unlock'
  | 'glitch'
  | 'heartbeat'
  | 'transition'
  | 'ambient_hum';

export interface SFXOptions {
  volume?: number;
  rate?: number;
}

export const BGM_TRACKS: Record<string, BGMTrack> = {
  chapter1: {
    id: 'chapter1',
    title: 'Un Nuevo Comienzo',
    src: '/web de referencia/audios/UnNuevoComienzo.mp3',
    fallbackSrc: '/audios/UnNuevoComienzo.mp3',
    loop: true,
    volume: 0.65,
  },
  menu: {
    id: 'menu',
    title: 'El Vacío Absoluto',
    src: '', // Reservado para futura pista dedicada del menú si se añade
    loop: true,
    volume: 0.5,
  },
};

export const SFX_REGISTRY: Record<
  SFXType,
  { src?: string; volume?: number; description: string }
> = {
  choice_click: {
    src: '/audios/sfx/choice_click.mp3',
    volume: 0.4,
    description: 'Pulsación táctil al seleccionar una decisión',
  },
  thought_unlock: {
    src: '/audios/sfx/thought_unlock.mp3',
    volume: 0.5,
    description: 'Campana armónica etérea al desbloquear un pensamiento',
  },
  glitch: {
    src: '/audios/sfx/glitch.mp3',
    volume: 0.35,
    description: 'Distorsión estática psicológica en escenas glitchy',
  },
  heartbeat: {
    src: '/audios/sfx/heartbeat.mp3',
    volume: 0.45,
    description: 'Latido sombrío en momentos de alta ansiedad',
  },
  transition: {
    src: '/audios/sfx/transition.mp3',
    volume: 0.4,
    description: 'Barrido sub-grave al cambiar de escena',
  },
  ambient_hum: {
    src: '/audios/sfx/ambient_hum.mp3',
    volume: 0.25,
    description: 'Zumbido bajo de 60Hz en el vacío',
  },
};

class AudioManager {
  private bgmAudio: HTMLAudioElement | null = null;
  private currentTrackId: string | null = null;
  private isMuted: boolean = false;
  private bgmMasterVolume: number = 0.65;
  private sfxMasterVolume: number = 0.7;
  private audioContext: AudioContext | null = null;
  private sfxCache: Map<string, HTMLAudioElement> = new Map();
  private listeners: Set<(isMuted: boolean) => void> = new Set();

  constructor() {
    // Escuchar el evento de cierre o cambio de pestaña si es necesario
    if (typeof window !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden && this.bgmAudio && !this.bgmAudio.paused) {
          // Mantener o pausar según requerimiento
        }
      });
    }
  }

  /**
   * Obtiene o inicializa perezosamente el AudioContext para síntesis procedural de SFX.
   */
  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioContext) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
    return this.audioContext;
  }

  /**
   * Suscribe un listener a cambios en el estado de silencio.
   */
  public subscribe(listener: (isMuted: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.isMuted);
      } catch (err) {
        console.error('[AudioManager] Error en listener:', err);
      }
    }
  }

  /**
   * Retorna si el audio está silenciado actualmente.
   */
  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Retorna el identificador de la pista actual en reproducción.
   */
  public getCurrentTrackId(): string | null {
    return this.currentTrackId;
  }

  /**
   * Activa o desactiva el silencio de todo el sistema de audio.
   */
  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.bgmAudio) {
      this.bgmAudio.muted = muted;
      this.bgmAudio.volume = muted ? 0 : this.bgmMasterVolume;
      if (!muted && this.bgmAudio.paused && this.currentTrackId) {
        this.bgmAudio.play().catch((err) => {
          console.warn('[AudioManager] No se pudo reanudar BGM al desilenciar:', err);
        });
      }
    }
    this.notifyListeners();
  }

  /**
   * Alterna el estado de silencio.
   */
  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Detiene por completo la pista BGM actual y libera recursos.
   * Garantiza exclusividad para que no se solapen pistas.
   */
  public stopBGM(): void {
    if (this.bgmAudio) {
      try {
        this.bgmAudio.pause();
        this.bgmAudio.currentTime = 0;
        this.bgmAudio.src = '';
      } catch (e) {
        console.warn('[AudioManager] Error deteniendo BGM:', e);
      }
      this.bgmAudio = null;
    }
    this.currentTrackId = null;
  }

  /**
   * Detiene todo sonido activo (BGM y SFX).
   */
  public stopAll(): void {
    this.stopBGM();
    for (const sfx of this.sfxCache.values()) {
      try {
        sfx.pause();
        sfx.currentTime = 0;
      } catch {
        // Ignorar
      }
    }
  }

  /**
   * Reproduce una pista musical de fondo (BGM).
   * Detiene por completo cualquier pista anterior antes de iniciar la nueva.
   * Si la misma pista ya está sonando, no la reinicia a menos que se indique `forceRestart`.
   */
  public async playBGM(
    trackKey: keyof typeof BGM_TRACKS | string,
    options?: { forceRestart?: boolean }
  ): Promise<void> {
    if (typeof window === 'undefined') return;

    const track = BGM_TRACKS[trackKey];
    if (!track || !track.src) {
      console.warn(`[AudioManager] Pista de audio "${trackKey}" no configurada.`);
      return;
    }

    // Si la misma pista ya está reproduciéndose y no se fuerza reinicio, mantenerla
    if (
      this.currentTrackId === track.id &&
      this.bgmAudio &&
      !this.bgmAudio.paused &&
      !options?.forceRestart
    ) {
      return;
    }

    // EXCLUSIVIDAD: Detener por completo cualquier pista previa para evitar solapamientos
    this.stopBGM();

    const audio = new Audio();
    this.bgmAudio = audio;
    this.currentTrackId = track.id;

    // Configuración de la pista
    audio.loop = track.loop ?? true;
    audio.muted = this.isMuted;
    this.bgmMasterVolume = track.volume ?? 0.65;
    audio.volume = this.isMuted ? 0 : this.bgmMasterVolume;

    // Manejo de URL codificada y fallback anti-404
    const primaryUrl = encodeURI(track.src);
    audio.src = primaryUrl;

    audio.onerror = () => {
      console.warn(
        `[AudioManager] Error al cargar "${primaryUrl}". Activando fallback...`
      );
      if (track.fallbackSrc && audio.src !== track.fallbackSrc) {
        audio.src = encodeURI(track.fallbackSrc);
        if (!this.isMuted) {
          audio.play().catch((err) => {
            console.warn('[AudioManager] Error al reproducir fallback:', err);
          });
        }
      }
    };

    try {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
    } catch (err) {
      // Política de Autoplay del navegador: esperar al primer toque o tecla del usuario
      console.warn(
        '[AudioManager] Autoplay esperando interacción del usuario:',
        err
      );
      const resumeOnGesture = () => {
        if (
          this.currentTrackId === track.id &&
          !this.isMuted &&
          this.bgmAudio
        ) {
          this.bgmAudio.play().catch(() => {});
        }
        window.removeEventListener('pointerdown', resumeOnGesture);
        window.removeEventListener('keydown', resumeOnGesture);
      };
      window.addEventListener('pointerdown', resumeOnGesture, { once: true });
      window.addEventListener('keydown', resumeOnGesture, { once: true });
    }
  }

  /**
   * Reproduce un efecto de sonido (SFX).
   * Si existe un archivo registrado, lo reproduce.
   * Si no se encuentra archivo en disco, genera de forma procedural un efecto
   * con Web Audio API acorde a la atmósfera Dreamcore / psicológica de Hakumi.
   */
  public playSFX(type: SFXType, options?: SFXOptions): void {
    if (this.isMuted || typeof window === 'undefined') return;

    const sfxDef = SFX_REGISTRY[type];
    const targetVolume = (options?.volume ?? sfxDef?.volume ?? 0.5) * this.sfxMasterVolume;

    // Intentar reproducir archivo físico si está cargado
    if (sfxDef?.src) {
      let cached = this.sfxCache.get(sfxDef.src);
      if (!cached) {
        cached = new Audio(encodeURI(sfxDef.src));
        cached.onerror = () => {
          // Si el archivo físico falla (404), recurrir a la síntesis procedural
          this.synthesizeProceduralSFX(type, targetVolume);
        };
        this.sfxCache.set(sfxDef.src, cached);
      }

      cached.volume = Math.min(1, Math.max(0, targetVolume));
      cached.currentTime = 0;
      cached.play().catch(() => {
        // En caso de fallo de reproducción, usar procedural
        this.synthesizeProceduralSFX(type, targetVolume);
      });
      return;
    }

    // Fallback procedural predeterminado
    this.synthesizeProceduralSFX(type, targetVolume);
  }

  /**
   * Síntesis procedural de audio para SFX mediante Web Audio API.
   * Diseñado específicamente con tonos psicológicos, sutiles y no intrusivos.
   */
  private synthesizeProceduralSFX(type: SFXType, volume: number): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);

    switch (type) {
      case 'choice_click': {
        // Pulsación suave y amortiguada (clic orgánico)
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.05);

        gainNode.gain.setValueAtTime(volume * 0.4, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(filter);
        filter.connect(gainNode);

        osc.start(now);
        osc.stop(now + 0.06);
        break;
      }

      case 'thought_unlock': {
        // Campana armónica etérea (quinta justa con caída cristalina)
        const fundamental = 528; // Tono de resonancia
        const harmony = 792;

        [fundamental, harmony].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const voiceGain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          const factor = idx === 0 ? 0.35 : 0.2;
          voiceGain.gain.setValueAtTime(volume * factor, now);
          voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

          osc.connect(voiceGain);
          voiceGain.connect(gainNode);

          osc.start(now);
          osc.stop(now + 0.9);
        });
        break;
      }

      case 'glitch': {
        // Breve distorsión psicológica de frecuencia
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.linearRampToValueAtTime(220, now + 0.04);
        osc.frequency.linearRampToValueAtTime(60, now + 0.09);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, now);
        filter.Q.setValueAtTime(3, now);

        gainNode.gain.setValueAtTime(volume * 0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(filter);
        filter.connect(gainNode);

        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }

      case 'heartbeat': {
        // Doble pulso sub-grave (lub-dub)
        [0, 0.14].forEach((delay) => {
          const osc = ctx.createOscillator();
          const subGain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(55, now + delay);
          osc.frequency.exponentialRampToValueAtTime(35, now + delay + 0.12);

          subGain.gain.setValueAtTime(volume * 0.6, now + delay);
          subGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.14);

          osc.connect(subGain);
          subGain.connect(gainNode);

          osc.start(now + delay);
          osc.stop(now + delay + 0.15);
        });
        break;
      }

      case 'transition': {
        // Barrido atmosférico cinematográfico
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(65, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.8);

        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(volume * 0.45, now + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + 0.9);
        break;
      }

      case 'ambient_hum': {
        // Zumbido grave de 60Hz continuo o prolongado
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(60, now);

        gainNode.gain.setValueAtTime(volume * 0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + 2.0);
        break;
      }
    }
  }
}

// Singleton global
export const audioManager = new AudioManager();
