import Squares from '@/assets/images/main-page/heading-squares.component.svg';
import './Heading.styles.scss';

interface Props {
    blockName: string,
    buttonName: string | undefined,
    setActionOnClick: React.MouseEventHandler<HTMLParagraphElement> | undefined
}

const Heading = ({ blockName, buttonName, setActionOnClick }: Props) => {
    return (
        <div className='mainPageBlockHeading'>
            <div className='leftPart'>
                <Squares/>
                <p className='blockName'>{blockName}</p>
            </div>
            <div className='headingButton'>
                <p onClick={setActionOnClick}>{buttonName}</p>
            </div>
        </div>
    );
}

export default Heading;