const VALIDATION_MESSAGES = {
  INVALID_CHARACTERS: 'Поле не може містити цифри та спеціальні символи',
  INVALID_TRANSLITARATION:
    'Транслітерація має містити лише малі латинські літери, цифри та дефіс',
  MAX_FILE_SIZE_3MB: 'Розмір файлу не має бути більше 3 Мб',
  MAX_FILE_SIZE_20MB: 'Розмір файлу не має бути більше 20 Мб',
  INVALID_IMAGE_FORMAT: 'Дозволені формати - “webp”, “jpeg”, “png”, “jpg”',
  DUPLICATE_PARTNER_TITLE: 'Партнер з такою назвою вже існує',
  DUPLICATE_TEAM_MEMBER: 'Такий член команди вже існує',
  DUPLICATE_NEWS_TITLE: 'Заголовок з такою назвою вже існує',
  DUPLICATE_NEWS_DESCRIPTION: 'Новина з таким описом вже існує',
  DUPLICATE_TRANSLITERATION: 'Така транслітерація вже існує',
  DUPLICATE_VACANCY_TITLE: 'Вакансія з такою назвою вже існує',
  DUPLICATE_CATEGORY_TITLE: 'Категорія з такою назвою вже існує',
  DUPLICATE_TAG_TITLE: 'Тег з такою назвою вже існує',
  DUPLICATE_CONTEXT_TITLE: 'Контекст з такою назвою вже існує',
  DUPLICATE_POSITION: 'Позиція з такою назвою вже існує',
  INVALID_SOCIAL_LINK: 'Посилання не відповідає соціальній мережі',
};

export default VALIDATION_MESSAGES;
