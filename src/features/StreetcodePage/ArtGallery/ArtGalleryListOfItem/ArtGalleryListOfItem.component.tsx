//import './ArtGalleryListOfItem.styles.scss';

import ArtGalleryItem from '@streetcode/ArtGallery/ArtGalleryItem/ArtGalleryItem.component';

interface Props {
    images: string[];
}

const ArtGalleryListOfItem = ({ images }: Props) => {
    console.log("images")
    console.log(images)
   return(
   <div className="slideArt"  style={{       
    height:"560px",
    width:"1210px",
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  }}>
        {images?.map((image) => (
            <ArtGalleryItem image={image} />
            
        ))}
    </div>
)};

export default ArtGalleryListOfItem;
