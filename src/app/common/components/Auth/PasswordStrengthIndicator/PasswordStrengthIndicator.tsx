import './PasswordStrengthIndicator.styles.scss';

import React, { useEffect, useState } from 'react';

interface PasswordStrengthIndicatorProps {
    password: string;
    setIsPasswordValid: (field: boolean) => void;
}

const TOTAL_REQUIREMENTS = 5;

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = (
    {
        setIsPasswordValid,
        password,
    },
) => {
    const [requirements, setRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });
    const fulfilledRequirements = Object.values(requirements).filter(Boolean).length;

    const getNewRequirements = (testPassword: string) => ({
        length: testPassword.length >= 8 && testPassword.length <= 20,
        uppercase: /[A-Z]/.test(testPassword),
        lowercase: /[a-z]/.test(testPassword),
        number: /\d/.test(testPassword),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(testPassword),
    });

    useEffect(() => {
        const newRequirements = getNewRequirements(password);
        setRequirements(newRequirements);
        setIsPasswordValid(fulfilledRequirements === TOTAL_REQUIREMENTS);
    }, [fulfilledRequirements, password, setIsPasswordValid]);

    return (
        <div className="password-strength-bar">
            {Array.from({ length: TOTAL_REQUIREMENTS }).map((_, index) => {
                const isFulfilled = index < fulfilledRequirements;
                return (
                    <div
                        className={`segment ${isFulfilled ? 'green' : 'gray'}`}
                    />
                );
            })}
        </div>
    );
};

export default PasswordStrengthIndicator;
