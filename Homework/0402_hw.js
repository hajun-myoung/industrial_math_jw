// (1)
function generateRandomString(length = 10) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

// (2)
function generateRandomStringMinMax(min = 2, max = 10) {
    const randomLength = Math.floor(Math.random() * (max - min + 1)) + min;
    return generateRandomString(randomLength);
}

// (3)
function generateEmail() {
    const domains = ['gmail.com', 'korea.ac.kr', 'naver.com'];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const username = generateRandomStringMinMax(2, 6);
    return `${username}@${randomDomain}`;
}
console.log(generateEmail());

// (4)
function applyArray(array, func) {
    const result = [];
    array.forEach(item => {
        result.push(func(item));
    });
    return result;
}

// (5)
const generateUsers = (n) => {
    const users = [];
    for (let i = 0; i < n; i++) {
        users.push({
            username: generateRandomStringMinMax(2, 8),
            email: `${generateRandomStringMinMax(2, 10)}@${['gmail.com', 'naver.com', 'korea.ac.kr'][Math.floor(Math.random() * 3)]}`
        });
    }
    return users;
};
console.log(generateUsers(5));