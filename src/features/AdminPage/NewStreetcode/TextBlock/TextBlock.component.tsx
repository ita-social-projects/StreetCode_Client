import './TextBlock.styles.scss';

import DictionaryTable from './DictionaryTable/DictionaryTable.component';
import TextForm from './TextForm/TextForm.component';

const TextBlock = () => (
    <div className="text-block-container">
        <TextForm />
        <DictionaryTable />
    </div>
);

export default TextBlock;
