class DrinkGenerator {
  constructor() {
    this.itemList = document.querySelector(".section-vending .list-drink");
  }

  async setup() {
    const response = await this.loadData();
    this.drinkFactory(response);
  }

  async loadData() {
    try {
      const response = await fetch("./items.json");
      if (response.ok) {
        // 서버의 응답 코드가 200 ~ 299일 경우
        return response.json();
      } else {
        throw new Error(response.status);
      }
    } catch (error) {
      console.log(error);
    }
  }

  drinkFactory(data) {
    const docFrag = document.createDocumentFragment();
    data.forEach((el) => {
      const item = document.createElement("li");
      if (el.name === "Random") {
        const itemTemplate = `
                    <button class="btn-item" type="button" data-item="${el.name}" data-count="${el.count}" data-cost="${el.cost}" data-img="${el.img}">
                        <img src="./img/${el.img}" alt="">
                        <span class="drink-name">${el.name}</span>
                        <span class="drink-price"><span class="display-circle"></span>${el.cost}원</span>
                        <span class="drink-amount"><span class="a11y-hidden">재고가</span><span class="money">${el.count}</span><span class="a11y-hidden">개 남았습니다.</span></span>
                        <span class="icon-question">?</span>
                        <span class="explain-question">10% 확률로 <strong>프론트엔드 마스터 음료수</strong>를 </br> 뽑을 수 있습니다.</span>
                        <span class="a11y-hidden">랜덤 음료수의 경우 10% 확률로 <strong>프론트엔드 마스터 음료수</strong>를 </br> 뽑을 수 있습니다.</span>
                        <strong class="soldout-text"><span>품절</span></strong>
                    </button>
                `;
        item.innerHTML = itemTemplate;
      } else {
        const itemTemplate = `
                    <button class="btn-item" type="button" data-item="${el.name}" data-count="${el.count}" data-cost="${el.cost}" data-img="${el.img}">
                        <img src="./img/${el.img}" alt="">
                        <span class="drink-name">${el.name} </span>
                        <span class="drink-price"><span class="display-circle"></span>${el.cost}원</span>
                        <span class="drink-amount"><span class="a11y-hidden">재고가</span><span class="money">${el.count}</span><span class="a11y-hidden">개 남았습니다.</span></span>
                        <strong class="soldout-text"><span>품절</span></strong>
                    </button>
                `;
        item.innerHTML = itemTemplate;
      }

      docFrag.append(item);
    });
    this.itemList.append(docFrag);
  }
}

export default DrinkGenerator;
