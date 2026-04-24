// Toby Music — Figma Builder Plugin
// ================================================
// HOW TO RUN:
// 1. Open Figma → Plugins → Development → Import plugin from manifest
// 2. Select figma-plugin/manifest.json from this repo
// 3. Run the plugin — it builds all pages automatically
// ================================================

const C = {
  bg:       { r: 0.973, g: 0.957, b: 0.933 },
  fg:       { r: 0.137, g: 0.090, b: 0.063 },
  card:     { r: 0.929, g: 0.894, b: 0.851 },
  border:   { r: 0.808, g: 0.749, b: 0.690 },
  muted:    { r: 0.541, g: 0.478, b: 0.447 },
  fireBright: { r: 0.953, g: 0.573, b: 0.118 },
  fireCore:   { r: 0.812, g: 0.255, b: 0.071 },
  fireDeep:   { r: 0.557, g: 0.106, b: 0.031 },
  goldLight:  { r: 0.925, g: 0.784, b: 0.306 },
  goldMain:   { r: 0.851, g: 0.635, b: 0.165 },
  goldDark:   { r: 0.678, g: 0.486, b: 0.122 },
  wineDeep:   { r: 0.388, g: 0.063, b: 0.118 },
  wineMain:   { r: 0.620, g: 0.180, b: 0.247 },
  wineLight:  { r: 0.659, g: 0.282, b: 0.353 },
  white:    { r: 1, g: 1, b: 1 },
  darkBg:   { r: 0.082, g: 0.055, b: 0.035 },
};

const F = { family: "Inter", style: "Regular" };
const FB = { family: "Inter", style: "Bold" };
const FSB = { family: "Inter", style: "Semi Bold" };

function mkRect(name, w, h, color, radius) {
  const r = figma.createRectangle();
  r.name = name;
  r.resize(w, h);
  r.fills = [{ type: "SOLID", color }];
  if (radius) r.cornerRadius = radius;
  return r;
}

function mkText(content, size, color, font, align) {
  const t = figma.createText();
  t.fontName = font || F;
  t.characters = content;
  t.fontSize = size;
  t.fills = [{ type: "SOLID", color }];
  if (align) t.textAlignHorizontal = align;
  return t;
}

function mkFrame(name, w, h, color) {
  const f = figma.createFrame();
  f.name = name;
  f.resize(w, h);
  f.fills = color ? [{ type: "SOLID", color }] : [];
  return f;
}

function setAuto(f, dir, spacing, pt, pb, pl, pr) {
  f.layoutMode = dir || "VERTICAL";
  f.primaryAxisSizingMode = "AUTO";
  f.counterAxisSizingMode = "FIXED";
  if (spacing != null) f.itemSpacing = spacing;
  if (pt != null) f.paddingTop = pt;
  if (pb != null) f.paddingBottom = pb;
  if (pl != null) f.paddingLeft = pl;
  if (pr != null) f.paddingRight = pr;
}

function setFixed(f, dir, spacing, pt, pb, pl, pr) {
  f.layoutMode = dir || "VERTICAL";
  f.primaryAxisSizingMode = "FIXED";
  f.counterAxisSizingMode = "FIXED";
  if (spacing != null) f.itemSpacing = spacing;
  if (pt != null) f.paddingTop = pt;
  if (pb != null) f.paddingBottom = pb;
  if (pl != null) f.paddingLeft = pl;
  if (pr != null) f.paddingRight = pr;
}

function addShadow(f) {
  f.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0.08, g: 0.05, b: 0.03, a: 0.13 },
    offset: { x: 0, y: 14 },
    radius: 36,
    spread: 0,
    visible: true,
    blendMode: "NORMAL",
  }];
}

