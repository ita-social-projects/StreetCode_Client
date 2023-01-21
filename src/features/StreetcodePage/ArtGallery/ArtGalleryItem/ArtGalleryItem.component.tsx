import './ArtGalleryItem.styles.scss';

interface Props {
    image: string;
}

const ArtGalleryItem = ({ image }: Props) => (
    <div className="slideArt">
        <img src={image} alt="" />
    </div>
);

export default ArtGalleryItem;
