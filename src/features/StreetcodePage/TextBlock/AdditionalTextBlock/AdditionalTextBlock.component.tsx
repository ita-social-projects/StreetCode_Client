/* eslint-disable react/jsx-no-useless-fragment */
import './AdditionalTextBlock.styles.scss';

import { useEffect } from 'react';

interface Props {
    additionalText: string | JSX.Element | JSX.Element[];
}

const AdditionalText = ({ additionalText }: Props) => {
    useEffect(() => {
        console.log('Additional text is:', additionalText);
    }, [additionalText]);

    return (
        <div className="additionalText">
            {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
            <div>
                {additionalText || null}
            </div>
        </div>
    );
};

export default AdditionalText;
