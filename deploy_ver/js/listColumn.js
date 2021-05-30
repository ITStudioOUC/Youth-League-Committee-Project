const statusEnum = {
    DONE: 1,
    ERR: 0
}

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

function createElement(tagName, attr) {
    let tag = document.createElement(tagName);
    Object.assign(tag, attr);
    return tag;
}

function setAttr(target, arr) {
    try {
        Object.assign(target.style, arr)
    } catch (e) {
        console.error(e);
    }
}

function initLeftNav() {
    let container = getElement(".child_selection>div .wp_listcolumn").data;
    let lists = getElements(".child_selection>div .wp_listcolumn .wp_column").data;

    lists.forEach(i => {
        i.classList.remove(["wp_column"]);
    });
    container.classList.remove("wp_listcolumn");
}

function initArticleList() {
    let preContainer = getElement("#body .right_list .wp_article_list").data;
    let articleList = getElements("#body .right_list .wp_article_list .list_item").data;
    let container = createElement("ul");
    let containerPar = getElement("#body .right_list").data;
    articleList.forEach(i => {
        let article = createElement("li");
        let articleTitleLink = i.querySelector(".Article_Title a");
        let articleTitle  = articleTitleLink.innerText;
        let articleTime = i.querySelector(".Article_PublishDate").innerText.split("-");
        let articleSubTitleLink = i.querySelector(".Article_Summary a");
        let articleSubTitle = articleSubTitleLink.innerText;
        let time = `<div class="time"><div class="month">${articleTime[1]}-${articleTime[2]}</div><div class="year">${articleTime[0]}</div></div>`;
        let contentContainer = createElement("div", {
            className: "content_container"
        });
        Object.assign(articleTitleLink, {
            innerHTML: `<div class="content">${articleTitle}</div>`
        });
        Object.assign(articleSubTitleLink, {
            className: "child_content",
            innerHTML: `<div class="content">${articleSubTitle}</div>`
        });
        contentContainer.appendChild(articleTitleLink);
        contentContainer.appendChild(articleSubTitleLink);
        article.innerHTML = time;
        article.appendChild(contentContainer);
        container.appendChild(article);
    });
    containerPar.insertBefore(container, getElement("#body .right_list>div").data);
    setAttr(preContainer, {
        display: "none"
    });
}

function initPageButton() {
    let first = document.getElementsByClassName('first')[0];
    let pre = document.getElementsByClassName('prev')[0];
    let next = document.getElementsByClassName('next')[0];
    let last = document.getElementsByClassName('last')[0];

    const target = {
        first,
        pre,
        next,
        last
    };

    console.log(target);

    const targetInnerHtml = {
        first: `<div class="page_button none"><div class="pre_pre"></div></div>`,
        pre: `<div class="page_button none"><div class="pre"></div></div>`,
        next: `<div class="page_button"><div class="next"></div></div>`,
        last: `<div class="page_button"><div class="next_next"></div></div>`
    };

    for(let item in targetInnerHtml) {
        target[item].innerHTML = targetInnerHtml[item];
    }
}

window.addEventListener('DOMContentLoaded', () => {
    try {
        initLeftNav();
        initArticleList();
        initPageButton();
    } catch (e) {
        console.log(e);
        console.log("Unexpected errors occurred");
    }
});
