export interface IPageMetadata {
  title?: string;
  description?: string;
  image?: string;
}

const DEFAULT_META: IPageMetadata = {
  title: '',
  description:
    '«Стріткод: історія на кожному кроці» — платформа про імена в назвах вулиць.',
  image:
    'https://ita-social-projects.github.io/StreetCode_Client/public/banner.webp',
};

export default DEFAULT_META;
