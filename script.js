// FreshMind — mockup logic
// Demo data only. The mockup does not run a real ML model or food-safety assessment.

/* ---------- Data ---------- */

let foods = [
  { id: 1, name: "Chicken breast", emoji: "🍗", category: "Meat & fish", days: 1, quantity: "400 g", state: "Opened" },
  { id: 2, name: "Mushrooms", emoji: "🍄", category: "Vegetables", days: 2, quantity: "250 g", state: "Fresh" },
  { id: 3, name: "Spinach", emoji: "🥬", category: "Vegetables", days: 2, quantity: "1 bag", state: "Opened" },
  { id: 4, name: "Milk", emoji: "🥛", category: "Dairy", days: 3, quantity: "1 litre", state: "Opened" },
  { id: 5, name: "Feta cheese", emoji: "🧀", category: "Dairy", days: 7, quantity: "200 g", state: "Unopened" },
  { id: 6, name: "Tomatoes", emoji: "🍅", category: "Vegetables", days: 5, quantity: "4 pieces", state: "Fresh" },
  { id: 7, name: "Eggs", emoji: "🥚", category: "Dairy", days: 12, quantity: "6 pieces", state: "Unopened" },
  { id: 8, name: "Rice", emoji: "🍚", category: "Pantry", days: 90, quantity: "500 g", state: "Unopened" },
];

const recipes = [
  {
    id: 1,
    name: "Creamy chicken & mushroom pasta",
    emoji: "🍝",
    time: 25,
    ingredients: ["Chicken breast", "Mushrooms", "Milk"],
    extra: ["Pasta", "Garlic"],
    description: "A comforting one-pan style pasta that uses two ingredients from your priority list.",
    steps: [
      "Cook pasta according to its package instructions.",
      "Cook chicken thoroughly in a pan.",
      "Add mushrooms and cook until softened.",
      "Stir in milk and seasoning, then combine with pasta.",
    ],
  },
  {
    id: 2,
    name: "Spinach and feta omelette",
    emoji: "🍳",
    time: 15,
    ingredients: ["Spinach", "Feta cheese", "Eggs"],
    extra: ["Olive oil"],
    description: "A quick meal that gives your spinach a delicious second life.",
    steps: [
      "Wash and prepare the spinach.",
      "Wilt spinach in a lightly oiled pan.",
      "Add beaten eggs and cook until set.",
      "Finish with crumbled feta.",
    ],
  },
  {
    id: 3,
    name: "Chicken rice bowl",
    emoji: "🥗",
    time: 30,
    ingredients: ["Chicken breast", "Rice", "Tomatoes"],
    extra: ["Lemon", "Herbs"],
    description: "A balanced bowl using the chicken that should be used first.",
    steps: [
      "Cook rice according to the package.",
      "Cook chicken thoroughly in a pan.",
      "Chop tomatoes and prepare herbs.",
      "Serve together with lemon and seasoning.",
    ],
  },
  {
    id: 4,
    name: "Mushroom & spinach toast",
    emoji: "🥪",
    time: 12,
    ingredients: ["Mushrooms", "Spinach", "Feta cheese"],
    extra: ["Bread"],
    description: "A fast lunch with ingredients already waiting in your fridge.",
    steps: [
      "Slice and sauté mushrooms.",
      "Add spinach until wilted.",
      "Toast bread and top with the vegetables.",
      "Finish with crumbled feta.",
    ],
  },
  {
    id: 5,
    name: "Tomato and feta salad",
    emoji: "🥗",
    time: 10,
    ingredients: ["Tomatoes", "Feta cheese"],
    extra: ["Olive oil", "Oregano"],
    description: "A simple fresh option for a busy day.",
    steps: ["Chop tomatoes and feta.", "Combine in a bowl.", "Add olive oil and oregano."],
  },
];

