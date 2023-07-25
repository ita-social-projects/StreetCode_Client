import React from 'react';
import useMobx from '@app/stores/root-store';

import { Form, Input } from 'antd';

interface Props {
    onChange: (field: string, value: any) => void;
}

const ARBlock: React.FC<Props> = ({ onChange }) => {
    const { newStreetcodeInfoStore } = useMobx();
    const handleInputChange = (fieldName: string, value: any) => {
        onChange(fieldName, value);
    };
    return (
        <Form.Item
            name="arlink"
            label="AR-посилання"
            className="ar-link-form-item"
        >
            <Input
                maxLength={500}
                showCount
                onChange={(e) => handleInputChange(Form.Item.name, e.target.value)}
            />
        </Form.Item>
    );
};
export default ARBlock;
