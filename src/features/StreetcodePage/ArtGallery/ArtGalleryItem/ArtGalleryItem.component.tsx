import { IndexedArt } from "@/models/media/art.model";
import "./ArtGalleryItem.styles.scss";

interface Props {
  artGalleryItem: IndexedArt;
}

const ArtGalleryItem = ({ artGalleryItem }: Props) => {
  return (
    <>
    <div className="slideArt">
      <div className={"img_wrap"}>
        <img className={"img_img"} src={artGalleryItem.imageHref} alt="" />
        <div className={`img_data img_data-${!artGalleryItem.description && !artGalleryItem.title ? "empty" : "full"}`}>
          <p className="img_title">{artGalleryItem.title}</p>
          <p className="img_description">{artGalleryItem.description}</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default ArtGalleryItem;
