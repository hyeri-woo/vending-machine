class VendingMachineEvents {
  constructor() {
    // vending machine DOM
    const vendingMachine = document.querySelector(".section-vending");
    this.inserted = vendingMachine.querySelector(".inserted span");
    this.itemList = vendingMachine.querySelector(".list-drink");
    this.inputPayment = vendingMachine.querySelector(".input-payment");
    this.btnReturn = vendingMachine.querySelector(".btn-return");
    this.btnPayment = vendingMachine.querySelector(".btn-payment");
    this.btnGain = vendingMachine.querySelector(".btn-gain");
    this.listCurrent = vendingMachine.querySelector(".list-currentCart");

    // reciept DOM
    const reciept = document.querySelector(".section-reciept");
    this.possessed = reciept.querySelector(".possessed span");
    this.listFinal = reciept.querySelector(".list-finalCart");
    this.totalPrice = reciept.querySelector(".total-price span");

    // modal DOM
    this.modal = document.querySelector("dialog");
    this.modal.querySelectorAll("button").forEach((item) =>
      item.addEventListener("click", () => {
        new Audio("./audio/modal-click.mp3").play();
        this.modal.close();
      })
    );

    this.modal.addEventListener("click", (event) => {
      if (event.target.nodeName === "DIALOG") {
        this.modal.close();
      }
    });

    // modal messages
    this.msgWarning = new Map();
    this.msgWarning.set("Money Needed", "돈이 부족합니다");
    this.msgWarning.set(
      "Remove Item from Cart",
      "음료수를 현재 장바구니에서 삭제하시겠습니까?"
    );
    this.msgWarning.set("Input Money", "돈을 입금해주세요");
    this.msgWarning.set("No Enough Money", "소지금이 부족합니다.");
    this.msgWarning.set(
      "Successful Gain",
      "성공적으로 아이템을 구매하였습니다."
    );
    this.msgWarning.set(
      "Invalid Money Inserted",
      "입금액은 1000원 이상이어야 합니다."
    );
    this.msgWarning.set("No Money to Return", "반환할 돈이 없습니다.");
    this.msgWarning.set(
      "No More Drink Available",
      "해당 음료수의 재고가 없습니다."
    );
    this.msgWarning.set(
      "No Item in Current Cart",
      "장바구니에 구매할 아이템이 없습니다."
    );
    this.msgWarning.set(
      "Reset Vending Machine",
      "현재 음료수 자판기를 리셋하시겠습니까?"
    );
    this.msgWarning.set("Confirm Purchase", "음료수 구매를 확정하겠습니까?");

    // reset DOM
    this.btnReset = document.querySelector(".btn-reset");
    this.startCount = []; // 음료수 갯수 배열
  }

  /* -------- COMMON FUNCTIONS -------- */
  /* string 돈을 number로 변환하는 함수 */
  moneyToNumber(str_money) {
    return parseInt(str_money.replace("원", "").replaceAll(",", ""));
  }

  /* number을 string 변환하는 함수 */
  numberToMoney(num_money) {
    return new Intl.NumberFormat().format(num_money) + "원";
  }

  /* -------- MODAL FUNCTION -------- */
  /** Modal 생성 함수
   * 1) 모달창을 켜준다.
   * 2) 해당 타이틀과 컨텐츠 텍스트를 설정해준다.
   * 3) btn-cancel을 눌렀을 시 0을 반환한다.
   * 4) btn-yes을 눌렀을 시 1을 반환한다.
   */
  onModal(title) {
    return new Promise((resolve) => {
      //   this.modal.classList.add("on");
      this.modal.showModal();
      this.modal.querySelector("h2").textContent = title;
      this.modal.querySelector("p").textContent = this.msgWarning.get(title);
      new Audio("./audio/notify.mp3").play();
      this.modal.querySelector(".btn-cancel").addEventListener("click", () => {
        resolve(0);
      });
      this.modal.querySelector(".btn-yes").addEventListener("click", () => {
        resolve(1);
      });
    });
  }

  /* -------- CURRENT ITEM GENERATOR BUTTON FUNCTIONS -------- */
  /** btn-sub 이벤트
   * 1) 잔액 업데이트 (+ 해당 음료수 가격)
   * 2) 자판기 안 해당 음료수 수량 업데이트 (+1)
   * 3) 현재 장바구니 안 해당 음료수 수량 업데이트 (-1)
   * 4) 현재 장바구니 안 해당 음료수 수량이 0이 될 시 삭제할지 경고창 출력
   * 5) yes 눌렀을시만 현재 장바구니에서 해당 음료수 삭제
   * 6) 자판기 안 해당 음료수가 품절처리 됐을 시 품절 취소
   */
  onBtnSub(currentItem, target) {
    currentItem
      .querySelector(".btn-sub")
      .addEventListener("click", async () => {
        if (currentItem.dataset.count - 1 == 0) {
          if (!(await this.onModal("Remove Item from Cart"))) return;
          target.classList.remove("active");
          currentItem.remove();
        }
        this.inserted.textContent = this.numberToMoney(
          this.moneyToNumber(this.inserted.textContent) +
            parseInt(target.dataset.cost)
        );
        target.dataset.count = parseInt(target.dataset.count) + 1;
        target.querySelector(".drink-amount").textContent =
          target.dataset.count;
        currentItem.dataset.count = parseInt(currentItem.dataset.count) - 1;
        currentItem.querySelector(".drink-count").textContent =
          currentItem.dataset.count;
        if (target.classList.contains("soldout")) {
          target.classList.remove("soldout");
          target.disabled = false;
        }
        new Audio("./audio/modal-click.mp3").play();
      });
  }

  /** btn-add 이벤트
   * 1) 잔액 업데이트 (- 해당 음료수 가격)
   * 2) 자판기 안 해당 음료수 수량 업데이트 (-1)
   * 3) 현재 장바구니 안 해당 음료수 수량 업데이트 (+1)
   * 4) 현재 장바구니 안 해당 음료수의 수량이 재고보다 많을 시 경고창 출력
   * 5) 재고가 없어질 시 품절 처리
   */
  onBtnAdd(currentItem, target) {
    currentItem.querySelector(".btn-add").addEventListener("click", () => {
      if (target.dataset.count == 0) {
        target.classList.add("soldout");
        this.onModal("No More Drink Available");
        return;
      }
      if (this.moneyToNumber(this.inserted.textContent) <= 0) {
        this.onModal("Money Needed");
        return;
      }
      this.inserted.textContent = this.numberToMoney(
        this.moneyToNumber(this.inserted.textContent) - target.dataset.cost
      );
      target.dataset.count = parseInt(target.dataset.count) - 1;
      target.querySelector(".drink-amount").textContent = target.dataset.count;
      currentItem.dataset.count = parseInt(currentItem.dataset.count) + 1;
      currentItem.querySelector(".drink-count").textContent =
        currentItem.dataset.count;
      new Audio("./audio/modal-click.mp3").play();
    });
  }

  /** btn-remove 이벤트
   * 1) 해당 음료수 active 클래스 삭제
   * 2) 잔액 업데이트 (+ 해당 음료수 가격 * 장바구니 안 해당 음료수 수량)
   * 3) 자판기 안 해당 음료수 수량 업데이트 (+ 장바구니 안 해당 음료수 수량)
   * 4) 현재 장바구니에서 해당 음료수 삭제
   * 5) 자판기 안 해당 음료수가 품절처리 됐을 시 품절 취소
   */
  onBtnRemove(currentItem, target) {
    currentItem
      .querySelector(".btn-remove")
      .addEventListener("click", async () => {
        if (!(await this.onModal("Remove Item from Cart"))) return;
        target.classList.remove("active");
        this.inserted.textContent = this.numberToMoney(
          this.moneyToNumber(this.inserted.textContent) +
            target.dataset.cost * currentItem.dataset.count
        );
        target.dataset.count =
          parseInt(target.dataset.count) + parseInt(currentItem.dataset.count);
        target.querySelector(".drink-amount").textContent =
          target.dataset.count;
        if (target.classList.contains("soldout")) {
          target.classList.remove("soldout");
          target.disabled = false;
        }
        currentItem.remove();
        new Audio("./audio/modal-click.mp3").play();
      });
  }

  /* -------- Item Generator Functions -------- */
  /** 현재 장바구니 음료수 생성 함수
   * 1) 장바구니에 이미 똑같은 음료수가 있을 시 수량 추가
   * 2) 없을 시 새로 추가
   * 3) btn-sub 이벤트 추가: 현재 장바구니 안의 해당 음료수 수량 줄이기 (0이 되는 순간 장바구니에서 삭제)
   * 4) btn-add 이밴트 추가: 현재 장바구니 안의 해당 음료수 수량 늘이기
   * 5) btn-remove 이벤트 추가: 현재 장바구니에서 해당 음료수 삭제
   */
  currentItemGenerator(target) {
    for (let i of this.listCurrent.querySelectorAll("li")) {
      if (i.dataset.item === target.dataset.item) {
        i.dataset.count = parseInt(i.dataset.count) + 1;
        i.querySelector(".drink-count").textContent = i.dataset.count;
        return;
      }
    }
    const currentItem = document.createElement("li");
    currentItem.classList.add("cart-item");
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

    // btn-sub, btn-add, btn-remove 이벤트
    this.onBtnSub(currentItem, target);
    this.onBtnAdd(currentItem, target);
    this.onBtnRemove(currentItem, target);
  }

  /** final 장바구니 음료수 생성 함수
   * 1) 장바구니에 이미 똑같은 음료수가 있을 시 수량 추가
   * 2) 없을 시 새로 추가
   */
  finalItemGenerator(target, isRandom = false) {
    for (let i of this.listFinal.querySelectorAll("li")) {
      if (i.dataset.item === target.dataset.item) {
        i.querySelector(".drink-count").textContent =
          parseInt(i.querySelector(".drink-count").textContent) +
          (isRandom ? 1 : parseInt(target.dataset.count));
        return;
      }
    }
    const finalItem = document.createElement("li");
    finalItem.classList.add("cart-item");
    if (target.dataset.item === "&#9733FE_Master&#9733") {
      finalItem.classList.add("master");
    }
    finalItem.setAttribute("data-item", target.dataset.item);
    finalItem.innerHTML = `
            <img src="./img/${target.dataset.img}" alt="${target.dataset.item}">
            <span class="drink-name">${target.dataset.item}</span>
            <span class="drink-count">${
              isRandom ? 1 : target.dataset.count
            }</span>
        `;
    this.listFinal.append(finalItem);
  }

  /* Master 음료수 생성 함수 */
  masterItemGenerator(target) {
    const masterItem = document.createElement("li");
    masterItem.classList.add("cart-item");
    masterItem.setAttribute("data-item", "&#9733FE_Master&#9733");
    masterItem.setAttribute("data-img", "master.png");
    masterItem.setAttribute("data-count", 1);
    masterItem.setAttribute("data-cost", target.dataset.cost);
    masterItem.innerHTML = `
            <img src="./img/master.png" alt="FE_Master">
            <span class="drink-name">FE_Master</span>
            <span class="drink-count">1</span>
        `;
    return masterItem;
  }

  /** Random 음료수 생성 함수 (-> final 장바구니)
   * 1) 10% 확률로 마스터 음료수 추가
   * 2) 각 18% 확률로 다른 음료수 추가
   *   - 1-18 -> 0: html
   *   - 19-36 -> 1: css
   *   - 37-54 -> 2: js
   *   - 55-72 -> 3: ts
   *   - 73-90 -> 4: react
   *   - 91-100 -> 5: master
   */
  randomItemGenerator(target) {
    const drinkItems = this.itemList.querySelectorAll("button");
    const randomList = [];
    const randIndex = [18, 36, 54, 72, 90, 100];
    for (let i = 0; i < parseInt(target.dataset.count); i++) {
      const randNum = Math.floor(Math.random() * 100) + 1;
      randomList.push(randIndex.filter((item) => item < randNum).length);
    }
    randomList.forEach((item) => {
      if (item === 5) {
        this.finalItemGenerator(this.masterItemGenerator(target));
      } else {
        this.finalItemGenerator(drinkItems[item], true);
      }
    });
  }

  /** 입금 금액 이벤트
   * 1) 사용자가 키보드를 사용해서 마이너스 값을 넣었을 때 경고창 출력
   * 2) 사용자가 키보드를 사용해서 1000원 단위보다 작은 값을 넣었을 때 반올림처리
   */
  inputPaymentEvent() {
    this.inputPayment.addEventListener("change", () => {
      const inputCost = this.moneyToNumber(this.inputPayment.value); // 입금액
      if (inputCost <= 0) {
        this.inputPayment.value = null;
        this.onModal("Invalid Money Inserted");
        return;
      }
      this.inputPayment.value = Math.round(inputCost / 1000) * 1000;
    });
  }

  /** 입금 버튼 기능
   * 1) 소지금 == 소지금 - 입금액
   * 2) 잔액 == 기존 잔액 + 입금액
   * 3) 입금액이 소지금보다 많으면 경고창 출력
   * 4) 입금액이 정상적으로 입금되면 입금창은 초기화
   */
  onBtnPayment() {
    this.btnPayment.addEventListener("click", async () => {
      const inputCost = this.moneyToNumber(this.inputPayment.value); // 입금액
      const possessedVal = this.moneyToNumber(this.possessed.textContent); // 소지금
      const insertedVal = this.moneyToNumber(this.inserted.textContent); // 잔액
      if (inputCost) {
        // 입금액이 있다면 실행
        if (inputCost <= possessedVal) {
          // 입금액이 소지금보다 적다면 실행
          this.possessed.textContent = this.numberToMoney(
            possessedVal - inputCost
          );
          this.inserted.textContent = this.numberToMoney(
            insertedVal + inputCost
          );
          this.inputPayment.value = null;
          new Audio("./audio/coin-collect.mp3").play();
        } else {
          // 입금액이 소지금보다 많다면 경고창 출력
          this.onModal("No Enough Money");
        }
      } else {
        this.onModal("Input Money");
      }
    });
  }

  /** 거스름돈 반환 버튼 기능
   * 1) 소지금 = 잔액 + 소지금
   * 2) 잔액 = 0원
   * 3) 반환할 잔액이 없을 시 경고창 출력
   */
  onBtnReturn() {
    this.btnReturn.addEventListener("click", () => {
      const possessedVal = this.moneyToNumber(this.possessed.textContent); // 소지금
      const insertedVal = this.moneyToNumber(this.inserted.textContent); // 잔액
      if (insertedVal > 0) {
        this.possessed.textContent = this.numberToMoney(
          possessedVal + insertedVal
        );
        this.inserted.textContent = this.numberToMoney(0);
        new Audio("./audio/coin-return.mp3").play();
      } else {
        this.onModal("No Money to Return");
      }
    });
  }
  /** 음료수 버튼 이벤트: 장바구니 채우기
   * 1) 아이템을 누르면 잔액 = 잔액 - 아이템 가격
   * 2) 아이템 가격이 잔액보다 크다면 경고창 출력
   * 3) 아이템이 장바구니에 들어간다.
   * 4) 아이템의 갯수가 줄어든다.
   * 5) 선택된 아이템의 class에 active가 추가된다 (색깔바뀜)
   * 6) 아이템의 count가 0이 되면 품절처리를 한다.
   */
  onBtnDrink() {
    this.itemList.querySelectorAll("button").forEach((item) => {
      this.startCount.push(item.dataset.count);
      item.addEventListener("click", (event) => {
        const insertedVal = this.moneyToNumber(this.inserted.textContent); // 잔액
        const itemCost = parseInt(event.currentTarget.dataset.cost);
        const itemCount = parseInt(event.currentTarget.dataset.count);
        const drinkCount = event.currentTarget.querySelector(".drink-amount");
        if (insertedVal >= itemCost) {
          this.inserted.textContent = this.numberToMoney(
            insertedVal - itemCost
          );
          this.currentItemGenerator(event.currentTarget);
          drinkCount.textContent = parseInt(itemCount - 1);
          item.setAttribute("data-count", itemCount - 1);
          item.classList.add("active");
        } else {
          this.onModal("No Enough Money");
        }
        if (itemCount === 1) {
          item.classList.add("soldout");
          item.disabled = true;
        }
        new Audio("./audio/button-click.mp3").play();
      });
    });
  }

  /** 획득 버튼 기능
   * 1) 현재 장바구니가 비었을 시 경고창을 출력한다
   * 2) 현재 장바구니를 비운다
   * 3) 장바구니에 있는 음료수 목록이 획득한 음료수 목록으로 이동한다.
   * 4) 총금액을 업데이트한다.
   * 5) 선택된 음료수를 리셋한다.
   */
  onBtnGain() {
    this.btnGain.addEventListener("click", async () => {
      if (!this.listCurrent.querySelector("li")) {
        this.onModal("No Item in Current Cart");
        return;
      }
      if (!(await this.onModal("Confirm Purchase"))) return;
      let totalVal = this.moneyToNumber(this.totalPrice.textContent);
      this.listCurrent.querySelectorAll("li").forEach((item) => {
        totalVal += item.dataset.count * item.dataset.cost;
        if (item.dataset.item === "Random") {
          this.randomItemGenerator(item);
        } else {
          this.finalItemGenerator(item);
        }
        item.remove();
      });
      this.itemList.querySelectorAll("button").forEach((item) => {
        item.classList.remove("active");
      });
      this.totalPrice.textContent = this.numberToMoney(totalVal);
      new Audio("./audio/gain.mp3").play();
    });
  }

  /** 리셋 버튼 기능
   * 1) 음료수의 갯수를 다시 원래의 개수로 설정한다.
   * 2) 음료수에 걸려있는 active 와 soldout 전부 삭제한다.
   * 3) 현재 장바구니를 비운다.
   * 4) 확정 장바구니를 비운다.
   * 5) 소지금을 50000원으로 설정한다.
   * 6) 잔액을 0원으로 설정한다.
   * 7) 입금액을 비운다.
   * 8) total-price를 0원으로 설정한다.
   */
  onBtnReset() {
    this.btnReset.addEventListener("click", async () => {
      if (!(await this.onModal("Reset Vending Machine"))) return;
      this.itemList.querySelectorAll("button").forEach((item, index) => {
        item.classList.remove("active");
        item.classList.remove("soldout");
        item.disabled = false;
        item.dataset.count = this.startCount[index];
        item.querySelector(".drink-amount").textContent = item.dataset.count;
      });
      this.listCurrent.querySelectorAll("li").forEach((item) => item.remove());
      this.listFinal.querySelectorAll("li").forEach((item) => item.remove());
      this.possessed.textContent = this.numberToMoney(50000);
      this.inserted.textContent = this.numberToMoney(0);
      this.inputPayment.value = null;
      this.totalPrice.textContent = this.numberToMoney(0);
    });
  }

  bindEvent() {
    this.inputPaymentEvent(); // 입금 금액 이벤트
    this.onBtnPayment(); // 입금 버튼 이벤트
    this.onBtnReturn(); // 거스름돈 반환 버튼 이벤트
    this.onBtnDrink(); // 음료수 버튼 이벤트
    this.onBtnGain(); // 획득 버튼 이벤트
    this.onBtnReset(); // 리셋 버튼 이벤트
  }
}

export default VendingMachineEvents;
