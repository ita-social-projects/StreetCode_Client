import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';

import type { SelectProps } from 'antd';
import { Select } from 'antd';

const SelectWithCustomSuffix: React.FC<SelectProps<any>> = ({ children, ...props }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen((prevState) => !prevState);
    };
    return (
        <Select
            {...props}
            open={isOpen}
            onDropdownVisibleChange={(open) => setIsOpen(open)}
            suffixIcon={<DownOutlined onClick={toggleDropdown} />}
        >
            {children}
        </Select>
    );
};

export default SelectWithCustomSuffix;
