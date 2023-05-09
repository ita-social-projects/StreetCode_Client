import './StatisticsAdmin.styles.scss';

import { EnvironmentOutlined } from '@ant-design/icons';

import { Button, Input } from 'antd';

const StatisticsComponentAdmin = () => (
    <div className="statisticsContainerAdmin">
        <h1>Додати стріткод на мапу:</h1>
        <Input
            className="input-streets"
            placeholder="введіть вулицю"
            prefix={<EnvironmentOutlined  className="site-form-item-icon" />}
             />
        <Button className="onMapbtn"><a>Обрати місце на мапі</a></Button>
    </div>
);
export default StatisticsComponentAdmin;
