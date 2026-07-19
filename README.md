# Nasazení custom vrstvy na Shoptet (šablona Samba)

Tři soubory, které jdou na GitHub a přes jsDelivr se načtou do e-shopu.

```
deploy/
├── custom.css              → restyl selektorů Samby + .sc-* prvky
├── custom.js               → injektované sekce, demo tlačítka, slidery, prázdné stavy
└── shoptet-html-editor.html→ kód k vložení do administrace
```

## Postup

1. **Založ GitHub repo** a nahraj složku `deploy/`.
2. **Vydej tag** (Releases → nový tag, např. `v1.0.0`). jsDelivr cachuje podle tagu — kdykoliv vydáš nový tag, změníš ho v HTML editoru a projeví se.
3. **Administrace Shoptetu → Vzhled a obsah → Editor HTML kódu:**
   - do **HLAVIČKY** vlož bloky 1–3 z `shoptet-html-editor.html`
   - do **PATIČKY** vlož `<script defer …custom.js>`
4. V odkazech nahraď `USERNAME/REPO@TAG` (třikrát) skutečnými hodnotami.

## Co ještě nastavit v administraci (ne kódem)

- **Vzhled šablony:** `--color-primary` = bílá, `--color-secondary` = akcent, `--color-tertiary` = mlha (#F3F6FA). Tím se obarví hlavička, tlačítka, ceny i filtry ještě před CSS.
- **Vypnout carousel banerů** na homepage (kolize K1 — hero řeší `custom.js`).
- **Filtrační parametry** kategorie Šablony: `obor`, `styl` (K…). 
- **Doplňkový parametr `Demo`** u produktů = URL živého dema (K2). Alternativně `<span data-demo="demo-nora.softema.cz" hidden></span>` do krátkého popisu (funguje i ve výpisu).
- **FAQ** na homepage: `<details class="sc-faq"><summary>Otázka</summary><p>Odpověď</p></details>` do textu úvodní stránky (K3).
- **„Co je v ceně"** na detailu: `<ul class="sc-included"><li>…</li></ul>` do popisu produktu.

## Konfigurace textů

Copy hero sekce, kroků „Jak to funguje", trust prvků a prázdných stavů je v objektu `CFG` na začátku `custom.js`. Uprav a vydej nový tag.

## Zásady

- `custom.js` běží po `DOMContentLoaded`, každá sekce je **idempotentní** (guard `[data-sc]`), reaguje na AJAX překreslení výpisu (`ShoptetDeferredContentLoaded`).
- **Za 1. krokem košíku žádné JS** — kroky doprava/platba/údaje jen CSS.
- Respektuje `prefers-reduced-motion`, focus-visible ring, žádné externí knihovny.
- Nezakládá vlastní DOM mimo `.sc-*` — vše ostatní je restyl existujících selektorů Samby.
