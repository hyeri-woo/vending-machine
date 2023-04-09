const inserted = document.querySelector(".inserted span");
const inputPayment = document.querySelector(".input-payment");
const btnReturn = document.querySelector(".btn-return");
const btnPayment = document.querySelector(".btn-payment");
const btnGain = document.querySelector(".btn-gain");
const possessed = document.querySelector(".possessed p span");
const totalPrice = document.querySelector(".total-price span");
const listDrink = document.querySelector(".list-drink");
const listCurrent = document.querySelector(".list-currentCart");
const listFinal = document.querySelector(".list-finalCart");

const drinkInfo = {
    "Original_Cola" : {
        color: "red",
        price: 1000,
        amount: 10
    }, 
    "Violet_Cola": {
        color: "violet",
        price: 1000,
        amount: 1
    }, 
    "Yellow_Cola": {
        color: "yellow",
        price: 1000,
        amount: 10
    },
    "Cool_Cola": {
        color: "blue", 
        price: 1000,
        amount: 10
    },
    "Green_Cola": {
        color: "green",
        price: 1000,
        amount: 10
    },
    "Orange_Cola": {
        color: "orange",
        price: 1000,
        amount: 10
    }
}

let insertedMoney = 3000;
let possessedMoney = 25000;
let currentCart = [
    {name: "Original_Cola", count: 1},
    {name: "Green_Cola", count: 2},
];
let finalCart = [];

/* string 돈을 number로 바꾸어준다. */
function moneyToNumber (str_money) {
    return parseInt(str_money.replace("원", "").replace(",", ""));
}

/* number을 string 돈으로 바꾸어준다. */
function numberToMoney (num_money) {
    if(num_money < 1000) return num_money + "원";
    num_money = num_money.toString();
    return num_money.slice(0, num_money.length-3) + "," + num_money.slice(num_money.length-3) + "원";
}


/* ------------------------------------------------ 계산대 작업 */
/* 거스름돈 반환 버튼: 눌렀을 시 소지금에 돈을 돌려준다. */
function onReturnClicked() {
    if(insertedMoney > 0) {
        possessedMoney += insertedMoney;
        possessed.innerHTML = numberToMoney(possessedMoney);
        insertedMoney = 0;
        inserted.innerText = numberToMoney(insertedMoney);
    }
}

/* 임급 버튼: 눌었을 시 잔액의 돈을 올려준다 */
function onPaymentClicked() {
    if(inputPayment.value == 0) {
        inputPayment.value = "";
        alert("돈을 입금해주세요");
        return;
    }
    insertedMoney += parseInt(inputPayment.value);
    inserted.innerText = numberToMoney(insertedMoney);
    possessedMoney -= parseInt(inputPayment.value);
    possessed.innerHTML = numberToMoney(possessedMoney);
    inputPayment.value = "";
}

btnReturn.addEventListener("click", onReturnClicked);
btnPayment.addEventListener("click", onPaymentClicked);


/* ------------------------------------------------ 음료수 버튼 클릭 */
const drinks = listDrink.querySelectorAll("button");
for(let i=0; i<drinks.length; i++) {
    drinks[i].addEventListener("click", (e) => {
        let drinkName = drinks[i].querySelector(".drink-name").innerText;
        let drinkPrice = drinkInfo[drinkName].price;   
        // if(drinkInfo[drinkName].amount <= 0) return;    
        // 품절 처리
        if(drinkInfo[drinkName].amount == 0) {
            drinks[i].classList.toggle("soldout");
        }
        // 잔액 처리
        if(!drinks[i].classList.contains("active")) {
            console.log(drinkPrice, possessedMoney);
            if(drinkPrice <= insertedMoney) {
                insertedMoney -= drinkPrice;
                inserted.innerHTML = numberToMoney(insertedMoney);
                drinks[i].classList.add("active");
                drinkInfo[drinkName].amount--;
            } else {
                alert("돈이 부족합니다");
            }
        } 
        // else {
        //     insertedMoney += drinkPrice;
        //     inserted.innerHTML = numberToMoney(insertedMoney);
        //     drinks[i].classList.toggle("active");
        //     drinkInfo[drinkName].amount++;
        // }
    });
}
