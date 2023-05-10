import BlockSlider from '@/features/SlickSlider/SlickSlider.component';
import Heading from '../Heading/Heading.component';
import './InstagramBlock.styles.scss';

const InstagramBlock = () => {

const sliderProps = {};

    return (
        <div className='InstagramBlock'>
            <Heading blockName='Інстаграм' buttonName='Зацінити інстаграм' setActionOnClick={()=>window.location.assign('https://www.instagram.com/streetcodeua/')}/>
            
        </div>
    );
}

export default InstagramBlock;