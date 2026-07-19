# Mapa selektorů — custom vrstva × Shoptet Samba

Potvrzené (✅) = ověřeno z reálného DOM e-shopu 804708.myshoptet.com.
K ověření (⚠) = standardní Shoptet třídy, doporučeno potvrdit z View Source dané stránky.

## Detail produktu ✅ (potvrzeno)
| Prvek v návrhu | Selektor Samby | Kde v kódu |
|---|---|---|
| Obal detailu | `.p-detail`, `.p-detail-inner` | css §8 |
| Levý sloupec (data) | `.p-data-wrapper` | — |
| Pravý sloupec (obrázek) | `.p-image-wrapper`, `.p-image`, `a.p-main-image` | js frame |
| Název | `.p-data-wrapper h1`, mobil `.p-detail-inner-header-mobile .h1` | css §8 |
| Krátký popis (+ demo) | `.p-short-description` → `[data-demo]` uvnitř | js `product()` |
| Cena | `.p-price-wrapper .price-final .price-final-holder` | css §8 |
| Dostupnost | `.availability-label` (inline barva → přebita `!important`) | css §8 |
| Kód produktu | `.detail-parameter-product-code` | — |
| Množství | `.quantity`, `.quantity .amount`, `.increase`, `.decrease` | css §8 |
| Do košíku (CTA) | `button.btn.btn-conversion.add-to-cart-button` | js buybar |
| Taby | `#p-detail-tabs`, `.shp-tab`, `.shp-tab.active`, `.shp-tab-link` | css §8 |
| Obsah popisu | `#description .description-inner .basic-description`, `h4` | css §8 |
| „Co je v ceně" | `ul.sc-included` (vložen v popisu produktu) | css §8 |
| Hvězdy | `.stars .star`, `.star-off`, `.star-on`, `.stars-label` | css §8 |
| Ikony akcí | `.link-icons`, `.link-icon` (print/chat/share) | — |
| Banner pás | `.benefit-banners-full-width`, `.p-detail-full-width` | — |

### Injektované prvky detailu (custom.js → .sc-*)
- `.sc-frame.sc-frame--detail` — „živé okno" kolem `.p-image`
- `.sc-detail-demo` — řádek pod cenou: `a.sc-demo` (Živé demo) + `.sc-pill` (vč. nasazení)
- `.sc-buybar` — sticky lišta (název `.p-data-wrapper h1`, cena `.price-final-holder`, klik → `.add-to-cart-button`)

## Výpis / karta produktu ⚠
| Prvek | Selektor | Pozn. |
|---|---|---|
| Mřížka | `.products-block`, `.products` | |
| Karta | `.products-block .p` | |
| Náhled | `.p .image` / `.p-image` | js zabalí do `.sc-frame` |
| Název | `.p .name` | |
| Cena | `.p .price` | |
| Krátký popis (demo) | `.p .p-short-description [data-demo]` | pokud se ve výpisu renderuje |

## Košík — 1. krok ⚠
| Prvek | Selektor | Pozn. |
|---|---|---|
| Tabulka | `.cart-table` | |
| Souhrn | `.cart-summary` / `.summary-wrapper` / `.order-summary` | js trust prvky sem |
| Pokračovat | `.btn-conversion`, `.cart-buttons a`, `.action-buttons a` | fallback |
| Kroky | `.ordering-process` (přítomnost = krok 2+) | |
| Trust prvky | `.sc-trust` (inject) | |

## Hlavička / patička / kategorie ⚠
Standardní Shoptet třídy — potvrdit z View Source:
`#header`, `.header-top`, `#navigation`, `.header-searching`, `.cart-count`;
`#footer`, `.footer-rows`, `.footer-bottom`, `.footer-newsletter`;
`#category-content`, `.filter`, `.category-title`, `.pagination`.

## Poznámky
- Doplňkový parametr „Demo" v importu se **nerenderuje** jako řádek `.detail-parameter` → demo URL bereme z `<span data-demo hidden>` v krátkém popisu (funguje na detailu i ve výpisu). ✅
- Availability má inline `style="color:#3c840f"` → nutné `!important` v CSS. ✅
- Taby jsou `.shp-tab*` (ne `.tabs .tab`), cena je `.price-final-holder` (ne `.price`). Opraveno. ✅
