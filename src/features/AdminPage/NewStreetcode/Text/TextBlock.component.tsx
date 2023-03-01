import './TextBlock.styles.scss';

import TextForm from './TextForm/TextForm.component';

const TextBlock = () => {
    const minValue = 0;
    return (
        <div className="text-block-container">
            <TextForm />
            <p>TestingText</p>
        </div>
    );
};

export default TextBlock;
