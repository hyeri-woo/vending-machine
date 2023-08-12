import CartDrinkGenerator from "./cartDrinkGenerator.js";
import Modal from "./modals.js";
import Common from "./commonFunc.js";

class VendingMachineEvents {
  constructor() {
    this.cartDrinkGenerator = new CartDrinkGenerator();
    this.modal = new Modal();
    this.common = new Common();

    // vending machine DOM
    const vendingMachine = document.querySelector(".section-vending");
    this.inserted = vendingMachine.querySelector(".inserted .money");
    this.itemList = vendingMachine.querySelector(".list-drink");
    this.inputPayment = vendingMachine.querySelector(".input-payment");
    this.btnReturn = vendingMachine.querySelector(".btn-return");
    this.btnPayment = vendingMachine.querySelector(".btn-payment");
    this.btnGain = vendingMachine.querySelector(".btn-gain");
    this.listCurrent = vendingMachine.querySelector(".list-currentCart");

    // reciept DOM
    const reciept = document.querySelector(".section-reciept");
    this.possessed = reciept.querySelector(".possessed .money");
    this.listFinal = reciept.querySelector(".list-finalCart");
    this.totalPrice = reciept.querySelector(".total-price span");

    // reset DOM
    this.btnReset = document.querySelector(".btn-reset");
    this.startCount = []; // 음료수 갯수 배열
  }

  /** 입금 금액 이벤트
   * 1) 사용자가 키보드를 사용해서 마이너스 값을 넣었을 때 경고창 출력
   * 2) 사용자가 키보드를 사용해서 1000원 단위보다 작은 값을 넣었을 때 반올림처리
   */
  inputPaymentEvent() {
    this.inputPayment.addEventListener("change", () => {
      const inputCost = this.common.moneyToNumber(this.inputPayment.value); // 입금액
      if (inputCost <= 0) {
        this.inputPayment.value = null;
        this.modal.onModal("Invalid Money Inserted");
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
    this.btnPayment.addEventListener("click", async (event) => {
      event.preventDefault();
      const inputCost = this.common.moneyToNumber(this.inputPayment.value); // 입금액
      const possessedVal = this.common.moneyToNumber(
        this.possessed.textContent
      ); // 소지금
      const insertedVal = this.common.moneyToNumber(this.inserted.textContent); // 잔액
      if (inputCost) {
        // 입금액이 있다면 실행
        if (inputCost <= possessedVal) {
          // 입금액이 소지금보다 적다면 실행
          this.possessed.textContent = this.common.numberToMoney(
            possessedVal - inputCost
          );
          this.inserted.textContent = this.common.numberToMoney(
            insertedVal + inputCost
          );
          this.inputPayment.value = null;
          this.common.allAriaLive(document.querySelector(".possessed"));
          this.common.allAriaLive(document.querySelector(".inserted"));
          new Audio("./audio/coin-collect.mp3").play();
        } else {
          // 입금액이 소지금보다 많다면 경고창 출력
          this.modal.onModal("No Enough Money");
        }
      } else {
        this.modal.onModal("Input Money");
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
      const possessedVal = this.common.moneyToNumber(
        this.possessed.textContent
      ); // 소지금
      const insertedVal = this.common.moneyToNumber(this.inserted.textContent); // 잔액
      if (insertedVal > 0) {
        this.possessed.textContent = this.common.numberToMoney(
          possessedVal + insertedVal
        );
        this.inserted.textContent = this.common.numberToMoney(0);
        this.common.allAriaLive(document.querySelector(".possessed"));
        this.common.allAriaLive(document.querySelector(".inserted"));
        new Audio("./audio/coin-return.mp3").play();
      } else {
        this.modal.onModal("No Money to Return");
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
        const insertedVal = this.common.moneyToNumber(
          this.inserted.textContent
        ); // 잔액
        const itemCost = parseInt(event.currentTarget.dataset.cost);
        const itemCount = parseInt(event.currentTarget.dataset.count);
        const drinkCount = event.currentTarget.querySelector(
          ".drink-amount .money"
        );
        if (insertedVal >= itemCost) {
          this.inserted.textContent = this.common.numberToMoney(
            insertedVal - itemCost
          );
          this.cartDrinkGenerator.currentItemGenerator(event.currentTarget);
          drinkCount.textContent = parseInt(itemCount - 1);
          item.setAttribute("data-count", itemCount - 1);
          item.classList.add("active");
          this.common.allAriaLive(document.querySelector(".inserted"));
          this.common.allAriaLive(
            event.currentTarget.querySelector(".drink-amount")
          );
          this.common.announceMessage(
            item.dataset.item + " 1개를 장바구니에 담았습니다."
          );
        } else {
          this.modal.onModal("No Enough Money");
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
        this.modal.onModal("No Item in Current Cart");
        return;
      }
      if (!(await this.modal.onModal("Confirm Purchase"))) return;
      let totalVal = this.common.moneyToNumber(this.totalPrice.textContent);
      let msg = "";
      this.listCurrent.querySelectorAll("li").forEach((item) => {
        totalVal += item.dataset.count * item.dataset.cost;
        msg += `${item.dataset.item} ${item.dataset.count}개 총 ${totalVal}원치, `;
        if (item.dataset.item === "Random") {
          this.cartDrinkGenerator.randomItemGenerator(item);
        } else {
          this.cartDrinkGenerator.finalItemGenerator(item);
        }
        item.remove();
      });
      this.itemList.querySelectorAll("button").forEach((item) => {
        item.classList.remove("active");
      });
      this.totalPrice.textContent = this.common.numberToMoney(totalVal);
      new Audio("./audio/gain.mp3").play();
      this.common.announceMessage("현재 " + msg + "음료수를 구매했습니다.");
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
      if (!(await this.modal.onModal("Reset Vending Machine"))) return;
      this.common.announceMessage("밴딩머신이 모두 리셋되었습니다.");
      this.itemList.querySelectorAll("button").forEach((item, index) => {
        item.classList.remove("active");
        item.classList.remove("soldout");
        item.disabled = false;
        item.dataset.count = this.startCount[index];
        item.querySelector(".drink-amount .money").textContent =
          item.dataset.count;
      });
      this.listCurrent.querySelectorAll("li").forEach((item) => item.remove());
      this.listFinal.querySelectorAll("li").forEach((item) => item.remove());
      this.possessed.textContent = this.common.numberToMoney(50000);
      this.inserted.textContent = this.common.numberToMoney(0);
      this.inputPayment.value = null;
      this.totalPrice.textContent = this.common.numberToMoney(0);
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
