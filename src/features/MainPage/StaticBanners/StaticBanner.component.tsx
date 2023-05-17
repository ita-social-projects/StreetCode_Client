import Ornament from '@/assets/images/main-page/ornament.svg';
import './StaticBanner.styles.scss';

interface Props {
    blockName: string,
    blockContent: string,
    buttonName: string,
    setActionOnClick: React.MouseEventHandler<HTMLParagraphElement>
}

const StaticBanner = ({ blockName, blockContent, buttonName, setActionOnClick }: Props) => {
    return (
        <div className='mainPageBlockStaticBanner'>
            <Ornament/>
            <Ornament/>
            <div className='textContainer'>
                <p className='title'>{blockName}</p>
                <p className='content'>{blockContent}</p>
            </div>
            <div className='redirectButton'>
                <p onClick={setActionOnClick}>{buttonName}</p>
            </div>
            <Ornament/>
            <Ornament/>
        </div>
    );
}

export default StaticBanner;