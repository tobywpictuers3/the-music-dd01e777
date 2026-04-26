// Toby Music — Figma Homepage Builder v2.0
// Creates Light + Dark homepage frames for visual editing
// Run via: Plugins → Development → Import plugin from manifest

// ── Theme colors ──────────────────────────────────────────────────
const LT = {
  bg:    { r: 0.973, g: 0.957, b: 0.933 },
  fg:    { r: 0.137, g: 0.090, b: 0.063 },
  card:  { r: 0.929, g: 0.894, b: 0.851 },
  brd:   { r: 0.808, g: 0.749, b: 0.690 },
  muted: { r: 0.541, g: 0.478, b: 0.447 },
};
const DK = {
  bg:    { r: 0.082, g: 0.055, b: 0.035 },
  fg:    { r: 0.918, g: 0.878, b: 0.827 },
  card:  { r: 0.118, g: 0.082, b: 0.063 },
  brd:   { r: 0.227, g: 0.176, b: 0.141 },
  muted: { r: 0.541, g: 0.478, b: 0.447 },
};
const B = {
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
  ink:        { r: 0.082, g: 0.055, b: 0.035 },
};

// ── Fonts (reassigned to Inter if unavailable) ────────────────────
let FHR = { family: "Frank Ruhl Libre", style: "Regular" };
let FHB = { family: "Frank Ruhl Libre", style: "Bold"    };
let FHK = { family: "Frank Ruhl Libre", style: "Black"   };
let FAR = { family: "Assistant",        style: "Regular" };
let FSB = { family: "Assistant",        style: "SemiBold"};
const IR  = { family: "Inter", style: "Regular"  };
const IB  = { family: "Inter", style: "Bold"     };
const ISB = { family: "Inter", style: "SemiBold" };

// ── Primitives ────────────────────────────────────────────────────
function mkR(name, w, h, col, r) {
  const x = figma.createRectangle();
  x.name = name;
  x.resize(Math.max(1, w), Math.max(1, h));
  x.fills = col ? [{ type: "SOLID", color: col }] : [];
  if (r) x.cornerRadius = r;
  return x;
}
function mkT(str, sz, col, font, align) {
  const t = figma.createText();
  t.fontName = font || IR;
  t.characters = String(str);
  t.fontSize = sz;
  t.fills = col ? [{ type: "SOLID", color: col }] : [];
  if (align) t.textAlignHorizontal = align;
  return t;
}
function mkF(name, w, h, col) {
  const f = figma.createFrame();
  f.name = name;
  f.resize(Math.max(1, w), Math.max(1, h));
  f.fills = col ? [{ type: "SOLID", color: col }] : [];
  f.clipsContent = true;
  return f;
}

