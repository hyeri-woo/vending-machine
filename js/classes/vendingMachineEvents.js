class VendingMachineEvents {
    constructor() {
        const vendingMachine = document.querySelector(".section-vending");
        this.inserted = vendingMachine.querySelector(".inserted span");
        this.itemList = vendingMachine.querySelector(".list-drink");
        this.inputPayment = vendingMachine.querySelector(".input-payment");
        this.btnReturn = vendingMachine.querySelector(".btn-return");
        this.btnPayment = vendingMachine.querySelector(".btn-payment");
        this.btnGain = vendingMachine.querySelector(".btn-gain");
        this.listCurrent = vendingMachine.querySelector(".list-currentCart");

        const reciept = document.querySelector(".section-reciept");
        this.possessed = reciept.querySelector(".possessed span");
        this.listFinal = reciept.querySelector(".list-finalCart");
        this.totalPrice = reciept.querySelector(".total-price span");

        this.modal = document.querySelector(".modal-wrapper");
        this.msgWarning = new Map();
        this.msgWarning.set("Money Needed", "돈이 부족합니다");
        this.msgWarning.set("Remove Item from Cart", "음료수를 현재 장바구니에서 삭제하시겠습니까?");
        this.msgWarning.set("Input Money", "돈을 입금해주세요");
        this.msgWarning.set("No Enough Money", "소지금이 부족합니다.");
        this.msgWarning.set("Successful Gain", "성공적으로 아이템을 구매하였습니다.");
        this.msgWarning.set("Invalid Money Inserted", "입금액은 1000원 이상이어야 합니다.");
        this.msgWarning.set("No Money to Return", "반환할 돈이 없습니다.")
    }

    /* string 돈을 number로 변환하는 함수 */
    moneyToNumber(str_money) {
        return parseInt(str_money.replace("원", "").replaceAll(",", ""));
    }

    /* number을 string 변환하는 함수 */
    numberToMoney(num_money) {
        return new Intl.NumberFormat().format(num_money) + "원";
    }

    /** Modal 생성 함수 
     * 
     */
    onModal(title) {
        this.modal.classList.add("on");
        this.modal.querySelector("h2").textContent = title;
        this.modal.querySelector("p").textContent = this.msgWarning.get(title);
        const btnCancel = this.modal.querySelector(".btn-cancel");
        btnCancel.addEventListener("click", () => {
            new Audio("./audio/modal-click.mp3").play();
            this.modal.classList.remove("on");
        })
        const btnYes = this.modal.querySelector(".btn-yes");
        new Audio("./audio/notify.mp3").play();
    }

    /** 현재 장바구니 음료수 생성 함수 
     * 1) 장바구니에 이미 똑같은 음료수가 있을 시 수량 추가
     * 2) 없을 시 새로 추가
     * 3) btn-sub 이벤트 추가: 현재 장바구니 안의 해당 음료수 수량 줄이기 (0이 되는 순간 장바구니에서 삭제)
     * 4) btn-add 이밴트 추가: 현재 장바구니 안의 해당 음료수 수량 늘이기
     * 5) btn-remove 이벤트 추가: 현재 장바구니에서 해당 음료수 삭제
     */
    currentItemGenerator(target) {
        for(let i of this.listCurrent.querySelectorAll("li")) {
            if(i.dataset.item === target.dataset.item) {
                i.dataset.count = parseInt(i.dataset.count) + 1;
                i.querySelector(".drink-count").textContent = i.dataset.count;
                return;
            }
        }
        const currentItem = document.createElement("li");
        currentItem.setAttribute("class", "cart-item");
        currentItem.setAttribute("data-item", target.dataset.item);
        currentItem.setAttribute("data-img", target.dataset.img);
        currentItem.setAttribute("data-count", 1);
        currentItem.setAttribute("data-cost", target.dataset.cost);
        currentItem.innerHTML = `
            <img src="./img/${target.dataset.img}" alt="${target.dataset.item}">
            <span class="drink-name">${target.dataset.item}</span>
            <span class="drink-count">1</span>
            <button class="btn-sub" type="button">-</button>
            <button class="btn-add" type="button">+</button>
            <button class="btn-remove" type="button">x</button>
        `;
        this.listCurrent.append(currentItem);

        // btn-sub 이벤트
        // 1) 잔액 업데이트 (+ 해당 음료수 가격)
        // 2) 자판기 안 해당 음료수 수량 업데이트 (+1)
        // 3) 현재 장바구니 안 해당 음료수 수량 업데이트 (-1)
        // 4) 현재 장바구니 안 해당 음료수 수량이 0이 될 시 삭제할지 경고창 출력
        // 5) yes 눌렀을시만 현재 장바구니에서 해당 음료수 삭제
        // 6) 자판기 안 해당 음료수가 품절처리 됐을 시 품절 취소
        currentItem.querySelector(".btn-sub").addEventListener("click", () => {
            if(currentItem.dataset.count - 1 == 0) {
                if(confirm("정말 삭제하시겠습니까?")) {
                    currentItem.remove();
                } else {
                    return;
                }
            }
            this.inserted.textContent = this.numberToMoney(this.moneyToNumber(this.inserted.textContent) + parseInt(target.dataset.cost));
            target.dataset.count = parseInt(target.dataset.count) + 1;
            target.querySelector(".drink-amount").textContent = target.dataset.count;
            currentItem.dataset.count = parseInt(currentItem.dataset.count) - 1;
            currentItem.querySelector(".drink-count").textContent = currentItem.dataset.count;
            if(target.classList.contains("soldout")) {
                target.classList.remove("soldout");
                target.disabled = false;
            }
            new Audio("./audio/modal-click.mp3").play();
        });
        // btn-add 이벤트
        // 1) 잔액 업데이트 (- 해당 음료수 가격)
        // 2) 자판기 안 해당 음료수 수량 업데이트 (-1)
        // 3) 현재 장바구니 안 해당 음료수 수량 업데이트 (+1)
        currentItem.querySelector(".btn-add").addEventListener("click", () => {
            this.inserted.textContent = this.numberToMoney(this.moneyToNumber(this.inserted.textContent) - target.dataset.cost);
            target.dataset.count = parseInt(target.dataset.count) - 1;
            target.querySelector(".drink-amount").textContent = target.dataset.count;
            currentItem.dataset.count = parseInt(currentItem.dataset.count) + 1;
            currentItem.querySelector(".drink-count").textContent = currentItem.dataset.count;
            new Audio("./audio/modal-click.mp3").play();
        });
        // btn-remove 이벤트
        // 1) 해당 음료수 active 클래스 삭제
        // 2) 잔액 업데이트 (+ 해당 음료수 가격 * 장바구니 안 해당 음료수 수량)
        // 3) 자판기 안 해당 음료수 수량 업데이트 (+ 장바구니 안 해당 음료수 수량)
        // 4) 현재 장바구니에서 해당 음료수 삭제 
        // 5) 자판기 안 해당 음료수가 품절처리 됐을 시 품절 취소
        currentItem.querySelector(".btn-remove").addEventListener("click", () => {
            if(confirm("삭제하시겠습니까?")) {
                target.classList.remove("active");
                this.inserted.textContent = this.numberToMoney(this.moneyToNumber(this.inserted.textContent) + target.dataset.cost * currentItem.dataset.count);
                target.dataset.count = parseInt(target.dataset.count) + parseInt(currentItem.dataset.count);
                target.querySelector(".drink-amount").textContent = target.dataset.count;
                if(target.classList.contains("soldout")) {
                    target.classList.remove("soldout");
                    target.disabled = false;
                }
                currentItem.remove();
                new Audio("./audio/modal-click.mp3").play();
            }
        });
    }

    /** final 장바구니 음료수 생성 함수
     * 1) 장바구니에 이미 똑같은 음료수가 있을 시 수량 추가
     * 2) 없을 시 새로 추가
     */
    finalItemGenerator(target) {
        for(let i of this.listFinal.querySelectorAll("li")) {
            if(i.dataset.item === target.dataset.item) {
                i.querySelector(".drink-count").textContent = parseInt(i.querySelector(".drink-count").textContent) +  parseInt(target.dataset.count);
                return;
            }
        }
        const finalItem = document.createElement("li");
        finalItem.setAttribute("class", "cart-item");
        finalItem.setAttribute("data-item", target.dataset.item);
        finalItem.innerHTML = `
            <img src="./img/${target.dataset.img}" alt="${target.dataset.item}">
            <span class="drink-name">${target.dataset.item}</span>
            <span class="drink-count">${target.dataset.count}</span>
        `;
        this.listFinal.append(finalItem);
        // <li class="cart-item">
        //     <img src="./img/red.svg" alt="오리지널 콜라">
        //     <span class="drink-name">Original_Cola</span>
        //     <span class="drink-count">1</span>
        // </li>
    }

    bindEvent() {
        /**
         * 입금 금액 
         * 1) 사용자가 키보드를 사용해서 마이너스 값을 넣었을 때 경고창 출력
         * 2) 사용자가 키보드를 사용해서 1000원 단위보다 작은 값을 넣었을 때 반올림처리
         */
        this.inputPayment.addEventListener("change", () => {
            const inputCost = this.moneyToNumber(this.inputPayment.value);  // 입금액
            if(inputCost <= 0) {
                this.onModal("Invalid Money Inserted");
                this.inputPayment.value = null;
                return;
            }
            this.inputPayment.value = Math.round(inputCost/1000) * 1000;
        });

        /**
         * 입금 버튼 기능
         * 1) 소지금 == 소지금 - 입금액
         * 2) 잔액 == 기존 잔액 + 입금액
         * 3) 입금액이 소지금보다 많으면 경고창 출력
         * 4) 입금액이 정상적으로 입금되면 입금창은 초기화
         */
        this.btnPayment.addEventListener("click", () => {
            const inputCost = this.moneyToNumber(this.inputPayment.value);       // 입금액
            const possessedVal = this.moneyToNumber(this.possessed.textContent); // 소지금
            const insertedVal = this.moneyToNumber(this.inserted.textContent);   // 잔액
            if(inputCost) {     // 입금액이 있다면 실행
                if(inputCost <= possessedVal) {  // 입금액이 소지금보다 적다면 실행
                    this.possessed.textContent =  this.numberToMoney(possessedVal - inputCost);
                    this.inserted.textContent = this.numberToMoney(insertedVal + inputCost);
                    this.inputPayment.value = null;
                    new Audio("./audio/coin-collect.mp3").play();
                } else {                         // 입금액이 소지금보다 많다면 경고창 출력
                    this.onModal("No Enough Money");
                }
            } else {
                this.onModal("Input Money");
            }
        });

        /**
         * 거스름돈 반환 버튼 기능
         * 1) 소지금 = 잔액 + 소지금
         * 2) 잔액 = 0원
         * 3) 반환할 잔액이 없을 시 경고창 출력
         */
        this.btnReturn.addEventListener("click", () => {
            const possessedVal = this.moneyToNumber(this.possessed.textContent); // 소지금
            const insertedVal = this.moneyToNumber(this.inserted.textContent);   // 잔액
            if(insertedVal > 0) {
                this.possessed.textContent = this.numberToMoney(possessedVal + insertedVal);
                this.inserted.textContent = this.numberToMoney(0);
                new Audio("./audio/coin-return.mp3").play();
            } else {
                this.onModal("No Money to Return");
            }
        })

        /**
         * 장바구니 채우기
         * 1) 아이템을 누르면 잔액 = 잔액 - 아이템 가격
         * 2) 아이템 가격이 잔액보다 크다면 경고창 출력
         * 3) 아이템이 장바구니에 들어간다. 
         * 4) 아이템의 갯수가 줄어든다. 
         * 5) 선택된 아이템의 class에 active가 추가된다 (색깔바뀜)
         * 6) 아이템의 count가 0이 되면 품절처리를 한다. 
         */
        this.itemList.querySelectorAll("button").forEach((item) => {
            item.addEventListener("click", (event) => {
                const insertedVal = this.moneyToNumber(this.inserted.textContent);   // 잔액
                const itemCost = parseInt(event.currentTarget.dataset.cost);
                const itemCount = parseInt(event.currentTarget.dataset.count);
                const drinkCount = event.currentTarget.querySelector(".drink-amount");
                if(insertedVal >= itemCost) {
                    this.inserted.textContent = this.numberToMoney(insertedVal - itemCost);
                    this.currentItemGenerator(event.currentTarget);
                    drinkCount.textContent = parseInt(itemCount - 1);
                    item.setAttribute("data-count", itemCount - 1);
                    item.classList.add("active");
                } else {
                    this.onModal("No Enough Money")
                }
                if(itemCount === 1) {
                    item.classList.add("soldout");
                    item.disabled = true;
                }
                new Audio("./audio/button-click.mp3").play();
            })
        })

        /**
         * 획득 버튼 기능
         * 1) 현재 장바구니를 비운다
         * 2) 획득한 음료 채운다
         * 3) 총금액을 업데이트한다. 
         * 4) 선택된 음료수를 리셋한다. 
         */
        this.btnGain.addEventListener("click", () => {
            let totalVal = this.moneyToNumber(this.totalPrice.textContent);
            this.listCurrent.querySelectorAll("li").forEach((item) => {
                totalVal += item.dataset.count * item.dataset.cost;
                this.finalItemGenerator(item);
                item.remove();
            })
            this.itemList.querySelectorAll("button").forEach((item) => {
                item.classList.remove("active");
            });
            this.totalPrice.textContent = this.numberToMoney(totalVal);
            new Audio("./audio/gain.mp3").play();
        })
    }

}

export default VendingMachineEvents;