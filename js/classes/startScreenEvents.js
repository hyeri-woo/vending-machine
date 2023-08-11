class StartScreenEvents {
  constructor() {
    this.header = document.querySelector("header");
    this.logo = this.header.querySelector("h1");
    this.btnPress = this.header.querySelector(".btn-press");
    this.slot = this.header.querySelector(".slot-wrapper");
    this.btnPause = document.querySelector(".btn-pause");
  }

  removeStartScreen(event) {
    event.currentTarget.style.position = "static";
    event.currentTarget.style.cursor = "initial";
    this.btnPress.style.display = "none";
    this.slot.style.display = "none";
  }

  /**
   * 시작 화면 포커스 이벤트
   */
  focusEvent(bgmAudio) {
    this.header.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        this.btnPress.focus();
      } else if (event.key === "Enter") {
        this.removeStartScreen(event);
      }
    });

    document.addEventListener("keydown", (event) => {
      console.log(event.keycode);
      //   if (bgmAudio.paused === true && event.key === '') {
    });
  }

  /**
   * 시작 화면 클릭 이벤트
   *  1) 뒤의 자판기 화면을 보여준다
   *  2) bgm을 시작한다.
   */
  startEvent(bgmAudio) {
    this.header.addEventListener(
      "click",
      (event) => {
        this.removeStartScreen(event);
        new Audio("./audio/start.mp3").play();
        setTimeout(function () {
          bgmAudio.loop = true;
          bgmAudio.volume = 0.3;
          bgmAudio.play();
        }, 1500);
      },
      { once: true }
    );
  }

  /**
   * pause 버튼 클릭 이벤트
   *  1) bgm이 나오고 있을 때 노래를 멈추고 button의 표시를 resume으로 바꾼다.
   *  2) bgm이 멈췄을 때 노래를 시작하고 button의 표시를 pause로 바꾼다.
   */
  pauseEvent(bgmAudio) {
    this.btnPause.addEventListener("click", () => {
      const noticePlaying = document.querySelector(
        ".button-wrapper .notice-playing"
      );
      if (bgmAudio.paused === true) {
        this.btnPause.querySelector(".text").textContent = "||";
        noticePlaying.innerHTML = "bgm is playing ~ &#9834";
        this.btnPause.querySelector(".notice-text").textContent =
          "music started";
        bgmAudio.play();
      } else {
        this.btnPause.querySelector(".text").innerHTML = "&#9654";
        noticePlaying.textContent = "no bgm playing";
        this.btnPause.querySelector(".notice-text").textContent =
          "music paused";
        bgmAudio.pause();
      }
    });
  }

  bindEvent() {
    const bgmAudio = new Audio("./audio/bgm.mp3");
    this.focusEvent(bgmAudio);
    this.startEvent(bgmAudio);
    this.pauseEvent(bgmAudio);
  }
}

export default StartScreenEvents;
