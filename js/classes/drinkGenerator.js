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
            const response = await fetch('./items.json');
            if(response.ok) {   // 서버의 응답 코드가 200 ~ 299일 경우
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
            const item = document.createElement('li');
            const itemTemplate = `
                <button class="btn-item" type="button" data-item="${el.name}" data-count="${el.count}" data-cost="${el.cost}" data-img="${el.img}">
                    <span class="drink-amount">${el.count}</span>
                    <img src="./img/${el.img}" alt="${el.name}">
                    <span class="drink-name">${el.name}</span>
                    <span class="drink-price"><span class="display-circle"></span>${el.cost}원</span>
                    <strong class="soldout-text"><span>품절</span></strong>
                </button>
            `;
            item.innerHTML = itemTemplate;
            docFrag.append(item);
        })
        this.itemList.append(docFrag);
    }
}

export default DrinkGenerator;