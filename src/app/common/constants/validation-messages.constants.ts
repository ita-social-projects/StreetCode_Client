const VALIDATION_MESSAGES = {
  INVALID_VALIDATION:
    "Заповніть всі обов'язкові поля та перевірте валідність ваших даних",
  INVALID_CHARACTERS: 'Поле не може містити цифри та спеціальні символи',
  INVALID_TRANSLITARATION:
    'Транслітерація має містити лише малі латинські літери, цифри та дефіс',
  INVALID_IMAGE_FORMAT: 'Дозволені формати - “webp”, “jpeg”, “png”, “jpg”',
  INVALID_SOCIAL_LINK: 'Посилання не відповідає соціальній мережі',
  INVALID_AUDIO_FORMAT: 'Дозволені формати - "mp3"',
  INVALID_LINK_FORMAT: 'Недійсний формат посилання',
  DUPLICATE_PARTNER_TITLE: 'Партнер з такою назвою вже існує',
  DUPLICATE_TEAM_MEMBER: 'Такий член команди вже існує',
  DUPLICATE_NEWS_TITLE: 'Заголовок з такою назвою вже існує',
  DUPLICATE_NEWS_DESCRIPTION: 'Новина з таким описом вже існує',
  DUPLICATE_TRANSLITERATION: 'Така транслітерація вже існує',
  DUPLICATE_VACANCY_TITLE: 'Вакансія з такою назвою вже існує',
  DUPLICATE_CATEGORY_TITLE: 'Категорія з такою назвою вже існує',
  DUPLICATE_TAG_TITLE: 'Тег з такою назвою вже існує',
  DUPLICATE_CONTEXT_TITLE: 'Контекст з такою назвою вже існує',
  DUPLICATE_POSITION_TITLE: 'Позиція з такою назвою вже існує',
  DUPLICATE_SOCIAL_NETWORK: 'Таке посилання вже існує',
  DUPLICATE_NUMBER: 'Цей номер вже існує',
  DUPLICATE_FACT_TITLE: 'Факт з такою назвою вже існує',
  MAX_FILE_SIZE_3MB: 'Розмір файлу не має бути більше 3 Мб',
  MAX_FILE_SIZE_20MB: 'Розмір файлу не має бути більше 20 Мб',
  MAX_HISTORYCODE_TITLE_SIZE:
    'Назва history-коду не може містити більше 100 символів',
  MAX_NAME_SIZE: "Ім'я не може містити більше 50 символів",
  MAX_SURNAME_SIZE: 'Прізвище не може містити більше 50 символів',
};

export default VALIDATION_MESSAGES;
