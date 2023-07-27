const createTagValidator = (
    maxTagLength: number,
    getErrorMessage: (length: number) => string,
    setTagInput: React.Dispatch<React.SetStateAction<string>>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
) => {
    const onContextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget;
        if (e.key === 'Enter') {
            if (value.length > maxTagLength) {
                setErrorMessage(getErrorMessage(maxTagLength));
                e.preventDefault();
                e.stopPropagation();
            } else {
                setTagInput(value);
                setErrorMessage('');
            }
        }
    };

    const handleSearch = (value: string) => {
        if (value && value.length > maxTagLength) {
            setErrorMessage(getErrorMessage(maxTagLength));
        } else {
            setErrorMessage('');
        }
        setTagInput(value);
    };

    return { onContextKeyDown, handleSearch };
};

export default createTagValidator;
