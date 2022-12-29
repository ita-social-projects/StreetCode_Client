import "./InterestingFactSliderItem.styles.css"

interface Props {
    MainText:string,
    TextHeading:string,
    ImageSrc:string
}

const InterestingFactSliderItem = (props: Props) => {
    return (
        <div className={"interestingFactSlide"}>
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

export default InterestingFactSliderItem;