// ── Header ───────────────────────────────────────────────
function buildHeader(W) {
  const h = mkFrame("Header", W, 72, C.bg);
  setFixed(h, "HORIZONTAL", 0, 0, 0, 48, 48);
  h.primaryAxisAlignItems = "SPACE_BETWEEN";
  h.counterAxisAlignItems = "CENTER";

  const logo = mkRect("Logo", 110, 38, C.fireBright, 8);
  logo.layoutAlign = "CENTER";

  const nav = mkFrame("Nav", 0, 0, null);
  nav.layoutMode = "HORIZONTAL";
  nav.primaryAxisSizingMode = "AUTO";
  nav.counterAxisSizingMode = "AUTO";
  nav.itemSpacing = 4;
  nav.counterAxisAlignItems = "CENTER";
  ["בית","תזמורות","הופעות","תלמידות","תווים","אודות","בלוג"].forEach(label => {
    const pill = mkFrame(`nav-${label}`, 0, 0, null);
    pill.layoutMode = "HORIZONTAL";
    pill.primaryAxisSizingMode = "AUTO";
    pill.counterAxisSizingMode = "AUTO";
    pill.paddingTop = 8; pill.paddingBottom = 8;
    pill.paddingLeft = 14; pill.paddingRight = 14;
    pill.cornerRadius = 999;
    const t = mkText(label, 13, C.muted, F);
    pill.appendChild(t);
    nav.appendChild(pill);
  });

  const cta = mkFrame("CTA", 90, 36, C.wineMain, 999);
  setFixed(cta, "HORIZONTAL", 0, 0, 0, 0, 0);
  cta.primaryAxisAlignItems = "CENTER";
  cta.counterAxisAlignItems = "CENTER";
  cta.layoutAlign = "CENTER";
  cta.appendChild(mkText("צור קשר", 13, C.white, FSB, "CENTER"));

  h.appendChild(logo);
  h.appendChild(nav);
  h.appendChild(cta);
  return h;
}

// ── Footer ───────────────────────────────────────────────
function buildFooter(W) {
  const f = mkFrame("Footer", W, 200, C.fireDeep);
  setFixed(f, "VERTICAL", 16, 48, 48, 0, 0);
  f.primaryAxisAlignItems = "CENTER";
  f.counterAxisAlignItems = "CENTER";

  const logo = mkText("Toby Music", 28, C.goldMain, FB, "CENTER");
  logo.layoutAlign = "CENTER";

  const tagline = mkText("הופעות  •  תזמורות  •  תלמידות  •  תווים  •  בלוג", 12,
    { r: 0.9, g: 0.85, b: 0.78 }, F, "CENTER");
  tagline.layoutAlign = "CENTER";
  tagline.opacity = 0.7;

  const copy = mkText("© 2025 Toby Music. כל הזכויות שמורות.", 11, C.white, F, "CENTER");
  copy.layoutAlign = "CENTER";
  copy.opacity = 0.4;

  f.appendChild(logo);
  f.appendChild(tagline);
  f.appendChild(copy);
  return f;
}

