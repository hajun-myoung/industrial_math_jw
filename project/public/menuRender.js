export function renderMenu(container, data) {
  container.innerHTML = '';

  data.forEach((item) => {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item-admin';

    menuItem.innerHTML = `
            <span class="menu-name">${item.name}</span>
            <div class="button-group">
                <button class="edit-btn" data-id="${item.id}">수정</button>
                <button class="delete-btn" data-id="${item.id}">삭제</button>
            </div>
        `;

    container.appendChild(menuItem);
  });
}
