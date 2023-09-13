/* eslint-disable max-len */
import React from 'react';
import { Link } from 'react-router-dom';
import { NewsWithUrl } from '@models/news/news.model';

import { alsoReadArticleClickEvent } from '@/app/common/utils/googleAnalytics.unility';

interface RandomNewsBlockProps {
  newsValue: NewsWithUrl | undefined;
}

const RandomNewsBlock: React.FC<RandomNewsBlockProps> = ({ newsValue }) => (
    <div className={`randomNewsBlock ${newsValue?.news.url as unknown as string === newsValue?.randomNews.randomNewsUrl ? 'toHide' : ''}`}>
        <div className="randomNewsLink">
            <div className="additionalNewsText">
        Також читайте:
            </div>
            <div className="randomNewsTitleAndButtn">
                {newsValue?.randomNews.title}
                <div className="newsButtonContainer">
                    <Link
                        className={`Link ${newsValue?.news.url as unknown as string === newsValue?.randomNews.randomNewsUrl ? 'toHide' : ''}`}
                        to={`/news/${newsValue?.randomNews.randomNewsUrl}`}
                        onClick={alsoReadArticleClickEvent}
                    >
                        <button type="button">Перейти</button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
);

export default RandomNewsBlock;
