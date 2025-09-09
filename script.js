let allTrees = [];
let cart = [];
let currentTreeInModal = null;
let activeCategoryId = null;
const cardContainer = document.getElementById('card_container');
const allCategoriesBtn = document.getElementById('allCategoriesBtn');
const allTreesBtn = document.getElementById('all_trees_btn');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const emptyCartMessage = document.getElementById('empty-cart-message');
const loadingSpinner = document.getElementById('loading-spinner');

// Show loading spinner
function showLoading() {
  loadingSpinner.classList.remove('hidden');
}

// Hide loading spinner
function hideLoading() {
  loadingSpinner.classList.add('hidden');
}

// Format price with ৳ sign
function formatPrice(price) {
  return `৳${price}`;
}

const loadAllTrees = () => {
  showLoading();
  setActiveCategory(null);
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((response) => response.json())
    .then((data) => {
      allTrees = data.plants;
      displayAllTrees(allTrees);
      hideLoading();
    });
};

const displayAllTrees = (trees) => {
  const cardContainer = document.getElementById("card_container");
  cardContainer.innerHTML = "";
  manageSpinnner(false);

  trees.forEach((tree) => {
    const containerDiv = document.createElement("div");
    containerDiv.innerHTML = `
     <div class="card bg-white p-3 h-full flex flex-col">
                <div class="w-full">
                    <img  class="w-full h-48 object-cover rounded-md"  src=${tree.image} alt="" />
                </div>
              <h2 onclick="displayModal(${tree.id})" class="font-bold my-2 cursor-pointer hover:text-[#15803D] text-lg">${tree.name}</h2>
              <p class="text-gray-500  line-clamp-3 flex-grow">
                 ${tree.description}
              </p>
              <div class="flex justify-between items-center mt-3">
                <h3 class="bg-[#DCFCE7] text-[#15803D] rounded-xl px-3">${tree.category}</h3>
                <p class="font-bold text-[#15803D]">${formatPrice(tree.price)}</p>
              </div>
              <button onclick="addToCart(${tree.id})" class="bg-[#15803D] border text-white rounded-2xl  px-4 py-2 mt-3 hover:bg-green-800 transition-colors">Add to Cart</button>
            </div>
    `;
    cardContainer.appendChild(containerDiv);
  });
};

const displayModal = async (id) => {
  const response = await fetch(
    `https://openapi.programming-hero.com/api/plant/${id}`
  );
  const result = await response.json();
  
  const modal_dynamic = document.getElementById("modal_dynamic");
  modal_dynamic.innerHTML = "";
  const newDiv = document.createElement("div");
  newDiv.innerHTML = `
        <div class="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 class="font-bold text-2xl text-[#15803D] mb-2">${result.plants.name}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <img class="w-full h-72 object-cover rounded-md" src="${result.plants.image}" alt="${result.plants.name}" />
            </div>
            <div class="flex flex-col justify-between">
              <div>
                <p class="text-gray-700 text-lg">${result.plants.description}</p>
                <div class="flex justify-between items-center mt-6">
                  <span class="bg-[#DCFCE7] text-[#15803D] rounded-xl px-4 py-2">${result.plants.category}</span>
                  <span class="font-bold text-2xl text-[#15803D]">${formatPrice(result.plants.price)}</span>
                </div>
              </div>
              <button onclick="addToCartFromModal(${result.plants.id})" class="bg-[#15803D] text-white rounded-2xl px-6 py-3 mt-6 w-full text-lg font-medium hover:bg-green-800 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
    `;
  modal_dynamic.appendChild(newDiv);
  
  // Store current tree for modal
  currentTreeInModal = result.plants;

  document.getElementById("my_modal_5").showModal();
};

const loadAllCategories = async () => {
  const response = await fetch(
    "https://openapi.programming-hero.com/api/categories"
  );
  const result = await response.json();
  displayAllCategories(result.categories);
};

const displayAllCategories = (items) => {
  const allCategoriesBtn = document.getElementById("allCategoriesBtn");
  allCategoriesBtn.innerHTML = "";
  items.forEach((item) => {
    const itemContainerDiv = document.createElement("div");
    itemContainerDiv.innerHTML = `
      <button onclick="getTreeByCategory(${item.id})" 
        class="w-full text-left p-2 rounded hover:bg-green-800 hover:text-white transition-all category-btn" 
        id="category-${item.id}">
        ${item.category_name}
      </button>
    `;
    allCategoriesBtn.appendChild(itemContainerDiv);
  });
};

const getTreeByCategory = async (id) => {
  showLoading();
  setActiveCategory(id);
  const response = await fetch(
    `https://openapi.programming-hero.com/api/category/${id}`
  );
  const result = await response.json();
  displayGetTreeByCategory(result.plants);
  hideLoading();
};

