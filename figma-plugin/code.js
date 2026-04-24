// Toby Music — Figma Design Builder
// Creates clean, design-ready screens for manual editing in Figma

// ── Colours ──────────────────────────────────────────────
const C = {
  bg:         { r: 0.973, g: 0.957, b: 0.933 },
  fg:         { r: 0.137, g: 0.090, b: 0.063 },
  card:       { r: 0.929, g: 0.894, b: 0.851 },
  border:     { r: 0.808, g: 0.749, b: 0.690 },
  muted:      { r: 0.541, g: 0.478, b: 0.447 },
  fireBright: { r: 0.953, g: 0.573, b: 0.118 },
  fireCore:   { r: 0.812, g: 0.255, b: 0.071 },
  fireDeep:   { r: 0.557, g: 0.106, b: 0.031 },
  goldLight:  { r: 0.925, g: 0.784, b: 0.306 },
  goldMain:   { r: 0.851, g: 0.635, b: 0.165 },
  goldDark:   { r: 0.678, g: 0.486, b: 0.122 },
  wineDeep:   { r: 0.388, g: 0.063, b: 0.118 },
  wineMain:   { r: 0.620, g: 0.180, b: 0.247 },
  wineLight:  { r: 0.659, g: 0.282, b: 0.353 },
  white:      { r: 1,     g: 1,     b: 1     },
  darkBg:     { r: 0.082, g: 0.055, b: 0.035 },
  stageBg:    { r: 0.060, g: 0.038, b: 0.022 },
};

// ── Fonts ─────────────────────────────────────────────────
const F   = { family: "Inter", style: "Regular"  };
const FB  = { family: "Inter", style: "Bold"      };
const FSB = { family: "Inter", style: "SemiBold"  };

// ── Primitives ────────────────────────────────────────────
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
  f.clipsContent = true;
  return f;
}

// ── Layout helpers ────────────────────────────────────────
function hFixed(f, gap, pt, pb, pl, pr) {
  f.layoutMode = "HORIZONTAL";
  f.primaryAxisSizingMode   = "FIXED";
  f.counterAxisSizingMode   = "FIXED";
  if (gap != null) f.itemSpacing    = gap;
  if (pt  != null) f.paddingTop     = pt;
  if (pb  != null) f.paddingBottom  = pb;
  if (pl  != null) f.paddingLeft    = pl;
  if (pr  != null) f.paddingRight   = pr;
}

function vAuto(f, gap, pt, pb, pl, pr) {
  f.layoutMode = "VERTICAL";
  f.primaryAxisSizingMode   = "AUTO";
  f.counterAxisSizingMode   = "FIXED";
  if (gap != null) f.itemSpacing    = gap;
  if (pt  != null) f.paddingTop     = pt;
  if (pb  != null) f.paddingBottom  = pb;
  if (pl  != null) f.paddingLeft    = pl;
  if (pr  != null) f.paddingRight   = pr;
}

function vFixed(f, gap, pt, pb, pl, pr) {
  f.layoutMode = "VERTICAL";
  f.primaryAxisSizingMode   = "FIXED";
  f.counterAxisSizingMode   = "FIXED";
  if (gap != null) f.itemSpacing    = gap;
  if (pt  != null) f.paddingTop     = pt;
  if (pb  != null) f.paddingBottom  = pb;
  if (pl  != null) f.paddingLeft    = pl;
  if (pr  != null) f.paddingRight   = pr;
}

function centered(f) {
  f.primaryAxisAlignItems = "CENTER";
  f.counterAxisAlignItems = "CENTER";
}

function spaceBetween(f) {
  f.primaryAxisAlignItems  = "SPACE_BETWEEN";
  f.counterAxisAlignItems  = "CENTER";
}

function addShadow(f) {
  f.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0.08, g: 0.05, b: 0.03, a: 0.12 },
    offset: { x: 0, y: 8 },
    radius: 24,
    spread: 0,
    visible: true,
    blendMode: "NORMAL",
  }];
}

