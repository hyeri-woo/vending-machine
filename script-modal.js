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
const modal = document.querySelector(".modal-wrapper");

const drinkInfo = new Map();
drinkInfo.set("Original_Cola", {color: "red", price: 1000, amount: 10});
drinkInfo.set("Violet_Cola", {color: "violet", price: 1000, amount: 10});
drinkInfo.set("Yellow_Cola", {color: "yellow", price: 1000, amount: 10});
drinkInfo.set("Cool_Cola", {color: "blue", price: 1000, amount: 10});
drinkInfo.set("Green_Cola", {color: "green", price: 1000, amount: 10});
drinkInfo.set("Orange_Cola", {color: "orange", price: 1000, amount: 10});

const msgWarning = new Map();
msgWarning.set("No More Item", "아이템 수량이 부족합니다.");
msgWarning.set("Money Needed", "돈이 부족합니다");
msgWarning.set("Remove Item from Cart", "음료수를 현재 장바구니에서 삭제하시겠습니까?");
msgWarning.set("Unable to Get", "해당 음료수가 소진되었습니다. 구매는 더 이상 불가합니다.");
msgWarning.set("Input Money", "돈을 입금해주세요");
msgWarning.set("No More Money", "소지금이 부족합니다.");
msgWarning.set("Successful Gain", "성공적으로 아이템을 구매하였습니다.")

const currentCart = new Map();
const finalCart = new Map();

let insertedMoney = 10000;
let possessedMoney = 30000;

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
    listDrink.querySelectorAll("li").forEach(item => {
        const drinkName = item.querySelector(".drink-name").innerText;
        item.querySelector(".drink-amount").textContent = drinkInfo.get(drinkName).amount;
    })
    currentCart.clear();
    finalCart.clear();
});

/* 모달창 처리 */ 
// NEED TO WORK: YES 눌렀을 시에만 아이템 삭제
// isRemove == true: 현재 장바구니에서 아이템 삭제할 때
// isSub == true: btn-sub을 통해서만 아이템 삭제할 때
const onModal = function(title, itemCart, itemCount, drinkName, btnDrink, isRemove=false, isSub=false) {
    modal.classList.add("on");
    modal.querySelector("h2").textContent = title;
    modal.querySelector("p").textContent = msgWarning.get(title);
    modal.querySelector(".btn-cancel").addEventListener("click", () => {
        console.log("cancel");
        if(isSub) {
            currentCart.set(drinkName, 1);
            itemCount.textContent = currentCart.get(drinkName);
        }
        modal.classList.remove("on");
    }, {once : true});
    modal.querySelector(".btn-yes").addEventListener("click", () => {
        console.log("yes");
        if(isRemove && !isSub) {
            drinkInfo.get(drinkName).amount += currentCart.get(drinkName);
            btnDrink.querySelector(".drink-amount").textContent = parseInt(btnDrink.querySelector(".drink-amount").textContent) + currentCart.get(drinkName);
            insertedMoney = insertedMoney + drinkInfo.get(drinkName).price * currentCart.get(drinkName);
            inserted.textContent = numberToMoney(insertedMoney);
        }
        if(isRemove) {
            listCurrent.removeChild(itemCart);
            currentCart.delete(drinkName);
            btnDrink.classList.remove("active");
        }
        modal.classList.remove("on");
    }, {once : true});
}

/* ------------------------------------------------ 음료수 버튼 클릭 */
const drinks = listDrink.querySelectorAll("button");
drinks.forEach(item =>  {
    item.addEventListener("click", () => {
        let drinkName = item.querySelector(".drink-name").innerText;
        let drinkPrice = drinkInfo.get(drinkName).price; 
        let drinkAmount = drinkInfo.get(drinkName).amount;
        // 아이템 수량이 부족할 경우 모달창 오픈, 품절은 획득 버튼을 눌렀을 시 처리
        if(drinkAmount === 0) {
            onModal("No More Item");
            return;
        }
        // 돈이 부족할 시 모달창 오픈
        if(drinkPrice > insertedMoney) {
            onModal("Money Needed");
            return;
        }
        // 잔액, 음료수 amount 업데이트
        insertedMoney -= drinkPrice;
        inserted.textContent = numberToMoney(insertedMoney);
        item.classList.add("active");
        item.querySelector(".drink-amount").textContent = --drinkInfo.get(drinkName).amount;

        // update current cart
        updateCart(listCurrent, currentCart, drinkName, 1, true);

    })
});

