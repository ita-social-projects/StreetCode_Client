import { useState } from 'react';
import useMobx from '@app/stores/root-store';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

import {
    AutoComplete, Button, Form, Select, Tooltip,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';

import AddTermModal from '@/app/common/components/modals/Terms/AddTerm/AddTermModal.component';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import TextInputInfo from '@/features/AdminPage/NewStreetcode/TextBlock/InputType/TextInputInfo.model';
import { Term } from '@/models/streetcode/text-contents.model';

interface Props {
    inputInfo: Partial<TextInputInfo> | undefined;
    setInputInfo: React.Dispatch<React.SetStateAction<Partial<TextInputInfo> | undefined>>;
}

const TextEditor = ({ inputInfo, setInputInfo } : Props) => {
    const { relatedTermStore, termsStore, modalStore: { setModal } } = useMobx();
    const { fetchTerms, getTermArray } = termsStore;
    const { createRelatedTerm, deleteRelatedTerm } = relatedTermStore;
    const [term, setTerm] = useState<Partial<Term>>();
    const [selected, setSelected] = useState('');

    const handleAddRelatedWord = () => {
        if (relatedTermStore.getRelatedTermsArray.some((rt) => rt.word === selected)) {
            alert("Таке слово уже пов'язано!");
            return;
        }
        if (term !== null) {
            createRelatedTerm(selected, term?.id as number);
        }
    };

    const handleDeleteRelatedWord = () => {
        if (!relatedTermStore.getRelatedTermsArray.some((rt) => rt.word === selected)) {
            alert("Таке слово ні з чим не пов'язано. Його неможливо видалити");
            return;
        }
        if (selected !== null) {
            const index = relatedTermStore.getRelatedTermsArray.findIndex((rt) => rt.word === selected);
            deleteRelatedTerm(index);
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
        <FormItem>
            <h3>Основний текст</h3>
            <Button
                onClick={() => setModal('addTerm')}
            >
                Додати новий термін
            </Button>
            <TinyMCEEditor
                init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                        'autolink', 'checklist',
                        'lists', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                        'powerpaste', 'formatpainter',
                        'insertdatetime', 'wordcount',
                    ],
                    toolbar: 'undo redo | bold italic | '
                        + 'removeformat ',
                    content_style: 'body { font-family:Roboto,Helvetica Neue,sans-serif; font-size:14px }',
                }}
                onChange={(e, editor) => {
                    setInputInfo({ ...inputInfo, text: editor.getContent() });
                }}
                onSelectionChange={(e, editor) => {
                    setSelected(editor.selection.getContent());
                }}
            />
            <Form.Item label="Оберіть пов'язаний термін">
                <Tooltip
                    title={selected !== '' ? '' : 'Спочатку виділіть слово у тексті'}
                    color="#8D1F16"
                >
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
                </Tooltip>
            </Form.Item>
            <Tooltip
                title={selected !== '' && term !== undefined
                    ? `${selected} з ${term?.title}` : 'Виділіть слово та термін!'}
                color="#8D1F16"
            >
                <Button
                    onClick={handleAddRelatedWord}
                    disabled={selected === '' || term === undefined}
                >
                    Пов&#39;язати
                </Button>
            </Tooltip>
            <Tooltip
                title={selected !== '' && term !== undefined
                    ? `${selected} з ${term?.title}` : 'Виділіть слово для видалення!'}
                color="#8D1F16"
            >
                <Button
                    onClick={handleDeleteRelatedWord}
                    disabled={selected === '' || term === undefined}
                >
                    Видалити пов&#39;язаний термін
                </Button>
            </Tooltip>
            <AddTermModal handleAdd={handleAddSimple} term={term} setTerm={setTerm} />
        </FormItem>
    );
};

export default TextEditor;
