const container = document.getElementsByClassName('navigator_container')[0];
const childList = document.getElementsByClassName('child_list');
const extendButtonList = new Array(...document.getElementsByClassName('extend_button'));
const hoverClassName = ['child_list', 'child_list_item'];
const extendPattern = /extend_button/;
const linkPattern = /nav_link|navigator_container/;
const unselected = 'child_list';
const selected = 'child_list shown';
let preIndex = -1;

function mount(index) {
    childList[index].className = selected;
    if((preIndex > -1) && (preIndex !== index)) {
        childList[preIndex].className = unselected;
    }
    preIndex = index;
}

function close(){
    if(preIndex > -1) {
        childList[preIndex].className = unselected;
        preIndex = -1;
    }
}

function hoverHandler(e) {
    let target = e.target;
    if((extendPattern.test(target.className) || hoverClassName.indexOf(target.className))) {
        if((extendPattern.test(target.className))){
            let index = extendButtonList.indexOf(target);
            mount(index);
        }
    }
}

function outHandler(e) {
    let target = e.target;
    if(linkPattern.test(target.className)) {
        close();
    }
}

container.onmouseover = hoverHandler;
container.onmouseleave = outHandler;
