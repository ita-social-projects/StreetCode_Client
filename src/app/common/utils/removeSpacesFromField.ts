const removeSpacesFromField = (value: string) => {
    const filteredValue = value.replace(' ', '');
    return filteredValue;
};

export default removeSpacesFromField;
