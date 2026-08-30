const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = __dirname;
const dataDir = path.join(root, "data");
const uploadDir = path.join(root, "uploads");
const dbPath = path.join(dataDir, "matriks.sqlite");
const inquiriesPath = path.join(dataDir, "inquiries.json");
const port = Number(process.env.PORT || 3000);
const adminPassword = process.env.ADMIN_PASSWORD || "matriks2026";
const contactEmail = process.env.CONTACT_EMAIL || "info@matrikscattery.com";
const openAiApiKey = process.env.OPENAI_API_KEY || "";
const openAiTranslationModel = process.env.OPENAI_TRANSLATION_MODEL || "gpt-4o-mini";
const deepLApiKey = process.env.DEEPL_API_KEY || "";
const deepLApiUrl = process.env.DEEPL_API_URL || "https://api-free.deepl.com/v2/translate";
const translationProvider = process.env.TRANSLATION_PROVIDER || (openAiApiKey ? "openai" : deepLApiKey ? "deepl" : "");
const translationLanguages = {
  en: "English",
  ru: "Russian",
  de: "German",
  it: "Italian",
};

const seedCats = [
  {
    type: "cat",
    name: "BRIZOODIACC FLOKI",
    label: "Mužjak",
    status: "Blue Golden Shaded Point",
    sort_order: 1,
    image: "img/BRIZOODIACC FLOKI/Screenshot_20250410_090411_Instagram.jpg",
    gallery: [
      "img/BRIZOODIACC FLOKI/Screenshot_20250410_090411_Instagram.jpg",
      "img/BRIZOODIACC FLOKI/20250704_174839.jpg",
      "img/BRIZOODIACC FLOKI/20260516_114449.jpg",
      "img/BRIZOODIACC FLOKI/Screenshot_20260702_094235_Gallery.jpg",
      "img/BRIZOODIACC FLOKI/Screenshot_20260710_101035_Instagram.jpg",
    ],
    text: "BRIZOODIACC FLOKI je naš izuzetni mužjak šampionskog porekla, posebne i retke boje koja ga čini zaista jedinstvenim. Njegova lepota, skladna građa i elegantan izgled privlače pažnju gde god se pojavi. U boji je Blue Golden Shaded Point (AY 1233). Pored impresivnog izgleda i brojnih uspeha na izložbama, Floki nas svakodnevno osvaja svojim divnim karakterom. Neizmerno je mazan, umiljat i nežan, uvek željan društva, maženja i pažnje. Njegova mirna narav, privrženost i dobroćudnost čine ga posebnim članom naše porodice. Ponosni smo na njegove šampionske uspehe i kvalitet koji prenosi na svoje potomstvo, ali ono što nas najviše oduševljava jeste njegova nežna duša. Floki je pre svega jedno predivno biće koje svakog dana ispunjava naš dom ljubavlju i toplinom.",
    facts: {
      Boja: "Blue Golden Shaded Point (AY 1233)",
      Pol: "Mužjak",
      Poreklo: "Šampionsko poreklo",
    },
  },
  {
    type: "cat",
    name: "AMAZONITE BARBIE",
    label: "Ženka",
    status: "Silver Shaded",
    sort_order: 2,
    image: "img/AMAZONITE BARBIE/donja_slika_macke.png",
    gallery: [
      "img/AMAZONITE BARBIE/donja_slika_macke.png",
      "img/AMAZONITE BARBIE/20260412_195647_resized.jpg",
      "img/AMAZONITE BARBIE/20260414_185905_resized.jpg",
      "img/AMAZONITE BARBIE/20260516_092443_resized.jpg",
      "img/AMAZONITE BARBIE/20260516_092649_resized.jpg",
      "img/AMAZONITE BARBIE/lv_0_20260730101816.jpg",
    ],
    text: "Amazonite Barbie zauzima posebno mesto u našim srcima. Ona nije samo naša prva ženka, već i početak priče koja je danas postala Matriks Cattery. Barbie je predivna britanska kratkodlaka mačka u elegantnoj i nežnoj boji Silver Shaded (NS 11). Njen prefinjeni izgled, kvalitetan tip i nežna srebrna dlaka daju joj posebnu eleganciju, ali ono što je čini zaista posebnom nije samo njena lepota - već njen jedinstveni karakter. Nežna, umiljata, mazna i puna ljubavi, Barbie je svojim prisustvom zauzela posebno mesto u našoj porodici. Njena blaga narav, toplina i nežnost svakodnevno nas podsećaju koliko su mačke posebna bića. Neizmerno smo ponosni na nju i na sve što ona predstavlja za naš uzgoj. Ona je bila prva - mačka koja je u nama probudila želju da sanjamo veće, da učimo, napredujemo i još snažnije se posvetimo svetu britanskih kratkodlakih mačaka. Za nas, Amazonite Barbie će zauvek biti mnogo više od prelepe ženke. Ona je srce početka naše priče - predivno biće od kojeg je započeo put Matriks Cattery.",
    facts: {
      Boja: "Silver Shaded (NS 11)",
      Pol: "Ženka",
      Uloga: "Prva ženka u našoj priči",
    },
  },
  {
    type: "cat",
    name: "BELVITA VEGA MATIS",
    label: "Ženka",
    status: "Seal Goldenpoint Shaded",
    sort_order: 3,
    image: "img/BELVITA VEGA MATIS/Screenshot_20260702_151105_Gallery.jpg",
    gallery: [
      "img/BELVITA VEGA MATIS/Screenshot_20260702_151105_Gallery.jpg",
      "img/BELVITA VEGA MATIS/20260604_215612.jpg",
      "img/BELVITA VEGA MATIS/20260604_215616.jpg",
      "img/BELVITA VEGA MATIS/20260612_164949.jpg",
      "img/BELVITA VEGA MATIS/20260705_234839.jpg",
      "img/BELVITA VEGA MATIS/IMG-4000c5f21ff3f48f022a917a913b26ef-V.jpg",
      "img/BELVITA VEGA MATIS/Screenshot_20260423_084400_Facebook.jpg",
    ],
    text: "Belvita Vega Matis zauzima posebno mesto u priči Matriks Cattery. Ona je naša druga ženka i predivna predstavnica britanske kratkodlake rase u izuzetno atraktivnoj i nežnoj boji Seal Goldenpoint Shaded (NY 11 33). Potiče od vrhunskih šampiona, što se jasno ogleda u njenoj izuzetnoj lepoti, kvalitetu i elegantnom izgledu. Njeno poreklo nosi pažljivo birane krvne linije, ali ono što nas kod nje posebno očarava jeste savršen spoj prefinjene lepote i izuzetnog karaktera. Belvita je nežna, umiljata, privržena i neverovatno prijatne naravi. Njena lepota privlači pažnju na prvi pogled, ali je njen divan karakter ono zbog čega je svakoga dana volimo još više. Svojom nežnošću, toplinom i posebnom energijom unosi radost u naš dom i postala je voljeni član naše porodice. Neizmerno smo ponosni što je deo naše uzgojne priče i što svojim kvalitetom, vrhunskim poreklom i divnim temperamentom predstavlja sve ono čemu težimo u Matriks Cattery. Za nas Belvita Vega Matis nije samo još jedna prelepa ženka. Ona je spoj vrhunskog šampionskog porekla, izuzetne lepote i nežne duše - upravo onoga što sa mnogo ljubavi želimo da negujemo i prenesemo na buduće generacije u našem uzgoju.",
    facts: {
      Boja: "Seal Goldenpoint Shaded (NY 11 33)",
      Pol: "Ženka",
      Poreklo: "Vrhunski šampioni",
    },
  },
  {
    type: "kitten",
    name: "Leglo A",
    label: "Jul 2025",
    status: "Naše prvo leglo",
    sort_order: 1,
    image: "img/Macici/Leglo A/20250721_144223_resized.jpg",
    gallery: [
      "img/Macici/Leglo A/20250721_144223_resized.jpg",
      "img/Macici/Leglo A/20250803_203946_resized.jpg",
      "img/Macici/Leglo A/20250806_185608_resized.jpg",
      "img/Macici/Leglo A/20250806_190318_resized.jpg",
      "img/Macici/Leglo A/20250810_233843_resized.jpg",
      "img/Macici/Leglo A/20250827_233544_resized.jpg",
      "img/Macici/Leglo A/20250831_093024_resized_1.jpg",
      "img/Macici/Leglo A/20250901_104322_resized_1.jpg",
      "img/Macici/Leglo A/20250902_223759_resized.jpg",
      "img/Macici/Leglo A/20250902_223822_resized_1.jpg",
      "img/Macici/Leglo A/IMG-005fb9ed39fc5f2e70bb961f850fcdfb-V.jpg",
      "img/Macici/Leglo A/IMG-20260501-WA0008.jpg",
      "img/Macici/Leglo A/IMG-20260501-WA0009.jpg",
      "img/Macici/Leglo A/IMG-20260725-WA0000.jpg",
      "img/Macici/Leglo A/IMG-22ca16d66664e9033f9d2080f9aff9db-V.jpg",
      "img/Macici/Leglo A/IMG-57a4e5286055b2a184df4571923231ad-V.jpg",
    ],
    text: "Alkaraz i Atos jul 2025 🐾\n\nNaše prvo leglo 💛\n\nOd naše voljene Barby i prelepog Flokija nastala je posebna priča - naše prvo leglo. Mališani Alkaraz i Atos zauvek će imati posebno mesto u srcu Matriks Cattery, jer su upravo oni bili početak našeg uzgajivačkog puta. Od Barby je sve počelo... a sa njima je san postao stvarnost. ✨",
    facts: {
      Mačići: "Alkaraz i Atos",
      Godina: "2025",
      Roditelji: "Barby i Floki",
    },
    translations: {
      en: {
        label: "July 2025",
        status: "Our first litter",
        text: "Alcatraz and Atos, July 2025 🐾\n\nOur first litter 💛\n\nFrom our beloved Barby and beautiful Floki came a special story - our first litter. Little Alcatraz and Atos will always have a special place in the heart of Matriks Cattery, because they marked the beginning of our breeding journey. Everything began with Barby... and with them, the dream became reality. ✨",
        facts: { Kittens: "Alcatraz and Atos", Year: "2025", Parents: "Barby and Floki" },
      },
      ru: {
        label: "Июль 2025",
        status: "Наш первый помет",
        text: "Alcatraz и Atos, июль 2025 🐾\n\nНаш первый помет 💛\n\nОт нашей любимой Barby и прекрасного Floki началась особенная история - наш первый помет. Малыши Alcatraz и Atos навсегда займут особое место в сердце Matriks Cattery, потому что именно они стали началом нашего пути в разведении. Все началось с Barby... а с ними мечта стала реальностью. ✨",
        facts: { Котята: "Alcatraz и Atos", Год: "2025", Родители: "Barby и Floki" },
      },
      de: {
        label: "Juli 2025",
        status: "Unser erster Wurf",
        text: "Alcatraz und Atos, Juli 2025 🐾\n\nUnser erster Wurf 💛\n\nAus unserer geliebten Barby und dem wunderschönen Floki entstand eine besondere Geschichte - unser erster Wurf. Die Kleinen Alcatraz und Atos werden für immer einen besonderen Platz im Herzen von Matriks Cattery haben, denn sie waren der Anfang unseres Zuchtweges. Mit Barby begann alles... und mit ihnen wurde der Traum Wirklichkeit. ✨",
        facts: { Kitten: "Alcatraz und Atos", Jahr: "2025", Eltern: "Barby und Floki" },
      },
      it: {
        label: "Luglio 2025",
        status: "La nostra prima cucciolata",
        text: "Alcatraz e Atos, luglio 2025 🐾\n\nLa nostra prima cucciolata 💛\n\nDalla nostra amata Barby e dal bellissimo Floki è nata una storia speciale - la nostra prima cucciolata. I piccoli Alcatraz e Atos avranno per sempre un posto speciale nel cuore di Matriks Cattery, perché sono stati l'inizio del nostro percorso di allevamento. Tutto è iniziato da Barby... e con loro il sogno è diventato realtà. ✨",
        facts: { Gattini: "Alcatraz e Atos", Anno: "2025", Genitori: "Barby e Floki" },
      },
    },
  },
  {
    type: "kitten",
    name: "Leglo B",
    label: "Björn i Boo",
    status: "Naše drugo leglo",
    sort_order: 2,
    image: "img/Macici/Leglo B/mace_oglas_resize.jpg",
    gallery: [
      "img/Macici/Leglo B/mace_oglas_resize.jpg",
      "img/Macici/Leglo B/20260507_224203_resized.jpg",
      "img/Macici/Leglo B/20260507_224216_resized.jpg",
      "img/Macici/Leglo B/20260509_232516_resized.jpg",
      "img/Macici/Leglo B/20260512_190309_resized.jpg",
      "img/Macici/Leglo B/20260512_190747_resized.jpg",
      "img/Macici/Leglo B/20260512_190828_resized.jpg",
      "img/Macici/Leglo B/20260512_190938_resized.jpg",
      "img/Macici/Leglo B/20260513_213902_resized.jpg",
      "img/Macici/Leglo B/20260516_091509_resized.jpg",
      "img/Macici/Leglo B/20260522_225426_resized.jpg",
      "img/Macici/Leglo B/20260522_225650_resized.jpg",
      "img/Macici/Leglo B/20260524_200629_resized.jpg",
      "img/Macici/Leglo B/20260529_175041_resized.jpg",
      "img/Macici/Leglo B/20260529_175218_resized.jpg",
      "img/Macici/Leglo B/20260605_182011_resized.jpg",
      "img/Macici/Leglo B/20260606_123139_resized.jpg",
    ],
    text: "Naše drugo leglo 🐾\n\nDrugo leglo Matriks Cattery donelo nam je još jednu malu, predivnu priču - Björn i Boo. Dva mala dečaka, svaki poseban na svoj način, koji su svojim nežnim karakterom i neodoljivom lepotom zauvek ostavili trag u našem srcu. Još jedno leglo, još dve male duše i još više ljubavi u našoj Matriks priči. 💛✨",
    facts: {
      Mačići: "Björn i Boo",
      Godina: "2026",
      Roditelji: "Biće dopisano",
    },
    translations: {
      en: {
        label: "Björn and Boo",
        status: "Our second litter",
        text: "Our second litter 🐾\n\nThe second litter of Matriks Cattery brought us another small, beautiful story - Björn and Boo. Two little boys, each special in his own way, who with their gentle character and irresistible beauty left a lasting mark in our hearts. Another litter, two more little souls and even more love in our Matriks story. 💛✨",
        facts: { Kittens: "Björn and Boo", Year: "2026", Parents: "To be added" },
      },
      ru: {
        label: "Björn и Boo",
        status: "Наш второй помет",
        text: "Наш второй помет 🐾\n\nВторой помет Matriks Cattery подарил нам еще одну маленькую, прекрасную историю - Björn и Boo. Два маленьких мальчика, каждый особенный по-своему, своим нежным характером и неотразимой красотой навсегда оставили след в наших сердцах. Еще один помет, еще две маленькие души и еще больше любви в нашей истории Matriks. 💛✨",
        facts: { Котята: "Björn и Boo", Год: "2026", Родители: "Будет добавлено" },
      },
      de: {
        label: "Björn und Boo",
        status: "Unser zweiter Wurf",
        text: "Unser zweiter Wurf 🐾\n\nDer zweite Wurf von Matriks Cattery brachte uns eine weitere kleine, wunderschöne Geschichte - Björn und Boo. Zwei kleine Jungen, jeder auf seine eigene Weise besonders, die mit ihrem sanften Wesen und ihrer unwiderstehlichen Schönheit für immer Spuren in unseren Herzen hinterlassen haben. Noch ein Wurf, zwei weitere kleine Seelen und noch mehr Liebe in unserer Matriks Geschichte. 💛✨",
        facts: { Kitten: "Björn und Boo", Jahr: "2026", Eltern: "Wird ergänzt" },
      },
      it: {
        label: "Björn e Boo",
        status: "La nostra seconda cucciolata",
        text: "La nostra seconda cucciolata 🐾\n\nLa seconda cucciolata di Matriks Cattery ci ha portato un'altra piccola, meravigliosa storia - Björn e Boo. Due piccoli maschietti, ognuno speciale a modo suo, che con il loro carattere dolce e la loro bellezza irresistibile hanno lasciato per sempre un segno nel nostro cuore. Un'altra cucciolata, altre due piccole anime e ancora più amore nella nostra storia Matriks. 💛✨",
        facts: { Gattini: "Björn e Boo", Anno: "2026", Genitori: "Da aggiungere" },
      },
    },
  },
];

