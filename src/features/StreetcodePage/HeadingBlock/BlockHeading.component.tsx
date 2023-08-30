import './BlockHeading.styles.scss';

import Rhombus from '@images/utils/rhombus.svg';
import RhombusMobile from '@images/utils/rhombus_mobile.svg';

import { useMediaQuery } from 'react-responsive';
import { WindowsFilled } from '@ant-design/icons';

interface Props {
    headingText: string;
}

const BlockHeading = ({ headingText }: Props) => {
    const isMobile = useMediaQuery({
        query: '(max-width: 768px)',
    });

    return (
        <div className="blockHeadingWrapper">
            <div className="blockHeadingContainer">
                <div className="rhombus">
                    {!isMobile
                        && <Rhombus />}
                    {isMobile && <RhombusMobile />}
                </div>
                <h1 className={`blockHeadingText 
                    ${headingText.length >= 30
                        && window.screen.width < 640 ? 'bigTextComponent' : ''} `}
                >
                    {headingText}
                </h1>
            </div>
        </div>
    );
};

export default BlockHeading;
