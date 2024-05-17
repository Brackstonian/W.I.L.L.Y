export const getDomElements = () => {
    const viewButton = document.getElementById('viewButton');
    const penColorInput = document.querySelector('.app-main-pen-menu__penColor');
    const penWidthInput = document.querySelector('.app-main-pen-menu__penWidth');
    const penContainer = document.querySelector('.app-main-pen-menu__wrapper');
    const penBody = document.querySelector('.app-main-pen-menu__pen-body');
    const sliderContainer = document.querySelector('.app-main-pen-menu__slider-wrapper');

    return { viewButton, penColorInput, penWidthInput, penContainer, penBody, sliderContainer };
};
