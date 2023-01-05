import './ReadMore.styles.scss';

import { useState } from 'react';

import SearchTerms from '../SearchTerms/SearchTerms.component';

type Props = { children: string };
function ReadMore(props: Props) {
      const text = props.children;
      const [isReadMore, setIsReadMore] = useState(true);
      const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
      };

     return (
       <div>
         {text.length > text.slice(0, 2000).length
        ? (
          <div className="text" style={{ whiteSpace: 'pre-line' }}>
            {isReadMore ? <div><SearchTerms allText={`${text.slice(0, 2000)}...`} /></div> : <div><SearchTerms allText={text} /></div>}
            <div className="readMore-block">
              <span className="readMore" onClick={toggleReadMore}>
                {isReadMore ? 'Трохи ще' : 'Приховати текст'}
              </span>
            </div>
          </div>
)
      : (
        <div className="text-all" style={{ whiteSpace: 'pre-line' }}>
          <SearchTerms allText={text} />
        </div>
      )}
       </div>
     );
    }
export default ReadMore;
