let password = localStorage.getItem("matriksAdminPassword") || "";
let content = { cats: [], kittens: [], posts: [] };

const loginPanel = document.querySelector("#loginPanel");
const adminApp = document.querySelector("#adminApp");
const passwordInput = document.querySelector("#passwordInput");
const loginButton = document.querySelector("#loginButton");
const animalForm = document.querySelector("#animalForm");
const postForm = document.querySelector("#postForm");
const animalList = document.querySelector("#animalList");
const postList = document.querySelector("#postList");
const translateAllButton = document.querySelector("#translateAllButton");
const translateStatus = document.querySelector("#translateStatus");
const addPostTextBlockButton = document.querySelector("#addPostTextBlock");
const addPostMediaBlockButton = document.querySelector("#addPostMediaBlock");
const postMediaUpload = document.querySelector("#postMediaUpload");
const postBlockList = document.querySelector("#postBlockList");
const postMediaStatus = document.querySelector("#postMediaStatus");
let pendingMediaBlockIndex = null;

function linesToArray(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function factsToObject(value) {
  return Object.fromEntries(
    value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf(":");
        if (separator < 0) return [line, ""];
        return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
      }),
  );
}

function objectToFacts(value) {
  return Object.entries(value || {})
    .map(([key, fact]) => `${key}: ${fact}`)
    .join("\n");
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": password,
      ...(options.headers || {}),
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Zahtev nije uspeo.");
  return data;
}

async function loadContent() {
  content = await api("/api/content", { method: "GET" });
  renderAnimals();
  renderPosts();
}

function mediaTag(src, alt) {
  if (/\.(mp4|mov|webm)$/i.test(src || "")) {
    return `<video src="${src}" muted controls></video>`;
  }
  return `<img src="${src || "img/logo.jpg"}" alt="${alt}" />`;
}

function postPreviewPath(post) {
  const blockMedia = (post.blocks || []).flatMap((block) => (block.type === "media" ? block.items || [] : []));
  return post.image || (post.media || [])[0] || blockMedia[0] || "";
}

function safeJsonArray(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizePostBlocks(blocks, text = "", media = []) {
  const normalized = (blocks || [])
    .map((block) => {
      if (block.type === "media") {
        return { type: "media", items: (block.items || []).filter(Boolean) };
      }
      return { type: "text", text: String(block.text || "") };
    });

  if (normalized.length) return normalized;

  const fallback = [];
  if (text.trim()) fallback.push({ type: "text", text });
  if ((media || []).length) fallback.push({ type: "media", items: media });
  return fallback.length ? fallback : [{ type: "text", text: "" }];
}

function postBlocksData() {
  return normalizePostBlocks(safeJsonArray(postForm.blocks.value), postForm.text.value, linesToArray(postForm.media.value || ""));
}

function setPostBlocksData(blocks) {
  const normalized = normalizePostBlocks(blocks);
  postForm.blocks.value = JSON.stringify(normalized);
  postForm.text.value = normalized.filter((block) => block.type === "text").map((block) => block.text).join("\n\n");
  postForm.media.value = normalized.flatMap((block) => (block.type === "media" ? block.items : [])).join("\n");
  renderPostBlocks();
}

function renderPostBlocks() {
  if (!postBlockList) return;
  const blocks = postBlocksData();

  postBlockList.innerHTML = blocks
    .map((block, index) => block.type === "media"
      ? `
        <div class="content-block" data-post-block="${index}">
          <div class="content-block-head">
            <strong>Slike/video</strong>
            <div class="block-actions">
              <button class="button ghost" type="button" data-upload-post-block="${index}">${block.items.length ? "Dodaj još jednu" : "Dodaj sliku/video"}</button>
              <button class="button ghost" type="button" data-remove-post-block="${index}">Ukloni blok</button>
            </div>
          </div>
          <div class="media-list">
            ${block.items.length ? block.items.map((path, mediaIndex) => `
              <div class="media-row">
                ${mediaTag(path, `Medij ${mediaIndex + 1}`)}
                <span>${path}</span>
                <button class="button ghost" type="button" data-remove-block-media="${index}:${mediaIndex}">Ukloni</button>
              </div>
            `).join("") : `<p class="help-text">Nema dodatih slika ili video snimaka.</p>`}
          </div>
        </div>
      `
      : `
        <div class="content-block" data-post-block="${index}">
          <div class="content-block-head">
            <strong>Tekst</strong>
            <button class="button ghost" type="button" data-remove-post-block="${index}">Ukloni blok</button>
          </div>
          <textarea rows="6" data-post-text-block="${index}" placeholder="Unesite tekst ovog dela objave">${block.text || ""}</textarea>
        </div>
      `)
    .join("");
}

function renderAnimals() {
  const animals = [...content.cats, ...content.kittens];

  animalList.innerHTML = animals
    .map(
      (item) => `
        <article class="admin-item">
          ${mediaTag(item.image, item.name)}
          <div>
            <span class="status">${item.type === "kitten" ? "Mačići" : "Mačke"}</span>
            <h3>${item.name}</h3>
            <p>${item.status || item.label || ""}</p>
            <div class="item-actions">
              <button type="button" data-edit-animal="${item.id}">Izmeni</button>
              <button class="danger" type="button" data-delete-animal="${item.id}">Obriši</button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderPosts() {
  postList.innerHTML = content.posts
    .map(
      (post) => `
        <article class="admin-item">
          ${mediaTag(postPreviewPath(post), post.title)}
          <div>
            <span class="status">${post.category || "Blog"}</span>
            <h3>${post.title}</h3>
            <p>${post.text || ""}</p>
            <div class="item-actions">
              <button type="button" data-edit-post="${post.id}">Izmeni</button>
              <button class="danger" type="button" data-delete-post="${post.id}">Obriši</button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function resetAnimalForm() {
  animalForm.reset();
  animalForm.id.value = "";
  document.querySelector("#animalFormTitle").textContent = "Nova mačka";
}

function resetPostForm() {
  postForm.reset();
  postForm.id.value = "";
  setPostBlocksData([{ type: "text", text: "" }]);
  document.querySelector("#postFormTitle").textContent = "Novi blog post";
}

function fillAnimalForm(item) {
  animalForm.id.value = item.id;
  animalForm.type.value = item.type;
  animalForm.name.value = item.name || "";
  animalForm.label.value = item.label || "";
  animalForm.status.value = item.status || "";
  animalForm.image.value = item.image || "";
  animalForm.gallery.value = (item.gallery || []).join("\n");
  animalForm.text.value = item.text || "";
  animalForm.facts.value = objectToFacts(item.facts);
  document.querySelector("#animalFormTitle").textContent = `Izmena: ${item.name}`;
  animalForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function fillPostForm(post) {
  postForm.id.value = post.id;
  postForm.title.value = post.title || "";
  postForm.category.value = post.category || "";
  postForm.image.value = post.image || "";
  postForm.media.value = (post.media || []).join("\n");
  postForm.text.value = post.text || "";
  postForm.blocks.value = JSON.stringify(normalizePostBlocks(post.blocks, post.text || "", post.media || []));
  renderPostBlocks();
  document.querySelector("#postFormTitle").textContent = `Izmena: ${post.title}`;
  postForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function uploadFile(input) {
  if (!input.files.length) return;

  const formData = new FormData();
  formData.append("file", input.files[0]);

  const response = await fetch("/api/upload", {
    method: "POST",
    headers: { "x-admin-password": password },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Upload nije uspeo.");

  input.value = "";
  return data.path;
}

async function uploadFileToField(input, result, targetSelector) {
  const path = await uploadFile(input);
  if (!path) return;

  document.querySelector(targetSelector).value = path;
  result.textContent = `Sačuvano: ${path}`;
}

async function uploadPostMedia(input) {
  if (postMediaStatus) postMediaStatus.textContent = "Upload je u toku...";
  const path = await uploadFile(input);
  if (!path) return;

  const blocks = postBlocksData();
  const blockIndex = pendingMediaBlockIndex ?? blocks.findIndex((block) => block.type === "media");
  const targetIndex = blockIndex >= 0 ? blockIndex : blocks.length;
  if (!blocks[targetIndex]) blocks.push({ type: "media", items: [] });
  blocks[targetIndex].items.push(path);
  setPostBlocksData(blocks);
  if (!postForm.image.value) postForm.image.value = path;
  pendingMediaBlockIndex = null;
  if (postMediaStatus) postMediaStatus.textContent = `Dodato: ${path}`;
}

loginButton.addEventListener("click", async () => {
  password = passwordInput.value.trim();
  localStorage.setItem("matriksAdminPassword", password);

  try {
    await api("/api/admin/check", { method: "GET" });
    await loadContent();
    loginPanel.classList.add("hidden");
    adminApp.classList.remove("hidden");
  } catch (error) {
    alert(error.message);
  }
});

if (password) {
  passwordInput.value = password;
  loginButton.click();
}

document.querySelectorAll(".admin-tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".admin-tabs button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelector("#animalsTab").classList.toggle("hidden", button.dataset.tab !== "animals");
    document.querySelector("#postsTab").classList.toggle("hidden", button.dataset.tab !== "posts");
  });
});

translateAllButton?.addEventListener("click", async () => {
  translateAllButton.disabled = true;
  translateStatus.textContent = "Prevodi se sadržaj...";

  try {
    content = await api("/api/admin/translate-all", { method: "POST" });
    renderAnimals();
    renderPosts();
    translateStatus.textContent = "Prevodi su ažurirani.";
  } catch (error) {
    translateStatus.textContent = error.message;
  } finally {
    translateAllButton.disabled = false;
  }
});

animalForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    type: animalForm.type.value,
    name: animalForm.name.value,
    label: animalForm.label.value,
    status: animalForm.status.value,
    image: animalForm.image.value,
    gallery: linesToArray(animalForm.gallery.value),
    text: animalForm.text.value,
    facts: factsToObject(animalForm.facts.value),
  };

  const id = animalForm.id.value;
  content = await api(id ? `/api/animals/${id}` : "/api/animals", {
    method: id ? "PUT" : "POST",
    body: JSON.stringify(payload),
  });
  resetAnimalForm();
  renderAnimals();
});

postForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    title: postForm.title.value,
    category: postForm.category.value,
    image: postForm.image.value,
    media: linesToArray(postForm.media.value),
    text: postForm.text.value,
    blocks: safeJsonArray(postForm.blocks.value),
  };

  const id = postForm.id.value;
  content = await api(id ? `/api/posts/${id}` : "/api/posts", {
    method: id ? "PUT" : "POST",
    body: JSON.stringify(payload),
  });
  resetPostForm();
  renderPosts();
});

