import './components.styles.scss';

import { ModelState } from '@/models/enums/model-state';
import { RelatedFigureCreateUpdate } from '@/models/streetcode/related-figure.model';

import RelatedItem from './RelatedFigure.component';

interface Props {
    figures: RelatedFigureCreateUpdate[];
    handleDelete: (id: number) => void;
}
const RelationsList = ({ figures, handleDelete } : Props) => (
    <div className="list-container">
        <ul id="list" className="related-figures-list">
            {
                figures.filter((figure) => figure.modelState !== ModelState.Deleted).map((figure) => (
                    <li key={figure.title}>
                        <RelatedItem
                            figure={figure}
                            handleDelete={handleDelete}
                        />
                    </li>
                ))
            }
        </ul>
    </div>
);

export default RelationsList;