const seedPosts = [
  {
    title: "Najbolji u 2026. godini",
    category: "Izložbe",
    image: "img/774196134_1794505428234882_8749782560177005708_n.jpg",
    media: [],
    text: "Veliko priznanje za naš uzgoj: CH BriZodiac Floki poneo je titulu Best Blue Golden Shaded Point British Shorthair of the Year.",
  },
  {
    title: "Vikend na izložbi",
    category: "Novosti",
    image: "img/775416552_1857525661892065_8602051735133753210_n.jpg",
    media: [],
    text: "Trenuci iz izložbenog prostora, susreti sa sudijama i atmosfera koju posebno volimo da podelimo sa prijateljima odgajivačnice.",
  },
  {
    title: "Život u odgajivačnici",
    category: "Dnevnik",
    image: "img/774087664_1379770473558784_3096747192544971024_n.jpg",
    media: [],
    text: "Kratke beleške, fotografije i video zapisi iz svakodnevice naših mačaka i mačića.",
  },
];

function runSql(sql, json = false) {
  return new Promise((resolve, reject) => {
    const args = json ? ["-json", dbPath, sql] : [dbPath, sql];
    const child = spawn("sqlite3", args);
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `sqlite3 exited with ${code}`));
        return;
      }
      resolve(json ? JSON.parse(stdout || "[]") : stdout);
    });
  });
}

