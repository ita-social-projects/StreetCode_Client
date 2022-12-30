import "./SourcesSliderItem.styles.scss"

interface Props {
  text: string
}

const SourcesSlideItem = (props: Props) => (
    <div className='sourcesSliderItem'>
        <h1>{props.text}</h1>
    </div>
)

export default SourcesSlideItem