class StartScreenEvents {
    constructor() {
        this.header = document.querySelector("header");
        this.logo = this.header.querySelector("h1");
        this.pressStart = this.header.querySelector("h2");
        this.slot = this.header.querySelector(".slot-wrapper");

        this.startBgmAudio = new Audio("./audio/start-bgm.mp3");
        this.startBgmAudio.loop = true;
        this.startBgmAudio.volume = 0.3;
        // this.startBgmAudio.play().catch(function(error) {
        //     console.log("Chrome cannot play sound without user interaction first");
        // });

        this.btnPause = document.querySelector(".btn-pause");
    }

    bindEvent() {
        /** 시작 화면 클릭 이벤트
         *  1) 뒤의 자판기 화면을 보여준다
         *  2) bgm을 시작한다. 
         */
        const bgmAudio = new Audio("./audio/bgm.mp3");
        this.header.addEventListener("click", (event) => {
            event.currentTarget.style.position = "static";
            event.currentTarget.style.cursor = "initial";
            this.pressStart.style.display = "none";
            this.slot.style.display = "none";
            new Audio("./audio/start.mp3").play();
            setTimeout(function() {
                if(this.startBgmAudio != null) {
                    this.startBgmAudio.pause();
                }
                bgmAudio.loop = true;
                bgmAudio.volume = 0.3;
                bgmAudio.play();
            }, 1500);
        });

        /** pause 버튼 클릭 이벤트
         *  1) bgm이 나오고 있을 때 노래를 멈추고 button의 표시를 resume으로 바꾼다.
         */
        this.btnPause.addEventListener("click", () => {
            const noticePlaying = document.querySelector(".button-wrapper .notice-playing");
            if(bgmAudio.paused === true) {
                this.btnPause.querySelector(".text").textContent = "||";
                noticePlaying.innerHTML = "bgm is playing ~ &#9834";
                this.btnPause.querySelector(".notice-text").textContent = "music start";
                bgmAudio.play();
            } else {
                this.btnPause.querySelector(".text").innerHTML = "&#9654";
                noticePlaying.textContent = "bgm is not playing";
                this.btnPause.querySelector(".notice-text").textContent = "music pause";
                bgmAudio.pause();
            }
        })
    }
}

export default StartScreenEvents;