import './InstagramSliderItem.styles.scss';
import { useState } from 'react';

import { toInstaPostRedirectClickEvent } from '@/app/common/utils/googleAnalytics.unility';

interface Props {
    photoUrl: string | undefined,
    caption: string | undefined,
    permalink: string
}

const InstagramSliderItem = ({ photoUrl, caption, permalink } : Props) => {
    const MAX_CAPTION_LENGTH = 110;
    const [isDragging, setIsDragging] = useState(false);

    const truncatedCaption = caption && caption.length > MAX_CAPTION_LENGTH
        ? `${caption.substring(0, MAX_CAPTION_LENGTH).split(' ').slice(0, -1).join(' ')}...`
        : caption;

    const imageStyle = {
        backgroundImage: `url(${photoUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    };
    const handleMouseDown = () => {
        setIsDragging(false);
    };

    const handleMouseMove = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        if (!isDragging) {
            handleOpenPost();
        }
    };

    const handleOpenPost = () => {
        toInstaPostRedirectClickEvent(permalink, 'main_page');
        window.open(permalink);
    };

    return (
        <div
            className="InstagramSliderItem"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div
                className="imageContainer"
                style={imageStyle}
            />
            <div className="textContainer">
                <p>{truncatedCaption}</p>
            </div>
        </div>
    );
};

export default InstagramSliderItem;
