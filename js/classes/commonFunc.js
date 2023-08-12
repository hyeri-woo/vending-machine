class Common {
  constructor() {}
  /* -------- COMMON FUNCTIONS -------- */
  /* string 돈을 number로 변환하는 함수 */
  moneyToNumber(str_money) {
    return parseInt(str_money.replace("원", "").replaceAll(",", ""));
  }

  /* number을 string 변환하는 함수 */
  numberToMoney(num_money) {
    return new Intl.NumberFormat().format(num_money) + "원";
  }

  /* aria-live를 글 전체에다 적용하는 함수 */
  allAriaLive(target) {
    target.setAttribute("aria-live", "off");
    target.offsetWidth;
    target.setAttribute("aria-live", "polite");
    setTimeout(() => {
      target.removeAttribute("aria-live");
    }, 1000);
  }

  /* 이밴트를 스크린리더를 통해 말해주는 함수 */
  announceMessage(message) {
    console.log(message);
    const liveRegion = document.createElement("div");
    liveRegion.setAttribute("role", "region");
    liveRegion.setAttribute("aria-live", "assertive");
    liveRegion.classList.add("a11y-hidden");
    liveRegion.textContent = message;
    document.body.appendChild(liveRegion);
    setTimeout(() => {
      liveRegion.remove();
    }, 3000);
  }
}

export default Common;
