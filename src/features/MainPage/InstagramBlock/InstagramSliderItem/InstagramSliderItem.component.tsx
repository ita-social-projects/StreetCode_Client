import './InstagramSliderItem.styles.scss';

import { toInstaPostRedirectClickEvent } from '@/app/common/utils/googleAnalytics.unility';

interface Props {
    photoUrl: string | undefined,
    caption: string | undefined,
    permalink: string
}

const InstagramSliderItem = ({ photoUrl, caption, permalink } : Props) => {
    const MAX_CAPTION_LENGTH = 120;

    const truncatedCaption =
        caption && caption.length > MAX_CAPTION_LENGTH
            ? caption.substring(0, MAX_CAPTION_LENGTH).split(' ').slice(0, -1).join(' ') + '...'
            : caption;

    const imageStyle = {
        backgroundImage: `url(${photoUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    };

    const handleOpenPost = () => {
        toInstaPostRedirectClickEvent(permalink, 'main_page');
        window.open(permalink);
    }

    return (
        <div 
            className='InstagramSliderItem'
            onClick={handleOpenPost}
        >
            <div className='imageContainer'
                style={imageStyle}
            />
            <div className='textContainer'>
                <p>{truncatedCaption}</p>
            </div>
        </div>
    );
}

export default InstagramSliderItem;