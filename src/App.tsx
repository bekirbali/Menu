import { useState, useMemo } from "react";
import { useMealCycle } from "./hooks/useMealCycle";
import { Header } from "./components/Header";
import { CycleProgress } from "./components/CycleProgress";
import { AdaptiveWheel } from "./components/AdaptiveWheel";
import { DailyMenuCard } from "./components/DailyMenuCard";
import { FullCourseMenuCard } from "./components/FullCourseMenuCard";
import { MealPoolList } from "./components/MealPoolList";
import { AddMealModal } from "./components/AddMealModal";
import { CustomWheelModal } from "./components/CustomWheelModal";
import type { Meal, WheelFilterCategory, CuratedMenu } from "./types/meal";
import { Settings2 } from "lucide-react";

export default function App() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCustomWheelModalOpen, setIsCustomWheelModalOpen] = useState(false);
  const [wheelMode, setWheelMode] = useState<"single" | "full-menu">("single");
  const [wheelFilter, setWheelFilter] = useState<WheelFilterCategory>("all");

  const {
    allMeals,
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
    restoreMeal,
    addCustomMeal,
    deleteMeal,
    resetCycle,
    customWheelMealIds,
    setCustomWheelMealIds,
    allCuratedMenus,
    activeCuratedMenu,
    setActiveCuratedMenu,
    addCustomMenu,
    pickRandomCuratedMenu,
    markCuratedMenuCooked,
  } = useMealCycle();

  // Çark için filtrelenmiş yemek havuzu (Tek Yemek Modu)
  const filteredWheelMeals = useMemo(() => {
    if (wheelFilter === "custom") {
      if (customWheelMealIds.length === 0) return remainingMeals.slice(0, 10);
      const customList = allMeals.filter((m) => customWheelMealIds.includes(m.id));
      return customList.length > 0 ? customList : remainingMeals.slice(0, 10);
    }

    if (wheelFilter === "corba") {
      const list = remainingMeals.filter((m) => m.category === "corba");
      return list.length > 0 ? list : allMeals.filter((m) => m.category === "corba");
    }

    if (wheelFilter === "ana-yemek") {
      const mainCats = ["ana-yemek", "etli", "tavuk", "firin", "bakliyat"];
      const list = remainingMeals.filter((m) => mainCats.includes(m.category));
      return list.length > 0 ? list : allMeals.filter((m) => mainCats.includes(m.category));
    }

    if (wheelFilter === "zeytinyagli") {
      const list = remainingMeals.filter((m) => m.category === "zeytinyagli");
      return list.length > 0 ? list : allMeals.filter((m) => m.category === "zeytinyagli");
    }

    if (wheelFilter === "tatli") {
      const list = remainingMeals.filter((m) => m.category === "tatli");
      return list.length > 0 ? list : allMeals.filter((m) => m.category === "tatli");
    }

    return remainingMeals;
  }, [wheelFilter, customWheelMealIds, allMeals, remainingMeals]);

  // Çarka verilecek nihai liste (Moda göre Yemekler veya 10 Kült Menü)
  const wheelDisplayItems = wheelMode === "single" ? filteredWheelMeals : allCuratedMenus;

  // Çark durduğunda tetiklenecek fonksiyon
  const handleWheelSelect = (selectedItem: Meal | CuratedMenu) => {
    if (wheelMode === "full-menu") {
      setActiveCuratedMenu(selectedItem as CuratedMenu);
    } else {
      selectMeal(selectedItem as Meal);
    }
  };

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

        {/* Çark Modu Seçici (Tek Yemek vs Menü Çarkı) */}
        <div className="grid grid-cols-2 p-1 bg-[#12141c] rounded-2xl border border-[#212635] text-xs shadow-md">
          <button
            onClick={() => setWheelMode("single")}
            className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center transition-all ${
              wheelMode === "single"
                ? "bg-orange-500 text-white shadow-md"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <span>Tek Yemek Çarkı</span>
          </button>

          <button
            onClick={() => setWheelMode("full-menu")}
            className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center transition-all ${
              wheelMode === "full-menu"
                ? "bg-orange-500 text-white shadow-md"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <span>Menü Çarkı</span>
          </button>
        </div>

        {/* Adaptif Rulet / Çark Bölümü */}
        <section className="bg-[#12141c] border border-[#212635] rounded-3xl p-3 shadow-xl space-y-3">
          {/* Tek Yemek Modunda Kategori & Özel Çark Filtreleri */}
          {wheelMode === "single" && (
            <div className="space-y-2">
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                <button
                  onClick={() => setWheelFilter("all")}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                    wheelFilter === "all"
                      ? "bg-orange-500 text-white font-semibold shadow-sm"
                      : "bg-[#181b26] text-gray-400 border border-[#282e3f] hover:text-gray-200"
                  }`}
                >
                  Tümü
                </button>
                <button
                  onClick={() => setWheelFilter("corba")}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                    wheelFilter === "corba"
                      ? "bg-orange-500 text-white font-semibold shadow-sm"
                      : "bg-[#181b26] text-gray-400 border border-[#282e3f] hover:text-gray-200"
                  }`}
                >
                  Çorbalar
                </button>
                <button
                  onClick={() => setWheelFilter("ana-yemek")}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                    wheelFilter === "ana-yemek"
                      ? "bg-orange-500 text-white font-semibold shadow-sm"
                      : "bg-[#181b26] text-gray-400 border border-[#282e3f] hover:text-gray-200"
                  }`}
                >
                  Ana Yemek
                </button>
                <button
                  onClick={() => setWheelFilter("zeytinyagli")}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                    wheelFilter === "zeytinyagli"
                      ? "bg-orange-500 text-white font-semibold shadow-sm"
                      : "bg-[#181b26] text-gray-400 border border-[#282e3f] hover:text-gray-200"
                  }`}
                >
                  Zeytinyağlı
                </button>
                <button
                  onClick={() => setWheelFilter("tatli")}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                    wheelFilter === "tatli"
                      ? "bg-orange-500 text-white font-semibold shadow-sm"
                      : "bg-[#181b26] text-gray-400 border border-[#282e3f] hover:text-gray-200"
                  }`}
                >
                  Tatlılar
                </button>
                <button
                  onClick={() => setWheelFilter("custom")}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                    wheelFilter === "custom"
                      ? "bg-orange-500 text-white font-semibold shadow-sm"
                      : "bg-[#181b26] text-gray-400 border border-[#282e3f] hover:text-gray-200"
                  }`}
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  <span>Özel Çark</span>
                  {customWheelMealIds.length > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-black/40">
                      {customWheelMealIds.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Özel Çark Aktifse Düzenleme Çubuğu */}
              {wheelFilter === "custom" && (
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#161a25] border border-[#252c3e] text-xs">
                  <span className="text-gray-300">
                    {customWheelMealIds.length > 0
                      ? `${customWheelMealIds.length} özel yemek çarkta seçili`
                      : "Özel çark boş (otomatik 10 yemek listelendi)"}
                  </span>
                  <button
                    onClick={() => setIsCustomWheelModalOpen(true)}
                    className="px-3 py-1 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30 font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>Seçimi Düzenle</span>
                  </button>
                </div>
              )}
            </div>
          )}

          <AdaptiveWheel
            meals={wheelDisplayItems}
            onSelect={handleWheelSelect}
            disabled={wheelDisplayItems.length === 0}
          />
        </section>

        {/* Günün Kartı: Moduna göre Tek Yemek Kartı veya 4'lü Menü Kartı */}
        {wheelMode === "single" ? (
          <DailyMenuCard
            meal={currentMeal}
            onCooked={markAsCooked}
            onReroll={pickRandomMeal}
            remainingCount={remainingCount}
          />
        ) : (
          <FullCourseMenuCard
            menu={activeCuratedMenu}
            onCookMenu={markCuratedMenuCooked}
            onRerollMenu={pickRandomCuratedMenu}
          />
        )}

        {/* Havuz Listesi (Kalanlar & Pişirilenler Sekmeleri) */}
        <MealPoolList
          remainingMeals={remainingMeals}
          cookedMeals={cookedMeals}
          currentMealId={currentMeal?.id || null}
          onSelectMeal={selectMeal}
          onDeleteMeal={deleteMeal}
          onRestoreMeal={restoreMeal}
        />

        {/* Alt Bilgi */}
        <footer className="text-center py-3 text-[11px] text-gray-400">
          <p>Menü • Kişisel Yemek Seçici & Döngü Asistanı</p>
        </footer>
      </main>

      {/* Yemek Ekleme / Menü Oluşturma Modalı */}
      <AddMealModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        availableMeals={allMeals}
        onAddMeal={addCustomMeal}
        onAddMenu={addCustomMenu}
      />

      {/* Özel Çark Düzenleme Modalı */}
      {isCustomWheelModalOpen && (
        <CustomWheelModal
          isOpen={isCustomWheelModalOpen}
          onClose={() => setIsCustomWheelModalOpen(false)}
          availableMeals={allMeals}
          selectedMealIds={customWheelMealIds}
          onSaveSelection={setCustomWheelMealIds}
        />
      )}
    </div>
  );
}
