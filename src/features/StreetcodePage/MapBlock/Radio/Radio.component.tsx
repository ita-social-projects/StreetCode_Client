import './Radio.styles.scss';

import React, { useEffect, useState } from 'react';

import type { RadioChangeEvent } from 'antd';
import { Checkbox , Radio, Space } from 'antd';

const RadioComponent = () => {
    const [value, setValue] = useState(1);

    const onChange = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    return (
        <div className="radioContainer">
            <Radio.Group onChange={onChange} value={value}>
                <Space direction="vertical">
                    <Checkbox  className={value === 1 ? "selected-radio-text " : "radio-text"} value={1}>Вулиці</Checkbox >
                    <Checkbox  className={value === 2 ? "selected-radio-text " : "radio-text"} value={2}>Стріткоди</Checkbox >
                    <Checkbox  className={value === 3 ? "selected-radio-text " : "radio-text"} value={3}>Маршрути</Checkbox >
                </Space>
            </Radio.Group>
        </div>
    );
};
export default RadioComponent;