// ── Layout helpers ────────────────────────────────────────────────
function hSB(f, pl, pr, pt, pb) {
  f.layoutMode = "HORIZONTAL";
  f.primaryAxisSizingMode = "FIXED";
  f.counterAxisSizingMode = "FIXED";
  f.primaryAxisAlignItems = "SPACE_BETWEEN";
  f.counterAxisAlignItems = "CENTER";
  f.paddingLeft = pl || 0; f.paddingRight = pr || 0;
  f.paddingTop = pt || 0;  f.paddingBottom = pb || 0;
  f.itemSpacing = 0;
}
function hAuto(f, gap, pl, pr, pt, pb) {
  f.layoutMode = "HORIZONTAL";
  f.primaryAxisSizingMode = "AUTO";
  f.counterAxisSizingMode = "AUTO";
  f.itemSpacing = gap || 0;
  f.paddingLeft = pl || 0; f.paddingRight = pr || 0;
  f.paddingTop = pt || 0;  f.paddingBottom = pb || 0;
  f.primaryAxisAlignItems = "MIN";
  f.counterAxisAlignItems = "CENTER";
  f.clipsContent = false;
}
function hAutoCenter(f, gap, pl, pr, pt, pb) {
  hAuto(f, gap, pl, pr, pt, pb);
  f.primaryAxisAlignItems = "CENTER";
}
function dropShadow(f, a, y, blur) {
  f.effects = [{
    type: "DROP_SHADOW", visible: true, blendMode: "NORMAL",
    color: { r: 0.08, g: 0.05, b: 0.03, a: a || 0.10 },
    offset: { x: 0, y: y || 8 }, radius: blur || 24, spread: 0,
  }];
}
function imgBox(name, w, h, col) {
  const f = mkF("📷 " + name, w, h, col || { r:.5, g:.45, b:.40 });
  f.opacity = 0.38;
  const lbl = mkT(name, Math.min(12, Math.max(9, w / 9)), B.white, IR, "CENTER");
  lbl.textAutoResize = "HEIGHT";
  try { lbl.resize(w - 8, 14); } catch (_) {}
  lbl.x = 4; lbl.y = h / 2 - 7;
  f.appendChild(lbl);
  return f;
}
function mkBtn(label, bg, fg, w, h) {
  const b = mkF("Btn · " + label, w || 140, h || 44, bg);
  b.cornerRadius = 999;
  hAutoCenter(b, 0, 24, 24, 0, 0);
  b.primaryAxisSizingMode = "FIXED";
  b.counterAxisSizingMode = "FIXED";
  b.appendChild(mkT(label, 14, fg, FSB, "CENTER"));
  return b;
}
// ── Header (H=72) ────────────────────────────────────────────────
function buildHeader(W, T) {
  const wrap = mkF("Header", W, 72, null);
  wrap.fills = [];

  const pillW = 1100, pillH = 64;
  const pill = mkF("Header/Pill-nav", pillW, pillH, T.card);
  pill.cornerRadius = 999;
  pill.x = (W - pillW) / 2; pill.y = 4;
  pill.strokes = [{ type: "SOLID", color: T.brd }];
  pill.strokeWeight = 1; pill.strokeAlign = "INSIDE";
  dropShadow(pill, 0.07, 4, 16);
  hSB(pill, 24, 24, 0, 0);

  // Left: toggle + logo
  const left = mkF("Left", 0, 0, null);
  left.fills = []; left.clipsContent = false;
  hAuto(left, 12, 0, 0, 0, 0);

  const toggle = mkF("ThemeToggle", 36, 36, T.bg);
  toggle.cornerRadius = 18;
  toggle.strokes = [{ type: "SOLID", color: T.brd }];
  toggle.strokeWeight = 1;
  hAutoCenter(toggle, 0, 0, 0, 0, 0);
  toggle.primaryAxisSizingMode = "FIXED";
  toggle.counterAxisSizingMode = "FIXED";
  toggle.appendChild(mkT(T === LT ? "☾" : "☀", 15, T.fg, IR, "CENTER"));
  left.appendChild(toggle);

  const li = imgBox(T === LT ? "logo-black.jpg" : "whitelogo.png", 88, 34,
    T === LT ? B.fireDeep : B.goldMain);
  li.opacity = 1.0;
  left.appendChild(li);
  pill.appendChild(left);

  // Center: nav
  const nav = mkF("Nav", 0, 0, null);
  nav.fills = []; nav.clipsContent = false;
  hAuto(nav, 2, 0, 0, 0, 0);
  ["בית","תזמורות","הופעות","תלמידות","תווים","אודות","בלוג"].forEach((lbl, i) => {
    const p = mkF("Nav·" + lbl, 0, 36, null);
    p.fills = i === 0 ? [{ type:"SOLID", color:B.fireBright, opacity:0.18 }] : [];
    p.clipsContent = false; p.cornerRadius = 999;
    hAutoCenter(p, 0, 16, 16, 0, 0);
    p.appendChild(mkT(lbl, 14, i === 0 ? T.fg : T.muted, i === 0 ? FSB : FAR));
    nav.appendChild(p);
  });
  pill.appendChild(nav);

  // Right: CTA
  const right = mkF("Right", 0, 0, null);
  right.fills = []; right.clipsContent = false;
  hAuto(right, 0, 0, 0, 0, 0);
  right.appendChild(mkBtn("צור קשר", B.wineMain, B.white, 108, 40));
  pill.appendChild(right);

  wrap.appendChild(pill);
  return wrap;
}

