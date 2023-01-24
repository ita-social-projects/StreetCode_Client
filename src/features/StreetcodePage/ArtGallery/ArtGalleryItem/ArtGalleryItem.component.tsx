import "./ArtGalleryItem.styles.scss";

interface Props {
  image: string;
  description?: string;
  title?: string;
}

const ArtGalleryItem = ({ image, description, title }: Props) => {
  return (
    <div className="slideArt ">
      <div className={`img_wrap `}>
        <img className={"img_img"} src={image} alt="" />
        <div className="img_data">
          <p className="img_title">{title}</p>
          <p className="img_description">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ArtGalleryItem;
