interface IMetaPlaceholders {
  title: string;
  description: string;
  image: string;
}

const META_PLACEHOLDERS: IMetaPlaceholders = {
  title: '__PAGE_TITLE__',
  description: '__PAGE_DESCRIPTION__',
  image: '__PAGE_IMAGE__',
};

export default META_PLACEHOLDERS;