// ── Homepage ─────────────────────────────────────────────
function buildHomepage() {
  const W = 1440;
  const page = mkFrame("🏠 Homepage", W, 0, C.bg);
  setAuto(page, "VERTICAL", 0);

  page.appendChild(buildHeader(W));

  // Hero
  const hero = mkFrame("Hero — Stage", W, 860, C.darkBg);
  setFixed(hero, "VERTICAL", 32, 100, 40, 0, 0);
  hero.primaryAxisAlignItems = "CENTER";
  hero.counterAxisAlignItems = "CENTER";

  const heroTitle = mkText("המוזיקה מתחילה כאן", 64, C.white, FB, "CENTER");
  heroTitle.layoutAlign = "CENTER";

  const heroSub = mkText("הופעות, תזמורות, תלמידות, תווים ותוכן — במקום אחד.", 20,
    { r: 0.9, g: 0.87, b: 0.82 }, F, "CENTER");
  heroSub.layoutAlign = "CENTER";

  const heroSlogan = mkText("אומנות ואמינות — זו יצירה", 22, C.goldMain, FB, "CENTER");
  heroSlogan.layoutAlign = "CENTER";

  // Stage characters row
  const charRow = mkFrame("Stage Characters", W, 360, null);
  setFixed(charRow, "HORIZONTAL", 0, 0, 0, 40, 40);
  charRow.primaryAxisAlignItems = "SPACE_BETWEEN";
  charRow.counterAxisAlignItems = "FLEX_END";

  const chars = [
    { name: "צור קשר",  color: C.wineMain,   h: 180 },
    { name: "תלמידות", color: C.goldMain,   h: 240 },
    { name: "תזמורות", color: C.fireBright, h: 280 },
    { name: "אודות",   color: C.fireCore,   h: 300 },
    { name: "תווים",   color: C.goldDark,   h: 310 },
    { name: "בלוג",    color: C.wineLight,  h: 270 },
    { name: "הופעות",  color: C.fireDeep,   h: 210 },
  ];
  chars.forEach(c => {
    const box = mkFrame(c.name, 160, c.h, { ...c.color });
    box.fills = [{ type: "SOLID", color: c.color, opacity: 0.75 }];
    box.cornerRadius = 16;
    setFixed(box, "VERTICAL", 0, 0, 16, 0, 0);
    box.primaryAxisAlignItems = "MAX";
    box.counterAxisAlignItems = "CENTER";
    const lbl = mkText(c.name, 13, C.white, FB, "CENTER");
    lbl.layoutAlign = "CENTER";
    box.appendChild(lbl);
    charRow.appendChild(box);
  });

  hero.appendChild(heroTitle);
  hero.appendChild(heroSub);
  hero.appendChild(heroSlogan);
  hero.appendChild(charRow);
  page.appendChild(hero);

  // Cards grid
  const gridSec = mkFrame("Cards Grid Section", W, 0, C.bg);
  setAuto(gridSec, "VERTICAL", 32, 80, 80, 80, 80);

  const gridTitle = mkText("מה תמצאו כאן", 36, C.fg, FB, "RIGHT");
  gridTitle.layoutAlign = "STRETCH";

  const grid = mkFrame("Grid", 0, 0, null);
  grid.layoutMode = "HORIZONTAL";
  grid.primaryAxisSizingMode = "AUTO";
  grid.counterAxisSizingMode = "AUTO";
  grid.itemSpacing = 24;
  grid.flexWrap = "WRAP";

  chars.forEach(c => {
    const card = mkFrame(`Card — ${c.name}`, 0, 260, C.card);
    card.layoutMode = "VERTICAL";
    card.primaryAxisSizingMode = "AUTO";
    card.counterAxisSizingMode = "FIXED";
    card.resize(260, 260);
    card.primaryAxisSizingMode = "FIXED";
    card.cornerRadius = 24;
    card.paddingTop = 28; card.paddingBottom = 28;
    card.paddingLeft = 24; card.paddingRight = 24;
    card.itemSpacing = 12;
    addShadow(card);

    const thumb = mkRect("Character", 72, 90, c.color, 10);
    thumb.layoutAlign = "CENTER";

    const ct = mkText(c.name, 18, C.fg, FB, "RIGHT");
    ct.layoutAlign = "STRETCH";

    card.appendChild(thumb);
    card.appendChild(ct);
    grid.appendChild(card);
  });

  gridSec.appendChild(gridTitle);
  gridSec.appendChild(grid);
  page.appendChild(gridSec);
  page.appendChild(buildFooter(W));
  return page;
}

