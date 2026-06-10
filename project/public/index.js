const adminLoginBtn = document.getElementById('adminLoginBtn'); // 관리자 로그인 버튼 요소를 가져온다
const loginModal = document.getElementById('loginModal'); // 로그인 모달 요소를 가져온다
const loginForm = document.getElementById('loginForm'); // 로그인 폼 요소를 가져온다
const menuList = document.getElementById('menuList'); // 메뉴 목록이 표시될 영역을 가져온다
const orderList = document.getElementById('orderList'); // 주문 내역이 표시될 영역을 가져온다

// 요소: HTML Element를 직역한 말. HTML 태그 -> DOM에 만들어진 Node를 의미한다

const paymentModal = document.getElementById('paymentModal'); // 결제 방법을 선택하는 모달 요소를 가져온다
const finalCheckoutBtn = document.getElementById('finalCheckoutBtn'); // 결제를 최종 완료하는 버튼 요소를 가져온다
const paymentCancelBtn = document.getElementById('paymentCancelBtn'); // 결제 모달을 닫는 취소 버튼 요소를 가져온다

let menus = []; // 메뉴를 저장하기 위한 빈 배열을 만든다
let currentOrder = []; // 주문 내역을 저장하기 위한 빈 배열을 만든다

const getAllMenus = async () => {
  // 서버에서 전체 메뉴 목록을 가져오는 비동기 함수이다
  // async는 await를 쓰기위한 문법적인 요구사항
  const resp = await fetch(`/api/menus`); // 메뉴 API에 요청을 보낸다
  // await가 걸려있으니까 함수의 실행 완료를 기다림
  // fetch는 HTTP 요청을 날리는 함수(브루노에서 Send 하는거랑 같음)

  // const resp = await fetch(`/api/menus`, {
  //   method: 'GET',
  //   header: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: {},
  // });

  // 원본은 이거임 근데 기본값이라 생략 와 이 말투는 AI일 수가 없다;

  const menus = await resp.json(); // 응답 데이터를 JSON 형태로 변환한다
  // 사실은 변환..이라기보다... Object로 응답 데이터를 불러오는 함수? 정도의 설명이 맞음
  return menus; // 변환된 메뉴 목록을 반환한다
};

