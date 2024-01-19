import QuillEditor from 'react-quill';

export const setQuillEditorContent = (currentEditor: QuillEditor | null, text: string) => {
    if (currentEditor && currentEditor.editor) {
        const delta = currentEditor.editor.clipboard.convert(text);
        currentEditor.editor.setContents(delta);
    }
};

export const checkQuillEditorTextLength = (counter: number, maxChars: number) => {
    if (counter > maxChars) {
        throw new Error();
    }
};
