/* (1)
유니코드: 전 세계의 모든 문자를 컴퓨터에서 일관되게 표현하고 다룰 수 있도록 설계된 
산업의 표준이다. 각 문자마다 고유한 숫자를 부여한다.
문자 인코딩: 유니코드 같은 문자 세트를 컴퓨터가 이해할 수 있는 0과 1로 변환하는 방식이다.
가장 대표적인 예로 UTF-8이 있으며, 이는 가변 길이를 사용하여 효율적으로 문자를 저장한다.

(2)
문자열 메소드 5개 예시
toUpperCase(): 모든 문자열을 대문자로 변환  
결과: "MY INDUSTRIAL MATH CLASS IS GREAT."

split(" "): 공백을 기준으로 문자열을 나누어 배열로 만듬
결과: ["my", "industrial", "math", "class", "is", "great."]

includes("my"): 특정 문자열이 포함되어 있는지를 확인함
결과: true

replace("my", "your"): 특정 단어를 다른 단어로 변환
결과: "your industrial math class is great."

length: 문자열의 길이를 반환
결과: 35

(3)*/
const price = 199_900;
const quantity = 3;
console.log(`총합은 ${price * quantity}원입니다.`);

//(4)
const user = {name: '박진우', student_id: '2022270026'};
console.log(user);

//(5)
const username = 'username';
const email = 'email';
const profile = {[username]: '박진우', [email]: 'jinwoo@mail.com'};
console.log(profile);