// src/components/layout/Header.js
export class Header {
    static updateBoardTitle(title) {
        const titleElement = document.querySelector('.header-board-title');
        if (titleElement) titleElement.innerText = title;
    }
}