document.addEventListener('DOMContentLoaded', async (e) => {
  // HTML 문서 로딩이 끝난 뒤 초기화 코드를 실행한다
  // ^^^^^^^^^^^^^^^^^^^^ 가 DOMContentLoaded Event의 발생 조건

  // ⬇️ 이거가 초기화 코드
  // 초기화가 뭐에요? 는 내가 설정해야함
  menus = await getAllMenus(); // 서버에서 메뉴 목록을 받아 전역 변수에 저장한다
  console.log('menus', menus); // 받아온 메뉴 목록을 개발자 도구 콘솔에 출력한다
  renderMenus(); // 화면에 메뉴 목록을 렌더링한다
  renderOrder(); // 화면에 빈 주문 내역을 렌더링한다

  window.addEventListener('click', (e) => {
    // 브라우저 창 전체의 클릭 이벤트를 감지한다
    if (e.target === loginModal) {
      // 클릭한 대상이 로그인 모달 배경인지 확인한다
      loginModal.style.display = 'none'; // 모달 배경을 클릭하면 로그인 모달을 숨긴다
    }
    if (e.target === paymentModal) {
      // 클릭한 대상이 결제 모달 배경인지 확인한다
      paymentModal.style.display = 'none'; // 결제 모달 배경을 클릭하면 결제 모달을 숨긴다
    }
  });

  paymentCancelBtn.addEventListener('click', () => {
    // 결제 취소 버튼 클릭 이벤트를 감지한다
    paymentModal.style.display = 'none'; // 취소 버튼을 누르면 결제 모달을 숨긴다
  });

  finalCheckoutBtn.addEventListener('click', () => {
    // 최종 결제 버튼 클릭 이벤트를 감지한다
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value; // 선택된 결제 수단의 값을 읽어 온다
    // input[name="abcd"] name="abcd" 인 프로퍼티를 갖는 input 태그
    // 그 중에서도 :checked 선택된 애를 특정
    // 여기서의 value는 input 태그에 value 프로퍼티로 주어져 있음

    let methodName = ''; // 화면에 보여 줄 결제 수단 이름을 담을 변수를 만든다

    if (selectedMethod === 'cash')
      methodName = '현금'; // 선택값이 cash이면 결제 수단 이름을 현금으로 설정한다
    else if (selectedMethod === 'card')
      methodName = '카드'; // 선택값이 card이면 결제 수단 이름을 카드로 설정한다
    else if (selectedMethod === 'kakao') methodName = '카카오페이'; // 선택값이 kakao이면 결제 수단 이름을 카카오페이로 설정한다

    alert(`[${methodName}]으로 결제가 완료되었습니다!`); // 선택한 결제 수단으로 결제가 완료되었다는 메시지를 보여 준다

    currentOrder = []; // 결제 완료 후 장바구니를 비운다
    renderOrder(); // 빈 장바구니 상태를 화면에 다시 그린다

    paymentModal.style.display = 'none'; // 결제 완료 후 결제 모달을 숨긴다
  });

  loginForm.addEventListener('submit', (e) => {
    // 로그인 폼 제출 이벤트를 감지한다
    // 폼 제출 이벤트: 로그인 버튼 눌렀을 때 발생함
    // 왜? Form 내부에 있는 버튼은 기본적으로 submit을 발생시킴
    // submit 말고 다르게 동작하고 싶으면, 그걸 특정해야함

    e.preventDefault(); // 폼 제출 시 페이지가 새로고침되지 않도록 막는다
    // 로그인이 안되는 대-멸망 사태 발생: 야근각

    const username = document.getElementById('username').value; // 입력된 사용자명을 읽어 온다
    const password = document.getElementById('password').value; // 입력된 비밀번호를 읽어 온다
    if (username === 'admin' && password === 'admin') {
      // 관리자 계정 정보가 맞는지 확인한다
      loginModal.style.display = 'none'; // 로그인에 성공하면 모달을 숨긴다
      document.getElementById('username').value = ''; // 사용자명 입력값을 비운다
      document.getElementById('password').value = ''; // 비밀번호 입력값을 비운다
      window.location.href = 'admin.html'; // 관리자 페이지로 이동한다
    } else {
      // 관리자 계정 정보가 틀린 경우 실행한다.
      alert('사용자명 또는 비밀번호가 올바르지 않습니다.'); // 로그인 실패 안내 메시지를 보여 준다
    }
  });

  adminLoginBtn.addEventListener('click', (e) => {
    // 관리자 버튼 클릭 이벤트를 감지한다
    loginModal.style.display = 'flex'; // 로그인 모달을 화면에 표시한다
    // flex, block, inline, inline-block 다양함..
    // block: 한 줄 전체를 먹음(대표적으로 div)
    // inline: 내가 필요한 만큼만 먹어(대표적으로 span)
    // flex: 내부 요소 정렬을 쉽게 할 수 있는 애
  });

  orderList.addEventListener('click', (e) => {
    // 주문 내역 영역 안에서 발생한 클릭 이벤트를 감지한다
    const target = e.target; // 실제로 클릭된 요소를 변수에 저장한다

    if (target.id === 'checkoutBtn') {
      // 클릭된 요소가 주문하기 버튼인지 확인한다
      if (currentOrder.length === 0) {
        // 장바구니가 비어 있는지 확인한다
        alert('주문할 메뉴가 없습니다!'); // 주문할 메뉴가 없다는 안내 메시지를 보여 준다
        return; // 결제 모달을 열지 않고 처리를 중단한다
      }
      paymentModal.style.display = 'flex'; // 장바구니에 메뉴가 있으면 결제 모달을 보여 준다
      return; // 주문하기 버튼 처리 후 아래 코드를 실행하지 않는다
    }

    if (target.id === 'clearCartBtn') {
      // 클릭된 요소가 장바구니 초기화 버튼인지 확인한다
      currentOrder = []; // 장바구니 목록을 빈 배열로 초기화한다
      renderOrder(); // 빈 장바구니 상태를 화면에 다시 그린다
      return; // 초기화 버튼 처리 후 아래 코드를 실행하지 않는다
    }

    if (target.closest('.delete-cart-btn')) {
      // 클릭된 요소 또는 부모 요소가 삭제 버튼인지 확인한다
      const deleteName = target.closest('.delete-cart-btn').getAttribute('data-name'); // 삭제할 메뉴 이름을 버튼에서 읽어 온다
      currentOrder = currentOrder.filter((i) => i.name !== deleteName); // 해당 메뉴를 장바구니에서 제거한다
      // filter 함수로 deleteName이 "아닌" 메뉴들로만 새 배열을 구성
      renderOrder(); // 변경된 장바구니 상태를 화면에 다시 그린다
      return; // 삭제 버튼 처리 후 아래 코드를 실행하지 않는다
    }

    // 증감하려면 체크필요
    const menuName = target.getAttribute('data-name'); // 클릭된 요소의 메뉴 이름 데이터를 읽어 온다
    if (!menuName) return; // 메뉴 이름 데이터가 없으면 이후 처리를 중단한다

    // 사실 여기는 if (!menuName) 에 대해서 else 문 안에 있다고 봐도 됨
    // 왜? true 였으면 종료되었을 거니까, 여기까지 왔다는 건 else랑 같은거임

    // 이제부터 이벤트를 발생시킨 버튼을 파악하고, 버튼에 따라서 동작
    if (target.classList.contains('minus-btn')) {
      // 클릭된 요소가 수량 감소 버튼인지 확인한다(근데 이제 minus-btn 클래스가 있으면 수량 감소 버튼이라고 침)
      const item = currentOrder.find((i) => i.name === menuName); // 장바구니에서 해당 메뉴를 찾는다.
      // currentOrder가 배열
      // find 메서드는 배열의 각 요소를 순회하면서 "순회하는 각 요소"가 매개변수에 담김(i)
      // 그리고 그에 대한 함수 실행 결과가 "true"인 애를 반환
      // i.name === menuName 얘가 true인 애를 반환
      // 즉 전체 currentOrder 배열에서, name이 menuName(이벤트를 발생시킨 타겟 메뉴 이름)과 같은애를 찾음

      if (item) {
        // 뭐라도 있으면 true
        // "거짓같은 값"은 0, NaN, Undefined, Null, "" 만 해당
        // 를 제외한 모든 값은 "참 같은 값"
        // 즉, 어떤 메뉴라도 "찾아졌으면", 0, NaN, Undefined, Null, ""가 아니니까 참 같은 값
        // 따라서 if(참 같은 값)이 되어서 조건문 실행

        // 해당 메뉴가 장바구니에 있으면 실행한다
        item.quantity -= 1; // 메뉴 수량을 1개 줄인다
        if (item.quantity <= 0) {
          // 수량이 0개 이하인지 확인한다
          currentOrder = currentOrder.filter((i) => i.name !== menuName);
          // 수량이 0개 이하인 메뉴를 장바구니에서 제거한다
          // 이번에는 filter 메서드를 사용함
          // find 메서드: 해당하는 애를 "찾아서 반환", 즉 "배열의 원소 자체를 반환"
          // filter 메서드: 조건이 참인 애들은 모은 배열을 반환

          // [1, 2, 3, 4].filter(v => v % 2 === 0) 이라고 하면
          // 1, 2, 3, 4를 순회하면서 2로 나눈 나머지가 0인 애들을 반환
          // [2, 4]

          // [1, 2, 3, 4].find(v => v % 2 === 0) 하면
          // 2
          // 제일 처음만 나옴
        }
      }
      renderOrder(); // 변경된 장바구니 상태를 화면에 다시 그린다
    }

    if (target.classList.contains('plus-btn')) {
      // 클릭된 요소가 수량 증가 버튼인지 확인한다
      const item = currentOrder.find((i) => i.name === menuName); // 장바구니에서 해당 메뉴를 찾는다
      if (item) {
        // 해당 메뉴가 장바구니에 있으면 실행한다
        item.quantity += 1; // 메뉴 수량을 1개 늘린다
      }
      renderOrder(); // 변경된 장바구니 상태를 화면에 다시 그린다
    }
  });
});

