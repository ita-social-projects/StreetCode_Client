interface Props {
    image:string
  }
  
const ArtGalleryItem = (props: Props) => {
      return (
          <div className={"sourcesSliderItem"}>{props.image}</div>
      );
}
  
  export default ArtGalleryItem;