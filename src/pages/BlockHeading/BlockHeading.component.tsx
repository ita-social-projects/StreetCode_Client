import "./BlockHeading.styles.css"
const Rhombus = require("../../assets/images/rhombus.png")
interface Props {
    headingText:string
}

const BlockHeading = (props: Props) => {

    return (
        <div className={"blockHeadingWrapper"}>

            <div className={"blockHeadingContainer"}>
                <img src={Rhombus}/>
             <h1>{props.headingText}</h1>
             </div>
        </div>
    );
}

export default BlockHeading;