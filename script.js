let cats = [
  {
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
];

let kittens = [
  {
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

let posts = [
  {
    title: "Najbolji u 2026. godini",
    date: "Izložbe",
    image: "img/774196134_1794505428234882_8749782560177005708_n.jpg",
    text: "Veliko priznanje za naš uzgoj: CH BriZodiac Floki poneo je titulu Best Blue Golden Shaded Point British Shorthair of the Year.",
  },
  {
    title: "Vikend na izložbi",
    date: "Novosti",
    image: "img/775416552_1857525661892065_8602051735133753210_n.jpg",
    text: "Trenuci iz izložbenog prostora, susreti sa sudijama i atmosfera koju posebno volimo da podelimo sa prijateljima odgajivačnice.",
  },
  {
    title: "Život u odgajivačnici",
    date: "Dnevnik",
    image: "img/774087664_1379770473558784_3096747192544971024_n.jpg",
    text: "Kratke beleške, fotografije i video zapisi iz svakodnevice naših mačaka i mačića.",
  },
];

const modal = document.querySelector("#detailModal");
const modalContent = document.querySelector("#modalContent");
const closeModal = document.querySelector(".modal-close");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const heroImage = document.querySelector("#heroImage");
const heroTitle = document.querySelector("#heroTitle");
const heroText = document.querySelector("#heroText");
const heroActions = document.querySelector("#heroActions");
let heroIndex = 0;
let heroTimer = null;
let currentLang = localStorage.getItem("matriksLang") || "sr";

const translations = {
  sr: {
    nav: { cats: "Mačke", kittens: "Mačići", blog: "Blog", breed: "O rasi", contact: "Kontakt", homeBack: "Nazad na početnu" },
    common: { readMore: "Pročitaj više", backList: "Nazad na listu", backBlog: "Nazad na blog", blogFallback: "Blog" },
    hero: [
      {
        title: "Dobrodošli u<br />Matriks Cattery",
        text: "Odgajivačnica britanskih kratkodlakih mačaka posvećena zdravlju, stabilnom temperamentu i izložbenom tipu. Više o nama i našem pristupu dodaćemo u narednoj fazi.",
      },
      {
        title: "O rasi<br />British Shorthair",
        text: "Britanska kratkodlaka mačka je mirna, snažna i prepoznatljiva po plišanoj dlaci, okrugloj glavi i stabilnom porodičnom karakteru.",
        action: "Pročitaj više",
      },
      {
        title: "Upoznajte<br />naše mačke",
        text: "Brzi ulaz u profile roditelja, izložbene rezultate i aktuelna ili planirana legla u Matriks Cattery odgajivačnici.",
        action: "Pogledajte naše mačke",
      },
    ],
    inquiry: {
      open: "Pošalji upit",
      name: "Ime",
      email: "Email",
      message: "Poruka",
      submit: "Pošalji",
      defaultMessage: (name) => `Poštovani, zainteresovan/a sam za ${name}. Molim vas za više informacija.`,
      sending: "Slanje...",
      sent: "Upit je poslat. Hvala.",
      saved: "Upit je sačuvan. Slanje emaila zahteva podešen CONTACT_EMAIL/sendmail na serveru.",
      error: "Upit nije poslat.",
    },
    pages: {
      breedKicker: "Karakter i standard",
      breedTitle: "Britanska kratkodlaka je staložena, snažna i vrlo privržena mačka.",
      breedText: "Rasa je poznata po zaobljenim linijama, gustoj kratkoj dlaci i mirnom, uravnoteženom temperamentu. Britanke su društvene, ali nisu nametljive; vole rutinu, sigurnost i kvalitetan odnos sa ljudima.",
      breedItems: ["Kompaktno, mišićavo telo i široka glava.", "Gusta, plišana dlaka koja traži redovno četkanje.", "Stabilan temperament pogodan za miran porodični dom.", "Odgovoran uzgoj podrazumeva praćenje zdravlja i porekla."],
      contactKicker: "Kontakt",
      contactTitle: "Razgovarajmo o mačkama, mačićima i budućim leglima.",
      contactText: "Za informacije o dostupnosti mačića, planiranim leglima i saradnji javite nam se putem emaila ili društvenih mreža.",
    },
  },
  en: {
    nav: { cats: "Cats", kittens: "Kittens", blog: "Blog", breed: "Breed", contact: "Contact", homeBack: "Back home" },
    common: { readMore: "Read more", backList: "Back to list", backBlog: "Back to blog", blogFallback: "Blog" },
    hero: [
      { title: "Welcome to<br />Matriks Cattery", text: "A British Shorthair cattery focused on health, stable temperament and show type. More about us and our approach will be added in the next phase." },
      { title: "About the<br />British Shorthair", text: "The British Shorthair is calm, strong and known for its plush coat, round head and steady family temperament.", action: "Read more" },
      { title: "Meet<br />our cats", text: "Quick access to parent profiles, show results and current or planned litters at Matriks Cattery.", action: "View our cats" },
    ],
    inquiry: {
      open: "Send inquiry", name: "Name", email: "Email", message: "Message", submit: "Send",
      defaultMessage: (name) => `Hello, I am interested in ${name}. Please send me more information.`,
      sending: "Sending...", sent: "Your inquiry has been sent. Thank you.", saved: "Your inquiry has been saved. Email sending requires CONTACT_EMAIL/sendmail on the server.", error: "The inquiry was not sent.",
    },
    pages: {
      breedKicker: "Character and standard",
      breedTitle: "The British Shorthair is composed, strong and deeply affectionate.",
      breedText: "The breed is known for rounded lines, a dense short coat and a calm, balanced temperament. British Shorthairs are social but not demanding; they enjoy routine, safety and a good bond with people.",
      breedItems: ["Compact, muscular body and broad head.", "Dense plush coat that benefits from regular brushing.", "Stable temperament suitable for a calm family home.", "Responsible breeding includes health and pedigree monitoring."],
      contactKicker: "Contact",
      contactTitle: "Let’s talk about cats, kittens and future litters.",
      contactText: "For kitten availability, planned litters and cooperation, contact us by email or social media.",
    },
  },
  ru: {
    nav: { cats: "Кошки", kittens: "Котята", blog: "Блог", breed: "О породе", contact: "Контакт", homeBack: "На главную" },
    common: { readMore: "Подробнее", backList: "Назад к списку", backBlog: "Назад в блог", blogFallback: "Блог" },
    hero: [
      { title: "Добро пожаловать<br />в Matriks Cattery", text: "Питомник британских короткошёрстных кошек, ориентированный на здоровье, стабильный темперамент и выставочный тип." },
      { title: "О породе<br />British Shorthair", text: "Британская короткошёрстная кошка спокойная, крепкая и узнаваемая по плюшевой шерсти, круглой голове и устойчивому семейному характеру.", action: "Подробнее" },
      { title: "Познакомьтесь<br />с нашими кошками", text: "Быстрый переход к профилям родителей, выставочным результатам и актуальным или планируемым помётам.", action: "Смотреть кошек" },
    ],
    inquiry: {
      open: "Отправить запрос", name: "Имя", email: "Email", message: "Сообщение", submit: "Отправить",
      defaultMessage: (name) => `Здравствуйте, меня интересует ${name}. Пожалуйста, пришлите больше информации.`,
      sending: "Отправка...", sent: "Запрос отправлен. Спасибо.", saved: "Запрос сохранён. Для email-отправки нужен CONTACT_EMAIL/sendmail на сервере.", error: "Запрос не отправлен.",
    },
    pages: {
      breedKicker: "Характер и стандарт",
      breedTitle: "Британская короткошёрстная кошка спокойная, крепкая и очень привязанная.",
      breedText: "Порода известна округлыми линиями, густой короткой шерстью и спокойным, уравновешенным темпераментом. Британцы общительны, но ненавязчивы; любят рутину, безопасность и качественный контакт с людьми.",
      breedItems: ["Компактное, мускулистое тело и широкая голова.", "Густая плюшевая шерсть, требующая регулярного расчёсывания.", "Стабильный темперамент для спокойного семейного дома.", "Ответственное разведение включает контроль здоровья и происхождения."],
      contactKicker: "Контакт",
      contactTitle: "Поговорим о кошках, котятах и будущих помётах.",
      contactText: "По вопросам доступности котят, планируемых помётов и сотрудничества свяжитесь с нами по email или в соцсетях.",
    },
  },
  de: {
    nav: { cats: "Katzen", kittens: "Kitten", blog: "Blog", breed: "Rasse", contact: "Kontakt", homeBack: "Zur Startseite" },
    common: { readMore: "Mehr lesen", backList: "Zurück zur Liste", backBlog: "Zurück zum Blog", blogFallback: "Blog" },
    hero: [
      { title: "Willkommen bei<br />Matriks Cattery", text: "Eine British-Shorthair-Zucht mit Fokus auf Gesundheit, stabiles Wesen und Ausstellungstyp." },
      { title: "Über die<br />British Shorthair", text: "Die British Shorthair ist ruhig, kräftig und bekannt für ihr plüschiges Fell, den runden Kopf und ihr ausgeglichenes Familienwesen.", action: "Mehr lesen" },
      { title: "Lernen Sie<br />unsere Katzen kennen", text: "Schneller Zugang zu Elternprofilen, Ausstellungsergebnissen und aktuellen oder geplanten Würfen.", action: "Unsere Katzen ansehen" },
    ],
    inquiry: {
      open: "Anfrage senden", name: "Name", email: "Email", message: "Nachricht", submit: "Senden",
      defaultMessage: (name) => `Hallo, ich interessiere mich für ${name}. Bitte senden Sie mir weitere Informationen.`,
      sending: "Senden...", sent: "Ihre Anfrage wurde gesendet. Vielen Dank.", saved: "Ihre Anfrage wurde gespeichert. Email-Versand erfordert CONTACT_EMAIL/sendmail auf dem Server.", error: "Die Anfrage wurde nicht gesendet.",
    },
    pages: {
      breedKicker: "Charakter und Standard",
      breedTitle: "Die British Shorthair ist ruhig, kräftig und sehr anhänglich.",
      breedText: "Die Rasse ist bekannt für runde Linien, dichtes kurzes Fell und ein ruhiges, ausgeglichenes Wesen. Britisch Kurzhaar sind sozial, aber nicht aufdringlich; sie mögen Routine, Sicherheit und eine gute Bindung zum Menschen.",
      breedItems: ["Kompakter, muskulöser Körper und breiter Kopf.", "Dichtes plüschiges Fell, das regelmäßiges Bürsten braucht.", "Stabiles Wesen für ein ruhiges Familienzuhause.", "Verantwortungsvolle Zucht umfasst Gesundheits- und Abstammungskontrolle."],
      contactKicker: "Kontakt",
      contactTitle: "Sprechen wir über Katzen, Kitten und zukünftige Würfe.",
      contactText: "Für Informationen zu verfügbaren Kitten, geplanten Würfen und Zusammenarbeit kontaktieren Sie uns per Email oder Social Media.",
    },
  },
};

function tr() {
  return translations[currentLang] || translations.sr;
}

const heroFrames = [
  {
    image: "img/739040313_2035024693816032_1814703656727180949_n.jpg",
  },
  {
    image: "img/774196134_1794505428234882_8749782560177005708_n.jpg",
    action: {
      href: "rasa.html",
    },
  },
  {
    image: "img/775416552_1857525661892065_8602051735133753210_n.jpg",
    action: {
      href: "macke.html",
    },
  },
];

function localizedHeroFrame(index) {
  const base = heroFrames[index];
  const localized = tr().hero[index] || translations.sr.hero[index];
  return {
    ...base,
    title: localized.title,
    text: localized.text,
    action: base.action && localized.action ? { ...base.action, label: localized.action } : null,
  };
}

function initIntro() {
  const intro = document.querySelector("#intro");
  if (!intro) return;

  if (sessionStorage.getItem("matriksIntroSeen") === "true") {
    intro.classList.add("is-hidden");
    return;
  }

  sessionStorage.setItem("matriksIntroSeen", "true");
}

function renderCards(items, targetId, options = {}) {
  const target = document.querySelector(targetId);
  if (!target) return;
  const visibleItems = options.limit ? items.slice(0, options.limit) : items;
  const detailPage = options.detailPage;

  target.innerHTML = visibleItems
    .map(
      (item, index) => `
        <button class="animal-card" type="button" data-target="${targetId}" data-index="${index}" data-id="${item.id || index}" data-page="${detailPage || ""}" data-number="${String(index + 1).padStart(2, "0")}">
          <img src="${item.image}" alt="${item.name}" />
          <span class="card-body">
            <h3>${item.name}</h3>
          </span>
        </button>
      `,
    )
    .join("");
}

function languageSwitcherMarkup() {
  return `
    <div class="language-switcher" aria-label="Language selector">
      ${["sr", "en", "ru", "de"].map((lang) => `<button type="button" data-lang="${lang}" class="${currentLang === lang ? "is-active" : ""}">${lang.toUpperCase()}</button>`).join("")}
    </div>
  `;
}

function updateLanguageSwitchers() {
  document.querySelectorAll(".language-switcher").forEach((switcher) => {
    switcher.querySelectorAll("button").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.lang === currentLang);
    });
  });
}

