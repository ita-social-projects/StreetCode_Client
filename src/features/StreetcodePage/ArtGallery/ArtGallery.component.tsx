import './ArtGallery.styles.scss';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import ArtGalleryItem from './ArtGalleryItem/ArtGalleryItem.component';



const ArtGallery = () => {
    const images: string[] =['https://images.unsplash.com/photo-1551963831-b3b1ca40c98e','https://images.unsplash.com/photo-1551782450-a2132b4ba21d']


    return (
        <div className="artGalleryWrapper">
            <div className="artGalleryContainer">
                <BlockHeading headingText="Арт-галерея" />
                <div className="artGalleryContentContainer">
                    <div className="artGallerySliderContainer">
                        
                        <SlickSlider
                            infinite={false}
                            swipe={false}
                            dots={true}
                            slides={[<ArtGalleryItem image={'https://images.unsplash.com/photo-1551782450-a2132b4ba21d'}/>,<ArtGalleryItem image={'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e'}/>]}
                        />
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtGallery;