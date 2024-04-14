/* eslint-disable react/jsx-one-expression-per-line */
import './QEditor.styles.scss';

import React, { useEffect, useRef, useState } from 'react';
import ReactQuill, { UnprivilegedEditor } from 'react-quill';
import { refactorIndentsHtml, removeHtmlTags } from '@app/common/utils/removeHtmlTags.utility';
import { Sources } from 'quill';

import 'react-quill/dist/quill.snow.css';

import LinkHandler from './EditorExtensions/LinkHandler';

interface EditorProps {
    qRef: React.RefObject<ReactQuill>,
    value: string,
    onChange: (html: string) => void;
    maxChars: number,
    initialVal?: string,
    selectionChange?: (selection: string) => void,
    onCharacterCountChange?: (count: number) => void,
}

const Editor: React.FC<EditorProps> = ({
    qRef, value, onChange, maxChars, initialVal, selectionChange, onCharacterCountChange = () => {},
}) => {
    const indentedValue = refactorIndentsHtml(value || '');
    const [val, setVal] = useState(indentedValue);
    const [rawText, setRawText] = useState(removeHtmlTags(value) ?? '');
    const [characterCount, setCharacterCount] = useState(rawText.length ?? 0);
    const [validateDescription, setValidateDescription] = useState<boolean>(false);
    const quillRef = useRef<ReactQuill | null>(null);
    const availableButtons = new Set(['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
        'ArrowUp', 'ArrowDown', 'Home', 'End']);

    const countCharacters = (content: string) => {
        const textWithoutTags = removeHtmlTags(content);
        const count = textWithoutTags.length;
        setCharacterCount(count);
    };

    useEffect(() => {
        if (value?.includes('\n')) {
            const preservedIndents = refactorIndentsHtml(value || '');
            setVal(preservedIndents);
        }
        const valueWithoutHtml = removeHtmlTags(value);
        setRawText(valueWithoutHtml);
    }, [value]);

    useEffect(() => {
        if (characterCount > maxChars) {
            setValidateDescription(true);
        } else {
            setValidateDescription(false);
        }
    }, [characterCount, maxChars]);

    useEffect(() => {
        onCharacterCountChange(characterCount);
    }, [characterCount, onCharacterCountChange]);

    const handleOnChange = (html: string) => {
        onChange(html);
        setVal(html);
        countCharacters(html);
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
                [{ header: [1, 2, 3, 4, 5, 6] }],
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
            // qRef.current = el; temp commented
        }
    };

    return (
        <>
            <div className="quillEditor">
                <ReactQuill
                    defaultValue={initialVal}
                    value={val || ''}
                    onChange={handleOnChange}
                    modules={modules}
                    onKeyDown={handleKeyDown}
                    ref={handleQuillRef}
                    style={{ height: 300 }}
                    formats={formats}
                    theme="snow"
                    onChangeSelection={handleSelectionChange}
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
