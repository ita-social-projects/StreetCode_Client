import "./ArtGalleryListOfItem.styles.scss";

import ArtGalleryItem from "@streetcode/ArtGallery/ArtGalleryItem/ArtGalleryItem.component";
import { IndexedArt } from "@/models/media/art.model";

interface ArtGalleryData {
  artGalleryList: IndexedArt[];
}

const ArtGalleryListOfItem = ({artGalleryList}:ArtGalleryData) => {
  let offsetSum = 0;
  artGalleryList.map((item)=> offsetSum += item.offset);

  return (
    <div className="slideArtGalleryContainer">
      <div className={`slideArtGallery width-${offsetSum > 4 ? 2 : 1}`}>
        {artGalleryList.map((item)=> 
        { 
          return (<ArtGalleryItem artGalleryItem={item} />)
        })}
      </div>
    </div>
  );
};

export default ArtGalleryListOfItem;
