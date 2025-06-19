// main.js - logic for loading and displaying AI tools

const $ = {
  grid: document.getElementById("toolGrid"),
  search: document.getElementById("search"),
  category: document.getElementById("category"),
  toggleFavs: document.getElementById("toggleFavs"),
  overlay: document.getElementById("introOverlay"),
  enterBtn: document.getElementById("enterBtn"),
  toast: document.getElementById("toast")
};

let tools = [];
let showFavorites = false;
const favorites = new Set(JSON.parse(localStorage.getItem("favorites") || "[]"));

function showToast(msg) {
  $.toast.textContent = msg;
  $.toast.classList.remove("hidden");
  setTimeout(() => $.toast.classList.add("hidden"), 3000);
}

function toggleFavorite(name, el) {
  if (favorites.has(name)) {
    favorites.delete(name);
    el.classList.remove("text-yellow-400");
  } else {
    favorites.add(name);
    el.classList.add("text-yellow-400");
  }
  localStorage.setItem("favorites", JSON.stringify([...favorites]));
  displayTools();
}

function displayTools() {
  $.grid.innerHTML = "";
  const searchVal = $.search.value.toLowerCase();
  const catVal = $.category.value;

  const filtered = tools.filter(t => {
    const matches = t.name.toLowerCase().includes(searchVal) || t.desc.toLowerCase().includes(searchVal);
    const matchesCat = !catVal || t.category === catVal;
    return (showFavorites ? favorites.has(t.name) : true) && matches && matchesCat;
  });

  if (!filtered.length) {
    $.grid.innerHTML = `<div class='text-center text-gray-400 col-span-full'>😕 No tools found.</div>`;
    return;
  }

  filtered.forEach(t => {
    const fav = favorites.has(t.name);
    const el = document.createElement("div");
    el.className = "p-5 bg-gray-800 rounded shadow tool-card";
    el.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <h2 class="text-lg font-semibold">${t.icon || "✨"} ${t.name}</h2>
        <button class="favorite text-xl ${fav ? 'text-yellow-400' : 'text-gray-400'}" title="Favorite">
          <i class="fas fa-star"></i>
        </button>
      </div>
      <p class="text-sm text-gray-300 mb-4">${t.desc}</p>
      <a href="${t.link}" target="_blank" class="text-purple-400 hover:underline">🌐 Visit Site</a>
    `;
    el.querySelector(".favorite").onclick = () => toggleFavorite(t.name, el.querySelector(".favorite"));
    $.grid.appendChild(el);
  });
}

function updateCategoryOptions() {
  const cats = [...new Set(tools.map(t => t.category))];
  $.category.innerHTML = '<option value="">All Categories</option>' + cats.map(c => `<option value="${c}">${c}</option>`).join("");
}

// Load tools
fetch("tools.json")
  .then(res => res.json())
  .then(data => {
    tools = data;
    updateCategoryOptions();
    displayTools();
    document.getElementById("loader").style.display = "none";
  })
  .catch(err => showToast("Failed to load tools"));

// Events
$.search.addEventListener("input", displayTools);
$.category.addEventListener("change", displayTools);
$.toggleFavs.addEventListener("click", () => {
  showFavorites = !showFavorites;
  displayTools();
  $.toggleFavs.textContent = showFavorites ? "⭐ All Tools" : "⭐ Favorites Only";
});

$.enterBtn.addEventListener("click", () => {
  $.overlay.classList.add("opacity-0", "pointer-events-none");
  setTimeout(() => $.overlay.remove(), 600);
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
