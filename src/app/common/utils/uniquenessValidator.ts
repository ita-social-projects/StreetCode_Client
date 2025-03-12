/* eslint-disable max-len */
import normaliseWhitespaces from './normaliseWhitespaces';

const uniquenessValidator = (getAll:()=>string[], getInitial:()=>string | undefined, message?:string) => (async (rule: any, value: string) => new Promise<void>((resolve, reject) => {
    const normalizedValue = normaliseWhitespaces(value)?.trim();
    if (!!value && getAll().includes(normalizedValue) && normalizedValue !== getInitial()) {
        reject(message || 'Value already exists');
    } else {
        resolve();
    }
}));

export default uniquenessValidator;
