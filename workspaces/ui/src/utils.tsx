import { format } from 'date-fns';

export const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

export const formatDate = (value: string | Date) => {
    if (typeof value === "string") {
        return format(new Date(value), 'yyyy-MM-dd HH:mm:ss');
    }

    return format(value, 'yyyy-MM-dd HH:mm:ss');
};

export const cleanNullInMap = (obj: any) => {
    for (const propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
            delete obj[propName];
        }
    }
    return obj
}

export const parseNumber = (value: string): number | undefined => {
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
}