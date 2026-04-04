export const getNameString = (names) => {
    if (!names || names.length === 0) return '';
    let nameString = '';
    names.forEach((name) => {
        nameString += `${name}, `;
    });
    return nameString.substring(0, nameString.length - 2);
};
