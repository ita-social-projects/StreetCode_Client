import React from 'react';

type TextAreaProps = {
    showCount: boolean,
    maxLength: number,
}

const TextArea = ({ showCount, maxLength }: TextAreaProps) => {
    return(
        <>
            <div data-test-id="text-area-show-count">{showCount}</div>
            <div data-test-id="text-area-max-length">{maxLength}</div>
        </>
    )
}

export default TextArea;
