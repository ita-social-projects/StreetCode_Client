import "./BlockHeading.styles.css"
//const Rhombus = require("../../assets/images/rhombus.png")
import Rhombus from "@assets/images/rhombus.svg";
interface Props {
    headingText:string
}

const BlockHeading = (props: Props) => {

    return (
        <div className={"blockHeadingWrapper"}>

            <div className={"blockHeadingContainer"}>
            <Rhombus className={"blockHeadingContainer_img"}/>
             <h1>{props.headingText}</h1>
             </div>
        </div>
    );
}

export default BlockHeading;