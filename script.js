/* Velvet Bean Café – script.js */

// ---------- Data (FR-04): menu generated from an array ----------
const menu = [
  { id: 1, name: "Espresso", cat: "Coffee", price: 120, emoji: "☕", desc: "Rich, bold single shot." },
  { id: 2, name: "Caramel Latte", cat: "Coffee", price: 180, emoji: "🥛", desc: "Silky milk with caramel drizzle." },
  { id: 3, name: "Cold Brew", cat: "Coffee", price: 200, emoji: "🧊", desc: "Steeped 18 hours, served over ice." },
  { id: 4, name: "Cappuccino", cat: "Coffee", price: 160, emoji: "☕", desc: "Equal parts espresso, milk and foam." },
  { id: 5, name: "Veg Sandwich", cat: "Snacks", price: 150, emoji: "🥪", desc: "Grilled with herbs and cheese." },
  { id: 6, name: "Butter Croissant", cat: "Snacks", price: 110, emoji: "🥐", desc: "Flaky and baked every morning." },
  { id: 7, name: "Garlic Bread", cat: "Snacks", price: 130, emoji: "🍞", desc: "Toasted with butter and parsley." },
  { id: 8, name: "Peri Peri Fries", cat: "Snacks", price: 140, emoji: "🍟", desc: "Crisp fries with a spicy kick." },
  { id: 9, name: "Choco Lava Cake", cat: "Desserts", price: 190, emoji: "🍫", desc: "Warm centre, served with cream." },
  { id: 10, name: "Blueberry Cheesecake", cat: "Desserts", price: 220, emoji: "🍰", desc: "Creamy slice with fresh berries." },
  { id: 11, name: "Tiramisu", cat: "Desserts", price: 210, emoji: "🍮", desc: "Coffee-soaked layers of mascarpone." },
  { id: 12, name: "Glazed Donut", cat: "Desserts", price: 90, emoji: "🍩", desc: "Soft, sweet and freshly glazed." }
];

const gallery = [
  "photo-1495474472287-4d71bcdd2085", "photo-1554118811-1e0d58224f24", "photo-1578985545062-69928b1d9587",
  "photo-1501339847302-ac426a4a7cbb", "photo-1509042239860-f550ce710b93", "photo-1546069901-ba9599a7e63c"
];

let cart = {};          // { id: qty }
let activeCat = "All";
const $ = (s) => document.querySelector(s);
const money = (n) => "₹" + n;

// ---------- Toast helper (FR-12) ----------
function showToast(msg, type = "success") {
  const box = $("#toastBox");
  box.className = `toast align-items-center border-0 text-bg-${type}`;
  $("#toastMsg").textContent = msg;
  bootstrap.Toast.getOrCreateInstance(box, { delay: 3000 }).show();
}

// ---------- Menu render + filter (FR-04, FR-05) ----------
function renderMenu() {
  const items = menu.filter((m) => activeCat === "All" || m.cat === activeCat);
  $("#menuGrid").innerHTML = items.map((m) => `
    <div class="col-12 col-sm-6 col-lg-3 dish-in">
      <div class="card dish">
        <div class="dish-top" aria-hidden="true">${m.emoji}</div>
        <div class="card-body d-flex flex-column">
          <span class="tag">${m.cat}</span>
          <h5 class="card-title mb-1">${m.name}</h5>
          <p class="small mb-3">${m.desc}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <span class="price">${money(m.price)}</span>
            <button class="btn btn-caramel btn-sm" data-add="${m.id}">Add to cart</button>
          </div>
        </div>
      </div>
    </div>`).join("");
}

$("#filters").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-cat]");
  if (!btn) return;
  activeCat = btn.dataset.cat;
  document.querySelectorAll(".btn-filter").forEach((b) => b.classList.toggle("active", b === btn));
  renderMenu();
});

$("#menuGrid").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add]");
  if (!btn) return;
  const id = btn.dataset.add;
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  showToast(`${menu.find((m) => m.id == id).name} added to cart`);
});

