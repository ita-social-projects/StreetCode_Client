import './MainBlock.styles.scss';

import ContactBlock from './ContactBlock/ContactBlock.component';
import ContactForm from './ContactForm/ContactForm.component';

const MainBlock = () => (
    <div className="mainBlock">
        <ContactBlock />
        <ContactForm />
    </div>
);

export default MainBlock;
