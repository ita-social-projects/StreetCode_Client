import React from 'react';

import { Form, Input, InputNumber, Select } from 'antd';

const MainBlockAdmin: React.FC<{ streetcodeType: 'people' | 'event' }> = ({ streetcodeType }) => {
    const tags: string[] = ['1', '2', '3', '4'];
    return (
        <Form layout="vertical">
            <Form.Item label="Номер стріткоду">
                <InputNumber min={0} />
            </Form.Item>
            {streetcodeType === 'people' ? (
                <Input.Group compact>
                    <Form.Item label="Прізвище">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Ім'я">
                        <Input />
                    </Form.Item>
                    <Form.Item label="По батькові">
                        <Input />
                    </Form.Item>
                </Input.Group>
            )
                : (
                    <Form.Item label="Назва події">
                        <Input />
                    </Form.Item>
                )}

            <Select style={{width:"100%"}} mode="tags">
                {tags.map(t => <Option value={t} label={t} />)}
            </Select>
        </Form>
    );
};
export default MainBlockAdmin;