// ── Button ────────────────────────────────────────────────
function mkBtn(label, bgColor, txtColor, w) {
  const b = mkFrame("Button — " + label, w || 160, 48, bgColor);
  b.cornerRadius = 999;
  b.layoutMode = "HORIZONTAL";
  b.primaryAxisSizingMode = "FIXED";
  b.counterAxisSizingMode = "FIXED";
  b.paddingLeft = 28; b.paddingRight = 28;
  centered(b);
  b.appendChild(mkText(label, 15, txtColor, FB, "CENTER"));
  return b;
}

// ── Header ────────────────────────────────────────────────
function buildHeader(W) {
  const h = mkFrame("Header", W, 80, C.bg);
  hFixed(h, 0, 0, 0, 48, 48);
  spaceBetween(h);

  // Logo
  const logo = mkFrame("Logo", 160, 80, null);
  hFixed(logo, 10, 0, 0, 0, 0);
  logo.counterAxisAlignItems = "CENTER";
  logo.fills = [];
  logo.appendChild(mkRect("LogoIcon", 36, 36, C.fireBright, 8));
  logo.appendChild(mkText("Toby Music", 16, C.fg, FB));
  logo.layoutAlign = "CENTER";

  // Nav
  const nav = mkFrame("Nav", 0, 0, null);
  nav.layoutMode = "HORIZONTAL";
  nav.primaryAxisSizingMode = "AUTO";
  nav.counterAxisSizingMode = "AUTO";
  nav.itemSpacing = 4;
  nav.counterAxisAlignItems = "CENTER";
  nav.fills = [];
  nav.clipsContent = false;

  const navItems = ["בית", "תזמורות", "הופעות", "תלמידות", "תווים", "אודות", "בלוג"];
  navItems.forEach((label, i) => {
    const pill = mkFrame("nav-" + label, 0, 36, i === 0 ? C.card : null);
    pill.layoutMode = "HORIZONTAL";
    pill.primaryAxisSizingMode = "AUTO";
    pill.counterAxisSizingMode = "FIXED";
    pill.paddingLeft = 16; pill.paddingRight = 16;
    pill.cornerRadius = 999;
    centered(pill);
    if (i !== 0) pill.fills = [];
    pill.appendChild(mkText(label, 14, i === 0 ? C.fg : C.muted, i === 0 ? FSB : F));
    nav.appendChild(pill);
  });
  nav.layoutAlign = "CENTER";

  const ctaBtn = mkBtn("צור קשר", C.wineMain, C.white, 120);
  ctaBtn.layoutAlign = "CENTER";

  h.appendChild(logo);
  h.appendChild(nav);
  h.appendChild(ctaBtn);
  return h;
}

// ── Hero ──────────────────────────────────────────────────
function buildHero(W) {
  const hero = mkFrame("Hero", W, 600, C.darkBg);
  vFixed(hero, 28, 140, 80, 0, 0);
  centered(hero);

  // Badge
  const badge = mkFrame("Badge", 0, 36, C.goldMain);
  badge.layoutMode = "HORIZONTAL";
  badge.primaryAxisSizingMode = "AUTO";
  badge.counterAxisSizingMode = "FIXED";
  badge.paddingLeft = 20; badge.paddingRight = 20;
  badge.cornerRadius = 999;
  centered(badge);
  badge.appendChild(mkText("אומנות ואמינות — זו יצירה", 13, C.darkBg, FSB, "CENTER"));
  badge.layoutAlign = "CENTER";

  // Title — two lines, large
  const title = mkText("המוזיקה מתחילה כאן", 76, C.white, FB, "CENTER");
  title.layoutAlign = "CENTER";
  title.textAutoResize = "HEIGHT";
  title.resize(860, 100);

  // Sub-title
  const sub = mkText(
    "הופעות, תזמורות, תלמידות, תווים ותוכן — במקום אחד.",
    22, { r: 0.82, g: 0.79, b: 0.74 }, F, "CENTER"
  );
  sub.layoutAlign = "CENTER";
  sub.textAutoResize = "HEIGHT";
  sub.resize(680, 40);

  // CTA buttons row
  const ctaRow = mkFrame("HeroCTA", 0, 48, null);
  ctaRow.layoutMode = "HORIZONTAL";
  ctaRow.primaryAxisSizingMode = "AUTO";
  ctaRow.counterAxisSizingMode = "FIXED";
  ctaRow.itemSpacing = 16;
  ctaRow.counterAxisAlignItems = "CENTER";
  ctaRow.fills = [];
  ctaRow.clipsContent = false;
  ctaRow.layoutAlign = "CENTER";
  ctaRow.appendChild(mkBtn("גלי עכשיו",  C.fireBright, C.darkBg, 160));
  ctaRow.appendChild(mkBtn("צרי קשר",    { r: 0.2, g: 0.2, b: 0.2 }, C.white, 140));

  hero.appendChild(badge);
  hero.appendChild(title);
  hero.appendChild(sub);
  hero.appendChild(ctaRow);
  return hero;
}

