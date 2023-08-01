import '@features/AdminPage/AdminModal.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import getMaxId from '@app/common/utils/getMaxId';
import getNewMinNegativeId from '@app/common/utils/newIdForStore';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import { ModelState } from '@models/enums/model-state';
import useMobx from '@stores/root-store';
import { Editor } from '@tinymce/tinymce-react';

import { Button, Form, Modal, Popover, Select } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import SourcesApi from '@/app/api/sources/sources.api';
import AddSourceModal from '@/features/AdminPage/ForFansPage/ForFansPage/CategoryAdminModal.component';
import {
    SourceCategory,
    SourceCategoryAdmin,
    SourceCategoryName,
    StreetcodeCategoryContent,
    StreetcodeCategoryContentUpdate,
} from '@/models/sources/sources.model';

interface Props {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    allCategories: SourceCategoryName[],
    onChange: (field: string, value: any) => void,
}

const ForFansModal = ({ open, setOpen, allCategories, onChange } : Props) => {
    const { sourceCreateUpdateStreetcode, sourcesAdminStore } = useMobx();
    const editorRef = useRef<Editor | null>(null);
    const categoryUpdate = useRef<StreetcodeCategoryContent | null>();
    const [availableCategories, setAvailableCategories] = useState<SourceCategoryName[]>([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [form] = Form.useForm();
    const getAvailableCategories = (): SourceCategoryName[] => {
        const selected = sourceCreateUpdateStreetcode.streetcodeCategoryContents
            .filter((srcCatContent) => srcCatContent.sourceLinkCategoryId
                && (srcCatContent as StreetcodeCategoryContentUpdate).modelState !== ModelState.Deleted);

        const selectedIds = selected.map((srcCatContent) => srcCatContent.sourceLinkCategoryId);
        const available = allCategories.filter((c) => !selectedIds.includes(c.id));

        if (categoryUpdate.current) {
            available.push(allCategories[allCategories.findIndex((c) => c.id === categoryUpdate
                .current?.sourceLinkCategoryId)]);
        }
        return available;
    };
    const clearModal = () => {
        form.resetFields();
        setOpen(false);
    }

    useEffect(() => {
        categoryUpdate.current = sourceCreateUpdateStreetcode.ElementToUpdate;
        setAvailableCategories(getAvailableCategories());
        if (categoryUpdate.current && open) {
            editorRef.current?.editor?.setContent(categoryUpdate.current.text ?? '');
            form.setFieldValue('category', categoryUpdate.current.sourceLinkCategoryId);
        } else {
            categoryUpdate.current = null;
            editorRef.current?.editor?.setContent('');
            form.setFieldValue('category', (availableCategories.length > 0 ? availableCategories[0].id : undefined));
        }
    }, [open, sourceCreateUpdateStreetcode]);

    const onSave = (values:any) => {
        const elementToUpdate = sourceCreateUpdateStreetcode.ElementToUpdate;
        if (elementToUpdate) {
            sourceCreateUpdateStreetcode
                .updateElement(
                    sourceCreateUpdateStreetcode.indexUpdate,
                    { ...elementToUpdate,
                      sourceLinkCategoryId: values.category,
                      text: editorRef.current?.editor?.getContent() ?? '' },
                );
        } else {
            sourceCreateUpdateStreetcode
                .addSourceCategoryContent({
                    id: getNewMinNegativeId(sourceCreateUpdateStreetcode.streetcodeCategoryContents.map((x) => x.id)),
                    sourceLinkCategoryId: values.category,
                    text: editorRef.current?.editor?.getContent() ?? '',
                    streetcodeId: categoryUpdate.current?.streetcodeId ?? 0,
                });
        }
        setOpen(false);
        sourceCreateUpdateStreetcode.indexUpdate = -1;
        onChange('saved', null);
    };

    const onClose = async () => {
        setAvailableCategories(getAvailableCategories());
        if (isAddModalVisible === false) {
            const categories = await SourcesApi.getAllCategories();
            sourcesAdminStore.setInternalSourceCategories(categories);

            const sourceMas: SourceCategoryName[] = categories.map((x) => ({
                id: x.id ?? 0,
                title: x.title,
            }));

            setAvailableCategories(sourceMas);
        }
    };

    const handleAdd = async (value: string) => {
        if (value === 'addCategory') {
            setIsAddModalVisible(true);
            form.resetFields(['category']);
        }
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
    };

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
            closeIcon={<Popover content="Внесені зміни не будуть збережені!" trigger='hover'>
                <div className='iconSize'>
                    <CancelBtn onClick={clearModal} />
                </div>
            </Popover>}
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
                        onDropdownVisibleChange={onClose}
                    >
                        <Select.Option key="addCategory" value="addCategory">
                            Додати нову категорію...
                        </Select.Option>
                        {availableCategories
                            .map((c) => <Select.Option key={`${c.id}`} value={c.id}>{c.title}</Select.Option>)}
                    </Select>
                </FormItem>
                <AddSourceModal
                    isAddModalVisible={isAddModalVisible}
                    handleAddCancel={handleAddCancel}
                />
                <FormItem
                    label="Текст: "
                >
                    <Editor
                        ref={editorRef}
                        init={{
                            max_chars: 800,
                            height: 300,
                            menubar: false,
                            plugins: [
                                'autolink',
                                'lists', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                                'insertdatetime', 'wordcount', 'link', 'lists', 'formatselect ',
                            ],
                            toolbar: 'undo redo blocks bold italic link align | underline superscript subscript '
                     + 'formats blockformats align | removeformat strikethrough ',
                            toolbar_mode: 'sliding',
                            content_style: 'body { font-family:Roboto,Helvetica Neue,sans-serif; font-size:14px }',
                        }}
                    />
                </FormItem>
                <div className="center">
                    <Button className="streetcode-custom-button" htmlType="submit">
                        Зберегти
                    </Button>
                </div>
            </Form>

        </Modal>
    );
};

export default observer(ForFansModal);