function setNavLabels() {
  const labels = tr().nav;
  const linkLabels = {
    "macke.html": labels.cats,
    "macici.html": labels.kittens,
    "blog.html": labels.blog,
    "rasa.html": labels.breed,
    "kontakt.html": labels.contact,
  };

  document.querySelectorAll(".hero-mini-nav a, .frame-nav a, .site-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (linkLabels[href]) link.textContent = linkLabels[href];
  });

  document.querySelectorAll(".frame-home-link").forEach((link) => {
    link.textContent = labels.homeBack;
  });
}

function initLanguageSwitchers() {
  const homeTopActions = document.querySelector("#homeTopActions");
  if (homeTopActions && !homeTopActions.querySelector(".language-switcher")) {
    homeTopActions.insertAdjacentHTML("beforeend", languageSwitcherMarkup());
  }
  updateLanguageSwitchers();
}

function applyLanguage() {
  localStorage.setItem("matriksLang", currentLang);
  document.documentElement.lang = currentLang;
  setNavLabels();
  applyStaticPageTranslations();
  renderBlog();
  renderHomeBlog();
  renderAnimalDetail();
  renderPostDetail();
  initFrameNavigation();
  initLanguageSwitchers();
  initDetailSliders();
  updateHeroSlide(0);
  updateLanguageSwitchers();
}

