/* eslint-disable react/jsx-props-no-multi-spaces */
import { useState } from 'react';
import useMobx, { useModalContext } from '@app/stores/root-store';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

import { AutoComplete, Button, Select } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import AddTermModal from '@/app/common/components/modals/Terms/AddTerm/AddTermModal.component';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { Term, Text } from '@/models/streetcode/text-contents.model';

interface Props {
    inputInfo: Partial<Text> | undefined;
    setInputInfo: React.Dispatch<React.SetStateAction<Partial<Text> | undefined>>;
}

const toolTipColor = '#8D1F16';

const TextEditor = ({ inputInfo, setInputInfo } : Props) => {
    const { relatedTermStore, termsStore } = useMobx();
    const { modalStore: { setModal } } = useModalContext();
    const { fetchTerms, getTermArray } = termsStore;
    const { createRelatedTerm, deleteRelatedTerm } = relatedTermStore;
    const [term, setTerm] = useState<Partial<Term>>();
    const [selected, setSelected] = useState('');

    const handleAddRelatedWord = () => {
        if (term !== null && selected !== null) {
            createRelatedTerm(selected, term?.id as number);
        }
    };

    const handleDeleteRelatedWord = () => {
        if (selected !== null) {
            const index = relatedTermStore.getRelatedTermsArray.findIndex((rt) => rt.word === selected);
            const element = relatedTermStore.getRelatedTermsArray.at(index);
            deleteRelatedTerm(element?.id as number);
        }
    };

    const handleAddSimple = () => {
        const newTerm: Term = {
            id: 0,
            title: term?.title as string,
            description: term?.description,
        };
        termsStore.createTerm(newTerm);
    };

    useAsync(fetchTerms, []);

    return (
        <FormItem
            label="Основний текст"
        >
            <TinyMCEEditor
                init={{
                    height: 300,
                    max_chars: 1000,
                    menubar: false,
                    init_instance_callback(editor) {
                        editor.setContent(inputInfo?.textContent ?? '');
                    },
                    plugins: [
                        'autolink',
                        'lists', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                        'insertdatetime', 'wordcount', /* 'charcount', */
                    ],
                    toolbar: 'undo redo | bold italic | '
                        + 'removeformat',
                    content_style: 'body { font-family:Roboto,Helvetica Neue,sans-serif; font-size:14px }',
                }}

                onChange={(e, editor) => {
                    setInputInfo({ ...inputInfo, textContent: editor.getContent() });
                }}
                onSelectionChange={(e, editor) => {
                    setSelected(editor.selection.getContent());
                }}
            />
            <Button
                className="streetcode-custom-button button-margin-vertical"
                onClick={() => setModal('addTerm')}
            >
                Додати новий термін
            </Button>
            <FormItem label="Оберіть пов'язаний термін">
                <AutoComplete
                    filterOption
                    onSelect={(value, option) => {
                        setTerm({ id: option.key, title: value });
                    }}
                    disabled={selected === ''}
                >
                    {getTermArray.map(
                        (t) => <Select.Option key={t.id} value={t.title}>{t.title}</Select.Option>,
                    )}
                </AutoComplete>
            </FormItem>

            <div className="display-flex-row">
                <Button
                    className="streetcode-custom-button button-margin-vertical button-margin-right"
                    onClick={handleAddRelatedWord}
                    disabled={selected === '' || term === undefined}
                >
                    Пов&#39;язати
                </Button>
                <Button
                    onClick={handleDeleteRelatedWord}
                    disabled={selected === '' || term === undefined}
                    className="streetcode-custom-button button-margin-vertical"
                >
                    Видалити пов&#39;язаний термін
                </Button>
            </div>

            <AddTermModal handleAdd={handleAddSimple} term={term} setTerm={setTerm} />
        </FormItem>
    );
};

export default TextEditor;
