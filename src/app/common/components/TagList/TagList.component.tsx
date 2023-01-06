import './TagList.styles.scss';

import { Button } from 'antd';

const TagList = () => {
    // fetching goes here
    const tags = ['Історія', 'Україна-Русь', 'Наукова школа', 'Наука', 'Політика', 'Професор історії'];

    return (
      <div className="tagContainer">
        {tags.map((tag) => (
          <Button className="tagItem">
            {tag}
          </Button>
            ))}
      </div>
    );
};

export default TagList;
