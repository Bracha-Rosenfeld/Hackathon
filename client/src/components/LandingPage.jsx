import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000';

/* ─────────────────────────────
   Helpers
───────────────────────────── */

function formatAmount(amount) {
  const n = Number(amount);
  return isNaN(n) ? amount : n.toLocaleString('he-IL');
}

async function extractDominantColor(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 80;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 80, 80);

        const data = ctx.getImageData(0, 0, 80, 80).data;

        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 16) {
          const pr = data[i];
          const pg = data[i + 1];
          const pb = data[i + 2];
          const pa = data[i + 3];

          if (pa < 50) continue;

          const bright = (pr + pg + pb) / 3;
          const sat = Math.max(pr, pg, pb) - Math.min(pr, pg, pb);

          if (bright > 225 || bright < 20 || sat < 25) continue;

          r += pr;
          g += pg;
          b += pb;
          count++;
        }

        if (!count) {
          resolve(null);
          return;
        }

        resolve(
          `rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(
            b / count
          )})`
        );
      } catch {
        resolve(null);
      }
    };

    img.onerror = () => resolve(null);
    img.src = imageUrl;
  });
}

function parseColor(color) {
  if (!color) return { r: 36, g: 87, b: 166 };

  if (String(color).startsWith('#')) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);

    return m
      ? {
          r: parseInt(m[1], 16),
          g: parseInt(m[2], 16),
          b: parseInt(m[3], 16),
        }
      : { r: 36, g: 87, b: 166 };
  }

  const m = String(color).match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

  return m
    ? {
        r: +m[1],
        g: +m[2],
        b: +m[3],
      }
    : { r: 36, g: 87, b: 166 };
}

function mix(c, factor, target = 255) {
  return {
    r: Math.round(c.r + (target - c.r) * factor),
    g: Math.round(c.g + (target - c.g) * factor),
    b: Math.round(c.b + (target - c.b) * factor),
  };
}

function rgb(c) {
  return `rgb(${c.r}, ${c.g}, ${c.b})`;
}