// ── Hero (H=850) ─────────────────────────────────────────────────
const CHARS = [
  { name:"צור קשר",  img:"presenter.png", lx:.07, by:.38, wt:.124, col:B.wineMain   },
  { name:"תלמידות",  img:"piano.png",     lx:.20, by:.425,wt:.220, col:B.goldMain   },
  { name:"תזמורות",  img:"eguitar.png",   lx:.33, by:.50, wt:.174, col:B.fireBright },
  { name:"אודות",    img:"guitar.png",    lx:.46, by:.555,wt:.176, col:B.fireCore   },
  { name:"תווים",    img:"drums.png",     lx:.59, by:.605,wt:.240, col:B.goldDark   },
  { name:"בלוג",     img:"saxophone.png", lx:.74, by:.525,wt:.164, col:B.wineLight  },
  { name:"הופעות",   img:"violin.png",    lx:.87, by:.445,wt:.154, col:B.fireDeep   },
];

function buildHero(W, T, isLight) {
  const H = 850;
  const hero = mkF("Hero — Stage", W, H,
    isLight ? { r:.61,g:.54,b:.45 } : { r:.04,g:.03,b:.02 });

  const bg = mkR(isLight ? "📷 lightstage.png" : "📷 darkstage.png",
    W, H, isLight ? { r:.62,g:.55,b:.46 } : { r:.06,g:.04,b:.02 });
  bg.opacity = 0.82; hero.appendChild(bg);

  const grad = mkR("Gradient overlay", W, H, { r:.05,g:.03,b:.02 });
  grad.opacity = isLight ? 0.22 : 0.52; hero.appendChild(grad);

  // Logo
  const lw = 140, lh = 54;
  const li = imgBox(isLight ? "logo-toby.png" : "whitelogo.png",
    lw, lh, isLight ? B.fireDeep : B.white);
  li.opacity = 1; li.x = (W - lw) / 2; li.y = 52;
  hero.appendChild(li);

  // Badge
  const bw = 340, bh = 36;
  const badge = mkF("Badge", bw, bh, B.fireBright);
  badge.cornerRadius = 999; badge.opacity = 0.92;
  badge.x = (W - bw) / 2; badge.y = 126;
  hSB(badge, 20, 20, 0, 0);
  badge.counterAxisAlignItems = "CENTER";
  badge.appendChild(mkT("אומנות ואמינות — ", 13, B.ink, FSB, "CENTER"));
  badge.appendChild(mkT("זו יצירה", 13, B.wineDeep, FHB, "CENTER"));
  hero.appendChild(badge);

  // Title
  const tf = mkF("Title", 960, 96, null);
  tf.fills = []; tf.x = (W - 960) / 2; tf.y = 178;
  hSB(tf, 0, 0, 0, 0); tf.counterAxisAlignItems = "CENTER";
  const mt = mkT("המוזיקה מתחילה", 76, B.white, FHK, "RIGHT");
  mt.textAutoResize = "HEIGHT";
  try { mt.resize(720, 92); } catch (_) {}
  tf.appendChild(mt);
  const at = mkT("כאן", 76, B.fireBright, FHK, "LEFT");
  at.textAutoResize = "HEIGHT";
  try { at.resize(220, 92); } catch (_) {}
  tf.appendChild(at);
  hero.appendChild(tf);

  // Subtitle
  const sw = 600, sh = 44;
  const sub = mkF("Subtitle", sw, sh, null);
  sub.fills = [{ type:"SOLID", color:{ r:1,g:1,b:1 }, opacity:0.07 }];
  sub.cornerRadius = 999; sub.x = (W - sw) / 2; sub.y = 288;
  hSB(sub, 28, 28, 0, 0); sub.counterAxisAlignItems = "CENTER";
  sub.appendChild(mkT("הופעות, תזמורות, תלמידות, תווים ותוכן — במקום אחד.",
    16, { r:.85,g:.82,b:.76 }, FAR, "CENTER"));
  hero.appendChild(sub);

  // Characters
  CHARS.forEach(c => {
    const cw = Math.round(W * c.wt);
    const ch = Math.round(cw * 1.45);
    const cx = Math.round(W * c.lx - cw / 2);
    const cy = Math.max(310, Math.round(H - H * c.by - ch));

    const ci = imgBox(c.img, cw, ch, c.col);
    ci.opacity = 0.68; ci.x = cx; ci.y = cy;
    hero.appendChild(ci);

    const sw2 = Math.round(cw * 0.78), sh2 = 34;
    const sign = mkF("Sign·" + c.name, sw2, sh2, null);
    sign.fills = [{ type:"SOLID", color:{ r:1,g:1,b:1 }, opacity:0.10 }];
    sign.strokes = [{ type:"SOLID", color:B.goldMain }];
    sign.strokeWeight = 1.5; sign.strokeAlign = "INSIDE";
    sign.cornerRadius = 9;
    sign.x = cx + (cw - sw2) / 2;
    sign.y = Math.max(268, cy - sh2 - 10);
    hSB(sign, 8, 8, 0, 0); sign.counterAxisAlignItems = "CENTER";
    sign.appendChild(mkT(c.name, 13, B.white, FSB, "CENTER"));
    hero.appendChild(sign);
  });

  return hero;
}

