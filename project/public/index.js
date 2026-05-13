console.log('index.js');

const getAllMenus = async () => {
  const resp = await fetch(`/api/menus`);
  const menus = await resp.json();
  return menus;
};

//getAllMenus();

document.addEventListener('DOMContentLoaded', async (e) => {
  const menuList = document.getElementById('menuList');
  const response = await fetch('/api/menus');
  const menus = await response.json();
  console.log('가져온 메뉴 목록:', menus);
  menus.forEach((menu) => {
    const menuElm = document.createElement('div');
    menuElm.className = 'menu-item';
    menuElm.innerHTML = `
                <div><i class="fa-solid fa-mug-hot"></i>메뉴이름: ${menu.name}</div>
                <div>메뉴가격: ${menu.price}</div>
            `;
    menuList.appendChild(menuElm);
  });
});
// DOMContentLoaded는 Load와 다름. Load는 이미지, css등의 모든 파일이 모두 로드 완료 후에 실행될 작업에 대해서 얘기하는 것
// DOMContentLoaded는 일단 글자(뼈대)가 다 로드되면 바로 다음 실행