// ---------- Cart (FR-06, FR-07, FR-08) ----------
function renderCart() {
  const ids = Object.keys(cart);
  let total = 0, count = 0;
  $("#cartItems").innerHTML = ids.length
    ? ids.map((id) => {
        const m = menu.find((x) => x.id == id);
        total += m.price * cart[id];
        count += cart[id];
        return `<div class="cart-row">
          <span class="fs-4">${m.emoji}</span>
          <div class="flex-grow-1"><div>${m.name}</div><small>${money(m.price)} each</small></div>
          <div class="qty d-flex align-items-center gap-2">
            <button class="btn btn-outline-secondary" data-dec="${id}" aria-label="Decrease">−</button>
            <span>${cart[id]}</span>
            <button class="btn btn-outline-secondary" data-inc="${id}" aria-label="Increase">+</button>
          </div>
          <button class="btn btn-sm text-danger" data-del="${id}" aria-label="Remove"><i class="bi bi-trash"></i></button>
        </div>`;
      }).join("")
    : `<p class="text-center mt-4">Your cart is empty. Add something from the menu.</p>`;
  $("#cartTotal").textContent = money(total);
  $("#cartCount").textContent = count;
  $("#checkoutBtn").disabled = !ids.length;
}

$("#cartItems").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  const { inc, dec, del } = b.dataset;
  if (inc) cart[inc]++;
  if (dec && --cart[dec] <= 0) delete cart[dec];
  if (del) delete cart[del];
  renderCart();
});

$("#checkoutBtn").addEventListener("click", () => {
  cart = {};
  renderCart();
  bootstrap.Offcanvas.getInstance($("#cartPanel")).hide();
  showToast("Order placed. Your coffee is on its way!");
});

// ---------- Gallery + modal (FR-09) ----------
$("#galleryGrid").innerHTML = gallery.map((id, i) => `
  <div class="col-6 col-md-4">
    <img class="g-img" loading="lazy" src="https://images.unsplash.com/${id}?w=600&q=70"
         data-full="https://images.unsplash.com/${id}?w=1200&q=80" alt="Velvet Bean photo ${i + 1}">
  </div>`).join("");

$("#galleryGrid").addEventListener("click", (e) => {
  const img = e.target.closest(".g-img");
  if (!img) return;
  $("#modalImg").src = img.dataset.full;
  $("#modalImg").alt = img.alt;
  new bootstrap.Modal($("#imgModal")).show();
});

// ---------- Booking validation (FR-10, FR-11) ----------
const today = new Date().toISOString().split("T")[0];
$("#bDate").min = today;

function setValid(input, ok) {
  input.classList.toggle("is-invalid", !ok);
  input.classList.toggle("is-valid", ok);
  return ok;
}

$("#bookForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const guests = Number($("#bGuests").value);
  const results = [
    setValid($("#bName"), $("#bName").value.trim().length >= 2),
    setValid($("#bPhone"), /^\d{10}$/.test($("#bPhone").value.trim())),
    setValid($("#bDate"), $("#bDate").value !== "" && $("#bDate").value >= today),
    setValid($("#bTime"), $("#bTime").value !== ""),
    setValid($("#bGuests"), Number.isInteger(guests) && guests >= 1 && guests <= 10)
  ];
  if (results.every(Boolean)) {
    showToast(`Table booked for ${guests} on ${$("#bDate").value} at ${$("#bTime").value}. See you soon, ${$("#bName").value.trim()}!`);
    e.target.reset();
    e.target.querySelectorAll(".is-valid").forEach((i) => i.classList.remove("is-valid"));
  } else {
    showToast("Please fix the highlighted fields.", "danger");
  }
});

// ---------- Dark mode (FR-13) ----------
$("#themeBtn").addEventListener("click", () => {
  const html = document.documentElement;
  const dark = html.dataset.bsTheme !== "dark";
  html.dataset.bsTheme = dark ? "dark" : "light";
  $("#themeBtn").innerHTML = `<i class="bi bi-${dark ? "sun" : "moon-stars"}"></i>`;
});

// ---------- Scroll effects (FR-14) ----------
window.addEventListener("scroll", () => {
  $("#mainNav").classList.toggle("scrolled", window.scrollY > 60);
  $("#toTop").style.display = window.scrollY > 400 ? "block" : "none";
});
$("#toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ---------- Init ----------
renderMenu();
renderCart();
