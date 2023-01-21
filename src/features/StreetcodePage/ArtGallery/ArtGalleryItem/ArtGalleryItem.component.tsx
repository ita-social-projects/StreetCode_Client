import './ArtGalleryItem.styles.scss';

interface Props {
    image: string;
}

const ArtGalleryItem = ({ image }: Props) => {
    console.log("image8888888888")
    console.log(image)
    return(
       
    <div className="slideArt">
        <img src={image} alt="" />
    </div>
)};

export default ArtGalleryItem;
