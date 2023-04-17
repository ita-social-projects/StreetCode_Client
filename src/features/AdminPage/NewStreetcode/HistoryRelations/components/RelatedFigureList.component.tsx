import './components.styles.scss';
import HistoryRelation from '../../../../../models/streetcode/related-figure.model';
import RelatedItem from './RelatedFigure.component';

interface Props {
    relations: Array<HistoryRelation>,
    setRelations: React.Dispatch<React.SetStateAction<Array<HistoryRelation>>>
}

const RelationsList = ({relations, setRelations} : Props) => {
    return (
      <div className="list-container">
        <ul id='list' className='related-figures-list'>
          {
            relations.map((rel)=>
              <li key={rel.title}>
                <RelatedItem
                  relation={rel}
                  relations={relations}
                  setRelations={setRelations}
                />
              </li>
            )
          }
        </ul>
      </div>
    )
  }

export default RelationsList;