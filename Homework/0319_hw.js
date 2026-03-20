// (1)
const user = {
    username: "kildong",
    address: {
        street: "Jochiwon",
        phone: "010-1234-5678:",
    },
};
// a)
console.log(user?.address?.street);
// b)
console.log(user?.address?.code);
// c)
console.log(user?.password?.code);
// d) 
console.log(user?.password.code);
// e)
console.log(person?.contact?.phone);

// a) Jochiwon  : user와 user.address가 모두 존재, 그 안의 street 값 접근
// b) undefined : code가 정의되지 않음
// c) undefined : user.password가 존재하지않음
// d) TypeError : ?.으로 접근하지 않아 에러발생
// e) undefined : person이 존재하지 않음
// ?.은 해당 참조가 유효한지 명시적으로 확인하지 않고도 접근할 수 있게 해주는 연산자

// (2)
const arr = [1, 2, 3,];
arr.lucky = "guy!";
arr[10] = 10;

for (const key in arr) {
    console.log(`arr[${key}] = ${arr[key]}`);
}

for (const elm of arr) {
    console.log(`${elm}`);
}

/**
* in 실행결과: arr[0] = 1, arr[1] = 2, arr[2] = 3, arr[10] = 10, arr[lucky] = guy!
* in을 사용하면 직접 추가한 lucky까지 포함하여 출력하고, 가운데 3~9까지 비어있는 인덱스는 무시
* of 실행결과: 1, 2, 3, undefined (7번) 10
* of 는 값에 집중하기 때문에 lucky는 출력하지 않음, 3~9 undefined도 출력
*/

// (3)
let fruit = "apple";
let result = "";

switch (fruit) {
    case "banana":
        result += "바나나 ";
    case "apple":
        result += "사과 ";
    case "orange":
        result += "오렌지 ";
        break;
    case "grape":
        result += "포도 ";
    default:
        result += "과일 ";
}
//결과: "사과 오렌지 "
//fruit이 apple이므로 case에서 바로 apple로 간다. apple에는 break가 없으므로 orange까지 나온다.