import Ornament from '@/assets/images/main-page/ornament.svg';
import './StaticBanner.styles.scss';

interface Props {
    id: string;
    blockName: string,
    blockContent: string,
    buttonName: string,
    setActionOnClick: React.MouseEventHandler<HTMLParagraphElement>
}

const StaticBanner = ({ id, blockName, blockContent, buttonName, setActionOnClick }: Props) => {
    return (
        <div className={`mainPageBlockStaticBanner ${id}`}>
            <Ornament className='left'/>
            
            <div className='mainContainer'>
                <div className='textContainer'>
                    <p className='title'>{blockName}</p>
                    <p className='content'>{blockContent}</p>
                </div>
                <div className='redirectButton'>
                    <p onClick={setActionOnClick}>{buttonName}</p>
                </div>
            </div>
            <Ornament className='right'/>
        </div>
    );
}

export default StaticBanner;