# Menü — Bugün Ne Yapsam? 🍲

Kişisel yemek seçici ve döngü asistanı. "Bugün ne pişirsem?" kararsızlığını ortadan kaldıran, tekrarsız seçim döngüsünü **adaptif rulet/çark** mekaniği ve **mobile-first** arayüzle buluşturan modern web uygulaması.

---

## 🚀 Özellikler

1. **Tekrarsız Döngü Algoritması (State Machine):**
   - İki ayrık havuz: `Yapılacaklar (Remaining)` ve `Yapılmışlar (Cooked)`.
   - `[✓ Pişirdim]` dendiğinde yemek yapılmışlara aktarılır ve havuz tükenene kadar asla tekrar seçilmez.
   - Havuzdaki tüm yemekler piştiğinde döngü otomatik sıfırlanır (`Döngü #2`), konfeti kutlaması tetiklenir ve liste baştan başlar.

2. **Adaptif Rulet / Çark (Furkan'ın Akıllı Eşik Çözümü):**
   - Havuzda **$\le 10$ yemek** varken dilimlerin üzerinde yemek isimleri radyal olarak yazar.
   - Havuzda **$> 10$ yemek** varken metin sıkışmasını önlemek için yazılar otomatik gizlenir; çark yüksek kontrastlı, minimalist bir renk spektrumu olarak döner.
   - İbre durduğu anda kazanan yemek Günün Menüsü kartında açılır.
   - Listedeki bütün yemekler istisnasız çarkın üstünde birer dilim olarak temsil edilir.
   - Web Audio API ile harici dosya gerektirmeyen gerçekçi tırnak sesi (tick sound).

3. **Günün Menüsü Kartı (Hero):**
   - Seçilen yemeğin kategorisi, pişirme süresi ve malzeme listesi akordiyonu.
   - İki ana başparmak aksiyonu: `[✓ Pişirdim]` ve `[🎲 Başka Seç]`.

4. **Sonradan Yemek Ekleme & Yönetme:**
   - Kullanıcı dilediği an alttan açılan form üzerinden kendi özel tarifini ekleyebilir.
   - Yeni eklenen yemek anında aktif döngüye dahil olur.
   - Özel yemekler dilediğinde havuzdan silinebilir.

5. **Hazır 40 Türk Ev Yemeği Tohumu:**
   - Çorbalar, fırın yemekleri, etli/tavuklu lezzetler, zeytinyağlılar, mantı/hamur işleri ve pratik öğünler hazır gelir.

6. **Offline-First & Sıfır Gecikme:**
   - Tüm veriler `localStorage`'da saklanır, internetsiz anında açılır.

---

## 🛠️ Kurulum ve Çalıştırma

```bash
# Bağımlılıkları yükle (zaten yüklü)
npm install

# Geliştirme sunucusunu başlat (Port 3008)
npm run dev

# Testleri çalıştır (Vitest)
npm run test

# Üretim derlemesi
npm run build
```
