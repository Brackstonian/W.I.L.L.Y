export const getDomElements = () => {
    const screenPicker = document.querySelector('.app-main-screen-picker');
    const screenList = document.querySelector('.app-main-screen-picker__screen-list');
    return { screenPicker, screenList };
};
