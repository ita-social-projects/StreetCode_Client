export const MESSAGES = {
  VALIDATION: {
    REQUIRED: "Це поле є обов'язковим",
    FILE_FORMAT: (formats: string[]) =>
      `Дозволені формати - ${formats.join(', ')}`,
    FILE_SIZE: (size: number) => `Розмір файлу не має бути більше ${size} Мб`,
    UNIQUE_TITLE: (item: string) => `${item} з такою назвою вже існує`,
    UNIQUE_DESCRIPTION: (item: string) => `${item} з таким описом вже існує`,
    FIELD_WITHOUT_NUMS_SPECIAL_CHARACTERS: `Поле не може містити цифри та спеціальні символи`,
    STREETCODE_NUMBER_EXIST: `Цей номер вже існує`,
    ONLY_YOUTUBE_LINK: "Вставте тільки youtube.com посилання. Це поле не підтримує інші формати URL"
  },
  SUCCESS: {
    ITEM_CREATED: (item: string) => `${item} успішно створено`,
    ITEM_ADDED_UPDATED: (item: string) => `${item} успішно додано/оновлено`,
    ITEM_DELETED: (item: string) => `${item} успішно видалено`,
    STATUS_CHANGED: (item: string) => `Статус ${item} успішно змінено`,
  },
};
