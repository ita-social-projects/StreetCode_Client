import './EditorPage.style.scss';

import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import TagsMainPage from '@features/AdminPage/TagsPage/TagsMainPage.component'
import CategoriesMainPage from '../CategoriesPage/CategoriesPage.component';
import PageBar from '../PageBar/PageBar.component';
import ContextMainPage from '@features/AdminPage/ContextPage/ContextMainPage.component';
import TeamPositionsMainPage from '@features/AdminPage/TeamPositionsPage/TeamPositionsMainPage.component';

const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Категорії',
        children: <CategoriesMainPage/>,
    },
    {
        key: '2',
        label: 'Теги',
        children: <TagsMainPage/>,
    },
    {
        key: '3',
        label: 'Контексти',
        children: <ContextMainPage/>,
    },
    {
        key: '4',
        label: 'Позиції',
        children: <TeamPositionsMainPage/>,
    },
];

const EditorPage = () => (
    <div className="editor-page-container">
        <PageBar />
        <Tabs className='editor-tabs' defaultActiveKey="1" items={items}/>
    </div>
);

export default EditorPage;
