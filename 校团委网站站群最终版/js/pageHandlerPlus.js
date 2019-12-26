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