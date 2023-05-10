import BlockSlider from '@/features/SlickSlider/SlickSlider.component';
import Heading from '../Heading/Heading.component';
import './InstagramBlock.styles.scss';
import InstagramSliderItem from './InstagramSliderItem/InstagramSliderItem.component';

const InstagramBlock = () => {

    const sliderProps = {};

    const handleClick = () => {
        window.location.assign('https://www.instagram.com/streetcodeua/');
    }

    return (
        <div className='InstagramBlock'>
            <Heading blockName='Інстаграм' buttonName='Зацінити інстаграм' setActionOnClick={handleClick}/>
            <div className='sliderContainer'>
                <InstagramSliderItem></InstagramSliderItem>
            </div>
        </div>
    );
}

export default InstagramBlock;