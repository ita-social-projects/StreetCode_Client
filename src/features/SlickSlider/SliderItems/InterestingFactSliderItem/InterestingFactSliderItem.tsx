import "./InterestingFactSliderItem.styles.scss";

import { observer } from "mobx-react-lite";
import useMobx from "@stores/root-store";

interface Props {
    MainText:string,
    TextHeading:string,
    ImageSrc:string
}

const InterestingFactSliderItem = (props: Props) => {
    const { modalStore: { setModal } } = useMobx();
    const toDisplayReadMore = props.MainText.length > 300 ? true : false;
    const textPart = props.MainText.length > 300 ? props.MainText.substr(0,300) : props.MainText;
    return (
        <div className={"interestingFactSlide"}>
            <div className={"slideImage"}>
                <img src={props.ImageSrc}/>
            </div>
            <div className={"slideText"}>
                <p className={"heading"}>{props.TextHeading}</p>
                {toDisplayReadMore ? <p className={"mainText"}>{textPart}</p> : <p className={"mainText"}>{props.MainText}</p>}
                {toDisplayReadMore ? <p className={"readMoreParagraph"} onClick={() => setModal('facts', true)}>Трохи ще...</p> : null}
            </div>
        </div>
    );
}

export default observer(InterestingFactSliderItem);