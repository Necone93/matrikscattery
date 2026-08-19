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

const seedCats = [
  {
    type: "cat",
    name: "CH BriZodiac Floki",
    label: "Mužjak",
    status: "Best of the Year 2026",
    image: "img/774196134_1794505428234882_8749782560177005708_n.jpg",
    gallery: [
      "img/774196134_1794505428234882_8749782560177005708_n.jpg",
      "img/775416552_1857525661892065_8602051735133753210_n.jpg",
      "img/739040313_2035024693816032_1814703656727180949_n.jpg",
      "img/774087664_1379770473558784_3096747192544971024_n.jpg",
    ],
    text: "Floki je reprezentativan primer blue golden shaded point britanske kratkodlake mačke: stabilan, smiren i upečatljivog izraza. Njegov tip, kvalitet dlake i temperament čine ga važnim delom našeg uzgojnog programa.",
    facts: {
      Boja: "Blue golden shaded point",
      Titula: "Champion",
      Karakter: "Mirna i nežna narav",
    },
  },
  {
    type: "cat",
    name: "Matriks Luna",
    label: "Ženka",
    status: "U odgajivačnici",
    image: "img/712338814_953255551048652_8266642486634720366_n.jpg",
    gallery: [
      "img/712338814_953255551048652_8266642486634720366_n.jpg",
      "img/717005919_1008238481591700_406617061756352692_n.jpg",
      "img/756523962_1055086823949840_7801777179541880694_n.jpg",
    ],
    text: "Luna je nežna, uravnotežena i izuzetno privržena. U tipu nosi ono što volimo kod britanske kratkodlake mačke: zaobljenu liniju, plišanu dlaku i siguran, spokojan karakter.",
    facts: {
      Boja: "Golden shaded point",
      Uloga: "Majka budućih legala",
      Karakter: "Privržena i stabilna",
    },
  },
  {
    type: "cat",
    name: "Matriks Aurora",
    label: "Ženka",
    status: "Planirana parenja",
    image: "img/774334633_1373186098294978_6326225201167133145_n.jpg",
    gallery: [
      "img/774334633_1373186098294978_6326225201167133145_n.jpg",
      "img/775995434_2085933572016337_7493598912630596714_n.jpg",
      "img/774087664_1379770473558784_3096747192544971024_n.jpg",
    ],
    text: "Aurora je mačka mekog izraza, kompaktne građe i izrazito društvene naravi. Posebno cenimo njen odnos prema ljudima i mirnoću u svakodnevnom životu.",
    facts: {
      Boja: "Shaded point",
      Tip: "Kompaktna građa",
      Karakter: "Društvena i radoznala",
    },
  },
  {
    type: "kitten",
    name: "Leglo A",
    label: "Mačići",
    status: "Uskoro dostupno",
    image: "img/717005919_1008238481591700_406617061756352692_n.jpg",
    gallery: [
      "img/717005919_1008238481591700_406617061756352692_n.jpg",
      "img/756523962_1055086823949840_7801777179541880694_n.jpg",
      "img/775995434_2085933572016337_7493598912630596714_n.jpg",
    ],
    text: "Prvo aktuelno leglo biće predstavljeno sa datumom rođenja, roditeljima, statusom rezervacija, karakterom svakog mačeta i novim fotografijama kako mačići rastu.",
    facts: {
      Rođenje: "Biće objavljeno",
      Status: "Praćenje razvoja",
      Rezervacije: "Na upit",
    },
  },
  {
    type: "kitten",
    name: "Planirano leglo",
    label: "Najava",
    status: "Planirano",
    image: "img/775995434_2085933572016337_7493598912630596714_n.jpg",
    gallery: [
      "img/775995434_2085933572016337_7493598912630596714_n.jpg",
      "img/739040313_2035024693816032_1814703656727180949_n.jpg",
    ],
    text: "Planirana legla objavljujemo nakon potvrde parenja. Zainteresovani budući vlasnici mogu se javiti ranije kako bi dobili informacije o roditeljima i očekivanom terminu.",
    facts: {
      Roditelji: "Biće potvrđeni",
      Status: "Lista interesovanja",
      Kontakt: "Poruka odgajivaču",
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

function animalInsertSql(item) {
  return `INSERT INTO animals (type, name, label, status, image, gallery, text, facts, sort_order)
    VALUES (${q(item.type)}, ${q(item.name)}, ${q(item.label)}, ${q(item.status)}, ${q(item.image)}, ${q(JSON.stringify(item.gallery || []))}, ${q(item.text)}, ${q(JSON.stringify(item.facts || {}))}, 0);`;
}

function postInsertSql(item) {
  return `INSERT INTO posts (title, category, image, media, text, published_at)
    VALUES (${q(item.title)}, ${q(item.category)}, ${q(item.image)}, ${q(JSON.stringify(item.media || []))}, ${q(item.text)}, datetime('now'));`;
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
      published_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

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
  }));

  return {
    cats: normalizedAnimals.filter((item) => item.type === "cat"),
    kittens: normalizedAnimals.filter((item) => item.type === "kitten"),
    posts: posts.map((post) => ({
      ...post,
      date: post.category,
      media: jsonColumn(post.media, []),
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
      subject: `Upit za mače: ${inquiry.kitten || "Matriks Cattery"}`,
      text: [
        `Upit za: ${inquiry.kitten || "mače"}`,
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
    await runSql(animalInsertSql({
      ...item,
      type: item.type === "kitten" ? "kitten" : "cat",
      gallery: safeJsonArray(item.gallery),
      facts: safeJsonObject(item.facts),
    }));
    send(res, 201, await getContent());
    return;
  }

  const animalMatch = url.pathname.match(/^\/api\/animals\/(\d+)$/);
  if (animalMatch && req.method === "PUT") {
    const item = await parseJson(req);
    await runSql(`UPDATE animals SET
      type = ${q(item.type === "kitten" ? "kitten" : "cat")},
      name = ${q(item.name)},
      label = ${q(item.label)},
      status = ${q(item.status)},
      image = ${q(item.image)},
      gallery = ${q(JSON.stringify(safeJsonArray(item.gallery)))},
      text = ${q(item.text)},
      facts = ${q(JSON.stringify(safeJsonObject(item.facts)))},
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
    await runSql(postInsertSql({
      ...item,
      media: safeJsonArray(item.media),
    }));
    send(res, 201, await getContent());
    return;
  }

  const postMatch = url.pathname.match(/^\/api\/posts\/(\d+)$/);
  if (postMatch && req.method === "PUT") {
    const item = await parseJson(req);
    await runSql(`UPDATE posts SET
      title = ${q(item.title)},
      category = ${q(item.category)},
      image = ${q(item.image)},
      media = ${q(JSON.stringify(safeJsonArray(item.media)))},
      text = ${q(item.text)},
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
