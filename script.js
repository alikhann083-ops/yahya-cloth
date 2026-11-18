// YAHYA Clothing - product data
const products = [
  {id:1,name:"Essential White Tee",category:"T-Shirts",price:1890,tag:"BESTSELLER",image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85"},
  {id:2,name:"Everyday Hoodie",category:"Hoodies",price:4290,tag:"NEW",image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85"},
  {id:3,name:"Relaxed Fit Shirt",category:"Shirts",price:3290,tag:"",image:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85"},
  {id:4,name:"Classic Black Tee",category:"T-Shirts",price:1990,tag:"",image:"https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=85"},
  {id:5,name:"Streetwear Sweatshirt",category:"Hoodies",price:3890,tag:"POPULAR",image:"https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=900&q=85"},
  {id:6,name:"Linen Casual Shirt",category:"Shirts",price:3590,tag:"",image:"https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=85"}
];

const money = amount => `Rs. ${amount.toLocaleString("en-PK")}`;
let cart = [];
let activeCategory = "All";

const productGrid = document.getElementById("productGrid");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const emptyCart = document.getElementById("emptyCart");
const cartBottom = document.getElementById("cartBottom");
const toast = document.getElementById("toast");

function renderProducts() {
  const visible = activeCategory === "All"
    ? products
    : products.filter(product => product.category === activeCategory);

  productGrid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
        <button class="quick-add" data-add="${product.id}">＋ ADD TO BAG</button>
      </div>
      <div class="product-info">
        <div><h3>${product.name}</h3><p>${product.category}</p></div>
        <strong>${money(product.price)}</strong>
      </div>
    </article>
  `).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({...product, quantity:1});
  updateCart();
  showToast(`${product.name} added to your bag`);
}

function updateCart() {
  const count = cart.reduce((sum,item) => sum + item.quantity, 0);
  const total = cart.reduce((sum,item) => sum + item.price * item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("drawerCount").textContent = count;

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <strong>${money(item.price)}</strong>
        <div class="quantity">
          <button data-qty="${item.id}" data-change="-1" aria-label="Decrease">−</button>
          <span>${item.quantity}</span>
          <button data-qty="${item.id}" data-change="1" aria-label="Increase">＋</button>
          <button class="remove" data-remove="${item.id}">Remove</button>
        </div>
      </div>
    </div>
  `).join("");

  document.getElementById("cartTotal").textContent = money(total);
  emptyCart.classList.toggle("hidden", cart.length > 0);
  cartBottom.classList.toggle("hidden", cart.length === 0);
}

function openCart() {
  cartOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  cartOverlay.classList.add("hidden");
  document.body.style.overflow = "";
}

// Product category filters
document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item === button));
  renderProducts();
});

// Add products to bag
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

// Cart quantity and remove controls
cartItems.addEventListener("click", event => {
  const qtyButton = event.target.closest("[data-qty]");
  const removeButton = event.target.closest("[data-remove]");
  if (qtyButton) {
    const item = cart.find(product => product.id === Number(qtyButton.dataset.qty));
    if (item) item.quantity += Number(qtyButton.dataset.change);
    cart = cart.filter(product => product.quantity > 0);
    updateCart();
  }
  if (removeButton) {
    cart = cart.filter(product => product.id !== Number(removeButton.dataset.remove));
    updateCart();
  }
});

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", event => { if (event.target === cartOverlay) closeCart(); });
document.getElementById("exploreShop").addEventListener("click", () => {
  closeCart();
  document.getElementById("shop").scrollIntoView({behavior:"smooth"});
});

// WhatsApp checkout: replace this with your own WhatsApp number.
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) return;
  const whatsappNumber = "923062639984"; // Country code + number, no plus sign or spaces.
  const orderLines = cart.map((item,index) =>
    `${index + 1}. ${item.name}\nQuantity: ${item.quantity}\nPrice: ${money(item.price * item.quantity)}`
  ).join("\n\n");
  const total = cart.reduce((sum,item) => sum + item.price * item.quantity, 0);
  const message = `New Order - YAHYA Clothing\n\n${orderLines}\n\nTotal: ${money(total)}\n\nPlease confirm my order.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

document.getElementById("menuBtn").addEventListener("click", () => {
  document.getElementById("nav").classList.toggle("open");
});
document.querySelectorAll(".nav a").forEach(link => link.addEventListener("click", () => {
  document.getElementById("nav").classList.remove("open");
}));

renderProducts();
updateCart();