document.addEventListener("click", async (event) => {
  const editAnimal = event.target.closest("[data-edit-animal]");
  const deleteAnimal = event.target.closest("[data-delete-animal]");
  const editPost = event.target.closest("[data-edit-post]");
  const deletePost = event.target.closest("[data-delete-post]");
  const removePostBlock = event.target.closest("[data-remove-post-block]");
  const uploadPostBlock = event.target.closest("[data-upload-post-block]");
  const removeBlockMedia = event.target.closest("[data-remove-block-media]");

  if (editAnimal) {
    const animals = [...content.cats, ...content.kittens];
    fillAnimalForm(animals.find((item) => item.id === Number(editAnimal.dataset.editAnimal)));
  }

  if (deleteAnimal && confirm("Obrisati ovaj unos?")) {
    content = await api(`/api/animals/${deleteAnimal.dataset.deleteAnimal}`, { method: "DELETE" });
    renderAnimals();
  }

  if (editPost) {
    fillPostForm(content.posts.find((item) => item.id === Number(editPost.dataset.editPost)));
  }

  if (deletePost && confirm("Obrisati ovaj blog post?")) {
    content = await api(`/api/posts/${deletePost.dataset.deletePost}`, { method: "DELETE" });
    renderPosts();
  }

  if (removePostBlock) {
    const blocks = postBlocksData();
    blocks.splice(Number(removePostBlock.dataset.removePostBlock), 1);
    setPostBlocksData(blocks.length ? blocks : [{ type: "text", text: "" }]);
    if (postMediaStatus) postMediaStatus.textContent = "Blok je uklonjen.";
  }

  if (uploadPostBlock) {
    pendingMediaBlockIndex = Number(uploadPostBlock.dataset.uploadPostBlock);
    postMediaUpload?.click();
  }

  if (removeBlockMedia) {
    const [blockIndex, mediaIndex] = removeBlockMedia.dataset.removeBlockMedia.split(":").map(Number);
    const blocks = postBlocksData();
    blocks[blockIndex]?.items?.splice(mediaIndex, 1);
    setPostBlocksData(blocks);
    if (postMediaStatus) postMediaStatus.textContent = "Medij je uklonjen iz bloka.";
  }
});

postBlockList?.addEventListener("input", (event) => {
  const textBlock = event.target.closest("[data-post-text-block]");
  if (!textBlock) return;
  const blocks = postBlocksData();
  blocks[Number(textBlock.dataset.postTextBlock)].text = textBlock.value;
  postForm.blocks.value = JSON.stringify(blocks);
  postForm.text.value = blocks.filter((block) => block.type === "text").map((block) => block.text).join("\n\n");
});

document.querySelector("#resetAnimal").addEventListener("click", resetAnimalForm);
document.querySelector("#resetPost").addEventListener("click", resetPostForm);
document.querySelector("#animalUpload").addEventListener("change", (event) => {
  uploadFileToField(event.target, document.querySelector("#animalUploadResult"), "#animalForm [name='image']").catch((error) => alert(error.message));
});
addPostTextBlockButton?.addEventListener("click", () => {
  const blocks = postBlocksData();
  blocks.push({ type: "text", text: "" });
  setPostBlocksData(blocks);
});
addPostMediaBlockButton?.addEventListener("click", () => {
  const blocks = postBlocksData();
  blocks.push({ type: "media", items: [] });
  setPostBlocksData(blocks);
});
postMediaUpload?.addEventListener("change", (event) => {
  uploadPostMedia(event.target).catch((error) => {
    pendingMediaBlockIndex = null;
    if (postMediaStatus) postMediaStatus.textContent = error.message;
    alert(error.message);
  });
});
setPostBlocksData([{ type: "text", text: "" }]);