function applyStaticPageTranslations() {
  const copy = tr().pages;
  if (document.body.classList.contains("info-page")) {
    const breed = document.querySelector(".breed-copy");
    if (breed) {
      breed.querySelector(".kicker").textContent = copy.breedKicker;
      breed.querySelector("h2").textContent = copy.breedTitle;
      breed.querySelector("p:not(.kicker)").textContent = copy.breedText;
      breed.querySelectorAll("li").forEach((item, index) => {
        item.textContent = copy.breedItems[index] || item.textContent;
      });
    }
  }

  if (document.body.classList.contains("contact-page")) {
    const contact = document.querySelector(".contact");
    if (contact) {
      contact.querySelector(".kicker").textContent = copy.contactKicker;
      contact.querySelector("h1").textContent = copy.contactTitle;
      contact.querySelector("p:not(.kicker)").textContent = copy.contactText;
    }
  }
}

function renderBlog() {
  const target = document.querySelector("#blogList");
  if (!target) return;

  target.innerHTML = posts
    .map(
      (post) => `
        <article class="blog-item">
          <img src="${post.image}" alt="${post.title}" />
          <div class="blog-copy">
            <span class="meta">${post.date || post.category || tr().common.blogFallback}</span>
            <h3>${post.title}</h3>
            <p>${post.text}</p>
            <a class="text-link" href="post.html?id=${post.id}">${tr().common.readMore}</a>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderHomeBlog() {
  const target = document.querySelector("#homeBlogList");
  if (!target) return;

  target.innerHTML = posts
    .slice(0, 2)
    .map(
      (post) => `
        <article class="blog-item">
          <img src="${post.image}" alt="${post.title}" />
          <div class="blog-copy">
            <span class="meta">${post.date || post.category || tr().common.blogFallback}</span>
            <h3>${post.title}</h3>
            <p>${post.text}</p>
            <a class="text-link" href="post.html?id=${post.id}">${tr().common.readMore}</a>
          </div>
        </article>
      `,
    )
    .join("");
}

function openDetail(item) {
  if (!modal || !modalContent) return;
  const facts = Object.entries(item.facts)
    .map(([label, value]) => `<span><strong>${label}</strong>${value}</span>`)
    .join("");

  modalContent.innerHTML = `
    <div class="modal-layout">
      <div class="modal-gallery">
        ${item.gallery.map((image) => `<img src="${image}" alt="${item.name}" />`).join("")}
      </div>
      <div class="modal-text">
        <span class="status">${item.status}</span>
        <h2>${item.name}</h2>
        <p>${item.text}</p>
        <div class="facts">${facts}</div>
      </div>
    </div>
  `;

  modal.showModal();
}

function updateHeroSlide(direction = 0) {
  const slides = heroFrames;
  const heroStage = document.querySelector(".hero-stage");
  if (!heroImage || !heroTitle || !heroText) return;

  heroIndex = (heroIndex + direction + slides.length) % slides.length;
  const item = localizedHeroFrame(heroIndex);

  heroStage?.classList.add("is-transitioning");
  window.setTimeout(() => {
    heroImage.src = item.image;
    heroImage.alt = item.title.replaceAll("<br />", " ");
    heroTitle.innerHTML = item.title;
    heroText.textContent = item.text;
    if (heroActions) {
      heroActions.innerHTML = item.action
        ? `<a class="button primary hero-action" href="${item.action.href}">${item.action.label}</a>`
        : "";
    }
    heroStage?.classList.remove("is-transitioning");
  }, 180);
}

function startHeroTimer() {
  if (!heroImage || heroTimer) return;
  heroTimer = window.setInterval(() => updateHeroSlide(1), 5000);
}

function stopHeroTimer() {
  if (!heroTimer) return;
  window.clearInterval(heroTimer);
  heroTimer = null;
}

function initFrameNavigation() {
  const main = document.querySelector(".frame-page main");
  if (!main || main.querySelector(".frame-topline")) return;

  main.insertAdjacentHTML(
    "afterbegin",
    `
      <div class="frame-topline">
        <a class="brand frame-brand" href="index.html" aria-label="Matriks Cattery početna">
          <img src="img/logo.jpg" alt="" />
        </a>
        <button class="frame-menu-toggle" type="button" aria-label="Otvori meni" aria-expanded="false">
          <span></span>
          <span></span>
        </button>
        <nav class="frame-nav hero-mini-nav" aria-label="Glavna navigacija">
          <a href="macke.html">Mačke</a>
          <a href="macici.html">Mačići</a>
          <a href="blog.html">Blog</a>
          <a href="rasa.html">O rasi</a>
          <a href="kontakt.html">Kontakt</a>
        </nav>
        <div class="top-actions">
          <a class="frame-home-link" href="index.html">${tr().nav.homeBack}</a>
          ${languageSwitcherMarkup()}
        </div>
      </div>
    `,
  );
}

function renderAnimalDetail() {
  const target = document.querySelector("#animalDetail");
  if (!target) return;

  const type = target.dataset.detailType;
  const id = Number(new URLSearchParams(window.location.search).get("id"));
  const source = type === "kitten" ? kittens : cats;
  const item = source.find((animal) => Number(animal.id) === id) || source[0];

  if (!item) {
    target.innerHTML = `<section class="page-hero"><h1>Unos nije pronađen</h1><p>Vratite se na listu.</p></section>`;
    return;
  }

  const factsText = Object.entries(item.facts || {})
    .map(([label, value]) => `${label}: ${value}`)
    .join(" · ");
  const gallery = (item.gallery?.length ? item.gallery : [item.image])
    .map((image) => `<img src="${image}" alt="${item.name}" />`)
    .join("");

  document.title = `${item.name} | Matriks Cattery`;
  target.innerHTML = `
    <section class="detail-layout">
      <div class="detail-info">
        <section class="detail-hero">
          <a class="back-link" href="${type === "kitten" ? "macici.html" : "macke.html"}">${tr().common.backList}</a>
          <span class="status">${item.status || item.label || ""}</span>
          <h1>${item.name}</h1>
          ${factsText ? `<p class="detail-meta">${factsText}</p>` : ""}
          <p>${item.text || ""}</p>
          ${type === "kitten" ? `
            <button class="button inquiry-toggle" type="button">${tr().inquiry.open}</button>
            <form class="inquiry-form" data-kitten="${item.name}" hidden>
              <label>
                ${tr().inquiry.name}
                <input name="name" type="text" autocomplete="name" required />
              </label>
              <label>
                ${tr().inquiry.email}
                <input name="email" type="email" autocomplete="email" required />
              </label>
              <label>
                ${tr().inquiry.message}
                <textarea name="message" rows="5" required>${tr().inquiry.defaultMessage(item.name)}</textarea>
              </label>
              <button class="button primary" type="submit">${tr().inquiry.submit}</button>
              <p class="form-status" role="status"></p>
            </form>
          ` : ""}
        </section>
      </div>
      <section class="detail-gallery detail-slider" aria-label="Galerija slika">
        <button class="slider-button slider-prev" type="button" data-slide-direction="-1" aria-label="Prethodna slika">‹</button>
        <div class="detail-slider-window">
          <div class="detail-slider-track">${gallery}</div>
        </div>
        <button class="slider-button slider-next" type="button" data-slide-direction="1" aria-label="Sledeća slika">›</button>
      </section>
    </section>
  `;
}

function moveDetailSlider(button) {
  const slider = button.closest(".detail-slider");
  const track = slider?.querySelector(".detail-slider-track");
  if (!track) return;

  const direction = Number(button.dataset.slideDirection || 1);
  moveSliderTrack(track, direction);
}

function moveSliderTrack(track, direction = 1) {
  const nextLeft = track.scrollLeft + direction * track.clientWidth;
  const maxLeft = track.scrollWidth - track.clientWidth - 4;

  track.scrollTo({
    left: direction > 0 && nextLeft > maxLeft ? 0 : Math.max(0, nextLeft),
    behavior: "smooth",
  });
}

function initDetailSliders() {
  document.querySelectorAll(".detail-slider-track").forEach((track) => {
    if (track.dataset.sliderReady === "true" || track.children.length < 2) return;
    track.dataset.sliderReady = "true";
    window.setInterval(() => moveSliderTrack(track, 1), 4500);
  });
}

async function submitInquiry(form) {
  const status = form.querySelector(".form-status");
  const submit = form.querySelector("button[type='submit']");
  const payload = {
    kitten: form.dataset.kitten,
    name: form.elements.name.value,
    email: form.elements.email.value,
    message: form.elements.message.value,
  };

  if (status) status.textContent = tr().inquiry.sending;
  submit.disabled = true;

  try {
    const response = await fetch("/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || tr().inquiry.error);
    form.reset();
    if (status) {
      status.textContent = result.sent
        ? tr().inquiry.sent
        : tr().inquiry.saved;
    }
  } catch (error) {
    if (status) status.textContent = error.message;
  } finally {
    submit.disabled = false;
  }
}

function renderPostDetail() {
  const target = document.querySelector("#postDetail");
  if (!target) return;

  const id = Number(new URLSearchParams(window.location.search).get("id"));
  const post = posts.find((item) => Number(item.id) === id) || posts[0];

  if (!post) {
    target.innerHTML = `<section class="page-hero"><h1>Post nije pronađen</h1><p>Vratite se na blog.</p></section>`;
    return;
  }

  const media = [post.image, ...(post.media || [])]
    .filter(Boolean)
    .map((src) => (/\.(mp4|mov|webm)$/i.test(src) ? `<video src="${src}" controls></video>` : `<img src="${src}" alt="${post.title}" />`))
    .join("");

  document.title = `${post.title} | Matriks Cattery`;
  target.innerHTML = `
    <article class="post-detail">
      <a class="back-link" href="blog.html">${tr().common.backBlog}</a>
      <span class="meta">${post.date || post.category || tr().common.blogFallback}</span>
      <h1>${post.title}</h1>
      <p>${post.text || ""}</p>
      <div class="detail-gallery">${media}</div>
    </article>
  `;
}

document.addEventListener("click", (event) => {
  const frameMenuToggle = event.target.closest(".frame-menu-toggle");
  if (frameMenuToggle) {
    const topbar = frameMenuToggle.closest(".hero-topline, .frame-topline");
    const isOpen = topbar?.classList.toggle("is-menu-open") || false;
    frameMenuToggle.setAttribute("aria-expanded", String(isOpen));
    return;
  }

  const frameNavLink = event.target.closest(".hero-mini-nav a");
  if (frameNavLink) {
    const topbar = frameNavLink.closest(".hero-topline, .frame-topline");
    topbar?.classList.remove("is-menu-open");
    topbar?.querySelector(".frame-menu-toggle")?.setAttribute("aria-expanded", "false");
  }

  const languageButton = event.target.closest(".language-switcher button");
  if (languageButton) {
    currentLang = languageButton.dataset.lang || "sr";
    applyLanguage();
    return;
  }

  const inquiryToggle = event.target.closest(".inquiry-toggle");
  if (inquiryToggle) {
    const form = inquiryToggle.nextElementSibling;
    if (form?.classList.contains("inquiry-form")) {
      form.hidden = !form.hidden;
      if (!form.hidden) form.querySelector("input")?.focus();
    }
    return;
  }

  const sliderButton = event.target.closest(".slider-button");
  if (sliderButton) {
    moveDetailSlider(sliderButton);
    return;
  }

  const card = event.target.closest(".animal-card");

  if (!card) return;

  if (card.dataset.page) {
    window.location.href = `${card.dataset.page}?id=${card.dataset.id}`;
    return;
  }

  const source = card.dataset.target === "#catsGrid" ? cats : kittens;
  openDetail(source[Number(card.dataset.index)]);
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest(".inquiry-form");
  if (!form) return;
  event.preventDefault();
  submitInquiry(form);
});

closeModal?.addEventListener("click", () => modal.close());

modal?.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.close();
  }
});

navToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", () => {
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
});

const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

async function initContent() {
  initIntro();
  document.documentElement.lang = currentLang;

  try {
    const response = await fetch("/api/content");
    if (response.ok) {
      const data = await response.json();
      cats = data.cats || cats;
      kittens = data.kittens || kittens;
      posts = data.posts || posts;
    }
  } catch {
    // Direktno otvaranje index.html koristi lokalni demo sadržaj.
  }

  renderCards(cats, "#homeCatsGrid", { limit: 3, detailPage: "macka.html" });
  renderCards(kittens, "#homeKittensGrid", { limit: 2, detailPage: "mace.html" });
  renderCards(cats, "#catsGrid", { detailPage: "macka.html" });
  renderCards(kittens, "#kittensGrid", { detailPage: "mace.html" });
  renderBlog();
  renderHomeBlog();
  renderAnimalDetail();
  renderPostDetail();
  initFrameNavigation();
  initLanguageSwitchers();
  setNavLabels();
  applyStaticPageTranslations();
  initDetailSliders();
  updateHeroSlide();

  heroActions?.addEventListener("mouseenter", stopHeroTimer);
  heroActions?.addEventListener("mouseleave", startHeroTimer);
  heroActions?.addEventListener("focusin", stopHeroTimer);
  heroActions?.addEventListener("focusout", startHeroTimer);
  startHeroTimer();
}

initContent();
