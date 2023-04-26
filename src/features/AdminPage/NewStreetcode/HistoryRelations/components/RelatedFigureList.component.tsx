import './components.styles.scss';

import RelatedFigure from '@/models/streetcode/related-figure.model';

import RelatedItem from './RelatedFigure.component';

interface Props {
    relations: Array<RelatedFigure>,
    setRelations: React.Dispatch<React.SetStateAction<Array<RelatedFigure>>>
    setFigures: React.Dispatch<React.SetStateAction<RelatedFigure[]>>;
}
const RelationsList = ({ relations, setRelations, setFigures } : Props) => (
    <div className="list-container">
        <ul id="list" className="related-figures-list">
            {
                relations.map((rel) => (
                    <li key={rel.title}>
                        <RelatedItem
                            relation={rel}
                            relations={relations}
                            setRelations={setRelations}
                            setFigures={setFigures}
                        />
                    </li>
                ))
            }
        </ul>
    </div>
);

export default RelationsList;
