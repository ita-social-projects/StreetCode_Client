import { useEffect, useState } from 'react';
import {
  Button,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  message,
  Popover,
  Radio,
  RadioChangeEvent,
} from 'antd/es';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import EventStreetcodeCascader from '../../EventStreetcodeCascader/EventStreetcodeCascader.component';
import {
  CreateCalendarEvent,
  EventType,
  UpdateCalendarEvent,
} from '@/models/calendar/calendarEvent.model';
import SelectWithCustomSuffix from '@/app/common/components/SelectWithCustomSuffix';
import useMobx from '@/app/stores/root-store';
import { InfoCircleOutlined } from '@ant-design/icons/lib';
import './NewEventBlock.styles.scss';
import 'dayjs/locale/uk';
import dayjs from 'dayjs';
import ukUA from 'antd/es/locale/uk_UA';
import { useParams } from 'react-router-dom/dist';

dayjs.locale('uk');

const NewEventBlock: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentEventType, setCurrentEventType] =
    useState<EventType>('Historical');
  const { calendarStore, streetcodeCatalogStore } = useMobx();
  const { id } = useParams<any>();
  const parseId = id ? +id : null;
  const [streetcodesOptions, setStreetcodesOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const [selectedStreetcodes, setSelectedStreetcodes] = useState<number[]>([]);

  const options: CheckboxGroupProps['options'] = [
    { label: 'Історична', value: 'Historical' },
    { label: 'Власна', value: 'Custom' },
  ];

  useEffect(() => {
    if (parseId) {
      calendarStore.fetchAllEvents();
      const event = calendarStore.events.find((e) => e.id === parseId);

      form.setFieldsValue({
        title: event?.title,
        date: dayjs(event?.date),
        description: event?.description,
        location: event?.location,
        organizer: event?.organizer,
        timelineItemId: event?.timelineItemId,
        eventType: event?.eventType,
        streetcodes: event?.streetcodes?.map((s) => s.id),
      });

      setCurrentEventType(event?.eventType as EventType);
    } else {
      form.setFieldsValue({
        eventType: 'Historical',
      });
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await streetcodeCatalogStore.fetchCatalogStreetcodes(1);
      const loadedStreetcodes = [
        ...streetcodeCatalogStore.getCatalogStreetcodesArray,
      ];

      setStreetcodesOptions(
        loadedStreetcodes.map((s) => ({
          label: s.title,
          value: s.id,
        }))
      );
    };

    fetchData();
  }, [streetcodeCatalogStore]);

  const handleAdd = (id: number) => {
    setSelectedStreetcodes((prev) => [...prev, id]);
  };

  const handleDelete = (id: number) => {
    setSelectedStreetcodes((prev) => prev.filter((s) => s !== id));
  };

  const handleEventTypeChange = (event: RadioChangeEvent) => {
    setCurrentEventType(event.target.value);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);

    try {
      const newEvent: CreateCalendarEvent = {
        title: values.title,
        date: values.date.format('YYYY-MM-DD'),
        description: values.description,
        eventType: currentEventType,
        location: values.location || null,
        organizer: values.organizer || null,
        timelineItemId: values.timelineItemId || null,
        streetcodeIds: values.streetcodes || [],
      };
      if (parseId) {
        const updatedEvent: UpdateCalendarEvent = {
          ...newEvent,
          id: parseId,
        };
        await calendarStore.updateEvent(updatedEvent);
        message.success('Подію успішно оновлено!');
      } else {
        await calendarStore.addEvent(newEvent);
        message.success('Подію успішно додано!');

        form.resetFields();
      }
    } catch (error) {
      console.error('Помилка зберегти події:', error);
      message.error('Не вдалося зберегти подію.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!parseId ? <h2>Нова подія до календаря</h2> : null}
      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        scrollToFirstError
      >
        <div className='mainblock-add-form'>
          <Form.Item
            name='eventType'
            label='Тип події'
            rules={[{ required: true, message: 'Оберіть тип події!' }]}
          >
            <div className='radio-type'>
              <Radio.Group
                options={options}
                value={currentEventType}
                optionType='button'
                buttonStyle='solid'
                onChange={handleEventTypeChange}
              />
            </div>
          </Form.Item>

          {currentEventType === 'Historical' ? (
            <Form.Item
              name='timelineItemId'
              label={
                <div className='choose-timeline-item-block-label'>
                  <p>
                    Бажаєте обрати подію з хронології існуючого History-коду?
                  </p>
                  <Popover
                    className='info-container'
                    placement='topLeft'
                    content={
                      <p className='label-tags-block-info-container-content'>
                        Оберіть з переліку History-код та подію з пов'язаною з
                        ним хронологією. Деякі поля будуть автоматично заповнені
                        згідно обраної хронологічної події, але їх можна буде
                        змінити.
                      </p>
                    }
                  >
                    <InfoCircleOutlined className='info-icon' />
                  </Popover>
                </div>
              }
            >
              <EventStreetcodeCascader form={form} />
            </Form.Item>
          ) : null}

          <Form.Item
            name='title'
            label='Назва події'
            className='maincard-item'
            rules={[
              {
                required: true,
                message: 'Будь ласка, введіть назву події!',
              },
            ]}
          >
            <Input showCount maxLength={100} />
          </Form.Item>

          <ConfigProvider locale={ukUA}>
            <Form.Item
              name='date'
              label='Дата події'
              rules={[
                { required: true, message: 'Будь ласка, виберіть дату!' },
              ]}
            >
              <DatePicker format='YYYY-MM-DD' />
            </Form.Item>
          </ConfigProvider>

          <Form.Item name='description' label='Опис'>
            <Input.TextArea showCount maxLength={500} style={{ height: 120 }} />
          </Form.Item>

          <Form.Item name='streetcodes' label='Пов’язані History-коди'>
            <SelectWithCustomSuffix
              mode='multiple'
              placeholder='Знайти history-код...'
              value={selectedStreetcodes}
              onSelect={handleAdd}
              onDeselect={handleDelete}
              filterOption={(input, option) =>
                typeof option?.label === 'string' &&
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              options={streetcodesOptions}
            />
          </Form.Item>

          {currentEventType === 'Custom' ? (
            <Form.Item name='location' label='Локація'>
              <Input showCount />
            </Form.Item>
          ) : null}

          {currentEventType === 'Custom' ? (
            <Form.Item name='organizer' label='Організатор'>
              <Input showCount />
            </Form.Item>
          ) : null}
        </div>

        <Button
          htmlType='submit'
          className='submit-event-button'
          name={'submit'}
        >
          {parseId ? 'Оновити подію' : 'Додати подію'}
        </Button>
      </Form>
    </>
  );
};

export default NewEventBlock;
