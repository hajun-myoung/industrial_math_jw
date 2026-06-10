const adminLoginBtn = document.getElementById('adminLoginBtn');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const menuList = document.getElementById('menuList');
const orderList = document.getElementById('orderList');

const paymentModal = document.getElementById('paymentModal');
const finalCheckoutBtn = document.getElementById('finalCheckoutBtn');
const paymentCancelBtn = document.getElementById('paymentCancelBtn');

let menus = [];
let currentOrder = [];

const getAllMenus = async () => {
  const resp = await fetch(`/api/menus`);
  const menus = await resp.json();
  return menus;
};

document.addEventListener('DOMContentLoaded', async (e) => {
  menus = await getAllMenus();
  console.log('menus', menus);
  renderMenus();
  renderOrder();

  window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      loginModal.style.display = 'none';
    }
    if (e.target === paymentModal) {
      paymentModal.style.display = 'none';
    }
  });

  paymentCancelBtn.addEventListener('click', () => {
    paymentModal.style.display = 'none';
  });

  finalCheckoutBtn.addEventListener('click', () => {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    let methodName = '';

    if (selectedMethod === 'cash') methodName = '현금';
    else if (selectedMethod === 'card') methodName = '카드';
    else if (selectedMethod === 'kakao') methodName = '카카오페이';

    alert(`[${methodName}]으로 결제가 완료되었습니다!`);
    currentOrder = [];
    renderOrder();
    paymentModal.style.display = 'none';
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === 'admin' && password === 'admin') {
      loginModal.style.display = 'none';
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
      window.location.href = 'admin.html';
    } else {
      alert('사용자명 또는 비밀번호가 올바르지 않습니다.');
    }
  });

  adminLoginBtn.addEventListener('click', (e) => {
    loginModal.style.display = 'flex';
  });

  orderList.addEventListener('click', (e) => {
    const target = e.target;

    if (target.id === 'checkoutBtn') {
      if (currentOrder.length === 0) {
        alert('주문할 메뉴가 없습니다!');
        return;
      }
      paymentModal.style.display = 'flex';
      return;
    }

    if (target.id === 'clearCartBtn') {
      currentOrder = [];
      renderOrder();
      return;
    }

    if (target.closest('.delete-cart-btn')) {
      const deleteName = target.closest('.delete-cart-btn').getAttribute('data-name');
      currentOrder = currentOrder.filter((i) => i.name !== deleteName);
      renderOrder();
      return;
    }

    const menuName = target.getAttribute('data-name');
    if (!menuName) return;

    if (target.classList.contains('minus-btn')) {
      const item = currentOrder.find((i) => i.name === menuName);
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          currentOrder = currentOrder.filter((i) => i.name !== menuName);
        }
      }
      renderOrder();
    }

    if (target.classList.contains('plus-btn')) {
      const item = currentOrder.find((i) => i.name === menuName);
      if (item) {
        item.quantity += 1;
      }
      renderOrder();
    }
  });
});

function renderMenus() {
  menuList.innerHTML = '';
  menus.forEach((menu) => {
    const menuElm = document.createElement('div');
    menuElm.className = 'menu-card-item';

    let menuImgSrc = 'https://placehold.co/100x100?text=Coffee';

    if (menu.name.includes('아메리카노')) {
      menuImgSrc =
        'https://image.istarbucks.co.kr/upload/store/skuimg/2025/06/[110563]_20250626094353711.jpg';
    } else if (menu.name.includes('딸기라떼')) {
      menuImgSrc =
        'https://image.istarbucks.co.kr/upload/store/skuimg/2023/11/[9200000004951]_20231102101647442.jpg';
    } else if (menu.name.includes('초코라떼')) {
      menuImgSrc =
        'https://image.istarbucks.co.kr/upload/store/skuimg/2025/06/[110621]_20250626113323062.jpg';
    } else if (menu.name.includes('딸기스무디')) {
      menuImgSrc =
        'https://image.istarbucks.co.kr/upload/store/skuimg/2025/07/[9200000003276]_20250721084027663.jpg';
    } else if (menu.name.includes('카페라떼')) {
      menuImgSrc =
        'https://image.istarbucks.co.kr/upload/store/skuimg/2025/06/[110569]_20250626094801903.jpg';
    } else if (menu.name.includes('녹차') || menu.name.includes('말차')) {
      menuImgSrc =
        'https://image.istarbucks.co.kr/upload/store/skuimg/2021/04/[400400000091]_20210415132229904.jpg';
    }

    menuElm.innerHTML = `
      <img src="${menuImgSrc}" alt="${menu.name}" class="menu-item-img" onerror="this.src='https://placehold.co/100x100?text=No+Image'">
      <div class="menu-info-wrapper">
        <div class="menu-name">${menu.name}</div>
        <div class="menu-price">₩${menu.price.toLocaleString()}</div>
      </div>
    `;
    menuElm.addEventListener('click', (e) => {
      addToOrder(menu);
    });
    menuList.appendChild(menuElm);
  });
}
function addToOrder(menu) {
  const existingItem = currentOrder.find((item) => item.name === menu.name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    currentOrder.push({ ...menu, quantity: 1 });
  }
  console.log('currentOrder', currentOrder);
  renderOrder();
}

function renderOrder() {
  let totalQuantity = 0;
  let totalAmount = 0;

  let html = `<h2>🛒 주문 내역</h2>`;
  html += '<div class="cart-items-wrapper">';

  currentOrder.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalQuantity += item.quantity;
    totalAmount += itemTotal;

    html += `
      <div class="cart-item">
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₩${item.price.toLocaleString()}</div>
        </div>
        <div class="cart-item-controls">
          <button class="minus-btn" data-name="${item.name}">-</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="plus-btn" data-name="${item.name}">+</button>
          <button class="delete-cart-btn" data-name="${item.name}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `;
  });

  html += '</div>';

  html += `
    <div class="cart-summary">
      <div class="summary-row">
        <span>총 수량:</span>
        <span>${totalQuantity} 개</span>
      </div>
      <div class="summary-row total-amount-row">
        <span>총 금액:</span>
        <span>₩${totalAmount.toLocaleString()}</span>
      </div>
    </div>
    <div class="cart-actions">
      <button id="clearCartBtn" class="action-btn clear-btn" data-name="clear">초기화</button>
      <button id="checkoutBtn" class="action-btn checkout-btn" data-name="checkout">주문하기</button>
    </div>
  `;

  orderList.innerHTML = html;
}