// ── Stage Characters section ──────────────────────────────
function buildStageSection(W) {
  const SIDE_PAD = 80;
  const GAP      = 28;
  const COUNT    = 7;
  const charW    = Math.floor((W - SIDE_PAD * 2 - GAP * (COUNT - 1)) / COUNT);

  const sec = mkFrame("Stage Characters", W, 420, C.stageBg);
  hFixed(sec, GAP, 0, 0, SIDE_PAD, SIDE_PAD);
  sec.counterAxisAlignItems = "FLEX_END";

  const chars = [
    { name: "צור קשר",  color: C.wineMain,   h: 200 },
    { name: "תלמידות",  color: C.goldMain,   h: 260 },
    { name: "תזמורות",  color: C.fireBright, h: 300 },
    { name: "אודות",    color: C.fireCore,   h: 340 },
    { name: "תווים",    color: C.goldDark,   h: 310 },
    { name: "בלוג",     color: C.wineLight,  h: 270 },
    { name: "הופעות",   color: C.fireDeep,   h: 220 },
  ];

  chars.forEach(c => {
    const col = mkFrame(c.name, charW, c.h, null);
    col.fills = [{ type: "SOLID", color: c.color, opacity: 0.85 }];
    col.cornerRadius = 14;
    vFixed(col, 0, 0, 20, 12, 12);
    col.primaryAxisAlignItems = "MAX";
    col.counterAxisAlignItems = "CENTER";
    const lbl = mkText(c.name, 13, C.white, FB, "CENTER");
    lbl.layoutAlign = "CENTER";
    col.appendChild(lbl);
    sec.appendChild(col);
  });

  return sec;
}

// ── Categories Bar ────────────────────────────────────────
function buildCategoriesBar(W) {
  const bar = mkFrame("Categories Bar", W, 72, C.bg);
  hFixed(bar, 10, 0, 0, 80, 80);
  bar.counterAxisAlignItems = "CENTER";
  bar.strokes = [{ type: "SOLID", color: C.border }];
  bar.strokeWeight = 1;
  bar.strokeAlign  = "INSIDE";

  const cats = ["הכל", "הופעות", "תזמורות", "תלמידות", "תווים", "בלוג", "אודות"];
  cats.forEach((label, i) => {
    const pill = mkFrame("cat-" + label, 0, 40, i === 0 ? C.fg : C.card);
    pill.layoutMode = "HORIZONTAL";
    pill.primaryAxisSizingMode = "AUTO";
    pill.counterAxisSizingMode = "FIXED";
    pill.paddingLeft = 20; pill.paddingRight = 20;
    pill.cornerRadius = 999;
    centered(pill);
    pill.appendChild(
      mkText(label, 14, i === 0 ? C.white : C.muted, i === 0 ? FSB : F, "CENTER")
    );
    bar.appendChild(pill);
  });

  return bar;
}

