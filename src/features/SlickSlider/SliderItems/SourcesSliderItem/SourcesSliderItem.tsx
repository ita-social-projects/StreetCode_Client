import "./SourcesSliderItem.styles.css"

interface Props {
  text:string
}

const SourcesSlideItem = (props: Props) => {
    return (
        <div className={"sourcesSliderItem"}>
            <h1>{props.text}</h1>
        </div>
    );
}

export default SourcesSlideItem;