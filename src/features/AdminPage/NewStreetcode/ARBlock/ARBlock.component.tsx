import React from 'react';
import useMobx from '@/app/stores/root-store';
import { Form, Input } from 'antd';

const ARBlock:React.FC = () => {
    const { newStreetcodeInfoStore } = useMobx();
    return (
        <Form.Item
            name="arlink"
            label="AR-посилання"
            className="ar-link-form-item"
        >
            <Input
                maxLength={500}
                showCount
            />
        </Form.Item>
    );
};
export default ARBlock;
