import './NewEventPage.styles.scss';

import { ConfigProvider } from 'antd';

import PageBar from '../../PageBar/PageBar.component';

import NewEventBlock from './NewEventBlock/NewEventBlock.component';

const NewEventPage = () => (
    <ConfigProvider
        theme={{
            token: {
                colorPrimary: '#E04031',
                colorPrimaryHover: '#ff4d4f',
            },
        }}
    >
        <div className="new-event-page">
            <PageBar />
            <div className="adminContainer">
                <NewEventBlock />
            </div>
        </div>
    </ConfigProvider>
);

export default NewEventPage;
