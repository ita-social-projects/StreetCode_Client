import { useState } from "react";
import "./ReadMore.styles.scss"
import SearchTerms from "../SearchTerms/SearchTerms.component";

type Props ={children: string}
const ReadMore = (props: Props) => {
      const text= props.children;
      const [isReadMore, setIsReadMore] = useState(true);
      const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
      };
    
     return(
      <div>
      {text.length > text.slice(0, 2000).length ?     
        <div className="text" style={{whiteSpace:"pre-line"}}>
          {isReadMore ? <div className="text-short" style={{whiteSpace:"pre-line"}}>
                                 <SearchTerms allText={text}/>   
                        </div> 
        : <div><SearchTerms allText={text}/></div>}
          <div className="readMore-block">
            <span className="readMore" onClick={toggleReadMore}>
            {isReadMore ? "Трохи ще": "Дещо менше"}
            </span>
          </div>
        </div> 
      :
        <div className="text-all" style={{whiteSpace:"pre-line"}}>
          <SearchTerms allText={text}/>   
        </div>
      }
      </div>
     )
    };
export default ReadMore;