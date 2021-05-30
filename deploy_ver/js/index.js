const statusEnum = {
    DONE: 1,
    ERR: 0
}

const elementName = {
    BANNER_CONTAINER: ".banner-container",
    BANNER_SEL: ".banner-sel",
    BANNER_IMG: `${this.BANNER_SEL} img`,
    BUTTON_SEL: ".button_container .button_sel"
}

const attrEnum = {
    TRANSITION_TRANSFORM: `transform 1s ease-in-out`,
    TRANSITION_OPACITY: `opacity .3s ease-in-out`,
    NONE: 'none',
    SELECTED: 'selected'
}

const bannerConfig = {
    bannerNumber: 7,
    bannerWidth: 0,
    timeout: 1000,
    currentIndex: 1 // 从 1 开始但是包含 0 位
}

let bannerTimer = null;
let resetBannerTimer = null;

/**
 *
 * @param q
 * @returns {{data: *, status: number}}
 */
function getElement(q) {
    try {
        return {
            status: statusEnum.DONE,
            data: document.querySelector(q)
        };
    } catch (e) {
        return {
            status: statusEnum.ERR,
            data: e.toString()
        }
    }
}

/**
 *
 * @param number
 * @returns {string}
 */
function toPX(number) {
    return `${number}px`;
}

/**
 *
 * @param number
 * @returns {string}
 */
function toTranslate(number) {
    return `translateX(${toPX(number)})`
}

/**
 *
 * @param fn
 * @param delay
 */
function debounce(fn, delay) {
    let timer = null;
    return function () {
        if (timer) {
            clearTimeout(timer);
        } else {
            timer = setTimeout(fn, delay);
        }
    }
}

/**
 *
 * @param q
 * @returns {{data: string, status: number}|{data: *[], status: number}}
 */
function getElements(q) {
    try {
        return {
            status: statusEnum.DONE,
            data: [
                ...document.querySelectorAll(q)
            ]
        }
    } catch (e) {
        return {
            status: statusEnum.ERR,
            data: e.toString()
        }
    }
}

/**
 * 为DOM设置属性
 * @param target: DOMElement
 * @param arr: {}
 */
function setAttr(target, arr) {
    try {
        Object.assign(target.style, arr)
    } catch (e) {
        console.error(e);
    }
}

/**
 *
 * @returns {number}
 */
function toTranslatePX(currIndex = bannerConfig.currentIndex) {
    return -currIndex * bannerConfig.bannerWidth;
}

/**
 *
 * @param location: number
 */
function adjustBanner(location = -bannerConfig.bannerWidth) {
    const bannerContainer = getElement(elementName.BANNER_CONTAINER).data;
    const bannerSelList = getElements(elementName.BANNER_SEL).data;
    bannerConfig.bannerWidth = document.body.offsetWidth;
    location = toTranslatePX();
    setAttr(bannerContainer, {
        width: toPX(bannerConfig.bannerWidth * bannerConfig.bannerNumber),
        transform: toTranslate(location)
    });
    bannerSelList.forEach(e => {
        setAttr(e, {
            width: toPX(bannerConfig.bannerWidth)
        });
    });
}

function clearPreButton() {
    const buttons = getElements(elementName.BUTTON_SEL).data;
    buttons[bannerConfig.currentIndex - 1].classList.remove(attrEnum.SELECTED);
}

function setCurrentButton(index) {
    const buttons = getElements(elementName.BUTTON_SEL).data;
    buttons[index === bannerConfig.bannerNumber - 1 ? 0 : bannerConfig.currentIndex - 1].classList.add(attrEnum.SELECTED);
}

function toNextPage() {
    const bannerContainer = getElement(elementName.BANNER_CONTAINER).data;
    let index = bannerConfig.currentIndex + 1;
    let nextLocation = toTranslate(toTranslatePX(index));
    // console.log(index);
    clearPreButton();
    setAttr(bannerContainer, {
        transform: nextLocation,
        transition: attrEnum.TRANSITION_TRANSFORM
    });
    if (index === bannerConfig.bannerNumber - 1) {
        resetBannerTimer = setTimeout(() => {
            console.log('resetting...');
            setAttr(bannerContainer, {
                transition: attrEnum.NONE,
                transform: toTranslate(toTranslatePX(1))
            });
            bannerConfig.currentIndex = 1;
        }, 1000);
    }
    bannerConfig.currentIndex = index;
    setCurrentButton(index);
}

function setPage(index) {
    let i = index;
    return function()  {
        const bannerContainer = getElement(elementName.BANNER_CONTAINER).data;
        const buttons = getElements(elementName.BUTTON_SEL).data;
        let nextLocation = toTranslate(toTranslatePX(i));
        clearInterval(bannerTimer);
        clearPreButton();
        setAttr(bannerContainer, {
            transform: nextLocation,
            transition: attrEnum.TRANSITION_TRANSFORM
        });
        buttons[i - 1].classList.add(attrEnum.SELECTED);
        playStart();
        bannerConfig.currentIndex = i;
    }
}

/**
 *
 */
function playStart() {
    bannerTimer = setInterval(() => {
        toNextPage();
    }, 3000);
}

window.onresize = () => {
    debounce(() => {
        adjustBanner();
    }, 200)();
}

/**
 * 初始化函数
 */
(function () {
    bannerConfig.bannerWidth = document.body.offsetWidth;
    const buttons = getElements(elementName.BUTTON_SEL).data;
    buttons.forEach((i, index) => {
        i.onclick = setPage(index + 1);
    });
    adjustBanner();
    playStart();
    setTimeout(() => {
        const {'data': bannerContainer} = getElement(elementName.BANNER_CONTAINER);
        setAttr(bannerContainer, {
            transition: `${attrEnum.TRANSITION_TRANSFORM},${attrEnum.TRANSITION_OPACITY}`,
            opacity: 1
        });
    }, 0);
})();
