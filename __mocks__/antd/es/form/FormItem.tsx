import React from 'react';

type Rule = {
    required?: boolean,
}

type FormItemProps = {
    name?: string,
    label?: string,
    className?: string,
    rules?: Rule[],
    valuePropName?: string,
    // getValueFromEvent?: (...args) => any,

}

const FormItem = ({ name, label, className, rules, valuePropName }: FormItemProps) => {
    return(
        <>
            <div data-test-id="form-item-label">{label}</div>
            <div data-test-id="form-item-name">{name}</div>
            <div data-test-id="form-item-class">{className}</div>
            {
                rules?.some((rule) => {rule.required != undefined}) &&
                <div data-test-id="form-item-required"></div>
            }
            <div data-test-id="form-item-value-prop-name">{valuePropName}</div>
            {/* <div data-test-id="form-item-get-value-from-event">{getValueFromEvent}</div> */}
        </>
    )
};

export default FormItem;
