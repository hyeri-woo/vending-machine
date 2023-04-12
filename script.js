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

const drinkInfo = new Map();
drinkInfo.set("Original_Cola", {color: "red", price: 1000, amount: 10});
drinkInfo.set("Violet_Cola", {color: "violet", price: 1000, amount: 10});
drinkInfo.set("Yellow_Cola", {color: "yellow", price: 1000, amount: 10});
drinkInfo.set("Cool_Cola", {color: "blue", price: 1000, amount: 10});
drinkInfo.set("Green_Cola", {color: "green", price: 1000, amount: 10});
drinkInfo.set("Orange_Cola", {color: "orange", price: 1000, amount: 10});

let insertedMoney = 3000;
let possessedMoney = 30000;
let currentCart = new Map();
let finalCart = new Map();

/* string 돈을 number로 바꾸어준다. */
const moneyToNumber = function(str_money) {
    return parseInt(str_money.replace("원", "").replace(",", ""));
}

/* number을 string 돈으로 바꾸어준다. */
const numberToMoney = function (num_money) {
    if(num_money < 1000) return num_money + "원";
    num_money = num_money.toString();
    return num_money.slice(0, num_money.length-3) + "," + num_money.slice(num_money.length-3) + "원";
}

/* 윈도우가 로드했을시 잔액, 소지금, 음료수 개수를 리셋한다 */
window.addEventListener("load", () => {
    inserted.textContent = numberToMoney(insertedMoney);
    possessed.textContent = numberToMoney(possessedMoney);
});

// NEED TO WORK: current cart 업데이트
const updateCurrentCart = function() {

}

/* ------------------------------------------------ 음료수 버튼 클릭 */
const drinks = listDrink.querySelectorAll("button");
drinks.forEach(item =>  {
    item.addEventListener("click", () => {
        let drinkName = item.querySelector(".drink-name").innerText;
        let drinkColor = drinkInfo.get(drinkName).color;
        let drinkPrice = drinkInfo.get(drinkName).price;   
        let drinkAmount = drinkInfo.get(drinkName).amount;
        // 아이템 수량이 부족할 경우 alert, 품절은 획득 버튼을 눌렀을 시 처리
        if(drinkAmount === 0) {
            alert("아이템 수량이 부족합니다.");
            return;
        }
        // 돈이 부족할 시 alert
        if(drinkPrice > insertedMoney) {
            alert("돈이 부족합니다");
            return;
        }
        // console.log(drinkPrice, possessedMoney);
        // 잔액, 음료수 amount 업데이트
        insertedMoney -= drinkPrice;
        inserted.textContent = numberToMoney(insertedMoney);
        item.classList.add("active");
        drinkInfo.get(drinkName).amount--;

        
        // current cart 업데이트
        if(currentCart.has(drinkName)) {
            currentCart.set(drinkName, currentCart.get(drinkName)+1);
            const itemCart = listCurrent.querySelector(`[data-type=${drinkName}]`);
            itemCart.querySelector(".drink-count").textContent = currentCart.get(drinkName);
        } else {
            currentCart.set(drinkName, 1);
            const itemCart = document.createElement("li");
            const itemImg = document.createElement("img");
            const itemName = document.createElement("span");
            const itemCount = document.createElement("span");
            itemCart.setAttribute("class", "cart-item");
            itemCart.setAttribute("data-type", drinkName);
            itemImg.setAttribute("src", `./img/${drinkColor}.svg`);
            itemImg.setAttribute("alt", drinkName);
            itemName.setAttribute("class", 'drink-name');
            itemName.append(document.createTextNode(drinkName));
            itemCount.setAttribute("class", 'drink-count');
            itemCount.append(document.createTextNode('1'));
            itemCart.append(itemImg, itemName, itemCount);
            listCurrent.appendChild(itemCart);
        }

    

        // else {
        //     insertedMoney += drinkPrice;
        //     inserted.textContent = numberToMoney(insertedMoney);
        //     drinks[i].classList.toggle("active");
        //     drinkInfo[drinkName].amount++;
        // }
    })
});


/* ------------------------------------------------ 계산대 작업 */
/* 거스름돈 반환 버튼: 눌렀을 시 소지금에 돈을 돌려준다. */
function onReturnClicked() {
    if(insertedMoney > 0) {
        possessedMoney += insertedMoney;
        possessed.textContent = numberToMoney(possessedMoney);
        insertedMoney = 0;
        inserted.textContent = numberToMoney(insertedMoney);
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
    possessed.textContent = numberToMoney(possessedMoney);
    inputPayment.value = "";
}

function onGainClicked() {
    // let drinkPrice = drinkInfo[drinkName].price;   
    // 음료수 버튼 처리
    drinks.forEach(item => {
        let drinkName = item.querySelector(".drink-name").innerText;
        // 품절 처리
        if(drinkInfo.get(drinkName).amount == 0) {
            item.classList.add("soldout");
        } 

        // active 지우기
        item.classList.remove("active");
    })
}

btnReturn.addEventListener("click", onReturnClicked);
btnPayment.addEventListener("click", onPaymentClicked);
btnGain.addEventListener("click", onGainClicked);