// ── Inner Page Template ───────────────────────────────────
function buildInnerPage(name, title, sections) {
  const W = 1440;
  const page = mkFrame(name, W, 0, C.bg);
  setAuto(page, "VERTICAL", 0);

  page.appendChild(buildHeader(W));

  // Hero banner
  const hero = mkFrame("Page Hero", W, 260, C.fireDeep);
  setFixed(hero, "VERTICAL", 12, 0, 0, 0, 0);
  hero.primaryAxisAlignItems = "CENTER";
  hero.counterAxisAlignItems = "CENTER";

  const breadcrumb = mkText("בית  /  " + title, 13, { r: 1, g: 1, b: 1 }, F, "CENTER");
  breadcrumb.opacity = 0.5;
  breadcrumb.layoutAlign = "CENTER";

  const t = mkText(title, 48, C.white, FB, "CENTER");
  t.layoutAlign = "CENTER";

  hero.appendChild(breadcrumb);
  hero.appendChild(t);
  page.appendChild(hero);

  // Content sections
  sections.forEach(sec => {
    const s = mkFrame(sec.name, W, 0, sec.bg || C.bg);
    setAuto(s, "VERTICAL", 24, 64, 64, 80, 80);

    if (sec.title) {
      const st = mkText(sec.title, 30, C.fg, FB, "RIGHT");
      st.layoutAlign = "STRETCH";
      s.appendChild(st);
    }
    if (sec.text) {
      const sb = mkText(sec.text, 16, C.muted, F, "RIGHT");
      sb.layoutAlign = "STRETCH";
      s.appendChild(sb);
    }

    if (sec.type === "cards") {
      const row = mkFrame("Cards Row", 0, 0, null);
      row.layoutMode = "HORIZONTAL";
      row.primaryAxisSizingMode = "AUTO";
      row.counterAxisSizingMode = "AUTO";
      row.itemSpacing = 24;
      for (let i = 0; i < (sec.count || 3); i++) {
        const card = mkFrame(`Card ${i+1}`, 340, 220, C.card);
        card.cornerRadius = 20;
        card.primaryAxisSizingMode = "FIXED";
        card.counterAxisSizingMode = "FIXED";
        addShadow(card);
        row.appendChild(card);
      }
      s.appendChild(row);
    }

    if (sec.type === "form") {
      ["שם מלא", "אימייל", "נושא"].forEach(label => {
        const field = mkFrame(`Field — ${label}`, 800, 52, C.white);
        field.cornerRadius = 12;
        field.strokeWeight = 1;
        field.strokes = [{ type: "SOLID", color: C.border }];
        setFixed(field, "HORIZONTAL", 0, 0, 0, 16, 16);
        field.counterAxisAlignItems = "CENTER";
        field.appendChild(mkText(label, 14, C.muted, F));
        s.appendChild(field);
      });

      const msgField = mkFrame("Field — הודעה", 800, 120, C.white);
      msgField.cornerRadius = 12;
      msgField.strokeWeight = 1;
      msgField.strokes = [{ type: "SOLID", color: C.border }];
      setFixed(msgField, "VERTICAL", 0, 16, 0, 16, 16);
      msgField.appendChild(mkText("הודעה", 14, C.muted, F));
      s.appendChild(msgField);

      const btn = mkFrame("Submit", 180, 48, C.wineMain);
      btn.cornerRadius = 999;
      setFixed(btn, "HORIZONTAL", 0, 0, 0, 0, 0);
      btn.primaryAxisAlignItems = "CENTER";
      btn.counterAxisAlignItems = "CENTER";
      btn.appendChild(mkText("שלח הודעה", 15, C.white, FB, "CENTER"));
      s.appendChild(btn);
    }

    if (sec.type === "blog-grid") {
      const featured = mkFrame("Featured Article", W - 160, 400, C.card);
      featured.cornerRadius = 24;
      featured.primaryAxisSizingMode = "FIXED";
      featured.counterAxisSizingMode = "FIXED";
      addShadow(featured);

      const small = mkFrame("Small Articles Row", 0, 0, null);
      small.layoutMode = "HORIZONTAL";
      small.primaryAxisSizingMode = "AUTO";
      small.counterAxisSizingMode = "AUTO";
      small.itemSpacing = 24;
      for (let i = 0; i < 4; i++) {
        const sc = mkFrame(`Article ${i+1}`, 290, 280, C.card);
        sc.cornerRadius = 20;
        sc.primaryAxisSizingMode = "FIXED";
        sc.counterAxisSizingMode = "FIXED";
        addShadow(sc);
        small.appendChild(sc);
      }
      s.appendChild(featured);
      s.appendChild(small);
    }

    page.appendChild(s);
  });

  page.appendChild(buildFooter(W));
  return page;
}

