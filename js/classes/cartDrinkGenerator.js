import Modal from "./modals.js";
import Common from "./commonFunc.js";

class CartDrinkGenerator {
  constructor() {
    this.modal = new Modal();
    this.common = new Common();

    const vendingMachine = document.querySelector(".section-vending");
    this.inserted = vendingMachine.querySelector(".inserted .money");
    this.itemList = vendingMachine.querySelector(".list-drink");
    this.listCurrent = vendingMachine.querySelector(".list-currentCart");
    this.listFinal = document.querySelector(".section-reciept .list-finalCart");
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
          if (!(await this.modal.onModal("Remove Item from Cart"))) return;
          target.classList.remove("active");
          currentItem.remove();
        }
        this.inserted.textContent = this.common.numberToMoney(
          this.common.moneyToNumber(this.inserted.textContent) +
            parseInt(target.dataset.cost)
        );
        target.dataset.count = parseInt(target.dataset.count) + 1;
        target.querySelector(".drink-amount .money").textContent =
          target.dataset.count;
        currentItem.dataset.count = parseInt(currentItem.dataset.count) - 1;
        currentItem.querySelector(".drink-count .money").textContent =
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
        this.modal.onModal("No More Drink Available");
        return;
      }
      if (this.common.moneyToNumber(this.inserted.textContent) <= 0) {
        this.modal.onModal("Money Needed");
        return;
      }
      this.inserted.textContent = this.common.numberToMoney(
        this.common.moneyToNumber(this.inserted.textContent) -
          target.dataset.cost
      );
      target.dataset.count = parseInt(target.dataset.count) - 1;
      target.querySelector(".drink-amount .money").textContent =
        target.dataset.count;
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
        if (!(await this.modal.onModal("Remove Item from Cart"))) return;
        target.classList.remove("active");
        this.inserted.textContent = this.common.numberToMoney(
          this.common.moneyToNumber(this.inserted.textContent) +
            target.dataset.cost * currentItem.dataset.count
        );
        target.dataset.count =
          parseInt(target.dataset.count) + parseInt(currentItem.dataset.count);
        target.querySelector(".drink-amount .money").textContent =
          target.dataset.count;
        if (target.classList.contains("soldout")) {
          target.classList.remove("soldout");
          target.disabled = false;
        }
        currentItem.remove();
        new Audio("./audio/modal-click.mp3").play();
      });
  }

  btnKeyboard(currentItem) {
    currentItem.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        currentItem.querySelector(".btn-sub").click();
        this.common.allAriaLive(currentItem);
      } else if (event.key === "ArrowRight") {
        currentItem.querySelector(".btn-add").click();
        this.common.allAriaLive(currentItem);
      } else if (event.key === "ArrowUp") {
        currentItem.querySelector(".btn-remove").click();
      }
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
        i.querySelector(".drink-count .money").textContent = i.dataset.count;
        return;
      }
    }
    const currentItem = document.createElement("li");
    currentItem.classList.add("cart-item");
    currentItem.setAttribute("class", "cart-item");
    currentItem.setAttribute("tabindex", 0);
    currentItem.setAttribute("data-item", target.dataset.item);
    currentItem.setAttribute("data-img", target.dataset.img);
    currentItem.setAttribute("data-count", 1);
    currentItem.setAttribute("data-cost", target.dataset.cost);
    currentItem.innerHTML = `
        <img src="./img/${target.dataset.img}" alt="">
        <span class="drink-name"><span class="a11y-hidden">장바구니에 </span>${target.dataset.item}</span>
        <span class="drink-count"><span class="money">1</span><span class="a11y-hidden">개가 있습니다.</span></span>
        <span class="a11y-hidden">수량을 조절하기 위해서 좌우 방향 키보드를 사용하시고 아이템을 장바구니에서 삭제하기 위해서는 위쪽 화살표를 눌러주세요.</span>
        <button class="btn-sub" type="button">-</button>
        <button class="btn-add" type="button">+</button>
        <button class="btn-remove" type="button">x</button>
        `;
    this.listCurrent.append(currentItem);

    // btn-sub, btn-add, btn-remove 이벤트
    this.onBtnSub(currentItem, target);
    this.onBtnAdd(currentItem, target);
    this.onBtnRemove(currentItem, target);
    this.btnKeyboard(currentItem);
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
}

export default CartDrinkGenerator;