// ── Card (single) ─────────────────────────────────────────
function mkCard(name, w, h, thumbColor) {
  const card = mkFrame("Card — " + name, w, h, C.card);
  card.cornerRadius = 20;
  vFixed(card, 0, 0, 24, 0, 0);
  card.counterAxisAlignItems = "CENTER";
  addShadow(card);

  // Image placeholder — clipped by card corner radius
  const thumb = mkRect("Image", w, Math.round(h * 0.53), thumbColor || C.border, 0);
  card.appendChild(thumb);

  const content = mkFrame("Content", w - 48, 0, null);
  content.fills = [];
  vAuto(content, 8, 16, 0, 0, 0);
  content.layoutAlign = "CENTER";
  content.appendChild(mkText(name, 18, C.fg, FB, "RIGHT"));
  card.appendChild(content);

  return card;
}

// ── Cards Grid Section ────────────────────────────────────
function buildCardsGrid(W, items) {
  const SIDE_PAD = 80;
  const GAP      = 28;
  const COLS     = 3;
  const cardW    = Math.floor((W - SIDE_PAD * 2 - GAP * (COLS - 1)) / COLS);
  const cardH    = 300;

  const sec = mkFrame("Cards Grid", W, 0, C.bg);
  vAuto(sec, 40, 80, 80, SIDE_PAD, SIDE_PAD);

  const secTitle = mkText("מה תמצאי כאן", 40, C.fg, FB, "RIGHT");
  secTitle.layoutAlign = "STRETCH";
  secTitle.textAutoResize = "HEIGHT";
  sec.appendChild(secTitle);

  // Split items into rows of 3
  for (let row = 0; row < Math.ceil(items.length / COLS); row++) {
    const rowFrame = mkFrame("Row " + (row + 1), W - SIDE_PAD * 2, cardH, null);
    hFixed(rowFrame, GAP, 0, 0, 0, 0);
    rowFrame.counterAxisAlignItems = "STRETCH";
    rowFrame.fills = [];
    rowFrame.clipsContent = false;

    for (let col = 0; col < COLS; col++) {
      const item = items[row * COLS + col];
      if (!item) break;
      rowFrame.appendChild(mkCard(item.name, cardW, cardH, item.color));
    }
    sec.appendChild(rowFrame);
  }

  return sec;
}

// ── CTA Banner ────────────────────────────────────────────
function buildCTABanner(W) {
  const sec = mkFrame("CTA Banner", W, 260, C.wineDeep);
  vFixed(sec, 24, 0, 0, 0, 0);
  centered(sec);

  const t = mkText("מוכנה להתחיל?", 52, C.white, FB, "CENTER");
  t.layoutAlign = "CENTER";

  const sub = mkText(
    "הצטרפי לאלפי תלמידות ולקוחות מרוצים ברחבי הארץ",
    18, { r: 0.90, g: 0.80, b: 0.75 }, F, "CENTER"
  );
  sub.layoutAlign = "CENTER";
  sub.textAutoResize = "HEIGHT";
  sub.resize(600, 30);

  const btn = mkBtn("צרי קשר עכשיו", C.fireBright, C.darkBg, 200);
  btn.layoutAlign = "CENTER";

  sec.appendChild(t);
  sec.appendChild(sub);
  sec.appendChild(btn);
  return sec;
}

