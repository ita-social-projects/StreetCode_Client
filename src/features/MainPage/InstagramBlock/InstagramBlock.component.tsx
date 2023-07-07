import BlockSlider from '@/features/SlickSlider/SlickSlider.component';
import Heading from '../Heading/Heading.component';
import './InstagramBlock.styles.scss';
import InstagramSliderItem from './InstagramSliderItem/InstagramSliderItem.component';
import { useEffect, useState } from 'react';
import InstagramPost from '@/models/instagram/instagram.model';
import InstagramApi from '@/app/api/instagram/instagram.api';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';

const InstagramBlock = () => {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
     
    useEffect(() => {
        const fetchPosts = async () => {
            const response = await InstagramApi.getAll();
            setPosts(response);     
        };     
      fetchPosts();
    }, []);

    const windowSize = useWindowSize();

    const sliderProps = {
        infinite: true,
        swipe: windowSize.width < 1025,
        variableWidth: true,
        swipeOnClick: false,
        slidesToShow: 4,
        dots: windowSize.width < 1024,
        arrows: windowSize.width > 1024,
        slidesToScroll: 1
    };

    const sliderItems = posts.map((p) => (
        <InstagramSliderItem
            key={p.id}
            photoUrl={p.media_url}
            caption={p.caption}
            permalink={p.permalink}
        />
    ));

    const handleClick = () => {
        window.location.assign('https://www.instagram.com/streetcodeua/');
    }
    
    return (
        (posts.length > 0)
            ? (
        <div className='InstagramBlock'>
            <Heading blockName='Ми в Інсті' buttonName='Зацінити інстаграм' setActionOnClick={handleClick}/>
            <div className='sliderContainer'>
            <BlockSlider {...sliderProps}>
                    {sliderItems}
                </BlockSlider>
            {windowSize.width <= 480 && ( 
            <div className='instagramButton'>
                <p onClick={handleClick}>{'Перейти в інстаграм'}</p>
            </div>
            )}
            </div>
        </div>
    ) : <></>
    );
}

export default InstagramBlock;