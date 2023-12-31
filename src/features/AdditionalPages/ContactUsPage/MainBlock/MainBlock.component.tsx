import './MainBlock.styles.scss';

import ContactForm from '@/app/common/components/ContactForm/ContactForm.component';

import ContactBlock from './ContactBlock/ContactBlock.component';

const MainBlock = () => (
    <div className="mainBlock">
        <ContactBlock />
        <ContactForm />
    </div>
);

export default MainBlock;
