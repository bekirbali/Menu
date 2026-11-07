import React from "react";
import { Plus, UtensilsCrossed } from "lucide-react";

interface HeaderProps {
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddModal }) => {
  return (
    <header className="flex items-center justify-between pb-3 border-b border-[#222634]">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
          <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-black text-white tracking-tight leading-none">
              Menü
            </h1>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              v1.0
            </span>
          </div>
          <p className="text-[11px] text-gray-400 font-medium">Bugün Ne Yapsam?</p>
        </div>
      </div>

      <button
        onClick={onOpenAddModal}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
      >
        <Plus className="w-3.5 h-3.5 stroke-[3]" />
        <span>Yemek Ekle</span>
      </button>
    </header>
  );
};