// cart 업데이트
const updateCart = function(listCart, cartMap, drinkName, value, isCurrent) {
    let drinkColor = drinkInfo.get(drinkName).color;
    // cart 업데이트
    if(cartMap.has(drinkName)) {
        cartMap.set(drinkName, cartMap.get(drinkName)+value);
        const itemCart = listCart.querySelector(`[data-type=${drinkName}]`);
        itemCart.querySelector(".drink-count").textContent = cartMap.get(drinkName);
    } else {
        cartMap.set(drinkName, value);
        // new list item
        const itemCart = document.createElement("li");
        itemCart.setAttribute("class", "cart-item");
        itemCart.setAttribute("data-type", drinkName);
        // item img
        const itemImg = document.createElement("img");
        itemImg.setAttribute("src", `./img/${drinkColor}.svg`);
        itemImg.setAttribute("alt", drinkName);
        // item name
        const itemName = document.createElement("span");
        itemName.setAttribute("class", 'drink-name');
        itemName.append(document.createTextNode(drinkName));
        // item count
        const itemCount = document.createElement("span");
        itemCount.setAttribute("class", 'drink-count');
        itemCount.append(document.createTextNode(value));
        itemCart.append(itemImg, itemName, itemCount);
        if(isCurrent) {
            // sub button
            const btnSub = document.createElement("button");
            btnSub.setAttribute("class", "btn-sub");
            btnSub.setAttribute("type", "button");
            btnSub.append(document.createTextNode("-"));
            // add button
            const btnAdd = document.createElement("button");
            btnAdd.setAttribute("class", "btn-add");
            btnAdd.setAttribute("type", "button");
            btnAdd.append(document.createTextNode("+"));
            // remove button
            const btnRemove = document.createElement("button");
            btnRemove.setAttribute("class", "btn-remove");
            btnRemove.setAttribute("type", "button");
            btnRemove.append(document.createTextNode("x"));

            itemCart.append(btnSub, btnAdd, btnRemove);
        }
        listCart.appendChild(itemCart);

        if(!isCurrent) return;
        // 수량 조절 버튼 이벤트 리스너 추가
        const btnSub = itemCart.querySelector(".btn-sub");
        const btnAdd = itemCart.querySelector(".btn-add");
        const btnRemove = itemCart.querySelector(".btn-remove");
        const btnDrink = listDrink.querySelector(`[data-type=${drinkName}`);

        // 카트에 든 음료수 개수 하나 차감, 0이 될시 삭제 
        btnSub.addEventListener("click", () => {
            currentCart.set(drinkName, currentCart.get(drinkName) - 1);
            if(currentCart.get(drinkName) < 0) {
                itemCount.textContent = "0";
            } else {
                itemCount.textContent = currentCart.get(drinkName);
            }
            if(itemCount.textContent == 0) {
                onModal("Remove Item from Cart", itemCart, itemCount, drinkName, btnDrink, true, true);
                return;
            } 
            insertedMoney += drinkInfo.get(drinkName).price;
            inserted.textContent = numberToMoney(insertedMoney);
            btnDrink.querySelector(".drink-amount").textContent = ++drinkInfo.get(drinkName).amount;
        });
        // 카트에 든 음료수 개수 하나 추가
        btnAdd.addEventListener("click", () => {
            if(drinkInfo.get(drinkName).price > insertedMoney) {
                onModal("Money Needed");
                return;
            }
            if(drinkInfo.get(drinkName).amount == 0) {
                onModal("Unable to Get");
                return;
            }
            btnDrink.querySelector(".drink-amount").textContent = --drinkInfo.get(drinkName).amount;
            currentCart.set(drinkName, currentCart.get(drinkName) + 1);
            itemCount.innerText++;
            insertedMoney -= drinkInfo.get(drinkName).price;
            inserted.textContent = numberToMoney(insertedMoney);
        })
        // 한번에 해당 음료수 전체 삭제
        btnRemove.addEventListener("click", () => {
            onModal("Remove Item from Cart", itemCart, itemCount, drinkName, btnDrink, true);
        })
    }
}

/* ------------------------------------------------ 계산대 작업 */
/* 사용자의 입금 금액을 100원 단위로 반올림해준다. */
inputPayment.addEventListener("change", () => {
    inputPayment.value = Math.round(inputPayment.value/100) * 100;
});

/* 거스름돈 반환 버튼: 눌렀을 시 소지금에 돈을 돌려준다. */
btnReturn.addEventListener("click", () => {
    if(insertedMoney > 0) {
        possessedMoney += insertedMoney;
        possessed.textContent = numberToMoney(possessedMoney);
        insertedMoney = 0;
        inserted.textContent = numberToMoney(insertedMoney);
    }
});

/* 임급 버튼: 눌었을 시 잔액의 돈을 올려준다 */
btnPayment.addEventListener("click", () => {
    if(inputPayment.value == 0) {
        inputPayment.value = "";
        onModal("Input Money");
        return;
    }
    if(inputPayment.value > possessedMoney) {
        inputPayment.value = "";
        onModal("No More Money");
        return;
    }
    insertedMoney += parseInt(inputPayment.value);
    inserted.innerText = numberToMoney(insertedMoney);
    possessedMoney -= parseInt(inputPayment.value);
    possessed.textContent = numberToMoney(possessedMoney);
    inputPayment.value = "";
});

/* 획득 버튼: 눌렀을 시 음료수 품절처리, 획득한 음료, 현재 카트 업데이트 */
btnGain.addEventListener("click", () => {
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
    // update final cart
    currentCart.forEach((value, key) => {
        updateCart(listFinal, finalCart, key, value, false);
    });

    // currentCart & listCurrent 비우기
    currentCart.clear();
    const itemCart = listCurrent.querySelectorAll('li');
    itemCart.forEach(v => listCurrent.removeChild(v));

    // update total price
    let price = 0;
    finalCart.forEach((value, key) => {
        price += drinkInfo.get(key).price * value;
    })
    totalPrice.textContent = numberToMoney(price);
});
