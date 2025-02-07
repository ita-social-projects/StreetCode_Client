import { useEffect, useState } from "react";
import { Cascader } from "antd/es";
import useMobx from "@/app/stores/root-store";
import dayjs from "dayjs";

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
        console.error("Помилка завантаження стріткодів:", error);
      }
    };

    fetchCascaderData();
  }, []);

  const [cascaderOptions, setCascaderOptions] = useState<Option[]>([]);

  const handleChange = async (value: any) => {
    await timelineItemStore.fetchTimelineItemsByStreetcodeId(value[0]);
    const selectedTimelineItem = timelineItemStore.getTimelineItemArray.find(
      (item) => item.id === value[1]
    );

    await streetcodeCatalogStore.fetchCatalogStreetcodes(1);
    const selectedStreetcode =
      streetcodeCatalogStore.getCatalogStreetcodesArray.find(
        (item) => item.id === value[0]
      );

    console.log(
      "selected tl " + selectedTimelineItem + selectedTimelineItem?.date
    );
    if (selectedTimelineItem) {
      form.setFieldsValue({
        timelineItemId: value[1],
        title: `${selectedStreetcode?.title}: ${selectedTimelineItem.title}`,
        date: dayjs(selectedTimelineItem.date),
        description: selectedTimelineItem.description,
      });
    } else {
      console.error("Selected timeline item is undefined");
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
