import { fetchMenuData, createMenuData, deleteMenuData, updateMenuData } from './menuData.js';
import { renderMenu } from './menuRender.js';

const menuListContainer = document.getElementById('menuList');
const addMenuBtn = document.getElementById('addMenuBtn');

async function init() {
  const menuData = await fetchMenuData();
  renderMenu(menuListContainer, menuData);
}

if (addMenuBtn) {
  addMenuBtn.addEventListener('click', async () => {
    const newMenuName = prompt('추가할 메뉴 이름을 입력하세요:');
    if (!newMenuName || newMenuName.trim() === '') return;

    const newMenuPrice = prompt('추가할 메뉴의 가격을 입력하세요 (숫자만):');
    if (!newMenuPrice || newMenuPrice.trim() === '') return;

    const newMenuCategory = prompt('메뉴의 카테고리를 입력하세요 (예: coffee, food, drink):');
    if (!newMenuCategory || newMenuCategory.trim() === '') return;

    const parsedPrice = parseInt(newMenuPrice, 10);

    const success = await createMenuData(newMenuName, parsedPrice, newMenuCategory);
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

      const editName = prompt('변경할 메뉴 이름을 입력하세요:');
      if (!editName || editName.trim() === '') return;

      const editPrice = prompt('변경할 메뉴의 가격을 입력하세요 (숫자만):');
      if (!editPrice || editPrice.trim() === '') return;

      const editCategory = prompt('변경할 메뉴의 카테고리를 입력하세요:');
      if (!editCategory || editCategory.trim() === '') return;

      const parsedPrice = parseInt(editPrice, 10);

      const success = await updateMenuData(menuId, editName, parsedPrice, editCategory);
      if (success) {
        init();
      }
    }
  });
}

init();
