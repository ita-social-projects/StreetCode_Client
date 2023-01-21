import './ArtGalleryItem.styles.scss';


interface Props {
    image:string
  
  }
  
const ArtGalleryItem = (props: Props) => {

  // const listItems = props.image.map((number) =>
  // <img 
  // src={number} alt="" />
  // );
  return (
      <div className="slideArt"> 
        <img 
            src={props.image} alt="" />
      </div>
  );
}
  
export default ArtGalleryItem;