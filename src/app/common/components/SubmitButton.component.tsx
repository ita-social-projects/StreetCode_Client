import React, { useEffect, useState } from 'react';

import { Button, Form, FormInstance } from 'antd';

interface SubmitButtonProps {
    form: FormInstance;
    initialData?: any;
    className?: string;
    name?: string;
    onClick?: (data: any) => void;
    disabled?: boolean;
}

const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({
    form,
    initialData,
    className,
    name,
    onClick,
    children,
    disabled = false,
}) => {
    const [submittable, setSubmittable] = useState<boolean>(false);
    const [hasChanged, setHasChanged] = useState<boolean>(false);
    const values = Form.useWatch([], form);

    useEffect(() => {
        if (initialData) {
            form.resetFields();
            form.setFieldsValue(initialData);
        }
        setHasChanged(false);
        setSubmittable(false);
    }, [initialData, form]);

    useEffect(() => {
        if (initialData && !hasChanged && form.isFieldsTouched(true)) {
            setHasChanged(true);
        }

        form
            .validateFields({ validateOnly: true })
            .then(() => setSubmittable(true))
            .catch(() => setSubmittable(false));
    }, [form, values, initialData, hasChanged]);

    const handleClick = (data: any) => {
        if (onClick) {
            onClick(data);
            setSubmittable(false);
        }
    };

    return (
        <Button
            type="primary"
            htmlType="submit"
            disabled={!submittable || disabled || (initialData && !hasChanged)}
            className={className}
            name={name}
            onClick={handleClick}
        >
            {children}
        </Button>
    );
};

export default SubmitButton;
