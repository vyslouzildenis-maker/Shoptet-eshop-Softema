/* ============================================================
   SOFTEMA — custom vrstva nad šablonou Shoptet Samba
   custom.js · v1  (vanilla, bez závislostí)
   ------------------------------------------------------------
   • spouští se po DOMContentLoaded
   • každá sekce je idempotentní (guard přes [data-sc])
   • detekce stránky přes Shoptet dataLayer / <body> třídy
   • injektované prvky mají prefix .sc-*  (styluje custom.css)
   • za 1. krokem košíku NEBĚŽÍ žádné JS (jen CSS)
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Konfigurace (edituj tady) ------------------- */
  var CFG = {
    hero: {
      eyebrow: "Šablony s nasazením",
      title: "Nový vzhled vašeho Shoptet e-shopu.\nDo 5 dnů a bez práce.",
      text: "Vyberete šablonu, my ji nasadíme. Jste v rukou certifikovaných Shoptet partnerů.",
      ctaPrimary: { label: "Vybrat šablonu", href: "/sablony/" },
      ctaSecondary: { label: "Chci design na míru", href: "/design-na-miru/" }
    },
    steps: [
      { t: "Vyberete a zaplatíte", d: "Šablonu i případné úpravy pořídíte online během pár minut." },
      { t: "Pošlete přístupy", d: "Krátký formulář — přístup do administrace, logo a barvy." },
      { t: "Nasadíme a doladíme", d: "Šablonu nasadíme na váš e-shop a sladíme s brandem." },
      { t: "Do 5 dnů hotovo", d: "Zkontrolujete, spustíme. Prvních 30 dní podpora zdarma." }
    ],
    // Copy pro prázdné stavy a trust prvky
    emptyCategory: {
      title: "Nenašli jste svůj styl?",
      text: "Uděláme vám design na míru — přesně podle vašeho brandu.",
      cta: { label: "Design na míru", href: "/design-na-miru/" }
    },
    emptyCart: {
      title: "Košík je prázdný.",
      text: "Vyberte si šablonu a nový vzhled máte do 5 dnů.",
      cta: { label: "Prohlédnout šablony", href: "/sablony/" }
    },
    cartTrust: ["Garance doladění zdarma", "Podpora 30 dní", "Bezpečná platba"]
  };

  /* ---------- Utility ------------------------------------- */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function once(key) {
    if (document.querySelector('[data-sc="' + key + '"]')) return false;
    return true;
  }
  function mark(node, key) { node.setAttribute("data-sc", key); return node; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  }); }

  /* Detekce typu stránky. Shoptet plní window.dataLayer i <body> třídy;
     používáme obojí jako fallback. */
  function pageType() {
    var dl = (window.dataLayer || []).reduce(function (acc, x) {
      if (x && x.shoptet && x.shoptet.pageType) acc = x.shoptet.pageType;
      return acc;
    }, null);
    if (dl) return dl;                       // homepage | category | product | cart | ...
    var b = document.body.className || "";
    if (/(^|\s)homepage/.test(b)) return "homepage";
    if (/category/.test(b)) return "category";
    if (/product/.test(b)) return "product";
    if (/cart|ordering/.test(b)) return "cart";
    return "other";
  }

  /* ============================================================
     HOMEPAGE  (kolize K1 — hero vkládá JS na začátek obsahu)
     ============================================================ */
  function homepage() {
    // Deterministické mounty — hero/kroky se vloží JEN tam, kde v editoru
    // úvodní stránky Shoptetu vložíš prázdné <div id="sc-hero"></div> resp.
    // <div id="sc-steps"></div>. Žádné slepé vkládání = žádné kolize.
    var content = document.getElementById("sc-hero") || document.getElementById("sc-steps");
    if (!content) return;

    /* --- Hero --- */
    var heroMount = document.getElementById("sc-hero");
    if (heroMount && once("hero")) {
      var h = CFG.hero;
      var hero = mark(el("section", "sc-section sc-hero"), "hero");
      hero.innerHTML =
        '<div class="sc-section__in" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:center">' +
          '<div>' +
            '<span style="font-size:13px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:var(--sc-acc)">' + esc(h.eyebrow) + '</span>' +
            '<h1 style="font-family:var(--sc-font-head);font-size:clamp(34px,5vw,60px);font-weight:700;line-height:1.05;letter-spacing:-.5px;margin:12px 0 16px">' + esc(h.title).replace(/\n/g, "<br>") + '</h1>' +
            '<p style="font-size:18px;color:var(--sc-steel);max-width:460px;margin:0 0 24px">' + esc(h.text) + '</p>' +
            '<div style="display:flex;gap:12px;flex-wrap:wrap">' +
              '<a class="btn btn-conversion" href="' + esc(h.ctaPrimary.href) + '" style="display:inline-flex;align-items:center;gap:10px;color:#fff;padding:15px 28px;border-radius:var(--sc-r-btn)">' + esc(h.ctaPrimary.label) + ' →</a>' +
              '<a class="btn btn-primary" href="' + esc(h.ctaSecondary.href) + '" style="padding:13.5px 26px;border-radius:var(--sc-r-btn)">' + esc(h.ctaSecondary.label) + '</a>' +
            '</div>' +
          '</div>' +
          '<div class="sc-frame"><div class="sc-frame__bar"><span class="sc-frame__dots"><i></i><i></i><i></i></span><span class="sc-frame__url">demo.softema.cz</span></div><div class="sc-frame__shot" style="height:240px;background:var(--sc-fog)"></div></div>' +
        '</div>';
      heroMount.replaceWith(hero);
    }

    /* --- Jak to funguje --- */
    var stepsMount = document.getElementById("sc-steps");
    if (stepsMount && once("steps")) {
      var s = mark(el("section", "sc-section sc-section--fog"), "steps");
      var cards = CFG.steps.map(function (x, i) {
        return '<div style="background:#fff;border:1px solid var(--sc-line);border-radius:var(--sc-r-card);padding:24px;display:flex;flex-direction:column;gap:8px">' +
          '<span style="width:36px;height:36px;border-radius:50%;background:var(--sc-acc);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-family:var(--sc-font-head);font-weight:700">' + (i + 1) + '</span>' +
          '<strong style="font-family:var(--sc-font-head);font-size:18px">' + esc(x.t) + '</strong>' +
          '<span style="color:var(--sc-steel);font-size:14.5px">' + esc(x.d) + '</span></div>';
      }).join("");
      s.innerHTML = '<div class="sc-section__in"><h2 class="sc-h2">Jak to funguje</h2>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:32px">' + cards + '</div></div>';
      stepsMount.replaceWith(s);
    }
  }

  /* ============================================================
     KARTA PRODUKTU ve výpisu — „živé okno" + tlačítko Živé demo
     (kolize K2 — demo URL z hidden spanu v krátkém popisu)
     ============================================================ */
  function decorateProductCards(scope) {
    var cards = (scope || document).querySelectorAll(".products-block .p, .products .p");
    Array.prototype.forEach.call(cards, function (p) {
      if (p.getAttribute("data-sc") === "card") return;
      mark(p, "card");

      // Živé okno kolem náhledu (Shoptet výpis: .p .image / .p-image)
      var img = p.querySelector(".image, .p-image, .p-images");
      if (img && !img.closest(".sc-frame")) {
        var frame = el("div", "sc-frame");
        var demo = p.querySelector(".p-short-description [data-demo], [data-demo]");
        var url = demo ? demo.getAttribute("data-demo") : "demo.softema.cz";
        frame.appendChild(el("div", "sc-frame__bar",
          '<span class="sc-frame__dots"><i></i><i></i></span><span class="sc-frame__url">' + esc(url) + '</span>'));
        var shot = el("div", "sc-frame__shot");
        img.parentNode.insertBefore(frame, img);
        shot.appendChild(img);
        frame.appendChild(shot);
      }

      // Tlačítko Živé demo z data-demo (.p-short-description)
      var demoSpan = p.querySelector(".p-short-description [data-demo], [data-demo]");
      if (demoSpan) {
        var href = demoSpan.getAttribute("data-demo");
        var actions = p.querySelector(".p-bottom, .price-wrapper, .p-in") || p;
        var a = el("a", "btn btn-primary sc-demo", "Živé demo");
        a.href = href.indexOf("http") === 0 ? href : "https://" + href;
        a.target = "_blank"; a.rel = "noopener";
        a.style.marginTop = "8px";
        actions.appendChild(a);
        demoSpan.setAttribute("hidden", "");
      }
    });
  }

  /* ============================================================
     KATEGORIE — prázdný výsledek filtru (kolize K4)
     ============================================================ */
  function category() {
    decorateProductCards();
    var list = document.querySelector(".products-block, .products");
    var hasItems = list && list.querySelector(".p");
    var systemEmpty = document.querySelector(".products-empty, .no-products");
    if (!hasItems && once("empty-cat")) {
      var c = CFG.emptyCategory;
      var box = mark(el("div", "sc-empty"), "empty-cat");
      box.innerHTML =
        '<strong style="font-family:var(--sc-font-head);font-size:22px">' + esc(c.title) + '</strong>' +
        '<p style="color:var(--sc-steel);margin:0;max-width:420px">' + esc(c.text) + '</p>' +
        '<a class="btn btn-conversion" href="' + esc(c.cta.href) + '" style="color:#fff;padding:13px 24px;border-radius:var(--sc-r-btn)">' + esc(c.cta.label) + ' →</a>';
      var host = systemEmpty || list || document.querySelector(".content-inner");
      if (host) host.parentNode ? host.parentNode.insertBefore(box, host.nextSibling) : host.appendChild(box);
    }
  }

  /* ============================================================
     DETAIL PRODUKTU — Živé demo z parametru + sticky lišta
     ============================================================ */
  function product() {
    // Demo URL: skrytý <span data-demo> v krátkém popisu (.p-short-description)
    var demoSpan = document.querySelector(".p-short-description [data-demo], .p-detail [data-demo]");
    var demoUrl = demoSpan ? demoSpan.getAttribute("data-demo") : null;
    var demoHref = demoUrl ? (demoUrl.indexOf("http") === 0 ? demoUrl : "https://" + demoUrl) : null;

    // „Živé okno" kolem hlavního obrázku
    if (demoUrl && once("detail-frame")) {
      var pimg = document.querySelector(".p-image");
      if (pimg && !pimg.closest(".sc-frame")) {
        var frame = mark(el("div", "sc-frame sc-frame--detail"), "detail-frame");
        frame.appendChild(el("div", "sc-frame__bar",
          '<span class="sc-frame__dots"><i></i><i></i><i></i></span>' +
          '<span class="sc-frame__url">' + esc(demoUrl) + '</span>' +
          '<span class="sc-frame__live">ŽIVÉ DEMO</span>'));
        pimg.parentNode.insertBefore(frame, pimg);
        frame.appendChild(pimg);
      }
    }

    // Badge chips (Obor / Styl) nad názvem
    if (once("chips")) {
      var chipVals = [];
      Array.prototype.forEach.call(document.querySelectorAll(".detail-parameters .detail-parameter"), function (p) {
        var t = (p.textContent || "").toLowerCase();
        if (t.indexOf("obor") !== -1 || t.indexOf("styl") !== -1) {
          var v = p.querySelector(".detail-parameter-value, span:last-child");
          if (v) chipVals.push(v.textContent.trim());
        }
      });
      var dattr = document.querySelector(".p-short-description [data-obor], .p-detail [data-obor]");
      if (!chipVals.length && dattr) {
        if (dattr.getAttribute("data-obor")) chipVals.push(dattr.getAttribute("data-obor"));
        if (dattr.getAttribute("data-styl")) chipVals.push(dattr.getAttribute("data-styl"));
      }
      var h1 = document.querySelector(".p-data-wrapper h1");
      if (chipVals.length && h1) {
        var chips = mark(el("div", "sc-chips"), "chips");
        chips.innerHTML = chipVals.map(function (v) { return '<span class="sc-badge">' + esc(v) + "</span>"; }).join("");
        h1.parentNode.insertBefore(chips, h1);
      }
    }

    // Pilulka „vč. nasazení" za cenou + poznámky pod cenou
    if (once("price-extras")) {
      var priceWrap = document.querySelector(".p-price-wrapper");
      if (priceWrap) {
        var priceFinal = priceWrap.querySelector(".price-final");
        if (priceFinal && !priceWrap.querySelector(".sc-pill")) {
          var pill = el("span", "sc-pill", "vč. nasazení");
          priceFinal.parentNode.insertBefore(pill, priceFinal.nextSibling);
        }
        var lines = mark(el("div", "sc-buy-lines"), "price-extras");
        lines.innerHTML =
          '<span class="sc-line-note">Konečná cena — nejsme plátci DPH.</span>' +
          '<span class="sc-line-avail">Ihned k nasazení — hotovo do 5 pracovních dnů</span>';
        priceWrap.parentNode.insertBefore(lines, priceWrap.nextSibling);
      }
    }

    // „Živé demo" vedle CTA + přejmenování hlavního tlačítka
    if (once("buyrow")) {
      var addBtn0 = document.querySelector(".add-to-cart-button");
      if (addBtn0) {
        var icon = addBtn0.querySelector("i");
        addBtn0.setAttribute("aria-label", "Koupit s nasazením");
        addBtn0.innerHTML = (icon ? icon.outerHTML : "") + "Koupit s nasazením";
        if (demoHref) {
          var host = addBtn0.closest(".add-to-cart") || addBtn0.parentNode;
          var demo2 = el("a", "btn btn-primary sc-demo-side", "Živé demo");
          demo2.href = demoHref; demo2.target = "_blank"; demo2.rel = "noopener";
          host.appendChild(demo2);
        }
      }
    }

    // „Co je v ceně" jako karta pod nákupním blokem
    if (once("included-card")) {
      var incl = document.querySelector(".basic-description ul.sc-included, .description-inner ul.sc-included");
      var toCart = document.querySelector(".p-to-cart-block") || document.querySelector(".add-to-cart");
      if (incl && toCart) {
        var heading = incl.previousElementSibling;
        var card = mark(el("div", "sc-included-card"), "included-card");
        card.appendChild(el("strong", "sc-included-title", "Co je v ceně"));
        card.appendChild(incl);
        if (heading && /co je v ceně/i.test(heading.textContent || "")) heading.remove();
        toCart.parentNode.insertBefore(card, toCart.nextSibling);
        var rea = el("p", "sc-reassure", "Bezpečná platba kartou i převodem · faktura samozřejmostí");
        card.parentNode.insertBefore(rea, card.nextSibling);
      }
    }

    // Sticky nákupní lišta (hlavně mobil)
    if (once("buybar")) {
      var addBtn = document.querySelector(".add-to-cart-button");
      var nameEl = document.querySelector(".p-data-wrapper h1, .p-detail-inner-header h1, .p-detail-inner-header-mobile .h1");
      var priceEl = document.querySelector(".price-final-holder, .p-price-wrapper .price-final");
      if (addBtn && priceEl) {
        var bar = mark(el("div", "sc-buybar"), "buybar");
        bar.innerHTML =
          '<span class="sc-buybar__name" style="font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:40%">' + esc(nameEl ? nameEl.textContent.trim() : "Šablona") + '</span>' +
          '<span class="sc-buybar__price">' + esc(priceEl.textContent.trim()) + '</span>' +
          '<button type="button" class="btn btn-conversion sc-buybar__cta" style="color:#fff;padding:12px 22px;border-radius:var(--sc-r-btn)">Koupit s nasazením</button>';
        document.body.appendChild(bar);
        bar.querySelector(".sc-buybar__cta").addEventListener("click", function () { addBtn.click(); });
        var io = new IntersectionObserver(function (entries) {
          bar.classList.toggle("sc-buybar--visible", !entries[0].isIntersecting);
        }, { threshold: 0 });
        io.observe(addBtn);
      }
    }
  }

  /* ============================================================
     KOŠÍK — 1. KROK: trust prvky u CTA + prázdný stav
     (za 1. krokem už žádné JS)
     ============================================================ */
  function cart() {
    // pouze první krok — pozná se dle nepřítomnosti .ordering-process
    var isFirstStep = !document.querySelector(".ordering-process");
    var isEmpty = document.querySelector(".cart-empty, .cart-emptied") ||
      !document.querySelector(".cart-table .removeItem, .cart-table tbody tr");

    if (isEmpty && once("empty-cart")) {
      var c = CFG.emptyCart;
      var host = document.querySelector(".cart-empty, .cart-emptied, .content-inner");
      if (host) {
        var box = mark(el("div", "sc-empty"), "empty-cart");
        box.innerHTML =
          '<strong style="font-family:var(--sc-font-head);font-size:22px">' + esc(c.title) + '</strong>' +
          '<p style="color:var(--sc-steel);margin:0">' + esc(c.text) + '</p>' +
          '<a class="btn btn-conversion" href="' + esc(c.cta.href) + '" style="color:#fff;padding:13px 24px;border-radius:var(--sc-r-btn)">' + esc(c.cta.label) + ' →</a>';
        host.appendChild(box);
      }
      return;
    }

    if (isFirstStep && once("cart-trust")) {
      // 1) primárně pod souhrn (rekapitulace) — spolehlivě existuje
      var summary = document.querySelector(
        ".cart-summary, .summary-wrapper, .order-summary, .cart-sidebar, .checkout-box-wrapper");
      // 2) fallback: k tlačítku Pokračovat (různé buildy Samby)
      var cta = document.querySelector(
        ".btn-conversion, .cart-buttons a, a[href*='doprava'], a[href*='objednavka'], .action-buttons a");
      var host = summary || (cta ? cta.parentNode : null);
      if (host) {
        var t = mark(el("div", "sc-trust"), "cart-trust");
        t.style.padding = "14px 0 2px";
        t.innerHTML = CFG.cartTrust.map(function (x) { return "<span>" + esc(x) + "</span>"; }).join("");
        if (summary) summary.appendChild(t);
        else host.insertBefore(t, cta.nextSibling);
      }
    }
  }

  /* ============================================================
     Před/po slider — použije se všude, kde je .sc-ba v obsahu
     [SHOPTET vloží prázdný <div class="sc-ba" data-before data-after>]
     ============================================================ */
  function beforeAfter() {
    var nodes = document.querySelectorAll(".sc-ba:not([data-sc])");
    Array.prototype.forEach.call(nodes, function (node) {
      mark(node, "ba");
      var before = node.getAttribute("data-before");
      var after = node.getAttribute("data-after");
      node.style.position = "relative";
      node.style.overflow = "hidden";
      node.innerHTML =
        '<img src="' + esc(after) + '" alt="po" style="display:block;width:100%">' +
        '<div class="sc-ba__before" style="position:absolute;inset:0;width:50%;overflow:hidden;border-right:2px solid #fff"><img src="' + esc(before) + '" alt="před" style="display:block;height:100%;width:auto;max-width:none"></div>' +
        '<input class="sc-ba__range" type="range" min="0" max="100" value="50" aria-label="Porovnat před a po" style="position:absolute;left:0;right:0;bottom:12px;width:60%;margin:0 auto">';
      var clip = node.querySelector(".sc-ba__before");
      var range = node.querySelector(".sc-ba__range");
      range.addEventListener("input", function () { clip.style.width = range.value + "%"; });
    });
  }

  /* ---------- Router -------------------------------------- */
  function run() {
    var type = pageType();
    try {
      homepage();                  // mount-based (#sc-hero / #sc-steps) — bezpečné kdekoliv
      if (type === "category") category();
      if (type === "product") product();
      if (type === "cart") cart();
      beforeAfter();               // kdekoliv v obsahu
    } catch (e) {
      if (window.console) console.warn("[softema] init:", e);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  // Shoptet překresluje výpis přes AJAX (filtr, stránkování) —
  // znovu ozdobíme karty, když se DOM změní.
  document.addEventListener("ShoptetDeferredContentLoaded", run);
  document.addEventListener("ShoptetProductListLoaded", function () { decorateProductCards(); });
})();