// ── Footer ────────────────────────────────────────────────
function buildFooter(W) {
  const f = mkFrame("Footer", W, 220, C.fireDeep);
  vFixed(f, 20, 44, 36, 80, 80);
  centered(f);

  // Top row: logo + links
  const top = mkFrame("FooterTop", W - 160, 48, null);
  hFixed(top, 0, 0, 0, 0, 0);
  spaceBetween(top);
  top.fills = [];
  top.clipsContent = false;

  const fLogo = mkText("Toby Music", 28, C.goldMain, FB, "LEFT");
  fLogo.layoutAlign = "CENTER";

  const fLinks = mkFrame("FooterLinks", 0, 0, null);
  fLinks.layoutMode = "HORIZONTAL";
  fLinks.primaryAxisSizingMode = "AUTO";
  fLinks.counterAxisSizingMode = "AUTO";
  fLinks.itemSpacing = 24;
  fLinks.counterAxisAlignItems = "CENTER";
  fLinks.fills = [];
  fLinks.clipsContent = false;
  fLinks.layoutAlign = "CENTER";
  ["הופעות", "תזמורות", "תלמידות", "תווים", "בלוג"].forEach(label => {
    fLinks.appendChild(mkText(label, 13, { r: 0.9, g: 0.85, b: 0.78 }, F));
  });

  top.appendChild(fLogo);
  top.appendChild(fLinks);

  // Divider
  const div = mkRect("Divider", W - 160, 1, { r: 1, g: 1, b: 1 }, 0);
  div.opacity = 0.12;
  div.layoutAlign = "STRETCH";

  // Copyright
  const copy = mkText("© 2025 Toby Music. כל הזכויות שמורות.", 12, C.white, F, "CENTER");
  copy.opacity = 0.4;
  copy.layoutAlign = "CENTER";

  f.appendChild(top);
  f.appendChild(div);
  f.appendChild(copy);
  return f;
}

// ── Homepage ──────────────────────────────────────────────
function buildHomepage() {
  const W = 1440;
  const page = mkFrame("🏠 Homepage", W, 0, C.bg);
  vAuto(page, 0, 0, 0, 0, 0);

  const cardItems = [
    { name: "הופעות",  color: C.fireCore   },
    { name: "תזמורות", color: C.fireBright },
    { name: "תלמידות", color: C.goldMain   },
    { name: "תווים",   color: C.goldDark   },
    { name: "בלוג",    color: C.wineLight  },
    { name: "אודות",   color: C.wineMain   },
  ];

  page.appendChild(buildHeader(W));
  page.appendChild(buildHero(W));
  page.appendChild(buildStageSection(W));
  page.appendChild(buildCategoriesBar(W));
  page.appendChild(buildCardsGrid(W, cardItems));
  page.appendChild(buildCTABanner(W));
  page.appendChild(buildFooter(W));
  return page;
}

// ── Inner page cards row ──────────────────────────────────
function mkCardsRow(W, count, cardH) {
  const SIDE_PAD = 80;
  const GAP      = 28;
  const cardW    = Math.floor((W - SIDE_PAD * 2 - GAP * (count - 1)) / count);
  const row = mkFrame("Cards", W - SIDE_PAD * 2, cardH || 280, null);
  hFixed(row, GAP, 0, 0, 0, 0);
  row.counterAxisAlignItems = "STRETCH";
  row.fills = [];
  row.clipsContent = false;
  for (let i = 0; i < count; i++) {
    const c = mkFrame("Card " + (i + 1), cardW, cardH || 280, C.card);
    c.cornerRadius = 20;
    c.primaryAxisSizingMode = "FIXED";
    c.counterAxisSizingMode = "FIXED";
    addShadow(c);
    row.appendChild(c);
  }
  return row;
}