// ── Marquee (H=48) ───────────────────────────────────────────────
function buildMarquee(W) {
  const strip = mkF("Marquee Strip", W, 48, B.fireBright);
  const items = ["הופעות","✦","תזמורות","✦","תלמידות","✦","תווים","✦",
    "בלוג","✦","צור קשר","✦","מוזיקה • תוכן • חוויה","✦","Toby Music","✦",
    "אירועים • לימוד • השראה","✦","הופעות","✦","תזמורות"];
  const row = mkF("Ticker", 0, 0, null);
  row.fills = []; row.clipsContent = false;
  hAuto(row, 22, 0, 0, 0, 0);
  items.forEach(t => row.appendChild(mkT(t, 14, B.ink, FSB)));
  row.x = 44; row.y = 14;
  strip.appendChild(row);
  return strip;
}
// ── Guide Presenter (H=380) ──────────────────────────────────────
const WELCOME = "ברוכים הבאים לאתר של טובי. אני אלווה אתכם כאן בסיור באתר. " +
  "בלחיצה עלי תוכלו לשאול כל מה שתצטרכו אודות הנכתב באתר, אשתדל לענות לכם " +
  "ככל יכולתי. ניתן גם לבקש הסבר באופן קולי. לשירותכם!";

function buildGuide(W, T) {
  const sec = mkF("Guide Presenter", W, 380, T.bg);

  const pi = imgBox("presenter.png", 180, 220, B.goldMain);
  pi.opacity = 0.82; pi.x = (W - 180) / 2; pi.y = 18;
  sec.appendChild(pi);

  const tri = mkR("▼ connector", 22, 12, T.card, 2);
  tri.x = (W - 22) / 2; tri.y = 244;
  sec.appendChild(tri);

  const bub = mkF("Speech Bubble", 560, 124, T.card);
  bub.cornerRadius = 20; bub.x = (W - 560) / 2; bub.y = 258;
  dropShadow(bub, 0.09, 12, 36);
  const bt = mkT(WELCOME, 14, T.fg, FAR, "RIGHT");
  bt.textAutoResize = "HEIGHT";
  try { bt.resize(512, 96); } catch (_) {}
  bt.x = 24; bt.y = 18;
  bub.appendChild(bt);
  sec.appendChild(bub);
  return sec;
}

// ── Cards Grid (H=780) ───────────────────────────────────────────
const CARDS = [
  { name:"צור קשר",  img:"presenter.png", col:B.wineMain,
    desc:"רוצה לשאול, להתייעץ או להזמין? כאן מתחילים שיחה פשוטה ונעימה." },
  { name:"תלמידות",  img:"piano.png",     col:B.goldMain,
    desc:"מרחב שמחבר בין לימוד, תרגול, התקדמות וקשר אישי — בצורה חיה ונעימה." },
  { name:"תזמורות",  img:"eguitar.png",   col:B.fireBright,
    desc:"הרכבים, סגנונות ואפשרויות שמתאימים לאירוע שלכם — בלי להסתבך." },
  { name:"אודות",    img:"guitar.png",    col:B.fireCore,
    desc:"הסיפור, הדרך והאני מאמין של Toby Music — במקום אחד, ברור ומדויק." },
  { name:"תווים",    img:"drums.png",     col:B.goldDark,
    desc:"ספריית תווים מסודרת, נוחה ונעימה לעין — כדי להגיע מהר למה שצריך." },
  { name:"בלוג",     img:"saxophone.png", col:B.wineLight,
    desc:"טיפים, מחשבות, רעיונות והשראה מוזיקלית שנעים לחזור אליה שוב." },
  { name:"הופעות",   img:"violin.png",    col:B.fireDeep,
    desc:"יומן הופעות, חוויה מוסיקלית והזמנה מסודרת — במקום אחד ברור." },
];

