import "./ArtGalleryListOfItem.styles.scss";

import ArtGalleryItem from "@streetcode/ArtGallery/ArtGalleryItem/ArtGalleryItem.component";

interface ArtGallery {
  images: string[];
  descriptions: string[];
  offset: number[];
  titles: string[];
}

const ArtGalleryListOfItem = (artGallery: ArtGallery) => {
  let artGalleryImage = [];
  let offsetSum = 0;

  for (let i: number = 0; i < artGallery.images.length; i++) {
    offsetSum += artGallery.offset[i];
    artGalleryImage.push(
      <ArtGalleryItem
        image={artGallery.images[i]}
        description={artGallery.descriptions[i]}
        title={artGallery.titles[i]}
      />
    );
  }
  return (
    <div className="slideArtGalleryContainer">
      <div className={`slideArtGallery width-${offsetSum > 4 ? 2 : 1}`}>
        {artGalleryImage.map((image) => image)}
      </div>
    </div>
  );
};

export default ArtGalleryListOfItem;
