import "./BlockHeading.styles.css"
import Rhombus from "@assets/images/rhombus.svg";

interface Props {
    headingText: string;
}

const BlockHeading = ({ headingText }: Props) => (
    <div className={"blockHeadingWrapper"}>
        <div className={"blockHeadingContainer"}>
            <Rhombus />
            <h2>{headingText}</h2>
        </div>
    </div>
);

export default BlockHeading;