function mkCard(item, cw, T) {
  const ch = 300;
  const f = mkF("Card · " + item.name, cw, ch, T.card);
  f.cornerRadius = 24;
  f.strokes = [{ type:"SOLID", color:T.brd }];
  f.strokeWeight = 1; f.strokeAlign = "INSIDE";
  dropShadow(f, 0.08, 8, 24);

  const iw = Math.round(cw * 0.62);
  const ci = imgBox(item.img, iw, 152, item.col);
  ci.opacity = 0.72; ci.x = (cw - iw) / 2; ci.y = 10;
  f.appendChild(ci);

  const stars = mkR("⭐ stars-texture overlay", cw, 166, T.brd);
  stars.opacity = 0.05; f.appendChild(stars);

  const title = mkT(item.name, 20, T.fg, FHB, "RIGHT");
  title.textAutoResize = "HEIGHT";
  try { title.resize(cw - 28, 28); } catch (_) {}
  title.x = 14; title.y = 172;
  f.appendChild(title);

  const desc = mkT(item.desc, 13, T.muted, FAR, "RIGHT");
  desc.textAutoResize = "HEIGHT";
  try { desc.resize(cw - 28, 80); } catch (_) {}
  desc.x = 14; desc.y = 206;
  f.appendChild(desc);

  return f;
}

function buildCardsGrid(W, T) {
  const PAD = 80, GAP = 28, COLS = 4;
  const cw = Math.floor((W - PAD * 2 - GAP * (COLS - 1)) / COLS);
  const sec = mkF("Cards Grid", W, 780, T.bg);
  CARDS.forEach((item, i) => {
    const card = mkCard(item, cw, T);
    card.x = PAD + (i % COLS) * (cw + GAP);
    card.y = 72 + Math.floor(i / COLS) * (300 + GAP);
    sec.appendChild(card);
  });
  return sec;
}

// ── Footer (H=370) ───────────────────────────────────────────────
function buildFooter(W) {
  const f = mkF("Footer", W, 370, B.wineDeep);
  const grd = mkR("Gradient overlay", W, 370, { r:.05,g:.02,b:.01 });
  grd.opacity = 0.55; f.appendChild(grd);

  const PAD = 80;

  // Brand col (right in RTL)
  const c1x = PAD;
  const li = imgBox("whitelogo.png", 100, 42, B.goldMain);
  li.opacity = 0.95; li.x = c1x + 310; li.y = 44;
  f.appendChild(li);
  const tg = mkT("אומנות ואמינות. זו יצירה.", 18, B.white, FHB, "RIGHT");
  tg.textAutoResize = "HEIGHT";
  try { tg.resize(400, 26); } catch (_) {}
  tg.x = c1x; tg.y = 100; f.appendChild(tg);
  const tgsub = mkT("מוזיקה, יצירה ושירות מקצועי בשפה נקייה, מדויקת ומכובדת.",
    13, { r:.9,g:.85,b:.78 }, FAR, "RIGHT");
  tgsub.textAutoResize = "HEIGHT";
  try { tgsub.resize(380, 42); } catch (_) {}
  tgsub.x = c1x + 20; tgsub.y = 136; f.appendChild(tgsub);

  const joinBtn = mkF("Btn · להצטר התפוצה", 168, 44, null);
  joinBtn.cornerRadius = 999;
  joinBtn.fills = [];
  joinBtn.strokes = [{ type:"SOLID", color:{ r:1,g:1,b:1 } }];
  joinBtn.strokeWeight = 1;
  joinBtn.x = c1x + (410 - 168); joinBtn.y = 192;
  hAutoCenter(joinBtn, 0, 20, 20, 0, 0);
  joinBtn.primaryAxisSizingMode = "FIXED";
  joinBtn.counterAxisSizingMode = "FIXED";
  joinBtn.appendChild(mkT("להצטר התפוצה", 13, B.white, FSB, "CENTER"));
  f.appendChild(joinBtn);

  // Nav col 2 — ניווט מהיר
  const c2x = W / 2 - 60;
  f.appendChild(mkT("ניווט מהיר", 15, B.white, FHB, "RIGHT")).x = c2x;
  const n1h = f.children[f.children.length - 1]; n1h.y = 44;
  ["דף הבית","אודות","תזמורות","הופעות","תלמידות","יצירת קשר"].forEach((l, i) => {
    const t = mkT(l, 13, { r:.85,g:.78,b:.70 }, FAR, "RIGHT");
    t.x = c2x; t.y = 76 + i * 28; f.appendChild(t);
  });

  // Nav col 3 — עוד באתר
  const c3x = W - PAD - 170;
  f.appendChild(mkT("עוד באתר", 15, B.white, FHB, "RIGHT")).x = c3x;
  const n2h = f.children[f.children.length - 1]; n2h.y = 44;
  ["בלוג","יצירה","צמיחה","נסיעות","וולנס","מחברים"].forEach((l, i) => {
    const t = mkT(l, 13, { r:.85,g:.78,b:.70 }, FAR, "RIGHT");
    t.x = c3x; t.y = 76 + i * 28; f.appendChild(t);
  });

  // Divider + copyright
  const div = mkR("Divider", W - PAD * 2, 1, { r:1,g:1,b:1 });
  div.opacity = 0.10; div.x = PAD; div.y = 320; f.appendChild(div);

  const legal = mkT("פרטיות  •  תנאים", 12, { r:.85,g:.78,b:.70 }, FAR);
  legal.opacity = 0.55; legal.x = W - PAD - 150; legal.y = 337; f.appendChild(legal);

  const copy = mkT("© 2025 Toby Music. כל הזכויות שמורות.", 12, B.white, FAR);
  copy.opacity = 0.48; copy.x = PAD; copy.y = 337; f.appendChild(copy);

  return f;
}

