import Common from "./commonFunc.js";

class Modal {
  constructor() {
    this.common = new Common();

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
      this.modal.showModal();
      this.modal.querySelector("h2").textContent = title;
      this.modal.querySelector("p").textContent = this.msgWarning.get(title);
      this.common.allAriaLive(this.modal.querySelector("h2"));
      this.common.allAriaLive(this.modal.querySelector("p"));
      new Audio("./audio/notify.mp3").play();
      this.modal.querySelector(".btn-cancel").addEventListener("click", () => {
        resolve(0);
      });
      this.modal.querySelector(".btn-yes").addEventListener("click", () => {
        resolve(1);
      });
    });
  }
}

export default Modal;
