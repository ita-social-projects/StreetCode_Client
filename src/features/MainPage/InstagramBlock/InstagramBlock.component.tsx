import BlockSlider from '@/features/SlickSlider/SlickSlider.component';
import Heading from '../Heading/Heading.component';
import './InstagramBlock.styles.scss';
import InstagramSliderItem from './InstagramSliderItem/InstagramSliderItem.component';
import { useEffect, useState } from 'react';
import InstagramPost from '@/models/instagram/instagram.model';
import InstagramApi from '@/app/api/instagram/instagram.api';

const InstagramBlock = () => {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
     
    useEffect(() => {
        const fetchPosts = async () => {
            const response = await InstagramApi.getAll();
            setPosts(response);     
        };     
      fetchPosts();
    }, []);

    const sliderProps = {
        infinite: false,
        swipe: true,
        variableWidth: true,
        swipeOnClick: false,
        slidesToShow: 4,
        dots: false,
        arrows: false,
        slidesToScroll: 1,
        rows: 1,
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
            </div>
        </div>
    ) : <></>
    );
}

export default InstagramBlock;