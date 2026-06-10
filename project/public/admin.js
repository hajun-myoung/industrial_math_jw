import { fetchMenuData, createMenuData, deleteMenuData, updateMenuData } from './menuData.js';
// 메뉴 조회, 생성, 삭제, 수정 API 함수를 가져온다
import { renderMenu } from './menuRender.js'; // 메뉴 목록을 화면에 그리는 렌더링 함수를 가져온다

const menuListContainer = document.getElementById('menuList'); // 메뉴 목록이 표시될 영역을 가져온다
const addMenuBtn = document.getElementById('addMenuBtn'); // 새 메뉴 추가 버튼 요소를 가져온다

const menuModal = document.getElementById('menuModal'); // 메뉴 추가/수정에 사용할 모달 요소를 가져온다
const modalTitle = document.getElementById('modalTitle'); // 모달 제목 요소를 가져온다
const modalMenuName = document.getElementById('modalMenuName'); // 메뉴 이름 입력칸을 가져온다
const modalMenuPrice = document.getElementById('modalMenuPrice'); // 메뉴 가격 입력칸을 가져온다
const modalMenuCategory = document.getElementById('modalMenuCategory'); // 메뉴 카테고리 입력칸을 가져온다
const modalSubmitBtn = document.getElementById('modalSubmitBtn'); // 모달 확인 버튼을 가져온다
const modalCancelBtn = document.getElementById('modalCancelBtn'); // 모달 취소 버튼을 가져온다

let currentMenuList = []; // 서버에서 받아온 현재 메뉴 목록을 저장한다

function openMenuModal(title, defaultData = { name: '', price: '', category: '' }) {
  // 메뉴 입력 모달을 열고 사용자의 입력 결과를 반환하는 함수이다
  return new Promise((resolve) => {
    // 사용자의 데이터 입력, 확인, 취소를 기다리려고 Promise로 구현함
    // 버튼 클릭이 끝날 때까지 기다릴 수 있도록 Promise를 반환한다
    modalTitle.textContent = title; // 전달받은 제목을 모달 제목에 넣는다
    modalMenuName.value = defaultData.name; // 기본 메뉴 이름을 입력칸에 넣는다
    modalMenuPrice.value = defaultData.price; // 기본 메뉴 가격을 입력칸에 넣는다
    modalMenuCategory.value = defaultData.category; // 기본 메뉴 카테고리를 입력칸에 넣는다
    menuModal.style.display = 'flex'; // 모달을 화면에 표시한다

    modalSubmitBtn.onclick = () => {
      // 확인 버튼을 눌렀을 때 실행할 함수를 지정한다
      const name = modalMenuName.value.trim(); // 입력된 메뉴 이름의 앞뒤 공백을 제거해서 가져온다
      const price = modalMenuPrice.value.trim(); // 입력된 메뉴 가격의 앞뒤 공백을 제거해서 가져온다
      const category = modalMenuCategory.value.trim(); // 입력된 메뉴 카테고리의 앞뒤 공백을 제거해서 가져온다

      if (!name || !price || !category) {
        // 비어있는 애가 Falsy -> !에 의해서 true -> || or 연산에 의해서 전체가 true
        // 여기에 들어왔다: 셋 중 적어도 하나가 비어있다
        // 이름, 가격, 카테고리 중 하나라도 비어 있는지 확인한다
        alert('모든 항목을 올바르게 입력해주세요!'); // 필수 입력값이 비어 있다는 안내 메시지를 보여 준다
        return; // 값이 부족하면 모달을 닫지 않고 처리를 중단한다
      }

      menuModal.style.display = 'none'; // 입력값이 모두 있으면 모달을 숨긴다
      resolve({ name, price, category }); // 입력된 메뉴 정보를 Promise 결과로 반환한다
      // resolve함수는 promise의 return과도 같음
    };

    modalCancelBtn.onclick = () => {
      // 취소 버튼을 눌렀을 때 실행할 함수를 지정한다
      menuModal.style.display = 'none'; // 취소하면 모달을 숨긴다
      resolve(null); // 취소했다는 의미로 null을 Promise 결과로 반환한다
    };
  });
}

async function init() {
  // 관리자 화면의 메뉴 데이터를 다시 불러오고 화면을 갱신하는 초기화 함수이다
  const menuData = await fetchMenuData(); // 서버에서 메뉴 데이터를 가져온다
  currentMenuList = menuData; // 가져온 메뉴 데이터를 현재 메뉴 목록 변수에 저장한다
  renderMenu(menuListContainer, menuData); // 메뉴 목록 영역에 메뉴 데이터를 렌더링한다
}

