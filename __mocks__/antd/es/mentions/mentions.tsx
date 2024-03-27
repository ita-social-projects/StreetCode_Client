import React from 'react';

type OptionProps = {
    key: any,
    value: any,
}

export const Option = ({ key, value }: OptionProps) => {
    return(
        <>
            <div data-test-id='option-key'>{key}</div>
            <div data-test-id='option-value'>{value}</div>
        </>
    )
};
