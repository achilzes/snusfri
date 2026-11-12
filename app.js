/* Snusfri — client-only PWA
   All data lives in localStorage. No backend.
*/
(function () {
  "use strict";

  const STORAGE_KEY = "snusfri.v1";
  const $ = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => [...(el || document).querySelectorAll(sel)];

  const TRIGGERS = [
    "Kaffe",
    "Efter mad",
    "Morgenen",
    "Stress",
    "Alkohol",
    "Fest",
    "Kedsomhed",
    "Socialt",
    "Kørsel",
    "Arbejde",
    "Ferie",
    "Gaming",
    "Andet"
  ];

  const MOODS = [
    { id: 1, face: "😞", label: "Tung" },
    { id: 2, face: "😕", label: "Lidt nede" },
    { id: 3, face: "😐", label: "Okay" },
    { id: 4, face: "🙂", label: "God" },
    { id: 5, face: "😄", label: "Strålende" }
  ];

  const TIPS = [
    "Drik et stort glas koldt vand — langsomt, hele vejen.",
    "Gå udenfor i fem minutter. Koldt luftskifte hjælper ofte.",
    "Tyg tyggegummi, eller spis noget sprødt som et æble eller gulerod.",
    "Læs din egen grund til at stoppe. Højtlæst virker endnu bedre.",
    "Send en kort besked til en, du stoler på.",
    "Vask hænder og ansigt med koldt vand. Skift konteksten.",
    "Trangen topper og daler. Den værste bølge varer oftest 3–4 minutter.",
    "Rejs dig. Stræk kroppen. Lav ti dybe squats eller en kort gåtur.",
    "Åbn en note og skriv, hvad du har lyst til — og hvad du hellere vil.",
    "Husk: du behøver ikke vinde resten af livet. Bare den her bølge."
  ];

  const MILESTONES = [
    {
      id: "20m",
      after: 20 * 60,
      title: "20 minutter",
      body: "Puls og blodtryk begynder ofte at falde mod dit eget normale niveau, når nikotinen ikke længere stimulerer kroppen."
    },
    {
      id: "8h",
      after: 8 * 3600,
      title: "8 timer",
      body: "Nikotinniveauet i blodet er allerede faldet tydeligt. Kroppen er i gang med at udskille stoffet."
    },
    {
      id: "24h",
      after: 24 * 3600,
      title: "1 døgn",
      body: "Kroppen har arbejdet et helt døgn uden ny nikotin. Nogle mærker allerede en lille forskel i smag og mundfølelse."
    },
    {
      id: "72h",
      after: 72 * 3600,
      title: "72 timer",
      body: "Det meste nikotin er ude af kroppen. Abstinenser — uro, hovedpine, irritabilitet — er ofte stærkest her, og begynder derefter at lette."
    },
    {
      id: "1w",
      after: 7 * 86400,
      title: "1 uge",
      body: "De fysiske abstinenser aftager som regel. Du har klaret den fase, de fleste finder hårdest."
    },
    {
      id: "2w",
      after: 14 * 86400,
      title: "2 uger",
      body: "Kredsløbet arbejder uden konstant nikotin. For mange kommer trangen sjældnere og føles svagere."
    },
    {
      id: "d28",
      after: 28 * 86400,
      title: "28 dage",
      body: "28 dage uden røg femdobler ifølge Helsenorge chancen for at holde op for godt — den samme dokumentation findes ikke for snus. Tag det som et delmål, ikke som et bevist snus-tal."
    },
    {
      id: "1mo",
      after: 30 * 86400,
      title: "1 måned",
      body: "Mange oplever mere energi og bedre mundfølelse. Tandkød og slimhinder får en pause fra poser og dåser."
    },
    {
      id: "3mo",
      after: 90 * 86400,
      title: "3 måneder",
      body: "Vanen er ved at være brudt. Irritation i mund og tandkød er ofte mærkbart mindre end da du brugte snus hver dag."
    },
    {
      id: "6mo",
      after: 182 * 86400,
      title: "6 måneder",
      body: "Et halvt år uden snus. De fleste oplever langt færre og svagere trange — og har vænnet sig til en ny hverdag."
    },
    {
      id: "1y",
      after: 365 * 86400,
      title: "1 år",
      body: "Et helt år uden snus. Historikken står. Det er et langt stykke arbejde — fortsæt som du har gjort."
    }
  ];

  const ACHIEVEMENTS = [
    { id: "h1", title: "Første time", ico: "⏱️", test: (c) => c.ms >= 36e5 },
    { id: "d1", title: "Første dag", ico: "🌅", test: (c) => c.ms >= 864e5 },
    { id: "d3", title: "Nikotin ude", ico: "💨", test: (c) => c.ms >= 3 * 864e5 },
    { id: "w1", title: "Første uge", ico: "🌿", test: (c) => c.ms >= 7 * 864e5 },
    { id: "w2", title: "To uger", ico: "🌱", test: (c) => c.ms >= 14 * 864e5 },
    { id: "m1", title: "En måned", ico: "🍀", test: (c) => c.ms >= 30 * 864e5 },
    { id: "d100", title: "100 dage", ico: "💯", test: (c) => c.days >= 100 },
    { id: "m6", title: "Halvt år", ico: "✨", test: (c) => c.ms >= 182 * 864e5 },
    { id: "y1", title: "Et år", ico: "🏆", test: (c) => c.ms >= 365 * 864e5 },
    { id: "k1", title: "1.000 kr", ico: "🪙", test: (c) => c.money >= 1000 },
    { id: "k5", title: "5.000 kr", ico: "💰", test: (c) => c.money >= 5000 },
    { id: "k10", title: "10.000 kr", ico: "💎", test: (c) => c.money >= 10000 },
    { id: "k25", title: "25.000 kr", ico: "👑", test: (c) => c.money >= 25000 },
    { id: "c10", title: "10 trange klaret", ico: "🛡️", test: (c) => c.cravingsResisted >= 10 },
    { id: "c50", title: "50 trange klaret", ico: "⚔️", test: (c) => c.cravingsResisted >= 50 },
    { id: "j7", title: "7 dages dagbog", ico: "📓", test: (c) => c.checkinStreak >= 7 },
    { id: "g1", title: "Første mål nået", ico: "🎯", test: (c) => c.goalsReached >= 1 },
    { id: "slipok", title: "Op igen", ico: "🌈", test: (c) => c.hadSlipAndContinued },
    { id: "w5", title: "5 bølger redet", ico: "🌊", test: (c) => c.waves >= 5 },
    { id: "w15", title: "15 bølger redet", ico: "🏄", test: (c) => c.waves >= 15 },
    { id: "party1", title: "Holdt festen", ico: "🎉", test: (c) => c.partiesHeld >= 1 },
    { id: "plan3", title: "Tre hvis-så-planer", ico: "🗺️", test: (c) => c.plans >= 3 }
  ];


  const STOPLINIEN = {
    phoneDisplay: "80 31 31 31",
    phoneTel: "80313131",
    smsNumber: "1231",
    smsBody: "Nikotinfri",
    hours: "Mandag–torsdag kl. 10–20, fredag kl. 10–16",
    closed: "Lukket på helligdage, grundlovsdag og 1. maj.",
    url: "https://www.stoplinien.dk",
    contactUrl: "https://www.stoplinien.dk/om-os/kontakt-og-aabningstider",
    smsNote: "Stoplinien skriver, at du skal sende «Nikotinfri» til 1231 — så ringer en rådgiver inden for 3 hverdage. Sundhedsstyrelsen nævner også «snusfri», «rygestop» og «breakup» som tekst til samme nummer.",
    source: "stoplinien.dk, opdateret 19. marts 2026"
  };

  /* Honest withdrawal timeline. Spans, not promises.
     Sources: Stoplinien, Helsenorge, Cleveland Clinic, user reports. */
  const COMPASS = [
    {
      id: "d1",
      fromH: 0,
      toH: 24,
      kicker: "De første timer · dag 1",
      title: "Kroppen har opdaget det",
      lead: "Trang, uro, irritabilitet og koncentrationsbesvær kan starte inden for få timer. Symptomerne begynder typisk 4–24 timer efter sidste pose.",
      symptoms: [
        { name: "Trang og uro", tip: "Det er kemisk, ikke et tegn på at du fejler. Rid bølgen, når den kommer." },
        { name: "Søvn", tip: "Nogle vågner mange gange den første uge. Det letter ofte efter 1–2 uger. Mindre koffein om aftenen kan hjælpe." },
        { name: "Irritabilitet", tip: "Almindeligt og midlertidigt. Gå en kort tur, eller sig det højt til en, du stoler på." }
      ],
      honest: "I morgen og i overmorgen er toppen for de fleste. Det er midlertidigt — og det er normalt.",
      peak: false
    },
    {
      id: "peak",
      fromH: 24,
      toH: 72,
      kicker: "Dag 2–3 · toppen",
      title: "For de fleste er det her toppen",
      lead: "Irritabilitet, søvnbesvær og tåge er almindeligt og midlertidigt. Nikotinen er næsten ude af kroppen, og trangen kan føles meget intens.",
      symptoms: [
        { name: "Intens trang", tip: "Den værste bølge varer oftest 3–4 minutter. Rid den. Du behøver ikke vinde resten af livet — bare den her." },
        { name: "Søvn", tip: "En dansk bruger beskrev 8–10 opvågninger pr. nat i uge 1, som forsvandt efter 1–2 uger. Det er forventeligt." },
        { name: "Tåge og koncentration", tip: "Meget almindeligt. Det letter, men ikke nødvendigvis på en fast dag." },
        { name: "Humør, angst, tristhed", tip: "Begge dele forekommer: at angsten letter, eller at den er værst i ugerne efter. Ved alvorlig nedtrykthed, tal med en læge." }
      ],
      honest: "Det her er ikke et tegn på at du fejler. Det er toppen for de fleste, og den går over.",
      peak: true
    },
    {
      id: "week1",
      fromH: 72,
      toH: 168,
      kicker: "Første uge",
      title: "Kroppen begynder at tilpasse sig",
      lead: "Nikotinen er næsten ude. De fysiske abstinenser er stadig der, men for mange er den værste top passeret. Søvnen kan stadig være urolig.",
      symptoms: [
        { name: "Søvn", tip: "Mindre koffein om aftenen, et glas vand, en kort gåtur. Det letter ofte efter 1–2 uger." },
        { name: "Appetit", tip: "Kroppen kan bede om mere. Det er forventeligt — ikke et slankeprogram. Vand og en gåtur er et roligt sted at starte." },
        { name: "Bølger", tip: "Trangen kommer i bølger, ofte udløst af vaner: kaffe, efter mad, stress." }
      ],
      honest: "Du er igennem de første 72 timer. For mange er det den hårdeste del. Det betyder ikke, at resten er let — men toppen er ofte passeret.",
      peak: false
    },
    {
      id: "w2to4",
      fromH: 168,
      toH: 672,
      kicker: "Uge 2–4",
      title: "De fleste kerne-symptomer letter",
      lead: "For mange letter de fysiske symptomer over 2–4 uger. Nogle har stadig tåge, træthed og bølger. At «to uger er nedad bakke» er en erfaring nogle deler — ikke et løfte.",
      symptoms: [
        { name: "Hjerne-tåge", tip: "For én var den væk efter to uger; for en anden først tydelig bedring efter 90 dage. Variationen er reel." },
        { name: "Trang af vane, ikke behov", tip: "Efter den fysiske abstinens udløses bølger ofte af stress, kedsomhed eller fest. Hvis-så-planen er lavet til det." },
        { name: "Appetit og vægt", tip: "Ved rygestop er gennemsnitlig vægtøgning omkring 4–5 kg efter 12 måneder. For snus er tallene færre, men risikoen er sandsynlig. Det er ikke alles historie." }
      ],
      honest: "Nogle er klarere efter 2 uger, nogle først efter 2–3 måneder. Appen lover ikke dag 14 som en finishlinje.",
      peak: false
    },
    {
      id: "month",
      fromH: 672,
      toH: 2160,
      kicker: "Efter 1 måned",
      title: "Trangen er ofte markant mindre",
      lead: "Stoplinien: trangen er markant mindre. Triggersituationer — fest, ferie, bestemte mennesker — kan stadig vække den.",
      symptoms: [
        { name: "Sjældnere bølger", tip: "Når de kommer, er de stadig 3–4 minutter. Du har redet dem før." },
        { name: "Første fest eller ferie", tip: "Sjældne cues holder længe. Lav en fest-plan, mens du er ædru, ligesom første gang." },
        { name: "Mund og tandkød", tip: "Stoplinien: snus kan få tandkødet til at trække sig tilbage. Tandlægeforeningen (2024), citeret af Stoplinien: over halvdelen af tandlægerne har oplevet flere patienter med skader fra snus, især blandt unge. En pause giver slimhinderne ro." }
      ],
      honest: "«Hvornår føles jeg normal?» har ikke ét svar. En havde tågen væk efter 2 uger; en anden først tydelig bedring efter 90 dage.",
      peak: false
    },
    {
      id: "m3to6",
      fromH: 2160,
      toH: 4320,
      kicker: "3–6 måneder",
      title: "Trangen dukker sjældnere op",
      lead: "Triggersituationer kan stadig vække den. Det er ofte hukommelse og vane, ikke behov. Tilbagefald efter lang tid sker, ofte til fest.",
      symptoms: [
        { name: "Fest og alkohol", tip: "Den hyppigste fælde, også langt henne. Planen laves ædru. «Bjudsnus» tæller." },
        { name: "«Bare én»", tip: "Kickene fra den første fase er væk. Du tager den for at føle dig normal — og så er du fast igen." },
        { name: "Mund og tandkød", tip: "Stoplinien: snus kan få tandkødet til at trække sig tilbage. Tandkød og slimhinder får en pause — det er en af de ting, mange først mærker efter måneder." }
      ],
      honest: "Den værste del er for de fleste overstået, men det kræver stadig opmærksomhed.",
      peak: false
    },
    {
      id: "long",
      fromH: 4320,
      toH: 1e9,
      kicker: "Efter et halvt år",
      title: "Den værste del er for de fleste overstået",
      lead: "Det kræver stadig opmærksomhed. Tilbagefald efter lang tid dokumenteres ofte på fest. En pose er stadig et slip, ikke et afsluttet kapitel.",
      symptoms: [
        { name: "Dvale-cues", tip: "Ferie, jagtsæson, et festligt tilbud. Samme forberedelse som i uge 1: en plan, en makker, et roligt nej." }
      ],
      honest: "Du er langt. Det er værd at passe på — ikke fordi du er skrøbelig, men fordi vanen kan vågne.",
      peak: false
    }
  ];

  const IFTHEN_TEMPLATES = [
    { trigger: "Fest", ifText: "Hvis jeg bliver budt en pose til fest", thenText: "så siger jeg: Nej tak, jeg tager ikke snus." },
    { trigger: "Alkohol", ifText: "Hvis jeg drikker og får sug", thenText: "så drikker jeg et glas vand og skriver til min makker." },
    { trigger: "Kaffe", ifText: "Hvis jeg drikker kaffe og får lyst til en pose", thenText: "så tygger jeg tyggegummi og bliver siddende uden at gå til dåsen." },
    { trigger: "Efter mad", ifText: "Hvis jeg er færdig med at spise", thenText: "så rejser jeg mig og rydder af, eller går en kort tur." },
    { trigger: "Morgenen", ifText: "Hvis jeg vågner og vil have den første pose", thenText: "så drikker jeg et stort glas vand og går i bad først." },
    { trigger: "Stress", ifText: "Hvis jeg bliver presset eller skuffet", thenText: "så går jeg udenfor i fem minutter, før jeg beslutter noget." },
    { trigger: "Kedsomhed", ifText: "Hvis jeg keder mig og hænderne søger en dåse", thenText: "så sætter jeg en timer på fire minutter og rider bølgen." },
    { trigger: "Kørsel", ifText: "Hvis jeg sidder i bilen og får sug", thenText: "så tænder jeg musik og holder rattet med begge hænder." },
    { trigger: "Arbejde", ifText: "Hvis jeg skal koncentrere mig og savner posen", thenText: "så tager jeg en pause med vand eller en kort gåtur." },
    { trigger: "Socialt", ifText: "Hvis andre tager snus omkring mig", thenText: "så siger jeg nej tak, og skifter emne." },
    { trigger: "Ferie", ifText: "Hvis jeg er på ferie og gamle vaner banker på", thenText: "så kigger jeg på mine grunde og tager en gåtur." },
    { trigger: "Gaming", ifText: "Hvis jeg spiller og hænderne søger en pose", thenText: "så sætter jeg et glas vand ved siden af og rider bølgen, hvis suget kommer." },
    { trigger: "Andet", ifText: "Hvis suget kommer uventet", thenText: "så drikker jeg et glas koldt vand og rider bølgen." }
  ];

  const WAVE_TIPS = [
    { id: "vand", label: "Et glas vand" },
    { id: "tur", label: "Kort gåtur" },
    { id: "pastil", label: "Pastil eller tyggegummi" },
    { id: "ingefaer", label: "Ingefær under læben" },
    { id: "and", label: "2 min. åndedræt" }
  ];

  const INBOX_TEMPLATES = [
    { id: "h6", fromH: 4, toH: 12, title: "De første timer", body: "Trang og uro kan starte nu. Det er forventeligt. Den værste bølge varer oftest 3–4 minutter — rid den, hvis den kommer." },
    { id: "h12", fromH: 12, toH: 22, title: "Cirka et halvt døgn", body: "Trangen kommer i bølger. Hver bølge går over. Dine grunde og din plan ligger klar, hvis du har brug for dem." },
    { id: "d2", fromH: 22, toH: 36, title: "Dag 2 — toppen for de fleste", body: "For de fleste er det her toppen. Irritabilitet, søvn og tåge er almindeligt og midlertidigt. Det er ikke et tegn på at du fejler." },
    { id: "d2eve", fromH: 36, toH: 48, title: "Aften på dag 2", body: "Hvis det føles værst nu, er det forventeligt. Rid bølgen. Du behøver ikke vinde resten af livet — bare den her." },
    { id: "d3", fromH: 48, toH: 64, title: "Dag 3", body: "Nikotinen er næsten ude af kroppen. Trangen kan være intens — og den går over. Du behøver ikke vinde resten af livet, bare den her bølge." },
    { id: "d3eve", fromH: 64, toH: 80, title: "Dag 3 er ved at være omme", body: "Nikotinen er næsten ude. Vanerne bliver. Dine hvis-så-planer er lavet til dem." },
    { id: "d4", fromH: 80, toH: 130, title: "De første 72 timer er gået", body: "Kroppen begynder at tilpasse sig. Søvnen kan stadig være urolig et stykke tid endnu. Det letter ofte efter 1–2 uger." },
    { id: "w1", fromH: 144, toH: 192, title: "Cirka en uge", body: "De fysiske abstinenser aftager som regel. Vanerne bliver tilbage. Dine hvis-så-planer er lavet til dem." },
    { id: "d28", fromH: 27 * 24, toH: 30 * 24, title: "28 dage", body: "28 dage uden røg femdobler ifølge Helsenorge chancen for at holde op for godt — den samme dokumentation findes ikke for snus. Tag det som et delmål, ikke som et bevist snus-tal." },
    { id: "weekend", weekend: true, fromH: 0, toH: 2160, title: "Weekenden nærmer sig", body: "Fest og alkohol er den hyppigste fælde. Hvis du skal ud, så kig på planen, du lavede, mens du var ædru." }
  ];

  const STORAGE_BACKUP = "snusfri.v1.backup";
  const STORAGE_SNAPSHOT = "snusfri.v1.pre-v8";
  let WAVE_MS = 210000;


  /* ---------------- utilities ---------------- */
  function uid() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function pad(n) {
    return String(n).padStart(2, "0");
  }
  const nf0 = new Intl.NumberFormat("da-DK", { maximumFractionDigits: 0 });
  const nf1 = new Intl.NumberFormat("da-DK", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const nf2 = new Intl.NumberFormat("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function fmtNum(n, d) {
    const x = isFinite(Number(n)) ? Number(n) : 0;
    if (d === 1) return nf1.format(x);
    if (d === 2) return nf2.format(x);
    return nf0.format(Math.round(x));
  }
  function fmtKr(n, d) {
    const x = isFinite(Number(n)) ? Number(n) : 0;
    return (d === 0 ? nf0.format(x) : nf2.format(x)) + " kr";
  }
  function moneyParts(n) {
    const raw = isFinite(Number(n)) ? Number(n) : 0;
    const rounded = Math.round(raw * 100) / 100;
    const sign = rounded < 0 ? "−" : "";
    const abs = Math.abs(rounded);
    const [int, dec] = abs.toFixed(2).split(".");
    const intFmt = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return { sign, int: intFmt, dec };
  }
  function fmtDate(d, opts) {
    const dt = d instanceof Date ? d : new Date(d);
    return new Intl.DateTimeFormat(
      "da-DK",
      opts || { day: "numeric", month: "short", year: "numeric" }
    ).format(dt);
  }
  function fmtDateTime(d) {
    const dt = d instanceof Date ? d : new Date(d);
    return new Intl.DateTimeFormat("da-DK", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(dt);
  }
  function toLocalInput(d) {
    const dt = d instanceof Date ? d : new Date(d);
    return (
      dt.getFullYear() +
      "-" +
      pad(dt.getMonth() + 1) +
      "-" +
      pad(dt.getDate()) +
      "T" +
      pad(dt.getHours()) +
      ":" +
      pad(dt.getMinutes())
    );
  }
  function parseNum(s) {
    if (typeof s === "number") return s;
    if (s == null || s === "") return NaN;
    return parseFloat(String(s).trim().replace(/\s/g, "").replace(",", "."));
  }
  function todayISO(d) {
    const dt = d ? new Date(d) : new Date();
    return dt.getFullYear() + "-" + pad(dt.getMonth() + 1) + "-" + pad(dt.getDate());
  }
  function startOfDay(d) {
    const dt = new Date(d);
    dt.setHours(0, 0, 0, 0);
    return dt;
  }
  function plural(n, one, many) {
    return n === 1 ? one : many;
  }
  function fmtEta(sec) {
    if (sec <= 0) return "nu";
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    if (d > 1) return "om " + d + " dage" + (h ? " og " + h + " t." : "");
    if (d === 1) return "om 1 dag" + (h ? " og " + h + " t." : "");
    if (h > 0) return "om " + h + " t. og " + m + " min.";
    return "om " + Math.max(1, m) + " min.";
  }
  function fmtTimeWon(minutes) {
    const m = Math.max(0, minutes);
    const h = m / 60;
    const d = h / 24;
    if (d >= 2) return fmtNum(d, 1) + " døgn";
    if (h >= 2) return fmtNum(h, 0) + " timer";
    return fmtNum(m, 0) + " min.";
  }
  function fmtNic(mg) {
    if (mg >= 1000) return fmtNum(mg / 1000, 1) + " g";
    return fmtNum(mg, 0) + " mg";
  }
  function fmtPouches(n) {
    if (n >= 10) return fmtNum(Math.floor(n), 0);
    return fmtNum(n, 1);
  }
  function isStandalone() {
    return (
      window.navigator.standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches
    );
  }

  /* ---------------- state ---------------- */
  function defaultProfile() {
    return {
      quitAt: null,
      habitMode: "cans",
      cansPerWeek: 7,
      pouchesPerDay: 12,
      pricePerCan: 55,
      pouchesPerCan: 20,
      nicotineMg: 8,
      motivation: "",
      quitMode: "cold",
      leftovers: "",
      alcoholFirstWeeks: ""
    };
  }
  function defaultState() {
    return {
      v: 4,
      onboarded: false,
      profile: defaultProfile(),
      taper: {
        enabled: false,
        startPouches: 12,
        targetPouches: 0,
        startDate: null,
        stopDate: null,
        weeks: 6,
        strengthMg: 8,
        logs: {},
        strengthLogs: {}
      },
      goals: [],
      cravings: [],
      slips: [],
      checkins: [],
      streaks: [],
      achievements: {},
      dismissed: {},
      reasons: [],
      ifThenPlans: [],
      partyPlans: [],
      activeParty: null,
      wavesRidden: 0,
      partiesHeld: 0,
      nicotineFree: {
        enabled: false,
        startDate: null,
        endDate: null,
        logs: {},
        warned: false
      },
      inbox: [],
      inboxSeen: {},
      buddy: { name: "", phone: "", note: "" },
      notifyPrefs: { enabled: false, earlyIntense: true, times: [] },
      dayLog: {},
      sleepLog: {},
      weightLog: {},
      theme: "system",
      letter: { text: "", writtenAt: null, openedAt: null },
      toolHelp: {},
      celebrated: {},
      recapSeen: {},
      activeDelay: null
    };
  }

  let state = defaultState();
  let view = "home";
  let morePage = null;
  let obStep = 0;
  let obDraft = null;
  let tickTimer = null;
  let breathRaf = 0;
  let breathStop = null;
  let waveRaf = 0;
  let waveStop = null;

  function adoptData(data) {
    const base = defaultState();
    const incoming = data && typeof data === "object" ? data : {};
    const next = Object.assign(base, incoming);
    next.profile = Object.assign(defaultProfile(), incoming.profile || {});
    next.taper = Object.assign(base.taper, incoming.taper || {});
    next.goals = incoming.goals || [];
    next.cravings = incoming.cravings || [];
    next.slips = incoming.slips || [];
    next.checkins = incoming.checkins || [];
    next.streaks = incoming.streaks || [];
    next.achievements = incoming.achievements || {};
    next.dismissed = incoming.dismissed || {};
    migrateState(next, incoming);
    return next;
  }

  function migrateState(s, raw) {
    raw = raw || {};
    /* Never drop existing arrays or counters. Only fill what is missing. */
    if (!Array.isArray(s.reasons)) s.reasons = [];
    if (!s.reasons.length) {
      const mot = ((s.profile && s.profile.motivation) || "").trim();
      if (mot) s.reasons = [{ id: "migrated", text: mot }];
    } else {
      s.reasons = s.reasons.map(function (r) {
        if (typeof r === "string") return { id: uid(), text: r };
        if (r && r.text) return { id: r.id || uid(), text: r.text };
        return { id: uid(), text: String(r || "") };
      }).filter(function (r) { return r.text; });
    }
    if (!Array.isArray(s.ifThenPlans)) s.ifThenPlans = [];
    if (!Array.isArray(s.partyPlans)) s.partyPlans = [];
    if (s.activeParty === undefined) s.activeParty = null;
    if (typeof s.wavesRidden !== "number") {
      s.wavesRidden = (s.cravings || []).filter(function (c) { return c.usedWave; }).length;
    }
    if (typeof s.partiesHeld !== "number") {
      s.partiesHeld = (s.partyPlans || []).filter(function (p) { return p.held; }).length;
    }
    if (!s.nicotineFree || typeof s.nicotineFree !== "object") {
      s.nicotineFree = { enabled: false, startDate: null, endDate: null, logs: {}, warned: false };
    } else {
      s.nicotineFree.logs = s.nicotineFree.logs || {};
    }
    if (!Array.isArray(s.inbox)) s.inbox = [];
    if (!s.inboxSeen || typeof s.inboxSeen !== "object") s.inboxSeen = {};
    if (!s.buddy || typeof s.buddy !== "object") s.buddy = { name: "", phone: "", note: "" };
    else {
      s.buddy.name = s.buddy.name || "";
      s.buddy.phone = s.buddy.phone || "";
      s.buddy.note = s.buddy.note || "";
    }
    if (!s.notifyPrefs || typeof s.notifyPrefs !== "object") {
      s.notifyPrefs = { enabled: false, earlyIntense: true, times: [] };
    }
    if (!s.dayLog || typeof s.dayLog !== "object") s.dayLog = {};
    if (!s.sleepLog || typeof s.sleepLog !== "object") s.sleepLog = {};
    if (!s.weightLog || typeof s.weightLog !== "object") s.weightLog = {};
    if (!s.theme) s.theme = "system";
    if (!s.letter || typeof s.letter !== "object") s.letter = { text: "", writtenAt: null, openedAt: null };
    else {
      s.letter.text = s.letter.text || "";
      s.letter.writtenAt = s.letter.writtenAt || null;
      s.letter.openedAt = s.letter.openedAt || null;
    }
    if (!s.toolHelp || typeof s.toolHelp !== "object") s.toolHelp = {};
    if (!s.celebrated || typeof s.celebrated !== "object") s.celebrated = {};
    if (!s.recapSeen || typeof s.recapSeen !== "object") s.recapSeen = {};
    if (s.activeDelay === undefined) s.activeDelay = null;
    if (s.taper) {
      if (!s.taper.stopDate) s.taper.stopDate = s.taper.stopDate || null;
      if (s.taper.strengthMg == null) s.taper.strengthMg = (s.profile && s.profile.nicotineMg) || 0;
      if (!s.taper.strengthLogs) s.taper.strengthLogs = {};
      if (!s.taper.logs) s.taper.logs = {};
    }
    if (s.profile && !s.profile.quitMode) {
      s.profile.quitMode = s.taper && s.taper.enabled ? "taper" : "cold";
    }
    if (!s.profile.leftovers) s.profile.leftovers = s.profile.leftovers || "";
    if (!s.profile.alcoholFirstWeeks) s.profile.alcoholFirstWeeks = s.profile.alcoholFirstWeeks || "";
    s.v = Math.max(Number(s.v) || 1, 4);
    return s;
  }

  function load() {
    try {
      let raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const bak = localStorage.getItem(STORAGE_BACKUP);
        if (bak) {
          raw = bak;
          console.warn("Snusfri: gendannede data fra intern kopi");
        } else {
          return;
        }
      }
      const data = JSON.parse(raw);
      if (!localStorage.getItem(STORAGE_SNAPSHOT)) {
        try { localStorage.setItem(STORAGE_SNAPSHOT, raw); } catch (e) {}
      }
      state = adoptData(data);
    } catch (err) {
      console.warn("Snusfri: kunne ikke læse gemt data", err);
      try {
        const bak = localStorage.getItem(STORAGE_BACKUP);
        if (bak) {
          state = adoptData(JSON.parse(bak));
          console.warn("Snusfri: gendannede data fra intern kopi efter fejl");
          return;
        }
      } catch (e2) {}
      state = defaultState();
    }
  }
  function save() {
    try {
      const json = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, json);
      try { localStorage.setItem(STORAGE_BACKUP, json); } catch (e) {}
    } catch (err) {
      toast("Kunne ikke gemme — er der plads nok på enheden?", "warn");
    }
  }

  /* ---------------- calculations ---------------- */
  function rates(p) {
    p = p || state.profile;
    const ppc = Math.max(1, Number(p.pouchesPerCan) || 20);
    const price = Math.max(0, Number(p.pricePerCan) || 0);
    const nic = Math.max(0, Number(p.nicotineMg) || 0);
    let pouchesPerDay, cansPerDay, costPerDay;
    if (p.habitMode === "pouches") {
      pouchesPerDay = Math.max(0, Number(p.pouchesPerDay) || 0);
      cansPerDay = pouchesPerDay / ppc;
      costPerDay = cansPerDay * price;
    } else {
      cansPerDay = Math.max(0, Number(p.cansPerWeek) || 0) / 7;
      pouchesPerDay = cansPerDay * ppc;
      costPerDay = cansPerDay * price;
    }
    return {
      pouchesPerDay: pouchesPerDay,
      cansPerDay: cansPerDay,
      costPerDay: costPerDay,
      mgPerDay: pouchesPerDay * nic,
      minPerPouch: 5,
      ppc: ppc,
      price: price,
      nic: nic
    };
  }

  function stats(now) {
    now = now || Date.now();
    const r = rates();
    const parsed = state.profile && state.profile.quitAt ? new Date(state.profile.quitAt).getTime() : NaN;
    const quitAt = isFinite(parsed) ? parsed : now;
    const rawMs = now - quitAt;
    const ms = Math.max(0, rawMs);
    const days = ms / 86400000;
    const slips = (state.slips || []).filter((s) => !s.reset);
    const slipPouches = slips.reduce((a, s) => a + (Number(s.pouches) || 0), 0);
    const costPerPouch = r.pouchesPerDay > 0 ? r.costPerDay / r.pouchesPerDay : 0;
    const moneyGross = r.costPerDay * days;
    const money = Math.max(0, moneyGross - slipPouches * costPerPouch);
    const pouches = Math.max(0, r.pouchesPerDay * days - slipPouches);
    const cans = r.ppc ? pouches / r.ppc : 0;
    const nicotine = pouches * r.nic;
    const minutes = pouches * r.minPerPouch;
    return {
      r: r,
      ms: ms,
      rawMs: rawMs,
      days: days,
      future: rawMs < 0,
      money: money,
      moneyGross: moneyGross,
      pouches: pouches,
      cans: cans,
      nicotine: nicotine,
      minutes: minutes,
      slipPouches: slipPouches,
      per: {
        day: r.costPerDay,
        week: r.costPerDay * 7,
        month: r.costPerDay * 30.4375,
        year: r.costPerDay * 365
      }
    };
  }

  function splitTime(ms) {
    const s = Math.floor(Math.max(0, ms) / 1000);
    return {
      days: Math.floor(s / 86400),
      hours: Math.floor((s % 86400) / 3600),
      mins: Math.floor((s % 3600) / 60),
      secs: s % 60
    };
  }

  function checkinStreak() {
    const dates = new Set((state.checkins || []).map((c) => c.date));
    const d = new Date();
    if (!dates.has(todayISO(d))) d.setDate(d.getDate() - 1);
    let n = 0;
    while (dates.has(todayISO(d))) {
      n++;
      d.setDate(d.getDate() - 1);
    }
    return n;
  }

  function todayCheckin() {
    const t = todayISO(new Date());
    return (state.checkins || []).find((c) => c.date === t) || null;
  }

  function achievementCtx() {
    const s = stats();
    return {
      ms: s.ms,
      days: s.days,
      money: s.money,
      cravingsResisted: (state.cravings || []).filter((c) => c.resisted).length,
      checkinStreak: checkinStreak(),
      goalsReached: (state.goals || []).filter((g) => g.reachedAt || s.money >= g.price).length,
      hadSlipAndContinued: (state.slips || []).length > 0 && s.ms >= 864e5,
      waves: Number(state.wavesRidden) || 0,
      partiesHeld: Number(state.partiesHeld) || 0,
      plans: (state.ifThenPlans || []).length
    };
  }

  function checkAchievements(silent) {
    const ctx = achievementCtx();
    const newly = [];
    for (let i = 0; i < ACHIEVEMENTS.length; i++) {
      const a = ACHIEVEMENTS[i];
      if (state.achievements[a.id]) continue;
      if (a.test(ctx)) {
        state.achievements[a.id] = new Date().toISOString();
        newly.push(a);
      }
    }
    const s = stats();
    (state.goals || []).forEach((g) => {
      if (!g.reachedAt && s.money >= Number(g.price)) {
        g.reachedAt = new Date().toISOString();
      }
    });
    if (newly.length) {
      save();
      if (!silent) {
        newly.forEach((a) => toast("Mærke låst op: " + a.ico + "  " + a.title, "gold"));
      }
    }
    return newly;
  }

  function taperAllowance(date) {
    const t = state.taper;
    if (!t || !t.enabled || !t.startDate) return null;
    const start = new Date(t.startDate);
    const weeks = Math.max(1, Number(t.weeks) || 6);
    const startP = Math.max(0, Number(t.startPouches) || 0);
    const endP = Math.max(0, Number(t.targetPouches) || 0);
    const totalDays = weeks * 7;
    const day = calendarDaysBetween(start, date || new Date());
    if (day < 0) return { allow: startP, day: day, totalDays: totalDays, done: false };
    if (day >= totalDays) return { allow: endP, day: day, totalDays: totalDays, done: true };
    const raw = startP + (endP - startP) * (day / totalDays);
    const allow = Math.round(raw * 2) / 2;
    return { allow: allow, day: day, totalDays: totalDays, done: false, raw: raw };
  }


  /* ---------------- v8 helpers ---------------- */
  function compassPhase(now) {
    const s = stats(now);
    if (s.future) {
      return {
        phase: {
          id: "prep",
          fromH: 0,
          toH: 0,
          kicker: "Før start",
          title: "De første 72 timer topper dag 2–3",
          lead: "Trang, uro og dårlig søvn kan starte inden for få timer. For de fleste er det værst dag 2–3. Det er midlertidigt, og det er normalt.",
          symptoms: [],
          honest: "Lav planen nu — før suget kommer. Dag 2 skal ikke komme som et chok.",
          peak: false
        },
        hours: 0,
        days: 0,
        s: s,
        future: true
      };
    }
    const hours = s.ms / 3600000;
    let phase = COMPASS[0];
    for (let i = 0; i < COMPASS.length; i++) {
      if (hours >= COMPASS[i].fromH && hours < COMPASS[i].toH) {
        phase = COMPASS[i];
        break;
      }
      if (hours >= COMPASS[i].fromH) phase = COMPASS[i];
    }
    return { phase: phase, hours: hours, days: s.days, s: s, future: false };
  }

  function reasonsList() {
    const list = (state.reasons || []).filter(function (r) { return r && (r.text || "").trim(); });
    if (list.length) return list;
    const mot = ((state.profile && state.profile.motivation) || "").trim();
    return mot ? [{ id: "mot", text: mot }] : [];
  }

  function syncMotivation() {
    const r = reasonsList();
    if (r.length && state.profile) state.profile.motivation = r[0].text;
  }

  function ifThenFor(trigger) {
    if (!trigger) return null;
    const plans = state.ifThenPlans || [];
    return plans.find(function (p) { return p.trigger === trigger; }) || null;
  }

  function templateFor(trigger) {
    return IFTHEN_TEMPLATES.find(function (t) { return t.trigger === trigger; }) || IFTHEN_TEMPLATES[IFTHEN_TEMPLATES.length - 1];
  }

  function topTriggers(n) {
    n = n || 3;
    const counts = {};
    (state.cravings || []).forEach(function (c) {
      const k = c.trigger || "";
      if (!k) return;
      counts[k] = (counts[k] || 0) + 1;
    });
    const ranked = Object.keys(counts)
      .map(function (k) { return { k: k, n: counts[k] }; })
      .sort(function (a, b) { return b.n - a.n; });
    if (ranked.length >= n) return ranked.slice(0, n).map(function (x) { return x.k; });
    const extra = TRIGGERS.filter(function (t) { return t !== "Andet" && ranked.every(function (r) { return r.k !== t; }); });
    return ranked.map(function (x) { return x.k; }).concat(extra).slice(0, n);
  }

  function trigKey(t) {
    return String(t || "").replace(/\s+/g, "_");
  }
  function smsHref(number, body) {
    const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const enc = encodeURIComponent(body || "");
    return isiOS ? "sms:" + number + "&body=" + enc : "sms:" + number + "?body=" + enc;
  }

  function dayPouches(iso) {
    const log = state.dayLog || {};
    if (Object.prototype.hasOwnProperty.call(log, iso)) {
      const v = Number(log[iso].pouches);
      return isNaN(v) ? 0 : v;
    }
    /* Empty day = zero, never the old default consumption. */
    return 0;
  }

  function isWeekendApproach(d) {
    const dt = d ? new Date(d) : new Date();
    const day = dt.getDay();
    return day === 5 || day === 6;
  }

  function hoursSinceQuit() {
    const s = stats();
    return s.future ? 0 : s.ms / 3600000;
  }

  function planPromptNeeded() {
    return state.onboarded && !(state.ifThenPlans || []).length && !state.dismissed.planPrompt;
  }

  function leftoversNeeded() {
    return state.profile && state.profile.leftovers === "yes" && !state.dismissed.leftovers;
  }

  function upcomingParty() {
    const plans = (state.partyPlans || []).filter(function (p) { return !p.endedAt; });
    if (state.activeParty && !state.activeParty.endedAt) {
      return plans.find(function (p) { return p.id === state.activeParty.planId; }) || plans[0] || null;
    }
    return plans.sort(function (a, b) {
      return new Date(a.when || 0) - new Date(b.when || 0);
    })[0] || null;
  }

  function ensureInbox() {
    if (!state.onboarded) return;
    const hours = hoursSinceQuit();
    const day = new Date().getDay();
    let added = false;
    INBOX_TEMPLATES.forEach(function (t) {
      if (state.inboxSeen[t.id]) return;
      if (t.weekend) {
        if (!isWeekendApproach() || hours > t.toH) return;
        /* Only Friday afternoon / Saturday, and not every reload: once per weekend ISO week. */
        const weekId = "weekend-" + todayISO(new Date()).slice(0, 8) + (day === 6 ? "s" : "f");
        if (state.inboxSeen[weekId]) return;
        if (hours < 12) return;
        state.inbox.push({
          id: uid(),
          templateId: t.id,
          at: new Date().toISOString(),
          title: t.title,
          body: t.body,
          read: false
        });
        state.inboxSeen[weekId] = true;
        added = true;
        return;
      }
      if (hours >= t.fromH && hours < t.toH) {
        state.inbox.push({
          id: uid(),
          templateId: t.id,
          at: new Date().toISOString(),
          title: t.title,
          body: t.body,
          read: false
        });
        state.inboxSeen[t.id] = true;
        added = true;
      }
    });
    const times = (state.notifyPrefs && state.notifyPrefs.times) || [];
    const nowT = new Date();
    times.forEach(function (tm) {
      const key = "time-" + todayISO(nowT) + "-" + tm;
      if (state.inboxSeen[key]) return;
      if (!timeIsNear(tm, nowT, 30)) return;
      if (hours < 2) return;
      const st = stats();
      const sp = splitTime(st.ms);
      state.inbox.push({
        id: uid(),
        templateId: key,
        at: nowT.toISOString(),
        title: "Dit tidspunkt · " + tm,
        body:
          "Det er omkring " +
          tm +
          " — et af dine egne tidspunkter. Du er på dag " +
          sp.days +
          " og har sparet " +
          fmtKr(st.money, 0) +
          ". Hvis suget kommer, ligger planen klar.",
        read: false
      });
      state.inboxSeen[key] = true;
      added = true;
    });
    if (added) {
      save();
      const latest = state.inbox[state.inbox.length - 1];
      maybeNotify(latest);
    }
  }

  function unreadInbox() {
    return (state.inbox || []).filter(function (m) { return !m.read; }).length;
  }

  function reasonsSwipeHtml(cite) {
    const list = reasonsList();
    if (!list.length) return "";
    const cards = list
      .map(function (r, i) {
        return (
          '<div class="card reason-card reveal"><blockquote class="quote">“' +
          esc(r.text) +
          '”<cite>' +
          esc(cite || (list.length > 1 ? "Din grund · " + (i + 1) + " af " + list.length : "Din grund")) +
          "</cite></blockquote></div>"
        );
      })
      .join("");
    if (list.length === 1) return cards;
    return '<div class="reasons-swipe" aria-label="Mine grunde">' + cards + "</div>";
  }

  function planCardHtml(p, opts) {
    opts = opts || {};
    if (!p) return "";
    return (
      '<div class="card plan-card">' +
      (p.trigger ? '<div class="plan-trig">' + esc(p.trigger) + "</div>" : "") +
      '<div class="if">Hvis ' +
      esc((p.ifText || "").replace(/^Hvis\s+/i, "")) +
      '</div><div class="then">så ' +
      esc((p.thenText || "").replace(/^så\s+/i, "")) +
      "</div>" +
      (opts.actions
        ? '<div class="plan-actions"><button class="btn btn-ghost btn-sm" data-act="edit-plan" data-id="' +
          esc(p.id) +
          '">Rediger</button><button class="btn btn-ghost btn-sm" data-act="del-plan" data-id="' +
          esc(p.id) +
          '">Fjern</button></div>'
        : "") +
      "</div>"
    );
  }

  function sosPlanHtml(trigger) {
    const p = ifThenFor(trigger);
    if (!p) return "";
    return (
      '<div class="sos-plan" id="sos-plan"><div class="k">Din hvis-så-plan</div><p><strong>' +
      esc(p.ifText) +
      "</strong> " +
      esc(p.thenText) +
      "</p></div>"
    );
  }

  function compassCardHtml(opts) {
    opts = opts || {};
    const info = compassPhase();
    const ph = info.phase;
    const full = !!opts.full;
    const mid = '<span class="pill' + (ph.peak ? " coral" : "") + '">Dette er normalt</span>';
    const symptoms = (ph.symptoms || [])
      .map(function (sy) {
        const wantWave = /trang|bølge|sug/i.test(sy.name);
        return (
          '<div class="sym"><div class="dot"></div><div><strong>' +
          esc(sy.name) +
          "</strong><p>" +
          esc(sy.tip) +
          "</p>" +
          (wantWave
            ? '<button type="button" class="linkish" data-act="start-wave">Rid bølgen</button>'
            : "") +
          "</div></div>"
        );
      })
      .join("");
    const actions =
      '<div class="compass-actions">' +
      (ph.peak || info.hours < 168
        ? '<button class="btn btn-coral btn-sm" data-act="start-wave">Rid bølgen</button>'
        : "") +
      (full
        ? ""
        : '<button class="btn btn-ghost-mint btn-sm" data-act="goto-compass">Hele forløbet</button>') +
      "</div>";
    return (
      '<div class="card compass-card reveal' +
      (ph.peak ? " peak" : "") +
      '"><div class="card-kicker' +
      (ph.peak ? " coral" : " gold") +
      '">' +
      esc(ph.kicker) +
      " · " +
      mid +
      "</div><h3>" +
      esc(ph.title) +
      '</h3><p class="compass-lead">' +
      esc(ph.lead) +
      "</p>" +
      (full ? '<div class="sym-list">' + symptoms + "</div>" : "") +
      '<div class="honest-note' +
      (ph.peak ? "" : " mint") +
      '">' +
      esc(ph.honest) +
      "</div>" +
      (full
        ? compassDayStripHtml(info) +
          '<div class="normal-range"><strong>Hvornår føles jeg normal?</strong><p class="compass-lead">Der er ikke ét svar. De fleste kerne-symptomer letter over 2–4 uger. Nogle er klarere efter 2 uger, nogle først efter 2–3 måneder. Variationen er reel — appen lover ikke en finishlinje på en bestemt dag.</p></div>' +
          '<p class="fine-src">Kilder: Stoplinien, Helsenorge og Cleveland Clinic, med forbehold fra brugerforløb. Alle reagerer forskelligt. Det her er ikke medicinsk rådgivning. Ved alvorlig nedtrykthed, tal med en læge.</p>'
        : "") +
      actions +
      "</div>"
    );
  }

  function stoplinienCardHtml(mini) {
    const tel = STOPLINIEN.phoneTel;
    const sms = smsHref(STOPLINIEN.smsNumber, STOPLINIEN.smsBody);
    if (mini) {
      return (
        '<div class="card reveal"><div class="card-kicker mint">Stoplinien</div>' +
        '<p>Du behøver ikke klare det alene. Ring <a href="tel:' +
        tel +
        '">' +
        STOPLINIEN.phoneDisplay +
        "</a> · " +
        esc(STOPLINIEN.hours) +
        '.</p><button class="btn btn-ghost-mint btn-sm mt" data-act="goto-help">Mere hjælp</button></div>'
      );
    }
    return (
      '<div class="card"><div class="card-kicker mint">Stoplinien</div>' +
      '<div class="help-phone"><a href="tel:' +
      tel +
      '">' +
      STOPLINIEN.phoneDisplay +
      "</a></div>" +
      '<p class="help-hours">' +
      esc(STOPLINIEN.hours) +
      ". " +
      esc(STOPLINIEN.closed) +
      "</p>" +
      '<div class="help-actions">' +
      '<a class="btn btn-primary btn-block" href="tel:' +
      tel +
      '">Ring 80 31 31 31</a>' +
      '<a class="btn btn-ghost-mint btn-block" href="' +
      sms +
      '">SMS «Nikotinfri» til 1231</a>' +
      '<a class="btn btn-ghost btn-block" href="' +
      STOPLINIEN.url +
      '" target="_blank" rel="noopener">Åbn stoplinien.dk</a>' +
      "</div>" +
      '<p class="fine-src mt">' +
      esc(STOPLINIEN.smsNote) +
      " " +
      esc(STOPLINIEN.source) +
      ".</p></div>"
    );
  }


  /* ---------------- toasts & modals ---------------- */
  function toast(msg, kind) {
    if (kind === "warn") haptic("warn");
    else if (kind === "gold") haptic("done");
    else haptic("ok");
    const root = $("#toast-root");
    if (!root) return;
    const el = document.createElement("div");
    el.className = "toast" + (kind ? " " + kind : "");
    el.textContent = msg;
    root.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transition = "opacity 0.35s ease";
      setTimeout(() => el.remove(), 400);
    }, 3200);
  }

  function closeModal() {
    const root = $("#modal-root");
    if (root) root.innerHTML = "";
    if (breathStop) {
      /* don't kill breath from overlay unless on breath screen close */
    }
  }

  function openSheet(html) {
    const root = $("#modal-root");
    root.innerHTML =
      '<div class="overlay" data-act="close-modal"></div>' +
      '<div class="sheet-modal" role="dialog" aria-modal="true">' +
      '<div class="grab"></div>' +
      html +
      "</div>";
    const first = root.querySelector("input, textarea, button.btn-primary, button.btn-coral");
    if (first && first.focus) setTimeout(() => first.focus(), 80);
  }

  function openDialog(opts) {
    const root = $("#modal-root");
    root.innerHTML =
      '<div class="overlay" data-act="close-modal"></div>' +
      '<div class="dialog" role="alertdialog" aria-modal="true">' +
      "<h2>" +
      esc(opts.title) +
      "</h2>" +
      "<p>" +
      (opts.bodyHtml ? opts.bodyHtml : esc(opts.body || "")) +
      "</p>" +
      '<div class="dialog-actions">' +
      '<button class="btn btn-ghost" data-act="close-modal">' +
      esc(opts.cancel || "Annuller") +
      "</button>" +
      '<button class="btn ' +
      (opts.danger ? "btn-danger" : "btn-primary") +
      '" data-act="dialog-ok">' +
      esc(opts.ok || "OK") +
      "</button>" +
      "</div></div>";
    root._onOk = opts.onOk;
  }

  /* ---------------- live tick ---------------- */
  function updateLive() {
    if (!state.onboarded) return;
    const s = stats();
    const t = s.future ? splitTime(-s.rawMs) : splitTime(s.ms);
    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (!el) return;
      const v = String(val);
      if (el.textContent !== v) el.textContent = v;
    };
    setTxt("live-days", fmtNum(t.days, 0));
    setTxt("live-h", pad(t.hours));
    setTxt("live-m", pad(t.mins));
    setTxt("live-s", pad(t.secs));
    const unit = document.getElementById("live-unit");
    if (unit) unit.textContent = plural(t.days, "dag", "dage");
    const parts = moneyParts(s.money);
    const intEl = document.getElementById("money-int");
    const decEl = document.getElementById("money-dec");
    if (intEl) {
      const ni = parts.sign + parts.int;
      if (intEl.textContent !== ni) {
        intEl.textContent = ni;
        intEl.classList.remove("tick-flash");
        void intEl.offsetWidth;
        intEl.classList.add("tick-flash");
      }
    }
    if (decEl) {
      const nd = "," + parts.dec;
      if (decEl.textContent !== nd) decEl.textContent = nd;
    }
    const kicker = document.getElementById("hero-kicker");
    if (kicker) kicker.textContent = s.future ? "Starter om" : "Snusfri i";
  }

  function startTick() {
    if (tickTimer) clearInterval(tickTimer);
    updateLive();
    tickTimer = setInterval(updateLive, 250);
    // Achievements roughly once a minute
    setInterval(() => {
      if (state.onboarded) checkAchievements(false);
    }, 60000);
  }


  /* ---------------- render: onboarding ---------------- */

  function ensureDraft() {
    if (obDraft) return obDraft;
    const p = state.profile || defaultProfile();
    const reasons = reasonsList().map(function (r) { return r.text; });
    while (reasons.length < 3) reasons.push("");
    obDraft = {
      quitAt: p.quitAt || new Date().toISOString(),
      habitMode: p.habitMode || "cans",
      cansPerWeek: p.cansPerWeek || 7,
      pouchesPerDay: p.pouchesPerDay || 12,
      pricePerCan: p.pricePerCan || 55,
      pouchesPerCan: p.pouchesPerCan || 20,
      nicotineMg: p.nicotineMg || 8,
      motivation: p.motivation || "",
      quitMode: p.quitMode || "cold",
      taperWeeks: (state.taper && state.taper.weeks) || 6,
      taperStop: (state.taper && state.taper.stopDate) || "",
      reasons: reasons,
      pickedTriggers: (state.ifThenPlans || []).map(function (x) { return x.trigger; }).slice(0, 3),
      planDrafts: {},
      leftovers: p.leftovers || "",
      alcoholFirstWeeks: p.alcoholFirstWeeks || "little",
      buddyName: (state.buddy && state.buddy.name) || "",
      buddyPhone: (state.buddy && state.buddy.phone) || "",
      letter: (state.letter && state.letter.text) || ""
    };
    (state.ifThenPlans || []).forEach(function (pl) {
      obDraft.planDrafts[pl.trigger] = { ifText: pl.ifText, thenText: pl.thenText };
    });
    return obDraft;
  }
  function pullOnboardingForm() {
    const d = ensureDraft();
    const q = $("#ob-quit");
    if (q && q.value) d.quitAt = new Date(q.value).toISOString();
    const modeBtn = $(".seg button.on[data-mode]");
    if (modeBtn) d.habitMode = modeBtn.dataset.mode || d.habitMode;
    const qm = $(".seg button.on[data-quitmode]");
    if (qm) d.quitMode = qm.dataset.quitmode || d.quitMode;
    const val = function (id, def) {
      const el = document.getElementById(id);
      if (!el) return def;
      const n = parseNum(el.value);
      return isNaN(n) ? def : n;
    };
    d.cansPerWeek = val("ob-cans", d.cansPerWeek);
    d.pouchesPerDay = val("ob-pouches", d.pouchesPerDay);
    d.pricePerCan = val("ob-price", d.pricePerCan);
    d.pouchesPerCan = val("ob-ppc", d.pouchesPerCan);
    d.nicotineMg = val("ob-nic", d.nicotineMg);
    d.taperWeeks = val("ob-taper-weeks", d.taperWeeks);
    const ts = $("#ob-taper-stop");
    if (ts) d.taperStop = ts.value || d.taperStop;
    const reasons = [];
    for (let i = 0; i < 5; i++) {
      const el = document.getElementById("ob-reason-" + i);
      if (el && el.value.trim()) reasons.push(el.value.trim());
    }
    if (reasons.length) {
      d.reasons = reasons;
      while (d.reasons.length < 3) d.reasons.push("");
    }
    const mot = $("#ob-motivation");
    if (mot) d.motivation = mot.value;
    const left = $(".seg button.on[data-leftovers]");
    if (left) d.leftovers = left.dataset.leftovers;
    const alc = $(".seg button.on[data-alc]");
    if (alc) d.alcoholFirstWeeks = alc.dataset.alc;
    const bn = $("#ob-buddy-name");
    if (bn) d.buddyName = bn.value.trim();
    const lt = $("#ob-letter");
    if (lt) d.letter = lt.value;
    const bp = $("#ob-buddy-phone");
    if (bp) d.buddyPhone = bp.value.trim();
    (d.pickedTriggers || []).forEach(function (t) {
      const iff = document.getElementById("ob-if-" + trigKey(t));
      const th = document.getElementById("ob-then-" + trigKey(t));
      if (iff || th) {
        d.planDrafts[t] = {
          ifText: iff ? iff.value.trim() : (d.planDrafts[t] && d.planDrafts[t].ifText) || "",
          thenText: th ? th.value.trim() : (d.planDrafts[t] && d.planDrafts[t].thenText) || ""
        };
      }
    });
    return d;
  }

  function renderOnboarding() {
    const wrap = $("#onboarding");
    const main = $("#main");
    const tab = $("#tabbar");
    const fab = $("#fab-sos");
    if (state.onboarded) {
      wrap.classList.add("hidden");
      main.classList.remove("hidden");
      tab.classList.remove("hidden");
      return;
    }
    main.classList.add("hidden");
    tab.classList.add("hidden");
    fab.classList.add("hidden");
    wrap.classList.remove("hidden");
    const d = ensureDraft();
    const step = obStep;
    const dots = [0, 1, 2, 3, 4, 5]
      .map(function (i) { return "<i class=\"" + (i <= step ? "on" : "") + "\"></i>"; })
      .join("");
    let body = "";
    if (step === 0) {
      body =
        '<div class="ob-mark"><img src="icons/icon-192.png" alt="Snusfri"></div>' +
        '<h1 class="ob-title">Klar til at<br>være fri?</h1>' +
        '<p class="ob-lead">Snusfri hjælper dig med at følge tiden, pengene og helbredet — og holder dig i hånden, når trangen kommer. Skoven i billedet vokser med dine dage. Først laver vi en plan. Dine data bliver kun på denne enhed. Ingen konto.</p>' +
        '<div class="ob-actions">' +
        '<button class="btn btn-primary btn-block" data-act="ob-next">Kom i gang</button>' +
        '<button class="ob-skip" data-act="ob-demo">Prøv med et eksempel</button>' +
        "</div>";
    } else if (step === 1) {
      const cold = d.quitMode !== "taper";
      body =
        '<h1 class="ob-title">Hvornår stopper du?</h1>' +
        '<p class="ob-lead">Sæt dato og tid for sidste pose — eller det øjeblik, du stopper. At stoppe brat har ifølge forskningen bedst effekt, men nedtrapning er et valg, ikke et krav.</p>' +
        '<div class="field"><label for="ob-quit">Dato og tid</label>' +
        '<input id="ob-quit" type="datetime-local" value="' +
        esc(toLocalInput(d.quitAt)) +
        '"></div>' +
        '<button class="btn btn-ghost-mint btn-sm" data-act="ob-now">Brug lige nu</button>' +
        '<div class="field mt-2"><label>Hvordan vil du stoppe?</label></div>' +
        '<div class="seg">' +
        '<button type="button" data-act="ob-quitmode" data-quitmode="cold" class="' +
        (cold ? "on" : "") +
        '">Kold tyrker</button>' +
        '<button type="button" data-act="ob-quitmode" data-quitmode="taper" class="' +
        (cold ? "" : "on") +
        '">Nedtrapning</button></div>' +
        (cold
          ? '<p class="hint">Du stopper nu, og tælleren går i gang.</p>'
          : '<div class="row2"><div class="field"><label>Varighed (uger)</label>' +
            '<div class="stepper"><button type="button" data-act="step" data-dir="-1" data-target="ob-taper-weeks">−</button>' +
            '<input id="ob-taper-weeks" inputmode="numeric" value="' +
            esc(String(d.taperWeeks || 6)) +
            '">' +
            '<button type="button" data-act="step" data-dir="1" data-target="ob-taper-weeks">+</button></div></div>' +
            '<div class="field"><label>Fast stopdato</label>' +
            '<input id="ob-taper-stop" class="input" type="date" value="' +
            esc(d.taperStop || "") +
            '"></div></div>' +
            '<p class="hint">Nedtrapning skal have en slutdato. Undervejs må styrken falde, men antallet af poser bør ikke stige.</p>') +
        '<div class="ob-actions">' +
        '<button class="btn btn-primary btn-block" data-act="ob-next">Fortsæt</button>' +
        '<button class="ob-skip" data-act="ob-back">Tilbage</button>' +
        "</div>";
    } else if (step === 2) {
      const cansOn = d.habitMode !== "pouches";
      body =
        '<h1 class="ob-title">Hvor meget brugte du?</h1>' +
        '<p class="ob-lead">Så kan vi tælle penge, poser og nikotin, du undgår. Estimat er fint — finjustér i indstillingerne.</p>' +
        '<div class="seg">' +
        '<button type="button" data-act="ob-mode" data-mode="cans" class="' +
        (cansOn ? "on" : "") +
        '">Dåser pr. uge</button>' +
        '<button type="button" data-act="ob-mode" data-mode="pouches" class="' +
        (cansOn ? "" : "on") +
        '">Poser pr. dag</button>' +
        "</div>" +
        '<div class="field" id="ob-cans-field" style="' +
        (cansOn ? "" : "display:none") +
        '"><label>Dåser pr. uge</label>' +
        '<div class="stepper"><button type="button" data-act="step" data-dir="-1" data-target="ob-cans">−</button>' +
        '<input id="ob-cans" inputmode="decimal" value="' +
        esc(String(d.cansPerWeek)) +
        '">' +
        '<button type="button" data-act="step" data-dir="1" data-target="ob-cans">+</button></div></div>' +
        '<div class="field" id="ob-pouches-field" style="' +
        (cansOn ? "display:none" : "") +
        '"><label>Poser pr. dag</label>' +
        '<div class="stepper"><button type="button" data-act="step" data-dir="-1" data-target="ob-pouches">−</button>' +
        '<input id="ob-pouches" inputmode="decimal" value="' +
        esc(String(d.pouchesPerDay)) +
        '">' +
        '<button type="button" data-act="step" data-dir="1" data-target="ob-pouches">+</button></div></div>' +
        '<div class="row2">' +
        '<div class="field"><label>Pris pr. dåse</label>' +
        '<div class="stepper"><button type="button" data-act="step" data-dir="-1" data-target="ob-price" data-amt="1">−</button>' +
        '<input id="ob-price" inputmode="decimal" value="' +
        esc(String(d.pricePerCan)) +
        '">' +
        '<button type="button" data-act="step" data-dir="1" data-target="ob-price" data-amt="1">+</button></div>' +
        '<p class="hint">kroner</p></div>' +
        '<div class="field"><label>Poser pr. dåse</label>' +
        '<div class="stepper"><button type="button" data-act="step" data-dir="-1" data-target="ob-ppc">−</button>' +
        '<input id="ob-ppc" inputmode="decimal" value="' +
        esc(String(d.pouchesPerCan)) +
        '">' +
        '<button type="button" data-act="step" data-dir="1" data-target="ob-ppc">+</button></div></div>' +
        "</div>" +
        '<div class="field"><label>Nikotin pr. pose</label>' +
        '<div class="stepper"><button type="button" data-act="step" data-dir="-1" data-target="ob-nic">−</button>' +
        '<input id="ob-nic" inputmode="decimal" value="' +
        esc(String(d.nicotineMg)) +
        '">' +
        '<button type="button" data-act="step" data-dir="1" data-target="ob-nic">+</button></div>' +
        '<p class="hint">milligram — står ofte på dåsen</p></div>' +
        '<div class="ob-actions">' +
        '<button class="btn btn-primary btn-block" data-act="ob-next">Fortsæt</button>' +
        '<button class="ob-skip" data-act="ob-back">Tilbage</button>' +
        "</div>";
    } else if (step === 3) {
      const rs = (d.reasons || ["", "", ""]).slice();
      while (rs.length < 5) rs.push("");
      const fields = rs
        .map(function (t, i) {
          return (
            '<div class="field"><label for="ob-reason-' +
            i +
            '">Grund ' +
            (i + 1) +
            (i < 1 ? "" : i < 3 ? " (gerne)" : " (valgfri)") +
            "</label>" +
            '<textarea id="ob-reason-' +
            i +
            '" class="input" maxlength="220" placeholder="' +
            (i === 0 ? "Fx: Jeg vil være til stede for dem, jeg holder af." : "") +
            '" style="min-height:4.2rem">' +
            esc(t) +
            "</textarea></div>"
          );
        })
        .join("");
      body =
        '<h1 class="ob-title">Hvorfor vil du stoppe?</h1>' +
        '<p class="ob-lead">Skriv det med dine egne ord. Når motivationen daler, vises grundene her — på SOS, i «bare én»-værnet, og på svage dage.</p>' +
        fields +
        '<div class="ob-actions">' +
        '<button class="btn btn-primary btn-block" data-act="ob-next">Fortsæt</button>' +
        '<button class="ob-skip" data-act="ob-back">Tilbage</button>' +
        "</div>";
    } else if (step === 4) {
      const picked = d.pickedTriggers || [];
      const chips = TRIGGERS.filter(function (t) { return t !== "Andet"; })
        .map(function (t) {
          return (
            '<button type="button" class="chip' +
            (picked.indexOf(t) >= 0 ? " on" : "") +
            '" data-act="ob-pick-trig" data-val="' +
            esc(t) +
            '">' +
            esc(t) +
            "</button>"
          );
        })
        .join("");
      const plans = picked
        .map(function (t) {
          const tmpl = templateFor(t);
          const dr = d.planDrafts[t] || { ifText: tmpl.ifText, thenText: tmpl.thenText };
          return (
            '<div class="card mt"><div class="plan-trig">' +
            esc(t) +
            '</div><div class="field"><label>Hvis</label>' +
            '<textarea id="ob-if-' +
            esc(trigKey(t)) +
            '" class="input" maxlength="200" style="min-height:3.6rem">' +
            esc(dr.ifText) +
            '</textarea></div><div class="field" style="margin-bottom:0"><label>Så</label>' +
            '<textarea id="ob-then-' +
            esc(trigKey(t)) +
            '" class="input" maxlength="200" style="min-height:3.6rem">' +
            esc(dr.thenText) +
            "</textarea></div></div>"
          );
        })
        .join("");
      body =
        '<h1 class="ob-title">Dine største triggere</h1>' +
        '<p class="ob-lead">Vælg op til tre situationer, og bind hver til en konkret handling. Planen skal ligge klar, før suget kommer.</p>' +
        '<div class="chips">' +
        chips +
        "</div>" +
        plans +
        '<div class="ob-actions">' +
        '<button class="btn btn-primary btn-block" data-act="ob-next">' +
        (picked.length ? "Fortsæt" : "Fortsæt uden plan") +
        "</button>" +
        '<button class="ob-skip" data-act="ob-back">Tilbage</button>' +
        "</div>";
    } else {
      const r = rates(d);
      body =
        '<h1 class="ob-title">Et par ting endnu</h1>' +
        '<p class="ob-lead">De første 72 timer kan være hårde. For de fleste topper det dag 2–3. Det er midlertidigt, og det er normalt.</p>' +
        '<div class="field"><label>Ligger der stadig poser i skuffen?</label></div>' +
        '<div class="seg">' +
        '<button type="button" data-act="ob-leftovers" data-leftovers="no" class="' +
        (d.leftovers === "no" ? "on" : "") +
        '">Nej, de er væk</button>' +
        '<button type="button" data-act="ob-leftovers" data-leftovers="yes" class="' +
        (d.leftovers === "yes" ? "on" : "") +
        '">Ja, de ligger der</button></div>' +
        (d.leftovers === "yes"
          ? '<div class="callout coral">Rester i skuffen er en klassisk fælde. Hvis du kan, så smid dem ud nu — før suget kommer.</div>'
          : "") +
        '<div class="field mt-2"><label>Alkohol den første tid?</label></div>' +
        '<div class="seg">' +
        '<button type="button" data-act="ob-alc" data-alc="none" class="' +
        (d.alcoholFirstWeeks === "none" ? "on" : "") +
        '">Ingen</button>' +
        '<button type="button" data-act="ob-alc" data-alc="little" class="' +
        (d.alcoholFirstWeeks === "little" ? "on" : "") +
        '">Så lidt som muligt</button>' +
        '<button type="button" data-act="ob-alc" data-alc="yes" class="' +
        (d.alcoholFirstWeeks === "yes" ? "on" : "") +
        '">Som vanligt</button></div>' +
        '<p class="hint">Fest med alkohol er den hyppigste tilbagefaldssituation. Sundhedsmyndighederne anbefaler at drikke lidt eller ingenting den første tid — og at lave en plan, mens du er ædru.</p>' +
        '<div class="field mt-2"><label>En makker (valgfrit)</label>' +
        '<input id="ob-buddy-name" class="input" maxlength="60" placeholder="Navn" value="' +
        esc(d.buddyName || "") +
        '">' +
        '<input id="ob-buddy-phone" class="input mt" maxlength="20" inputmode="tel" placeholder="Telefon" value="' +
        esc(d.buddyPhone || "") +
        '"></div>' +
        '<div class="card">' +
        '<div class="card-kicker gold">Sådan ser det ud</div>' +
        "<p>På et år sparer du cirka <strong>" +
        esc(fmtKr(r.costPerDay * 365, 0)) +
        "</strong> — og undgår omkring <strong>" +
        esc(fmtNum(r.pouchesPerDay * 365, 0)) +
        " poser</strong>.</p></div>" +
        '<div class="card mt"><div class="card-kicker mint">Stoplinien</div><p>Hjælp er normalt. Ring <strong>80 31 31 31</strong> (man–tors 10–20, fre 10–16), eller sms «Nikotinfri» til 1231.</p></div>' +
        '<div class="field mt-2"><label for="ob-letter">Et brev til dig selv om 30 dage (valgfrit)</label>' +
        '<textarea id="ob-letter" class="input" maxlength="800" style="min-height:5.5rem" placeholder="Hvad vil du gerne huske, når der er gået en måned?">' +
        esc(d.letter || "") +
        "</textarea>" +
        '<p class="hint">Det låses, indtil dag 30. Så læser du det, du mente, da du startede.</p></div>' +
        '<div class="ob-actions">' +
        '<button class="btn btn-primary btn-block" data-act="ob-finish">Start Snusfri</button>' +
        '<button class="ob-skip" data-act="ob-back">Tilbage</button>' +
        "</div>";
    }
    wrap.innerHTML =
      '<div class="ob-bg"></div><div class="ob-inner"><div class="ob-progress">' +
      dots +
      "</div>" +
      body +
      "</div>";
  }

  function finishOnboarding() {
    const d = pullOnboardingForm();
    if (!d.quitAt) d.quitAt = new Date().toISOString();
    if (d.habitMode === "pouches" && !(d.pouchesPerDay > 0)) {
      toast("Angiv hvor mange poser du brugte om dagen.", "warn");
      return;
    }
    if (d.habitMode !== "pouches" && !(d.cansPerWeek > 0)) {
      toast("Angiv hvor mange dåser du brugte om ugen.", "warn");
      return;
    }
    const reasons = (d.reasons || []).map(function (t) { return (t || "").trim(); }).filter(Boolean);
    if (!reasons.length && (d.motivation || "").trim()) reasons.push(d.motivation.trim());
    if (!reasons.length) {
      toast("Skriv mindst én grund — med dine egne ord.", "warn");
      obStep = 3;
      renderOnboarding();
      return;
    }
    if (d.quitMode === "taper" && !d.taperStop) {
      toast("Nedtrapning skal have en fast stopdato.", "warn");
      obStep = 1;
      renderOnboarding();
      return;
    }
    state.profile = Object.assign(defaultProfile(), {
      quitAt: d.quitAt,
      habitMode: d.habitMode,
      cansPerWeek: d.cansPerWeek,
      pouchesPerDay: d.pouchesPerDay,
      pricePerCan: d.pricePerCan,
      pouchesPerCan: d.pouchesPerCan,
      nicotineMg: d.nicotineMg,
      motivation: reasons[0],
      quitMode: d.quitMode || "cold",
      leftovers: d.leftovers || "",
      alcoholFirstWeeks: d.alcoholFirstWeeks || ""
    });
    state.reasons = reasons.map(function (t) { return { id: uid(), text: t }; });
    const plans = [];
    (d.pickedTriggers || []).forEach(function (t) {
      const dr = d.planDrafts[t] || templateFor(t);
      const iff = (dr.ifText || "").trim() || templateFor(t).ifText;
      const th = (dr.thenText || "").trim() || templateFor(t).thenText;
      plans.push({ id: uid(), trigger: t, ifText: iff, thenText: th, createdAt: new Date().toISOString() });
    });
    if (plans.length) state.ifThenPlans = (state.ifThenPlans || []).concat(plans);
    if (d.buddyName || d.buddyPhone) {
      state.buddy = { name: d.buddyName || "", phone: d.buddyPhone || "", note: "" };
    }
    if ((d.letter || "").trim()) {
      state.letter = {
        text: d.letter.trim(),
        writtenAt: new Date().toISOString(),
        openedAt: null
      };
    }
    if (d.quitMode === "taper") {
      const startP = d.habitMode === "pouches" ? d.pouchesPerDay : (d.cansPerWeek / 7) * d.pouchesPerCan;
      state.taper = Object.assign(state.taper || {}, {
        enabled: true,
        startPouches: Math.round(startP * 2) / 2,
        targetPouches: 0,
        startDate: todayISO(new Date(d.quitAt)),
        stopDate: d.taperStop,
        weeks: Math.max(1, d.taperWeeks || 6),
        strengthMg: d.nicotineMg,
        logs: (state.taper && state.taper.logs) || {},
        strengthLogs: (state.taper && state.taper.strengthLogs) || {}
      });
    }
    state.onboarded = true;
    save();
    checkAchievements(true);
    ensureInbox();
    obDraft = null;
    obStep = 0;
    view = "home";
    render();
    toast("Velkommen. Du er i gang. De første 72 timer kan være hårde — det er normalt.");
  }

  /* ---------------- render: home ---------------- */
  function nextMilestone(s) {
    const sec = s.ms / 1000;
    for (let i = 0; i < MILESTONES.length; i++) {
      if (sec < MILESTONES[i].after) return { m: MILESTONES[i], prev: i ? MILESTONES[i - 1].after : 0 };
    }
    return { m: null, prev: MILESTONES[MILESTONES.length - 1].after };
  }

  /* ---------------- v9 helpers ---------------- */
  let homeMoneyOpen = false;
  let compassPeekDay = null;

  function finiteNum(n, fallback) {
    const x = Number(n);
    return isFinite(x) ? x : (fallback == null ? 0 : fallback);
  }

  function calendarDaysBetween(a, b) {
    const a0 = startOfDay(a);
    const b0 = startOfDay(b);
    const aUTC = Date.UTC(a0.getFullYear(), a0.getMonth(), a0.getDate());
    const bUTC = Date.UTC(b0.getFullYear(), b0.getMonth(), b0.getDate());
    return Math.round((bUTC - aUTC) / 86400000);
  }

  function haptic(kind) {
    try {
      if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!navigator.vibrate) return;
      if (kind === "start") navigator.vibrate([8, 30, 12]);
      else if (kind === "done") navigator.vibrate([16, 40, 24]);
      else if (kind === "warn") navigator.vibrate([24, 40, 24]);
      else navigator.vibrate(12);
    } catch (e) {}
  }

  function afterPaint(fn) {
    if (typeof requestIdleCallback === "function") requestIdleCallback(fn, { timeout: 900 });
    else setTimeout(fn, 0);
  }

  function hideBoot() {
    const b = document.getElementById("boot");
    if (!b) return;
    b.classList.add("off");
    setTimeout(function () {
      if (b && b.parentNode) b.parentNode.removeChild(b);
    }, 320);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        toast("Kopieret.");
        haptic("ok");
      }).catch(function () {
        toast(text);
      });
    } else {
      toast("Kopiér: " + text);
    }
  }

  function shareStatus(opts) {
    opts = opts || {};
    const s = stats();
    const t = splitTime(s.ms);
    const days = t.days + " " + plural(t.days, "dag", "dage");
    let text;
    if (s.future) {
      text = "Jeg stopper med snus " + fmtDate(state.profile.quitAt) + ".";
    } else if (opts.buddy) {
      const name = (state.buddy && state.buddy.name) || "";
      text =
        (name ? "Hej " + name + ". " : "") +
        (opts.party
          ? "Jeg er til fest i aften og er snusfri i " + days + ". Skriv til mig senere, ok?"
          : "Jeg er snusfri i " + days + " og har sparet " + fmtKr(s.money, 0) + ". Skriv gerne, hvis jeg har brug for det.");
    } else {
      text = "Snusfri i " + days + " · " + fmtKr(s.money, 0) + " sparet.";
    }
    if (navigator.share) {
      navigator.share({ title: "Snusfri", text: text }).catch(function () {
        copyText(text);
      });
    } else {
      copyText(text);
    }
  }

  function timeIsNear(hhmm, now, windowMin) {
    const m = String(hhmm).match(/^(\d{1,2})\s*[.:]\s*(\d{2})$/);
    if (!m) return false;
    const h = Number(m[1]);
    const min = Number(m[2]);
    if (h > 23 || min > 59) return false;
    const target = h * 60 + min;
    const cur = now.getHours() * 60 + now.getMinutes();
    let d = Math.abs(cur - target);
    if (d > 12 * 60) d = 24 * 60 - d;
    return d <= (windowMin == null ? 30 : windowMin);
  }

  function maybeNotify(msg) {
    try {
      if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
      const s = stats();
      const t = splitTime(s.ms);
      const title =
        "Snusfri · " +
        t.days +
        " " +
        plural(t.days, "dag", "dage") +
        " · " +
        fmtKr(s.money, 0);
      const body = (msg && (msg.title + (msg.body ? " — " + msg.body : ""))) || title;
      const opts = {
        body: body,
        tag: "snusfri-" + ((msg && (msg.templateId || msg.id)) || "now"),
        icon: "icons/apple-touch-icon.png",
        lang: "da"
      };
      if (navigator.serviceWorker && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready
          .then(function (reg) {
            if (reg && reg.showNotification) return reg.showNotification(title, opts);
            return new Notification(title, opts);
          })
          .catch(function () {
            try { new Notification(title, opts); } catch (e2) {}
          });
      } else {
        new Notification(title, opts);
      }
    } catch (e) {}
  }

  function nowHelpHtml() {
    return (
      '<div class="now-help" role="group" aria-label="Hvad hjælper nu">' +
        '<button type="button" class="now-act" data-act="start-wave" aria-label="Rid bølgen, tre til fire minutter">' +
          '<span class="now-lab">Rid bølgen</span>' +
          '<span class="now-sub">3–4 min.</span>' +
        "</button>" +
        '<button type="button" class="now-act" data-act="bare-en" aria-label="Bare én pose? Et roligt værn">' +
          '<span class="now-lab">Bare én pose?</span>' +
          '<span class="now-sub">Hold linjen her</span>' +
        "</button>" +
        '<button type="button" class="now-act sos" data-act="sos" aria-label="Trangs-SOS">' +
          '<span class="now-lab">Trang nu</span>' +
          '<span class="now-sub">SOS</span>' +
        "</button>" +
      "</div>"
    );
  }

  function moneyCompactHtml(s) {
    const parts = moneyParts(s.money);
    const digits = String(parts.int).replace(/\./g, "").length;
    const big = digits >= 7 ? " huge" : digits >= 5 ? " big" : "";
    return (
      '<div class="card money-compact reveal">' +
        '<button type="button" class="money-hit" data-act="toggle-money" aria-expanded="' +
        (homeMoneyOpen ? "true" : "false") +
        '" aria-label="Penge sparet, ' +
        esc(parts.sign + parts.int + "," + parts.dec + " kroner") +
        ". " +
        (homeMoneyOpen ? "Skjul detaljer" : "Vis detaljer") +
        '">' +
        '<div class="card-kicker gold">Penge sparet</div>' +
        '<div class="money-row' +
        big +
        '">' +
        '<span class="money-int" id="money-int">' +
        parts.sign +
        parts.int +
        '</span><span class="money-dec" id="money-dec">,' +
        parts.dec +
        '</span><span class="money-cur">kr</span>' +
        '<span class="money-chev" aria-hidden="true">' +
        (homeMoneyOpen ? "▴" : "▾") +
        "</span></div>" +
        '<div class="money-brief" id="money-brief">' +
        esc(fmtPouches(s.pouches)) +
        " " +
        plural(Math.floor(finiteNum(s.pouches)), "pose", "poser") +
        " · " +
        esc(fmtNic(s.nicotine)) +
        "</div>" +
        moneyConcreteHtml(s.money) +
        "</button>" +
        (homeMoneyOpen
          ? '<div class="money-details" id="money-details">' +
            '<div class="mini-stats">' +
            '<div class="mini-stat gold"><div class="v">' +
            esc(fmtKr(s.per.year, 0)) +
            '</div><div class="l">På et år</div></div>' +
            '<div class="mini-stat mint"><div class="v">' +
            esc(fmtNum(Math.floor(finiteNum(s.cans)), 0)) +
            '</div><div class="l">' +
            plural(Math.floor(finiteNum(s.cans)), "dåse undgået", "dåser undgået") +
            "</div></div></div>" +
            '<div class="period-grid">' +
            periodCell(s.per.day, "pr. dag") +
            periodCell(s.per.week, "pr. uge") +
            periodCell(s.per.month, "pr. måned") +
            periodCell(s.per.year, "pr. år") +
            "</div>" +
            '<div class="mini-stats" style="margin-top:0.7rem">' +
            '<div class="mini-stat"><div class="v">' +
            esc(fmtPouches(s.pouches)) +
            '</div><div class="l">poser undgået</div></div>' +
            '<div class="mini-stat sky"><div class="v">' +
            esc(fmtNic(s.nicotine)) +
            '</div><div class="l">nikotin undgået</div></div>' +
            '<div class="mini-stat lav" style="grid-column:1/-1"><div class="v">' +
            esc(fmtTimeWon(s.minutes)) +
            '</div><div class="l">tid vundet · anslået 5 min. pr. pose</div></div>' +
            "</div>" +
            "</div>"
          : "") +
        "</div>"
    );
  }

  function phaseForHours(hours) {
    let phase = COMPASS[0];
    for (let i = 0; i < COMPASS.length; i++) {
      if (hours >= COMPASS[i].fromH && hours < COMPASS[i].toH) {
        phase = COMPASS[i];
        break;
      }
      if (hours >= COMPASS[i].fromH) phase = COMPASS[i];
    }
    return phase;
  }

  function compassHomeHtml(info) {
    if (info.future) {
      return (
        '<div class="card compass-card reveal">' +
        '<div class="card-kicker gold">Før du starter</div>' +
        "<h3>De første 72 timer topper dag 2–3</h3>" +
        '<div class="honest-note mint">Det er midlertidigt, og det er normalt. Lav planen nu — før suget kommer.</div>' +
        '<div class="compass-actions">' +
        '<button type="button" class="btn btn-ghost-mint btn-sm" data-act="goto-compass">Se forløbet</button>' +
        '<button type="button" class="btn btn-ghost-mint btn-sm" data-act="goto-plans">Hvis-så-planer</button>' +
        "</div></div>"
      );
    }
    const ph = info.phase;
    return (
      '<div class="card compass-card reveal' +
      (ph.peak ? " peak" : "") +
      '"><div class="card-kicker' +
      (ph.peak ? " coral" : " gold") +
      '">' +
      esc(ph.kicker) +
      ' · <span class="pill' +
      (ph.peak ? " coral" : "") +
      '">Dette er normalt</span></div><h3>' +
      esc(ph.title) +
      '</h3><div class="honest-note' +
      (ph.peak ? "" : " mint") +
      '">' +
      esc(ph.honest) +
      '</div><div class="compass-actions">' +
      (ph.peak || info.hours < 168
        ? '<button type="button" class="btn btn-coral btn-sm" data-act="start-wave">Rid bølgen</button>'
        : "") +
      '<button type="button" class="btn btn-ghost-mint btn-sm" data-act="goto-compass">Hele forløbet</button>' +
      "</div></div>"
    );
  }

  function day28Html(s, opts) {
    opts = opts || {};
    if (!s || s.future) return "";
    if (s.days < 21 || s.days >= 36) return "";
    if (!opts.force && state.dismissed && state.dismissed.d28 && !opts.health) return "";
    const reached = s.days >= 28;
    const left = 28 - s.days;
    return (
      '<div class="card goal28 reveal">' +
      '<div class="card-kicker' +
      (reached ? " mint" : " gold") +
      '">28 dage' +
      (reached ? " · delmål" : "") +
      "</div><strong>" +
      (reached
        ? "Du har været snusfri i 28 dage."
        : "28 dage om " + (left < 1 ? "under et døgn" : fmtEta(left * 86400))) +
      "</strong><p>28 dage uden røg femdobler ifølge Helsenorge chancen for at holde op for godt — den samme dokumentation findes ikke for snus. Tag det som et delmål, ikke som et bevist snus-tal.</p>" +
      (opts.health
        ? ""
        : '<button type="button" class="btn btn-ghost btn-sm mt" data-act="dismiss-d28">Luk</button>') +
      "</div>"
    );
  }

  function compassDayStripHtml(info) {
    if (!info || info.future) return "";
    const current = Math.max(1, Math.min(14, Math.ceil(info.hours / 24) || 1));
    const past14 = info.hours >= 14 * 24;
    const peek = compassPeekDay || (past14 ? 14 : current);
    let cells = "";
    for (let i = 1; i <= 14; i++) {
      const peak = i === 2 || i === 3;
      const cls = [
        i === peek ? "on" : "",
        i <= current || past14 ? "past" : "",
        peak ? "peak" : "",
        i === current && !past14 ? "today" : ""
      ]
        .filter(Boolean)
        .join(" ");
      cells +=
        '<button type="button" class="cday ' +
        cls +
        '" data-act="compass-day" data-day="' +
        i +
        '" aria-pressed="' +
        (i === peek) +
        '" aria-current="' +
        (i === current && !past14 ? "true" : "false") +
        '" aria-label="Dag ' +
        i +
        (peak ? ", toppen for de fleste" : "") +
        (i === current && !past14 ? ", i dag" : "") +
        '">' +
        i +
        "</button>";
    }
    const hoursForPeek = (peek - 0.45) * 24;
    const ph = phaseForHours(Math.max(0, hoursForPeek));
    const peekNote =
      peek === current && !past14
        ? ""
        : '<p class="compass-peek"><strong>Dag ' +
          peek +
          ".</strong> " +
          esc(ph.title) +
          " " +
          esc(ph.honest) +
          "</p>";
    return (
      '<div class="compass-days-wrap">' +
      '<div class="card-kicker">De første 14 dage</div>' +
      '<div class="compass-days" role="list">' +
      cells +
      '</div><p class="hint">Dag 2–3 er toppen for de fleste. Tryk på en dag for at se, hvad der er forventeligt — et spænd, ikke et løfte.</p>' +
      peekNote +
      "</div>"
    );
  }

  function contextualNowHtml(info) {
    const s = info.s;
    const hour = new Date().getHours();
    function wrap(inner) {
      return '<div class="card now-card reveal">' + inner + "</div>";
    }
    function cta(title, kicker, body, act, label, extra, id) {
      return wrap(
        '<div class="checkin-cta"><div class="now-card-body"><div class="card-kicker' +
          (extra || "") +
          '">' +
          esc(kicker) +
          "</div><strong>" +
          esc(title) +
          "</strong><p>" +
          body +
          '</p></div><button type="button" class="btn btn-ghost-mint btn-sm" data-act="' +
          act +
          '"' +
          (id ? ' data-id="' + esc(id) + '"' : "") +
          ">" +
          esc(label) +
          "</button></div>"
      );
    }

    if (state.activeDelay && state.activeDelay.end) {
      const endAt = new Date(state.activeDelay.end).getTime();
      if (isFinite(endAt) && !state.activeDelay.done && Date.now() < endAt) {
        return cta(
          "Ventetiden kører stadig",
          "10 minutter",
          "Timere kører, mens appen er åben. Du beslutter, når tiden er gået.",
          "tool-delay",
          "Åbn uret",
          " gold"
        );
      }
      if (isFinite(endAt) && (state.activeDelay.done || Date.now() >= endAt)) {
        return cta(
          "De 10 minutter er gået",
          "Vent",
          "Hvordan er trangen nu?",
          "tool-delay",
          "Se",
          " mint"
        );
      }
    }
    const ls = letterState();
    if (ls.pending) {
      return cta(
        "Brevet til dig er klar",
        "Dag 30",
        "Du skrev det, da du startede. Det er dine egne ord.",
        "goto-letter",
        "Åbn brevet",
        " gold"
      );
    }
    const dayN = new Date().getDay();
    const rk = isoWeekKey(new Date());
    if ((dayN === 0 || dayN === 1) && !(state.recapSeen && state.recapSeen[rk])) {
      const rd = recapData();
      if (rd.cravings + rd.checkins + rd.slips > 0) {
        return cta(
          "Ugens overblik ligger klar",
          "Ugen",
          "Dage, penge og det, dine log viser — med forbehold for små tal.",
          "goto-recap",
          "Se",
          " mint"
        );
      }
    }

    if (state.activeParty && !state.activeParty.endedAt) {
      const party = upcomingParty();
      return cta(
        "Fest-mode er klar",
        "Fest-mode",
        "Få knapper, høj kontrast. Planen du lavede, mens du var ædru.",
        "party-start",
        "Åbn",
        " gold",
        (state.activeParty && state.activeParty.planId) || (party && party.id) || ""
      );
    }
    if (state.activeParty && state.activeParty.endedAt && state.activeParty.held && !state.dismissed.partyHeld) {
      return wrap(
        '<div class="card-kicker mint">Du holdt fest-planen</div><p>Du kom igennem. Det er værd at mærke. Planen ligger klar til næste gang.</p>' +
          '<button type="button" class="btn btn-ghost-mint btn-sm mt" data-act="dismiss-party-held">Luk</button>'
      );
    }
    if (leftoversNeeded()) {
      return wrap(
        '<div class="callout coral" style="margin:0">Der ligger stadig poser. Hvis du kan, så smid dem ud nu — før suget kommer. En pose i skuffen er ikke et neutralt eksperiment.</div>' +
          '<button type="button" class="btn btn-ghost btn-sm mt" data-act="dismiss-leftovers">Jeg har smidt dem ud</button>'
      );
    }
    if (
      !info.future &&
      hour >= 5 &&
      hour < 11 &&
      info.hours < 720 &&
      !ifThenFor("Morgenen") &&
      !state.dismissed.morningPlan
    ) {
      return wrap(
        '<div class="checkin-cta"><div class="now-card-body"><div class="card-kicker">Morgenen</div><strong>Første pose inden 30 minutter</strong><p>Omkring 80 % af tunge snusbrugere i et skandinavisk studie tog den første pose så hurtigt. Bind morgenen til en handling.</p></div>' +
          '<button type="button" class="btn btn-ghost-mint btn-sm" data-act="add-plan" data-trigger="Morgenen">Lav plan</button></div>' +
          '<button type="button" class="btn btn-ghost btn-sm mt" data-act="dismiss-morning">Ikke nu</button>'
      );
    }
    if (isWeekendApproach() && (state.ifThenPlans || []).length && info.hours < 2160) {
      return cta(
        "Weekenden nærmer sig",
        "Weekenden",
        "Fest og alkohol er den hyppigste fælde. Her er planerne, du lavede, mens du var ædru.",
        "weekend-review",
        "Gennemgå",
        " gold"
      );
    }
    const party = upcomingParty();
    if (party && !state.activeParty) {
      return cta(
        "Du har en fest-plan",
        "Fest",
        esc(party.say || "Nej tak, jeg tager ikke snus."),
        "party-start",
        "Tænd",
        " gold",
        party.id
      );
    }
    if (info.hours < 21 * 24 && !info.future && !state.dismissed.partyHint) {
      return wrap(
        '<div class="checkin-cta"><div class="now-card-body"><div class="card-kicker coral">Fest og alkohol</div><strong>Den hyppigste fælde</strong><p>Lav en plan, mens du er ædru — før festen, ikke midt i den.</p></div>' +
          '<button type="button" class="btn btn-ghost-mint btn-sm" data-act="goto-party">Lav plan</button></div>'
      );
    }
    if (planPromptNeeded()) {
      return wrap(
        '<div class="checkin-cta"><div class="now-card-body"><div class="card-kicker">Hvis-så-planer</div><strong>Bind dine triggere til en handling</strong><p>Planen skal ligge klar, før suget kommer.</p></div>' +
          '<button type="button" class="btn btn-ghost-mint btn-sm" data-act="goto-plans">Lav plan</button></div>' +
          '<button type="button" class="btn btn-ghost btn-sm mt" data-act="dismiss-plan-prompt">Ikke nu</button>'
      );
    }
    const d28 = day28Html(s, {});
    if (d28) return d28;

    const a = taperAllowance(new Date());
    if (a) {
      const used = finiteNum((state.taper.logs || {})[todayISO(new Date())], 0);
      if (used > a.allow) {
        return cta(
          "Over dagens ramme",
          "Nedtrapning",
          "Bare videre — i morgen er en ny dag. Hold antallet, og sænk evt. hyppigheden først.",
          "goto-taper",
          "Log",
          ""
        );
      }
    }

    const unread = (state.inbox || []).filter(function (m) { return !m.read; });
    if (unread.length) {
      const m = unread[0];
      const peakDup = info.phase && info.phase.peak && (m.templateId === "d2" || m.templateId === "d2eve" || m.templateId === "d3" || m.templateId === "d3eve");
      if (!peakDup) {
        return cta(m.title, "Besked", esc(m.body), "goto-inbox", "Åbn", " mint");
      }
    }

    if (!todayCheckin() && !info.future) {
      return wrap(
        '<div class="checkin-cta"><div class="now-card-body"><div class="card-kicker">Dagbog</div><strong>Hvordan har du det i dag?</strong><p>Et kort check-in. Det tager under ti sekunder.</p></div>' +
          '<button type="button" class="btn btn-ghost-mint btn-sm" data-act="checkin">Check ind</button></div>'
      );
    }

    if (a && !a.done && !info.future) {
      const used = finiteNum((state.taper.logs || {})[todayISO(new Date())], 0);
      return cta(
        fmtNum(used, 1) + " / " + fmtNum(a.allow, 1) + " poser",
        "Nedtrapning i dag",
        "Dagens ramme.",
        "goto-taper",
        "Log",
        ""
      );
    }
    return "";
  }

  function openWeekendReview() {
    const plans = state.ifThenPlans || [];
    const fest = plans.filter(function (p) { return p.trigger === "Fest" || p.trigger === "Alkohol"; });
    const rest = plans.filter(function (p) { return p.trigger !== "Fest" && p.trigger !== "Alkohol"; });
    const ordered = fest.concat(rest);
    openSheet(
      "<h2>Weekenden</h2>" +
        '<p class="sheet-lead">Fest og alkohol er den hyppigste fælde. Her er planerne, du lavede, mens du var ædru.</p>' +
        (ordered.length
          ? ordered.map(function (p) { return planCardHtml(p); }).join("")
          : "<p>Lav en hvis-så-plan før weekenden.</p>") +
        '<button type="button" class="btn btn-gold btn-block mt" data-act="goto-party">Fest-plan</button>' +
        '<button type="button" class="btn btn-ghost-mint btn-block mt" data-act="goto-plans">Alle planer</button>' +
        '<button type="button" class="btn btn-ghost btn-block mt" data-act="close-modal">Luk</button>'
    );
  }


  /* ---------------- v10 helpers ---------------- */
  let DELAY_MS = 10 * 60 * 1000;
  let toolTimer = null;
  let toolRaf = 0;

  const CONCRETE_THINGS = [
    { name: "kop kaffe", plural: "kopper kaffe", price: 45 },
    { name: "biografbillet", plural: "biografbilletter", price: 130 },
    { name: "måned med streaming", plural: "måneder med streaming", price: 129 },
    { name: "middag ude", plural: "middage ude", price: 225 },
    { name: "buket blomster", plural: "buketter", price: 99 },
    { name: "par gode løbesko", plural: "par løbesko", price: 1200 },
    { name: "weekendtur", plural: "weekendture", price: 1800 },
    { name: "vinterjakke", plural: "vinterjakker", price: 1500 },
    { name: "cykel (en fin, brugt)", plural: "cykler", price: 3500 },
    { name: "computer", plural: "computere", price: 8000 }
  ];

  const TOOLS = [
    { id: "wave", label: "Rid bølgen", sub: "3–4 min.", act: "start-wave" },
    { id: "ground", label: "5-4-3-2-1", sub: "Jordforbindelse · 30 sek.", act: "tool-ground" },
    { id: "cold", label: "Koldt vand", sub: "30 sekunder", act: "tool-cold" },
    { id: "move", label: "Mini-træning", sub: "30 sekunder", act: "tool-move" },
    { id: "delay", label: "Vent 10 minutter", sub: "Beslutningen kan vente", act: "tool-delay" },
    { id: "breath", label: "Åndedræt", sub: "2 minutter", act: "start-breath" }
  ];

  const GROUND_STEPS = [
    { n: "5", title: "Se fem ting", body: "Se dig omkring. Navngiv fem ting, du kan se — stille, for dig selv." },
    { n: "4", title: "Fire lyde", body: "Lyt. Fire lyde, tæt på eller langt væk." },
    { n: "3", title: "Tre ting, du mærker", body: "Gulvet under fødderne, tøjet, luften. Tre konkrete fornemmelser." },
    { n: "2", title: "To dufte", body: "To dufte — eller bare luften, som den er." },
    { n: "1", title: "Én smag", body: "Én smag, eller bare at mærke tungen i munden. Du er her." }
  ];

  function resolvedTheme() {
    const t = (state && state.theme) || "system";
    if (t === "light") return "light";
    if (t === "dark") return "dark";
    try {
      if (window.matchMedia && matchMedia("(prefers-color-scheme: light)").matches) return "light";
    } catch (e) {}
    return "dark";
  }

  function applyTheme() {
    const r = resolvedTheme();
    document.documentElement.setAttribute("data-theme", r);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", r === "light" ? "#F0EBE0" : "#0A110E");
    const bar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (bar) bar.setAttribute("content", r === "light" ? "default" : "black-translucent");
    try {
      document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
        m.setAttribute("content", r === "light" ? "#F0EBE0" : "#0A110E");
      });
    } catch (e) {}
  }

  function moneyConcrete(kr) {
    kr = finiteNum(kr, 0);
    if (kr < 30) return "";
    const fits = CONCRETE_THINGS.filter(function (t) {
      const n = Math.floor(kr / t.price);
      return n >= 1 && n <= 24;
    });
    if (!fits.length) {
      const big = CONCRETE_THINGS.filter(function (t) { return t.price <= kr; }).pop();
      if (!big) return "";
      return "Det er omtrent " + (big.name.indexOf("en ") === 0 ? big.name : "en " + big.name) + " — cirka, efter danske priser.";
    }
    fits.sort(function (a, b) { return b.price - a.price; });
    const a = fits[0];
    const na = Math.floor(kr / a.price);
    const la = na === 1 ? (a.name.indexOf("par") === 0 || a.name.indexOf("måned") === 0 ? a.name : a.name) : a.plural;
    const art = a.name.indexOf("par ") === 0 ? "et " : "en ";
    const first = na === 1 ? (art + a.name) : (na + " " + a.plural);
    let second = "";
    if (fits.length > 1 && fits[1].name !== a.name) {
      const b = fits[Math.min(1, fits.length - 1)];
      if (b && b.price !== a.price) {
        const nb = Math.floor(kr / b.price);
        if (nb >= 1) second = " — eller " + (nb === 1 ? "en " + b.name : nb + " " + b.plural);
      }
    }
    return "Det er omtrent " + first + second + ". Cirka, efter almindelige danske priser.";
  }

  function moneyConcreteHtml(kr) {
    const t = moneyConcrete(kr);
    if (!t) return "";
    return '<p class="money-concrete">' + esc(t) + "</p>";
  }

  function pinePath(cx, baseY, h, w) {
    const top = baseY - h;
    const mid = baseY - h * 0.42;
    const mid2 = baseY - h * 0.18;
    const w1 = w * 0.42;
    const w2 = w * 0.7;
    const w3 = w;
    return (
      "M " + cx + " " + top +
      " L " + (cx - w1) + " " + mid +
      " L " + (cx - w1 * 0.35) + " " + mid +
      " L " + (cx - w2) + " " + mid2 +
      " L " + (cx - w2 * 0.32) + " " + mid2 +
      " L " + (cx - w3) + " " + baseY +
      " L " + (cx + w3) + " " + baseY +
      " L " + (cx + w2 * 0.32) + " " + mid2 +
      " L " + (cx + w2) + " " + mid2 +
      " L " + (cx + w1 * 0.35) + " " + mid +
      " L " + (cx + w1) + " " + mid +
      " Z"
    );
  }

  function journeyTrees(days, opts) {
    opts = opts || {};
    const wide = !!opts.wide;
    const W = wide ? 640 : 390;
    const H = wide ? 200 : 200;
    const baseY = H - 2;
    /* Side-framed pines. Centre channel left open for the counter. */
    const specs = wide
      ? [
          { x: 0.06, max: 0.92, at: 0, w: 0.055 },
          { x: 0.14, max: 0.78, at: 1, w: 0.05 },
          { x: 0.22, max: 0.64, at: 3, w: 0.042 },
          { x: 0.30, max: 0.52, at: 7, w: 0.036 },
          { x: 0.38, max: 0.38, at: 14, w: 0.028 },
          { x: 0.62, max: 0.40, at: 14, w: 0.028 },
          { x: 0.70, max: 0.55, at: 7, w: 0.036 },
          { x: 0.78, max: 0.70, at: 3, w: 0.044 },
          { x: 0.86, max: 0.84, at: 1, w: 0.05 },
          { x: 0.94, max: 0.95, at: 0, w: 0.058 }
        ]
      : [
          { x: 0.05, max: 0.95, at: 0, w: 0.07 },
          { x: 0.14, max: 0.78, at: 1, w: 0.058 },
          { x: 0.23, max: 0.58, at: 3, w: 0.048 },
          { x: 0.77, max: 0.58, at: 3, w: 0.048 },
          { x: 0.86, max: 0.82, at: 1, w: 0.06 },
          { x: 0.95, max: 0.98, at: 0, w: 0.072 }
        ];
    const later = [
      { x: 0.32, max: 0.42, at: 28, w: 0.032, side: true },
      { x: 0.68, max: 0.44, at: 28, w: 0.032, side: true },
      { x: 0.10, max: 0.50, at: 60, w: 0.04, side: false },
      { x: 0.90, max: 0.55, at: 60, w: 0.04, side: false },
      { x: 0.18, max: 0.36, at: 100, w: 0.03, side: false },
      { x: 0.82, max: 0.38, at: 100, w: 0.03, side: false }
    ];
    const all = specs.concat(wide ? later : later.filter(function (t) { return t.at <= 60; }));
    let paths = "";
    all.forEach(function (t, i) {
      const growFor = Math.max(10, t.at + 18);
      const raw = days < t.at ? 0 : Math.min(1, (days - t.at) / growFor);
      const g = raw * raw * (3 - 2 * raw);
      if (g <= 0.02) return;
      const h = (t.max * H) * (0.22 + 0.78 * g);
      const w = t.w * W * (0.7 + 0.3 * g);
      const cx = t.x * W;
      const op = (0.42 + 0.5 * g).toFixed(2);
      paths +=
        '<path class="pine" d="' +
        pinePath(cx, baseY, h, w) +
        '" fill="currentColor" opacity="' +
        op +
        '"></path>';
    });
    const sun = wide
      ? '<circle cx="' + W / 2 + '" cy="48" r="16" fill="#F0D9A0" opacity="0.55"></circle><circle cx="' + W / 2 + '" cy="48" r="28" fill="#E8C47A" opacity="0.12"></circle>'
      : "";
    const cls = wide ? "journey-wide" : "hero-journey";
    return (
      '<div class="' +
      cls +
      '" aria-hidden="true"><svg viewBox="0 0 ' +
      W +
      " " +
      H +
      '" preserveAspectRatio="xMidYMax meet" focusable="false">' +
      sun +
      paths +
      "</svg></div>"
    );
  }

  function isoWeekKey(d) {
    const dt = d ? new Date(d) : new Date();
    const tmp = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7));
    const week1 = new Date(tmp.getFullYear(), 0, 4);
    const w = 1 + Math.round(calendarDaysBetween(week1, tmp) / 7);
    return tmp.getFullYear() + "-W" + pad(w);
  }

  function weekBounds(key) {
    /* Approximate: use current week's Monday–Sunday in local time if key is current; else parse. */
    const now = new Date();
    const day = (now.getDay() + 6) % 7;
    const mon = new Date(now);
    mon.setDate(now.getDate() - day);
    mon.setHours(0, 0, 0, 0);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 7);
    return { start: mon, end: sun };
  }

  function personalInsights() {
    const out = [];
    const cravings = state.cravings || [];
    const slips = state.slips || [];
    const checkins = state.checkins || [];
    const quitAt = state.profile && state.profile.quitAt ? new Date(state.profile.quitAt).getTime() : Date.now();
    if (!isFinite(quitAt)) return out;

    function hoursAfter(iso) {
      const t = new Date(iso).getTime();
      return isFinite(t) ? (t - quitAt) / 3600000 : 0;
    }

    /* Time-of-day pattern. Need at least 5 logged cravings. */
    if (cravings.length >= 5) {
      const bands = [
        { id: "morn", from: 6, to: 9, label: "om morgenen (kl. 6–9)" },
        { id: "late-m", from: 9, to: 12, label: "formiddag (kl. 9–12)" },
        { id: "mid", from: 12, to: 15, label: "tidlig eftermiddag (kl. 12–15)" },
        { id: "aft", from: 15, to: 17, label: "eftermiddag (kl. 15–17)" },
        { id: "eve", from: 17, to: 20, label: "aften (kl. 17–20)" },
        { id: "late", from: 20, to: 24, label: "sen aften (kl. 20–24)" },
        { id: "night", from: 0, to: 6, label: "om natten (kl. 0–6)" }
      ];
      const counts = {};
      cravings.forEach(function (c) {
        const h = new Date(c.at).getHours();
        bands.forEach(function (b) {
          if (h >= b.from && h < b.to) counts[b.id] = (counts[b.id] || 0) + 1;
        });
      });
      let top = bands[0];
      let n = 0;
      bands.forEach(function (b) {
        if ((counts[b.id] || 0) > n) {
          n = counts[b.id];
          top = b;
        }
      });
      if (n >= 3 && n / cravings.length >= 0.3) {
        const hoursLabel = top.label.replace(/^.*\(kl\. /, "kl. ").replace(")", "");
        out.push({
          id: "hours",
          kicker: "Tidspunkt",
          title: "Dine trang topper " + hoursLabel,
          body:
            n +
            " af " +
            cravings.length +
            " loggede trange faldt " +
            top.label +
            ". Et mønster i et lille tal — værd at have en plan klar der, ikke en lov.",
          n: cravings.length
        });
      }
    }

    /* Alcohol in slips. At least 2 slips, and at least one with a known alcohol field. */
    const slipsKnown = slips.filter(function (s) { return s.alcohol === "yes" || s.alcohol === "no"; });
    if (slips.length >= 2 && slipsKnown.length >= 2) {
      const alc = slips.filter(function (s) { return s.alcohol === "yes"; }).length;
      if (alc >= 1) {
        out.push({
          id: "alcohol",
          kicker: "Slip",
          title: "Alkohol stod bag " + alc + " af " + slips.length + " slip",
          body:
            "Et lille tal, men det er det mønster, både brugere og sundhedsmyndigheder peger på. Planen laves, mens du er ædru.",
          n: slips.length
        });
      }
    }

    /* Intensity week 1 vs later. */
    const w1 = cravings.filter(function (c) {
      const h = hoursAfter(c.at);
      return h >= 0 && h < 168 && c.intensity;
    });
    const later = cravings.filter(function (c) {
      const h = hoursAfter(c.at);
      return h >= 168 && c.intensity;
    });
    if (w1.length >= 3 && later.length >= 3) {
      const avg = function (arr) {
        return arr.reduce(function (a, c) { return a + Number(c.intensity || 0); }, 0) / arr.length;
      };
      const a1 = avg(w1);
      const a2 = avg(later);
      if (a1 > 0) {
        const pct = Math.round((1 - a2 / a1) * 100);
        if (pct >= 15) {
          out.push({
            id: "trend-down",
            kicker: "Styrke",
            title: "Trangen er faldet omkring " + pct + " % siden uge 1",
            body:
              "Gennemsnitlig styrke " +
              fmtNum(a1, 1) +
              " i uge 1, " +
              fmtNum(a2, 1) +
              " siden. Ud fra de " +
              (w1.length + later.length) +
              " trange, du har logget — dit forløb, ikke et løfte om, at det bliver ved.",
            n: w1.length + later.length
          });
        } else if (pct <= -15) {
          out.push({
            id: "trend-up",
            kicker: "Styrke",
            title: "Den loggede styrke er højere end i uge 1",
            body:
              "Fra " +
              fmtNum(a1, 1) +
              " til " +
              fmtNum(a2, 1) +
              " i gennemsnit. Variation er almindelig, især når vaner — ikke kemien — tager over. Det er ikke et tegn på at du fejler.",
            n: w1.length + later.length
          });
        }
      }
    }

    /* Top trigger. */
    if (cravings.length >= 4) {
      const counts = {};
      cravings.forEach(function (c) {
        const k = c.trigger || "Andet";
        counts[k] = (counts[k] || 0) + 1;
      });
      const ranked = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });
      const top = ranked[0];
      const n = counts[top];
      if (n >= 2) {
        const has = !!ifThenFor(top);
        out.push({
          id: "trigger",
          kicker: "Udløser",
          title: top + " er din hyppigste udløser",
          body:
            n +
            " af " +
            cravings.length +
            " trange. " +
            (has
              ? "Du har allerede en hvis-så-plan til den situation."
              : "En hvis-så-plan til den situation hjælper, når suget kommer."),
          n: cravings.length,
          act: has ? "goto-plans" : "add-plan",
          actLabel: has ? "Se planen" : "Lav en plan",
          trigger: top
        });
      }
    }

    /* Weekend vs weekday slips / cravings */
    if (cravings.length >= 8) {
      let we = 0, wd = 0;
      cravings.forEach(function (c) {
        const d = new Date(c.at).getDay();
        if (d === 0 || d === 5 || d === 6) we++;
        else wd++;
      });
      if (we >= 3 && we / cravings.length >= 0.45) {
        out.push({
          id: "weekend",
          kicker: "Ugen",
          title: "Flere trange i weekenden",
          body:
            we +
            " af " +
            cravings.length +
            " loggede trange faldt fredag–søndag. Gennemgå planen før weekenden, mens du er ædru.",
          n: cravings.length,
          act: "weekend-review",
          actLabel: "Gennemgå"
        });
      }
    }

    /* Check-in craving trend, if they check in often */
    if (checkins.length >= 8) {
      const sorted = checkins.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
      const mid = Math.floor(sorted.length / 2);
      const first = sorted.slice(0, mid).filter(function (c) { return c.craving; });
      const last = sorted.slice(mid).filter(function (c) { return c.craving; });
      if (first.length >= 3 && last.length >= 3) {
        const avg = function (arr) {
          return arr.reduce(function (a, c) { return a + Number(c.craving || 0); }, 0) / arr.length;
        };
        const a1 = avg(first);
        const a2 = avg(last);
        if (a1 > 0 && a2 < a1 * 0.85) {
          const pct = Math.round((1 - a2 / a1) * 100);
          out.push({
            id: "checkin-trend",
            kicker: "Dagbog",
            title: "Din egen vurdering af trangen er faldet omkring " + pct + " %",
            body:
              "Fra " +
              fmtNum(a1, 1) +
              " til " +
              fmtNum(a2, 1) +
              " i gennemsnit, ud fra " +
              checkins.length +
              " check-ins. Det er din egen måling, over et stykke tid.",
            n: checkins.length
          });
        }
      }
    }

    return out;
  }

  function insightsTeaserHtml() {
    const list = personalInsights();
    if (!list.length) return "";
    const a = list[0];
    return (
      '<div class="card insight-card reveal">' +
      '<div class="checkin-cta"><div class="now-card-body"><div class="card-kicker mint">Indsigt</div><strong>' +
      esc(a.title) +
      "</strong><p>Et mønster i dine egne log — med forbehold for, at tallene er små.</p>" +
      '</div><button type="button" class="btn btn-ghost-mint btn-sm" data-act="goto-insights">Alle</button></div></div>'
    );
  }

  function renderInsights(el) {
    const list = personalInsights();
    const items = list.length
      ? list
          .map(function (a) {
            return (
              '<div class="card insight-card"><div class="card-kicker mint">' +
              esc(a.kicker) +
              "</div><strong>" +
              esc(a.title) +
              "</strong><p>" +
              esc(a.body) +
              "</p>" +
              (a.act
                ? '<button type="button" class="btn btn-ghost-mint btn-sm mt" data-act="' +
                  a.act +
                  '"' +
                  (a.trigger ? ' data-trigger="' + esc(a.trigger) + '"' : "") +
                  ">" +
                  esc(a.actLabel || "Åbn") +
                  "</button>"
                : "") +
              '<span class="n-sample">Ud fra ' +
              a.n +
              " registreringer. Et mønster, ikke en diagnose.</span></div>"
            );
          })
          .join("")
      : '<div class="card empty-rich"><div class="big">🔭</div><p>Der er ikke nok logget endnu til at sige noget ærligt. Når du har et lille håndfuld trange, slip eller check-ins, vises mønstre her — med forbehold for, at tallene er små.</p></div>';
    const s = stats();
    el.innerHTML = subWrap(
      "Indsigt",
      '<p class="page-sub">Det, dine egne log viser — formuleret forsigtigt. Små tal får et forbehold. Ingen påstande, vi ikke kan bære.</p>' +
        (s.future ? "" : journeyTrees(s.days, { wide: true })) +
        '<div class="insight-list">' +
        items +
        "</div>" +
        '<button type="button" class="btn btn-ghost-mint btn-block mt-2" data-act="goto-recap">Ugens overblik</button>'
    );
  }

  function recapData() {
    const b = weekBounds();
    const start = b.start.getTime();
    const end = b.end.getTime();
    const inWeek = function (iso) {
      const t = new Date(iso).getTime();
      return t >= start && t < end;
    };
    const cravings = (state.cravings || []).filter(function (c) { return inWeek(c.at); });
    const slips = (state.slips || []).filter(function (s) { return inWeek(s.at); });
    const checkins = (state.checkins || []).filter(function (c) { return inWeek(c.date); });
    const resisted = cravings.filter(function (c) { return c.resisted; }).length;
    const waves = cravings.filter(function (c) { return c.usedWave; }).length;
    const s = stats();
    /* Money earned this week: roughly per.day * days-so-far of the week after quit, minus slip pouches this week. */
    const now = Date.now();
    const from = Math.max(start, isFinite(new Date(state.profile.quitAt).getTime()) ? new Date(state.profile.quitAt).getTime() : start);
    const days = Math.max(0, (Math.min(now, end) - from) / 86400000);
    const slipP = slips.reduce(function (a, x) { return a + (Number(x.pouches) || 0); }, 0);
    const costPerPouch = s.r.pouchesPerDay > 0 ? s.r.costPerDay / s.r.pouchesPerDay : 0;
    const money = Math.max(0, s.r.costPerDay * days - slipP * costPerPouch);
    const insight = personalInsights()[0] || null;
    return {
      start: b.start,
      end: b.end,
      key: isoWeekKey(new Date()),
      cravings: cravings.length,
      resisted: resisted,
      waves: waves,
      slips: slips.length,
      checkins: checkins.length,
      money: money,
      days: days,
      insight: insight
    };
  }

  function renderRecap(el) {
    const r = recapData();
    const range =
      fmtDate(r.start, { day: "numeric", month: "short" }) +
      " – " +
      fmtDate(new Date(r.end.getTime() - 86400000), { day: "numeric", month: "short" });
    const insight = r.insight
      ? '<div class="card insight-card"><div class="card-kicker mint">Et mønster i dine log</div><strong>' +
        esc(r.insight.title) +
        "</strong><p>" +
        esc(r.insight.body) +
        "</p></div>"
      : "";
    const reason = reasonsList()[0];
    el.innerHTML = subWrap(
      "Ugens overblik",
      '<p class="page-sub">' +
        esc(range) +
        " · uge " +
        esc(String(r.key).split("-W")[1] || "") +
        ", indtil nu.</p>" +
        journeyTrees(stats().days, { wide: true }) +
        '<div class="recap-hero"><div class="v">' +
        esc(fmtKr(r.money, 0)) +
        '</div><div class="l">sparet i den her uge</div></div>' +
        (moneyConcreteHtml(r.money) ? '<div class="card">' + moneyConcreteHtml(r.money) + "</div>" : "") +
        '<div class="mini-stats">' +
        '<div class="mini-stat"><div class="v">' +
        r.resisted +
        '</div><div class="l">trange klaret</div></div>' +
        '<div class="mini-stat sky"><div class="v">' +
        r.waves +
        '</div><div class="l">bølger redet</div></div>' +
        '<div class="mini-stat gold"><div class="v">' +
        r.checkins +
        '</div><div class="l">check-ins</div></div>' +
        '<div class="mini-stat coral"><div class="v">' +
        r.slips +
        '</div><div class="l">slip</div></div></div>' +
        insight +
        (reason
          ? '<div class="card"><div class="card-kicker">Din grund</div><blockquote class="quote">“' +
            esc(reason.text) +
            "”</blockquote></div>"
          : "") +
        '<p class="hint mt">Et overblik over den uge, der er i gang. Små tal, ærligt formuleret.</p>'
    );
    state.recapSeen = state.recapSeen || {};
    state.recapSeen[r.key] = true;
    save();
  }

  let letterEditing = false;

  function letterState() {
    const L = state.letter || { text: "", writtenAt: null, openedAt: null };
    const s = stats();
    const days = s.future ? 0 : s.days;
    const unlocked = !!L.text && days >= 30;
    const pending = unlocked && !L.openedAt;
    return { L: L, days: days, unlocked: unlocked, pending: pending, written: !!(L.text && L.text.trim()) };
  }

  function renderLetter(el) {
    const ls = letterState();
    let body = "";
    if (!ls.written || letterEditing) {
      body =
        '<p class="page-sub">Skriv et kort brev til dig selv om 30 dage. Det bliver låst, indtil dagen kommer — så læser du det, du mente, da du startede.</p>' +
        '<div class="field"><label for="letter-text">Brevet</label>' +
        '<textarea id="letter-text" class="input" maxlength="800" style="min-height:10rem" placeholder="Hvad vil du gerne huske om 30 dage? Hvorfor du startede. Hvad der betyder noget.">' +
        esc(ls.L.text || "") +
        "</textarea></div>" +
        '<button type="button" class="btn btn-primary btn-block" data-act="letter-save">Gem brevet — åbnes på dag 30</button>' +
        '<p class="hint mt">Valgfrit. Du kan rette det, indtil det åbnes.</p>';
    } else if (!ls.unlocked) {
      const left = 30 - ls.days;
      body =
        '<div class="letter-locked"><div class="big">✉️</div><p>Brevet ligger klar. Det åbnes på dag 30.</p>' +
        '<div class="letter-eta">' +
        (left < 1 ? "Meget snart." : "Åbnes " + fmtEta(left * 86400)) +
        "</div>" +
        '<p class="hint mt">Skrevet ' +
        esc(ls.L.writtenAt ? fmtDate(ls.L.writtenAt) : "") +
        ".</p></div>" +
        '<button type="button" class="btn btn-ghost btn-block" data-act="letter-edit">Ret brevet, indtil det åbnes</button>';
    } else {
      body =
        '<p class="page-sub">Skrevet ' +
        esc(ls.L.writtenAt ? fmtDate(ls.L.writtenAt) : "") +
        ". Åbnet " +
        (ls.L.openedAt ? esc(fmtDate(ls.L.openedAt)) : "nu") +
        ".</p>" +
        '<div class="card"><div class="letter-body">' +
        esc(ls.L.text) +
        "</div></div>" +
        '<p class="hint mt">Det er dine egne ord fra starten. Du kan lade dem stå.</p>';
    }
    el.innerHTML = subWrap("Brev til mig", body);
    if (ls.unlocked && !ls.L.openedAt) {
      state.letter.openedAt = new Date().toISOString();
      save();
    }
  }

  function rankedTools() {
    const help = state.toolHelp || {};
    const rows = TOOLS.map(function (t) {
      const h = help[t.id] || { yes: 0, mid: 0, no: 0 };
      const n = (h.yes || 0) + (h.mid || 0) + (h.no || 0);
      const score = n ? (h.yes * 2 + h.mid - h.no) / n : 0;
      return { tool: t, n: n, score: score, yes: h.yes || 0 };
    });
    const used = rows.filter(function (r) { return r.n >= 2; });
    used.sort(function (a, b) { return b.score - a.score || b.n - a.n; });
    return used;
  }

  function toolRankHtml() {
    const used = rankedTools();
    if (!used.length) return "";
    const top = used[0];
    return (
      '<div class="card"><div class="card-kicker mint">Hvad hjalp sidst</div>' +
      '<p class="tool-rank">Ud fra ' +
      top.n +
      " gange hjalp <strong>" +
      esc(top.tool.label) +
      "</strong> dig oftest" +
      (used.length > 1 ? " — derefter " + esc(used[1].tool.label) : "") +
      ". Det er din egen log, ikke et facit.</p>" +
      '<button type="button" class="btn btn-ghost-mint btn-sm mt" data-act="' +
      top.tool.act +
      '">Brug den igen</button></div>'
    );
  }

  function toolboxHtml() {
    const rank = rankedTools();
    const order = TOOLS.slice();
    if (rank.length) {
      const ids = rank.map(function (r) { return r.tool.id; });
      order.sort(function (a, b) {
        const ia = ids.indexOf(a.id);
        const ib = ids.indexOf(b.id);
        return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
      });
    }
    const btns = order
      .map(function (t) {
        return (
          '<button type="button" class="tool-act' +
          (t.id === "delay" ? " wide" : "") +
          '" data-act="' +
          t.act +
          '"><span class="tool-lab">' +
          esc(t.label) +
          '</span><span class="tool-sub">' +
          esc(t.sub) +
          "</span></button>"
        );
      })
      .join("");
    return (
      '<div class="section-label">Værktøjskasse</div>' +
      '<div class="toolbox">' +
      btns +
      "</div>" +
      toolRankHtml()
    );
  }

  function closeToolScreen() {
    const screen = $("#tool-screen");
    if (screen) {
      screen.classList.add("hidden");
      screen.innerHTML = "";
    }
    if (toolTimer) {
      clearTimeout(toolTimer);
      toolTimer = null;
    }
    if (toolRaf) {
      cancelAnimationFrame(toolRaf);
      toolRaf = 0;
    }
    const tab = $("#tabbar");
    const fab = $("#fab-sos");
    if (tab && state.onboarded) tab.classList.remove("hidden");
    if (fab && state.onboarded && view !== "craving" && view !== "more") fab.classList.remove("hidden");
  }

  function openToolScreen(html) {
    closeModal();
    const screen = $("#tool-screen");
    if (!screen) return;
    screen.classList.remove("hidden");
    $("#tabbar").classList.add("hidden");
    $("#fab-sos").classList.add("hidden");
    screen.innerHTML = html;
  }

  function askHelped(toolId) {
    openSheet(
      "<h2>Hjalp det?</h2>" +
        '<p class="sheet-lead">Din egen log. Den bruges til at vise, hvad der hjalp dig sidst.</p>' +
        '<div class="row2">' +
        '<button type="button" class="btn btn-primary btn-block" data-act="tool-helped" data-id="' +
        esc(toolId) +
        '" data-val="yes">Ja</button>' +
        '<button type="button" class="btn btn-ghost-mint btn-block" data-act="tool-helped" data-id="' +
        esc(toolId) +
        '" data-val="mid">Lidt</button></div>' +
        '<button type="button" class="btn btn-ghost btn-block mt" data-act="tool-helped" data-id="' +
        esc(toolId) +
        '" data-val="no">Ikke denne gang</button>'
    );
  }

  function recordToolHelp(id, val) {
    state.toolHelp = state.toolHelp || {};
    const h = state.toolHelp[id] || { yes: 0, mid: 0, no: 0 };
    if (val === "yes") h.yes++;
    else if (val === "mid") h.mid++;
    else h.no++;
    state.toolHelp[id] = h;
    save();
  }

  function startGround() {
    haptic("start");
    let step = 0;
    function paint() {
      const g = GROUND_STEPS[step];
      const last = step === GROUND_STEPS.length - 1;
      openToolScreen(
        '<p class="tool-kicker">Jordforbindelse</p>' +
          '<div class="tool-step-n">' +
          (step + 1) +
          " af " +
          GROUND_STEPS.length +
          "</div>" +
          '<h2 class="tool-title">' +
          esc(g.title) +
          '</h2><p class="tool-sub">' +
          esc(g.body) +
          '</p><div class="tool-actions">' +
          '<button type="button" class="btn btn-primary btn-block" data-act="ground-next">' +
          (last ? "Færdig" : "Næste") +
          "</button>" +
          '<button type="button" class="btn btn-ghost btn-block mt" data-act="tool-close">Luk</button></div>'
      );
      const screen = $("#tool-screen");
      if (screen) {
        screen._groundStep = step;
        screen._groundLast = last;
      }
    }
    paint();
    window._groundPaint = function (next) {
      if (next) {
        if (step >= GROUND_STEPS.length - 1) {
          closeToolScreen();
          askHelped("ground");
          return;
        }
        step++;
        paint();
      }
    };
  }

  function startCountdownTool(opts) {
    haptic("start");
    const total = opts.ms || 30000;
    const start = Date.now();
    function frame() {
      const elapsed = Date.now() - start;
      const rem = Math.max(0, total - elapsed);
      const sec = Math.ceil(rem / 1000);
      const timeEl = $("#tool-count");
      if (timeEl) timeEl.textContent = String(sec);
      if (rem <= 0) {
        closeToolScreen();
        askHelped(opts.id);
        return;
      }
      toolRaf = requestAnimationFrame(frame);
    }
    openToolScreen(
      '<p class="tool-kicker">' +
        esc(opts.kicker) +
        "</p>" +
        '<h2 class="tool-title">' +
        esc(opts.title) +
        '</h2><p class="tool-sub">' +
        esc(opts.body) +
        '</p><div class="tool-count" id="tool-count">' +
        Math.ceil(total / 1000) +
        '</div><div class="tool-actions">' +
        '<button type="button" class="btn btn-ghost btn-block" data-act="tool-close">Stop</button></div>'
    );
    toolRaf = requestAnimationFrame(frame);
  }

  function startDelay(opts) {
    opts = opts || {};
    haptic("start");
    let start, end, total;
    const existing = state.activeDelay;
    const resume = !!(opts.resume && existing && existing.end);
    if (resume) {
      start = new Date(existing.start).getTime();
      end = new Date(existing.end).getTime();
      total = Math.max(0, end - Date.now());
      if (!isFinite(end) || existing.done || total <= 0) {
        finishDelay();
        return;
      }
    } else {
      total = opts.ms != null ? opts.ms : DELAY_MS;
      start = Date.now();
      end = start + total;
      state.activeDelay = {
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
        done: false
      };
      save();
    }
    const labelMin = Math.max(1, Math.round((end - start) / 60000));
    function paint(rem) {
      const m = Math.floor(rem / 60000);
      const sec = Math.floor((rem % 60000) / 1000);
      const timeEl = $("#tool-count");
      if (timeEl) timeEl.textContent = m + ":" + pad(sec);
    }
    function frame() {
      const rem = Math.max(0, end - Date.now());
      paint(rem);
      if (rem <= 0) {
        finishDelay();
        return;
      }
      toolRaf = requestAnimationFrame(frame);
    }
    function finishDelay() {
      if (toolRaf) cancelAnimationFrame(toolRaf);
      toolRaf = 0;
      state.activeDelay = state.activeDelay || {};
      state.activeDelay.done = true;
      save();
      openToolScreen(
        '<p class="tool-kicker">Ti minutter</p>' +
          '<h2 class="tool-title">Tiden er gået</h2>' +
          '<p class="tool-sub">Hvordan er trangen nu? Du behøver stadig ikke beslutte resten af livet — bare det næste skridt.</p>' +
          '<div class="tool-actions">' +
          '<button type="button" class="btn btn-primary btn-block" data-act="tool-delay-done">Den gik — log og luk</button>' +
          '<button type="button" class="btn btn-coral btn-block mt" data-act="sos">Stadig her · åbn SOS</button>' +
          '<button type="button" class="btn btn-ghost btn-block mt" data-act="tool-close">Luk</button></div>'
      );
    }
    openToolScreen(
      '<p class="tool-kicker">Vent</p>' +
        '<h2 class="tool-title">Beslutningen kan vente</h2>' +
        '<p class="tool-sub">' +
        (labelMin === 10
          ? "Ti minutter. Trangen er en gæst. Lav noget andet — et glas vand, en kort tur. Timere kører, mens appen er åben."
          : "Trangen er en gæst. Lav noget andet. Timere kører, mens appen er åben.") +
        '</p>' +
        '<div class="tool-count" id="tool-count">10:00</div>' +
        '<div class="tool-actions">' +
        '<button type="button" class="btn btn-ghost btn-block" data-act="tool-close">Luk — tiden kører videre</button></div>'
    );
    paint(total);
    toolRaf = requestAnimationFrame(frame);
    window._finishDelay = finishDelay;
  }

  function CELEBRATIONS() {
    return [
      { id: "d1", days: 1, title: "Første døgn", body: "Et helt døgn uden ny nikotin. Kroppen er i gang. De næste dage kan være de hårdeste — det er midlertidigt, og det er normalt." },
      { id: "d3", days: 3, title: "Tre dage", body: "Nikotinen er næsten ude. For de fleste er toppen her eller lige passeret. Du behøver ikke vinde resten af livet — bare den næste bølge." },
      { id: "d7", days: 7, title: "En uge", body: "De fysiske abstinenser aftager som regel. Vanerne bliver. Dine planer er lavet til dem." },
      { id: "d14", days: 14, title: "To uger", body: "Nogle kalder det nedad bakke herfra. Det er en erfaring, ikke et løfte. Du er et stykke henne." },
      { id: "d28", days: 28, title: "28 dage", body: "28 dage uden røg femdobler ifølge Helsenorge chancen for at holde op for godt — den samme dokumentation findes ikke for snus. Tag det som et delmål." },
      { id: "d30", days: 30, title: "30 dage", body: "En måned. Hvis du skrev et brev til dig selv ved starten, ligger det klar nu." },
      { id: "d100", days: 100, title: "100 dage", body: "Et hundrede dage. Historikken står. Fortsæt som du har gjort." },
      { id: "d182", days: 182, title: "Et halvt år", body: "Den værste del er for de fleste overstået, men fest og gamle cues kan stadig vække vanen. Opmerksomhed, ikke skrøbelighed." },
      { id: "d365", days: 365, title: "Et år", body: "Et helt år uden snus. Historikken står. Det er et langt stykke arbejde — fortsæt som du har gjort." }
    ];
  }

  function pendingCelebration() {
    const s = stats();
    if (s.future) return null;
    const days = s.days;
    state.celebrated = state.celebrated || {};
    const list = CELEBRATIONS();
    for (let i = list.length - 1; i >= 0; i--) {
      const c = list[i];
      if (days >= c.days && !state.celebrated[c.id]) {
        /* Only surface if we crossed it recently (36 hours), so a v10-migration at day 120 is not a firework show. */
        const crossed = new Date((state.profile && state.profile.quitAt) ? state.profile.quitAt : Date.now());
        const at = crossed.getTime() + c.days * 86400000;
        if (Date.now() - at < 36 * 3600000 && Date.now() >= at) return c;
      }
    }
    return null;
  }

  function showCelebration(c) {
    if (!c) return;
    state.celebrated = state.celebrated || {};
    state.celebrated[c.id] = new Date().toISOString();
    save();
    haptic("done");
    const letterCta =
      c.id === "d30" && letterState().written && letterState().unlocked
        ? '<button type="button" class="btn btn-gold btn-block mt" data-act="goto-letter">Åbn brevet</button>'
        : "";
    openSheet(
      '<div class="celebrate-mark" aria-hidden="true"><svg viewBox="0 0 48 48" fill="currentColor"><path d="' +
        pinePath(24, 44, 36, 16) +
        '"></path></svg></div>' +
        "<h2>" +
        esc(c.title) +
        "</h2>" +
        '<p class="sheet-lead">' +
        esc(c.body) +
        "</p>" +
        journeyTrees(stats().days, { wide: true }) +
        letterCta +
        '<button type="button" class="btn btn-primary btn-block mt" data-act="close-modal">Videre</button>'
    );
  }


  function renderHome() {
    const el = $("#view-home");
    const s = stats();
    const t = s.future ? splitTime(-s.rawMs) : splitTime(s.ms);
    const nm = nextMilestone(s);
    const info = compassPhase();
    const manyDays = t.days >= 1000;

    let teaser = "";
    if (nm.m) {
      const p = Math.max(0, Math.min(1, (s.ms / 1000 - nm.prev) / (nm.m.after - nm.prev)));
      teaser =
        '<div class="card reveal">' +
        '<div class="card-kicker mint">Næste milepæl</div>' +
        '<div class="teaser">' +
        '<div class="ring" style="--p:' +
        p.toFixed(3) +
        '"><span>' +
        Math.round(p * 100) +
        "%</span></div>" +
        '<div class="teaser-body"><strong>' +
        esc(nm.m.title) +
        "</strong><p>" +
        esc(fmtEta(nm.m.after - s.ms / 1000)) +
        "</p></div></div></div>";
    } else if (!s.future && s.days >= 365) {
      teaser =
        '<div class="card reveal"><div class="card-kicker mint">Milepæle</div>' +
        "<p>Du har nået et helt års milepæl. Historikken står. Fortsæt som du har gjort.</p></div>";
    }

    const inst =
      !isStandalone() && !state.dismissed.install
        ? '<div class="install install-late reveal" id="install-banner">' +
          '<div><strong>Føj til hjemmeskærm</strong><p>I Safari: tryk på Dele-ikonet, og vælg <em>Føj til hjemmeskærm</em>. Så virker Snusfri som en rigtig app — også offline.</p></div>' +
          '<button type="button" class="x" data-act="dismiss-install" aria-label="Luk banner">✕</button></div>'
        : "";

    const ci = todayCheckin();
    const quote = reasonsSwipeHtml("Din grund");
    const showCompassFirst = info.future || (info.phase && info.phase.peak) || info.hours < 168;
    const compass = compassHomeHtml(info);
    const context = contextualNowHtml(info);
    const checkinDone =
      ci && context.indexOf("data-act=\"checkin\"") < 0
        ? '<div class="card reveal"><div class="card-kicker mint">Dagens check-in</div>' +
          "<p>Tak. Humør i dag: <strong>" +
          esc((MOODS.find(function (m) { return m.id === ci.mood; }) || {}).face || "") +
          " " +
          esc((MOODS.find(function (m) { return m.id === ci.mood; }) || {}).label || "") +
          "</strong>" +
          (checkinStreak() > 1 ? " · " + checkinStreak() + " dage i træk" : "") +
          ".</p></div>"
        : "";

    /* First fold: hero → how am I (compass in week 1) → what helps now → compact money.
       One contextual card after. Reasons, teaser, install sit below the fold. */
    el.innerHTML =
      '<section class="hero' +
      (showCompassFirst ? " hero-compact" : "") +
      '">' +
      '<img class="hero-img" src="icons/hero.jpg" srcset="icons/hero@2x.jpg 780w, icons/hero.jpg 1170w" sizes="(min-width: 560px) 430px, 100vw" alt="">' +
      '<div class="hero-glow"></div><div class="hero-vignette"></div>' +
      (s.future ? "" : journeyTrees(s.days, {})) +
      '<div class="hero-content">' +
      '<p class="hero-kicker" id="hero-kicker">' +
      (s.future ? "Starter om" : "Snusfri i") +
      "</p>" +
      '<div class="hero-days' +
      (manyDays ? " many" : "") +
      '"><span class="hero-days-num" id="live-days">' +
      esc(fmtNum(t.days, 0)) +
      '</span><span class="hero-days-unit" id="live-unit">' +
      plural(t.days, "dag", "dage") +
      "</span></div>" +
      '<div class="bubbles">' +
      '<div class="bubble"><strong id="live-h">' +
      pad(t.hours) +
      "</strong><span>timer</span></div>" +
      '<div class="bubble"><strong id="live-m">' +
      pad(t.mins) +
      "</strong><span>min</span></div>" +
      '<div class="bubble"><strong id="live-s">' +
      pad(t.secs) +
      "</strong><span>sek</span></div>" +
      "</div></div></section>" +
      '<div class="sheet">' +
      (showCompassFirst ? compass : "") +
      nowHelpHtml() +
      moneyCompactHtml(s) +
      context +
      (showCompassFirst ? "" : compass) +
      quote +
      checkinDone +
      insightsTeaserHtml() +
      teaser +
      inst +
      "</div>";
  }

  function periodCell(n, label) {
    return (
      '<div class="period"><div class="v">' +
      esc(fmtKr(n, 0)) +
      '</div><div class="l">' +
      esc(label) +
      "</div></div>"
    );
  }

  /* ---------------- render: health ---------------- */
  function renderHealth() {
    const el = $("#view-health");
    const s = stats();
    const sec = s.ms / 1000;
    const items = MILESTONES.map((m, i) => {
      const done = sec >= m.after;
      const next = !done && (i === 0 || sec >= MILESTONES[i - 1].after);
      const prev = i ? MILESTONES[i - 1].after : 0;
      const p = done ? 1 : Math.max(0, Math.min(1, (sec - prev) / (m.after - prev)));
      let cls = done ? "done" : next ? "current" : "";
      let meta = "";
      if (done) meta = '<span class="pill">Fuldført</span>';
      else if (next) {
        meta =
          '<span class="bar" style="--w:' +
          (p * 100).toFixed(1) +
          '%"><i></i></span><span>' +
          Math.round(p * 100) +
          "% · " +
          esc(fmtEta(m.after - sec)) +
          "</span>";
      } else {
        meta = "<span>" + esc(fmtEta(m.after - sec)) + "</span>";
      }
      return (
        '<div class="tl-item ' +
        cls +
        '"><div class="tl-rail"><div class="tl-dot"></div></div>' +
        '<div class="tl-body"><h3>' +
        esc(m.title) +
        "</h3><p>" +
        esc(m.body) +
        '</p><div class="tl-meta">' +
        meta +
        "</div></div></div>"
      );
    }).join("");

    const badges = ACHIEVEMENTS.map((a) => {
      const on = !!state.achievements[a.id];
      const when = on ? fmtDate(state.achievements[a.id], { day: "numeric", month: "short" }) : "";
      return (
        '<div class="badge' +
        (on ? " on" : "") +
        '" title="' +
        esc(a.title) +
        '"><div class="ico">' +
        a.ico +
        "</div><strong>" +
        esc(a.title) +
        "</strong>" +
        (when ? '<span style="font-size:0.62rem;color:var(--text-mute)">' + esc(when) + "</span>" : "") +
        "</div>"
      );
    }).join("");

    const unlocked = Object.keys(state.achievements).length;

    const phases = COMPASS.map(function (ph) {
      const cur = compassPhase();
      const on = cur.phase.id === ph.id;
      const done = cur.hours >= ph.toH;
      return (
        '<div class="tl-item' +
        (done ? " done" : on ? " current now" : "") +
        '"><div class="tl-rail"><div class="tl-dot"></div></div>' +
        '<div class="tl-body"><h3>' +
        esc(ph.kicker) +
        "</h3><p>" +
        esc(ph.lead) +
        "</p></div></div>"
      );
    }).join("");

    const sleepAdvice =
      '<div class="card"><div class="card-kicker">Søvn og appetit</div>' +
      "<p>Søvnproblemer den første uge er forventelige — nogle vågner mange gange, og det letter ofte efter 1–2 uger. Mindre koffein om aftenen, vand, en kort gåtur. Appetit kan stige; ved rygestop er gennemsnitlig vægtøgning omkring 4–5 kg efter 12 måneder, og risikoen er sandsynlig også ved snusstop. Det er ikke alles historie, og det her er ikke et slankeprogram.</p>" +
      '<div class="field mt"><label>Opvågninger i nat (valgfrit)</label>' +
      '<div class="stepper"><button type="button" data-act="step" data-dir="-1" data-target="sleep-wakes" data-amt="1">−</button>' +
      '<input id="sleep-wakes" inputmode="numeric" value="' +
      esc(String((state.sleepLog[todayISO(new Date())] || {}).wakes || 0)) +
      '">' +
      '<button type="button" data-act="step" data-dir="1" data-target="sleep-wakes" data-amt="1">+</button></div></div>' +
      '<button type="button" class="btn btn-ghost-mint btn-sm" data-act="sleep-save">Gem søvn</button>' +
      '<div class="field mt"><label for="weight-kg">Vægt i dag, kg (valgfri — kun for dig)</label>' +
      '<input id="weight-kg" class="input" inputmode="decimal" placeholder="Fx 78,5" value="' +
      esc(String(((state.weightLog || {})[todayISO(new Date())] || {}).kg || "")) +
      '">' +
      '<p class="hint">Ikke et slankeprogram. Et diskret tal, hvis du selv vil følge det.</p></div>' +
      '<button type="button" class="btn btn-ghost-mint btn-sm" data-act="weight-save">Gem vægt</button>' +
      '<p class="fine-src">Kilder: Stoplinien, Helsenorge, og et dansk brugerforløb. Alle reagerer forskelligt.</p></div>';

    el.innerHTML =
      '<div class="page">' +
      '<h1 class="page-title">Sundhed</h1>' +
      '<p class="page-sub">Hvor du er i forløbet — ærligt, med spænd, ikke løfter. Milepælene under er vejledende, ikke medicinsk rådgivning.</p>' +
      compassCardHtml({ full: true }) +
      (s.future ? "" : journeyTrees(s.days, { wide: true })) +
      day28Html(s, { health: true, force: true }) +
      '<div class="section-label">Abstinens-forløbet</div>' +
      '<div class="card"><div class="timeline compass-timeline">' +
      phases +
      "</div></div>" +
      sleepAdvice +
      '<div class="section-label">Helbredsmilepæle</div>' +
      '<div class="card"><div class="timeline">' +
      items +
      "</div></div>" +
      '<div class="section-label">Mærker · ' +
      unlocked +
      " af " +
      ACHIEVEMENTS.length +
      "</div>" +
      '<div class="badge-grid">' +
      badges +
      "</div></div>";
  }

  /* ---------------- render: craving ---------------- */
  function cravingChart(cravings) {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = todayISO(d);
      const n = cravings.filter((c) => todayISO(new Date(c.at)) === iso).length;
      days.push({
        iso: iso,
        n: n,
        label: new Intl.DateTimeFormat("da-DK", { weekday: "narrow" }).format(d)
      });
    }
    const max = Math.max(1, ...days.map((d) => d.n));
    const w = 320,
      h = 110,
      padL = 4,
      padB = 18,
      padT = 8;
    const bw = (w - padL * 2) / days.length;
    const bars = days
      .map((d, i) => {
        const bh = d.n ? (d.n / max) * (h - padB - padT) : 0;
        const x = padL + i * bw + bw * 0.18;
        const y = h - padB - bh;
        const col = d.n ? "#E07A5F" : "rgba(255,255,255,0.08)";
        return (
          '<rect x="' +
          x.toFixed(1) +
          '" y="' +
          y.toFixed(1) +
          '" width="' +
          (bw * 0.64).toFixed(1) +
          '" height="' +
          Math.max(d.n ? 3 : 0, bh).toFixed(1) +
          '" rx="3" fill="' +
          col +
          '"></rect>' +
          '<text x="' +
          (x + bw * 0.32).toFixed(1) +
          '" y="' +
          (h - 4) +
          '" text-anchor="middle" fill="#6E7D75" font-size="9" font-family="Outfit,sans-serif">' +
          esc(d.label) +
          "</text>"
        );
      })
      .join("");
    return (
      '<svg class="chart" viewBox="0 0 ' +
      w +
      " " +
      h +
      '" aria-label="Trange de sidste 14 dage">' +
      bars +
      "</svg>" +
      '<div class="chart-legend"><span>14 dage siden</span><span>I dag</span></div>'
    );
  }

  function triggerBars(cravings) {
    const counts = {};
    cravings.forEach((c) => {
      const k = c.trigger || "Andet";
      counts[k] = (counts[k] || 0) + 1;
    });
    const rows = Object.keys(counts)
      .map((k) => ({ k: k, n: counts[k] }))
      .sort((a, b) => b.n - a.n);
    if (!rows.length) return '<p class="empty">Ingen trange logget endnu.</p>';
    const max = rows[0].n;
    return (
      '<div class="hbars">' +
      rows
        .map(
          (r) =>
            '<div class="hbar"><div class="lab">' +
            esc(r.k) +
            '</div><div class="track"><i style="--w:' +
            ((r.n / max) * 100).toFixed(0) +
            '%"></i></div><div class="n">' +
            r.n +
            "</div></div>"
        )
        .join("") +
      "</div>"
    );
  }

  function renderCraving() {
    const el = $("#view-craving");
    const list = state.cravings || [];
    const resisted = list.filter((c) => c.resisted).length;
    const weekAgo = Date.now() - 7 * 864e5;
    const thisWeek = list.filter((c) => new Date(c.at).getTime() >= weekAgo).length;
    const avg =
      list.length > 0
        ? list.reduce((a, c) => a + (Number(c.intensity) || 0), 0) / list.length
        : 0;

    const recent = list
      .slice()
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 8)
      .map((c) => {
        return (
          '<div class="history-item"><div><strong>' +
          (c.resisted ? "Klarte den" : "Gav efter") +
          "</strong> · " +
          esc(c.trigger || "Andet") +
          ' <span class="d">styrke ' +
          esc(String(c.intensity || "–")) +
          "</span>" +
          (c.usedBreathing ? ' <span class="pill">Åndedræt</span>' : "") +
          (c.usedWave ? ' <span class="pill gold">Bølge</span>' : "") +
          '</div><div class="d">' +
          esc(fmtDateTime(c.at)) +
          "</div></div>"
        );
      })
      .join("");

    el.innerHTML =
      '<div class="page">' +
      '<h1 class="page-title">Trang</h1>' +
      '<p class="page-sub">En bølge, ikke en kommando. Den værste del varer oftest 3–4 minutter. Du rider den — du vinder den ikke i ét hug.</p>' +
      '<div class="sos-hero">' +
      '<button class="pulse-btn" data-act="sos">Jeg har<br>en trang</button>' +
      '<div class="row2" style="margin-top:0.4rem;gap:0.5rem">' +
      '<button class="btn btn-coral btn-block btn-wrap" data-act="start-wave">Rid bølgen · 3–4 min.</button>' +
      '<button class="btn btn-gold btn-block btn-wrap" data-act="bare-en">Bare én pose?</button>' +
      "</div></div>" +
      toolboxHtml() +
      '<div class="mini-stats">' +
      '<div class="mini-stat"><div class="v">' +
      resisted +
      '</div><div class="l">trange klaret</div></div>' +
      '<div class="mini-stat sky"><div class="v">' +
      (Number(state.wavesRidden) || 0) +
      '</div><div class="l">bølger redet</div></div>' +
      '<div class="mini-stat gold"><div class="v">' +
      thisWeek +
      '</div><div class="l">de sidste 7 dage</div></div>' +
      '<div class="mini-stat sky"><div class="v">' +
      (avg ? fmtNum(avg, 1) : "–") +
      '</div><div class="l">gns. styrke</div></div>' +
      '<div class="mini-stat lav"><div class="v">' +
      list.length +
      '</div><div class="l">i alt logget</div></div>' +
      "</div>" +
      '<div class="section-label">Sidste 14 dage</div>' +
      '<div class="card chart-wrap">' +
      cravingChart(list) +
      "</div>" +
      '<div class="section-label">Efter udløser</div>' +
      '<div class="card">' +
      triggerBars(list) +
      "</div>" +
      '<div class="section-label">Seneste</div>' +
      '<div class="card">' +
      (recent || '<p class="empty">Når du logger en trang, vises den her.</p>') +
      "</div></div>";
  }


  /* ---------------- render: goals ---------------- */
  function goalEta(price, s) {
    const left = Number(price) - s.money;
    if (left <= 0) return "Nået";
    if (!(s.per.day > 0)) return "";
    const days = left / s.per.day;
    if (days < 1) return "Forventet i dag";
    if (days < 2) return "Forventet i morgen";
    const dt = new Date(Date.now() + days * 86400000);
    return "Forventet " + fmtDate(dt);
  }

  function renderGoals() {
    const el = $("#view-goals");
    const s = stats();
    const goals = (state.goals || []).slice().sort((a, b) => a.price - b.price);
    const cards = goals.length
      ? goals
          .map((g) => {
            const p = Math.max(0, Math.min(1, s.money / Math.max(1, Number(g.price))));
            const reached = !!g.reachedAt || p >= 1;
            const left = Math.max(0, Number(g.price) - s.money);
            return (
              '<div class="card goal' +
              (reached ? " reached" : "") +
              '"><div class="goal-inner">' +
              '<div class="goal-top"><h3>' +
              esc(g.name) +
              "</h3><div class=\"price\">" +
              esc(fmtKr(g.price, 0)) +
              "</div></div>" +
              '<div class="goal-bar' +
              (reached ? " done" : "") +
              '" style="--w:' +
              (p * 100).toFixed(1) +
              '%"><i></i></div>' +
              '<div class="goal-meta"><span>' +
              (reached
                ? '<span class="pill">Nået' +
                  (g.reachedAt ? " · " + fmtDate(g.reachedAt, { day: "numeric", month: "short" }) : "") +
                  "</span>"
                : esc(fmtKr(s.money, 0)) + " · " + esc(fmtKr(left, 0)) + " tilbage") +
              "</span><span>" +
              (reached ? "" : esc(goalEta(g.price, s))) +
              "</span></div>" +
              (function () {
                const rs = reasonsList().find(function (r) { return r.id === g.reasonId; });
                return rs ? '<p class="goal-reason">Knyttet til: ' + esc(rs.text) + "</p>" : "";
              })() +
              '<div class="goal-actions"><button class="btn btn-ghost btn-sm" data-act="edit-goal" data-id="' +
              esc(g.id) +
              '">Rediger</button>' +
              '<button class="btn btn-ghost btn-sm" data-act="del-goal" data-id="' +
              esc(g.id) +
              '">Fjern</button></div>' +
              "</div></div>"
            );
          })
          .join("")
      : '<div class="card empty"><div class="big">🎯</div>Tilføj noget, du sparer op til — en weekend, en computer, en gave.</div>';

    el.innerHTML =
      '<div class="page">' +
      '<h1 class="page-title">Mål</h1>' +
      '<p class="page-sub">Det, du ikke længere bruger på snus, kan blive til noget, du faktisk vil have.</p>' +
      '<div class="card">' +
      '<div class="card-kicker gold">I det her tempo</div>' +
      '<div class="mini-stats">' +
      '<div class="mini-stat gold"><div class="v">' +
      esc(fmtKr(s.per.month, 0)) +
      '</div><div class="l">pr. måned</div></div>' +
      '<div class="mini-stat gold"><div class="v">' +
      esc(fmtKr(s.per.year, 0)) +
      '</div><div class="l">pr. år</div></div></div></div>' +
      '<div class="section-label">Sparemål</div>' +
      cards +
      '<button class="btn btn-gold btn-block mt-2" data-act="add-goal">+ Tilføj mål</button>' +
      "</div>";
  }

  /* ---------------- render: more + subpages ---------------- */
  function renderMore() {
    const el = $("#view-more");
    if (morePage === "journal") return renderJournal(el);
    if (morePage === "taper") return renderTaper(el);
    if (morePage === "history") return renderHistory(el);
    if (morePage === "settings") return renderSettings(el);
    if (morePage === "about") return renderAbout(el);
    if (morePage === "install") return renderInstall(el);
    if (morePage === "plans") return renderPlans(el);
    if (morePage === "party") return renderPartyPage(el);
    if (morePage === "reasons") return renderReasonsPage(el);
    if (morePage === "buddy") return renderBuddy(el);
    if (morePage === "help") return renderHelp(el);
    if (morePage === "days") return renderDays(el);
    if (morePage === "inbox") return renderInbox(el);
    if (morePage === "nf") return renderNicotineFree(el);
    if (morePage === "data") return renderData(el);
    if (morePage === "insights") return renderInsights(el);
    if (morePage === "recap") return renderRecap(el);
    if (morePage === "letter") return renderLetter(el);

    const ciN = (state.checkins || []).length;
    const slipN = (state.slips || []).length;
    const streakN = (state.streaks || []).length;
    const planN = (state.ifThenPlans || []).length;
    const unread = unreadInbox();
    el.innerHTML =
      '<div class="page">' +
      '<h1 class="page-title">Mere</h1>' +
      '<p class="page-sub">Værktøjer, hjælp, historik og dine data.</p>' +
      '<div class="section-label">Værktøjer</div>' +
      '<div class="rows">' +
      row("plans", "🗺️", "", "Hvis-så-planer", planN ? planN + " planer" : "Bind triggere til en handling", "") +
      row("party", "🌙", "gold", "Fest-mode", state.activeParty && !state.activeParty.endedAt ? "Aktiv nu" : "Plan lavet ædru", "") +
      row("reasons", "✍️", "lav", "Mine grunde", reasonsList().length ? reasonsList().length + " grunde" : "Ét swipe væk", "") +
      row("buddy", "🤝", "sky", "Makker", (state.buddy && state.buddy.name) ? state.buddy.name : "Én livline, ingen feed", "") +
      row("share", "📤", "gold", "Del dit overblik", "Dage og sparede kroner — som et glansbillede", "share-status") +
      row("insights", "🔭", "sky", "Indsigt", "Mønstre i dine egne log — med forbehold", "") +
      row("recap", "📅", "mint", "Ugens overblik", "Ugen indtil nu", "") +
      row("letter", "✉️", "gold", "Brev til mig", letterState().written ? (letterState().unlocked ? "Klar til at læse" : "Åbnes på dag 30") : "Skriv til dig selv om 30 dage", "") +
      "</div>" +
      '<div class="section-label">Hjælp</div>' +
      '<div class="rows">' +
      row("help", "☎️", "", "Stoplinien & hjælp", "80 31 31 31 · gratis rådgivning", "") +
      row("inbox", "🔔", "gold", "Beskeder", unread ? unread + " ulæste" : "Varsler og rolige påmindelser", "") +
      "</div>" +
      '<div class="section-label">Forløb</div>' +
      '<div class="rows">' +
      row("journal", "📓", "", "Dagbog", ciN ? ciN + " check-ins" : "Log dit humør", "") +
      row("taper", "📉", "gold", "Nedtrapning", state.taper && state.taper.enabled ? "Aktiv plan" : "Valgfri, med fast stopdato", "") +
      row("nf", "🍃", "", "Nikotinfri poser", state.nicotineFree && state.nicotineFree.enabled ? "Aktiv, med udløb" : "Midlertidig erstatning", "") +
      row("history", "🌊", "coral", "Tilbagefald & historik", slipN || streakN ? slipN + " slip · " + (streakN + 1) + " perioder" : "Log et slip uden at miste alt", "") +
      row("days", "📅", "sky", "Dine dage", "Retbare dage · tom dag er nul poser", "") +
      "</div>" +
      '<div class="section-label">Konto</div>' +
      '<div class="rows">' +
      row("settings", "⚙️", "sky", "Indstillinger", "Dato, forbrug, pris, grunde", "") +
      row("data", "💾", "", "Data & sikkerhedskopi", "Eksporter, importer, gendan", "") +
      row("install", "📲", "lav", "Føj til hjemmeskærm", "Brug den som en rigtig app", "") +
      row("about", "🍃", "", "Om Snusfri", "Privat, offline, uden konto", "") +
      "</div>" +
      '<button class="btn btn-danger btn-block mt-2" data-act="reset-all">Nulstil alt</button>' +
      "</div>";
  }
  function row(act, ico, tone, title, sub, customAct) {
    return (
      '<button class="row" data-act="' +
      (customAct || "more") +
      '" data-page="' +
      esc(act) +
      '"><div class="ico-wrap ' +
      tone +
      '"><span>' +
      ico +
      '</span></div><div class="txt"><strong>' +
      esc(title) +
      "</strong><span>" +
      esc(sub) +
      '</span></div><div class="chev">›</div></button>'
    );
  }
  function subWrap(title, body) {
    return (
      '<div class="page"><div class="subhead">' +
      '<button class="back" data-act="more-back" aria-label="Tilbage">‹</button>' +
      "<h1>" +
      esc(title) +
      "</h1></div>" +
      body +
      "</div>"
    );
  }

  function renderJournal(el) {
    const list = (state.checkins || [])
      .slice()
      .sort((a, b) => (a.date < b.date ? 1 : -1));
    const streak = checkinStreak();
    const items = list.length
      ? list
          .map((c) => {
            const m = MOODS.find((x) => x.id === c.mood) || {};
            return (
              '<div class="entry"><div class="face">' +
              (m.face || "·") +
              '</div><div class="txt"><div class="when">' +
              esc(fmtDate(c.date)) +
              " · " +
              esc(m.label || "") +
              (c.craving ? " · trang " + c.craving + "/5" : "") +
              "</div>" +
              (c.note ? "<p>" + esc(c.note) + "</p>" : "") +
              (c.sleepWakes ? "<p>Søvn: " + esc(String(c.sleepWakes)) + " opvågninger</p>" : "") +
              ((state.weightLog && state.weightLog[c.date] && state.weightLog[c.date].kg)
                ? "<p>Vægt: " + esc(String(state.weightLog[c.date].kg)) + " kg</p>"
                : "") +
              '</div><button class="btn btn-ghost btn-sm" data-act="checkin-edit" data-date="' +
              esc(c.date) +
              '">Ret</button></div>'
            );
          })
          .join("")
      : '<div class="card empty-rich"><div class="big">📓</div><p>Ingen check-ins endnu. Et kort tjek i dag — det tager under ti sekunder, og det er kun for dig.</p></div>';
    const today = todayCheckin();
    el.innerHTML = subWrap(
      "Dagbog",
      '<div class="card"><div class="mini-stats">' +
        '<div class="mini-stat"><div class="v">' +
        streak +
        '</div><div class="l">dage i træk</div></div>' +
        '<div class="mini-stat gold"><div class="v">' +
        list.length +
        '</div><div class="l">i alt</div></div></div>' +
        (today
          ? "<p class=\"mt muted\">Du har checket ind i dag.</p>"
          : '<button class="btn btn-primary btn-block mt" data-act="checkin">Check ind i dag</button>') +
        '<button class="btn btn-ghost btn-block mt" data-act="checkin-past">Tilføj en tidligere dag</button>' +
        "</div>" +
        '<div class="section-label">Historik</div><div class="card">' +
        items +
        "</div>"
    );
  }

  function renderTaper(el) {
    const t = state.taper || {};
    if (!t.enabled) {
      el.innerHTML = subWrap(
        "Nedtrapning",
        '<p class="page-sub">Hvis kold tyrker ikke er vejen lige nu, kan du træppe ned over nogle uger. Hver dag får du en ramme — og du logger, hvad du faktisk brugte.</p>' +
          '<div class="field"><label>Start (poser pr. dag)</label>' +
          '<div class="stepper"><button type="button" data-act="step" data-dir="-1" data-target="tp-start">−</button>' +
          '<input id="tp-start" inputmode="decimal" value="' +
          esc(String(Math.round(rates().pouchesPerDay) || t.startPouches || 12)) +
          '">' +
          '<button type="button" data-act="step" data-dir="1" data-target="tp-start">+</button></div></div>' +
          '<div class="field"><label>Mål (poser pr. dag)</label>' +
          '<div class="stepper"><button type="button" data-act="step" data-dir="-1" data-target="tp-end">−</button>' +
          '<input id="tp-end" inputmode="decimal" value="' +
          esc(String(t.targetPouches || 0)) +
          '">' +
          '<button type="button" data-act="step" data-dir="1" data-target="tp-end">+</button></div></div>' +
          '<div class="field"><label>Varighed (uger)</label>' +
          '<div class="stepper"><button type="button" data-act="step" data-dir="-1" data-target="tp-weeks">−</button>' +
          '<input id="tp-weeks" inputmode="numeric" value="' +
          esc(String(t.weeks || 6)) +
          '">' +
          '<button type="button" data-act="step" data-dir="1" data-target="tp-weeks">+</button></div></div>' +
          '<div class="field"><label>Fast stopdato</label>' +
          '<input id="tp-stop" class="input" type="date" value="' +
          esc(t.stopDate || "") +
          '"></div>' +
          '<div class="field"><label>Styrke nu (mg pr. pose)</label>' +
          '<div class="stepper"><button type="button" data-act="step" data-dir="-1" data-target="tp-mg">−</button>' +
          '<input id="tp-mg" inputmode="decimal" value="' +
          esc(String(t.strengthMg || state.profile.nicotineMg || 8)) +
          '">' +
          '<button type="button" data-act="step" data-dir="1" data-target="tp-mg">+</button></div>' +
          '<p class="hint">Styrken må falde. Antallet af poser bør ikke stige — et skift til lavere mg får ellers ofte folk til at tage flere.</p></div>' +
          '<div class="callout">At stoppe brat har ifølge forskningen bedst effekt. Nedtrapning er et valg, ikke et krav. Hvis du bruger nikotinerstatning som lægemiddel, så tal med apotek eller Stoplinien — den almindeligste fejl er for svag dosis i for kort tid.</div>' +
          '<button class="btn btn-primary btn-block mt" data-act="taper-start">Start plan</button>' +
          '<p class="hint mt">Når du når målet, kan du lade den snusfri tæller tage over.</p>'
      );
      return;
    }
    const a = taperAllowance(new Date());
    const used = Number((t.logs || {})[todayISO(new Date())] || 0);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      const day = d.getDay(); // 0 sun
      const mondayBased = (day + 6) % 7;
      d.setDate(d.getDate() - mondayBased + i);
      const iso = todayISO(d);
      const allow = taperAllowance(d);
      const u = t.logs ? Number(t.logs[iso] || 0) : 0;
      const isToday = iso === todayISO(new Date());
      const label = new Intl.DateTimeFormat("da-DK", { weekday: "short" }).format(d);
      let cls = isToday ? "today" : "";
      if (u > 0 && allow && u > allow.allow) cls += " over";
      else if (u > 0) cls += " ok";
      days.push(
        '<div class="day-cell ' +
          cls +
          '"><div class="d">' +
          esc(label.replace(".", "")) +
          '</div><div class="n">' +
          fmtNum(u, u % 1 ? 1 : 0) +
          "</div></div>"
      );
    }
    const progress = a ? Math.max(0, Math.min(1, a.day / a.totalDays)) : 0;
    el.innerHTML = subWrap(
      "Nedtrapning",
      '<div class="card"><div class="allowance">' +
        '<div class="card-kicker mint">Dagens ramme</div>' +
        '<div class="big">' +
        (a ? fmtNum(a.allow, a.allow % 1 ? 1 : 0) : "–") +
        '</div><div class="sub">poser · du har logget <strong>' +
        fmtNum(used, used % 1 ? 1 : 0) +
        "</strong> i dag</div></div>" +
        '<div class="goal-bar" style="--w:' +
        (progress * 100).toFixed(1) +
        '%"><i></i></div>' +
        '<div class="goal-meta"><span>Dag ' +
        (a ? Math.max(0, a.day) + 1 : 0) +
        " af " +
        (a ? a.totalDays : 0) +
        "</span><span>" +
        (a && a.done ? "Planen er færdig" : "") +
        "</span></div>" +
        '<div class="week-grid">' +
        days.join("") +
        "</div>" +
        '<div class="field mt-2"><label>Log poser i dag</label>' +
        '<div class="stepper"><button type="button" data-act="step" data-dir="-1" data-target="tp-used" data-amt="1">−</button>' +
        '<input id="tp-used" inputmode="decimal" value="' +
        esc(String(used)) +
        '">' +
        '<button type="button" data-act="step" data-dir="1" data-target="tp-used" data-amt="1">+</button></div></div>' +
        '<button class="btn btn-primary btn-block" data-act="taper-log">Gem dagens antal</button>' +
        "</div>" +
        (t.stopDate ? '<p class="hint mt">Stopdato: ' + esc(fmtDate(t.stopDate)) + "</p>" : '<div class="callout coral mt">Planen mangler en fast stopdato. Tilføj én under start, eller afslut og opret forfra.</div>') +
        (function () {
          const logs = t.logs || {};
          const days = Object.keys(logs);
          if (days.length < 2) return "";
          const last = days.sort().slice(-1)[0];
          const prev = days.sort().slice(-2, -1)[0];
          if (prev && Number(logs[last]) > Number(logs[prev]) && (t.strengthMg || 0) < (state.profile.nicotineMg || 0)) {
            return '<div class="callout coral mt">Du har logget flere poser efter at have sænket styrken. Det er en klassisk fælde. Hold antallet, og sænk evt. hyppigheden først.</div>';
          }
          return "";
        })() +
        '<p class="hint mt">En dag uden indtastning tæller som nul poser, ikke som dit gamle forbrug. Tryk på en dag under «Dine dage» for at rette.</p>' +
        '<div class="callout mt">Nikotinerstatning som lægemiddel kan muligvis hjælpe — tal med apotek, læge eller Stoplinien. Appen udskriver ikke medicin.</div>' +
        '<button class="btn btn-ghost btn-block mt" data-act="taper-stop">Afslut planen</button>'
    );
  }

  function renderHistory(el) {
    const s = stats();
    const current = state.profile.quitAt
      ? {
          start: state.profile.quitAt,
          end: null,
          days: s.days,
          current: true
        }
      : null;
    const all = (state.streaks || [])
      .slice()
      .sort((a, b) => new Date(b.start) - new Date(a.start));
    const periods = (current ? [current] : []).concat(all);
    const periodHtml = periods.length
      ? periods
          .map((p) => {
            const days = p.days != null ? p.days : 0;
            return (
              '<div class="history-item"><div><strong>' +
              (p.current ? "Nuværende periode" : "Tidligere periode") +
              "</strong><div class=\"d\">" +
              esc(fmtDate(p.start)) +
              " – " +
              (p.end ? esc(fmtDate(p.end)) : "i dag") +
              "</div></div><div><strong>" +
              esc(fmtNum(Math.floor(days), 0)) +
              "</strong> <span class=\"d\">" +
              plural(Math.floor(days), "dag", "dage") +
              "</span></div></div>"
            );
          })
          .join("")
      : '<p class="empty">Ingen perioder endnu.</p>';

    const slips = (state.slips || [])
      .slice()
      .sort((a, b) => new Date(b.at) - new Date(a.at));
    const slipHtml = slips.length
      ? slips
          .map((x) => {
            return (
              '<div class="history-item"><div><strong>' +
              (x.reset ? "Ny start" : "Slip") +
              "</strong> " +
              (x.pouches ? "· " + esc(String(x.pouches)) + " poser" : "") +
              (x.place || x.alcohol || x.feeling
                ? "<div class=\"d\">" +
                  esc([x.place, x.alcohol === "yes" ? "alkohol" : x.alcohol === "no" ? "uden alkohol" : "", x.feeling].filter(Boolean).join(" · ")) +
                  "</div>"
                : "") +
              (x.nextTime ? "<div class=\"d\">Næste gang: " + esc(x.nextTime) + "</div>" : "") +
              (x.note ? "<div class=\"d\">" + esc(x.note) + "</div>" : "") +
              '</div><div class="d">' +
              esc(fmtDateTime(x.at)) +
              "</div></div>"
            );
          })
          .join("")
      : '<p class="empty">Ingen slip logget. Hvis det sker, kan du registrere det her — uden at miste din historie.</p>';

    el.innerHTML = subWrap(
      "Tilbagefald & historik",
      '<p class="page-sub">Et slip definerer ikke rejsen, og det ødelægger ikke din historik. Streaken er én måling, ikke din værdi. Start igen nu — ikke i morgen.</p>' +
        '<button class="btn btn-coral btn-block" data-act="slip">Log et slip</button>' +
        '<button class="btn btn-ghost btn-block mt" data-act="goto-days">Ret en tidligere dag</button>' +
        '<div class="section-label">Snusfri-perioder</div><div class="card">' +
        periodHtml +
        "</div>" +
        '<div class="section-label">Slip</div><div class="card">' +
        slipHtml +
        "</div>"
    );
  }

  function renderSettings(el) {
    const p = state.profile;
    const cansOn = p.habitMode !== "pouches";
    el.innerHTML = subWrap(
      "Indstillinger",
      '<div class="field"><label for="st-quit">Stopdato</label>' +
        '<input id="st-quit" class="input" type="datetime-local" value="' +
        esc(toLocalInput(p.quitAt || new Date())) +
        '"></div>' +
        '<div class="seg" id="st-mode">' +
        '<button type="button" data-act="ob-mode" data-mode="cans" class="' +
        (cansOn ? "on" : "") +
        '">Dåser pr. uge</button>' +
        '<button type="button" data-act="ob-mode" data-mode="pouches" class="' +
        (cansOn ? "" : "on") +
        '">Poser pr. dag</button></div>' +
        '<div class="field" id="ob-cans-field" style="' +
        (cansOn ? "" : "display:none") +
        '"><label>Dåser pr. uge</label>' +
        '<input id="ob-cans" class="input" inputmode="decimal" value="' +
        esc(String(p.cansPerWeek)) +
        '"></div>' +
        '<div class="field" id="ob-pouches-field" style="' +
        (cansOn ? "display:none" : "") +
        '"><label>Poser pr. dag</label>' +
        '<input id="ob-pouches" class="input" inputmode="decimal" value="' +
        esc(String(p.pouchesPerDay)) +
        '"></div>' +
        '<div class="row2">' +
        '<div class="field"><label>Pris pr. dåse (kr)</label>' +
        '<input id="ob-price" class="input" inputmode="decimal" value="' +
        esc(String(p.pricePerCan)) +
        '"></div>' +
        '<div class="field"><label>Poser pr. dåse</label>' +
        '<input id="ob-ppc" class="input" inputmode="decimal" value="' +
        esc(String(p.pouchesPerCan)) +
        '"></div></div>' +
        '<div class="field"><label>Nikotin pr. pose (mg)</label>' +
        '<input id="ob-nic" class="input" inputmode="decimal" value="' +
        esc(String(p.nicotineMg)) +
        '"></div>' +
        '<div class="field"><label>Min motivation</label>' +
        '<textarea id="ob-motivation" class="input" maxlength="400">' +
        esc(p.motivation || "") +
        "</textarea>" +
        '<p class="hint">Dine fulde grunde redigerer du under <button class="linkish" data-act="goto-reasons">Mine grunde</button>.</p></div>' +
        '<div class="field mt-2"><label>Udseende</label></div>' +
        '<div class="theme-seg" role="group" aria-label="Udseende">' +
        '<button type="button" data-act="set-theme" data-theme="system" class="' +
        ((state.theme || "system") === "system" ? "on" : "") +
        '">System</button>' +
        '<button type="button" data-act="set-theme" data-theme="dark" class="' +
        (state.theme === "dark" ? "on" : "") +
        '">Mørk</button>' +
        '<button type="button" data-act="set-theme" data-theme="light" class="' +
        (state.theme === "light" ? "on" : "") +
        '">Lys</button></div>' +
        '<p class="hint">Følger telefonen, medmindre du vælger selv. Fest-mode, trang-surfer og onboarding bliver mørke — de er lavet til ro og kontrast.</p>' +
        '<button class="btn btn-primary btn-block mt-2" data-act="settings-save">Gem ændringer</button>'
    );
  }

  function renderAbout(el) {
    el.innerHTML = subWrap(
      "Om Snusfri",
      '<div class="card"><p>Snusfri er en lille, privat app til at holde op med snus. Den tæller tiden, pengene og de milepæle, kroppen typisk går igennem — og den er der, når trangen kommer.</p>' +
        '<div class="hr"></div>' +
        "<p>Al data gemmes kun på denne enhed, i din browsers lager. Der er ingen konto, ingen sky, ingen analyse. Tag en eksport-kopi, hvis du skifter telefon.</p>" +
        '<div class="hr"></div>' +
        '<p class="fineprint">Snusfri er ikke medicinsk rådgivning og erstatter ikke samtale med en læge eller anden sundhedsfaglig. Milepælene er vejledende og formuleret forsigtigt — alle reagerer forskelligt.</p>' +
        '<p class="fineprint mt">Som web-app kan Snusfri ikke lægge en rigtig widget på iOS-hjemmeskærmen — det kræver en native skal. Forsiden er lavet som et kompakt overblik, og beskederne i appen viser dage og sparede kroner, når du åbner den.</p>' +
        '<p class="fineprint mt">Version 1.3 · november 2026 · Service worker v10. Lavet til at ligge på din hjemmeskærm.</p></div>'
    );
  }

  function renderInstall(el) {
    el.innerHTML = subWrap(
      "Føj til hjemmeskærm",
      (isStandalone()
        ? '<div class="card"><p>Snusfri kører allerede som app på hjemmeskærmen. Godt gået.</p></div>'
        : '<div class="card"><p><strong>På iPhone, i Safari:</strong></p>' +
          '<div class="tip"><div class="n">1</div><div>Åbn denne side i Safari (ikke i Chrome eller inde i en anden app).</div></div>' +
          '<div class="tip"><div class="n">2</div><div>Tryk på <strong>Dele</strong>-ikonet — firkanten med pilen opad — i bunden (eller toppen) af skærmen.</div></div>' +
          '<div class="tip"><div class="n">3</div><div>Rul og vælg <strong>Føj til hjemmeskærm</strong>. Tryk på Tilføj.</div></div>' +
          '<div class="tip"><div class="n">4</div><div>Åbn Snusfri fra hjemmeskærmen. Den kører fuld skærm, også uden net.</div></div>' +
          "</div>") +
        '<div class="card mt"><div class="card-kicker gold">Overblik uden at åbne appen</div>' +
        "<p>En ægte iOS-hjemmeskærms-widget kræver en native app — det kan en web-app ikke levere. Forsiden er bygget som et kompakt glansbillede, og du kan dele dage og sparede kroner som tekst. På enheder der tillader det, kan varsler vise det samme, når appen er åben.</p>" +
        '<button type="button" class="btn btn-ghost-mint btn-block mt" data-act="share-status">Del dit overblik</button></div>'
    );
  }



  function renderPlans(el) {
    const plans = state.ifThenPlans || [];
    const suggested = topTriggers(3).filter(function (t) {
      return !plans.some(function (p) { return p.trigger === t; });
    });
    const list = plans.length
      ? plans.map(function (p) { return planCardHtml(p, { actions: true }); }).join("")
      : '<div class="card empty-rich"><div class="big">🗺️</div><p>Ingen planer endnu. Vælg en trigger og bind den til en konkret handling — beslutningen skal ligge klar, før suget kommer.</p></div>';
    const sugg = suggested.length
      ? '<div class="section-label">Foreslået ud fra din log</div>' +
        suggested
          .map(function (t) {
            const tmpl = templateFor(t);
            return (
              '<div class="card"><div class="plan-trig">' +
              esc(t) +
              '</div><p class="compass-lead">' +
              esc(tmpl.ifText) +
              " " +
              esc(tmpl.thenText) +
              '</p><button class="btn btn-ghost-mint btn-sm mt" data-act="add-plan" data-trigger="' +
              esc(t) +
              '">Brug og tilpas</button></div>'
            );
          })
          .join("")
      : "";
    el.innerHTML = subWrap(
      "Hvis-så-planer",
      '<p class="page-sub">En konkret løsning, når suget kommer. Anbefalet af sundhedsmyndigheder — ikke et løfte, men et greb der flytter beslutningen til før øjeblikket.</p>' +
        '<button class="btn btn-primary btn-block" data-act="add-plan">+ Ny plan</button>' +
        '<div class="section-label">Dine planer</div>' +
        list +
        sugg
    );
  }

  function renderReasonsPage(el) {
    const list = reasonsList();
    const fields = [];
    for (let i = 0; i < 5; i++) {
      const t = (list[i] && list[i].text) || "";
      fields.push(
        '<div class="field"><label>Grund ' +
          (i + 1) +
          (i === 0 ? "" : " (valgfri)") +
          '</label><textarea id="rsn-' +
          i +
          '" class="input" maxlength="220" style="min-height:4rem">' +
          esc(t) +
          "</textarea></div>"
      );
    }
    el.innerHTML = subWrap(
      "Mine grunde",
      '<p class="page-sub">Med dine egne ord. De vises på SOS, i «bare én»-værnet, og når dagen er svær. Ét swipe væk fra forsiden.</p>' +
        fields.join("") +
        '<button class="btn btn-primary btn-block" data-act="reasons-save">Gem grunde</button>'
    );
  }

  function renderBuddy(el) {
    const b = state.buddy || {};
    const has = !!(b.name || b.phone);
    const body =
      (b.phone
        ? '<div class="help-actions mb-0">' +
          '<a class="btn btn-primary btn-block" href="tel:' +
          esc(b.phone.replace(/\s/g, "")) +
          '">Ring til ' +
          esc(b.name || "makker") +
          "</a>" +
          '<a class="btn btn-ghost-mint btn-block" href="' +
          smsHref(b.phone.replace(/\s/g, ""), b.note || "Jeg er til fest i aften. Skriv til mig senere, ok?") +
          '">Send sms</a></div>'
        : "") +
      '<div class="field mt-2"><label>Navn</label>' +
      '<input id="buddy-name" class="input" maxlength="60" value="' +
      esc(b.name || "") +
      '"></div>' +
      '<div class="field"><label>Telefon</label>' +
      '<input id="buddy-phone" class="input" inputmode="tel" maxlength="20" value="' +
      esc(b.phone || "") +
      '"></div>' +
      '<div class="field"><label>Sms-skabelon</label>' +
      '<textarea id="buddy-note" class="input" maxlength="240" style="min-height:5rem">' +
      esc(b.note || "Jeg er til fest i aften. Skriv til mig kl. 23, ok?") +
      "</textarea></div>" +
      '<button class="btn btn-primary btn-block" data-act="buddy-save">Gem makker</button>' +
      '<p class="fine-src mt">Ingen offentlig feed. Bare én livline. Stoplinien er der også: 80 31 31 31.</p>';
    el.innerHTML = subWrap("Makker", (has ? "" : '<p class="page-sub">Vælg én person, der ved det. En festplan virker bedre, hvis én ven er med.</p>') + body +
      '<button type="button" class="btn btn-ghost-mint btn-block mt" data-act="buddy-share">Del en besked til din makker</button>');
  }

  function renderHelp(el) {
    el.innerHTML = subWrap(
      "Stoplinien & hjælp",
      stoplinienCardHtml(false) +
        '<div class="section-label">Mere hjælp</div>' +
        '<div class="card"><p>Din kommune har ofte et gratis nikotinstoptilbud. Stoplinien kan hjælpe med overblikket. Kræftens Bekæmpelse har også appen Kvit, hvis du vil have et digitalt forløb ved siden af.</p>' +
        '<div class="hr"></div>' +
        "<p><strong>Nikotinerstatning og receptpligtig medicin.</strong> Rådgivning hjælper sandsynligvis flere med at stoppe røgfri tobak. Visse lægemidler kan også hjælpe — det er lægemidler, ikke noget appen udskriver. Tal med apotek eller læge. Den almindeligste fejl ved nikotinerstatning er for svag dosis i for kort tid.</p>" +
        '<p class="fine-src mt">Kilder: Sundhedsstyrelsen, Stoplinien, Cochrane 2025, Fagerström m.fl. 2010. Ingen af tallene er et løfte til dig.</p></div>'
    );
  }

  function renderDays(el) {
    const today = new Date();
    const quit = state.profile.quitAt ? new Date(state.profile.quitAt) : today;
    const start = startOfDay(quit);
    /* Show current month, plus days since quit if shorter. */
    const first = new Date(today.getFullYear(), today.getMonth(), 1);
    const viewStart = start < first ? first : start;
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const wd = ["M", "T", "O", "T", "F", "L", "S"]
      .map(function (w) { return '<div class="cal-wd">' + w + "</div>"; })
      .join("");
    /* Monday-based offset */
    const offset = (viewStart.getDay() + 6) % 7;
    const cells = [];
    for (let i = 0; i < offset; i++) cells.push("<div></div>");
    const endDay = today.getMonth() === viewStart.getMonth() ? today.getDate() : daysInMonth;
    /* Also show whole month including future as muted? Only up to today. */
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const last = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const monOffset = (monthStart.getDay() + 6) % 7;
    const cells2 = [];
    for (let i = 0; i < monOffset; i++) cells2.push("<div></div>");
    for (let d = 1; d <= last; d++) {
      const dt = new Date(today.getFullYear(), today.getMonth(), d);
      const iso = todayISO(dt);
      const future = dt > startOfDay(today);
      const before = dt < startOfDay(quit);
      const logged = Object.prototype.hasOwnProperty.call(state.dayLog || {}, iso);
      const n = logged ? Number(state.dayLog[iso].pouches) || 0 : 0;
      const isToday = iso === todayISO(today);
      let cls = "cal-cell";
      if (isToday) cls += " today";
      if (future || before) {
        cells2.push('<div class="cal-cell empty" style="opacity:.35"><div class="d">' + d + '</div><div class="n"> </div></div>');
        continue;
      }
      if (logged && n > 0) cls += " has";
      else cls += " zero";
      if (!logged) cls += " empty";
      cells2.push(
        '<button class="' +
          cls +
          '" data-act="edit-day" data-iso="' +
          iso +
          '"><div class="d">' +
          d +
          '</div><div class="n">' +
          (logged ? fmtNum(n, n % 1 ? 1 : 0) : "0") +
          "</div></button>"
      );
    }
    el.innerHTML = subWrap(
      "Dine dage",
      '<p class="page-sub">En dag uden indtastning tæller som <strong>nul poser</strong> — aldrig som dit gamle forbrug. Du kan rette og tilføje tidligere dage. Historikken overlever opdateringer.</p>' +
        '<div class="card"><div class="cal-grid">' +
        wd +
        cells2.join("") +
        "</div>" +
        '<p class="hint mt">0 i dæmpet skrift betyder, at dagen ikke er redigeret. Den tæller stadig som nul.</p></div>' +
        '<div class="section-label">Sikkerhed</div>' +
        '<div class="card"><p>Der ligger automatisk en intern kopi på denne enhed. Tag også en eksport, hvis du skifter telefon.</p>' +
        '<button class="btn btn-ghost-mint btn-block mt" data-act="export">Eksporter JSON</button>' +
        '<button class="btn btn-ghost btn-block mt" data-act="goto-data">Data & gendan</button></div>'
    );
  }

  function renderInbox(el) {
    const list = (state.inbox || []).slice().sort(function (a, b) { return new Date(b.at) - new Date(a.at); });
    const items = list.length
      ? list
          .map(function (m) {
            return (
              '<div class="msg' +
              (m.read ? "" : " unread") +
              '"><div class="msg-title">' +
              esc(m.title) +
              '</div><div class="msg-body">' +
              esc(m.body) +
              '</div><div class="msg-when">' +
              esc(fmtDateTime(m.at)) +
              "</div></div>"
            );
          })
          .join("")
      : '<p class="empty">Ingen beskeder endnu. De første 48–72 timer ligger der tættere, rolige beskeder — altid på snus-sprog, aldrig med skyld.</p>';
    const perm = typeof Notification !== "undefined" ? Notification.permission : "denied";
    el.innerHTML = subWrap(
      "Beskeder",
      '<p class="page-sub">Tættere de første to–tre døgn, derefter på dine egne tidspunkter. På iPhone kan en web-app ikke sende pålidelige beskeder, når den er lukket. Vi gemmer dem her, så de ligger klar, når du åbner Snusfri.</p>' +
        (perm !== "granted"
          ? '<button class="btn btn-ghost-mint btn-block" data-act="notify-ask">Tillad varsler, når appen er åben</button>'
          : '<p class="hint">Varsler er slået til, når appen er åben.</p>') +
        '<div class="field mt-2"><label>Egne tidspunkter (fx 08:00, 15:30)</label>' +
        '<input id="notify-times" class="input" placeholder="08:00, 22:00" value="' +
        esc(((state.notifyPrefs && state.notifyPrefs.times) || []).join(", ")) +
        '">' +
        '<button class="btn btn-ghost btn-sm mt" data-act="notify-times-save">Gem tidspunkter</button></div>' +
        '<div class="section-label">I appen</div><div class="card">' +
        items +
        "</div>"
    );
    /* Mark read when opened */
    (state.inbox || []).forEach(function (m) { m.read = true; });
    save();
  }

  function renderNicotineFree(el) {
    const nf = state.nicotineFree || {};
    if (!nf.enabled) {
      el.innerHTML = subWrap(
        "Nikotinfri poser",
        '<div class="callout coral">Nogle bruger nikotinfri poser som midlertidig erstatning. Forskning advarer om, at det kan forstærke suget, og nogle kører længe og går så tilbage. Hvis du bruger dem, skal de have en udgang.</div>' +
          '<div class="callout mint mt">Alternativer fra sundhedsmyndigheder: pastil, tyggegummi, et stykke ingefær under læben.</div>' +
          '<div class="field mt-2"><label>Udløbsdato</label>' +
          '<input id="nf-end" class="input" type="date"></div>' +
          '<button class="btn btn-primary btn-block" data-act="nf-start">Start midlertidig log</button>' +
          '<p class="hint mt">Valgfrit. Målet er også at lægge de nikotinfri.</p>'
      );
      return;
    }
    const used = Number((nf.logs || {})[todayISO(new Date())] || 0);
    el.innerHTML = subWrap(
      "Nikotinfri poser",
      '<div class="card"><div class="card-kicker mint">I dag</div>' +
        '<div class="allowance"><div class="big">' +
        fmtNum(used, used % 1 ? 1 : 0) +
        '</div><div class="sub">nikotinfri poser logget</div></div>' +
        (nf.endDate ? "<p>Udløb: <strong>" + esc(fmtDate(nf.endDate)) + "</strong></p>" : "") +
        '<div class="field"><label>Log i dag</label>' +
        '<div class="stepper"><button type="button" data-act="step" data-dir="-1" data-target="nf-used" data-amt="1">−</button>' +
        '<input id="nf-used" inputmode="decimal" value="' +
        esc(String(used)) +
        '">' +
        '<button type="button" data-act="step" data-dir="1" data-target="nf-used" data-amt="1">+</button></div></div>' +
        '<button class="btn btn-primary btn-block" data-act="nf-log">Gem</button></div>' +
        '<div class="callout coral mt">Det her er midlertidigt. Målet er også at lægge de nikotinfri. Pastil, tyggegummi eller ingefær under læben er alternativer, der ikke holder mund-ritualet i gang på samme måde.</div>' +
        '<button class="btn btn-ghost btn-block mt" data-act="nf-stop">Afslut og læg dem</button>'
    );
  }

  function renderData(el) {
    let snap = null;
    try {
      const raw = localStorage.getItem(STORAGE_SNAPSHOT);
      if (raw) snap = JSON.parse(raw);
    } catch (e) {}
    el.innerHTML = subWrap(
      "Data & sikkerhedskopi",
      '<div class="card"><p>Al data ligger kun på denne enhed. Historik, stopdato og sparede kroner skal overleve opdateringer. Tomme dage er nul poser, og du kan rette gamle dage.</p>' +
        '<button class="btn btn-primary btn-block mt" data-act="export">Eksporter JSON</button>' +
        '<button class="btn btn-ghost btn-block mt" data-act="import">Importer en kopi</button>' +
        (snap
          ? '<button class="btn btn-ghost btn-block mt" data-act="restore-snapshot">Gendan kopi fra før sidste opgradering</button>'
          : "") +
        '<button class="btn btn-ghost btn-block mt" data-act="restore-backup">Gendan seneste interne kopi</button>' +
        '<p class="fine-src mt">En intern kopi skrives automatisk, hver gang appen gemmer. Import erstatter de nuværende data — eksporter først, hvis du er i tvivl.</p></div>'
    );
  }

  function renderPartyPage(el) {
    const plans = (state.partyPlans || []).slice().sort(function (a, b) {
      return new Date(b.when || b.createdAt || 0) - new Date(a.when || a.createdAt || 0);
    });
    const list = plans.length
      ? plans
          .map(function (p) {
            return (
              '<div class="card"><div class="card-kicker">' +
              (p.endedAt ? (p.held ? "Holdt" : "Afsluttet") : "Plan") +
              "</div><strong>" +
              esc(p.when ? fmtDateTime(p.when) : "Uden fast tid") +
              "</strong>" +
              "<p class=\"compass-lead mt\">" +
              esc(p.say || "") +
              "</p>" +
              (p.endedAt
                ? ""
                : '<button class="btn btn-gold btn-block mt" data-act="party-start" data-id="' +
                  esc(p.id) +
                  '">Tænd fest-mode</button>') +
              '<button class="btn btn-ghost btn-sm mt" data-act="del-party" data-id="' +
              esc(p.id) +
              '">Fjern</button></div>'
            );
          })
          .join("")
      : '<p class="empty">Ingen fest-planer endnu. Lav én, mens du er ædru.</p>';
    el.innerHTML = subWrap(
      "Fest-mode",
      '<p class="page-sub">At være til fest er den almindeligste situation for tilbagefald, særligt med alkohol. Planen laves ædru. Under festen er skærmen stor og enkel.</p>' +
        (hoursSinceQuit() < 21 * 24
          ? '<div class="callout">De første uger anbefales det at drikke lidt eller ingenting. Impulskontrollen falder, når du drikker.</div>'
          : "") +
        '<button class="btn btn-gold btn-block mt" data-act="party-new">+ Ny fest-plan</button>' +
        '<div class="section-label">Dine planer</div>' +
        list
    );
  }


  /* ---------------- sheets: SOS, breath, slip, checkin, goals ---------------- */
  function openSOS(prefill) {
    prefill = prefill || {};
    closeToolScreen();
    const chips = TRIGGERS.map((t) => {
      const on = prefill.trigger === t;
      return (
        '<button type="button" class="chip' +
        (on ? " on" : "") +
        '" data-act="chip" data-group="trigger" data-val="' +
        esc(t) +
        '">' +
        esc(t) +
        "</button>"
      );
    }).join("");
    const ints = [];
    for (let i = 1; i <= 10; i++) {
      ints.push(
        '<button type="button" data-act="chip" data-group="intensity" data-val="' +
          i +
          '" class="' +
          (String(prefill.intensity || "") === String(i) ? "on" : "") +
          '">' +
          i +
          "</button>"
      );
    }
    const waves = Number(state.wavesRidden) || 0;
    const r0 = reasonsList()[0];
    openSheet(
      "<h2>Jeg har en trang</h2>" +
        '<p class="sheet-lead">Den er en bølge. Den værste del varer oftest 3–4 minutter. Du behøver ikke gøre andet end at komme igennem den.' +
        (waves ? " Du har allerede redet " + waves + " " + plural(waves, "bølge", "bølger") + "." : "") +
        "</p>" +
        (r0
          ? '<div class="vaern-box"><p style="font-family:var(--display);font-style:italic;font-weight:600;color:var(--text)">“' +
            esc(r0.text) +
            '”</p></div>'
          : "") +
        '<div class="field"><label>Hvor stærk er den?</label><div class="intensity" id="sos-int">' +
        ints.join("") +
        "</div></div>" +
        '<div class="field"><label>Hvad udløste den?</label><div class="chips" id="sos-trig">' +
        chips +
        "</div></div>" +
        '<div id="sos-plan-slot">' +
        sosPlanHtml(prefill.trigger || "") +
        "</div>" +
        '<div class="field"><label>Note (valgfri)</label><input id="sos-note" class="input" maxlength="200" value="' +
        esc(prefill.note || "") +
        '"></div>' +
        '<button class="btn btn-coral btn-block btn-wrap" data-act="start-wave">Rid bølgen — 3–4 min.</button>' +
        '<button class="btn btn-ghost-mint btn-block mt btn-wrap" data-act="start-breath">2 min. vejrtrækning</button>' +
        '<button class="btn btn-gold btn-block mt btn-wrap" data-act="bare-en">Bare én pose?</button>' +
        '<button class="btn btn-ghost btn-block mt" data-act="sos-tips">Se distraktioner</button>' +
        '<button class="btn btn-ghost-mint btn-block mt" data-act="sos-log" data-resisted="1">Log og luk — jeg klarede den</button>' +
        '<button class="btn btn-ghost btn-block mt" data-act="slip" style="color:var(--coral-soft)">Jeg gav efter</button>'
    );
    const root = $("#modal-root");
    root._sos = {
      intensity: prefill.intensity || 0,
      trigger: prefill.trigger || "",
      note: prefill.note || ""
    };
  }

  function readSos() {
    const root = $("#modal-root");
    const data = (root && root._sos) || { intensity: 0, trigger: "", note: "" };
    const note = $("#sos-note");
    if (note) data.note = note.value;
    return data;
  }

  function logCraving(opts) {
    const c = {
      id: uid(),
      at: new Date().toISOString(),
      intensity: Number(opts.intensity) || 0,
      intensityAfter: opts.intensityAfter != null ? Number(opts.intensityAfter) : null,
      trigger: opts.trigger || "",
      note: opts.note || "",
      resisted: !!opts.resisted,
      usedBreathing: !!opts.usedBreathing,
      usedWave: !!opts.usedWave
    };
    state.cravings.push(c);
    if (c.usedWave && c.resisted) {
      state.wavesRidden = (Number(state.wavesRidden) || 0) + 1;
    }
    save();
    checkAchievements(false);
    return c;
  }

  function openTips() {
    openSheet(
      "<h2>Værktøjskasse</h2>" +
        '<p class="sheet-lead">Vælg én. Gør den færdig, før du beslutter noget andet.</p>' +
        toolboxHtml() +
        '<button class="btn btn-ghost btn-block mt" data-act="close-modal">Luk</button>'
    );
  }


  function waveAmp(t) {
    t = Math.max(0, Math.min(1, t));
    if (t <= 0.40) {
      const u = t / 0.40;
      const s = u * u * (3 - 2 * u);
      return 0.18 + 0.82 * s;
    }
    if (t <= 0.52) {
      return 1 - 0.06 * ((t - 0.40) / 0.12);
    }
    const u = (t - 0.52) / 0.48;
    const s = u * u * (3 - 2 * u);
    return 0.94 * (1 - s) + 0.08 * s;
  }
  function waveCopy(t) {
    if (t < 0.16) return { title: "Trangen er en gæst", sub: "Den kommer, og den går igen. Du behøver bare at vente." };
    if (t < 0.38) return { title: "Den stiger — det er okay", sub: "Du rider den. Du behøver ikke gøre noget ved den." };
    if (t < 0.54) return { title: "Her er toppen", sub: "Den varer ikke ved. Bliv lidt endnu." };
    if (t < 0.88) return { title: "Den daler", sub: "Sådan. Du rider den af." };
    return { title: "Sådan. Den gik.", sub: "Du har redet den her bølge." };
  }
  function buildWavePath(w, h, tMax, samples) {
    const pts = [];
    const n = samples || 80;
    const max = tMax == null ? 1 : tMax;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      if (t > max && max < 1) break;
      const x = 8 + t * (w - 16);
      const y = h * (0.78 - 0.62 * waveAmp(t));
      pts.push(x.toFixed(1) + "," + y.toFixed(1));
    }
    if (!pts.length) return "";
    return "M " + pts[0] + " L " + pts.slice(1).join(" ");
  }

  function startWave(opts) {
    opts = opts || {};
    haptic("start");
    const sos = opts.sos || (function () { try { return readSos(); } catch (e) { return {}; } })();
    closeModal();
    const screen = $("#wave-screen");
    if (!screen) return;
    const waves = Number(state.wavesRidden) || 0;
    const plan = ifThenFor(sos.trigger);
    const r0 = reasonsList()[0];
    screen.classList.remove("hidden");
    $("#tabbar").classList.add("hidden");
    $("#fab-sos").classList.add("hidden");
    screen.innerHTML =
      '<p class="wave-kicker">Trang-surfer</p>' +
      '<h2 class="wave-title" id="wave-title">Trangen er en gæst</h2>' +
      '<p class="wave-sub" id="wave-sub">Den går igen. Den værste del varer oftest 3–4 minutter.</p>' +
      '<div class="wave-stage"><svg viewBox="0 0 360 180" aria-hidden="true">' +
      '<path id="wave-dim" fill="none" stroke="rgba(232,196,122,0.22)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="' +
      buildWavePath(360, 180, 1, 100) +
      '"></path>' +
      '<path id="wave-lit" fill="none" stroke="#E8C47A" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" d=""></path>' +
      '<circle id="wave-orb" r="8" fill="#F0D9A0" stroke="#0A110E" stroke-width="2">' +
      '<animate attributeName="r" values="7;9;7" dur="2.4s" repeatCount="indefinite"></animate></circle>' +
      "</svg></div>" +
      '<div class="wave-time" id="wave-time">3:30</div>' +
      '<p class="wave-count" id="wave-count">' +
      (waves
        ? "Du har allerede redet " + waves + " " + plural(waves, "bølge", "bølger") + "."
        : "Første bølge. Den går over.") +
      "</p>" +
      (plan
        ? '<div class="sos-plan" style="width:100%;max-width:26rem"><div class="k">Din plan</div><p>' +
          esc(plan.ifText) +
          " " +
          esc(plan.thenText) +
          "</p></div>"
        : "") +
      (r0 ? '<p class="wave-sub" style="margin-top:0.5rem">“' + esc(r0.text) + '”</p>' : "") +
      '<div class="wave-tips">' +
      WAVE_TIPS.map(function (t) {
        return (
          '<button type="button" class="chip" data-act="wave-tip" data-id="' +
          t.id +
          '">' +
          esc(t.label) +
          "</button>"
        );
      }).join("") +
      "</div>" +
      '<div class="wave-actions">' +
      '<button class="btn btn-primary btn-block btn-wrap" data-act="wave-done">Jeg er okay nu</button>' +
      '<button class="btn btn-ghost-mint btn-block" data-act="wave-to-breath">Hellere 2 min. åndedræt</button>' +
      '<button class="btn btn-ghost btn-block" data-act="wave-skip">Spring over</button>' +
      "</div>";

    const TOTAL = opts.ms || WAVE_MS;
    const offset = Math.max(0, Math.min(0.97, Number(opts.offset) || 0));
    const start = performance.now() - offset * TOTAL;
    let stopped = false;
    const dim = $("#wave-dim");
    const lit = $("#wave-lit");
    const orb = $("#wave-orb");
    const title = $("#wave-title");
    const sub = $("#wave-sub");
    const timeEl = $("#wave-time");
    let lastTitle = "";

    function at(t) {
      const x = 8 + t * (360 - 16);
      const y = 180 * (0.78 - 0.62 * waveAmp(t));
      return { x: x, y: y };
    }
    function paint(t) {
      if (lit) lit.setAttribute("d", buildWavePath(360, 180, t, 100));
      const p = at(t);
      if (orb) {
        orb.setAttribute("cx", p.x.toFixed(1));
        orb.setAttribute("cy", p.y.toFixed(1));
      }
      const copy = waveCopy(t);
      if (title && copy.title !== lastTitle) {
        lastTitle = copy.title;
        title.textContent = copy.title;
        if (sub) sub.textContent = copy.sub;
      }
    }
    function finish(kind) {
      if (stopped) return;
      stopped = true;
      if (waveRaf) cancelAnimationFrame(waveRaf);
      waveStop = null;
      endWave(sos, kind);
    }
    waveStop = finish;

    function frame(now) {
      if (stopped) return;
      const elapsed = now - start;
      const t = Math.max(0, Math.min(1, elapsed / TOTAL));
      const rem = Math.max(0, TOTAL - elapsed);
      const m = Math.floor(rem / 60000);
      const sec = Math.floor((rem % 60000) / 1000);
      if (timeEl) timeEl.textContent = m + ":" + pad(sec);
      paint(t);
      if (elapsed >= TOTAL) {
        finish("done");
        return;
      }
      if (opts.freeze) return;
      waveRaf = requestAnimationFrame(frame);
    }
    if (opts.freeze) {
      paint(offset || 0.42);
      const rem = Math.max(0, TOTAL * (1 - (offset || 0.42)));
      if (timeEl) {
        const m = Math.floor(rem / 60000);
        const sec = Math.floor((rem % 60000) / 1000);
        timeEl.textContent = m + ":" + pad(sec);
      }
    } else {
      waveRaf = requestAnimationFrame(frame);
    }
  }

  function closeWave() {
    const screen = $("#wave-screen");
    if (screen) {
      screen.classList.add("hidden");
      screen.innerHTML = "";
    }
    if (waveRaf) cancelAnimationFrame(waveRaf);
    waveStop = null;
  }

  function endWave(sos, kind) {
    closeWave();
    const counted = kind === "done" || kind === "okay";
    if (counted) haptic("done");
    const waves = (Number(state.wavesRidden) || 0) + (counted ? 1 : 0);
    const ints = [];
    for (let i = 1; i <= 10; i++) {
      ints.push(
        '<button type="button" data-act="chip" data-group="intensityAfter" data-val="' +
          i +
          '">' +
          i +
          "</button>"
      );
    }
    openSheet(
      "<h2>" +
        (kind === "skip" ? "Fair nok" : "Sådan. Den gik.") +
        "</h2>" +
        '<p class="sheet-lead">' +
        (kind === "skip"
          ? "Du behøver ikke gøre den færdig. Hvordan har trangen det nu?"
          : "Du red bølgen. " +
            (waves
              ? "Du har nu redet " + waves + " " + plural(waves, "bølge", "bølger") + "."
              : "Den gik.") +
            " Hvordan har den det nu?") +
        "</p>" +
        '<div class="field"><label>Styrke nu</label><div class="intensity" id="wave-int-after">' +
        ints.join("") +
        "</div></div>" +
        '<button class="btn btn-primary btn-block" data-act="sos-log" data-resisted="1" data-wave="' +
        (counted ? "1" : "0") +
        '">Log som overvundet</button>' +
        '<button class="btn btn-ghost btn-block mt" data-act="start-breath">Stadig svært — 2 min. åndedræt</button>' +
        '<button class="btn btn-ghost btn-block mt" data-act="slip" style="color:var(--coral-soft)">Jeg gav efter</button>'
    );
    const root = $("#modal-root");
    root._sos = Object.assign({}, sos, { usedWave: counted, skipped: kind === "skip" });
    if (state.onboarded) {
      $("#tabbar").classList.remove("hidden");
    }
  }

  function openBareEn() {
    const sos = (function () { try { return readSos(); } catch (e) { return {}; } })();
    const s = stats();
    const days = Math.floor(s.days);
    const reasons = reasonsList()
      .slice(0, 3)
      .map(function (r) {
        return '<blockquote class="quote" style="font-size:1rem;margin-top:0.5rem">“' + esc(r.text) + '”</blockquote>';
      })
      .join("");
    closeModal();
    openSheet(
      "<h2>Bare én?</h2>" +
        '<p class="vaern-script">Den første pose er det eneste sted, linjen kan holdes. Den næste er sværere — ikke lettere.</p>' +
        '<div class="vaern-box"><h3>Husk den sidste fase, ikke den første</h3><p>Kickene er væk. Du tager den for at føle dig normal — og så er du fast igen.</p></div>' +
        '<div class="vaern-box"><h3>Én pose er ikke et neutralt eksperiment</h3><p>Nikotinen vender tilbage, og abstinensen starter forfra. For de fleste er toppen igen dag 2–3.</p></div>' +
        '<div class="vaern-calc">' +
        '<div class="cell"><div class="v">' +
        esc(fmtNum(days, 0)) +
        " " +
        plural(days, "dag", "dage") +
        '</div><div class="l">du allerede har</div></div>' +
        '<div class="cell"><div class="v">' +
        esc(fmtKr(s.r.costPerDay / Math.max(1, s.r.pouchesPerDay), 2)) +
        '</div><div class="l">én pose koster</div></div></div>' +
        (reasons ? '<div class="section-label" style="margin-top:0.2rem">Dine grunde</div>' + reasons : "") +
        '<button class="btn btn-coral btn-block btn-wrap mt-2" data-act="start-wave">Jeg lader den ligge — rid bølgen</button>' +
        '<button class="btn btn-ghost-mint btn-block mt" data-act="sos">Tilbage til SOS</button>' +
        '<button class="btn btn-ghost btn-block mt" data-act="slip" style="color:var(--coral-soft)">Det skete — log et slip</button>'
    );
    const root = $("#modal-root");
    root._sos = sos;
  }

  function openPartyForm(existing) {
    const p = existing || {};
    const drinking = p.drinking || "little";
    openSheet(
      "<h2>" +
        (existing ? "Rediger fest-plan" : "Fest-plan") +
        "</h2>" +
        '<p class="sheet-lead">Laves ædru. Under festen er skærmen stor og enkel — få knapper, høj kontrast.</p>' +
        '<div class="field"><label>Hvornår?</label>' +
        '<input id="pt-when" class="input" type="datetime-local" value="' +
        esc(p.when ? toLocalInput(p.when) : "") +
        '"></div>' +
        '<div class="field"><label>Drikker du?</label></div>' +
        '<div class="seg" id="pt-drink">' +
        '<button type="button" data-act="chip" data-group="drinking" data-val="none" class="' +
        (drinking === "none" ? "on" : "") +
        '">Nej</button>' +
        '<button type="button" data-act="chip" data-group="drinking" data-val="little" class="' +
        (drinking === "little" ? "on" : "") +
        '">Lidt</button>' +
        '<button type="button" data-act="chip" data-group="drinking" data-val="yes" class="' +
        (drinking === "yes" ? "on" : "") +
        '">Ja</button></div>' +
        '<div class="field"><label>Hvis du drikker — hvor lidt? (antal)</label>' +
        '<input id="pt-limit" class="input" inputmode="numeric" value="' +
        esc(p.drinkLimit != null ? String(p.drinkLimit) : "3") +
        '"></div>' +
        '<div class="field"><label>Hvem ved det?</label>' +
        '<input id="pt-who" class="input" maxlength="80" value="' +
        esc(p.who || (state.buddy && state.buddy.name) || "") +
        '"></div>' +
        '<div class="field"><label>Hvad siger du, hvis du bliver budt?</label>' +
        '<textarea id="pt-say" class="input" maxlength="200" style="min-height:4rem">' +
        esc(p.say || "Nej tak, jeg tager ikke snus.") +
        "</textarea></div>" +
        '<div class="field"><label>Sluttid</label>' +
        '<input id="pt-end" class="input" type="time" value="' +
        esc(p.endTime || "23:00") +
        '"></div>' +
        '<div class="field"><label>Erstatning</label>' +
        '<input id="pt-sub" class="input" maxlength="80" placeholder="Vand, sodavand, pastil" value="' +
        esc(p.substitute || "Et glas vand") +
        '"></div>' +
        '<div class="field"><label>Hvis jeg vil gå — min exit</label>' +
        '<input id="pt-exit" class="input" maxlength="120" placeholder="Jeg tager en taxa kl. 23" value="' +
        esc(p.exit || "") +
        '"></div>' +
        '<button class="btn btn-gold btn-block" data-act="party-save" data-id="' +
        esc(p.id || "") +
        '">Gem plan</button>'
    );
    const root = $("#modal-root");
    root._party = { drinking: drinking, id: p.id || "" };
  }

  function savePartyPlan(id) {
    const root = $("#modal-root");
    const drinking = (root._party && root._party.drinking) || "little";
    const whenEl = $("#pt-when");
    const plan = {
      id: id || uid(),
      createdAt: new Date().toISOString(),
      when: whenEl && whenEl.value ? new Date(whenEl.value).toISOString() : null,
      drinking: drinking,
      drinkLimit: parseNum(($("#pt-limit") || {}).value),
      who: (($("#pt-who") || {}).value || "").trim(),
      say: (($("#pt-say") || {}).value || "Nej tak, jeg tager ikke snus.").trim(),
      endTime: (($("#pt-end") || {}).value || "").trim(),
      substitute: (($("#pt-sub") || {}).value || "").trim(),
      exit: (($("#pt-exit") || {}).value || "").trim(),
      held: false,
      endedAt: null
    };
    if (isNaN(plan.drinkLimit)) plan.drinkLimit = null;
    const list = state.partyPlans || [];
    const idx = list.findIndex(function (p) { return p.id === plan.id; });
    if (idx >= 0) {
      plan.createdAt = list[idx].createdAt;
      list[idx] = plan;
    } else {
      list.push(plan);
    }
    state.partyPlans = list;
    save();
    closeModal();
    morePage = "party";
    view = "more";
    render();
    toast("Planen er gemt. Tænd fest-mode, når du går ud.");
  }

  function startPartyMode(id) {
    const plan = (state.partyPlans || []).find(function (p) { return p.id === id; }) || upcomingParty();
    if (!plan) {
      openPartyForm(null);
      return;
    }
    state.activeParty = { planId: plan.id, startedAt: new Date().toISOString(), endedAt: null, held: null };
    save();
    closeModal();
    showPartyScreen(plan);
  }

  function showPartyScreen(plan) {
    const screen = $("#party-screen");
    if (!screen) return;
    const b = state.buddy || {};
    screen.classList.remove("hidden");
    $("#tabbar").classList.add("hidden");
    $("#fab-sos").classList.add("hidden");
    const drinkLabel =
      plan.drinking === "none"
        ? "Ingen alkohol i aften"
        : plan.drinking === "little"
        ? "Lidt · max " + (plan.drinkLimit || "få")
        : "Du drikker — impulskontrollen falder";
    screen.innerHTML =
      '<p class="party-kicker">Fest-mode</p>' +
      '<h1 class="party-title">Du har en plan.<br>Den holder.</h1>' +
      '<div class="party-meta">' +
      '<div class="cell"><div class="l">Alkohol</div><div class="v">' +
      esc(drinkLabel) +
      '</div></div>' +
      '<div class="cell"><div class="l">Sluttid</div><div class="v">' +
      esc(plan.endTime || "—") +
      "</div></div></div>" +
      '<div class="party-plan-box"><h3>Hvis du bliver budt</h3><p>' +
      esc(plan.say || "Nej tak, jeg tager ikke snus.") +
      "</p></div>" +
      (plan.substitute
        ? '<div class="party-plan-box"><h3>I stedet</h3><p>' + esc(plan.substitute) + "</p></div>"
        : "") +
      (plan.exit
        ? '<div class="party-plan-box"><h3>Din exit</h3><p>' + esc(plan.exit) + "</p></div>"
        : "") +
      (plan.who
        ? '<div class="party-plan-box"><h3>Hvem ved det</h3><p>' + esc(plan.who) + "</p></div>"
        : "") +
      '<button class="party-btn sos" data-act="sos">Jeg har en trang</button>' +
      '<button class="party-btn vaern" data-act="bare-en">Bare én? Nej.</button>' +
      (b.phone
        ? '<a class="party-btn buddy" href="' +
          smsHref(b.phone.replace(/\s/g, ""), b.note || "Jeg er til fest. Skriv til mig.") +
          '">Skriv til ' +
          esc(b.name || "makker") +
          "</a>"
        : '<button class="party-btn buddy" data-act="goto-help">Stoplinien 80 31 31 31</button>') +
      '<button class="party-btn ghost" data-act="party-held">Jeg holdt</button>' +
      '<button class="party-btn ghost" data-act="party-slip">Jeg gled</button>' +
      '<button class="party-btn ghost" data-act="party-close">Luk fest-mode</button>';
  }

  function closePartyScreen() {
    const screen = $("#party-screen");
    if (screen) {
      screen.classList.add("hidden");
      screen.innerHTML = "";
    }
    if (state.onboarded) {
      $("#tabbar").classList.remove("hidden");
    }
  }

  function endParty(held) {
    if (state.activeParty) {
      state.activeParty.endedAt = new Date().toISOString();
      state.activeParty.held = !!held;
      const plan = (state.partyPlans || []).find(function (p) { return p.id === state.activeParty.planId; });
      if (plan) {
        plan.endedAt = state.activeParty.endedAt;
        plan.held = !!held;
      }
      if (held) state.partiesHeld = (Number(state.partiesHeld) || 0) + 1;
      save();
      checkAchievements(false);
    }
    closePartyScreen();
    if (!held) {
      openSlip({ fromParty: true });
    } else {
      render();
      toast("Du holdt planen. Det er værd at mærke.");
    }
  }

  function openPlanForm(id, triggerPref) {
    const p = id ? (state.ifThenPlans || []).find(function (x) { return x.id === id; }) : null;
    const trigger = (p && p.trigger) || triggerPref || "";
    const tmpl = templateFor(trigger || "Andet");
    const chips = TRIGGERS.map(function (t) {
      return (
        '<button type="button" class="chip' +
        (trigger === t ? " on" : "") +
        '" data-act="chip" data-group="plan-trigger" data-val="' +
        esc(t) +
        '">' +
        esc(t) +
        "</button>"
      );
    }).join("");
    openSheet(
      "<h2>" +
        (p ? "Rediger plan" : "Ny hvis-så-plan") +
        "</h2>" +
        '<p class="sheet-lead">Gør den konkret. «Hvis jeg bliver budt, så siger jeg nej tak, jeg tager ikke snus.»</p>' +
        '<div class="field"><label>Trigger</label><div class="chips" id="plan-trig">' +
        chips +
        "</div></div>" +
        '<div class="field"><label>Hvis</label>' +
        '<textarea id="plan-if" class="input" maxlength="200" style="min-height:4rem">' +
        esc((p && p.ifText) || tmpl.ifText) +
        "</textarea></div>" +
        '<div class="field"><label>Så</label>' +
        '<textarea id="plan-then" class="input" maxlength="200" style="min-height:4rem">' +
        esc((p && p.thenText) || tmpl.thenText) +
        "</textarea></div>" +
        '<button class="btn btn-primary btn-block" data-act="plan-save" data-id="' +
        esc((p && p.id) || "") +
        '">Gem plan</button>'
    );
    const root = $("#modal-root");
    root._plan = { trigger: trigger || tmpl.trigger };
  }

  function savePlan(id) {
    const root = $("#modal-root");
    const trigger = (root._plan && root._plan.trigger) || "";
    const ifText = (($("#plan-if") || {}).value || "").trim();
    const thenText = (($("#plan-then") || {}).value || "").trim();
    if (!trigger) {
      toast("Vælg en trigger.", "warn");
      return;
    }
    if (!ifText || !thenText) {
      toast("Udfyld både hvis og så.", "warn");
      return;
    }
    if (id) {
      const p = (state.ifThenPlans || []).find(function (x) { return x.id === id; });
      if (p) {
        p.trigger = trigger;
        p.ifText = ifText;
        p.thenText = thenText;
      }
    } else {
      const existing = ifThenFor(trigger);
      if (existing) {
        existing.ifText = ifText;
        existing.thenText = thenText;
      } else {
        state.ifThenPlans.push({
          id: uid(),
          trigger: trigger,
          ifText: ifText,
          thenText: thenText,
          createdAt: new Date().toISOString()
        });
      }
    }
    save();
    checkAchievements(true);
    closeModal();
    morePage = "plans";
    view = "more";
    render();
    toast("Planen er gemt.");
  }

  function openDayEditor(iso) {
    const logged = (state.dayLog || {})[iso] || {};
    const n = logged.pouches != null ? logged.pouches : 0;
    openSheet(
      "<h2>" +
        esc(fmtDate(iso)) +
        "</h2>" +
        '<p class="sheet-lead">Tom dag er nul poser — ikke dit gamle forbrug. Ret tallet, hvis du vil.</p>' +
        '<div class="field"><label>Poser</label>' +
        '<div class="stepper"><button type="button" data-act="step" data-dir="-1" data-target="day-n" data-amt="1">−</button>' +
        '<input id="day-n" inputmode="decimal" value="' +
        esc(String(n)) +
        '">' +
        '<button type="button" data-act="step" data-dir="1" data-target="day-n" data-amt="1">+</button></div></div>' +
        '<div class="field"><label>Note (valgfri)</label>' +
        '<textarea id="day-note" class="input" maxlength="200" style="min-height:4rem">' +
        esc(logged.note || "") +
        "</textarea></div>" +
        '<button class="btn btn-primary btn-block" data-act="day-save" data-iso="' +
        esc(iso) +
        '">Gem dag</button>'
    );
  }


  function startBreathing() {
    const sos = readSos();
    closeModal();
    const screen = $("#breath-screen");
    screen.classList.remove("hidden");
    screen.innerHTML =
      '<p class="breath-sub">To minutter. Følg cirklen.</p>' +
      '<div class="breath-label" id="breath-label">Gør dig klar</div>' +
      '<div class="breath-stage"><div class="breath-halo"></div><div class="breath-circle" id="breath-circle"></div></div>' +
      '<div class="breath-time" id="breath-time">2:00</div>' +
      '<div class="breath-actions">' +
      '<button class="btn btn-ghost-mint btn-block" data-act="breath-done">Jeg er okay nu</button>' +
      '<button class="btn btn-ghost btn-block" data-act="breath-skip">Spring over</button>' +
      "</div>";

    const TOTAL = 120000;
    const phases = [
      { label: "Træk vejret ind", dur: 4000, from: 0.62, to: 1.08 },
      { label: "Hold", dur: 2000, from: 1.08, to: 1.08 },
      { label: "Pust langsomt ud", dur: 6000, from: 1.08, to: 0.62 }
    ];
    const CYCLE = 12000;
    const circle = $("#breath-circle");
    const label = $("#breath-label");
    const timeEl = $("#breath-time");
    const start = performance.now();
    let stopped = false;
    let lastLabel = "";

    function ease(t) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }
    function finish(skipped) {
      if (stopped) return;
      stopped = true;
      if (breathRaf) cancelAnimationFrame(breathRaf);
      breathStop = null;
      endBreathing(sos, skipped);
    }
    breathStop = finish;

    function frame(now) {
      if (stopped) return;
      const elapsed = now - start;
      if (elapsed >= TOTAL) {
        finish(false);
        return;
      }
      const rem = Math.max(0, TOTAL - elapsed);
      const m = Math.floor(rem / 60000);
      const sec = Math.floor((rem % 60000) / 1000);
      timeEl.textContent = m + ":" + pad(sec);
      const t = elapsed % CYCLE;
      let acc = 0;
      let phase = phases[0];
      let local = 0;
      for (let i = 0; i < phases.length; i++) {
        if (t < acc + phases[i].dur) {
          phase = phases[i];
          local = (t - acc) / phases[i].dur;
          break;
        }
        acc += phases[i].dur;
      }
      const e = ease(Math.min(1, Math.max(0, local)));
      const scale = phase.from + (phase.to - phase.from) * e;
      circle.style.transform = "scale(" + scale + ")";
      if (label && phase.label !== lastLabel) {
        lastLabel = phase.label;
        label.textContent = phase.label;
      }
      breathRaf = requestAnimationFrame(frame);
    }
    breathRaf = requestAnimationFrame(frame);
  }

  function endBreathing(sos, skipped) {
    const screen = $("#breath-screen");
    screen.classList.add("hidden");
    screen.innerHTML = "";
    openSheet(
      "<h2>" +
        (skipped ? "Fair nok" : "Godt klaret") +
        "</h2>" +
        '<p class="sheet-lead">' +
        (skipped
          ? "Du behøver ikke gøre øvelsen færdig. Hvordan har trangen det nu?"
          : "To minutter er gået. Trangen er ofte allerede svagere. Hvordan har du det?") +
        "</p>" +
        '<button class="btn btn-primary btn-block" data-act="sos-log" data-resisted="1" data-breath="1">Log som overvundet</button>' +
        '<button class="btn btn-ghost btn-block mt" data-act="sos-tips">Stadig svært — se tips</button>' +
        '<button class="btn btn-ghost btn-block mt" data-act="slip" style="color:var(--coral-soft)">Jeg gav efter</button>'
    );
    const root = $("#modal-root");
    root._sos = Object.assign({}, sos, { usedBreathing: true, skipped: skipped });
  }

  function openSlip(opts) {
    opts = opts || {};
    closePartyScreen();
    const sos = (function () {
      try {
        return readSos();
      } catch (e) {
        return {};
      }
    })();
    openSheet(
      "<h2>Det er okay</h2>" +
        '<p class="aftersyn-lead">Du tog en pose. Det er et slip, ikke et afsluttet kapitel. Din historik bliver. Vi starter igen nu.</p>' +
        '<div class="field"><label>Hvor mange poser? (valgfrit)</label>' +
        '<div class="stepper"><button type="button" data-act="step" data-dir="-1" data-target="slip-n" data-amt="1">−</button>' +
        '<input id="slip-n" inputmode="decimal" value="1">' +
        '<button type="button" data-act="step" data-dir="1" data-target="slip-n" data-amt="1">+</button></div>' +
        '<p class="hint">Trækkes fra sparet og undgået, hvis du fortsætter uden at nulstille.</p></div>' +
        '<div class="field"><label>Hvor var du?</label>' +
        '<input id="slip-place" class="input" maxlength="80" placeholder="Hjemme, fest, arbejde…"></div>' +
        '<div class="field"><label>Var der alkohol?</label></div>' +
        '<div class="seg" id="slip-alc">' +
        '<button type="button" data-act="chip" data-group="slip-alc" data-val="yes">Ja</button>' +
        '<button type="button" data-act="chip" data-group="slip-alc" data-val="no">Nej</button>' +
        "</div>" +
        '<div class="field"><label>Hvilken følelse?</label>' +
        '<input id="slip-feeling" class="input" maxlength="80" placeholder="Skuffelse, fest, kedsomhed, stress…"></div>' +
        '<div class="field"><label>Note (valgfri)</label><textarea id="slip-note" class="input" maxlength="240" placeholder="Hvad skete der?"></textarea></div>' +
        '<button class="btn btn-primary btn-block btn-wrap" data-act="slip-save" data-reset="0">Log slip og fortsæt — start igen nu</button>' +
        '<button class="btn btn-ghost btn-block mt btn-wrap" data-act="slip-save" data-reset="1">Start tælleren forfra (historikken gemmes)</button>' +
        '<button class="btn btn-ghost btn-block mt" data-act="close-modal">Annuller</button>'
    );
    const root = $("#modal-root");
    root._sos = sos;
    root._slip = { alcohol: "", fromParty: !!opts.fromParty };
  }

  function saveSlip(reset) {
    const pouches = parseNum(($("#slip-n") || {}).value);
    const note = (($("#slip-note") || {}).value || "").trim();
    const place = (($("#slip-place") || {}).value || "").trim();
    const feeling = (($("#slip-feeling") || {}).value || "").trim();
    const root0 = $("#modal-root");
    const alcohol = (root0 && root0._slip && root0._slip.alcohol) || "";
    const prev = state.profile.quitAt;
    const slip = {
      id: uid(),
      at: new Date().toISOString(),
      pouches: isNaN(pouches) ? 0 : Math.max(0, pouches),
      note: note,
      place: place,
      alcohol: alcohol,
      feeling: feeling,
      nextTime: "",
      reset: !!reset,
      previousQuitAt: prev
    };
    const iso = todayISO(new Date());
    state.dayLog = state.dayLog || {};
    const already = Number((state.dayLog[iso] && state.dayLog[iso].pouches) || 0);
    state.dayLog[iso] = {
      pouches: already + (slip.pouches || 0),
      note: note || (state.dayLog[iso] && state.dayLog[iso].note) || "",
      source: "slip"
    };
    if (reset) {
      const s = stats();
      state.streaks.push({
        start: prev,
        end: slip.at,
        days: s.days,
        reason: "reset"
      });
      state.profile.quitAt = slip.at;
    }
    state.slips.push(slip);
    // If they came from a craving, also log it as not resisted
    const sos = ($("#modal-root") && $("#modal-root")._sos) || null;
    if (sos && (sos.intensity || sos.trigger)) {
      logCraving({
        intensity: sos.intensity,
        trigger: sos.trigger,
        note: sos.note,
        resisted: false,
        usedBreathing: !!sos.usedBreathing
      });
    }
    save();
    checkAchievements(true);
    closeModal();
    openAftersyn(slip, reset);
  }

  function openAftersyn(slip, reset) {
    const triggerGuess = slip.feeling === "fest" || slip.alcohol === "yes" ? "Fest" : (slip.feeling || "Alkohol");
    const tmpl = templateFor(
      TRIGGERS.indexOf(triggerGuess) >= 0 ? triggerGuess : "Fest"
    );
    openSheet(
      "<h2>Hvad tager du med?</h2>" +
        '<p class="aftersyn-lead">Ingen grund til at begynde på fuld tid igen. Streaken er én måling, ikke din værdi. Historikken står. Vi starter igen nu — ikke i morgen.' +
        ((state.slips || []).filter(function (x) { return todayISO(x.at) === todayISO(slip.at); }).length > 1
          ? " Det er stadig i dag."
          : "") +
        "</p>" +
        '<div class="field"><label>Hvad vil du gøre anderledes næste gang?</label>' +
        '<textarea id="slip-next" class="input" maxlength="240" style="min-height:5rem" placeholder="Fx: Hvis jeg er til fest og bliver budt, så siger jeg nej tak og drikker et glas vand.">' +
        esc(tmpl.ifText + " " + tmpl.thenText) +
        "</textarea></div>" +
        '<button class="btn btn-primary btn-block btn-wrap" data-act="aftersyn-save" data-id="' +
        esc(slip.id) +
        '" data-trigger="' +
        esc(tmpl.trigger) +
        '">Gem og lav en hvis-så-plan</button>' +
        '<button class="btn btn-ghost btn-block mt" data-act="aftersyn-skip" data-id="' +
        esc(slip.id) +
        '">Luk — jeg er i gang igen</button>' +
        '<p class="hint mt">' +
        (reset
          ? "Ny startdato er sat. Den forrige periode ligger i historikken."
          : "Din snusfri-tid fortsætter. Videre herfra.") +
        "</p>"
    );
  }

  function openCheckinFor(dateIso) {
    const today = dateIso || todayISO(new Date());
    const existing = (state.checkins || []).find(function (c) { return c.date === today; }) || null;
    openCheckin(existing, today);
  }
  function openCheckin(existing, dateIso) {
    existing = existing || todayCheckin();
    const ciDate = dateIso || (existing && existing.date) || todayISO(new Date());
    const moodBtns = MOODS.map((m) => {
      const on = existing && existing.mood === m.id;
      return (
        '<button type="button" class="mood' +
        (on ? " on" : "") +
        '" data-act="chip" data-group="mood" data-val="' +
        m.id +
        '"><span class="face">' +
        m.face +
        "</span>" +
        esc(m.label) +
        "</button>"
      );
    }).join("");
    const crave = [];
    for (let i = 1; i <= 5; i++) {
      crave.push(
        '<button type="button" data-act="chip" data-group="crave" data-val="' +
          i +
          '" class="' +
          (existing && String(existing.craving) === String(i) ? "on" : "") +
          '">' +
          i +
          "</button>"
      );
    }
    openSheet(
      "<h2>Dagens check-in</h2>" +
        '<p class="sheet-lead">Hvordan har du det i dag?</p>' +
        '<div class="field"><div class="moods" id="ci-mood">' +
        moodBtns +
        "</div></div>" +
        '<div class="field"><label>Trang i dag</label><div class="intensity" id="ci-crave">' +
        crave.join("") +
        "</div>" +
        '<p class="hint">1 er ingen, 5 er stærk.</p></div>' +
        '<div class="field"><label>Note (valgfri)</label><textarea id="ci-note" class="input" maxlength="300">' +
        esc(existing ? existing.note || "" : "") +
        "</textarea></div>" +
        '<button class="btn btn-primary btn-block" data-act="checkin-save">Gem</button>'
    );
    const root = $("#modal-root");
    root._ci = {
      mood: existing ? existing.mood : 0,
      craving: existing ? existing.craving : 0,
      date: ciDate
    };
  }

  function saveCheckin() {
    const root = $("#modal-root");
    const data = (root && root._ci) || {};
    if (!data.mood) {
      toast("Vælg dit humør.", "warn");
      return;
    }
    const note = (($("#ci-note") || {}).value || "").trim();
    const today = (root && root._ci && root._ci.date) || todayISO(new Date());
    const existing = (state.checkins || []).find(function (c) { return c.date === today; }) || null;
    if (existing) {
      existing.mood = Number(data.mood);
      existing.craving = Number(data.craving) || 0;
      existing.note = note;
    } else {
      state.checkins.push({
        id: uid(),
        date: today,
        mood: Number(data.mood),
        craving: Number(data.craving) || 0,
        note: note
      });
    }
    save();
    checkAchievements(false);
    closeModal();
    render();
    toast("Check-in gemt. Tak fordi du kiggede ind.");
  }

  function openGoalForm(id) {
    const g = id ? (state.goals || []).find((x) => x.id === id) : null;
    openSheet(
      "<h2>" +
        (g ? "Rediger mål" : "Nyt sparemål") +
        "</h2>" +
        '<div class="field"><label>Hvad sparer du op til?</label>' +
        '<input id="goal-name" class="input" maxlength="80" placeholder="Fx MacBook Pro" value="' +
        esc(g ? g.name : "") +
        '"></div>' +
        '<div class="field"><label>Pris (kr)</label>' +
        '<input id="goal-price" class="input" inputmode="decimal" placeholder="14999" value="' +
        esc(g ? String(g.price) : "") +
        '"></div>' +
        (function () {
          const list = reasonsList();
          if (!list.length) return "";
          const cur = g && g.reasonId;
          return (
            '<div class="field"><label for="goal-reason">Knyt til en grund (valgfrit)</label>' +
            '<select id="goal-reason" class="input">' +
            '<option value="">Ingen særlig grund</option>' +
            list
              .map(function (r) {
                return (
                  '<option value="' +
                  esc(r.id) +
                  '"' +
                  (cur === r.id ? " selected" : "") +
                  ">" +
                  esc(r.text.length > 72 ? r.text.slice(0, 70) + "…" : r.text) +
                  "</option>"
                );
              })
              .join("") +
            "</select></div>"
          );
        })() +
        '<button class="btn btn-gold btn-block" data-act="goal-save" data-id="' +
        esc(g ? g.id : "") +
        '">Gem mål</button>'
    );
  }

  function saveGoal(id) {
    const name = (($("#goal-name") || {}).value || "").trim();
    const price = parseNum(($("#goal-price") || {}).value);
    const reasonId = (($("#goal-reason") || {}).value || "").trim();
    if (!name) {
      toast("Giv målet et navn.", "warn");
      return;
    }
    if (!(price > 0)) {
      toast("Angiv en pris i kroner.", "warn");
      return;
    }
    if (id) {
      const g = state.goals.find((x) => x.id === id);
      if (g) {
        g.name = name;
        g.price = price;
        g.reasonId = reasonId || "";
        if (g.reachedAt && stats().money < price) g.reachedAt = null;
      }
    } else {
      state.goals.push({
        id: uid(),
        name: name,
        price: price,
        createdAt: new Date().toISOString(),
        reachedAt: null,
        reasonId: reasonId || ""
      });
    }
    save();
    checkAchievements(false);
    closeModal();
    view = "goals";
    render();
  }

  /* ---------------- export / import / reset ---------------- */
  async function exportData() {
    const json = JSON.stringify(state, null, 2);
    const name = "snusfri-backup-" + todayISO(new Date()) + ".json";
    const blob = new Blob([json], { type: "application/json" });
    try {
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], name, { type: "application/json" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: "Snusfri sikkerhedskopi" });
          return;
        }
      }
    } catch (err) {
      if (err && err.name === "AbortError") return;
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 500);
    toast("Sikkerhedskopi klar.");
  }

  function importData() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (!data || typeof data !== "object") throw new Error("ugyldig");
          if (!data.profile && !data.onboarded) throw new Error("mangler profil");
          state = adoptData(data);
          save();
          render();
          toast("Data importeret. Historikken er bevaret.");
        } catch (err) {
          toast("Kunne ikke læse filen. Er det en Snusfri-kopi?", "warn");
        }
      };
      reader.readAsText(file);
    });
    input.click();
  }

  function resetAll() {
    openDialog({
      title: "Nulstil alt?",
      body: "Det sletter tælleren, mål, dagbog og historik på denne enhed. Det kan ikke fortrydes, medmindre du har en eksport-kopi.",
      ok: "Ja, slet alt",
      danger: true,
      onOk: () => {
        state = defaultState();
        save();
        obDraft = null;
        obStep = 0;
        morePage = null;
        view = "home";
        closeModal();
        render();
        toast("Alt er nulstillet.");
      }
    });
  }

  /* ---------------- actions ---------------- */
  const actions = {
    "close-modal": () => closeModal(),
    "dialog-ok": () => {
      const fn = $("#modal-root") && $("#modal-root")._onOk;
      if (fn) fn();
    },
    tab: (el) => {
      view = el.dataset.tab;
      morePage = null;
      render();
    },
    sos: () => openSOS(),
    "sos-tips": () => {
      const s = readSos();
      openTips();
      $("#modal-root")._sos = s;
    },
    "sos-log": (el) => {
      const s = readSos();
      logCraving({
        intensity: s.intensity,
        intensityAfter: s.intensityAfter,
        trigger: s.trigger,
        note: s.note,
        resisted: el.dataset.resisted !== "0",
        usedBreathing: !!s.usedBreathing || el.dataset.breath === "1",
        usedWave: !!s.usedWave || el.dataset.wave === "1"
      });
      closeModal();
      closeWave();
      render();
      toast("Logget. Godt klaret.");
    },
    "start-breath": () => startBreathing(),
    "breath-done": () => {
      if (breathStop) breathStop(true);
    },
    "breath-skip": () => {
      if (breathStop) breathStop(true);
    },
    "dismiss-install": () => {
      state.dismissed.install = true;
      save();
      const b = $("#install-banner");
      if (b) b.remove();
    },
    checkin: () => openCheckin(),
    "checkin-save": () => saveCheckin(),
    "add-goal": () => openGoalForm(null),
    "edit-goal": (el) => openGoalForm(el.dataset.id),
    "del-goal": (el) => {
      const id = el.dataset.id;
      openDialog({
        title: "Fjern mål?",
        body: "Målet slettes. Det påvirker ikke dine sparede penge.",
        ok: "Fjern",
        danger: true,
        onOk: () => {
          state.goals = (state.goals || []).filter((g) => g.id !== id);
          save();
          closeModal();
          render();
        }
      });
    },
    "goal-save": (el) => saveGoal(el.dataset.id || ""),
    slip: () => openSlip(),
    "slip-save": (el) => saveSlip(el.dataset.reset === "1"),
    more: (el) => {
      morePage = el.dataset.page;
      render();
    },
    "more-back": () => {
      morePage = null;
      render();
    },
    "goto-taper": () => {
      view = "more";
      morePage = "taper";
      render();
    },
    export: () => exportData(),
    import: () => importData(),
    "reset-all": () => resetAll(),
    "ob-next": () => {
      pullOnboardingForm();
      obStep = Math.min(5, obStep + 1);
      renderOnboarding();
    },
    "ob-back": () => {
      pullOnboardingForm();
      obStep = Math.max(0, obStep - 1);
      renderOnboarding();
    },
    "ob-now": () => {
      ensureDraft().quitAt = new Date().toISOString();
      const q = $("#ob-quit");
      if (q) q.value = toLocalInput(obDraft.quitAt);
    },
    "ob-mode": (el) => {
      pullOnboardingForm();
      const mode = el.dataset.mode;
      if (obDraft) obDraft.habitMode = mode;
      // Also live-toggle without full rerender if possible
      $$(".seg button").forEach((b) => b.classList.toggle("on", b.dataset.mode === mode));
      const cans = $("#ob-cans-field");
      const pou = $("#ob-pouches-field");
      if (cans) cans.style.display = mode === "pouches" ? "none" : "";
      if (pou) pou.style.display = mode === "pouches" ? "" : "none";
      if (state.onboarded) {
        /* settings live toggle only */
      }
    },
    "ob-finish": () => finishOnboarding(),
    "ob-demo": () => {
      seedDemo();
      render();
      toast("Eksempeldata indlæst. Du kan nulstille under Mere.");
    },
    step: (el) => {
      const id = el.dataset.target;
      const input = document.getElementById(id);
      if (!input) return;
      const amt = parseNum(el.dataset.amt || "1") || 1;
      const dir = Number(el.dataset.dir) || 1;
      let v = parseNum(input.value);
      if (isNaN(v)) v = 0;
      v = Math.max(0, Math.round((v + dir * amt) * 100) / 100);
      input.value = String(v);
    },
    chip: (el) => {
      const group = el.dataset.group;
      const val = el.dataset.val;
      const parent = el.parentElement;
      if (parent) {
        $$("button", parent).forEach((b) => b.classList.toggle("on", b === el));
      }
      const root = $("#modal-root");
      if (!root) return;
      if (group === "intensity") {
        root._sos = root._sos || {};
        root._sos.intensity = Number(val);
      } else if (group === "trigger") {
        root._sos = root._sos || {};
        root._sos.trigger = val;
      } else if (group === "mood") {
        root._ci = root._ci || {};
        root._ci.mood = Number(val);
      } else if (group === "crave") {
        root._ci = root._ci || {};
        root._ci.craving = Number(val);
      } else if (group === "intensityAfter") {
        root._sos = root._sos || {};
        root._sos.intensityAfter = Number(val);
      } else if (group === "plan-trigger") {
        root._plan = root._plan || {};
        root._plan.trigger = val;
        const tmpl = templateFor(val);
        const iff = $("#plan-if");
        const th = $("#plan-then");
        if (iff && !iff.value) iff.value = tmpl.ifText;
        if (th && !th.value) th.value = tmpl.thenText;
        if (iff && iff.dataset.auto !== "0") iff.value = tmpl.ifText;
        if (th && th.dataset.auto !== "0") th.value = tmpl.thenText;
      } else if (group === "drinking") {
        root._party = root._party || {};
        root._party.drinking = val;
      } else if (group === "slip-alc") {
        root._slip = root._slip || {};
        root._slip.alcohol = val;
      }
      if (group === "trigger") {
        const slot = $("#sos-plan-slot");
        if (slot) slot.innerHTML = sosPlanHtml(val);
      }
    },
    "taper-start": () => {
      const startP = parseNum(($("#tp-start") || {}).value);
      const endP = parseNum(($("#tp-end") || {}).value);
      const weeks = parseNum(($("#tp-weeks") || {}).value);
      const stop = (($("#tp-stop") || {}).value || "").trim();
      const mg = parseNum(($("#tp-mg") || {}).value);
      if (!(startP >= 0) || isNaN(startP)) {
        toast("Angiv et startantal.", "warn");
        return;
      }
      if (!stop) {
        toast("Nedtrapning skal have en fast stopdato.", "warn");
        return;
      }
      state.taper = {
        enabled: true,
        startPouches: startP,
        targetPouches: isNaN(endP) ? 0 : Math.max(0, endP),
        startDate: todayISO(new Date()),
        stopDate: stop,
        weeks: Math.max(1, weeks || 6),
        strengthMg: isNaN(mg) ? (state.profile.nicotineMg || 0) : mg,
        logs: (state.taper && state.taper.logs) || {},
        strengthLogs: (state.taper && state.taper.strengthLogs) || {}
      };
      state.profile.quitMode = "taper";
      save();
      render();
      toast("Nedtrapningsplanen er i gang. Styrken må falde, antallet bør ikke stige.");
    },
    "taper-log": () => {
      const v = parseNum(($("#tp-used") || {}).value);
      if (isNaN(v) || v < 0) {
        toast("Angiv et antal poser.", "warn");
        return;
      }
      state.taper.logs = state.taper.logs || {};
      state.taper.logs[todayISO(new Date())] = v;
      save();
      render();
      toast("Dagens antal er gemt.");
    },
    "taper-stop": () => {
      openDialog({
        title: "Afslut planen?",
        body: "Selve loggen bevares, men den daglige ramme slås fra.",
        ok: "Afslut",
        onOk: () => {
          state.taper.enabled = false;
          save();
          closeModal();
          render();
        }
      });
    },
    "settings-save": () => {
      const p = state.profile;
      const q = $("#st-quit");
      if (q && q.value) p.quitAt = new Date(q.value).toISOString();
      const modeBtn = $("#st-mode button.on") || $(".seg button.on");
      if (modeBtn) p.habitMode = modeBtn.dataset.mode || p.habitMode;
      const val = (id, def) => {
        const el = document.getElementById(id);
        if (!el) return def;
        const n = parseNum(el.value);
        return isNaN(n) ? def : n;
      };
      p.cansPerWeek = val("ob-cans", p.cansPerWeek);
      p.pouchesPerDay = val("ob-pouches", p.pouchesPerDay);
      p.pricePerCan = val("ob-price", p.pricePerCan);
      p.pouchesPerCan = val("ob-ppc", p.pouchesPerCan);
      p.nicotineMg = val("ob-nic", p.nicotineMg);
      const mot = $("#ob-motivation");
      if (mot) p.motivation = mot.value;
      save();
      checkAchievements(true);
      toast("Indstillinger gemt.");
      morePage = null;
      render();
    },
    "start-wave": () => {
      const sos = (function () { try { return readSos(); } catch (e) { return {}; } })();
      startWave({ sos: sos });
    },
    "wave-done": () => { if (waveStop) waveStop("okay"); },
    "wave-skip": () => { if (waveStop) waveStop("skip"); },
    "wave-to-breath": () => {
      const sos = (function () { try { return readSos(); } catch (e) { return {}; } })();
      if (waveStop) {
        /* close without counting skip as a ride */
        if (waveRaf) cancelAnimationFrame(waveRaf);
        waveStop = null;
      }
      closeWave();
      if (state.onboarded) $("#tabbar").classList.remove("hidden");
      const root = $("#modal-root");
      openSOS(sos);
      if (root) root._sos = Object.assign({}, sos);
      startBreathing();
    },
    "wave-tip": (el) => {
      if (el.dataset.id === "and") {
        actions["wave-to-breath"]();
        return;
      }
      toast("Gør den færdig, før du beslutter noget andet.");
    },
    "bare-en": () => openBareEn(),
    "toggle-money": () => { homeMoneyOpen = !homeMoneyOpen; if (view === "home") renderHome(); else render(); },
    "share-status": () => shareStatus(),
    "buddy-share": () => shareStatus({ buddy: true }),
    "compass-day": (el) => {
      compassPeekDay = Number(el.dataset.day) || null;
      if (view === "health") renderHealth();
      else render();
    },
    "weekend-review": () => openWeekendReview(),
    "dismiss-morning": () => { state.dismissed.morningPlan = true; save(); render(); },
    "dismiss-d28": () => { state.dismissed.d28 = true; save(); render(); },
    "dismiss-plan-prompt": () => { state.dismissed.planPrompt = true; save(); render(); },
    "weight-save": () => {
      const raw = (($("#weight-kg") || {}).value || "").trim().replace(",", ".");
      if (!raw) {
        toast("Skriv en vægt, eller lad feltet stå.", "warn");
        return;
      }
      const kg = parseNum(raw);
      if (!(kg > 20 && kg < 400)) {
        toast("Tallet ser usædvanligt ud. Tjek det lige.", "warn");
        return;
      }
      state.weightLog = state.weightLog || {};
      state.weightLog[todayISO(new Date())] = { kg: kg, at: new Date().toISOString() };
      save();
      toast("Vægt gemt. Kun for dig — det her er ikke et slankeprogram.");
    },
    "goto-insights": () => { view = "more"; morePage = "insights"; closeModal(); closeToolScreen(); render(); },
    "goto-recap": () => { view = "more"; morePage = "recap"; closeModal(); render(); },
    "goto-letter": () => { view = "more"; morePage = "letter"; closeModal(); render(); },
    "set-theme": (el) => {
      state.theme = el.dataset.theme || "system";
      save();
      applyTheme();
      render();
    },
    "letter-save": () => {
      const t = (($("#letter-text") || {}).value || "").trim();
      if (!t) { toast("Skriv et par linjer — eller lad det vente.", "warn"); return; }
      const prev = state.letter || {};
      state.letter = {
        text: t,
        writtenAt: prev.writtenAt || new Date().toISOString(),
        openedAt: null
      };
      letterEditing = false;
      save();
      render();
      toast("Brevet er gemt. Det åbnes på dag 30.");
    },
    "letter-edit": () => {
      const ls = letterState();
      if (ls.unlocked) return;
      letterEditing = true;
      render();
    },
    "tool-ground": () => startGround(),
    "tool-cold": () => startCountdownTool({
      id: "cold",
      kicker: "30 sekunder",
      title: "Koldt vand",
      body: "Hold et koldt glas, eller skyl hænder og ansigt. Mærk kulden. Tredive sekunder.",
      ms: (typeof DELAY_MS !== "undefined" && DELAY_MS < 60000) ? 4000 : 30000
    }),
    "tool-move": () => startCountdownTool({
      id: "move",
      kicker: "30 sekunder",
      title: "Rejs dig",
      body: "Ti dybe squats, eller ryst arme og ben. Eller en væg-sid. Kroppen først, beslutningen bagefter.",
      ms: (typeof DELAY_MS !== "undefined" && DELAY_MS < 60000) ? 4000 : 30000
    }),
    "tool-delay": () => {
      if (state.activeDelay && state.activeDelay.end && !state.activeDelay.done) startDelay({ resume: true });
      else startDelay();
    },
    "tool-close": () => closeToolScreen(),
    "tool-delay-done": () => {
      closeToolScreen();
      state.activeDelay = null;
      save();
      askHelped("delay");
    },
    "ground-next": () => { if (window._groundPaint) window._groundPaint(true); },
    "tool-helped": (el) => {
      recordToolHelp(el.dataset.id, el.dataset.val);
      closeModal();
      toast(el.dataset.val === "yes" ? "Gemt. Vi husker, hvad der hjalp." : "Gemt.");
      if (view === "craving") render();
    },
    "goto-compass": () => { view = "health"; morePage = null; closePartyScreen(); render(); },
    "goto-plans": () => { view = "more"; morePage = "plans"; closeModal(); closePartyScreen(); render(); },
    "goto-party": () => { view = "more"; morePage = "party"; closeModal(); render(); },
    "goto-reasons": () => { view = "more"; morePage = "reasons"; closeModal(); render(); },
    "goto-help": () => { view = "more"; morePage = "help"; closeModal(); closePartyScreen(); render(); },
    "goto-inbox": () => { view = "more"; morePage = "inbox"; closeModal(); render(); },
    "goto-days": () => { view = "more"; morePage = "days"; closeModal(); render(); },
    "goto-data": () => { view = "more"; morePage = "data"; render(); },
    "add-plan": (el) => openPlanForm(null, el.dataset.trigger || ""),
    "edit-plan": (el) => openPlanForm(el.dataset.id, ""),
    "del-plan": (el) => {
      const id = el.dataset.id;
      openDialog({
        title: "Fjern plan?",
        body: "Planen slettes. Du kan altid lave en ny.",
        ok: "Fjern",
        danger: true,
        onOk: () => {
          state.ifThenPlans = (state.ifThenPlans || []).filter(function (p) { return p.id !== id; });
          save();
          closeModal();
          render();
        }
      });
    },
    "plan-save": (el) => savePlan(el.dataset.id || ""),
    "reasons-save": () => {
      const list = [];
      for (let i = 0; i < 5; i++) {
        const el = document.getElementById("rsn-" + i);
        if (el && el.value.trim()) list.push({ id: uid(), text: el.value.trim() });
      }
      if (!list.length) {
        toast("Skriv mindst én grund.", "warn");
        return;
      }
      state.reasons = list;
      syncMotivation();
      save();
      morePage = null;
      render();
      toast("Grundene er gemt. De ligger ét swipe væk.");
    },
    "buddy-save": () => {
      state.buddy = {
        name: (($("#buddy-name") || {}).value || "").trim(),
        phone: (($("#buddy-phone") || {}).value || "").trim(),
        note: (($("#buddy-note") || {}).value || "").trim()
      };
      save();
      render();
      toast("Makker gemt.");
    },
    "party-new": () => openPartyForm(null),
    "party-save": (el) => savePartyPlan(el.dataset.id || ""),
    "party-start": (el) => startPartyMode(el.dataset.id || ""),
    "party-held": () => endParty(true),
    "party-slip": () => endParty(false),
    "party-close": () => {
      closePartyScreen();
      render();
    },
    "del-party": (el) => {
      const id = el.dataset.id;
      state.partyPlans = (state.partyPlans || []).filter(function (p) { return p.id !== id; });
      if (state.activeParty && state.activeParty.planId === id) state.activeParty = null;
      save();
      render();
    },
    "dismiss-party-held": () => {
      state.dismissed.partyHeld = true;
      if (state.activeParty && state.activeParty.endedAt) state.activeParty = null;
      save();
      render();
    },
    "dismiss-leftovers": () => {
      state.dismissed.leftovers = true;
      if (state.profile) state.profile.leftovers = "no";
      save();
      render();
      toast("Godt. Skuffen er tom.");
    },
    "edit-day": (el) => openDayEditor(el.dataset.iso),
    "day-save": (el) => {
      const iso = el.dataset.iso;
      const n = parseNum(($("#day-n") || {}).value);
      const note = (($("#day-note") || {}).value || "").trim();
      if (isNaN(n) || n < 0) {
        toast("Angiv et antal poser (0 er fint).", "warn");
        return;
      }
      state.dayLog = state.dayLog || {};
      state.dayLog[iso] = { pouches: n, note: note, source: "user", editedAt: new Date().toISOString() };
      save();
      closeModal();
      render();
      toast(n === 0 ? "Dagen er nul poser." : "Dagen er gemt.");
      if (n > 0) {
        /* Offer slip so money stays consistent — never auto-change the counter. */
        openDialog({
          title: "Log også som slip?",
          body: "Du har noteret " + n + " poser. Hvis du også logger et slip, følger sparede penge og tæller med — historikken slettes ikke.",
          ok: "Log slip",
          cancel: "Nej, kun dagen",
          onOk: () => {
            closeModal();
            openSlip();
            const inp = $("#slip-n");
            if (inp) inp.value = String(n);
          }
        });
      }
    },
    "aftersyn-save": (el) => {
      const next = (($("#slip-next") || {}).value || "").trim();
      const id = el.dataset.id;
      const slip = (state.slips || []).find(function (s) { return s.id === id; });
      if (slip) slip.nextTime = next;
      if (next) {
        const trigger = el.dataset.trigger || "Fest";
        const parts = next.split(/så/i);
        const ifText = (parts[0] || "").trim() || templateFor(trigger).ifText;
        const thenText = (parts[1] || next).trim() || templateFor(trigger).thenText;
        const existing = ifThenFor(trigger);
        if (existing) {
          existing.ifText = ifText;
          existing.thenText = thenText.startsWith("så") ? thenText : "så " + thenText.replace(/^så\s+/i, "");
        } else {
          state.ifThenPlans.push({
            id: uid(),
            trigger: trigger,
            ifText: ifText,
            thenText: thenText.startsWith("så") ? thenText : "så " + thenText.replace(/^så\s+/i, ""),
            createdAt: new Date().toISOString(),
            fromSlip: true
          });
        }
      }
      save();
      closeModal();
      morePage = "history";
      view = "more";
      render();
      toast("Vi starter igen nu. Planen ligger klar.");
    },
    "aftersyn-skip": () => {
      closeModal();
      morePage = "history";
      view = "more";
      render();
      toast("Vi starter igen nu.");
    },
    "sleep-save": () => {
      const n = parseNum(($("#sleep-wakes") || {}).value);
      state.sleepLog = state.sleepLog || {};
      state.sleepLog[todayISO(new Date())] = { wakes: isNaN(n) ? 0 : n, at: new Date().toISOString() };
      const ci = todayCheckin();
      if (ci) ci.sleepWakes = isNaN(n) ? 0 : n;
      save();
      toast("Søvn gemt. Det er forventeligt, at den er urolig den første uge.");
    },
    "notify-ask": () => {
      if (!("Notification" in window)) {
        toast("Din enhed understøtter ikke notifikationer. Beskederne ligger her i appen.", "warn");
        return;
      }
      Notification.requestPermission().then(function (p) {
        state.notifyPrefs = state.notifyPrefs || {};
        state.notifyPrefs.enabled = p === "granted";
        save();
        toast(p === "granted" ? "Varsler er slået til, når appen er åben." : "Du kan stadig læse beskederne her i appen.");
        render();
      });
    },
    "notify-times-save": () => {
      const raw = (($("#notify-times") || {}).value || "").trim();
      const times = raw
        ? raw.split(/[,;]/).map(function (t) { return t.trim(); }).filter(Boolean)
        : [];
      state.notifyPrefs = state.notifyPrefs || { enabled: false, earlyIntense: true, times: [] };
      state.notifyPrefs.times = times;
      save();
      toast("Tidspunkter gemt. Beskederne vises, når du åbner appen omkring dem.");
    },
    "nf-start": () => {
      const end = (($("#nf-end") || {}).value || "").trim();
      if (!end) {
        toast("Sæt en udløbsdato — erstatningen skal have en udgang.", "warn");
        return;
      }
      state.nicotineFree = {
        enabled: true,
        startDate: todayISO(new Date()),
        endDate: end,
        logs: (state.nicotineFree && state.nicotineFree.logs) || {},
        warned: true
      };
      save();
      render();
      toast("Loggen er i gang. Målet er også at lægge de nikotinfri.");
    },
    "nf-log": () => {
      const v = parseNum(($("#nf-used") || {}).value);
      if (isNaN(v) || v < 0) {
        toast("Angiv et antal.", "warn");
        return;
      }
      state.nicotineFree.logs = state.nicotineFree.logs || {};
      state.nicotineFree.logs[todayISO(new Date())] = v;
      save();
      render();
      toast("Gemt.");
    },
    "nf-stop": () => {
      openDialog({
        title: "Læg de nikotinfri?",
        body: "Loggen bevares, men sporingen slås fra. Det var hele meningen.",
        ok: "Afslut",
        onOk: () => {
          state.nicotineFree.enabled = false;
          save();
          closeModal();
          render();
        }
      });
    },
    "restore-backup": () => {
      try {
        const raw = localStorage.getItem(STORAGE_BACKUP);
        if (!raw) {
          toast("Ingen intern kopi fundet.", "warn");
          return;
        }
        openDialog({
          title: "Gendan intern kopi?",
          body: "Det erstatter de nuværende data med den seneste automatiske kopi. Eksporter først, hvis du er i tvivl.",
          ok: "Gendan",
          onOk: () => {
            state = adoptData(JSON.parse(raw));
            save();
            closeModal();
            render();
            toast("Intern kopi gendannet.");
          }
        });
      } catch (e) {
        toast("Kunne ikke gendanne kopien.", "warn");
      }
    },
    "restore-snapshot": () => {
      try {
        const raw = localStorage.getItem(STORAGE_SNAPSHOT);
        if (!raw) {
          toast("Ingen kopi fra før opgraderingen.", "warn");
          return;
        }
        openDialog({
          title: "Gendan ældre kopi?",
          body: "Det erstatter de nuværende data med kopien fra før v8-opgraderingen. Eksporter først, hvis du er i tvivl.",
          ok: "Gendan",
          onOk: () => {
            state = adoptData(JSON.parse(raw));
            save();
            closeModal();
            render();
            toast("Kopi gendannet.");
          }
        });
      } catch (e) {
        toast("Kunne ikke gendanne kopien.", "warn");
      }
    },
    "checkin-past": () => {
      openSheet(
        "<h2>Tidligere dag</h2>" +
          '<p class="sheet-lead">Tilføj eller ret et check-in på en tidligere dato.</p>' +
          '<div class="field"><label>Dato</label>' +
          '<input id="ci-date" class="input" type="date" value="' +
          esc(todayISO(new Date())) +
          '"></div>' +
          '<button class="btn btn-primary btn-block" data-act="checkin-past-go">Fortsæt</button>'
      );
    },
    "checkin-past-go": () => {
      const d = (($("#ci-date") || {}).value || "").trim();
      if (!d) {
        toast("Vælg en dato.", "warn");
        return;
      }
      closeModal();
      openCheckinFor(d);
    },
    "checkin-edit": (el) => openCheckinFor(el.dataset.date),
    "ob-quitmode": (el) => {
      pullOnboardingForm();
      if (obDraft) obDraft.quitMode = el.dataset.quitmode;
      renderOnboarding();
    },
    "ob-leftovers": (el) => {
      pullOnboardingForm();
      if (obDraft) obDraft.leftovers = el.dataset.leftovers;
      renderOnboarding();
    },
    "ob-alc": (el) => {
      pullOnboardingForm();
      if (obDraft) obDraft.alcoholFirstWeeks = el.dataset.alc;
      renderOnboarding();
    },
    "ob-pick-trig": (el) => {
      pullOnboardingForm();
      const t = el.dataset.val;
      const d = ensureDraft();
      d.pickedTriggers = d.pickedTriggers || [];
      const i = d.pickedTriggers.indexOf(t);
      if (i >= 0) d.pickedTriggers.splice(i, 1);
      else {
        if (d.pickedTriggers.length >= 3) {
          toast("Vælg op til tre. Fjern én for at vælge en anden.", "warn");
          return;
        }
        d.pickedTriggers.push(t);
        if (!d.planDrafts[t]) {
          const tmpl = templateFor(t);
          d.planDrafts[t] = { ifText: tmpl.ifText, thenText: tmpl.thenText };
        }
      }
      renderOnboarding();
    }
  };

  function onTap(e) {
    const el = e.target.closest("[data-act]");
    if (!el) return;
    const act = el.dataset.act;
    if (!actions[act]) return;
    e.preventDefault();
    actions[act](el, e);
  }

  /* ---------------- seed demo ---------------- */
  function seedDemo(opts) {
    opts = opts || {};
    const now = opts.now || Date.now();
    const dayCount = opts.days != null ? Number(opts.days) : 120;
    const quitAt = new Date(now - (dayCount * 86400000 + 8 * 3600000 + 14 * 60000 + 22 * 1000));
    const costPerDay = (13 * 67) / 7;

    const cravingDays = [1, 1, 2, 2, 3, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 19, 22, 26, 31, 38, 47, 58, 72, 88, 108, 112, 115, 117, 119, 120];
    const intensities = [7, 8, 9, 7, 8, 6, 7, 8, 6, 7, 5, 6, 7, 5, 6, 4, 5, 6, 4, 5, 3, 4, 3, 4, 3, 4, 3, 2, 3, 2];
    const cravings = cravingDays.map((day, i) => {
      const hour = i % 5 === 0 ? 10 + (i % 3) : 15 + (i % 3);
      const atDate = new Date(quitAt.getTime() + day * 86400000);
      atDate.setHours(hour, (i * 7) % 60, 0, 0);
      if (atDate.getTime() < quitAt.getTime()) atDate.setTime(quitAt.getTime() + 3600000);
      const at = atDate;
      return {
        id: "c" + i,
        at: at.toISOString(),
        intensity: intensities[i],
        trigger: TRIGGERS[i % TRIGGERS.length],
        note: i === 3 ? "Efter en lang dag. Cirklen hjalp." : "",
        resisted: true,
        usedBreathing: i % 3 === 0,
        usedWave: i % 4 === 0
      };
    });

    /* Drop future-dated cravings if the demo is a short streak. */
    const cravingsKept = cravings.filter(function (c) { return new Date(c.at).getTime() <= now; });

    const moods = [4, 5, 3, 4, 5, 4, 3, 5, 4, 4, 5, 3, 4, 5];
    const craveL = [2, 1, 3, 2, 1, 2, 3, 1, 2, 1, 1, 2, 2, 1];
    const checkins = [];
    for (let i = 13; i >= 0; i--) {
      if (i === 11) continue;
      const d = new Date(now - i * 86400000);
      const idx = 13 - i;
      checkins.push({
        id: "k" + i,
        date: todayISO(d),
        mood: moods[idx] || 4,
        craving: craveL[idx] || 1,
        note:
          i === 0
            ? "En rolig dag. Kaffen gik fint uden pose."
            : i === 7
            ? "Stresset på arbejde, men det gik."
            : ""
      });
    }

    function reachedAt(price) {
      const days = price / costPerDay;
      return new Date(quitAt.getTime() + days * 86400000).toISOString();
    }

    const goals = [
      {
        id: "g1",
        name: "Nye løbesko",
        price: 1200,
        createdAt: quitAt.toISOString(),
        reachedAt: reachedAt(1200)
      },
      {
        id: "g2",
        name: "Weekend i Berlin",
        price: 4500,
        createdAt: quitAt.toISOString(),
        reachedAt: reachedAt(4500)
      },
      {
        id: "g3",
        name: "MacBook Pro",
        price: 14999,
        createdAt: quitAt.toISOString(),
        reachedAt: null
      },
      {
        id: "g4",
        name: "Familieferie i Skagen",
        price: 18000,
        createdAt: quitAt.toISOString(),
        reachedAt: null
      }
    ];

    state = defaultState();
    state.onboarded = true;
    state.profile = {
      quitAt: quitAt.toISOString(),
      habitMode: "cans",
      cansPerWeek: 13,
      pouchesPerDay: 20,
      pricePerCan: 67,
      pouchesPerCan: 20,
      nicotineMg: 8,
      motivation:
        "Jeg vil være til stede. For mine nærmeste, for min sundhed — og for at bruge pengene på noget, der faktisk betyder noget."
    };
    state.goals = dayCount >= 30 ? goals : goals.slice(2);
    state.cravings = cravingsKept;
    state.checkins = checkins;
    state.slips = [];
    state.streaks = [];
    state.taper = { enabled: false, startPouches: 20, targetPouches: 0, startDate: null, stopDate: null, weeks: 6, strengthMg: 8, logs: {}, strengthLogs: {} };
    state.dismissed = { install: !!opts.hideInstall };
    state.achievements = {};
    state.reasons = [
      { id: "r1", text: "Jeg vil være til stede. For mine nærmeste, for min sundhed — og for at bruge pengene på noget, der faktisk betyder noget." },
      { id: "r2", text: "Jeg er træt af at tage en pose for bare at føle mig normal." },
      { id: "r3", text: "Jeg vil kunne holde en fest uden at falde i." }
    ];
    state.profile.motivation = state.reasons[0].text;
    state.ifThenPlans = [
      { id: "p1", trigger: "Fest", ifText: "Hvis jeg bliver budt en pose til fest", thenText: "så siger jeg: Nej tak, jeg tager ikke snus.", createdAt: quitAt.toISOString() },
      { id: "p2", trigger: "Alkohol", ifText: "Hvis jeg drikker og får sug", thenText: "så drikker jeg et glas vand og skriver til min makker.", createdAt: quitAt.toISOString() },
      { id: "p3", trigger: "Kaffe", ifText: "Hvis jeg drikker kaffe og får lyst til en pose", thenText: "så tygger jeg tyggegummi og bliver siddende.", createdAt: quitAt.toISOString() }
    ];
    state.buddy = { name: "Maja", phone: "12345678", note: "Jeg er til fest i aften. Skriv til mig kl. 23, ok?" };
    state.wavesRidden = cravingsKept.filter(function (c) { return c.usedWave; }).length;
    state.partiesHeld = dayCount >= 30 ? 1 : 0;
    state.partyPlans = [
      {
        id: "fest1",
        createdAt: new Date(now - 3 * 86400000).toISOString(),
        when: new Date(now + 6 * 3600000).toISOString(),
        drinking: "little",
        drinkLimit: 3,
        who: "Maja",
        say: "Nej tak, jeg tager ikke snus.",
        endTime: "23:00",
        substitute: "Et glas koldt vand",
        exit: "Jeg tager en taxa kl. 23",
        held: false,
        endedAt: null
      }
    ];
    state.activeParty = null;
    state.nicotineFree = { enabled: false, startDate: null, endDate: null, logs: {}, warned: false };
    state.inbox = [];
    state.inboxSeen = {};
    state.notifyPrefs = { enabled: false, earlyIntense: true, times: ["08:00", "22:00"] };
    state.dayLog = {};
    state.sleepLog = {};
    state.weightLog = {};
    state.profile.leftovers = "no";
    state.profile.alcoholFirstWeeks = "little";
    state.profile.quitMode = "cold";
    /* A few explicit zero-days and one edited day. */
    for (let dli = 0; dli < Math.min(10, Math.floor(dayCount)); dli++) {
      const di = new Date(now - dli * 86400000);
      state.dayLog[todayISO(di)] = { pouches: 0, note: "", source: "user" };
    }
    checkAchievements(true);
    // Stamp unlocks at the moment they would actually have been earned
    (function stamp() {
      const q = quitAt.getTime();
      const cpd = costPerDay;
      const set = (id, ms) => {
        if (state.achievements[id] && ms && ms <= now) {
          state.achievements[id] = new Date(ms).toISOString();
        }
      };
      set("h1", q + 36e5);
      set("d1", q + 864e5);
      set("d3", q + 3 * 864e5);
      set("w1", q + 7 * 864e5);
      set("w2", q + 14 * 864e5);
      set("m1", q + 30 * 864e5);
      set("d100", q + 100 * 864e5);
      set("k1", q + (1000 / cpd) * 864e5);
      set("k5", q + (5000 / cpd) * 864e5);
      set("k10", q + (10000 / cpd) * 864e5);
      set("k25", q + (25000 / cpd) * 864e5);
      const resisted = cravings.filter((c) => c.resisted);
      if (resisted[9]) set("c10", new Date(resisted[9].at).getTime());
      if (resisted[49]) set("c50", new Date(resisted[49].at).getTime());
      if (goals[0] && goals[0].reachedAt) set("g1", new Date(goals[0].reachedAt).getTime());
      // 7-day journal streak: last 11 check-ins are consecutive ending today (skipped only day -11)
      set("j7", now - 4 * 864e5);
    })();
    state.theme = opts.theme || "system";
    state.toolHelp = {
      wave: { yes: 6, mid: 1, no: 0 },
      ground: { yes: 3, mid: 1, no: 1 },
      delay: { yes: 2, mid: 1, no: 0 },
      cold: { yes: 1, mid: 2, no: 0 },
      move: { yes: 2, mid: 0, no: 1 }
    };
    if (dayCount >= 8) {
      const slipAt = function (day, hour) {
        return new Date(quitAt.getTime() + day * 86400000 + hour * 3600000).toISOString();
      };
      state.slips = [
        { id: "s1", at: slipAt(8, 22), pouches: 2, alcohol: "yes", note: "En fest. Jeg tog to poser.", place: "Fest", feeling: "", reset: false, previousQuitAt: quitAt.toISOString() },
        { id: "s2", at: slipAt(18, 21), pouches: 1, alcohol: "yes", note: "", place: "Bar", feeling: "", reset: false, previousQuitAt: quitAt.toISOString() },
        { id: "s3", at: slipAt(25, 16), pouches: 2, alcohol: "no", note: "En stresset eftermiddag.", place: "Arbejde", feeling: "", reset: false, previousQuitAt: quitAt.toISOString() }
      ].filter(function (x) { return new Date(x.at).getTime() <= now; });
    }
    if (opts.withLetter || dayCount >= 14) {
      state.letter = {
        text: "Hej. Hvis du læser det her, er der gået en måned. Husk hvorfor du startede: du ville være til stede, og du var træt af at tage en pose bare for at føle dig normal. Det er svært, og det er det værd. Du behøver ikke være færdig — bare fortsætte.",
        writtenAt: quitAt.toISOString(),
        openedAt: opts.letterOpened ? new Date(now).toISOString() : null
      };
    }
    /* Avoid a celebration sheet on ordinary demos. Leave a milestone un-marked only when asked. */
    state.celebrated = state.celebrated || {};
    CELEBRATIONS().forEach(function (c) {
      if (opts.celebrate && Math.abs(dayCount - c.days) < 1.6) return;
      if (dayCount >= c.days) state.celebrated[c.id] = new Date(quitAt.getTime() + c.days * 86400000).toISOString();
    });
    if (opts.theme) applyTheme();
    save();
    view = "home";
    morePage = null;
    return state;
  }

  /* ---------------- top-level render ---------------- */
  function render() {
    if (!state.onboarded) {
      renderOnboarding();
      $("#fab-sos").classList.add("hidden");
      return;
    }
    $("#onboarding").classList.add("hidden");
    $("#main").classList.remove("hidden");
    $("#tabbar").classList.remove("hidden");
    const fab = $("#fab-sos");
    if (view === "craving" || view === "more") fab.classList.add("hidden");
    else fab.classList.remove("hidden");

    $$(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === view));
    $$(".view").forEach((v) => {
      const on = v.id === "view-" + view;
      if (on && !v.classList.contains("active")) v.scrollTop = 0;
      v.classList.toggle("active", on);
    });

    if (view === "home") renderHome();
    else if (view === "health") renderHealth();
    else if (view === "craving") renderCraving();
    else if (view === "goals") renderGoals();
    else if (view === "more") renderMore();
    updateLive();
  }

  /* ---------------- init ---------------- */
  function init() {
    load();
    const params = new URLSearchParams(location.search);
    if (params.get("fast") === "1") {
      WAVE_MS = 4000;
      DELAY_MS = 5000;
    }
    const demo = params.get("demo");
    if (demo === "1") {
      seedDemo({ hideInstall: params.get("install") !== "1" });
    } else if (demo === "peak") {
      seedDemo({ hideInstall: params.get("install") !== "1", days: 2.4 });
    } else if (demo === "fresh") {
      seedDemo({ hideInstall: params.get("install") !== "1", days: 0.3 });
    } else if (demo === "letter") {
      seedDemo({ hideInstall: params.get("install") !== "1", days: 31, withLetter: true });
    } else if (demo === "light") {
      seedDemo({ hideInstall: params.get("install") !== "1", days: 16, theme: "light" });
    }
    document.addEventListener("click", onTap);
    // Prevent accidental double-tap zoom delay already handled by viewport
    applyTheme();
    try {
      if (window.matchMedia) {
        matchMedia("(prefers-color-scheme: light)").addEventListener("change", function () {
          if ((state.theme || "system") === "system") { applyTheme(); }
        });
      }
    } catch (e) {}
    render();
    hideBoot();
    setTimeout(hideBoot, 1800);
    startTick();
    afterPaint(function () {
      if (!state.onboarded) return;
      const before = (state.inbox || []).length;
      ensureInbox();
      checkAchievements(true);
      if ((state.inbox || []).length !== before && view === "home") renderHome();
      const cel = pendingCelebration();
      if (cel) showCelebration(cel);
    });
    if (state.onboarded && state.activeParty && !state.activeParty.endedAt) {
      const plan = (state.partyPlans || []).find(function (p) { return p.id === state.activeParty.planId; });
      if (plan) showPartyScreen(plan);
    }
    if ("serviceWorker" in navigator) {
      const hadController = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.register("./sw.js").then((reg) => {
        const wake = (worker) => { try { worker.postMessage({ type: "SKIP_WAITING" }); } catch (e) {} };
        if (reg.waiting) wake(reg.waiting);
        reg.addEventListener("updatefound", () => {
          const nw = reg.installing;
          if (!nw) return;
          nw.addEventListener("statechange", () => {
            if (nw.state === "installed" && navigator.serviceWorker.controller) wake(nw);
          });
        });
        try { reg.update(); } catch (e) {}
      }).catch(() => {});
      /* Reload once a new worker claims, so the installed PWA picks up v9+.
         Only when we already had a controller — skip the first-install flash. */
      if (hadController) {
        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (refreshing) return;
          refreshing = true;
          location.reload();
        });
      }
    }
  }

  window.Snusfri = {
    seedDemo: seedDemo,
    getState: () => state,
    save: save,
    load: load,
    stats: stats,
    render: render,
    compassPhase: compassPhase,
    startWave: startWave,
    openBareEn: openBareEn,
    openSOS: openSOS,
    openSlip: openSlip,
    openPartyForm: openPartyForm,
    startPartyMode: startPartyMode,
    showPartyScreen: showPartyScreen,
    adoptData: adoptData,
    calendarDaysBetween: calendarDaysBetween,
    finiteNum: finiteNum,
    timeIsNear: timeIsNear,
    shareStatus: shareStatus,
    haptic: haptic,
    openWeekendReview: openWeekendReview,
    personalInsights: personalInsights,
    moneyConcrete: moneyConcrete,
    applyTheme: applyTheme,
    letterState: letterState,
    startDelay: startDelay,
    startGround: startGround,
    recapData: recapData,
    rankedTools: rankedTools,
    showCelebration: showCelebration,
    DELAY_MS: function (ms) { if (ms != null) DELAY_MS = ms; return DELAY_MS; },
    WAVE_MS: function (ms) { if (ms) WAVE_MS = ms; return WAVE_MS; },
    reset: () => {
      state = defaultState();
      save();
      render();
    },
    goto: (v, page) => {
      view = v;
      morePage = page || null;
      closePartyScreen();
      closeWave();
      render();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
