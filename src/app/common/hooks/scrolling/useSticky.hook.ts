import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const useSticky = () => {
    const { ref, inView } = useInView({ threshold: 0.5 });
    useEffect(() => {
        const buttonDonate = document.querySelector('.donateBtnContainer');
        const buttonUp = document.querySelector('.scrollToTopBtnContainer');
        if (buttonDonate !== null && buttonUp !== null) {
            if (inView) {
                buttonDonate.classList.add('stopToTop');
                buttonUp.classList.add('stopToTop');
            } else {
                buttonDonate.classList.remove('stopToTop');
                buttonUp.classList.remove('stopToTop');
            }
        }
    }, [inView]);
    return ref;
};

export default useSticky;
