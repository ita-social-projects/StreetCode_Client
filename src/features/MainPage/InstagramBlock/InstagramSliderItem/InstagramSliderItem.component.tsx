import './InstagramSliderItem.styles.scss';

interface Props {
    // key: number,
    photoUrl: string | undefined,
    caption: string | undefined
}

const InstagramSliderItem = ({ photoUrl, caption }: Props) => {
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
                <p>{caption}</p>
            </div>
        </div>
    );
}

export default InstagramSliderItem;