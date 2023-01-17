import './Radio.styles.scss';

import React, { useEffect, useState } from 'react';

import type { RadioChangeEvent } from 'antd';
import { Input, Radio, Space } from 'antd';

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
                    <Radio className={value === 1 ? "selected-radio-text " : "radio-text"} value={1}>Вулиці</Radio>
                    <Radio className={value === 2 ? "selected-radio-text " : "radio-text"} value={2}>Стріткоди</Radio>
                    <Radio className={value === 3 ? "selected-radio-text " : "radio-text"} value={3}>Маршрути</Radio>
                </Space>
            </Radio.Group>
        </div>
    );
};
export default RadioComponent;
