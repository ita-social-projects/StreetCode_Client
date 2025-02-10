import { useEffect, useState } from 'react';
import { Cascader } from 'antd/es';
import useMobx from '@/app/stores/root-store';
import dayjs from 'dayjs';

interface Option {
  value: number;
  label: string;
  children?: Option[];
}

const EventStreetcodeCascader = ({ form }: { form: any }) => {
  const { streetcodeCatalogStore, timelineItemStore } = useMobx();

  useEffect(() => {
    const fetchCascaderData = async () => {
      try {
        await streetcodeCatalogStore.fetchCatalogStreetcodes(1);
        const streetcodeCatalog =
          streetcodeCatalogStore.getCatalogStreetcodesArray;

        const formattedOptions: Option[] = await Promise.all(
          streetcodeCatalog.map(async (streetcode: any) => {
            await timelineItemStore.fetchTimelineItemsByStreetcodeId(
              streetcode.id
            );
            const timelineItems = timelineItemStore.getTimelineItemArray;

            return {
              value: streetcode.id,
              label: streetcode.title,
              children: timelineItems.map((item: any) => ({
                value: item.id,
                label: item.title,
              })),
            };
          })
        );

        setCascaderOptions(formattedOptions);
      } catch (error) {
        console.error('Помилка завантаження стріткодів:', error);
      }
    };

    fetchCascaderData();
  }, []);

  const [cascaderOptions, setCascaderOptions] = useState<Option[]>([]);

  const handleChange = async (value: any) => {
    const selectedStreetcodeId = value[0];
    const selectedTimelineItemId = value[1];
    await timelineItemStore.fetchTimelineItemsByStreetcodeId(
      selectedStreetcodeId
    );
    const selectedTimelineItem = timelineItemStore.getTimelineItemArray.find(
      (item) => item.id === selectedTimelineItemId
    );

    await streetcodeCatalogStore.fetchCatalogStreetcodes(1);
    const selectedStreetcode =
      streetcodeCatalogStore.getCatalogStreetcodesArray.find(
        (item) => item.id === selectedTimelineItemId
      );

    if (selectedTimelineItem) {
      form.setFieldsValue({
        streetcodeId: selectedStreetcodeId,
        timelineItemId: selectedTimelineItemId,
        title: `${selectedStreetcode?.title}: ${selectedTimelineItem.title}`,
        date: dayjs(selectedTimelineItem.date),
        description: selectedTimelineItem.description,
        streetcodes: [
          ...(form.getFieldValue('streetcodes') || []),
          selectedStreetcodeId,
        ],
      });
    } else {
      console.error('Selected timeline item is undefined');
    }
  };

  return (
    <>
      <Cascader
        options={cascaderOptions}
        onChange={handleChange}
        placeholder='Оберіть подію'
      />
    </>
  );
};

export default EventStreetcodeCascader;
