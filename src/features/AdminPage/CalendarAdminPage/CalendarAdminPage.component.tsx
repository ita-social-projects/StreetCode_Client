import useMobx, { useModalContext } from '@/app/stores/root-store';
import PageBar from '../PageBar/PageBar.component';
import { useQuery } from '@tanstack/react-query';
import Table, { ColumnsType } from 'antd/es/table';
import CalendarEvent, {
  mapEventTypeToNum,
} from '@/models/calendar/calendarEvent.model';
import {
  Button,
  ConfigProvider,
  Dropdown,
  Empty,
  MenuProps,
  Pagination,
  Tag,
} from 'antd/es';
import dayjs from 'dayjs';
import './CalendarAdminPage.styles.scss';
import { useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons/lib';
import CalendarControlBar from './CalendarControlBar/CalendarControlBar.component';
import { StreetcodeShort } from '@/models/streetcode/streetcode-types.model';
import { observer } from 'mobx-react-lite/dist';

const CalendarAdminPage = observer(() => {
  const { modalStore } = useModalContext();
  const { calendarStore } = useMobx();

  const [eventType, setEventType] = useState<string>('historical');

  const { isLoading } = useQuery({
    queryKey: ['events', eventType, calendarStore.CurrentPage],
    queryFn: () => calendarStore.fetchAllEvents(mapEventTypeToNum(eventType)),
  });

  const menuProps: MenuProps = {
    items: [
      {
        key: '1',
        label: 'Історичні події',
      },
      {
        key: '2',
        label: 'Власні події',
      },
    ],
  };

  const columnsBase: ColumnsType<CalendarEvent> = [
    {
      title: 'Назва',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
      sorter: (a, b) => a.title.localeCompare(b.title),
      showSorterTooltip: false,
      render(value: string, record: CalendarEvent) {
        return (
          <div
            key={`${value}${record.id}`}
            className='calendar-table-item-name'
          >
            {value}
          </div>
        );
      },
    },
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      showSorterTooltip: false,
      render: (value) => {
        const date = dayjs(value);
        return <div>{date.format('YYYY-MM-DD')}</div>;
      },
    },
    {
      title: "Пов'язані History-коди",
      dataIndex: 'streetcodes',
      key: 'streetcodes',
      width: '20%',
      render: (streetcodes?: StreetcodeShort[]) => {
        return streetcodes ? (
          <div className='tagModalContainer'>
            {streetcodes.map((s) => (
              <Tag
                className='tagItem'
                color='#FFFFFF'
                bordered={false}
                key={s.id}
              >
                {s.title}
              </Tag>
            ))}
          </div>
        ) : (
          ''
        );
      },
    },
  ];

  const actionColumn: ColumnsType<CalendarEvent>[0] = {
    title: 'Дії',
    dataIndex: 'action',
    key: 'action',
    width: '10%',
    render: (value, event, index) => (
      <div key={`${event.id}${index}`} className='event-page-actions'>
        <DeleteOutlined
          key={`${event.id}${index}111`}
          className='actionButton'
          onClick={() => {
            modalStore.setConfirmationModal(
              'confirmation',
              () => {
                calendarStore.removeEvent(event.id);
                modalStore.setConfirmationModal('confirmation');
              },
              'Ви впевнені, що хочете видалити цю подію?'
            );
          }}
        />
        <EditOutlined
          key={`${event.id}${index}`}
          className='actionButton'
          onClick={() => {}}
        />
      </div>
    ),
  };
  const columnsHistorical: ColumnsType<CalendarEvent> = [...columnsBase].concat(
    actionColumn
  );

  const columnsCustom: ColumnsType<CalendarEvent> = [
    ...columnsBase,
    {
      title: 'Локація',
      dataIndex: 'location',
      key: 'location',
      width: '20%',
      render(value: any, record: { id: any }) {
        return <div key={`${value}${record.id}`}>{value}</div>;
      },
    },
    {
      title: 'Організатор',
      dataIndex: 'organizer',
      key: 'organizer',
      width: '20%',
      render(value: any, record: { id: any }) {
        return <div key={`${value}${record.id}`}>{value}</div>;
      },
    },
  ].concat(actionColumn);

  const handleChange = (value: string) => {
    setEventType(value);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#E04031',
          colorPrimaryHover: '#ff4d4f',
        },
      }}
    >
      <div className='calendar-admin-page'>
        <PageBar />
        <div className='calendar-admin-page-container'>
          <CalendarControlBar handleChange={handleChange} />
          <Table
            key={calendarStore.events.length}
            pagination={false}
            className='calendar-table'
            columns={
              eventType === 'historical' ? columnsHistorical : columnsCustom
            }
            dataSource={calendarStore.events}
            rowKey='id'
            locale={{
              emptyText: isLoading ? (
                <div className='loadingWrapper'>
                  <div id='loadingGif' />
                </div>
              ) : (
                <Empty description='Дані відсутні' />
              ),
            }}
          />
          <div className='underTableZone'>
            <div className='underTableElement'>
              <Pagination
                className='paginationElement'
                showSizeChanger={false}
                defaultCurrent={1}
                current={calendarStore.PaginationInfo.CurrentPage}
                total={calendarStore.PaginationInfo.TotalItems}
                pageSize={calendarStore.PaginationInfo.PageSize}
                onChange={(value: any) => {
                  calendarStore.setCurrentPage(value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
});

export default CalendarAdminPage;
