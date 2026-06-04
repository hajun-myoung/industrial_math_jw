import { fetchMenuData, createMenuData, deleteMenuData, updateMenuData } from './menuData.js';
import { renderMenu } from './menuRender.js';

const menuListContainer = document.getElementById('menuList');
const addMenuBtn = document.getElementById('addMenuBtn');

const menuModal = document.getElementById('menuModal');
const modalTitle = document.getElementById('modalTitle');
const modalMenuName = document.getElementById('modalMenuName');
const modalMenuPrice = document.getElementById('modalMenuPrice');
const modalMenuCategory = document.getElementById('modalMenuCategory');
const modalSubmitBtn = document.getElementById('modalSubmitBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');

let currentMenuList = [];

function openMenuModal(title, defaultData = { name: '', price: '', category: '' }) {
  return new Promise((resolve) => {
    modalTitle.textContent = title;
    modalMenuName.value = defaultData.name;
    modalMenuPrice.value = defaultData.price;
    modalMenuCategory.value = defaultData.category;
    menuModal.style.display = 'flex';

    modalSubmitBtn.onclick = () => {
      const name = modalMenuName.value.trim();
      const price = modalMenuPrice.value.trim();
      const category = modalMenuCategory.value.trim();

      if (!name || !price || !category) {
        alert('모든 항목을 올바르게 입력해주세요!');
        return;
      }

      menuModal.style.display = 'none';
      resolve({ name, price, category });
    };

    modalCancelBtn.onclick = () => {
      menuModal.style.display = 'none';
      resolve(null);
    };
  });
}

async function init() {
  const menuData = await fetchMenuData();
  currentMenuList = menuData;
  renderMenu(menuListContainer, menuData);
}

if (addMenuBtn) {
  addMenuBtn.addEventListener('click', async () => {
    const inputData = await openMenuModal('새 메뉴 추가');
    if (!inputData) return;

    const parsedPrice = parseInt(inputData.price, 10);

    const success = await createMenuData(inputData.name, parsedPrice, inputData.category);
    if (success) {
      init();
    }
  });
}

if (menuListContainer) {
  menuListContainer.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-btn')) {
      const menuId = event.target.getAttribute('data-id');
      if (confirm('정말로 이 메뉴를 삭제하시겠습니까?')) {
        const success = await deleteMenuData(menuId);
        if (success) init();
      }
    }

    if (event.target.classList.contains('edit-btn')) {
      const menuId = event.target.getAttribute('data-id');

      const targetMenu = currentMenuList.find((item) => String(item.id) === String(menuId));

      const inputData = await openMenuModal('메뉴 정보 수정', {
        name: targetMenu ? targetMenu.name : '',
        price: targetMenu ? targetMenu.price : '',
        category: targetMenu ? targetMenu.category : '',
      });

      if (!inputData) return;

      const parsedPrice = parseInt(inputData.price, 10);

      const success = await updateMenuData(menuId, inputData.name, parsedPrice, inputData.category);
      if (success) {
        init();
      }
    }
  });
}

init();