function rgba(c, a) {
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`;
}

/* ─────────────────────────────
   Category
───────────────────────────── */

function normalizeCategory(category) {
  const t = String(category || 'default').toLowerCase().trim();

  if (
    t === 'student' ||
    t.includes('student') ||
    t.includes('סטודנט') ||
    t.includes('university') ||
    t.includes('college') ||
    t.includes('intern')
  ) {
    return 'student';
  }

  if (
    t === 'executive' ||
    t.includes('executive') ||
    t.includes('ceo') ||
    t.includes('founder') ||
    t.includes('director') ||
    t.includes('vp') ||
    t.includes('מנכל') ||
    t.includes('מנכ') ||
    t.includes('מנהל') ||
    t.includes('מייסד')
  ) {
    return 'executive';
  }

  if (
    t === 'investor' ||
    t.includes('investor') ||
    t.includes('vc') ||
    t.includes('angel') ||
    t.includes('finance') ||
    t.includes('fund') ||
    t.includes('משקיע') ||
    t.includes('קרן')
  ) {
    return 'investor';
  }

  if (
    t === 'tech' ||
    t.includes('tech') ||
    t.includes('developer') ||
    t.includes('engineer') ||
    t.includes('software') ||
    t.includes('product') ||
    t.includes('data') ||
    t.includes('ai') ||
    t.includes('cto') ||
    t.includes('הייטק') ||
    t.includes('מתכנת')
  ) {
    return 'tech';
  }

  if (
    t === 'community' ||
    t.includes('community') ||
    t.includes('education') ||
    t.includes('nonprofit') ||
    t.includes('social') ||
    t.includes('volunteer') ||
    t.includes('public') ||
    t.includes('קהילה') ||
    t.includes('חינוך') ||
    t.includes('עמותה')
  ) {
    return 'community';
  }

  return 'default';
}

function getDebugTheme() {
  if (typeof window === 'undefined') return null;

  const debugTheme = new URLSearchParams(window.location.search).get('theme');

  const allowedThemes = [
    'student',
    'executive',
    'investor',
    'tech',
    'community',
    'default',
  ];

  if (!debugTheme) return null;

  const normalized = debugTheme.toLowerCase();

  return allowedThemes.includes(normalized) ? normalized : null;
}

/* ─────────────────────────────
   Themes
───────────────────────────── */

const LANDING_THEMES = {
  student: {
    name: 'student',
    emoji: '✨',
    badgeText: 'דף צעיר וצבעוני',
    heroTitle: 'גם צעד קטן יכול להפוך אותך לחלק ממשהו גדול',
    fallbackPunchline1: 'תרומה קלילה, מהירה ומשמעותית.',
    fallbackPunchline2: 'בדיוק הדרך להצטרף לשינוי בלי להרגיש שזה גדול עליך.',
    messageTitle: 'היי, זה בשבילך',
    donationTitle: 'בחר/י סכום שמתאים לך',
    donationSubtitle: 'גם סכום קטן יכול לעשות הרבה רעש טוב.',
    ctaText: 'אני בפנים',
    optionLabels: ['מתחילים בקטן', 'הבחירה הכי זורמת', 'יאללה בכל הכוח'],
    optionSubs: ['קטן אבל משמעותי', 'הכי מאוזן ומשפיע', 'להיות חלק רציני מהשינוי'],
    trustWords: ['קליל', 'מהיר', 'משמעותי'],
    radius: '34px',
    bg: 'linear-gradient(135deg, #f0abfc 0%, #93c5fd 38%, #5eead4 72%, #fde68a 100%)',
    heroBg:
      'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.45), transparent 26%), linear-gradient(135deg, #9333ea 0%, #2563eb 45%, #06b6d4 100%)',
    cardBg: 'rgba(255,255,255,0.78)',
    accent: '#9333ea',
    secondary: '#06b6d4',
    textMain: '#172554',
    textBody: '#334155',
    textMuted: '#64748b',
    border: 'rgba(255,255,255,0.55)',
    shadow: '0 28px 80px rgba(124,58,237,0.24)',
    navDark: false,
  },

  executive: {
    name: 'executive',
    emoji: '◆',
    badgeText: 'מהלך אסטרטגי',
    heroTitle: 'הזדמנות להשפעה אסטרטגית ומדידה',
    fallbackPunchline1: 'מהלך ממוקד, אלגנטי ורציני.',
    fallbackPunchline2: 'עבור מי שרוצה להוביל שינוי עם אמינות, השפעה ותוצאה.',
    messageTitle: 'הזמנה אישית',
    donationTitle: 'בחירת רמת שותפות',
    donationSubtitle: 'כל בחירה כאן היא הצטרפות למהלך בעל ערך ברור.',
    ctaText: 'לתמיכה במהלך',
    optionLabels: ['שותפות התחלתית', 'שותפות מובילה', 'שותפות אסטרטגית'],
    optionSubs: ['כניסה למהלך', 'השפעה משמעותית', 'הובלת שינוי'],
    trustWords: ['אמינות', 'השפעה', 'מדידה'],
    radius: '12px',
    bg: 'linear-gradient(135deg, #020617 0%, #111827 48%, #1e293b 100%)',
    heroBg: 'linear-gradient(135deg, #020617 0%, #0f172a 55%, #334155 100%)',
    cardBg: '#ffffff',
    accent: '#c9a227',
    secondary: '#475569',
    textMain: '#0f172a',
    textBody: '#374151',
    textMuted: '#64748b',
    border: 'rgba(201,162,39,0.28)',
    shadow: '0 34px 90px rgba(2,6,23,0.36)',
    navDark: true,
  },

  investor: {
    name: 'investor',
    emoji: '📊',
    badgeText: 'אימפקט מבוסס נתונים',
    heroTitle: 'השקעה באימפקט שאפשר למדוד',
    fallbackPunchline1: 'מספרים, שקיפות ותוצאה.',
    fallbackPunchline2: 'כדי שכל תרומה תרגיש כמו החלטה חכמה.',
    messageTitle: 'תקציר השפעה',
    donationTitle: 'בחר/י רמת אימפקט',
    donationSubtitle: 'התרומה שלך מתורגמת לפעולה מדידה וברורה.',
    ctaText: 'לצפייה בהשפעה',
    optionLabels: ['אימפקט בסיסי', 'אימפקט מומלץ', 'אימפקט מורחב'],
    optionSubs: ['התחלה מדידה', 'יחס השפעה מיטבי', 'הגדלת התוצאה'],
    trustWords: ['נתונים', 'שקיפות', 'תוצאה'],
    radius: '16px',
    bg: 'linear-gradient(135deg, #ecfdf5 0%, #eff6ff 46%, #f8fafc 100%)',
    heroBg: 'linear-gradient(135deg, #064e3b 0%, #0f766e 48%, #1d4ed8 100%)',
    cardBg: '#ffffff',
    accent: '#059669',
    secondary: '#2563eb',
    textMain: '#064e3b',
    textBody: '#334155',
    textMuted: '#64748b',
    border: 'rgba(5,150,105,0.2)',
    shadow: '0 24px 70px rgba(5,150,105,0.16)',
    navDark: false,
  },

  tech: {
    name: 'tech',
    emoji: '⚡',
    badgeText: 'קמפיין חכם',
    heroTitle: 'להפעיל שינוי בצורה חכמה',
    fallbackPunchline1: 'פעולה אחת, אימפקט אמיתי.',
    fallbackPunchline2: 'חוויה טכנולוגית, מינימליסטית וחדה.',
    messageTitle: 'Personal payload',
    donationTitle: 'בחר/י contribution level',
    donationSubtitle: 'תרומה אחת. השפעה אמיתית. מערכת חכמה מאחוריה.',
    ctaText: 'להצטרפות חכמה',
    optionLabels: ['Starter', 'Recommended', 'Power Mode'],
    optionSubs: ['commit ראשון', 'הבחירה האופטימלית', 'השפעה מקסימלית'],
    trustWords: ['secure', 'fast', 'smart'],
    radius: '18px',
    bg:
      'radial-gradient(circle at 18% 12%, rgba(45,212,191,0.18), transparent 32%), linear-gradient(135deg, #020617 0%, #0f172a 52%, #042f2e 100%)',
    heroBg: 'linear-gradient(135deg, #020617 0%, #0f172a 52%, #0f766e 100%)',
    cardBg: 'rgba(15,23,42,0.92)',
    accent: '#2dd4bf',
    secondary: '#38bdf8',
    textMain: '#f8fafc',
    textBody: '#cbd5e1',
    textMuted: '#94a3b8',
    border: 'rgba(45,212,191,0.25)',
    shadow: '0 0 0 1px rgba(45,212,191,0.08), 0 28px 90px rgba(0,0,0,0.38)',
    navDark: true,
  },

  community: {
    name: 'community',
    emoji: '🤝',
    badgeText: 'השפעה קהילתית',
    heroTitle: 'ביחד אפשר ליצור שינוי אמיתי',
    fallbackPunchline1: 'תרומה שמגיעה מהלב.',
    fallbackPunchline2: 'מחזקת קהילה ונוגעת באנשים שצריכים את זה.',
    messageTitle: 'מסר מהלב',
    donationTitle: 'בחר/י דרך לעזור',
    donationSubtitle: 'כל סכום מחזק עוד אדם, עוד משפחה, עוד קהילה.',
    ctaText: 'אני רוצה לעזור',
    optionLabels: ['לתת יד', 'עזרה משמעותית', 'חיבוק גדול לקהילה'],
    optionSubs: ['להתחיל מהלב', 'להשפיע באמת', 'לחזק את המעגל'],
    trustWords: ['אנושי', 'קהילתי', 'מהלב'],
    radius: '28px',
    bg: 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 42%, #dcfce7 100%)',
    heroBg:
      'radial-gradient(circle at 20% 20%, rgba(254,243,199,0.42), transparent 28%), linear-gradient(135deg, #ea580c 0%, #d97706 46%, #16a34a 100%)',
    cardBg: 'rgba(255,255,255,0.9)',
    accent: '#ea580c',
    secondary: '#16a34a',
    textMain: '#7c2d12',
    textBody: '#44403c',
    textMuted: '#78716c',
    border: 'rgba(234,88,12,0.2)',
    shadow: '0 24px 70px rgba(234,88,12,0.16)',
    navDark: false,
  },

  default: {
    name: 'default',
    emoji: '🌟',
    badgeText: 'קמפיין אישי',
    heroTitle: 'הקמפיין שלנו צריך אותך',
    fallbackPunchline1: 'הצטרפות פשוטה לקמפיין שיוצר שינוי של ממש.',
    fallbackPunchline2: 'בדרך שמתאימה לך.',
    messageTitle: 'מסר מהארגון',
    donationTitle: 'בחר/י סכום תרומה',
    donationSubtitle: 'כל סכום מוביל לשינוי ממשי בשטח.',
    ctaText: 'המשך לתרומה',
    optionLabels: ['תרומה בסיסית', 'הבחירה המומלצת', 'שותפות רחבה'],
    optionSubs: ['נקודת התחלה משמעותית', 'השפעה מיטבית', 'להוביל שינוי אמיתי'],
    trustWords: ['מאובטח', 'מוכר', 'מיידי'],
    radius: '18px',
    bg: null,
    heroBg: null,
    cardBg: '#ffffff',
    accent: null,
    secondary: null,
    textMain: '#0f172a',
    textBody: '#374151',
    textMuted: '#64748b',
    border: null,
    shadow: null,
    navDark: false,
  },
};

/* ─────────────────────────────
   Hero visuals
───────────────────────────── */

function CategoryHeroVisual({ theme, designCategory, selectedAmount, options }) {
  const amount = formatAmount(
    selectedAmount || options[1]?.amount || options[0]?.amount || 0
  );

  if (designCategory === 'student') {
    return (
      <div className="hero-student-card">
        <div className="student-stickers">
          <span>🎓</span>
          <span>✨</span>
          <span>🚀</span>
          <span>💜</span>
        </div>

        <div className="student-main-emoji">🌈</div>

        <h3>Small gift, big vibe</h3>
        <p>התרומה שלך מצטרפת למשהו גדול יותר.</p>

        <div className="student-progress">
          <div />
        </div>

        <strong>₪{amount}</strong>
      </div>
    );
  }

  if (designCategory === 'executive') {
    return (
      <div className="hero-executive-card">
        <div className="exec-top">
          <span>Strategic Partner</span>
          <b>◆</b>
        </div>

        <div className="exec-line" />
        <div className="exec-line short" />

        <div className="exec-amount">₪{amount}</div>

        <div className="exec-footer">
          <span>Impact Level</span>
          <strong>Premium</strong>
        </div>
      </div>
    );
  }

  if (designCategory === 'investor') {
    return (
      <div className="hero-investor-card">
        <div className="investor-header">
          <span>Impact Dashboard</span>
          <b>+24%</b>
        </div>

        <div className="investor-chart">
          <span style={{ height: '38%' }} />
          <span style={{ height: '58%' }} />
          <span style={{ height: '46%' }} />
          <span style={{ height: '82%' }} />
          <span style={{ height: '68%' }} />
        </div>

        <div className="investor-metrics">
          <div>
            <strong>₪{amount}</strong>
            <span>Selected impact</span>
          </div>

          <div>
            <strong>3x</strong>
            <span>Potential reach</span>
          </div>
        </div>
      </div>
    );
  }

  if (designCategory === 'tech') {
    return (
      <div className="hero-tech-card">
        <div className="tech-window">
          <span />
          <span />
          <span />
        </div>

        <pre>{`const donation = {
  amount: "₪${amount}",
  category: "tech",
  status: "ready",
  impact: "high"
};

donation.run();`}</pre>

        <div className="tech-status">
          <span />
          system ready
        </div>
      </div>
    );
  }

  if (designCategory === 'community') {
    return (
      <div className="hero-community-card">
        <div className="community-people">
          <span>🧑‍🦱</span>
          <span>👩</span>
          <span>👨‍🦰</span>
          <span>👵</span>
        </div>

        <div className="community-heart">♡</div>

        <h3>מעגל של טוב</h3>
        <p>כל תרומה מחזקת עוד אדם ועוד קהילה.</p>

        <strong>₪{amount}</strong>
      </div>
    );
  }

  return (
    <div className="hero-default-card">
      <div className="default-icon">{theme.emoji}</div>
      <h3>personal campaign</h3>
      <p>make a difference</p>
      <strong>₪{amount}</strong>
    </div>
  );
}

/* ─────────────────────────────
   Styles
───────────────────────────── */

const STYLE_ID = 'lp-category-with-punchlines';

function injectStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;

  const s = document.createElement('style');
  s.id = STYLE_ID;

  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;800;900&display=swap');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .lp-root {
      min-height: 100vh;
      font-family: 'Heebo', sans-serif;
      direction: rtl;
      color: var(--text-main);
      overflow-x: hidden;
    }

    @keyframes lp-up {
      from { opacity: 0; transform: translateY(22px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes lp-spin {
      to { transform: rotate(360deg); }
    }

    @keyframes lp-float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-14px) rotate(1deg); }
    }

    @keyframes lp-glow {
      0%, 100% { opacity: 0.45; transform: scale(1); }
      50% { opacity: 0.9; transform: scale(1.06); }
    }

    @keyframes lp-grid {
      from { background-position: 0 0; }
      to { background-position: 80px 80px; }
    }

    @keyframes lp-bounce {
      0%, 100% { transform: translateY(0) rotate(-3deg); }
      50% { transform: translateY(-12px) rotate(3deg); }
    }

    .lp-in {
      opacity: 0;
      animation: lp-up .55s cubic-bezier(.22,.68,0,1.15) forwards;
    }

    .lp-nav {
      position: sticky;
      top: 0;
      z-index: 200;
      background: rgba(255,255,255,0.9);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(15,23,42,0.08);
      padding: 0 6%;
    }

    .lp-nav.dark {
      background: rgba(2,6,23,0.84);
      border-bottom-color: rgba(255,255,255,0.1);
    }

    .lp-nav-inner {
      max-width: 1240px;
      margin: 0 auto;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .lp-logo-box {
      background: rgba(255,255,255,0.9);
      border: 1px solid rgba(255,255,255,0.7);
      border-radius: 16px;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 48px;
      box-shadow: 0 10px 30px rgba(15,23,42,0.08);
    }

    .lp-logo {
      max-height: 34px;
      max-width: 150px;
      object-fit: contain;
      display: block;
    }

    .lp-company-name {
      font-weight: 900;
      font-size: 18px;
      color: var(--accent);
    }

    .lp-nav.dark .lp-company-name {
      color: #fff;
    }

    .lp-secure {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 13px;
      color: #64748b;
      font-weight: 800;
    }

    .lp-nav.dark .lp-secure {
      color: rgba(255,255,255,0.72);
    }

    .lp-hero {
      position: relative;
      overflow: hidden;
      padding: 76px 6% 88px;
      color: #fff;
      background: var(--hero-bg);
    }

    .lp-hero-inner {
      max-width: 1240px;
      margin: 0 auto;
      position: relative;
      z-index: 3;
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) 430px;
      gap: 48px;
      align-items: center;
    }

    .lp-theme-student .lp-hero-inner,
    .lp-theme-community .lp-hero-inner {
      text-align: center;
    }

    .lp-theme-student .lp-hero-content,
    .lp-theme-community .lp-hero-content {
      margin: 0 auto;
    }

    .lp-hero-content {
      max-width: 760px;
    }

    .lp-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border-radius: 999px;
      padding: 8px 17px;
      font-size: 13px;
      font-weight: 900;
      margin-bottom: 22px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.22);
      background: rgba(255,255,255,0.15);
      color: #fff;
    }

    .lp-hero-title {
      font-size: clamp(34px, 5.2vw, 68px);
      font-weight: 900;
      line-height: 1.08;
      letter-spacing: -0.045em;
      margin-bottom: 18px;
    }

    .lp-hero-title span {
      display: inline-block;
      opacity: 0.92;
    }

    .lp-punchlines {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 680px;
      margin-top: 18px;
    }

    .lp-theme-student .lp-punchlines,
    .lp-theme-community .lp-punchlines {
      margin-left: auto;
      margin-right: auto;
    }

    .lp-punchline {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      width: fit-content;
      max-width: 100%;
      padding: 11px 16px;
      border-radius: 999px;
      background: rgba(255,255,255,0.16);
      border: 1px solid rgba(255,255,255,0.22);
      backdrop-filter: blur(12px);
      color: rgba(255,255,255,0.94);
      font-size: clamp(15px, 1.35vw, 18px);
      line-height: 1.55;
      font-weight: 800;
      box-shadow: 0 14px 34px rgba(0,0,0,0.12);
    }

    .lp-theme-student .lp-punchline,
    .lp-theme-community .lp-punchline {
      margin-left: auto;
      margin-right: auto;
    }

    .lp-punchline-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #fff;
      flex-shrink: 0;
      opacity: 0.9;
    }

    .lp-hero-subtitle {
      font-size: clamp(16px, 1.45vw, 20px);
      line-height: 1.8;
      opacity: 0.86;
      max-width: 640px;
      font-weight: 600;
      margin-top: 20px;
    }

    .lp-theme-student .lp-hero-subtitle,
    .lp-theme-community .lp-hero-subtitle {
      margin-left: auto;
      margin-right: auto;
    }

    .lp-hero-visual {
      position: relative;
      min-height: 310px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .lp-main {
      max-width: 1240px;
      margin: 0 auto;
      padding: 48px 6% 88px;
    }

    .lp-two-col {
      display: grid;
      grid-template-columns: minmax(0, 0.95fr) minmax(380px, 0.85fr);
      gap: 30px;
      align-items: start;
    }

    .lp-theme-tech .lp-two-col {
      grid-template-columns: minmax(380px, 0.85fr) minmax(0, 0.95fr);
      direction: ltr;
    }

    .lp-theme-tech .lp-card {
      direction: rtl;
    }

    .lp-card {
      border-radius: var(--radius);
      border: 1px solid var(--card-border);
      background: var(--card-bg);
      box-shadow: var(--card-shadow);
      overflow: hidden;
      position: relative;
    }

    .lp-message-card {
      position: sticky;
      top: 88px;
    }

    .lp-card-strip {
      height: 5px;
      background: linear-gradient(90deg, var(--accent), var(--secondary));
    }

    .lp-card-body {
      padding: 34px 38px 38px;
      position: relative;
      z-index: 2;
    }

    .lp-card-heading {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .lp-card-icon {
      width: 46px;
      height: 46px;
      border-radius: 16px;
      background: var(--soft-accent);
      color: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 23px;
      flex-shrink: 0;
    }

    .lp-card-title {
      font-size: 20px;
      font-weight: 900;
      color: var(--text-main);
      letter-spacing: -0.02em;
    }

    .lp-message-text {
      font-size: 16px;
      line-height: 2;
      color: var(--text-body);
      white-space: pre-line;
    }

    .lp-signature {
      margin-top: 30px;
      padding-top: 22px;
      border-top: 1px solid var(--divider);
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text-muted);
      font-size: 13px;
      font-weight: 700;
    }

    .lp-signature img {
      max-height: 30px;
      max-width: 86px;
      object-fit: contain;
      opacity: 0.72;
    }

    .lp-donation-title {
      font-size: 23px;
      font-weight: 900;
      color: var(--text-main);
      margin-bottom: 7px;
      letter-spacing: -0.025em;
    }

    .lp-donation-subtitle {
      font-size: 14px;
      color: var(--text-muted);
      margin-bottom: 28px;
      line-height: 1.65;
      font-weight: 700;
    }

    .lp-options {
      display: flex;
      flex-direction: column;
      gap: 13px;
      margin-bottom: 28px;
    }

    .lp-card-opt {
      position: relative;
      width: 100%;
      text-align: right;
      border-radius: var(--radius);
      padding: 19px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      cursor: pointer;
      transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease, background .16s ease;
      font-family: inherit;
    }

    .lp-card-opt:hover {
      transform: translateY(-2px);
    }

    .lp-option-text {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .lp-option-label {
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 0.02em;
    }

    .lp-option-sub {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 700;
    }

    .lp-option-amount-wrap {
      display: flex;
      align-items: center;
      gap: 11px;
      flex-shrink: 0;
    }

    .lp-option-amount {
      font-size: 32px;
      font-weight: 900;
      letter-spacing: -0.035em;
      line-height: 1;
      white-space: nowrap;
    }

    .lp-radio {
      width: 23px;
      height: 23px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all .16s ease;
    }

    .lp-recommended {
      position: absolute;
      top: -11px;
      right: 18px;
      background: var(--accent);
      color: #fff;
      font-size: 11px;
      font-weight: 900;
      border-radius: 999px;
      padding: 4px 11px;
      letter-spacing: 0.04em;
      box-shadow: 0 10px 22px rgba(0,0,0,0.16);
    }

    .lp-btn-main {
      width: 100%;
      border: none;
      border-radius: var(--button-radius);
      padding: 18px 24px;
      font-size: 17px;
      font-weight: 900;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      letter-spacing: 0.01em;
      margin-bottom: 16px;
      font-family: inherit;
      transition: filter .16s ease, transform .16s ease, box-shadow .16s ease;
    }

    .lp-btn-main:hover:not(:disabled) {
      filter: brightness(1.07);
      transform: translateY(-1px) scale(1.006);
    }

    .lp-trust-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 9px;
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 800;
    }

    .lp-trust-item {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      background: var(--trust-bg);
      border: 1px solid var(--divider);
      border-radius: 12px;
      padding: 9px 6px;
      text-align: center;
    }

    .lp-footer {
      padding: 26px 6%;
      border-top: 1px solid rgba(15,23,42,0.08);
      background: rgba(255,255,255,0.72);
      text-align: center;
      font-size: 13px;
      color: #94a3b8;
      font-weight: 700;
    }

    .lp-deco {
      position: absolute;
      pointer-events: none;
      z-index: 1;
    }

    .lp-deco.one {
      top: -120px;
      left: -90px;
      width: 360px;
      height: 360px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      animation: lp-glow 5s ease-in-out infinite;
    }

    .lp-deco.two {
      bottom: -120px;
      right: 8%;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: rgba(255,255,255,0.075);
      animation: lp-glow 6s ease-in-out infinite reverse;
    }

    .lp-deco.three {
      top: 18%;
      left: 38%;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: rgba(255,255,255,0.055);
    }

    .lp-theme-student .lp-hero::after {
      content: '🎓 💡 🚀 ✨';
      position: absolute;
      left: 7%;
      bottom: 24px;
      font-size: 34px;
      letter-spacing: 16px;
      opacity: 0.35;
      animation: lp-bounce 3.6s ease-in-out infinite;
      pointer-events: none;
    }

    .lp-theme-student .lp-card {
      backdrop-filter: blur(18px);
    }

    .lp-theme-student .lp-card::after {
      content: '';
      position: absolute;
      top: -80px;
      left: -80px;
      width: 170px;
      height: 170px;
      border-radius: 50%;
      background: rgba(147,51,234,0.09);
      pointer-events: none;
    }

    .lp-theme-executive .lp-hero::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(115deg, transparent 0%, rgba(201,162,39,0.18) 52%, transparent 100%);
      pointer-events: none;
    }

    .lp-theme-executive .lp-card-strip {
      background: linear-gradient(90deg, #c9a227, #facc15, #c9a227);
    }

    .lp-theme-investor .lp-hero::after,
    .lp-theme-tech .lp-hero::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px);
      background-size: 42px 42px;
      animation: lp-grid 14s linear infinite;
      opacity: 0.55;
      pointer-events: none;
    }

    .lp-theme-investor .lp-card::after {
      content: '';
      position: absolute;
      left: 24px;
      bottom: 24px;
      width: 120px;
      height: 68px;
      opacity: 0.12;
      pointer-events: none;
      background:
        linear-gradient(to top, var(--accent) 0 35%, transparent 35%),
        linear-gradient(to top, var(--secondary) 0 62%, transparent 62%),
        linear-gradient(to top, var(--accent) 0 82%, transparent 82%);
      background-size: 26px 100%, 26px 100%, 26px 100%;
      background-position: 0 0, 42px 0, 84px 0;
      background-repeat: no-repeat;
    }

    .lp-theme-tech .lp-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(45,212,191,0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(45,212,191,0.06) 1px, transparent 1px);
      background-size: 28px 28px;
      pointer-events: none;
      opacity: 0.55;
    }

    .lp-theme-community .lp-hero::after {
      content: '♡';
      position: absolute;
      left: 10%;
      bottom: -10px;
      font-size: 180px;
      line-height: 1;
      color: rgba(255,255,255,0.11);
      pointer-events: none;
    }

    .hero-student-card,
    .hero-executive-card,
    .hero-investor-card,
    .hero-tech-card,
    .hero-community-card,
    .hero-default-card {
      width: 100%;
      max-width: 390px;
      min-height: 300px;
      position: relative;
      overflow: hidden;
      animation: lp-float 4s ease-in-out infinite;
    }

    .hero-student-card {
      border-radius: 42px;
      padding: 30px;
      background:
        radial-gradient(circle at 20% 15%, rgba(255,255,255,0.8), transparent 24%),
        linear-gradient(135deg, rgba(255,255,255,0.45), rgba(255,255,255,0.18));
      border: 2px solid rgba(255,255,255,0.5);
      box-shadow: 0 30px 80px rgba(124,58,237,0.35);
      color: white;
      text-align: center;
    }

    .student-stickers {
      position: absolute;
      inset: 18px;
      display: flex;
      justify-content: space-between;
      font-size: 28px;
      pointer-events: none;
    }

    .student-stickers span {
      animation: lp-bounce 3s ease-in-out infinite;
    }

    .student-stickers span:nth-child(2) {
      animation-delay: .4s;
    }

    .student-stickers span:nth-child(3) {
      animation-delay: .8s;
    }

    .student-main-emoji {
      font-size: 72px;
      margin-top: 38px;
      margin-bottom: 10px;
    }

    .hero-student-card h3 {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: -0.04em;
    }

    .hero-student-card p {
      margin: 8px auto 20px;
      max-width: 260px;
      line-height: 1.6;
      opacity: .9;
      font-weight: 700;
    }

    .student-progress {
      height: 14px;
      border-radius: 999px;
      background: rgba(255,255,255,0.28);
      overflow: hidden;
      margin-bottom: 18px;
    }

    .student-progress div {
      width: 72%;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, #fde68a, #f0abfc, #5eead4);
    }

    .hero-student-card strong {
      font-size: 42px;
      font-weight: 900;
    }

    .hero-executive-card {
      border-radius: 10px;
      padding: 34px;
      background:
        linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04)),
        #020617;
      border: 1px solid rgba(201,162,39,0.45);
      box-shadow: 0 34px 90px rgba(0,0,0,0.45);
      color: white;
    }

    .exec-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #facc15;
      font-weight: 900;
      letter-spacing: .08em;
      text-transform: uppercase;
      font-size: 13px;
      margin-bottom: 42px;
    }

    .exec-top b {
      font-size: 32px;
    }

    .exec-line {
      height: 12px;
      width: 86%;
      border-radius: 2px;
      background: rgba(255,255,255,0.16);
      margin-bottom: 14px;
    }

    .exec-line.short {
      width: 54%;
    }

    .exec-amount {
      font-size: 52px;
      font-weight: 900;
      margin: 42px 0;
      color: #facc15;
      letter-spacing: -0.05em;
    }

    .exec-footer {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid rgba(255,255,255,0.14);
      padding-top: 18px;
      color: rgba(255,255,255,0.7);
    }

    .exec-footer strong {
      color: #fff;
    }

    .hero-investor-card {
      border-radius: 20px;
      padding: 28px;
      background: rgba(255,255,255,0.96);
      border: 1px solid rgba(5,150,105,0.22);
      box-shadow: 0 30px 80px rgba(5,150,105,0.26);
      color: #064e3b;
    }

    .investor-header {
      display: flex;
      justify-content: space-between;
      font-weight: 900;
      margin-bottom: 28px;
    }

    .investor-header b {
      color: #059669;
      background: #d1fae5;
      border-radius: 999px;
      padding: 4px 10px;
    }

    .investor-chart {
      height: 150px;
      display: flex;
      align-items: end;
      gap: 14px;
      padding: 18px;
      border-radius: 18px;
      background:
        linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px);
      background-size: 24px 24px;
      margin-bottom: 24px;
    }

    .investor-chart span {
      flex: 1;
      border-radius: 999px 999px 4px 4px;
      background: linear-gradient(180deg, #34d399, #2563eb);
    }

    .investor-metrics {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    .investor-metrics div {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 14px;
    }

    .investor-metrics strong {
      display: block;
      font-size: 24px;
      font-weight: 900;
    }

    .investor-metrics span {
      font-size: 12px;
      color: #64748b;
      font-weight: 800;
    }

    .hero-tech-card {
      border-radius: 18px;
      padding: 0;
      background: #020617;
      border: 1px solid rgba(45,212,191,0.35);
      box-shadow:
        0 0 0 1px rgba(45,212,191,0.08),
        0 0 60px rgba(45,212,191,0.2),
        0 30px 90px rgba(0,0,0,0.55);
      color: #d1fae5;
      direction: ltr;
      text-align: left;
    }

    .tech-window {
      height: 44px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 18px;
      background: rgba(15,23,42,0.95);
      border-bottom: 1px solid rgba(45,212,191,0.18);
    }

    .tech-window span {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #ef4444;
    }

    .tech-window span:nth-child(2) {
      background: #facc15;
    }

    .tech-window span:nth-child(3) {
      background: #22c55e;
    }

    .hero-tech-card pre {
      margin: 0;
      padding: 28px;
      font-size: 15px;
      line-height: 1.8;
      font-family: Consolas, Monaco, monospace;
      color: #5eead4;
      white-space: pre-wrap;
    }

    .tech-status {
      margin: 0 28px 28px;
      padding: 12px 14px;
      border-radius: 12px;
      background: rgba(45,212,191,0.1);
      color: #ccfbf1;
      font-weight: 900;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tech-status span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 16px #22c55e;
    }

    .hero-community-card {
      border-radius: 36px;
      padding: 32px;
      background:
        radial-gradient(circle at 80% 15%, rgba(254,243,199,0.85), transparent 26%),
        rgba(255,255,255,0.88);
      border: 1px solid rgba(255,255,255,0.55);
      box-shadow: 0 30px 80px rgba(234,88,12,0.25);
      color: #7c2d12;
      text-align: center;
    }

    .community-people {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }

    .community-people span {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: #fff7ed;
      border: 3px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      margin-right: -10px;
      box-shadow: 0 10px 20px rgba(124,45,18,0.12);
    }

    .community-heart {
      font-size: 72px;
      color: #ea580c;
      line-height: 1;
      margin-bottom: 4px;
    }

    .hero-community-card h3 {
      font-size: 30px;
      font-weight: 900;
    }

    .hero-community-card p {
      max-width: 270px;
      margin: 8px auto 22px;
      line-height: 1.7;
      color: #78716c;
      font-weight: 800;
    }

    .hero-community-card strong {
      font-size: 42px;
      font-weight: 900;
      color: #16a34a;
    }

    .hero-default-card {
      border-radius: var(--radius);
      padding: 30px;
      background: rgba(255,255,255,0.16);
      border: 1px solid rgba(255,255,255,0.24);
      backdrop-filter: blur(18px);
      box-shadow: 0 24px 70px rgba(0,0,0,0.24);
      color: white;
    }

    .default-icon {
      width: 64px;
      height: 64px;
      border-radius: 22px;
      background: rgba(255,255,255,0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 34px;
      margin-bottom: 28px;
    }

    .hero-default-card h3 {
      font-size: 26px;
      font-weight: 900;
      margin-bottom: 8px;
    }

    .hero-default-card p {
      opacity: .78;
      font-weight: 700;
      margin-bottom: 26px;
    }

    .hero-default-card strong {
      font-size: 44px;
      font-weight: 900;
    }

    @media (max-width: 980px) {
      .lp-hero-inner {
        grid-template-columns: 1fr;
      }

      .lp-hero-visual {
        display: none;
      }

      .lp-two-col,
      .lp-theme-tech .lp-two-col {
        grid-template-columns: 1fr;
        direction: rtl;
      }

      .lp-message-card {
        position: static;
      }
    }

    @media (max-width: 700px) {
      .lp-nav {
        padding: 0 20px;
      }

      .lp-nav-inner {
        height: 62px;
      }

      .lp-secure {
        font-size: 12px;
      }

      .lp-logo-box {
        min-height: 42px;
        padding: 6px 10px;
      }

      .lp-logo {
        max-height: 28px;
        max-width: 120px;
      }

      .lp-hero {
        padding: 52px 20px 62px;
      }

      .lp-main {
        padding: 30px 20px 64px;
      }

      .lp-card-body {
        padding: 26px 22px 28px;
      }

      .lp-card-opt {
        flex-direction: column;
        align-items: flex-start;
      }

      .lp-option-amount-wrap {
        width: 100%;
        justify-content: space-between;
      }

      .lp-option-amount {
        font-size: 30px;
      }

      .lp-trust-row {
        grid-template-columns: 1fr;
      }

      .lp-punchline {
        width: 100%;
        justify-content: center;
        border-radius: 18px;
      }
    }
  `;

  document.head.appendChild(s);
}

