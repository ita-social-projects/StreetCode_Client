/* eslint-disable react/jsx-no-useless-fragment */
import './AdditionalTextBlock.styles.scss';

import { useEffect } from 'react';

interface Props {
    аdditionalText: string | JSX.Element | JSX.Element[];
}

const AdditionalText = ({ аdditionalText }: Props) => {
    useEffect(() => {
        console.log('Additional text is:', аdditionalText);
    }, [аdditionalText]);

    return (
        <div className="additionalText">
            {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
            <div>
                {аdditionalText || null}
            </div>
        </div>
    );
};

export default AdditionalText;
