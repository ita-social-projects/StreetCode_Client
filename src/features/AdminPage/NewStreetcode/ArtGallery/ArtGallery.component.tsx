import DownloadBlock from "./components/Download.component";
import PreviewBlock from "./components/Preview.component";
import './ArtGallery.styles.scss';

const ArtGalleryBlock = () => {
    return(
        <div className='art-gallery-block'>
            <div className='subheading'>
                <h3>Арт-галерея</h3>
            </div>
            <h4>Завантажити арти</h4>
            <DownloadBlock/>
            <h4>Прев'ю</h4>
            <PreviewBlock/>
        </div>
    );
}

export default ArtGalleryBlock;