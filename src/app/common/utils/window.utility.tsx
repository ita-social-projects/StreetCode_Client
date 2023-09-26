const scrollWithOffset = (el: any, offset: number) => {
    const elementPosition = el.offsetTop - offset;
    window.scroll({
        top: elementPosition,
        left: 0,
        behavior: 'smooth',
    });
};

export default scrollWithOffset;
