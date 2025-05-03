import './StreetcodesTable.styles.scss';

import { ChangeEvent, Dispatch, useEffect, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Select, SelectProps, Pagination } from 'antd';

import BUTTON_LABELS from '@constants/buttonLabels';
import STREETCODE_STATES from '@features/AdminPage/StreetcodesTable/constants/streetcodeStates';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';

interface IProps {
    setStatus: Dispatch<React.SetStateAction<string[]>>;
    setTitle: Dispatch<React.SetStateAction<string | null>>;
    setRequest: (page: number, pageSize: number) => void;
}

const SearchMenu = ({ setStatus, setTitle, setRequest }: IProps) => {
    const [searchText, setSearchText] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSizeState, setPageSizeState] = useState(10);

    const options: SelectProps['options'] = [
        { value: 'Published', label: STREETCODE_STATES.PUBLISHED.label },
        { value: 'Draft', label: STREETCODE_STATES.DRAFT.label },
        { value: 'Deleted', label: STREETCODE_STATES.DELETED.label },
    ];

    const handleChangeStatus = (value: string[]) => {
        setSelectedStatuses(value);
        setStatus(value);
        setRequest(currentPage, pageSizeState);
    };

    const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchText(value);
        setTitle(value);
    };

    const handlePageChange = (page: number, pageSize: number) => {
        setCurrentPage(page);
        setPageSizeState(pageSize);
        setRequest(page, pageSize);
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setRequest(currentPage, pageSizeState);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchText, selectedStatuses, currentPage, pageSizeState]);

    return (
        <div className="searchMenu">
            <div className="searchMenuElement">
                <Input
                    placeholder="Назва"
                    prefix={<SearchOutlined style={{ color: '#c4c4c4' }} />}
                    allowClear
                    value={searchText}
                    onChange={handleChangeTitle}
                    className="searchInput"
                />
            </div>
            <div className="status_button">
                <div className="searchMenuElement">
                    <Select
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Статус"
                        options={options}
                        value={selectedStatuses[0] || undefined}
                        onChange={(value) => handleChangeStatus([value])}
                    />
                </div>
                <div className="searchMenuElement">
                    <Button
                        className="Button"
                        onClick={() =>
                            window.open(`${FRONTEND_ROUTES.ADMIN.NEW_STREETCODE}`, '_blank')
                        }
                    >
                        {BUTTON_LABELS.CREATE_STREETCODE}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SearchMenu;