function q(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function jsonColumn(value, fallback) {
  try {
    return JSON.parse(value || "");
  } catch {
    return fallback;
  }
}

function normalizePostBlocks(blocks, text = "", media = []) {
  const normalized = (Array.isArray(blocks) ? blocks : [])
    .map((block) => {
      if (block?.type === "media") {
        return { type: "media", items: safeJsonArray(block.items).filter(Boolean) };
      }
      return { type: "text", text: cleanText(block?.text || "", 6000) };
    })
    .filter((block) => (block.type === "media" ? block.items.length : block.text.trim()));

  if (normalized.length) return normalized;

  const fallback = [];
  if (String(text || "").trim()) fallback.push({ type: "text", text: cleanText(text, 6000) });
  if (safeJsonArray(media).length) fallback.push({ type: "media", items: safeJsonArray(media) });
  return fallback;
}

function animalInsertSql(item) {
  return `INSERT INTO animals (type, name, label, status, image, gallery, text, facts, translations, sort_order)
    VALUES (${q(item.type)}, ${q(item.name)}, ${q(item.label)}, ${q(item.status)}, ${q(item.image)}, ${q(JSON.stringify(item.gallery || []))}, ${q(item.text)}, ${q(JSON.stringify(item.facts || {}))}, ${q(JSON.stringify(item.translations || {}))}, ${Number(item.sort_order || 0)});`;
}

function postInsertSql(item) {
  return `INSERT INTO posts (title, category, image, media, text, blocks, translations, published_at)
    VALUES (${q(item.title)}, ${q(item.category)}, ${q(item.image)}, ${q(JSON.stringify(item.media || []))}, ${q(item.text)}, ${q(JSON.stringify(item.blocks || []))}, ${q(JSON.stringify(item.translations || {}))}, datetime('now'));`;
}

async function ensureColumn(table, column, definition) {
  const columns = await runSql(`PRAGMA table_info(${table});`, true);
  if (columns.some((item) => item.name === column)) return;
  await runSql(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition};`);
}

async function initDb() {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(uploadDir, { recursive: true });

  await runSql(`
    CREATE TABLE IF NOT EXISTS animals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK(type IN ('cat', 'kitten')),
      name TEXT NOT NULL,
      label TEXT DEFAULT '',
      status TEXT DEFAULT '',
      image TEXT DEFAULT '',
      gallery TEXT DEFAULT '[]',
      text TEXT DEFAULT '',
      facts TEXT DEFAULT '{}',
      translations TEXT DEFAULT '{}',
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT DEFAULT 'Novosti',
      image TEXT DEFAULT '',
      media TEXT DEFAULT '[]',
      text TEXT DEFAULT '',
      blocks TEXT DEFAULT '[]',
      translations TEXT DEFAULT '{}',
      published_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await ensureColumn("animals", "translations", "TEXT DEFAULT '{}'");
  await ensureColumn("posts", "translations", "TEXT DEFAULT '{}'");
  await ensureColumn("posts", "blocks", "TEXT DEFAULT '[]'");

  const counts = await runSql(
    "SELECT (SELECT COUNT(*) FROM animals) AS animals, (SELECT COUNT(*) FROM posts) AS posts;",
    true,
  );

  if (counts[0].animals === 0) {
    await runSql(seedCats.map(animalInsertSql).join("\n"));
  }

  if (counts[0].posts === 0) {
    await runSql(seedPosts.map(postInsertSql).join("\n"));
  }
}

async function getContent() {
  const animals = await runSql("SELECT * FROM animals ORDER BY sort_order, id DESC;", true);
  const posts = await runSql("SELECT * FROM posts ORDER BY datetime(published_at) DESC, id DESC;", true);
  const normalizedAnimals = animals.map((item) => ({
    ...item,
    gallery: jsonColumn(item.gallery, []),
    facts: jsonColumn(item.facts, {}),
    translations: jsonColumn(item.translations, {}),
  }));

  return {
    cats: normalizedAnimals.filter((item) => item.type === "cat"),
    kittens: normalizedAnimals.filter((item) => item.type === "kitten"),
    posts: posts.map((post) => ({
      ...post,
      date: post.category,
      media: jsonColumn(post.media, []),
      blocks: normalizePostBlocks(jsonColumn(post.blocks, []), post.text, jsonColumn(post.media, [])),
      translations: jsonColumn(post.translations, {}),
    })),
  };
}

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type });
  if (Buffer.isBuffer(body)) {
    res.end(body);
    return;
  }
  res.end(typeof body === "string" ? body : JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 8_000_000) {
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function readBuffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      chunks.push(chunk);
      size += chunk.length;
      if (size > 60_000_000) reject(new Error("Upload je prevelik"));
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function isAdmin(req) {
  return req.headers["x-admin-password"] === adminPassword;
}

function safeJsonArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function safeJsonObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeTranslationMap(value) {
  const source = safeJsonObject(value);
  return Object.fromEntries(
    Object.keys(translationLanguages)
      .map((lang) => [lang, safeJsonObject(source[lang])])
      .filter(([, entry]) => Object.keys(entry).length > 0),
  );
}

function stripJsonFence(value) {
  return String(value || "")
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

async function translateWithOpenAi(payload, kind) {
  if (!openAiApiKey) return {};

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openAiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: openAiTranslationModel,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            "You translate Serbian cattery website content.",
            "Return strict JSON only.",
            "Keep cat names, cattery name, color codes, breed codes and file-like tokens unchanged.",
            "Translate labels and prose naturally for a premium editorial pet website.",
          ].join(" "),
        },
        {
          role: "user",
          content: JSON.stringify({
            targetLanguages: translationLanguages,
            contentType: kind,
            sourceLanguage: "Serbian",
            fields: payload,
            expectedShape: Object.fromEntries(Object.keys(translationLanguages).map((lang) => [lang, payload])),
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI translation failed: ${response.status}`);
  }

  const data = await response.json();
  return normalizeTranslationMap(JSON.parse(stripJsonFence(data.choices?.[0]?.message?.content)));
}

async function translateWithDeepL(payload) {
  if (!deepLApiKey) return {};

  const entries = [];
  Object.entries(payload).forEach(([field, value]) => {
    if (typeof value === "string") entries.push({ path: [field], value });
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.entries(value).forEach(([key, fact]) => entries.push({ path: [field, key], value: `${key}: ${fact}` }));
    }
  });

  const result = {};
  for (const [lang, deeplLang] of Object.entries({ en: "EN-US", ru: "RU", de: "DE", it: "IT" })) {
    const params = new URLSearchParams();
    params.set("auth_key", deepLApiKey);
    params.set("target_lang", deeplLang);
    entries.forEach((entry) => params.append("text", entry.value));

    const response = await fetch(deepLApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    if (!response.ok) throw new Error(`DeepL translation failed: ${response.status}`);

    const data = await response.json();
    result[lang] = {};
    entries.forEach((entry, index) => {
      const translated = data.translations?.[index]?.text || entry.value;
      if (entry.path.length === 1) {
        result[lang][entry.path[0]] = translated;
        return;
      }
      const [field, originalKey] = entry.path;
      const separator = translated.indexOf(":");
      const translatedKey = separator > 0 ? translated.slice(0, separator).trim() : originalKey;
      const translatedValue = separator > 0 ? translated.slice(separator + 1).trim() : translated;
      result[lang][field] = { ...(result[lang][field] || {}), [translatedKey]: translatedValue };
    });
  }
  return normalizeTranslationMap(result);
}

async function translatePayload(payload, kind) {
  if (!translationProvider) return {};
  try {
    if (translationProvider === "deepl") return await translateWithDeepL(payload);
    return await translateWithOpenAi(payload, kind);
  } catch (error) {
    console.warn(error.message);
    return {};
  }
}

async function prepareAnimal(item, existingTranslations = {}) {
  const payload = {
    label: cleanText(item.label, 180),
    status: cleanText(item.status, 180),
    text: cleanText(item.text, 6000),
    facts: safeJsonObject(item.facts),
  };
  const translations = await translatePayload(payload, "animal");
  return {
    ...item,
    translations: Object.keys(translations).length ? translations : normalizeTranslationMap(existingTranslations),
  };
}

async function preparePost(item, existingTranslations = {}) {
  const blocks = normalizePostBlocks(item.blocks, item.text, item.media);
  const text = cleanText(item.text || blocks.filter((block) => block.type === "text").map((block) => block.text).join("\n\n"), 6000);
  const payload = {
    title: cleanText(item.title, 220),
    category: cleanText(item.category, 120),
    text,
    blocks,
  };
  const translations = await translatePayload(payload, "blog_post");
  return {
    ...item,
    text,
    blocks,
    translations: Object.keys(translations).length ? translations : normalizeTranslationMap(existingTranslations),
  };
}

function hasTranslation(item, lang) {
  return Object.keys(safeJsonObject(item.translations?.[lang])).length > 0;
}

async function translateMissingContent(lang) {
  if (!translationLanguages[lang]) return { ok: false, error: "Nepodržan jezik." };
  if (!translationProvider) return { ok: false, error: "Translation API nije podešen." };

  const content = await getContent();
  for (const animal of [...content.cats, ...content.kittens]) {
    if (hasTranslation(animal, lang)) continue;
    const prepared = await prepareAnimal(animal, animal.translations);
    await runSql(`UPDATE animals SET translations = ${q(JSON.stringify(prepared.translations))}, updated_at = CURRENT_TIMESTAMP WHERE id = ${Number(animal.id)};`);
  }
  for (const post of content.posts) {
    if (hasTranslation(post, lang)) continue;
    const prepared = await preparePost(post, post.translations);
    await runSql(`UPDATE posts SET translations = ${q(JSON.stringify(prepared.translations))}, updated_at = CURRENT_TIMESTAMP WHERE id = ${Number(post.id)};`);
  }

  return { ok: true, content: await getContent() };
}

async function parseJson(req) {
  const body = await readBody(req);
  return body ? JSON.parse(body) : {};
}

function cleanText(value, maxLength = 2000) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function appendInquiry(inquiry) {
  let existing = [];
  try {
    existing = JSON.parse(fs.readFileSync(inquiriesPath, "utf8"));
  } catch {
    existing = [];
  }
  existing.push(inquiry);
  fs.writeFileSync(inquiriesPath, JSON.stringify(existing, null, 2));
}

function sendWithSendmail({ to, from, subject, text }) {
  return new Promise((resolve) => {
    const child = spawn("sendmail", ["-t"]);
    let failed = false;

    child.on("error", () => {
      failed = true;
      resolve(false);
    });
    child.on("close", (code) => {
      if (!failed) resolve(code === 0);
    });

    child.stdin.end([
      `To: ${to}`,
      `Reply-To: ${from}`,
      "From: Matriks Cattery <no-reply@matrikscattery.local>",
      `Subject: ${subject.replace(/[\r\n]+/g, " ")}`,
      "Content-Type: text/plain; charset=UTF-8",
      "",
      text,
    ].join("\n"));
  });
}

function parseMultipart(buffer, contentType) {
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!boundaryMatch) return null;

  const boundary = Buffer.from(`--${boundaryMatch[1] || boundaryMatch[2]}`);
  const start = buffer.indexOf(boundary);
  if (start < 0) return null;

  const headerStart = buffer.indexOf(Buffer.from("\r\n\r\n"), start);
  if (headerStart < 0) return null;

  const headers = buffer.slice(start, headerStart).toString("utf8");
  const fileNameMatch = headers.match(/filename="([^"]+)"/i);
  if (!fileNameMatch) return null;

  const dataStart = headerStart + 4;
  const nextBoundary = buffer.indexOf(Buffer.from("\r\n--" + (boundaryMatch[1] || boundaryMatch[2])), dataStart);
  const dataEnd = nextBoundary >= 0 ? nextBoundary : buffer.length;
  const originalName = path.basename(fileNameMatch[1]).replace(/[^\w.\-]+/g, "-");
  const ext = path.extname(originalName).toLowerCase();
  const allowed = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".mov", ".webm"]);

  if (!allowed.has(ext)) {
    throw new Error("Dozvoljene su slike i video fajlovi: jpg, png, webp, gif, mp4, mov, webm.");
  }

  return {
    fileName: `${Date.now()}-${originalName}`,
    data: buffer.slice(dataStart, dataEnd),
  };
}

function mimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return (
    {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".mp4": "video/mp4",
      ".mov": "video/quicktime",
      ".webm": "video/webm",
    }[ext] || "application/octet-stream"
  );
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/content") {
    send(res, 200, await getContent());
    return;
  }

  const translateMatch = url.pathname.match(/^\/api\/translations\/([a-z]{2})$/);
  if (req.method === "POST" && translateMatch) {
    const result = await translateMissingContent(translateMatch[1]);
    send(res, result.ok ? 200 : 503, result);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/inquiry") {
    const body = await parseJson(req);
    const inquiry = {
      created_at: new Date().toISOString(),
      kitten: cleanText(body.kitten, 160),
      name: cleanText(body.name, 120),
      email: cleanText(body.email, 180),
      message: cleanText(body.message, 3000),
    };

    if (!inquiry.name || !isValidEmail(inquiry.email) || inquiry.message.length < 8) {
      send(res, 400, { error: "Unesite ime, ispravan email i poruku." });
      return;
    }

    appendInquiry(inquiry);

    const sent = await sendWithSendmail({
      to: contactEmail,
      from: inquiry.email,
      subject: inquiry.kitten === "Kontakt forma"
        ? "Poruka sa kontakt forme"
        : `Upit za mače: ${inquiry.kitten || "Matriks Cattery"}`,
      text: [
        inquiry.kitten === "Kontakt forma" ? "Kontakt forma" : `Upit za: ${inquiry.kitten || "mače"}`,
        `Ime: ${inquiry.name}`,
        `Email: ${inquiry.email}`,
        "",
        "Poruka:",
        inquiry.message,
      ].join("\n"),
    });

    send(res, 200, { ok: true, sent });
    return;
  }

  if (!isAdmin(req)) {
    send(res, 401, { error: "Pogrešna admin lozinka." });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/check") {
    send(res, 200, { ok: true });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/translate-all") {
    const content = await getContent();
    for (const animal of [...content.cats, ...content.kittens]) {
      const prepared = await prepareAnimal(animal, animal.translations);
      await runSql(`UPDATE animals SET translations = ${q(JSON.stringify(prepared.translations))}, updated_at = CURRENT_TIMESTAMP WHERE id = ${Number(animal.id)};`);
    }
    for (const post of content.posts) {
      const prepared = await preparePost(post, post.translations);
      await runSql(`UPDATE posts SET translations = ${q(JSON.stringify(prepared.translations))}, updated_at = CURRENT_TIMESTAMP WHERE id = ${Number(post.id)};`);
    }
    send(res, 200, await getContent());
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/upload") {
    const buffer = await readBuffer(req);
    const file = parseMultipart(buffer, req.headers["content-type"] || "");
    if (!file) {
      send(res, 400, { error: "Fajl nije pronađen." });
      return;
    }
    fs.writeFileSync(path.join(uploadDir, file.fileName), file.data);
    send(res, 200, { path: `uploads/${file.fileName}` });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/animals") {
    const item = await parseJson(req);
    const prepared = await prepareAnimal({
      ...item,
      type: item.type === "kitten" ? "kitten" : "cat",
      gallery: safeJsonArray(item.gallery),
      facts: safeJsonObject(item.facts),
    });
    await runSql(animalInsertSql(prepared));
    send(res, 201, await getContent());
    return;
  }

  const animalMatch = url.pathname.match(/^\/api\/animals\/(\d+)$/);
  if (animalMatch && req.method === "PUT") {
    const item = await parseJson(req);
    const existing = await runSql(`SELECT translations FROM animals WHERE id = ${Number(animalMatch[1])};`, true);
    const prepared = await prepareAnimal({
      ...item,
      type: item.type === "kitten" ? "kitten" : "cat",
      gallery: safeJsonArray(item.gallery),
      facts: safeJsonObject(item.facts),
    }, jsonColumn(existing[0]?.translations, {}));
    await runSql(`UPDATE animals SET
      type = ${q(prepared.type)},
      name = ${q(prepared.name)},
      label = ${q(prepared.label)},
      status = ${q(prepared.status)},
      image = ${q(prepared.image)},
      gallery = ${q(JSON.stringify(prepared.gallery))},
      text = ${q(prepared.text)},
      facts = ${q(JSON.stringify(prepared.facts))},
      translations = ${q(JSON.stringify(prepared.translations))},
      updated_at = CURRENT_TIMESTAMP
      WHERE id = ${Number(animalMatch[1])};`);
    send(res, 200, await getContent());
    return;
  }

  if (animalMatch && req.method === "DELETE") {
    await runSql(`DELETE FROM animals WHERE id = ${Number(animalMatch[1])};`);
    send(res, 200, await getContent());
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/posts") {
    const item = await parseJson(req);
    const prepared = await preparePost({
      ...item,
      media: safeJsonArray(item.media),
      blocks: normalizePostBlocks(item.blocks, item.text, item.media),
    });
    await runSql(postInsertSql(prepared));
    send(res, 201, await getContent());
    return;
  }

  const postMatch = url.pathname.match(/^\/api\/posts\/(\d+)$/);
  if (postMatch && req.method === "PUT") {
    const item = await parseJson(req);
    const existing = await runSql(`SELECT translations FROM posts WHERE id = ${Number(postMatch[1])};`, true);
    const prepared = await preparePost({
      ...item,
      media: safeJsonArray(item.media),
      blocks: normalizePostBlocks(item.blocks, item.text, item.media),
    }, jsonColumn(existing[0]?.translations, {}));
    await runSql(`UPDATE posts SET
      title = ${q(prepared.title)},
      category = ${q(prepared.category)},
      image = ${q(prepared.image)},
      media = ${q(JSON.stringify(prepared.media))},
      text = ${q(prepared.text)},
      blocks = ${q(JSON.stringify(prepared.blocks))},
      translations = ${q(JSON.stringify(prepared.translations))},
      updated_at = CURRENT_TIMESTAMP
      WHERE id = ${Number(postMatch[1])};`);
    send(res, 200, await getContent());
    return;
  }

  if (postMatch && req.method === "DELETE") {
    await runSql(`DELETE FROM posts WHERE id = ${Number(postMatch[1])};`);
    send(res, 200, await getContent());
    return;
  }

  send(res, 404, { error: "API ruta nije pronađena." });
}

function serveStatic(req, res, url) {
  const requested = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = path.normalize(path.join(root, requested));

  if (!filePath.startsWith(root)) {
    send(res, 403, "Forbidden", "text/plain; charset=utf-8");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 404, "Not found", "text/plain; charset=utf-8");
      return;
    }
    send(res, 200, data, mimeType(filePath));
  });
}

async function start() {
  await initDb();

  http
    .createServer(async (req, res) => {
      try {
        const url = new URL(req.url, `http://${req.headers.host}`);

        if (url.pathname.startsWith("/api/")) {
          await handleApi(req, res, url);
          return;
        }

        serveStatic(req, res, url);
      } catch (error) {
        send(res, 500, { error: error.message });
      }
    })
    .listen(port, "127.0.0.1", () => {
      console.log(`Matriks Cattery server: http://localhost:${port}`);
      console.log(`Admin: http://localhost:${port}/admin.html`);
    });
}

start();
