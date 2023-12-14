import './MainBlock.styles.scss';

import ContactBlock from './ContactBlock/ContactBlock.component';
import ContactForm from '@/app/common/components/ContactForm/ContactForm.component';

const MainBlock = () => (
    <div className="mainBlock">
        <ContactBlock />
        <ContactForm />
    </div>
);

export default MainBlock;
