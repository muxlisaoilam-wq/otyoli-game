# Ot Yo‘li — Android ilova (Play Market) qo‘llanmasi

Sizda asl Android ilova (Sketchware) bor. Quyidagi yo‘llar HTML versiyani Android ilovaga aylantirish uchun. Yangi ilova qilsangiz, paket nomi eskisidan farq qilishi kerak, aks holda Play Market uni eski ilova deb hisoblaydi.

## 1-yo‘l: PWABuilder (eng oson, kod yozish shart emas)
1. `ot_yoli_pwa.zip` ichidagi fayllarni GitHub Pages ga yuklang (masalan `https://<login>.github.io/otyoli-oyin/`).
2. https://www.pwabuilder.com saytiga kiring, shu manzilni kiriting va "Start" ni bosing.
3. "Package for stores" → "Android" → paket nomini kiriting (masalan `uz.otyoli.game`) → "Generate".
4. Yuklangan zip ichida `.aab` fayl, imzolash kaliti (`signing.keystore`) va `assetlinks.json` bo‘ladi.
   - Kalit faylini va parolini yo‘qotmang, ilovani yangilash uchun kerak.
   - `assetlinks.json` ni saytingizda `/.well-known/assetlinks.json` manziliga qo‘ying (adres satri yashirilishi uchun).
5. Google Play Console → yangi ilova → `.aab` ni yuklang. Maxfiylik siyosati havolasi va "Data safety" bo‘limini to‘ldiring.

## 2-yo‘l: Capacitor (to‘liq nazorat)
Kompyuterda Node.js va Android Studio kerak.
```
mkdir otyoli && cd otyoli
npm init -y
npm i @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Ot Yo‘li" uz.otyoli.game --web-dir=www
mkdir www && cp index.html www/index.html
npx cap add android
npx cap sync
npx cap open android
```
Android Studio'da: Build → Generate Signed Bundle → `.aab` ni Play Console'ga yuklang.

## Maslahatlar
- Ikonkani `icon-512.png` dan oling (Play Console 512×512 talab qiladi).
- Skrinshotlar: telefonda 4-8 ta (menyu, o‘yin, yutuq, doska tanlash).
- Brauzer ma'lumoti (yutuqlar) ilova ichida saqlanadi. Telefon almashtirilsa "Sozlamalar → Zaxira" kodi bilan ko‘chiring.
- Tilni tekshirish: arab, xitoy va hind tarjimalarini ona tilida so‘zlashuvchiga ko‘rsating.
