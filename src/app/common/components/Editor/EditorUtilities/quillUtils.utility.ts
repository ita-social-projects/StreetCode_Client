import QuillEditor from 'react-quill';

export const setQuillEditorContent = (currentEditor: QuillEditor | null, text: string) => {
    if (currentEditor && currentEditor.editor) {
        const delta = currentEditor.editor.clipboard.convert(text);
        currentEditor.editor.setContents(delta);
    }
};

export const checkQuillEditorTextLength = (currentEditor: QuillEditor | null, maxChars: number) => {
    if (currentEditor && currentEditor.editor) {
        if (currentEditor.editor.getText().length > maxChars) {
            throw new Error();
        }
    }
};