function renderMenus() {
  // 메뉴 목록을 화면에 출력하는 함수이다
  menuList.innerHTML = ''; // 기존 메뉴 목록 HTML을 비워 중복 렌더링을 막는다
  menus.forEach((menu) => {
    // 전체 메뉴 배열을 하나씩 순회한다
    const menuElm = document.createElement('div'); // 메뉴 하나를 담을 div 요소를 만든다
    menuElm.className = 'menu-card-item'; // 메뉴 카드 스타일을 적용할 클래스를 지정한다

    let menuImgSrc = 'https://placehold.co/100x100?text=Coffee'; // 메뉴 이미지가 없을 때 사용할 기본 이미지를 설정한다

    if (menu.name.includes('아메리카노')) {
      // 메뉴 이름에 아메리카노가 포함되어 있는지 확인한다
      menuImgSrc =
        'https://image.istarbucks.co.kr/upload/store/skuimg/2025/06/[110563]_20250626094353711.jpg'; // 아메리카노 이미지를 설정한다
    } else if (menu.name.includes('딸기라떼')) {
      // 메뉴 이름에 딸기라떼가 포함되어 있는지 확인한다
      menuImgSrc =
        'https://image.istarbucks.co.kr/upload/store/skuimg/2023/11/[9200000004951]_20231102101647442.jpg'; // 딸기라떼 이미지를 설정한다
    } else if (menu.name.includes('초코라떼')) {
      // 메뉴 이름에 초코라떼가 포함되어 있는지 확인한다
      menuImgSrc =
        'https://image.istarbucks.co.kr/upload/store/skuimg/2025/06/[110621]_20250626113323062.jpg'; // 초코라떼 이미지를 설정한다
    } else if (menu.name.includes('딸기스무디')) {
      // 메뉴 이름에 딸기스무디가 포함되어 있는지 확인한다
      menuImgSrc =
        'https://image.istarbucks.co.kr/upload/store/skuimg/2025/07/[9200000003276]_20250721084027663.jpg'; // 딸기스무디 이미지를 설정한다
    } else if (menu.name.includes('카페라떼')) {
      // 메뉴 이름에 카페라떼가 포함되어 있는지 확인한다
      menuImgSrc =
        'https://image.istarbucks.co.kr/upload/store/skuimg/2025/06/[110569]_20250626094801903.jpg'; // 카페라떼 이미지를 설정한다
    } else if (menu.name.includes('녹차') || menu.name.includes('말차')) {
      // 메뉴 이름에 녹차 또는 말차가 포함되어 있는지 확인한다
      menuImgSrc =
        'https://image.istarbucks.co.kr/upload/store/skuimg/2021/04/[400400000091]_20210415132229904.jpg'; // 녹차 또는 말차 이미지를 설정한다
    }
    // FIXME: 이렇게 하면 새 메뉴를 추가할 때 이미지를 추가할 수 없다는 사실을 알았지만 고치기에는 너무 늦었다

    menuElm.innerHTML = `<!-- 메뉴 카드 내부 HTML을 만든다 -->
      <img src="${menuImgSrc}" alt="${menu.name}" class="menu-item-img" onerror="this.src='https://placehold.co/100x100?text=No+Image'">
      <!-- 메뉴 이미지를 표시하고 로딩 실패 시 대체 이미지를 보여 준다 -->
      <div class="menu-info-wrapper"><!-- 메뉴 이름과 가격을 묶는 영역이다 -->
        <div class="menu-name">${menu.name}</div><!-- 메뉴 이름을 표시한다 -->
        <div class="menu-price">₩${menu.price.toLocaleString()}</div><!-- 메뉴 가격을 천 단위 쉼표와 원화 표시로 보여 준다 -->
      </div>
    `;
    menuElm.addEventListener('click', (e) => {
      // 메뉴 항목 클릭 이벤트를 감지한다.
      addToOrder(menu); // 클릭한 메뉴를 장바구니에 추가한다.
    });
    menuList.appendChild(menuElm); // 완성된 메뉴 요소를 메뉴 목록 영역에 추가한다.
  });
}
function addToOrder(menu) {
  // 선택한 메뉴를 장바구니에 추가하는 함수이다.
  const existingItem = currentOrder.find((item) => item.name === menu.name);
  // 이미 장바구니에 같은 메뉴가 있는지 찾는다.
  if (existingItem) {
    // 같은 메뉴가 이미 있으면 실행한다
    existingItem.quantity += 1; // 기존 메뉴의 수량을 1개 늘린다
  } else {
    // 같은 메뉴가 아직 없으면 실행한다
    currentOrder.push({ ...menu, quantity: 1 }); // 메뉴 정보를 복사하고 수량 1개를 붙여 장바구니에 추가한다
    // { ...menu, quantity: 1 } 를 currentOrder 배열에 추가
    //   ^^^^^^^ 받은 메뉴 정보 name, price
    //            ^^^^^^^^^^^^ quantity: 1
    // 예) addToOrder({name: 아메리카노, price: 3000, img: ""})
    // {name: 아메리카노, price:3000, qty: 1}
  }
  console.log('currentOrder', currentOrder); // 현재 장바구니 상태를 개발자 도구 콘솔에 출력한다
  renderOrder(); // 변경된 장바구니 상태를 화면에 다시 그린다
}

