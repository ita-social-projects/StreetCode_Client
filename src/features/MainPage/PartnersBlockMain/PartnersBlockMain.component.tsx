import './PartnersBlockMain.styles.scss';

import PartnersBlock from '@/features/AdditionalPages/PartnersPage/PartnersBlock/PartnersBlock.component';

import Heading from '../Heading/Heading.component';
import { useNavigate } from 'react-router-dom';

const PartnersBlockComponent = () => {
    const navigate = useNavigate();
    const handleButtonClick = () => {
        navigate('../partners-page');
    };
    return (
        <div className="partnersBlockMainContainer">
            <Heading blockName="Наші партнери" buttonName={"Всі партнери"} setActionOnClick={handleButtonClick} />
            <PartnersBlock onlyKeyPartners />
        </div>
    )
};

export default PartnersBlockComponent;