/* ─────────────────────────────
   Component
───────────────────────────── */

export default function LandingPage() {
  const { token } = useParams();

  const [data, setData] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [error, setError] = useState('');
  const [brandColor, setBrandColor] = useState('#2457a6');
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    injectStyles();
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/landing/${token}`)
      .then((r) => r.json())
      .then(async (json) => {
        if (!json?.data) {
          setError('לא נמצאו נתונים לעמוד הזה.');
          return;
        }

        const d = json.data;

        setData(d);
        setSelectedAmount(d.option2 || d.option1 || d.option3 || null);

        const logoUrl = d.company_logo
          ? d.company_logo.startsWith('http')
            ? d.company_logo
            : `${API_BASE_URL}${d.company_logo}`
          : null;

        const fallback =
          d.company_color ||
          d.brand_color ||
          d.suggested_color ||
          '#2457a6';

        const extracted = logoUrl ? await extractDominantColor(logoUrl) : null;

        setBrandColor(extracted || fallback);
      })
      .catch(() => setError('אירעה שגיאה בטעינת העמוד.'));
  }, [token]);

  if (error || !data) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Heebo, sans-serif',
          direction: 'rtl',
          background: '#f8f9fb',
          color: '#6b7280',
          fontSize: 18,
        }}
      >
        {error || (
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 20,
                height: 20,
                border: '2.5px solid #d1d5db',
                borderTopColor: '#6b7280',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'lp-spin .8s linear infinite',
              }}
            />
            טוען…
          </span>
        )}
      </div>
    );
  }

  const debugTheme = getDebugTheme();

  // כאן השינוי המרכזי:
  // הקטגוריה מגיעה מהשרת דרך data.category
  const designCategory = debugTheme || normalizeCategory(data.category);

  console.log('Landing category from server:', data.category);
  console.log('Final landing design category:', designCategory);

  const theme = LANDING_THEMES[designCategory] || LANDING_THEMES.default;
  const isDefault = designCategory === 'default';

  const brand = parseColor(brandColor);
  const brandDark = {
    r: Math.round(brand.r * 0.58),
    g: Math.round(brand.g * 0.58),
    b: Math.round(brand.b * 0.58),
  };
  const brandLight = mix(brand, 0.96);

  const accent = isDefault ? rgb(brand) : theme.accent;
  const secondary = isDefault ? rgb(brandDark) : theme.secondary;

  const rootBackground = isDefault
    ? `linear-gradient(135deg, ${rgb(brandLight)} 0%, #ffffff 100%)`
    : theme.bg;

  const heroBackground = isDefault
    ? `linear-gradient(150deg, ${rgb(brand)} 0%, ${rgb(brandDark)} 100%)`
    : theme.heroBg;

  const cardBorder = isDefault ? rgba(brand, 0.18) : theme.border;

  const cardShadow = isDefault
    ? `0 24px 70px ${rgba(brand, 0.13)}`
    : theme.shadow;

  const logoUrl = data.company_logo
    ? data.company_logo.startsWith('http')
      ? data.company_logo
      : `${API_BASE_URL}${data.company_logo}`
    : null;

  const donorName = data.donor_name || 'שותף יקר';
  const companyName = data.company_name || 'הארגון';

  const punchline1 = data.punchline1 || theme.fallbackPunchline1;
  const punchline2 = data.punchline2 || theme.fallbackPunchline2;

  const ctaText =
    data?.ctaText ||
    data?.cta_text ||
    theme.ctaText;

  const options = [
    {
      amount: data.option1,
      label: theme.optionLabels[0],
      sub: theme.optionSubs[0],
    },
    {
      amount: data.option2,
      label: theme.optionLabels[1],
      sub: theme.optionSubs[1],
      recommended: true,
    },
    {
      amount: data.option3,
      label: theme.optionLabels[2],
      sub: theme.optionSubs[2],
    },
  ].filter((o) => o.amount);

  const optionBg = (selected) => {
    if (designCategory === 'tech') {
      return selected ? 'rgba(45,212,191,0.12)' : 'rgba(15,23,42,0.68)';
    }

    if (designCategory === 'student') {
      return selected ? 'rgba(147,51,234,0.11)' : 'rgba(255,255,255,0.8)';
    }

    if (designCategory === 'executive') {
      return selected ? 'rgba(201,162,39,0.11)' : '#fafafa';
    }

    if (isDefault) {
      return selected ? rgba(brand, 0.07) : '#fafafa';
    }

    return selected ? 'rgba(15,23,42,0.04)' : '#fafafa';
  };

  const optionBorder = (selected) => {
    if (selected) return `2px solid ${accent}`;

    if (designCategory === 'tech') {
      return '1.5px solid rgba(148,163,184,0.24)';
    }

    return '1.5px solid #e5e7eb';
  };

  return (
    <div
      className={`lp-root lp-theme-${theme.name}`}
      style={{
        background: rootBackground,
        '--radius': theme.radius,
        '--button-radius': designCategory === 'student' ? '999px' : theme.radius,
        '--hero-bg': heroBackground,
        '--accent': accent,
        '--secondary': secondary,
        '--soft-accent':
          designCategory === 'tech'
            ? 'rgba(45,212,191,0.11)'
            : isDefault
            ? rgba(brand, 0.1)
            : 'rgba(15,23,42,0.06)',
        '--card-bg': theme.cardBg,
        '--card-border': cardBorder,
        '--card-shadow': cardShadow,
        '--text-main': theme.textMain,
        '--text-body': theme.textBody,
        '--text-muted': theme.textMuted,
        '--divider':
          designCategory === 'tech'
            ? 'rgba(148,163,184,0.22)'
            : 'rgba(15,23,42,0.08)',
        '--trust-bg':
          designCategory === 'tech'
            ? 'rgba(15,23,42,0.65)'
            : 'rgba(248,250,252,0.86)',
      }}
    >
      <header className={`lp-nav ${theme.navDark ? 'dark' : ''}`}>
        <div className="lp-nav-inner">
          <div className="lp-logo-box">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={companyName}
                className="lp-logo"
                onLoad={() => setLogoLoaded(true)}
                style={{
                  opacity: logoLoaded ? 1 : 0,
                  transition: 'opacity .3s',
                }}
              />
            ) : (
              <span className="lp-company-name">{companyName}</span>
            )}
          </div>

          <div className="lp-secure">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            תשלום מאובטח
          </div>
        </div>
      </header>

      <section className="lp-hero">
        <div className="lp-deco one" />
        <div className="lp-deco two" />
        <div className="lp-deco three" />

        <div className="lp-hero-inner">
          <div className="lp-hero-content">
            <div className="lp-in" style={{ animationDelay: '.05s' }}>
              <div className="lp-badge">
                <span>{theme.emoji}</span>
                {theme.badgeText} · {companyName}
              </div>
            </div>

            <h1 className="lp-hero-title lp-in" style={{ animationDelay: '.1s' }}>
              שלום {donorName},
              <br />
              <span>{theme.heroTitle}</span>
            </h1>

            <div className="lp-punchlines lp-in" style={{ animationDelay: '.16s' }}>
              {punchline1 && (
                <div className="lp-punchline">
                  <span className="lp-punchline-dot" />
                  {punchline1}
                </div>
              )}

              {punchline2 && (
                <div className="lp-punchline">
                  <span className="lp-punchline-dot" />
                  {punchline2}
                </div>
              )}
            </div>
          </div>

          <div className="lp-hero-visual lp-in" style={{ animationDelay: '.24s' }}>
            <CategoryHeroVisual
              theme={theme}
              designCategory={designCategory}
              selectedAmount={selectedAmount}
              options={options}
            />
          </div>
        </div>
      </section>

      <main className="lp-main">
        <div className="lp-two-col lp-in" style={{ animationDelay: '.26s' }}>
          <div className="lp-card lp-message-card">
            <div className="lp-card-strip" />

            <div className="lp-card-body">
              <div className="lp-card-heading">
                <div className="lp-card-icon">{theme.emoji}</div>
                <h2 className="lp-card-title">{theme.messageTitle}</h2>
              </div>

              <div className="lp-message-text">
                {data.personalized_email ||
                  `${companyName} מזמינה אותך לקחת חלק פעיל בקמפיין שיוצר שינוי של ממש.`}
              </div>

              <div className="lp-signature">
                {logoUrl ? <img src={logoUrl} alt="" /> : null}
                <span>— {companyName}</span>
              </div>
            </div>
          </div>

          <div className="lp-card">
            <div className="lp-card-strip" />

            <div className="lp-card-body">
              <h2 className="lp-donation-title">{theme.donationTitle}</h2>

              <p className="lp-donation-subtitle">{theme.donationSubtitle}</p>

              <div className="lp-options">
                {options.map((opt, i) => {
                  const selected = selectedAmount === opt.amount;

                  return (
                    <button
                      key={i}
                      type="button"
                      className="lp-card-opt"
                      onClick={() => setSelectedAmount(opt.amount)}
                      style={{
                        background: optionBg(selected),
                        border: optionBorder(selected),
                        boxShadow: selected
                          ? `0 12px 30px ${
                              isDefault ? rgba(brand, 0.16) : 'rgba(0,0,0,0.13)'
                            }`
                          : 'none',
                      }}
                    >
                      {opt.recommended && (
                        <div className="lp-recommended">מומלץ</div>
                      )}

                      <div className="lp-option-text">
                        <span
                          className="lp-option-label"
                          style={{
                            color: selected ? accent : theme.textMuted,
                          }}
                        >
                          {opt.label}
                        </span>

                        <span className="lp-option-sub">{opt.sub}</span>
                      </div>

                      <div className="lp-option-amount-wrap">
                        <span
                          className="lp-option-amount"
                          style={{
                            color: selected ? accent : theme.textMain,
                          }}
                        >
                          ₪{formatAmount(opt.amount)}
                        </span>

                        <div
                          className="lp-radio"
                          style={{
                            border: selected ? 'none' : '1.5px solid #d1d5db',
                            background: selected ? accent : 'transparent',
                          }}
                        >
                          {selected && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                            >
                              <polyline
                                points="2,6.5 4.8,9.5 10,3"
                                stroke="white"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="lp-btn-main"
                disabled={!selectedAmount}
                onClick={() => alert(`נבחר: ₪${formatAmount(selectedAmount)}`)}
                style={{
                  background: selectedAmount
                    ? `linear-gradient(135deg, ${accent}, ${secondary})`
                    : '#e5e7eb',
                  color: selectedAmount ? '#fff' : '#9ca3af',
                  cursor: selectedAmount ? 'pointer' : 'default',
                  boxShadow: selectedAmount
                    ? `0 18px 34px -16px ${accent}`
                    : 'none',
                }}
              >
                {selectedAmount
                  ? `${ctaText} — ₪${formatAmount(selectedAmount)}`
                  : 'יש לבחור סכום'}

                {selectedAmount && (
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12,5 5,12 12,19" />
                  </svg>
                )}
              </button>

              <div className="lp-trust-row">
                <span className="lp-trust-item">🔒 {theme.trustWords[0]}</span>
                <span className="lp-trust-item">🏦 {theme.trustWords[1]}</span>
                <span className="lp-trust-item">✉️ {theme.trustWords[2]}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="lp-footer">
        © {companyName} · כל הזכויות שמורות
      </footer>
    </div>
  );
}