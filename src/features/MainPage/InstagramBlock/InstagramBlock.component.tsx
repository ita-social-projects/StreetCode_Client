import BlockSlider from '@/features/SlickSlider/SlickSlider.component';
import Heading from '../Heading/Heading.component';
import './InstagramBlock.styles.scss';
const tk1 = 'IGQVJWSktWblVLZAWdmNUVEWUNBQzZAIMUNDOVBCVThtTE02VlhIM0toZA0ZAjcEg4bEZA2T0hBUmNuVmxldmRNdjZAkamw5eDdJbUlyU2N4UkdwNE8xMUJidWhkTmlyNjhiczIzTC1NR1A1XzdjLUc1aEtwQwZDZD';
const tk = 'IGQVJVdXVxUUJUcE52NlB3UzQ2bGZANSjJ0VG45em8wT2pXTEZAuX2h0U3hQZA1dvRWNybEZAZAWXUtRVB5X252aUNmUm5WUU5Bb0M4eGlyVm9aOFFYYTRSVGhvd2JmZA3pxNGpEYzJSeUw1ZAklqMTBYYnAwYgZDZD;'
import InstagramSliderItem from './InstagramSliderItem/InstagramSliderItem.component';
import { useEffect, useState } from 'react';
import axios from 'axios';
import InstagramPost from './InstagramSliderItem/InstagramPost.model';

const POST_LIMIT = 10;

const InstagramBlock = () => {
    const [posts, setPosts] = useState<InstagramPost[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const accessToken = tk1;
                const userId = '2896840440453292'; 
                axios.get(`https://graph.instagram.com/me/media?fields=id,media_type,media_url,caption&limit=${POST_LIMIT}&access_token=${accessToken}`)
                .then(response => {
                    const posts = response.data.data;
                    console.log(posts);

                    const mappedPosts = posts.map((post:InstagramPost) => {
                        const { id, media_url, caption } = post;
                        return { id, media_url, caption };
                    });
                        console.log(mappedPosts);
                        setPosts(mappedPosts);
                })
                .catch(error => {
                    console.error(error);
                });
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
        />
    ));

    const handleClick = () => {
        window.location.assign('https://www.instagram.com/streetcodeua/');
    }

    console.log(posts);
    
    return (
        <div className='InstagramBlock'>
            <Heading blockName='Інстаграм' buttonName='Зацінити інстаграм' setActionOnClick={handleClick}/>
            <div className='sliderContainer'>
            <BlockSlider {...sliderProps}>
                    {sliderItems}
                </BlockSlider>
            </div>
        </div>
    );
}

export default InstagramBlock;