export const createObjByStr = (str: string): Record<string, unknown> => {
    const [entity, ...nested] = str.split('.');

    if (nested.length > 0) {
        return {
            [entity]: createObjByStr(nested.join('.')),
        };
    }

    return {
        [entity]: true,
    };
};