const displayGetTreeByCategory = (treeItems) => {
  const cardContainer = document.getElementById("card_container");
  cardContainer.innerHTML = "";
  manageSpinnner(false);
  treeItems.forEach((item) => {
    const eachCategoryDiv = document.createElement("div");
    eachCategoryDiv.innerHTML = `
     <div class="card bg-white p-3 h-full flex flex-col">
                <div class="w-full">
                    <img class="w-full h-48 object-cover rounded-md"  src=${item.image} alt="" />
                </div>
              <h2 onclick="displayModal(${item.id})" class="font-bold my-2 cursor-pointer hover:text-[#15803D] text-lg">${item.name}</h2>
              <p class="text-gray-500  line-clamp-3 flex-grow">
                 ${item.description}
              </p>
              <div class="flex justify-between items-center mt-3">
                <h3 class="bg-[#DCFCE7] text-[#15803D] rounded-xl px-3">${item.category}</h3>
                <p class="font-bold text-[#15803D]">${formatPrice(item.price)}</p>
              </div>
              <button onclick="addToCart(${item.id})" class="bg-[#15803D] border text-white rounded-2xl  px-4 py-2 mt-3 hover:bg-green-800 transition-colors">Add to Cart</button>
            </div>
    `;

    cardContainer.appendChild(eachCategoryDiv);
  });
};

const manageSpinnner = (status) => {
  if (status == true) {
    document.getElementById("spin_container").classList.remove("hidden");
    document.getElementById("card_container").classList.add("hidden");
  } else {
    document.getElementById("spin_container").classList.add("hidden");
    document.getElementById("card_container").classList.remove("hidden");
  }
};

// Set active category
function setActiveCategory(categoryId) {
  activeCategoryId = categoryId;
  
  // Remove active class from all buttons
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('bg-[#15803D]', 'text-white');
    btn.classList.add('hover:bg-green-800', 'hover:text-white');
  });
  
  // Set active class to All Trees button if no category is selected
  if (categoryId === null) {
    allTreesBtn.classList.add('bg-[#15803D]', 'text-white');
    allTreesBtn.classList.remove('hover:bg-green-800', 'hover:text-white');
    return;
  }
  
  // Set active class to the selected category button
  allTreesBtn.classList.remove('bg-[#15803D]', 'text-white');
  allTreesBtn.classList.add('hover:bg-green-800', 'hover:text-white');
  
  const activeBtn = document.getElementById(`category-${categoryId}`);
  if (activeBtn) {
    activeBtn.classList.add('bg-[#15803D]', 'text-white');
    activeBtn.classList.remove('hover:bg-green-800', 'hover:text-white');
  }
}

// Add to cart
function addToCart(treeId) {
  let tree;
  if (activeCategoryId) {
    // Find tree in the current category
    tree = allTrees.find(t => t.id == treeId);
  } else {
    // Find tree in all trees
    tree = allTrees.find(t => t.id == treeId);
  }
  
  if (!tree) return;
  
  // Check if tree is already in cart
  const existingItem = cart.find(item => item.id == tree.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: tree.id,
      name: tree.name,
      price: tree.price,
      quantity: 1,
      image: tree.image
    });
  }
  
  updateCart();
}

// Add to cart from modal
function addToCartFromModal(treeId) {
  addToCart(treeId);
  document.getElementById("my_modal_5").close();
}

// Remove from cart
function removeFromCart(treeId) {
  cart = cart.filter(item => item.id != treeId);
  updateCart();
}

// Update cart display
function updateCart() {
  cartItems.innerHTML = '';
  
  if (cart.length === 0) {
    emptyCartMessage.classList.remove('hidden');
    emptyCartMessage.textContent = 'Your cart is empty';
    cartTotal.textContent = formatPrice(0);
    return;
  }
  
  emptyCartMessage.classList.add('hidden');
  
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    const cartItemDiv = document.createElement('div');
    cartItemDiv.className = 'flex items-center mb-4 p-2 bg-green-50 rounded-lg';
    cartItemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-md mr-3">
      <div class="flex-grow">
        <p class="font-medium">${item.name}</p>
        <p class="text-sm text-gray-500">${formatPrice(item.price)} × ${item.quantity}</p>
      </div>
      <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700 ml-2">
        <i class="fas fa-times"></i>
      </button>
    `;
    cartItems.appendChild(cartItemDiv);
  });
  
  cartTotal.textContent = formatPrice(total);
}

function init() {
  showLoading();
  loadAllCategories();
  loadAllTrees();
  setActiveCategory(null);
  setTimeout(() => {
    hideLoading();
  }, 1000);
}
init();