// ── Page assembler ────────────────────────────────────────────────
function buildPage(themeKey, label) {
  const W = 1440;
  const T = themeKey === "light" ? LT : DK;
  const isLight = themeKey === "light";
  const sections = [
    buildHeader(W, T),
    buildHero(W, T, isLight),
    buildMarquee(W),
    buildGuide(W, T),
    buildCardsGrid(W, T),
    buildFooter(W),
  ];
  const totalH = sections.reduce((s, f) => s + f.height, 0);
  const page = mkF(label, W, totalH, T.bg);
  let y = 0;
  sections.forEach(sec => { sec.x = 0; sec.y = y; page.appendChild(sec); y += sec.height; });
  return page;
}

// ── Main ─────────────────────────────────────────────────────────
const FONT_LIST = [
  { family: "Frank Ruhl Libre", style: "Regular" },
  { family: "Frank Ruhl Libre", style: "Bold"    },
  { family: "Frank Ruhl Libre", style: "Black"   },
  { family: "Assistant",        style: "Regular" },
  { family: "Assistant",        style: "SemiBold"},
  { family: "Inter",            style: "Regular" },
  { family: "Inter",            style: "Bold"    },
  { family: "Inter",            style: "SemiBold"},
];

async function main() {
  for (const fnt of FONT_LIST) {
    try { await figma.loadFontAsync(fnt); } catch (_) {
      if (fnt.family === "Frank Ruhl Libre") {
        if (fnt.style === "Regular") FHR = IR;
        if (fnt.style === "Bold")    FHB = IB;
        if (fnt.style === "Black")   FHK = IB;
      }
      if (fnt.family === "Assistant") {
        if (fnt.style === "Regular")  FAR = IR;
        if (fnt.style === "SemiBold") FSB = ISB;
      }
    }
  }

  figma.currentPage.name = "🎵 Toby Music — Homepage";

  const lightPage = buildPage("light", "☀️ מצב יום — Light");
  const darkPage  = buildPage("dark",  "🌙 מצב לילה — Dark");
  lightPage.x = 0;    lightPage.y = 0;
  darkPage.x  = 1640; darkPage.y  = 0;
  figma.currentPage.appendChild(lightPage);
  figma.currentPage.appendChild(darkPage);

  figma.viewport.scrollAndZoomIntoView([lightPage, darkPage]);
  figma.notify("✅ שני מסכי הבית נוצרו!", { timeout: 5000 });
  figma.closePlugin();
}

main().catch(err => {
  figma.notify("❌ שגיאה: " + err.message, { error: true });
  figma.closePlugin();
});
