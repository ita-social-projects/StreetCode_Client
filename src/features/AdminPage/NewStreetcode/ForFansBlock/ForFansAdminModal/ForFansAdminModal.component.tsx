'./ForFansAdminModal.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import useMobx from '@stores/root-store';
import { Editor } from '@tinymce/tinymce-react';

import { Button, Modal, Select } from 'antd';

import { SourceCategoryName, StreetcodeCategoryContent } from '@/models/sources/sources.model';

interface Props {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    allCategories: SourceCategoryName[],
}

const ForFansModal = ({ open, setOpen, allCategories } : Props) => {
    const { sourceCreateUpdateStreetcode } = useMobx();
    const editorRef = useRef<Editor | null>(null);
    const selectedCategory = useRef<string | null>(null);
    const categoryUpdate = useRef<StreetcodeCategoryContent | null>();

    useEffect(() => {
        categoryUpdate.current = sourceCreateUpdateStreetcode.ElementToUpdate;
        if (categoryUpdate.current && open) {
            editorRef.current?.editor?.setContent(categoryUpdate.current.text ?? '');
        } else {
            categoryUpdate.current = null;
            editorRef.current?.editor?.setContent('');
        }
    }, [open]);

    const onSave = () => {
        const elementToUpdate = sourceCreateUpdateStreetcode.ElementToUpdate;
        if (elementToUpdate) {
            sourceCreateUpdateStreetcode
                .updateElement(
                    sourceCreateUpdateStreetcode.indexUpdate,
                    { ...elementToUpdate,
                      categoryId: allCategories
                          .find((el) => el.title === selectedCategory.current)?.id ?? 0,
                      text: editorRef.current?.editor?.getContent() ?? '' },
                );
        } else {
            sourceCreateUpdateStreetcode
                .addSourceCategoryContent({ id: sourceCreateUpdateStreetcode.streetcodeCategoryContents.length,
                                            categoryId: allCategories
                                                .find((el) => el.title === selectedCategory.current)?.id ?? 0,
                                            text: editorRef.current?.editor?.getContent() ?? '' });
        }
        setOpen(false);
        sourceCreateUpdateStreetcode.indexUpdate = -1;
    };

    return (
        <Modal
            className="forFansAdminModal"
            open={open}
            onCancel={() => {
                setOpen(false); sourceCreateUpdateStreetcode.indexUpdate = -1;
            }}
            footer={null}
            maskClosable
            centered
            closeIcon={<CancelBtn />}
        >
            <h2>Для фанатів</h2>
            <Select
                className="category-select-input"
                defaultValue={categoryUpdate.current
                    ? allCategories.find((c) => c.id === categoryUpdate.current?.categoryId)?.title
                    : allCategories.length > 1 ? allCategories[0].title : ''}
                onSelect={(value:string) => {
                    selectedCategory.current = value;
                }}
            >
                {allCategories.map((c) => <Option key={`${c.id}`} value={c.title} />)}
            </Select>
            <Editor
                ref={editorRef}
                init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                        'autolink',
                        'lists', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                        'insertdatetime', 'wordcount', 'link', 'lists', 'formatselect ',
                    ],
                    toolbar: 'checklist | bold  formatselect  italic underline strikethrough superscript subscript codeformat '
                     + 'formats blockformats align | removeformat link',
                    content_style: 'body { font-family:Roboto,Helvetica Neue,sans-serif; font-size:14px }',
                }}
            />
            <Button
                className="saveButton"
                onClick={onSave}
            >
                Зберегти
            </Button>
        </Modal>
    );
};

export default observer(ForFansModal);
