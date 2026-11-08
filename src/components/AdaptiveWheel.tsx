import React, { useEffect, useRef, useState, useCallback } from "react";
import { Sparkles, Zap } from "lucide-react";

export interface WheelItem {
  id: string;
  name: string;
}

interface AdaptiveWheelProps {
  meals: WheelItem[];
  onSelect: (item: any) => void;
  disabled?: boolean;
}

// Canlı, modern çark renk paleti
const PALETTE = [
  "#FF6B35", // Sıcak Turuncu
  "#F59E0B", // Amber
  "#10B981", // Zümrüt
  "#3B82F6", // Mavi
  "#8B5CF6", // Mor
  "#EC4899", // Pembe
  "#14B8A6", // Turkuaz
  "#EF4444", // Kırmızı
  "#6366F1", // İndigo
  "#84CC16", // Lime
  "#D946EF", // Fuşya
  "#06B6D4", // Camgöbeği
];

export const AdaptiveWheel: React.FC<AdaptiveWheelProps> = ({
  meals,
  onSelect,
  disabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [isSpinning, setIsSpinning] = useState(false);
  const rotationRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTickIndexRef = useRef<number>(-1);

  // Ses sentezleyici (Harici dosyasız hafif Web Audio API tık sesi)
  const playTickSound = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // Audio izin verilmemişse sessiz kal
    }
  }, []);

  // Adaptif Eşik Kuralı (Furkan'ın Kuralı):
  // meals.length <= 10 ise isimler dilimde yazar; > 10 ise yazılar kalkar, minimalist döner.
  const showLabels = meals.length <= 10;
  const count = meals.length;
  const sliceAngle = count > 0 ? (2 * Math.PI) / count : 2 * Math.PI;

  // Çarkı çiz
  const drawWheel = useCallback(
    (currentAngle: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const size = canvas.width / dpr;
      const radius = size / 2;
      const center = radius;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      if (count === 0) {
        // Boş liste
        ctx.fillStyle = "#1e222d";
        ctx.beginPath();
        ctx.arc(center, center, radius - 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
        return;
      }

      // 1. Dış Halka & Gölgeler
      ctx.beginPath();
      ctx.arc(center, center, radius - 6, 0, 2 * Math.PI);
      ctx.fillStyle = "#0f1117";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#2e3444";
      ctx.stroke();

      // 2. Dilimlerin Çizimi
      for (let i = 0; i < count; i++) {
        const startA = currentAngle + i * sliceAngle;
        const endA = startA + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius - 10, startA, endA);
        ctx.closePath();

        const color = PALETTE[i % PALETTE.length];
        ctx.fillStyle = color;
        ctx.fill();

        ctx.lineWidth = count > 20 ? 0.5 : 1.5;
        ctx.strokeStyle = "#12141c";
        ctx.stroke();

        // ADAPTİF YAZI MANTIĞI: Sadece 10 veya daha az yemek varsa yazıyı çiz
        if (showLabels) {
          ctx.save();
          ctx.translate(center, center);
          ctx.rotate(startA + sliceAngle / 2);

          ctx.textAlign = "right";
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 11px system-ui, sans-serif";
          ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
          ctx.shadowBlur = 4;

          const text = meals[i].name;
          const maxLen = 14;
          const displayText = text.length > maxLen ? text.slice(0, maxLen - 1) + "…" : text;

          ctx.fillText(displayText, radius - 24, 4);
          ctx.restore();
        }
      }

      // 3. Merkez Göbek (Halka ve Başlatıcı)
      ctx.beginPath();
      ctx.arc(center, center, radius * 0.24, 0, 2 * Math.PI);
      ctx.fillStyle = "#161822";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#ff6b35";
      ctx.stroke();

      // Göbek içi nokta
      ctx.beginPath();
      ctx.arc(center, center, radius * 0.09, 0, 2 * Math.PI);
      ctx.fillStyle = "#ff6b35";
      ctx.fill();

      ctx.restore();
    },
    [count, meals, showLabels, sliceAngle]
  );

  // Ekran boyutu değiştiğinde canvas DPR ayarla
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const size = rect.width || 300;

    canvas.width = size * dpr;
    canvas.height = size * dpr;

    drawWheel(rotationRef.current);
  }, [drawWheel]);

  // Çarkı Çevirme Animasyonu
  const spin = () => {
    if (isSpinning || disabled || count === 0) return;

    setIsSpinning(true);

    // Rastgele bir kazanan dilim seç
    const winningIndex = Math.floor(Math.random() * count);

    // İbre tam tepede (3 * Math.PI / 2 yani 270 derece) durur.
    // Dilim merkezinin tepeye denk gelmesi için gereken hedef açı:
    const targetSliceAngle = (2 * Math.PI) - (winningIndex * sliceAngle + sliceAngle / 2) - Math.PI / 2;

    // Minimum 5 tam tur (10 * Math.PI) + hedef açı
    const currentRot = rotationRef.current % (2 * Math.PI);
    const fullSpins = (5 + Math.floor(Math.random() * 3)) * 2 * Math.PI;
    const totalRotation = fullSpins + targetSliceAngle - currentRot;

    const startRot = rotationRef.current;
    const startTime = performance.now();
    const duration = 4000; // 4 saniye akıcı dönüş

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Cubic-bezier tarzı yavaşlayan eğri (ease-out-cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const newRotation = startRot + totalRotation * easeOut;

      rotationRef.current = newRotation;
      drawWheel(newRotation);

      // İbre tık sesi tespiti
      const normalizedAngle = (newRotation + Math.PI / 2) % (2 * Math.PI);
      const positiveAngle = normalizedAngle < 0 ? normalizedAngle + 2 * Math.PI : normalizedAngle;
      const currentTickIndex = Math.floor((2 * Math.PI - positiveAngle) / sliceAngle) % count;

      if (currentTickIndex !== lastTickIndexRef.current) {
        lastTickIndexRef.current = currentTickIndex;
        playTickSound();
      }

      if (progress < 1) {
        animFrameIdRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const selectedMeal = meals[winningIndex];
        if (selectedMeal) {
          onSelect(selectedMeal);
        }
      }
    };

    animFrameIdRef.current = requestAnimationFrame(animate);
  };

  // Hızlı Seçim (Animasyonu beklemeden anında seçer)
  const fastSpin = () => {
    if (disabled || count === 0) return;
    if (isSpinning && animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
    }
    const winningIndex = Math.floor(Math.random() * count);
    const targetSliceAngle =
      2 * Math.PI - (winningIndex * sliceAngle + sliceAngle / 2) - Math.PI / 2;
    rotationRef.current = targetSliceAngle;
    drawWheel(targetSliceAngle);
    playTickSound();
    setIsSpinning(false);
    const selectedItem = meals[winningIndex];
    if (selectedItem) {
      onSelect(selectedItem);
    }
  };

  // Skip / Hızlı Bitir (Dönüyorsa hemen sonuca atlar, duruyorsa başlatır)
  const handleWheelClick = () => {
    if (isSpinning) {
      fastSpin();
    } else {
      spin();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center my-3 select-none">
      {/* İbre (Pointer - Saat 12 Yönünde) */}
      <div className="relative z-20 -mb-3 flex items-center justify-center">
        <div className="w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-t-[20px] border-t-orange-500 filter drop-shadow-[0_2px_8px_rgba(255,107,53,0.8)]" />
      </div>

      {/* Çark Canvas Kutusu */}
      <div
        onClick={handleWheelClick}
        className={`relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full p-2 cursor-pointer transition-transform duration-300 ${
          isSpinning ? "scale-[1.02]" : "hover:scale-[1.01] active:scale-95"
        }`}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block rounded-full shadow-[0_0_35px_rgba(0,0,0,0.8)]"
        />

        {/* Merkez Tıkla & Çevir Rozeti */}
        <div className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#161822]/95 border-2 border-orange-500/80 flex flex-col items-center justify-center text-center shadow-lg pointer-events-none">
          <Sparkles className="w-4 h-4 text-orange-400 mb-0.5 animate-pulse" />
          <span className="text-[11px] sm:text-xs font-bold text-white tracking-wider">
            {isSpinning ? "SEÇİYOR" : "ÇEVİR"}
          </span>
        </div>
      </div>

      {/* Çark Altı Sayaç ve Hızlı Çevir Aksiyonu */}
      <div className="mt-2.5 flex items-center justify-center gap-2">
        <span className="text-[11px] text-gray-400 font-medium px-2.5 py-1 rounded-xl bg-[#141722] border border-[#232736]">
          {count} seçenek
        </span>
        <button
          type="button"
          onClick={fastSpin}
          disabled={disabled || count === 0}
          className="px-3 py-1 rounded-xl bg-[#181b26] hover:bg-[#222736] active:scale-95 text-orange-400 border border-orange-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40"
          title="Beklemeden anında seç"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Hızlı Çevir</span>
        </button>
      </div>
    </div>
  );
};