if (addMenuBtn) {
  // 새 메뉴 추가 버튼이 존재하는지 확인한다
  // 없으면 안되니까 안전장치로
  addMenuBtn.addEventListener('click', async () => {
    // 새 메뉴 추가 버튼 클릭 이벤트를 감지한다
    const inputData = await openMenuModal('새 메뉴 추가'); // 새 메뉴 추가용 모달을 열고 입력값을 기다린다
    // inputData 안에 resolve된 {name, price, category} 가 담기거나
    // 그냥 return 되었으면 비어있거나

    // openMenuModal이 함수기 때문에, 값 입력과 확인/취소를 기다려야 하고, 따라서 Promise + await를 씀
    if (!inputData) return; // 사용자가 취소했다면 메뉴 추가를 중단한다
    // 비어있으면 여기서 return

    const parsedPrice = parseInt(inputData.price, 10); // 입력된 가격 문자열을 10진수 숫자로 변환한다

    const success = await createMenuData(inputData.name, parsedPrice, inputData.category); // 서버에 새 메뉴 생성을 요청한다
    if (success) {
      // 메뉴 생성이 성공했는지 확인한다
      init(); // 성공하면 최신 메뉴 목록을 다시 불러와 화면을 갱신한다
    }
  });
}

if (menuListContainer) {
  // 메뉴 목록 영역이 존재하는지 확인한다
  menuListContainer.addEventListener('click', async (event) => {
    // 메뉴 목록 안에서 발생한 클릭 이벤트를 감지한다
    if (event.target.classList.contains('delete-btn')) {
      // 클릭한 요소가 삭제 버튼인지 확인한다
      const menuId = event.target.getAttribute('data-id'); // 삭제할 메뉴의 id를 버튼에서 읽어 온다
      /**
       * menuRender.js에 보면 <button class="edit-btn" data-id="${item.id}">수정</button>
       * data-id에 각 메뉴별 id를 넣어줬음
       * 이걸 읽어와서 "누구에 대한 삭제 버튼인지"를 특정
       *
       * 교수님이 보여주신 코드는 menuRender를 하면서 삭제버튼이 해당 메뉴를 삭제하도록 기능 구현
       * 이 코드는 전체 렌더링이 끝난 후 삭제 버튼이 누구에 대한 것인지 특정
       */

      if (confirm('정말로 이 메뉴를 삭제하시겠습니까?')) {
        // 삭제 전에 사용자에게 확인 창을 보여 준다
        const success = await deleteMenuData(menuId); // 서버에 해당 메뉴 삭제를 요청한다
        if (success) init(); // 삭제가 성공하면 최신 메뉴 목록을 다시 불러와 화면을 갱신한다
      }
    }

    if (event.target.classList.contains('edit-btn')) {
      // 클릭한 요소가 수정 버튼인지 확인한다
      const menuId = event.target.getAttribute('data-id'); // 수정할 메뉴의 id를 버튼에서 읽어 온다

      const targetMenu = currentMenuList.find((item) => String(item.id) === String(menuId)); // 현재 메뉴 목록에서 수정할 메뉴 데이터를 찾는다
      // 기존에 있는걸 수정하는거니까 menuId 바탕으로 find 메서드 호출
      // 찾아서 그 값으로 기본 내용을 채워줌
      const inputData = await openMenuModal('메뉴 정보 수정', {
        // 수정용 모달을 열고 기존 메뉴 정보를 기본값으로 넣는다
        name: targetMenu ? targetMenu.name : '', // 기존 메뉴가 있으면 이름을 넣고 없으면 빈 문자열을 넣는다
        price: targetMenu ? targetMenu.price : '', // 기존 메뉴가 있으면 가격을 넣고 없으면 빈 문자열을 넣는다
        category: targetMenu ? targetMenu.category : '', // 기존 메뉴가 있으면 카테고리를 넣고 없으면 빈 문자열을 넣는다
      });

      if (!inputData) return; // 사용자가 취소했다면 메뉴 수정을 중단한다

      const parsedPrice = parseInt(inputData.price, 10); // 입력된 가격 문자열을 10진수 숫자로 변환한다

      const success = await updateMenuData(menuId, inputData.name, parsedPrice, inputData.category); // 서버에 메뉴 정보 수정을 요청한다
      if (success) {
        // 메뉴 수정이 성공했는지 확인한다
        init(); // 성공하면 최신 메뉴 목록을 다시 불러와 화면을 갱신한다
      }
    }
  });
}

init(); // 페이지가 열리면 관리자 메뉴 목록을 처음으로 불러온다
