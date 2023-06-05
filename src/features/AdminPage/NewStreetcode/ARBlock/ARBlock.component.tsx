import React from 'react';

import { Form, Input } from 'antd';

import useMobx from '@/app/stores/root-store';

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
