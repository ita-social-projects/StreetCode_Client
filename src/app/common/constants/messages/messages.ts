export const MESSAGES = {
  SAVING: 'Зберігання..',
  ERROR: {
    COULD_NOT_LOAD: (item: string) =>
      `Не вдалось оновити/додати ${item}. Спробуйте ще раз.`,
  },
  VALIDATION: {
    REQUIRED: "Це поле є обов'язковим",
    ENTER_TITLE: 'Введіть назву',
    ENTER_SURNAME_NAME: "Введіть прізвище та ім'я",
    ENTER_HEADING: 'Введіть заголовок',
    ENTER_LINK: 'Введіть посилання',
    ENTER_RIGHT_LINK: 'Введіть правильне посилання',
    ADD_IMAGE: 'Додайте фото',
    ADD_LOGO: 'Додайте лого',
    CHOOSE_SOCIAL_NETWORK: 'Оберіть соц. мережу',
    SOCIAL_NETWORK_NOT_MATCH: 'Посилання не відповідає соціальній мережі',
    SOCIAL_NETWORK_ALREADY_EXISTS:
      'Посилання на цю таку соціальну мережу вже додано',
    INVALID_LINK: 'Невірний формат посилання',
    FILE_FORMAT: (formats: string[]) =>
      `Дозволені формати - ${formats.join(', ')}`,
    FILE_SIZE: (size: number) => `Розмір файлу не має бути більше ${size} Мб`,
    UNIQUE_TITLE: (item: string) => `${item} з такою назвою вже існує`,
    UNIQUE_DESCRIPTION: (item: string) => `${item} з таким описом вже існує`,
    FIELD_WITHOUT_NUMS_SPECIAL_CHARACTERS: `Поле не може містити цифри та спеціальні символи`,
    STREETCODE_NUMBER_EXIST: `Цей номер вже існує`,
    ONLY_YOUTUBE_LINK:
      'Вставте тільки youtube.com посилання. Це поле не підтримує інші формати URL',
  },
  SUCCESS: {
    ITEM_CREATED: (item: string) => `${item} успішно створено`,
    ITEM_ADDED: (item: string) => `${item} успішно додано`,
    ITEM_ADDED_UPDATED: (item: string) => `${item} успішно додано/оновлено`,
    ITEM_DELETED: (item: string) => `${item} успішно видалено`,
    STATUS_CHANGED: (item: string) => `Статус ${item} успішно змінено`,
  },
};