// ── Inner Page Template ───────────────────────────────────
function buildInnerPage(name, title, accentColor, sections) {
  const W = 1440;
  const page = mkFrame(name, W, 0, C.bg);
  vAuto(page, 0, 0, 0, 0, 0);
  page.appendChild(buildHeader(W));

  // Banner
  const banner = mkFrame("Banner", W, 280, accentColor || C.fireDeep);
  vFixed(banner, 16, 0, 0, 0, 0);
  centered(banner);
  const bc = mkText("בית / " + title, 13, C.white, F, "CENTER");
  bc.opacity = 0.5;
  bc.layoutAlign = "CENTER";
  const bt = mkText(title, 56, C.white, FB, "CENTER");
  bt.layoutAlign = "CENTER";
  banner.appendChild(bc);
  banner.appendChild(bt);
  page.appendChild(banner);

  sections.forEach(sec => {
    const s = mkFrame(sec.name, W, 0, sec.bg || C.bg);
    vAuto(s, 32, 72, 72, 80, 80);

    if (sec.title) {
      const st = mkText(sec.title, 36, C.fg, FB, "RIGHT");
      st.layoutAlign = "STRETCH";
      st.textAutoResize = "HEIGHT";
      s.appendChild(st);
    }
    if (sec.text) {
      const sb = mkText(sec.text, 17, C.muted, F, "RIGHT");
      sb.layoutAlign = "STRETCH";
      sb.textAutoResize = "HEIGHT";
      s.appendChild(sb);
    }

    if (sec.type === "cards") {
      s.appendChild(mkCardsRow(W, sec.count || 3, 280));
    }

    if (sec.type === "form") {
      const form = mkFrame("Form", 760, 0, null);
      vAuto(form, 16, 0, 0, 0, 0);
      form.fills = [];
      form.clipsContent = false;
      ["שם מלא", "אימייל", "טלפון", "נושא"].forEach(label => {
        const field = mkFrame("Field — " + label, 760, 56, C.white);
        field.cornerRadius = 12;
        field.strokes = [{ type: "SOLID", color: C.border }];
        field.strokeWeight = 1;
        hFixed(field, 0, 0, 0, 20, 20);
        field.counterAxisAlignItems = "CENTER";
        field.appendChild(mkText(label, 14, C.muted, F, "RIGHT"));
        form.appendChild(field);
      });
      const msg = mkFrame("Field — הודעה", 760, 140, C.white);
      msg.cornerRadius = 12;
      msg.strokes = [{ type: "SOLID", color: C.border }];
      msg.strokeWeight = 1;
      vFixed(msg, 0, 16, 0, 20, 20);
      msg.appendChild(mkText("הודעה", 14, C.muted, F, "RIGHT"));
      form.appendChild(msg);
      form.appendChild(mkBtn("שלח הודעה", C.wineMain, C.white, 200));
      s.appendChild(form);
    }

    if (sec.type === "blog-grid") {
      const featured = mkFrame("Featured", W - 160, 420, C.card);
      featured.cornerRadius = 24;
      featured.primaryAxisSizingMode = "FIXED";
      featured.counterAxisSizingMode = "FIXED";
      addShadow(featured);
      s.appendChild(featured);
      s.appendChild(mkCardsRow(W, 4, 280));
    }

    page.appendChild(s);
  });

  page.appendChild(buildCTABanner(W));
  page.appendChild(buildFooter(W));
  return page;
}

// ── Mobile Homepage ───────────────────────────────────────
function buildMobileHomepage() {
  const W = 390;
  const page = mkFrame("📱 Homepage — Mobile", W, 0, C.bg);
  vAuto(page, 0, 0, 0, 0, 0);

  // Mobile Header
  const mh = mkFrame("Header", W, 64, C.bg);
  hFixed(mh, 0, 0, 0, 20, 20);
  spaceBetween(mh);
  const mLogo = mkRect("Logo", 88, 32, C.fireBright, 6);
  mLogo.layoutAlign = "CENTER";
  const burger = mkRect("Menu", 24, 18, C.fg, 3);
  burger.layoutAlign = "CENTER";
  mh.appendChild(mLogo);
  mh.appendChild(burger);
  page.appendChild(mh);

  // Mobile Hero
  const hero = mkFrame("Hero", W, 500, C.darkBg);
  vFixed(hero, 20, 100, 60, 24, 24);
  centered(hero);
  const ht = mkText("המוזיקה מתחילה כאן", 40, C.white, FB, "CENTER");
  ht.layoutAlign = "CENTER";
  ht.textAutoResize = "HEIGHT";
  ht.resize(320, 100);
  const hs = mkText("הופעות, תזמורות, תלמידות — במקום אחד.", 16,
    { r: 0.82, g: 0.79, b: 0.74 }, F, "CENTER");
  hs.layoutAlign = "CENTER";
  hs.textAutoResize = "HEIGHT";
  hs.resize(300, 40);
  const hBtn = mkBtn("גלי עכשיו", C.fireBright, C.darkBg, 160);
  hBtn.layoutAlign = "CENTER";
  hero.appendChild(ht);
  hero.appendChild(hs);
  hero.appendChild(hBtn);
  page.appendChild(hero);

  // Mobile category cards
  const cats = mkFrame("Categories", W, 0, C.bg);
  vAuto(cats, 12, 24, 24, 20, 20);
  const mobileItems = [
    { name: "הופעות",  color: C.fireCore   },
    { name: "תזמורות", color: C.fireBright },
    { name: "תלמידות", color: C.goldMain   },
    { name: "תווים",   color: C.goldDark   },
    { name: "בלוג",    color: C.wineLight  },
    { name: "אודות",   color: C.wineMain   },
  ];
  mobileItems.forEach(item => {
    const card = mkFrame(item.name, W - 40, 80, C.card);
    card.cornerRadius = 16;
    hFixed(card, 0, 0, 0, 20, 20);
    spaceBetween(card);
    const icon = mkRect("Icon", 44, 44, item.color, 10);
    icon.layoutAlign = "CENTER";
    const lbl = mkText(item.name, 17, C.fg, FSB, "RIGHT");
    lbl.layoutAlign = "CENTER";
    const arrow = mkText("←", 18, C.muted, F, "LEFT");
    arrow.layoutAlign = "CENTER";
    card.appendChild(arrow);
    card.appendChild(lbl);
    card.appendChild(icon);
    cats.appendChild(card);
  });
  page.appendChild(cats);

  page.appendChild(buildFooter(W));
  return page;
}

