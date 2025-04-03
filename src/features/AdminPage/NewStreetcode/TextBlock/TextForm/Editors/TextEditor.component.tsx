import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import relatedTermApi from "@api/streetcode/text-content/related-terms.api";
import useMobx, { useModalContext } from "@app/stores/root-store";

import { AutoComplete, Button, message, Select } from "antd";
import FormItem from "antd/es/form/FormItem";

import Editor from "@/app/common/components/Editor/QEditor.component";
import AddTermModal from "@/app/common/components/modals/Terms/AddTerm/AddTermModal.component";
import { useAsync } from "@/app/common/hooks/stateful/useAsync.hook";
import { Term, Text } from "@/models/streetcode/text-contents.model";

interface Props {
  character_limit?: number;
  inputInfo: Partial<Text> | undefined;
  setInputInfo: React.Dispatch<React.SetStateAction<Partial<Text> | undefined>>;
  onChange: (field: string, value: any) => void;
  text: string | undefined;
}

const TextEditor = ({
    character_limit,
    inputInfo,
    setInputInfo,
    onChange,
    text,
}: Props) => {
    const { relatedTermStore, termsStore } = useMobx();
    const {
        modalStore: { setModal },
    } = useModalContext();
    const { fetchTerms, getTermArray } = termsStore;
    const { createRelatedTerm } = relatedTermStore;
    const [term, setTerm] = useState<Partial<Term>>();
    const [selected, setSelected] = useState("");
    const editorRef = useRef<ReactQuill | null>(null);
    const MAX_CHARS = character_limit || 25000;
    const [isTitleEmpty, setIsTitleEmpty] = useState(true);

    const successMessage = (context: string) => {
        message.success(context);
    };

    const errorMessage = (error: string) => {
        message.error(error);
    };

    useEffect(() => {
        setIsTitleEmpty(!inputInfo?.title || inputInfo.title === "");
    }, [inputInfo?.title]);

    const handleAddRelatedWord = async () => {
        if (term !== null && selected !== null) {
            const result = await createRelatedTerm(selected, term?.id as number);
            result
                ? successMessage("Слово було успішно прив`язано до терміну")
                : errorMessage("Слово вже було пов`язано");
        }
    };

    const handleDeleteRelatedWord = async () => {
        try {
            if (selected == null || selected === undefined) {
                errorMessage("Будь ласка виділіть слово для видалення");
                return;
            }
            await relatedTermApi
                .delete(selected)
                .then((response) => {
                    response != null
                    ? successMessage("Слово було успішно відв`язано від терміну")
                    : errorMessage("Слово не було пов`язано");
                })
                .catch(() => errorMessage("Слово не було пов`язано"));
        } catch {
            errorMessage("Слово не було пов`язано");
        }
    };

    const handleAddSimple = async () => {
        const newTerm: Term = {
            id: 0,
            title: term?.title as string,
            description: term?.description,
        };
        const result = await termsStore.createTerm(newTerm);
            result != null
                ? successMessage("Термін успішно додано")
                : errorMessage("Термін не було додано, спробуйте ще.");
    };

    useAsync(fetchTerms, []);

    return (
        <FormItem label="Основний текст">
            <div className={isTitleEmpty ? "disabled" : ""}>
                <Editor
                    qRef={editorRef}
                    value={text ?? ""}
                    onChange={(editor) => {
                        setInputInfo((prevState) => ({ ...prevState, textContent: editor }));
                        onChange("textContent", editor);
                    }}
                    maxChars={MAX_CHARS}
                    selectionChange={(selectedText: string) => {
                        setSelected(selectedText);
                    }}
                    readOnly={isTitleEmpty}
                />
            </div>
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
                    onChange={onChange}
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

export default observer(TextEditor);
