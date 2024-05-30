import '@features/AdminPage/AdminModal.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import getNewMinNegativeId from '@app/common/utils/newIdForStore';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import { ModelState } from '@models/enums/model-state';
import useMobx from '@stores/root-store';

import {
    Button, Form, message, Modal, Popover, Select,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';

import SourcesApi from '@/app/api/sources/sources.api';
import {
    checkQuillEditorTextLength,
    setQuillEditorContent,
} from '@/app/common/components/Editor/EditorUtilities/quillUtils.utility';
import Editor from '@/app/common/components/Editor/QEditor.component';
import SourceModal from '@/features/AdminPage/CategoriesPage/CategoriesPage/CategoryAdminModal.component';
import {
    SourceCategoryName,
    StreetcodeCategoryContent,
    StreetcodeCategoryContentUpdate,
} from '@/models/sources/sources.model';

interface Props {
    character_limit?: number;
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    allCategories: SourceCategoryName[],
    onChange: (field: string, value: any) => void,
    allPersistedSourcesAreSet: boolean,
}

function isEditingCategoryTextOnly(
    elementToUpdate: StreetcodeCategoryContent | null,
    editedCategoryId: any,
): boolean | null {
    return elementToUpdate && elementToUpdate?.sourceLinkCategoryId === Number(editedCategoryId);
}

const CategoriesModal = ({
    character_limit, open, setOpen, allCategories, onChange, allPersistedSourcesAreSet,
}: Props) => {
    const { sourceCreateUpdateStreetcode, sourcesAdminStore } = useMobx();
    const editorRef = useRef<ReactQuill | null>(null);
    const categoryUpdate = useRef<StreetcodeCategoryContent | null>();
    const [availableCategories, setAvailableCategories] = useState<SourceCategoryName[]>([]);
    const [Categories, setCategories] = useState<SourceCategoryName[]>([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editorContent, setEditorContent] = useState('');
    const [textIsPresent, setTextIsPresent] = useState<boolean>(false);
    const [textIsChanged, setTextIsChanged] = useState<boolean>(false);
    const [editorCharacterCount, setEditorCharacterCount] = useState<number>(0);
    const maxLength = character_limit || 10000;

    message.config({
        top: 100,
        duration: 3,
        maxCount: 3,
    });

    const getAvailableCategories = async (isNewCat: boolean): Promise<SourceCategoryName[] | undefined> => {
        try {
            const categories = await SourcesApi.getAllCategories();
            sourcesAdminStore.setInternalSourceCategories(categories);

            const selected = sourceCreateUpdateStreetcode.streetcodeCategoryContents
                .filter((srcCatContent) => srcCatContent.sourceLinkCategoryId
                    && (srcCatContent as StreetcodeCategoryContentUpdate).modelState !== ModelState.Deleted);

            const selectedIds = selected.map((srcCatContent) => srcCatContent.sourceLinkCategoryId);
            const available = allCategories.filter((c) => !selectedIds.includes(c.id));
            if (categoryUpdate.current) {
                const sourceLinkCategoryId = categoryUpdate.current?.sourceLinkCategoryId;
                const foundCategoryIndex = allCategories.findIndex((c) => c.id === sourceLinkCategoryId);
                if (foundCategoryIndex !== -1) {
                    available.push(allCategories[foundCategoryIndex]);
                }
            }
            if (isNewCat) {
                const allCategoriesIds = allCategories.map((c) => c.id);
                const newlyCreatedCategories = categories.filter((c) => !allCategoriesIds.includes(c.id));
                available.push(...newlyCreatedCategories);
            }
            return available;
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const clearModal = () => {
        form.resetFields();
        setTextIsPresent(false);
        setTextIsChanged(false);
        setOpen(false);
        editorRef.current?.editor?.setText('');
    };

    async function fetchData() {
        const AvailableCats = await getAvailableCategories(false);
        if (AvailableCats)
            {
                setAvailableCategories(AvailableCats);
            }
    }

    useEffect(() => {
        categoryUpdate.current = sourceCreateUpdateStreetcode.ElementToUpdate;
        const categoryText = categoryUpdate?.current?.text;
        if (categoryUpdate.current && open) {
            setQuillEditorContent(editorRef.current, categoryText ?? '');
            setEditorContent(categoryText ?? '');
            form.setFieldValue('category', categoryUpdate.current.sourceLinkCategoryId);
        } else {
            categoryUpdate.current = null;
            setEditorContent('');
            editorRef.current?.editor?.setText('');
            form.setFieldValue('category', '');
        }

        if (allPersistedSourcesAreSet) {
            fetchData();
        }
    }, [open, sourceCreateUpdateStreetcode]);

    useEffect(() => {
        if (allCategories.length) {
            setCategories([...allCategories].sort((a, b) => a.title.localeCompare(b.title)));
        }
    }, [allCategories]);

    useEffect(() => {
        if (allPersistedSourcesAreSet) {
            fetchData();
        }
    }, [allPersistedSourcesAreSet]);

    const handleCategoryAdding = (
        values: any,
        indexOfPersistedCategory: number,
        isEditedCategoryPersisted: boolean,
    ) => {
        let ids: (number | undefined)[] = sourceCreateUpdateStreetcode.streetcodeCategoryContents.map((x) => x.id);
        let filteredIds: number[] = ids.filter((id): id is number => id !== undefined);
        if (!isEditedCategoryPersisted) {
            sourceCreateUpdateStreetcode
                .addSourceCategoryContent({
                    id: getNewMinNegativeId(filteredIds),
                    sourceLinkCategoryId: values.category,
                    text: editorContent ?? '',
                    streetcodeId: categoryUpdate.current?.streetcodeId ?? 0,
                });
            sourceCreateUpdateStreetcode.indexUpdate = sourceCreateUpdateStreetcode.streetcodeCategoryContents.length;
            sourceCreateUpdateStreetcode.indexUpdate -= 1;
        } else {
            sourceCreateUpdateStreetcode
                .updateElement(
                    indexOfPersistedCategory,
                    {
                        ...sourceCreateUpdateStreetcode.streetcodeCategoryContents[indexOfPersistedCategory],
                        sourceLinkCategoryId: values.category,
                        text: editorContent ?? '',
                    },
                );
            sourceCreateUpdateStreetcode.indexUpdate = indexOfPersistedCategory;
        }
    };

    const handleCategoryUpdating = (
        values: any,
        elementToUpdate: StreetcodeCategoryContent,
        indexOfPersistedCategory: number,
        isEditedCategoryPersisted: boolean,
    ) => {
        if (isEditingCategoryTextOnly(elementToUpdate, values.category)) {
            sourceCreateUpdateStreetcode
                .updateElement(
                    sourceCreateUpdateStreetcode.indexUpdate,
                    {
                        ...elementToUpdate,
                        sourceLinkCategoryId: values.category,
                        text: editorContent ?? '',
                    },
                );
        } else {
            sourceCreateUpdateStreetcode.removeSourceCategoryContent(sourceCreateUpdateStreetcode.indexUpdate);
            handleCategoryAdding(values, indexOfPersistedCategory, isEditedCategoryPersisted);
        }
    };

    const onSave = (values: any) => {
        const elementToUpdate = sourceCreateUpdateStreetcode.ElementToUpdate;
        const indexOfPersistedCategory = sourceCreateUpdateStreetcode.streetcodeCategoryContents
            .findIndex((x: StreetcodeCategoryContent) => x.sourceLinkCategoryId === Number(values.category));
        const isEditedCategoryPersisted = indexOfPersistedCategory !== -1;

        if (!elementToUpdate) {
            handleCategoryAdding(values, indexOfPersistedCategory, isEditedCategoryPersisted);
        } else {
            handleCategoryUpdating(values, elementToUpdate, indexOfPersistedCategory, isEditedCategoryPersisted);
        }

        onChange('saved', null);
    };

    const validateTextChange = () => {
        setTextIsChanged(true);
        const emptyTextField = editorRef.current?.editor?.getText().trim() === '';

        if (emptyTextField) {
            setTextIsPresent(false);
            return false;
        }

        setTextIsPresent(true);
        return true;
    };

    const handleOk = async () => {
        try {
            await form.validateFields();
            checkQuillEditorTextLength(editorCharacterCount, maxLength);
            if (validateTextChange()) {
                form.submit();
                message.success('Категорію для фанатів успішно додано!');
            } else {
                throw new Error();
            }
        } catch (error) {
            message.error("Будь ласка, заповніть всі обов'язкові поля та перевірте валідність ваших даних");
        }
    };

    const onUpdateStates = async (isNewCatAdded: boolean) => {
        if (isNewCatAdded === true) {
            const categories = await SourcesApi.getAllNames();
            setCategories(categories.sort((a, b) => a.title.localeCompare(b.title)));
            const AvailableCats = await getAvailableCategories(true);
            if (AvailableCats)
                {
                    setAvailableCategories(AvailableCats);
                }
            alert('Категорію успішно додано до списку!');
        }
    };

    const handleAdd = async (value: string) => {
        if (value === 'addCategory') {
            setIsAddModalVisible(true);
            form.resetFields(['category']);
        }
    };

    const handleDisabled = (categoryId: number) => !availableCategories.some((c) => c.id === categoryId);

    return (
        <Modal
            className="modalContainer"
            open={open}
            onCancel={() => {
                setOpen(false); sourceCreateUpdateStreetcode.indexUpdate = -1;
            }}
            footer={null}
            maskClosable
            centered
            closeIcon={(
                <Popover content="Внесені зміни не будуть збережені!" trigger="hover">
                    <CancelBtn className="iconSize" onClick={clearModal} />
                </Popover>
            )}
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={onSave}
            >
                <div className="center">
                    <h2>Для фанатів</h2>
                </div>
                <FormItem
                    label="Категорія:"
                    name="category"
                    rules={[{ required: true, message: 'Введіть Категорію' }]}
                >
                    <Select
                        key="selectForFansCategory"
                        className="category-select-input"
                        onChange={handleAdd}
                    >
                        <Select.Option key="addCategory" value="addCategory">
                            Додати нову категорію...
                        </Select.Option>
                        {Categories
                            .map((c) => (
                                <Select.Option
                                    key={`${c.id}`}
                                    value={c.id}
                                    disabled={handleDisabled(c.id)}
                                >
                                    {c.title}
                                </Select.Option>
                            ))}
                    </Select>
                </FormItem>
                <SourceModal
                    isModalVisible={isAddModalVisible}
                    isNewCategory={onUpdateStates}
                    setIsModalOpen={setIsAddModalVisible}
                />
                <FormItem label="Текст:">
                    <Editor
                        qRef={editorRef}
                        value={editorContent}
                        onChange={setEditorContent}
                        maxChars={maxLength}
                        onCharacterCountChange={setEditorCharacterCount}
                    />
                    {!textIsPresent && textIsChanged && (
                        <p className="form-text">Введіть текст</p>
                    )}
                </FormItem>
                <div className="center">
                    <Button
                        className="streetcode-custom-button"
                        onClick={() => handleOk()}
                    >
                        Зберегти
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default observer(CategoriesModal);
