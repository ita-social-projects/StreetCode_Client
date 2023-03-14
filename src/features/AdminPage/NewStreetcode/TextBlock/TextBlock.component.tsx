import './TextBlock.styles.scss';

import { useState } from 'react';
import useMobx from '@stores/root-store';

import AddTermModalComponent from '@/app/common/components/modals/Terms/AddTerm/AddTermModal.component';
import { Term } from '@/models/streetcode/text-contents.model';

import TextForm from './TextForm/TextForm.component';

const TextBlock = () => {
    const { termsStore } = useMobx();
    const [term, setTerm] = useState<Partial<Term>>();

    return (
        <div className="text-block-container">
            <TextForm />
        </div>
    );
};

export default TextBlock;
