import "./SourcesSliderItem.styles.css"

interface Props {
  text:string
}

const SourcesSlideItem = (props: Props) => {
    return (
        <div className={"sourcesSliderItem"}>{props.text}</div>
    );
}

export default SourcesSlideItem;