// ── Mobile Frame ─────────────────────────────────────────
function buildMobileHomepage() {
  const W = 390;
  const page = mkFrame("📱 Homepage — Mobile", W, 0, C.bg);
  setAuto(page, "VERTICAL", 0);

  // Mobile header
  const mh = mkFrame("Mobile Header", W, 64, C.bg);
  setFixed(mh, "HORIZONTAL", 0, 0, 0, 20, 20);
  mh.primaryAxisAlignItems = "SPACE_BETWEEN";
  mh.counterAxisAlignItems = "CENTER";
  mh.appendChild(mkRect("Logo", 80, 32, C.fireBright, 6));
  mh.appendChild(mkRect("Menu Icon", 24, 24, C.fg, 4));
  page.appendChild(mh);

  // Hero
  const hero = mkFrame("Hero", W, 500, C.darkBg);
  setFixed(hero, "VERTICAL", 16, 80, 40, 24, 24);
  hero.primaryAxisAlignItems = "CENTER";
  hero.counterAxisAlignItems = "CENTER";

  const t = mkText("המוזיקה מתחילה כאן", 32, C.white, FB, "CENTER");
  t.layoutAlign = "CENTER";
  const sub = mkText("הופעות, תזמורות, תלמידות — במקום אחד.", 15,
    { r: 0.9, g: 0.87, b: 0.82 }, F, "CENTER");
  sub.layoutAlign = "CENTER";
  hero.appendChild(t);
  hero.appendChild(sub);
  page.appendChild(hero);

  // Mobile cards
  const cards = mkFrame("Mobile Cards", W, 0, C.bg);
  setAuto(cards, "VERTICAL", 16, 24, 24, 20, 20);

  ["תלמידות","תזמורות","אודות","תווים","בלוג","הופעות"].forEach(label => {
    const card = mkFrame(label, W - 40, 80, C.card);
    card.cornerRadius = 16;
    setFixed(card, "HORIZONTAL", 0, 0, 0, 20, 20);
    card.counterAxisAlignItems = "CENTER";
    card.primaryAxisSizingMode = "FIXED";
    card.counterAxisSizingMode = "FIXED";
    card.appendChild(mkText(label, 16, C.fg, FB, "RIGHT"));
    cards.appendChild(card);
  });

  page.appendChild(cards);
  page.appendChild(buildFooter(W));
  return page;
}

// ── Main ─────────────────────────────────────────────────
async function main() {
  await figma.loadFontAsync(F);
  await figma.loadFontAsync(FB);
  await figma.loadFontAsync(FSB);

  figma.currentPage.name = "🎵 Toby Music — Screens";

  const frames = [
    buildHomepage(),
    buildMobileHomepage(),
    buildInnerPage("📖 אודות", "אודות", [
      { name: "Story", title: "הסיפור של Toby Music",
        text: "הסיפור, הדרך והאני מאמין של Toby Music — במקום אחד, ברור ומדויק." },
      { name: "Values", type: "cards", count: 3 },
    ]),
    buildInnerPage("👩‍🎓 תלמידות", "תלמידות", [
      { name: "Intro", title: "תוכנית הלימודים",
        text: "מרחב שמחבר בין לימוד, תרגול, התקדמות וקשר אישי — בצורה חיה ונעימה." },
      { name: "Programs", type: "cards", count: 3 },
    ]),
    buildInnerPage("🎻 תזמורות", "תזמורות", [
      { name: "Intro", title: "הרכבים לאירועים",
        text: "הרכבים, סגנונות ואפשרויות שמתאימים לאירוע שלכם — בלי להסתבך." },
      { name: "Ensembles", type: "cards", count: 4 },
    ]),
    buildInnerPage("🎵 בלוג", "בלוג", [
      { name: "Articles", title: "מאמרים אחרונים", type: "blog-grid" },
    ]),
    buildInnerPage("📞 צור קשר", "צור קשר", [
      { name: "Form", title: "נשמח לשמוע ממך", type: "form" },
    ]),
    buildInnerPage("🎭 הופעות", "הופעות", [
      { name: "Events", title: "יומן הופעות", type: "cards", count: 3 },
    ]),
    buildInnerPage("🎼 תווים", "תווים", [
      { name: "Library", title: "ספריית תווים", type: "cards", count: 6 },
    ]),
  ];

  let x = 0;
  frames.forEach(p => {
    p.x = x;
    p.y = 0;
    figma.currentPage.appendChild(p);
    x += p.width + 120;
  });

  figma.viewport.scrollAndZoomIntoView(frames);
  figma.notify("✅ כל מסכי Toby Music נוצרו בהצלחה!", { timeout: 4000 });
  figma.closePlugin();
}

main().catch(err => {
  figma.notify("❌ שגיאה: " + err.message, { error: true });
  figma.closePlugin();
});
