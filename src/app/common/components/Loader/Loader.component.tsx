import './Loader.styles.scss';

import logoAnimationMob from '@images/gifs/Logo-animation_mob.webp';
import logoAnimationWeb from '@images/gifs/Logo-animation_web.webp';

import React from 'react';
import { useMediaQuery } from 'react-responsive';

const Loader: React.FC = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 4800px)' });

    return (
        <div className="loader-container">
            <img
                className="spinner"
                alt="Loading..."
                src={isMobile ? logoAnimationWeb : logoAnimationMob}
            />
        </div>
    );
};

export default Loader;
