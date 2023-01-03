import "./InterestingFactSliderItem.styles.scss";
import { useMobx } from "@stores/root-store";
import { observer } from "mobx-react-lite";

interface Props {
    MainText:string,
    TextHeading:string,
    ImageSrc:string
}

const InterestingFactSliderItem = (props: Props) => {
    const { interestingFactsStore: { openModal } } = useMobx();
    return (
        <div className={"interestingFactSlide"} onClick={openModal}>
            <div className={"slideImage"}>
                <img src={props.ImageSrc}/>
            </div>
            <div className={"slideText"}>
                <p className={"heading"}>{props.TextHeading}</p>
                <p className={"mainText"}>{props.MainText}</p>
            </div>
        </div>
    );
}

export default observer(InterestingFactSliderItem);