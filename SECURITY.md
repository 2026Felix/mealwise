# Säkerhetsriktlinjer för Mealwise

## Översikt

Denna dokumentation beskriver säkerhetsåtgärderna som implementerats i Mealwise-applikationen för att skydda användare och data.

## Implementerade Säkerhetsåtgärder

### 1. XSS-skydd (Cross-Site Scripting)

- **Användarinput-sanitering**: All användarinput saniteras genom `sanitizeUserInput()` funktionen
- **Input-längdbegränsning**: Sökfält och andra inputs begränsas till rimliga längder
- **HTML-escaping**: Farliga tecken som `<`, `>`, `&`, `"`, `'` saniteras eller escapas

### 2. Content Security Policy (CSP)

Implementerad CSP som begränsar:
- Script-källor till endast samma origin
- Stilar tillåter endast säkra externa fontkällor
- Bilder från säkra källor
- Förhindrar inline scripts (förutom nödvändiga)

### 3. Säkerhetsheaders

Följande säkerhetsheaders är implementerade:
- `X-Content-Type-Options: nosniff` - Förhindrar MIME-type sniffing
- `X-Frame-Options: DENY` - Förhindrar clickjacking
- `X-XSS-Protection: 1; mode=block` - Aktiverar XSS-filter i äldre webbläsare
- `Referrer-Policy: strict-origin-when-cross-origin` - Begränsar referrer-information

### 4. Säker Data-hantering

- **localStorage-säkerhet**: Använder `secureStorage` wrapper med validering
- **Drag & Drop-säkerhet**: Validerar och begränsar storlek på drag-data
- **JSON-parsing**: Säker parsing med validering av all JSON-data

### 5. Input-validering

- **Recipe-validering**: Strikt validering av alla receptdata
- **Ingredient-validering**: Kontrollerar att ingredienser har korrekt format
- **Storage-nyckel validering**: Endast alfanumeriska tecken tillåtna

## Säkerhetsfunktioner i Koden

### `src/utils/security.ts`

Centraliserad säkerhetsmodul som innehåller:

```typescript
// Saniterar användarinput
sanitizeUserInput(input: string, maxLength?: number): string

// Säker localStorage wrapper
secureStorage.setItem(key: string, value: string): void
secureStorage.getItem(key: string): string | null
secureStorage.removeItem(key: string): void

// URL-säkerhetsvalidering
isSecureUrl(url: string): boolean
```

### Säker Drag & Drop

```typescript
safeDragDataParse(dataTransfer: DataTransfer): Recipe | null
```

Validerar och begränsar drag & drop-data för att förhindra säkerhetsrisker.

## Utvecklingsriktlinjer

### För Utvecklare

1. **Validera all input**: Använd alltid säkerhetsfunktionerna för användarinput
2. **Begränsa data-storlek**: Sätt rimliga gränser på all användardata
3. **Använd säker storage**: Använd `secureStorage` istället för direkt localStorage
4. **Testa säkerhet**: Testa med potentiellt skadlig input

### Förbjudna Praktiker

- ❌ Direkt användning av `localStorage` utan validering
- ❌ Direkt rendering av användarinput utan sanitering
- ❌ Stora eller obegränsade data-transfers
- ❌ Externa scripts eller resurser från ej-validerade domäner

## Säkerhetsöversikt för Deployment

### Produktionsinställningar

- Console.log-meddelanden tas bort automatiskt
- Debugger-statements tas bort
- Minifiering aktiverad för att dölja kod-struktur
- Hash-baserade filnamn för att förhindra cache-poisoning

### Rekommenderade Server-inställningar

För produktionsdeployment, konfigurera servern med:

```
# Säkerhetsheaders (om inte redan i HTML)
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin

# HTTPS-endast
Strict-Transport-Security: max-age=31536000; includeSubDomains

# CSP (om inte redan i HTML)
Content-Security-Policy: [se index.html för fullständig policy]
```

## Säkerhetsuppdateringar

- Håll alla dependencies uppdaterade
- Granska säkerhetsloggar regelbundet
- Testa säkerhetsfunktioner vid varje release
- Följ OWASP Top 10 riktlinjer

## Rapportera Säkerhetsproblem

Om du hittar säkerhetsproblem:
1. Rapportera INTE publikt i GitHub Issues
2. Kontakta utvecklarna direkt
3. Inkludera detaljerad beskrivning och reproduktionssteg
4. Vänta på bekräftelse innan du publicerar

---

Denna dokumentation uppdateras kontinuerligt för att reflektera aktuella säkerhetsåtgärder.