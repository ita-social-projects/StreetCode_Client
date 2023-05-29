import './InstagramSliderItem.styles.scss';

interface Props {
    photoUrl: string | undefined,
    caption: string | undefined,
    permalink: string
}

const InstagramSliderItem = ({ photoUrl, caption, permalink } : Props) => {
    const MAX_CAPTION_LENGTH = 110;

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
        window.open(permalink);
    }

    return (
        <div 
            className='InstagramSliderItem'
            style={imageStyle}
            onClick={handleOpenPost}
        >
            <div className='textContainer'>
                <p>{truncatedCaption}</p>
            </div>
        </div>
    );
}

export default InstagramSliderItem;