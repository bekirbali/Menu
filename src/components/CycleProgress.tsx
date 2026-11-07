import React from "react";
import { RotateCcw } from "lucide-react";

interface CycleProgressProps {
  cycleNumber: number;
  totalCount: number;
  cookedCount: number;
  remainingCount: number;
  onResetCycle: () => void;
}

export const CycleProgress: React.FC<CycleProgressProps> = ({
  cycleNumber,
  totalCount,
  cookedCount,
  remainingCount,
  onResetCycle,
}) => {
  const percentage = totalCount > 0 ? Math.round((cookedCount / totalCount) * 100) : 0;

  const handleReset = () => {
    if (window.confirm("Döngüyü sıfırlayıp tüm yemekleri yeniden Yapılacaklar listesine aktarmak istediğine emin misin?")) {
      onResetCycle();
    }
  };

  return (
    <div className="bg-[#151720] border border-[#232734] rounded-2xl p-3.5 space-y-2 shadow-sm">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-orange-500/15 text-orange-400 font-bold text-[11px] border border-orange-500/20">
            DÖNGÜ #{cycleNumber}
          </span>
          <span className="font-semibold text-gray-200">
            {cookedCount} / {totalCount} Tamamlandı
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-orange-400">%{percentage}</span>
          <button
            onClick={handleReset}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-[#202433] transition-colors"
            title="Döngüyü manuel sıfırla"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* İlerleme Çubuğu */}
      <div className="w-full bg-[#202431] h-2.5 rounded-full overflow-hidden p-0.5 border border-[#2a3040]">
        <div
          className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(255,107,53,0.5)]"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-gray-400">
        <span>
          {remainingCount === 0
            ? "🎉 Tebrikler! Tüm yemekler bitti, döngü yenilendi."
            : `Döngünün tamamlanmasına son ${remainingCount} yemek kaldı.`}
        </span>
        <span className="text-gray-400 opacity-70">Tekrarsız Seçim</span>
      </div>
    </div>
  );
};

