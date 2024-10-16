import './StaticBanner.styles.scss';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import Ornament from '@/assets/images/main-page/ornament.svg';

interface Props {
    id: 'catalog' | 'support';
    blockName: string,
    blockContent: string,
    buttonName: string,
    setActionOnClick: React.MouseEventHandler<HTMLParagraphElement>
}

const StaticBanner = ({
    id, blockName, blockContent, buttonName, setActionOnClick,
}: Props) => (
    <div>
        {useWindowSize().width <= 480 && id === 'support' ? <div className="top" /> : <> </>}

        <div className={`mainPageBlockStaticBanner ${id}`}>
            {useWindowSize().width > 768 ? <Ornament className="left" /> : <> </>}
            <div className="mainContainer">
                <div className="textContainer">
                    <p className="title">{blockName}</p>
                    <p className="content">{blockContent}</p>
                </div>
                <div onClick={setActionOnClick} className="redirectButton">
                    <p>{buttonName}</p>
                </div>
            </div>
            {useWindowSize().width > 768 ? <Ornament className="right" /> : <> </>}
        </div>
        {useWindowSize().width <= 480 && id === 'support' ? <div className="bottom" /> : <> </>}
    </div>

);

export default StaticBanner;
