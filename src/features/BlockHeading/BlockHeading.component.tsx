import "./BlockHeading.styles.scss"
import Rhombus from "@assets/images/rhombus.svg"

interface Props {
    headingText: string
}

const BlockHeading = (props: Props) => (
    <div className='blockHeadingWrapper'>
        <div className='blockHeadingContainer'>
            <Rhombus />
            <h1>{props.headingText}</h1>
        </div>
    </div>
);

export default BlockHeading;