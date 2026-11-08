import { describe, it, expect } from "vitest";
import {
  composeTurkishMenu,
  rerollSingleCourse,
  isLegume,
  isCarbOrDough,
} from "../utils/menuComposer";
import { DEFAULT_MEALS } from "../data/defaultMeals";
import type { Meal } from "../types/meal";

describe("menuComposer Türk Mutfağı Uyum Motoru", () => {
  it("isLegume ve isCarbOrDough yardımcı fonksiyonları doğru tespit yapmalıdır", () => {
    const mercimek: Meal = {
      id: "test-1",
      name: "Mercimek Çorbası",
      category: "corba",
      ingredients: ["Kırmızı mercimek", "Soğan"],
    };
    const kuruFasulye: Meal = {
      id: "test-2",
      name: "Kuru Fasulye",
      category: "bakliyat",
      ingredients: ["Kuru fasulye", "Et"],
    };
    const manti: Meal = {
      id: "test-3",
      name: "Kayseri Mantısı",
      category: "makarna-hamur",
      ingredients: ["Hamur", "Kıyma"],
    };
    const salata: Meal = {
      id: "test-4",
      name: "Mevsim Salata",
      category: "pratik",
      ingredients: ["Marul", "Domates"],
    };

    expect(isLegume(mercimek)).toBe(true);
    expect(isLegume(kuruFasulye)).toBe(true);
    expect(isLegume(salata)).toBe(false);

    expect(isCarbOrDough(manti)).toBe(true);
    expect(isCarbOrDough(salata)).toBe(false);
  });

  it("composeTurkishMenu tüm 4 kategoriyi (çorba, ana yemek, eşlikçi, tatlı) eksiksiz döndürmelidir", () => {
    const menu = composeTurkishMenu(DEFAULT_MEALS, DEFAULT_MEALS);

    expect(menu.soup).not.toBeNull();
    expect(menu.soup?.category).toBe("corba");

    expect(menu.mainCourse).not.toBeNull();
    expect(["ana-yemek", "etli", "tavuk", "firin", "bakliyat"]).toContain(
      menu.mainCourse?.category
    );

    expect(menu.sideDish).not.toBeNull();
    expect(["zeytinyagli", "makarna-hamur", "pratik"]).toContain(
      menu.sideDish?.category
    );

    expect(menu.dessert).not.toBeNull();
    expect(menu.dessert?.category).toBe("tatli");
  });

  it("rerollSingleCourse sadece hedeflenen öğünü değiştirmelidir", () => {
    const initialMenu = composeTurkishMenu(DEFAULT_MEALS, DEFAULT_MEALS);

    const newSoup = rerollSingleCourse(
      "soup",
      initialMenu,
      DEFAULT_MEALS,
      DEFAULT_MEALS
    );

    expect(newSoup).not.toBeNull();
    expect(newSoup?.category).toBe("corba");
  });
});
