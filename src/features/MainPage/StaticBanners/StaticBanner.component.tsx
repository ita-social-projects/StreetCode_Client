import Ornament from '@/assets/images/main-page/ornament.svg';
import OrnamentMobile from '@/assets/images/main-page/ornament_mobile.svg';
import './StaticBanner.styles.scss';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
interface Props {
    id:  'catalog' | 'support';
    blockName: string,
    blockContent: string,
    buttonName: string,
    setActionOnClick: React.MouseEventHandler<HTMLParagraphElement>
}

const StaticBanner = ({ id, blockName, blockContent, buttonName, setActionOnClick }: Props) => {
    return (
        <div>
            {useWindowSize().width <= 360 && id === 'support' ? <div className='top'><OrnamentMobile /></div> : <></>}

            <div className={`mainPageBlockStaticBanner ${id}`}>
                {useWindowSize().width > 768 ? <Ornament className='left' /> : <></>}

                <div className='mainContainer'>
                    <div className='textContainer'>
                        <p className='title'>{blockName}</p>
                        <p className='content'>{blockContent}</p>
                    </div>
                    <div className='redirectButton'>
                        <p onClick={setActionOnClick}>{buttonName}</p>
                    </div>
                </div>

                {useWindowSize().width > 768 ? <Ornament className='right' /> : <></>}
            </div>
            {useWindowSize().width <= 360 && id === 'support' ? <div className='bottom'><OrnamentMobile /></div> : <></>}
        </div>

    );
}

export default StaticBanner;