import './InstagramBlock.styles.scss';

import { useEffect, useState } from 'react';

import InstagramApi from '@/app/api/instagram/instagram.api';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import BlockSlider from '@/features/SlickSlider/SlickSlider.component';
import InstagramPost from '@/models/instagram/instagram.model';

import Heading from '../Heading/Heading.component';

import InstagramSliderItem from './InstagramSliderItem/InstagramSliderItem.component';

const InstagramBlock = () => {
    const [posts, setPosts] = useState<InstagramPost[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await InstagramApi.getAll();
                setPosts(response);
            } catch (error) {}
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
        slidesToScroll: 1,
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
        window.open('https://www.instagram.com/streetcodeua/', '_blank');
    };

    return (
        (posts.length > 0)
            ? (
                <div className="InstagramBlock">
                    <Heading blockName="Ми в Інсті" buttonName="Зацінити інстаграм" setActionOnClick={handleClick} />
                    <div className="sliderContainer">
                        <BlockSlider {...sliderProps}>
                            {sliderItems}
                        </BlockSlider>
                        {windowSize.width <= 480 && (
                            <div className="instagramButton" onClick={handleClick}>
                                <p>Перейти в інстаграм</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : <></>
    );
};

export default InstagramBlock;
