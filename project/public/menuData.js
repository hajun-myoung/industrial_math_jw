export async function fetchMenuData() {
  const response = await fetch('http://localhost:3000/api/menus');
  const data = await response.json();
  return data;
}

export async function createMenuData(menuName, menuPrice, menuCategory) {
  const response = await fetch('http://localhost:3000/api/menus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: menuName,
      price: menuPrice,
      category: menuCategory,
    }),
  });
  return response.ok;
}

export async function deleteMenuData(id) {
  const response = await fetch(`http://localhost:3000/api/menus/${id}`, {
    method: 'DELETE',
  });
  return response.ok;
}
export async function updateMenuData(id, menuName, menuPrice, menuCategory) {
  const response = await fetch(`http://localhost:3000/api/menus/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: menuName,
      price: menuPrice,
      category: menuCategory,
    }),
  });
  return response.ok;
}