const screenTitles = {
  home: ["Good morning, Alex 👋", "Here's what needs your attention today."],
  fridge: ["My fridge", "Manage your ingredients and their estimated freshness."],
  recipes: ["Smart recipes", "Find something delicious using what you already have."],
  add: ["Add a product", "Keep your fridge up to date."],
};

const categoryEmoji = { Vegetables: "🥬", Fruit: "🍎", Dairy: "🥛", "Meat & fish": "🍗", Pantry: "🍚", Other: "🥫" };

/* ---------- Helpers ---------- */

const byId = (id) => document.getElementById(id);
const emojiFor = (category) => categoryEmoji[category] || "🥫";
const isUrgent = (food) => food.days <= 2;
const hasIngredient = (name) => foods.some((f) => f.name === name);
const hasUrgentIngredient = (name) => foods.some((f) => f.name === name && isUrgent(f));
const today = () => new Date().toISOString().slice(0, 10);

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

/* ---------- Templates ---------- */

function foodCard(f, removable = false) {
  const removeButton = removable
    ? `<button data-remove="${f.id}" aria-label="Remove ${escapeHtml(f.name)}">✕</button>`
    : "";
  return `
    <div class="food-card">
      <div class="food-emoji">${f.emoji || emojiFor(f.category)}</div>
      <div class="food-info">
        <strong>${escapeHtml(f.name)}</strong>
        <small>${escapeHtml(f.quantity || f.category)} · ${escapeHtml(f.state || "Fresh")}</small>
      </div>
      <span class="days ${isUrgent(f) ? "urgent" : ""}">${f.days}d left</span>
      ${removeButton}
    </div>`;
}

function recipeCard(r) {
  const available = r.ingredients.filter(hasIngredient).length;
  const urgent = r.ingredients.filter(hasUrgentIngredient).length;
  const match = urgent
    ? `★ Uses ${urgent} priority ingredient${urgent > 1 ? "s" : ""}`
    : `${Math.round((available / r.ingredients.length) * 100)}% ingredient match`;
  return `
    <article class="recipe-card">
      <div class="recipe-art">${r.emoji}</div>
      <div class="recipe-body">
        <h4>${r.name}</h4>
        <p>${r.time} min · ${available}/${r.ingredients.length} ingredients available</p>
        <span class="match">${match}</span>
        <button class="text-link" data-recipe="${r.id}">View recipe →</button>
      </div>
    </article>`;
}

/* ---------- Rendering ---------- */

function renderHome() {
  byId("total-count").textContent = foods.length;
  byId("urgent-count").textContent = foods.filter(isUrgent).length;
  const priority = foods.slice().sort((a, b) => a.days - b.days).slice(0, 4);
  byId("priority-list").innerHTML = priority.length
    ? priority.map((f) => foodCard(f)).join("")
    : '<div class="empty">Your fridge is empty. Add your first product.</div>';
  byId("home-recipes").innerHTML = recipes.slice(0, 3).map(recipeCard).join("");
}

function renderInventory() {
  const query = byId("food-search").value.toLowerCase();
  const filter = byId("food-filter").value;
  const list = foods
    .filter((f) => f.name.toLowerCase().includes(query))
    .filter((f) => filter === "all" || (filter === "urgent" ? isUrgent(f) : !isUrgent(f)))
    .sort((a, b) => a.days - b.days);
  byId("inventory-list").innerHTML = list.length
    ? list.map((f) => foodCard(f, true)).join("")
    : '<div class="empty">No products match. Try another search or add a product.</div>';
}

// Ingredients you have score 2 points, priority ones (≤ 2 days left) score 4.
function scoreRecipe(r) {
  return r.ingredients.reduce((sum, name) => {
    const f = foods.find((x) => x.name === name);
    return sum + (f ? (isUrgent(f) ? 4 : 2) : 0);
  }, 0);
}

