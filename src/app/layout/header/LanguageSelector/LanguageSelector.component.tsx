import './LanguageSelector.styles.scss';

import { Button, Dropdown } from 'antd';

const items = [
    {
        key: '1',
        disabled: true,
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                UA (Ukrainian)
            </a>
        ),
    },
    {
        key: '2',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                RU (Russian)
            </a>
        ),
    },
    {
        key: '3',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                EN (English GB)
            </a>
        ),
    },
];

const LanguageSelector = () => (
    <Dropdown menu={{ items }} placement="bottom" arrow={{ pointAtCenter: true }}>
        <Button className="langSelector">
            <span>UA</span>
        </Button>
    </Dropdown>
);

export default LanguageSelector;