function renderOrder() {
  // 장바구니 주문 내역을 화면에 출력하는 함수이다.
  let totalQuantity = 0; // 전체 주문 수량을 계산하기 위한 변수를 만든다.
  let totalAmount = 0; // 전체 주문 금액을 계산하기 위한 변수를 만든다.

  let html = `<h2>🛒 주문 내역</h2>`; // 주문 내역 제목 HTML을 만든다.
  html += '<div class="cart-items-wrapper">'; // 주문 항목들을 감쌀 영역을 연다.

  currentOrder.forEach((item) => {
    // 장바구니에 담긴 메뉴를 하나씩 순회한다.
    const itemTotal = item.price * item.quantity; // 해당 메뉴의 총 금액을 계산한다.
    totalQuantity += item.quantity; // 전체 수량에 해당 메뉴 수량을 더한다.
    totalAmount += itemTotal; // 전체 금액에 해당 메뉴 금액을 더한다.

    html += `<!-- 장바구니 메뉴 한 줄을 만든다. -->
      <div class="cart-item"><!-- 장바구니 메뉴 하나의 컨테이너이다. -->
        <div><!-- 메뉴 이름과 가격을 묶는 영역이다. -->
          <div class="cart-item-name">${item.name}</div><!-- 장바구니 메뉴 이름을 표시한다. -->
          <div class="cart-item-price">₩${item.price.toLocaleString()}</div><!-- 장바구니 메뉴 가격을 표시한다. -->
        </div>
        <div class="cart-item-controls"><!-- 수량 조절 버튼들을 묶는 영역이다. -->
          <button class="minus-btn" data-name="${item.name}">-</button><!-- 해당 메뉴 수량을 줄이는 버튼이다. -->
          <span class="quantity-display">${item.quantity}</span><!-- 현재 메뉴 수량을 표시한다. -->
          <button class="plus-btn" data-name="${item.name}">+</button><!-- 해당 메뉴 수량을 늘리는 버튼이다. -->
          <button class="delete-cart-btn" data-name="${item.name}"><!-- 해당 메뉴를 장바구니에서 삭제하는 버튼이다. -->
            <i class="fas fa-trash-alt"></i><!-- 휴지통 아이콘을 표시한다. -->
          </button>
        </div>
      </div>
    `;
  });

  html += '</div>'; // 주문 항목들을 감싼 영역을 닫는다.

  html += `<!-- 장바구니 합계와 버튼 영역을 만든다. -->
    <div class="cart-summary"><!-- 장바구니 합계를 표시하는 영역이다. -->
      <div class="summary-row"><!-- 총 수량 한 줄을 표시하는 영역이다. -->
        <span>총 수량:</span><!-- 총 수량 라벨을 표시한다. -->
        <span>${totalQuantity} 개</span><!-- 계산된 총 수량을 표시한다. -->
      </div>
      <div class="summary-row total-amount-row"><!-- 총 금액 한 줄을 표시하는 영역이다. -->
        <span>총 금액:</span><!-- 총 금액 라벨을 표시한다. -->
        <span>₩${totalAmount.toLocaleString()}</span><!-- 계산된 총 금액을 표시한다. -->
      </div>
    </div>
    <div class="cart-actions"><!-- 장바구니 작업 버튼들을 묶는 영역이다. -->
      <button id="clearCartBtn" class="action-btn clear-btn" data-name="clear">초기화</button><!-- 장바구니를 비우는 버튼이다. -->
      <button id="checkoutBtn" class="action-btn checkout-btn" data-name="checkout">주문하기</button><!-- 현재 장바구니로 주문하는 버튼이다. -->
    </div>
  `;

  orderList.innerHTML = html; // 완성된 주문 내역 HTML을 화면에 반영한다
}
