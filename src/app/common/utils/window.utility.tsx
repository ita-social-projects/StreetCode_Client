const scrollWithOffset = (el: any, offset: number) => {
    const elementPosition = el.offsetTop - offset;
    window.scroll({
        top: elementPosition,
        left: 0,
        behavior: 'smooth',
    });
};

const clearWindowHistoryState = () => window.history.replaceState({}, document.title, window.location.pathname);

export default scrollWithOffset;
export { clearWindowHistoryState };