// ── Main ──────────────────────────────────────────────────
async function main() {
  await figma.loadFontAsync(F);
  await figma.loadFontAsync(FB);
  await figma.loadFontAsync(FSB);

  figma.currentPage.name = "🎵 Toby Music — Screens";

  const frames = [
    buildHomepage(),
    buildMobileHomepage(),
    buildInnerPage("📖 אודות",   "אודות",   C.wineDeep, [
      { name: "Story",    title: "הסיפור של Toby Music",
        text: "הסיפור, הדרך והאני מאמין של Toby Music — במקום אחד, ברור ומדויק." },
      { name: "Values",   type: "cards", count: 3 },
    ]),
    buildInnerPage("👩‍🎓 תלמידות", "תלמידות", C.goldDark, [
      { name: "Intro",    title: "תוכנית הלימודים",
        text: "מרחב שמחבר בין לימוד, תרגול, התקדמות וקשר אישי — בצורה חיה ונעימה." },
      { name: "Programs", type: "cards", count: 3 },
    ]),
    buildInnerPage("🎻 תזמורות", "תזמורות", C.fireCore, [
      { name: "Intro",    title: "הרכבים לאירועים",
        text: "הרכבים, סגנונות ואפשרויות שמתאימים לאירוע שלכם — בלי להסתבך." },
      { name: "Groups",   type: "cards", count: 4 },
    ]),
    buildInnerPage("🎵 בלוג",    "בלוג",    C.wineMain, [
      { name: "Articles", title: "מאמרים אחרונים", type: "blog-grid" },
    ]),
    buildInnerPage("📞 צור קשר", "צור קשר", C.fireDeep, [
      { name: "Form",     title: "נשמח לשמוע ממך",  type: "form" },
    ]),
    buildInnerPage("🎭 הופעות",  "הופעות",  C.fireBright, [
      { name: "Events",   title: "יומן הופעות",      type: "cards", count: 3 },
    ]),
    buildInnerPage("🎼 תווים",   "תווים",   C.goldMain, [
      { name: "Library",  title: "ספריית תווים",     type: "cards", count: 6 },
    ]),
  ];

  let x = 0;
  frames.forEach(p => {
    p.x = x;
    p.y = 0;
    figma.currentPage.appendChild(p);
    x += p.width + 200;
  });

  figma.viewport.scrollAndZoomIntoView(frames);
  figma.notify("✅ Toby Music — כל המסכים נוצרו!", { timeout: 4000 });
  figma.closePlugin();
}

main().catch(err => {
  figma.notify("❌ שגיאה: " + err.message, { error: true });
  figma.closePlugin();
});
