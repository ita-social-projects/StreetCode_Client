import './Heading.styles.scss';

import SquaresMobile from '@assets/images/main-page/headerRectMobile.svg';
import useWindowSize from '@hooks/stateful/useWindowSize.hook';

import Squares from '@/assets/images/main-page/heading-squares.component.svg';

interface Props {
	blockName: string,
	setActionOnClick: React.MouseEventHandler<HTMLParagraphElement> | undefined
}

const Heading = ({ blockName, setActionOnClick }: Props) => {
    const windowSize = useWindowSize();
    return (
        <>
            {windowSize.width > 480
                ? (
                    <div className="mainPageBlockHeading">
                        <div className="leftPart">
                            <Squares />
                            <p className="blockName">{blockName}</p>
                        </div>
                    </div>
                )
                :				(
                    <div className="mainPageBlockHeading">
                        <SquaresMobile />
                        <div className="leftPart">
                            <p className="blockName">{blockName}</p>
                        </div>
                        <SquaresMobile />
                    </div>
                )}
        </>
    );
};

export default Heading;
