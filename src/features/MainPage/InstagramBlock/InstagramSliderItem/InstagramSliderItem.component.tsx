import './InstagramSliderItem.styles.scss';

interface Props {
    // key: number,
    photoUrl: string | undefined,
    caption: string | undefined
}

const InstagramSliderItem = ({ photoUrl, caption }: Props) => {

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

    return (
        <div 
            className='InstagramSliderItem'
            style={imageStyle}
        >
            <div className='textContainer'>
                <p>{truncatedCaption}</p>
            </div>
        </div>
    );
}

export default InstagramSliderItem;