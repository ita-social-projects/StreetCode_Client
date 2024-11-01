import './QEditor.styles.scss';

import React, { useEffect, useRef, useState } from 'react';
import ReactQuill, { UnprivilegedEditor } from 'react-quill';
import { refactorIndentsHtml, removeHtmlTags } from '@app/common/utils/removeHtmlTags.utility';
import { Sources } from 'quill';

import 'react-quill/dist/quill.snow.css';

import LinkHandler from './EditorExtensions/LinkHandler';

interface EditorProps {
    qRef: React.MutableRefObject<ReactQuill | null>,
    value: string,
    onChange: (html: string) => void;
    maxChars: number,
    initialVal?: string,
    selectionChange?: (selection: string) => void,
    onCharacterCountChange?: (count: number) => void,
    readOnly?: boolean;
}

const Editor: React.FC<EditorProps> = ({
    qRef, value, onChange, maxChars, initialVal, selectionChange, onCharacterCountChange = () => { }, readOnly = false
}) => {
    const [isReadOnly, setIsReadOnly] = useState(readOnly);
    const indentedValue = refactorIndentsHtml(value || '');
    const [val, setVal] = useState(indentedValue);
    const [rawText, setRawText] = useState('');
    const [characterCount, setCharacterCount] = useState(0);
    const [validateDescription, setValidateDescription] = useState<boolean>(false);
    const quillRef = useRef<ReactQuill | null>(null);
    const availableButtons = new Set(['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
        'ArrowUp', 'ArrowDown', 'Home', 'End']);

    const countCharacters = (content: string) => {
        const textWithoutTags = removeHtmlTags(content);
        setRawText(textWithoutTags);
        const count = textWithoutTags.length;
        setCharacterCount(count);
    };

    useEffect(() => {
        const valueWithoutHtml = removeHtmlTags(value);
        setRawText(valueWithoutHtml);
        const count = valueWithoutHtml.length;
        setCharacterCount(count);
    }, [value]);

    useEffect(() => {
        if (characterCount > maxChars) {
            setValidateDescription(true);
        } else {
            setValidateDescription(false);
        }
    }, [characterCount, maxChars]);

    useEffect(() => {
        setIsReadOnly(readOnly);
    }, [readOnly]);

    useEffect(() => {
        onCharacterCountChange(characterCount);
    }, [characterCount, onCharacterCountChange]);

    const handleOnChange = (html: string) => {
        if (!isReadOnly) {
            onChange(html);
            setVal(html);
            const valueWithoutHtml = removeHtmlTags(html);
            setCharacterCount(valueWithoutHtml.length);
        }
    };

    const handleSelectionChange = (range: ReactQuill.Range | null, source: Sources, editor: UnprivilegedEditor) => {
        if (range && range.index != null && range.length != null) {
            const selectedText = editor.getText(range.index, range.length);
            if (selectionChange) {
                selectionChange(selectedText);
            }
        }
    };

    const modules = {
        toolbar: {
            container: [
                [{ header: [false, 1, 2, 3, 4, 5, 6] }],
                ['bold', 'italic', 'strike', 'underline', 'link'],
                [
                    { list: 'ordered' },
                    { list: 'bullet' },
                ],
                ['clean'],
            ],
            link: LinkHandler,
        },
    };

    const formats = [
        'header', 'size', 'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'indent', 'align', 'link', 'clean',
    ];

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (characterCount >= maxChars) {
            setValidateDescription(true);
            const ctrlAIsPressed = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a';
            const isSelectionEmpty = quillRef.current?.editor?.getSelection()?.length === 0;
            const disableKeysPressing = !availableButtons.has(e.key) && isSelectionEmpty && !ctrlAIsPressed;

            if (disableKeysPressing) {
                e.preventDefault();
            }
        }
    };

    const handleQuillRef = (el: ReactQuill | null) => {
        quillRef.current = el;
        if (qRef) {
            qRef.current = el;
        }
    };

    return (
        <>
            <div className="quillEditor">
                <ReactQuill
                    defaultValue={initialVal}
                    value={indentedValue}
                    onChange={handleOnChange}
                    modules={modules}
                    onKeyDown={handleKeyDown}
                    ref={handleQuillRef}
                    style={{ height: 300 }}
                    formats={formats}
                    theme="snow"
                    onChangeSelection={handleSelectionChange}
                    readOnly={isReadOnly}
                />
            </div>
            <div className="editorInfoContainer">
                {validateDescription && (
                    <span className="validateLabelDescription">
                        Максимальна довжина - {maxChars}
                    </span>
                )}
                <div className="charsCounter">
                    Символи: {characterCount}/{maxChars}
                </div>
            </div>
        </>
    );
};

export default Editor;
