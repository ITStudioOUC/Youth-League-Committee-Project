let bannerContainer = document.getElementsByClassName('banner_container_new')[0];
let bannerItems = document.getElementsByClassName('banner_item_new');
let buttonBox = document.getElementsByClassName('button_box')[0];
let buttonList = document.getElementsByClassName('button_child');
buttonList = new Array(...buttonList);
let liList = document.getElementsByClassName('button');
let currentIndex = 1;
let bannerItemNumber = bannerItems.length;
let windowWidth = 0;
const keyWords = {
    buttonSelected: 'button selected',
    button: 'button'
};
const transitionOption = "left 0.5s";


function bannerHandler() {
    windowWidth =  document.body.offsetWidth;
    bannerContainer.style.width = `${bannerItemNumber * windowWidth}px`;
    bannerContainer.style.left = `-${currentIndex * windowWidth}px`;
    for(let item of bannerItems) {
        item.style.width = `${windowWidth}px`;
    }
}

(function initBannerList() {
    let firstChild = bannerItems[0].cloneNode(true);
    let lastChild = bannerItems[bannerItemNumber - 1].cloneNode(true);
    bannerContainer.appendChild(firstChild);
    bannerContainer.insertBefore(lastChild, bannerItems[0]);
    bannerItems = document.getElementsByClassName('banner_item_new');
    bannerItemNumber = bannerItems.length;
    bannerHandler();
})();

function bannerContainerMotion(index){
    bannerContainer.style.left = `-${(index) * windowWidth}px`
}

function bannerButtonMotion(index, status) {
    liList[index].className = status ? keyWords.buttonSelected : keyWords.button;
}

document.body.onresize = bannerHandler;

let lock = false;
function timerHandler() {
    const preIndex = currentIndex;
    currentIndex++;
    bannerContainerMotion(currentIndex);
    bannerButtonMotion((preIndex - 1) % 5, false);
    bannerButtonMotion((currentIndex - 1) % 5, true);
    if(currentIndex >= 6) {
        clearInterval(timer);
        lock = true;
        setTimeout(function () {
            bannerContainer.style.transitionProperty = "none";
            currentIndex = 1;
            bannerContainerMotion(currentIndex);
        }, 500);
        setTimeout(function () {
            bannerContainer.style.transitionProperty = "left";
            lock = false;
            timer = setInterval(timerHandler, 2000);
        }, 550);
    }
}

let timer = setInterval(timerHandler, 2000);

function clickHandler(e) {
    if(e.target.tagName.toLocaleLowerCase() === 'a') {
        clearInterval(timer);
        e.preventDefault();
        bannerButtonMotion(currentIndex - 1, false);
        currentIndex = buttonList.indexOf(e.target) + 1;
        bannerContainerMotion(currentIndex);
        bannerButtonMotion(currentIndex - 1, true);
        timer = setInterval(timerHandler, 2000);
    }
}

buttonBox.onclick = clickHandler;