function renderRecipes() {
  const filter = byId("recipe-filter").value;
  let list = recipes.slice().sort((a, b) => scoreRecipe(b) - scoreRecipe(a));
  if (filter === "quick") list = list.filter((r) => r.time <= 25);
  if (filter === "urgent") list = list.filter((r) => r.ingredients.some(hasUrgentIngredient));
  byId("recipe-list").innerHTML =
    list.map(recipeCard).join("") || '<div class="empty">No recipes found for this filter.</div>';
}

function showRecipe(id) {
  const r = recipes.find((x) => x.id === id);
  if (!r) return;
  const have = r.ingredients.filter(hasIngredient);
  const missing = r.ingredients.filter((i) => !hasIngredient(i)).concat(r.extra);
  const detail = byId("recipe-detail");
  detail.innerHTML = `
    <div class="recipe-detail">
      <div class="big-emoji">${r.emoji}</div>
      <h3>${r.name}</h3>
      <p class="sub">${r.time} minutes · ${have.length} of ${r.ingredients.length} main ingredients available</p>
      <p>${r.description}</p>
      <strong class="detail-label">You have</strong>
      <div>${have.map((i) => `<span class="pill">✓ ${i}</span>`).join("") || "No main ingredients available yet"}</div>
      <strong class="detail-label gap">You'll also need</strong>
      <div>${missing.map((i) => `<span class="pill missing">${i}</span>`).join("")}</div>
      <h4>How to make it</h4>
      <ol>${r.steps.map((s) => `<li>${s}</li>`).join("")}</ol>
      <button class="btn outline small" data-close-recipe>Close recipe</button>
    </div>`;
  detail.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderAll() {
  renderHome();
  renderInventory();
  renderRecipes();
}

/* ---------- Actions ---------- */

function navigate(screen) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === screen));
  document
    .querySelectorAll(".nav [data-screen], .mobile-nav [data-screen]")
    .forEach((b) => b.classList.toggle("active", b.dataset.screen === screen));
  const [title, subtitle] = screenTitles[screen];
  byId("page-title").textContent = title;
  byId("page-subtitle").textContent = subtitle;
  if (screen === "fridge") renderInventory();
  if (screen === "recipes") renderRecipes();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Recipe cards also appear on the Overview, but the detail panel lives on the Recipes screen.
function openRecipe(id) {
  if (!byId("recipes").classList.contains("active")) navigate("recipes");
  showRecipe(id);
}

function closeRecipe() {
  byId("recipe-detail").innerHTML = "";
}

function removeFood(id) {
  foods = foods.filter((f) => f.id !== id);
  renderAll();
}

function addFood(event) {
  event.preventDefault();
  const category = byId("product-category").value;
  foods.push({
    id: Date.now(),
    name: byId("product-name").value.trim(),
    category,
    emoji: emojiFor(category),
    days: Number(byId("product-days").value),
    quantity: byId("product-quantity").value || "Not specified",
    state: byId("product-state").value,
  });
  event.target.reset();
  byId("product-days").value = 5;
  byId("product-date").value = today(); // reset() empties the date field, so fill it again
  renderAll();
  navigate("fridge");
}

/* ---------- Events ---------- */

// A single click listener handles every button that carries a data-* action.
document.addEventListener("click", (event) => {
  const el = event.target.closest("[data-screen], [data-recipe], [data-remove], [data-close-recipe]");
  if (!el) return;
  if (el.dataset.screen) navigate(el.dataset.screen);
  else if (el.dataset.recipe) openRecipe(Number(el.dataset.recipe));
  else if (el.dataset.remove) removeFood(Number(el.dataset.remove));
  else if (el.hasAttribute("data-close-recipe")) closeRecipe();
});

byId("food-search").addEventListener("input", renderInventory);
byId("food-filter").addEventListener("change", renderInventory);
byId("recipe-filter").addEventListener("change", renderRecipes);
byId("add-form").addEventListener("submit", addFood);

/* ---------- Start ---------- */

byId("product-date").value = today();
renderAll();
