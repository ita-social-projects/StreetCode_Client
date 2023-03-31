import { useEffect } from 'react';

const isSticky = () => {
    const buttonDonate = document.querySelector('.donateBtnContainer');
    const buttonUp = document.querySelector('.scrollToTopBtnContainer');
    if (buttonDonate !== null && buttonUp !== null) {
        const width = window.innerWidth;
        let requiredPosition = 7900;
        if (width < 1024) {
            requiredPosition = 6800;
        }
        const scrollTop = window.scrollY;
        if (scrollTop >= requiredPosition) {
            buttonDonate.classList.add('stickyDonate');
            buttonUp.classList.add('stickyToTop');
        } else {
            buttonDonate.classList.remove('stickyDonate');
            buttonUp.classList.remove('stickyToTop');
        }
    }
};

const useSticky = () => {
    useEffect(() => {
        window.addEventListener('scroll', isSticky);
        return () => {
            window.removeEventListener('scroll', isSticky);
        };
    }, []);
};

export default useSticky;
