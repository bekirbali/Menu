import { useState } from "react";
import { useMealCycle } from "./hooks/useMealCycle";
import { Header } from "./components/Header";
import { CycleProgress } from "./components/CycleProgress";
import { AdaptiveWheel } from "./components/AdaptiveWheel";
import { DailyMenuCard } from "./components/DailyMenuCard";
import { MealPoolList } from "./components/MealPoolList";
import { AddMealModal } from "./components/AddMealModal";

export default function App() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    remainingMeals,
    cookedMeals,
    currentMeal,
    cycleNumber,
    totalCount,
    remainingCount,
    cookedCount,
    pickRandomMeal,
    selectMeal,
    markAsCooked,
    addCustomMeal,
    deleteMeal,
    resetCycle,
  } = useMealCycle();

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-gray-100 flex flex-col items-center">
      {/* Mobile-First Uygulama Kapsayıcısı (Maksimum 480px) */}
      <main className="w-full max-w-md min-h-screen px-3.5 py-4 flex flex-col gap-4">
        
        {/* Üst Başlık */}
        <Header onOpenAddModal={() => setIsAddModalOpen(true)} />

        {/* Döngü İlerleme Çubuğu */}
        <CycleProgress
          cycleNumber={cycleNumber}
          totalCount={totalCount}
          cookedCount={cookedCount}
          remainingCount={remainingCount}
          onResetCycle={resetCycle}
        />

        {/* Adaptif Rulet / Çark (Furkan'ın Akıllı Eşik Çözümü) */}
        <section className="bg-[#12141c] border border-[#212635] rounded-3xl p-2 sm:p-3 shadow-xl">
          <AdaptiveWheel
            meals={remainingMeals}
            onSelect={selectMeal}
            disabled={remainingCount === 0}
          />
        </section>

        {/* Günün Menüsü Kartı (Aksiyonlar: Pişirdim / Başka Seç) */}
        <DailyMenuCard
          meal={currentMeal}
          onCooked={markAsCooked}
          onReroll={pickRandomMeal}
          remainingCount={remainingCount}
        />

        {/* Havuz Listesi (Kalanlar & Pişirilenler Sekmeleri) */}
        <MealPoolList
          remainingMeals={remainingMeals}
          cookedMeals={cookedMeals}
          currentMealId={currentMeal?.id || null}
          onSelectMeal={selectMeal}
          onDeleteMeal={deleteMeal}
        />

        {/* Alt Bilgi */}
        <footer className="text-center py-3 text-[11px] text-gray-400">
          <p>Menü • Kişisel Yemek Seçici & Döngü Asistanı</p>
        </footer>
      </main>

      {/* Sonradan Yemek Ekleme Modalı */}
      <AddMealModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addCustomMeal}
      />
    </div>
  );
}
