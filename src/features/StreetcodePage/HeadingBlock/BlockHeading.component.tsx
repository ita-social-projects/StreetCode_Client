import './BlockHeading.styles.scss';

import Rhombus from '@images/utils/rhombus.svg';

interface Props {
    headingText: string;
}

const BlockHeading = ({ headingText }: Props) => (
    <div className="blockHeadingWrapper">
        <div className="blockHeadingContainer">
            <Rhombus />
            <h1 className="blockHeadingText">
                {headingText}
            </h1>
        </div>
    </div>
);

export default BlockHeading;
