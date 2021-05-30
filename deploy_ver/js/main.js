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

function toPX(number) {
    return `${number}px`;
}

function toTranslate(number) {
    return `translateX(${toPX(number)})`
}

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

function setAttr(target, arr) {
    try {
        Object.assign(target.style, arr)
    } catch (e) {
        console.error(e);
    }
}

function toTranslatePX(currIndex = bannerConfig.currentIndex) {
    return -currIndex * bannerConfig.bannerWidth;
}

function adjustBanner(location = -bannerConfig.bannerWidth) {
    try {
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
    } catch (e) {
        console.log(e);
        console.log("Unexpected errors occurred while handling banner module");
    }
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

function playStart() {
    bannerTimer = setInterval(() => {
        toNextPage();
    }, 3000);
}

function createElement(tagName, attr) {
    let tag = document.createElement(tagName);
    Object.assign(tag, attr);
    return tag;
}

function initBanner() {
    const list = getElements(".banner-container .banner-sel").data;
    const container = getElement(".banner-container").data;
    const banner = getElement(".Banner").data;
    list.forEach(i => {
        let container = i.querySelector("a");
        let img = i.querySelector(".banner-img img");
        let title_container = document.createElement("h3");
        title_container.innerText = i.querySelector(".banner-title").innerText;
        container.appendChild(img);
        container.appendChild(title_container);
        i.querySelector(".banner-img").remove();
        i.querySelector(".banner-title").remove();
    });
    let fakeFirst = list[list.length - 1].cloneNode(true);
    let fakeLast = list[0].cloneNode(true);
    container.insertBefore(fakeFirst, list[0]);
    container.appendChild(fakeLast);
    let btnContainer = createElement("ul", {
        className: "button_container"
    });
    for (let i = 0; i < bannerConfig.bannerNumber - 2; i++) {
        let btn = createElement("li", {
            className: i === 0 ? "button_sel selected" : "button_sel"
        });
        btnContainer.appendChild(btn);
    }
    banner.appendChild(btnContainer);

    bannerConfig.bannerWidth = document.body.offsetWidth;
    const buttons = getElements(elementName.BUTTON_SEL).data;
    buttons.forEach((i, index) => {
        i.onclick = setPage(index + 1);
    });
}

function initWorkingProcess() {
    // 初始化左边图片
    let img = getElement(".work-process-left-part .image img").data;
    let tempParent = img.parentNode;
    let imgContainer = getElement(".work-process-left-part .image").data;
    imgContainer.appendChild(img);
    tempParent.remove();

    // 初始化标题并放入a标签
    let mainTitle = getElement(".work-process-left-part .detail .main-title span").data;
    let subTitle = getElement(".work-process-left-part .detail .sub-title span").data;
    let mainTitleContainer = getElement(".work-process-left-part .detail .main-title").data;
    let subTitleContainer = getElement(".work-process-left-part .detail .sub-title").data;
    let detail = getElement(".work-process-left-part .detail").data;
    let redirectTag = getElement(".work-process-left-sel a").data;
    Object.assign(
        mainTitleContainer,
        {
            innerText: mainTitle.innerText
        });
    Object.assign(
        subTitleContainer,
        {
            innerText: subTitle.innerText
        });
    redirectTag.appendChild(imgContainer);
    redirectTag.appendChild(detail);

    mainTitle.remove();
    subTitle.remove();

    // 获取第一条数据的时间
    let firstNews = getElement(".work-display .right .list_item:first-child").data;
    let firstNewsWithPicDateContainer = getElement(".work-display .left .date span").data;
    Object.assign(firstNewsWithPicDateContainer, {
        innerText: firstNews.querySelector(".Article_PublishDate").innerText
    });

    // 移除右侧第一条数据
    firstNews.remove();

    // 处理右侧
    try {
        let temp = getElements(".work-display .more").data[1].querySelector("a").cloneNode();
        Object.assign(temp, {
            innerText: "更多"
        });
        let moreContainer = getElement(".work-display .title .more").data;
        moreContainer.appendChild(temp);
    } catch (e) {
        console.log(e);
        console.log("Error occurred while parsing more-link in work display module");
    }
    // .news-container
    let preListContainer = getElement(".work-display .right .wp_article_list").data;
    let preList = [...preListContainer.querySelectorAll(".list_item")];
    let container = createElement("div", {
        className: "news-container"
    });
    let containerParent = getElement(".work-display .right").data;
    preList.forEach(i => {
        let to = i.querySelector(".Article_Title a");
        let title = to.innerText;
        let date = i.querySelector(".Article_PublishDate");
        let par = createElement("div", {
            className: "news-sel"
        });
        let titleContainer = createElement("div");
        let dateContainer = createElement("div", {
            className: "date"
        });
        titleContainer.setAttribute("class", "news-title");
        date.className = "";
        to.innerText = "";
        titleContainer.innerText = title;
        dateContainer.appendChild(date.cloneNode(true));
        to.appendChild(titleContainer);
        to.appendChild(dateContainer);
        par.appendChild(to.cloneNode(true));
        container.appendChild(par);
    });
    preListContainer.remove();
    setAttr(
        getElement(".work-display .right>div").data,
        {
            display: "none"
        }
    );
    containerParent.appendChild(container);
}

function initNotice() {
    let preListContainer = getElement(".notice .wp_article_list").data;
    let preList = getElements(".notice .wp_article_list .list_item").data;
    let container = createElement("div", {
        className: "notice-container"
    });
    let containerPar = getElement(".notice").data;
    try {
        let temp = getElements(".notice .more").data[1].querySelector("a").cloneNode();
        Object.assign(temp, {
            innerText: "更多"
        });
        let moreContainer = getElement(".notice .title .more").data;
        moreContainer.appendChild(temp);
    } catch (e) {
        console.log(e);
        console.log("Error occurred while parsing more-link of notice module");
    }
    preList.forEach(i => {
        let to = i.querySelector(".Article_Title a");
        let title = to.innerText;
        let date = i.querySelector(".Article_PublishDate").innerText.split("-");
        let timeContainer = createElement("div", {
            className: "time"
        });
        let titleContainer = createElement("div", {
            className: "notice-title"
        });
        let par = createElement("div", {
            className: "notice-sel"
        });
        timeContainer.innerHTML = `<div class="month">${date[1]}-${date[2]}</div><div class="year">${date[0]}</div>`;
        titleContainer.innerText = title;
        to = to.cloneNode(false);
        to.appendChild(timeContainer);
        to.appendChild(titleContainer);
        par.appendChild(to);
        container.appendChild(par);
    });
    preListContainer.remove();
    setAttr(
        getElement(".notice-container").data,
        {
            display: "none"
        }
    );
    containerPar.appendChild(container);
}

function initFocus() {
    let preListContainer = getElement(".focus-front .wp_article_list").data;
    let preList = getElements(".focus-front .wp_article_list .list_item").data;
    let container = createElement("ul", {
        className: "focus-container"
    });
    let containerPar = getElement(".focus-front").data;
    try {
        let temp = getElements(".focus-front .more").data[1].querySelector("a").cloneNode();
        Object.assign(temp, {
            innerText: "更多"
        });
        let moreContainer = getElement(".focus-front .title .more").data;
        moreContainer.appendChild(temp);
    } catch (e) {
        console.log(e);
        console.log("Error occurred while parsing more-link of focus module");
    }
    preList.forEach(i => {
        let to = i.querySelector(".Article_Title a");
        let title = to.innerText;
        let date = i.querySelector(".Article_PublishDate").innerText.split("-");
        let subTitle = i.querySelector(".Article_Summary a").innerText;

        let timeContainer = createElement("div", {
            className: "date"
        });
        let titleContainer = createElement("div", {
            className: "focus-title"
        });
        let par = createElement("div", {
            className: "focus-sel"
        });
        timeContainer.innerHTML = `<div class="month">${date[1]}-${date[2]}</div><div class="year">${date[0]}</div>`;
        titleContainer.innerHTML = `<div class="main-title">${title}</div><div class="sub-title">${subTitle}</div>`;

        to = to.cloneNode(false);
        to.appendChild(titleContainer);
        to.appendChild(timeContainer);
        par.appendChild(to);
        container.appendChild(par);
    });
    preListContainer.remove();
    setAttr(
        getElement(".focus-container").data,
        {
            display: "none"
        }
    );
    containerPar.appendChild(container);
}

function initUtil() {
    // main util
    let mainUtils = getElements(".main-util").data;
    mainUtils.forEach(i => {
         let target = i.querySelector(".Article_Title a").href;
         let util = i.querySelector("a");
         Object.assign(util, {
             href: target
         });
         setAttr(i.querySelector(".wp_article_list"), {
             display: "none"
         });
    });

    // other-util
    let otherUtils = getElements(".other-util").data;
    otherUtils.forEach(i => {
        let target = i.querySelector(".Article_Title a").href;
        let util = i.querySelector("a");
        Object.assign(util, {
            href: target
        });
        setAttr(i.querySelector(".wp_article_list"), {
            display: "none"
        });
    });
}

function initFooterNav() {
    let list = getElements("#Footer .link-container>div").data;
    let container = getElement("#Footer .link-container").data;
    list.forEach(i => {
        let navContainer = createElement("div", {
            className: "link"
        });
        let nav = i.querySelector(".Article_Title a").cloneNode(true);
        navContainer.appendChild(nav);
        container.appendChild(navContainer);
        setAttr(i, {
            display: "none"
        });
    });
}


window.addEventListener('DOMContentLoaded', () => {
    try {
        initBanner();
        adjustBanner();
        playStart();
        initWorkingProcess();
        initFocus();
        initNotice();
        initUtil();
        initFooterNav();
        setTimeout(() => {
            try {
                const {'data': bannerContainer} = getElement(elementName.BANNER_CONTAINER);
                setAttr(bannerContainer, {
                    transition: `${attrEnum.TRANSITION_TRANSFORM},${attrEnum.TRANSITION_OPACITY}`,
                    opacity: 1
                });
            } catch (e) {
                console.log(e);
                console.log("Unexpected errors occurred in banner module");
            }
        }, 0);
        setAttr(getElement(".cover-container").data, {
            opacity: 0
        });
        setTimeout(() => {
            getElement(".cover-container").data.remove();
        }, 500);
    } catch (e) {
        console.log(e);
        console.log("Unexpected errors occurred");
        document.getElementsByClassName("message")[0].innerText = "未知错误发生，请升级您的浏览器版本或联系网站管理员";
    }


    window.onresize = () => {
        debounce(() => {
            try {
                adjustBanner();
            } catch (e) {
                console.log(e);
                console.log("Unexpected errors occurred while handling banner module");
            }
        }, 200)();
    }
});
