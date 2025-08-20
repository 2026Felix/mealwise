# 🍽️ Mealwise - Smart Måltidsplanering

En intelligent webbapp som hjälper dig spara pengar på mat genom smart veckoplanering och rekommendationer baserat på gemensamma ingredienser.

## 🚀 Funktioner

- **Smart Veckoplanering**: Skapa effektiva veckomenyer som minimerar matkostnader
- **100+ Svenska Recept**: Husmanskost och vardagsmat med varianter
- **Intelligenta Rekommendationer**: Få förslag baserat på gemensamma ingredienser
- **Kostnadsbesparing**: Eliminera matsvinn och optimera inköp
- **Ingrediensöversikt**: Se alla ingredienser för veckan samlade
- **Responsiv Design**: Fungerar perfekt på alla enheter
- **Integritetsfokus**: Cookie-fri analytics med Plausible

## 🛠️ Teknisk Stack

- React 18 + TypeScript
- Tailwind CSS för styling
- Vite för byggprocess
- Moderna web APIs

## 📱 Kom igång

```bash
# Klona projektet
git clone https://github.com/[ditt-användarnamn]/mealwise.git

# Navigera till projektmappen
cd mealwise

# Installera beroenden
npm install

# Starta utvecklingsservern
npm run dev
```

Appen kommer att vara tillgänglig på `http://localhost:5173`

## 📊 Analys (Plausible)

Plausible laddas endast i produktion när `VITE_PLAUSIBLE_DOMAIN` är satt.

1. Skapa en `.env`-fil i projektroten:

```
VITE_PLAUSIBLE_DOMAIN=din-domän.se
```

2. Bygg och kör i produktion:

```bash
npm run build
npm run preview
```


## 🌟 Funktioner som finns

- [x] 100+ svenska recept med varianter (snabb/festlig)
- [x] Smart veckoplanering med drag & drop
- [x] Intelligenta rekommendationer baserat på gemensamma ingredienser
- [x] Ingrediensöversikt för hela veckan
- [x] Responsiv design för alla enheter
- [x] Cookie-fri analytics med Plausible
- [x] Integritetsfokus (GDPR-kompatibel)
- [x] TypeScript för typsäkerhet
- [x] Modern React med hooks

## 🔮 Framtida Funktioner

- [ ] Användarautentisering och sparade planer
- [ ] Fler recept och kategorier
- [ ] Push-notifikationer för måltidsplanering
- [ ] Offline-stöd (PWA)
- [ ] Export till handlingslistor
- [ ] Näringsberäkning

## 📄 Licens

Detta projekt är licensierat under MIT-licensen.
