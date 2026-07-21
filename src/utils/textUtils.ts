type CamelToSnake<T extends string> = T extends `${infer Head}${infer Tail}`
    ? Head extends Uppercase<Head>
        ? `_${Lowercase<Head>}${CamelToSnake<Tail>}`
        : `${Head}${CamelToSnake<Tail>}`
    : T;

type SnakeCased<T> = {
    [K in keyof T as CamelToSnake<string & K>]: T[K];
};

type SnakeToCamel<T extends string> = T extends `${infer Head}_${infer Tail}`
    ? `${Head}${Capitalize<SnakeToCamel<Tail>>}`
    : T;

export type CamelCased<T> = T extends object
    ? { [K in keyof T as SnakeToCamel<string & K>]: CamelCased<T[K]> }
    : T;

// @TODO: Move to object utils
export function toSnakeCase<T extends object>(obj: T): SnakeCased<T> {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
            key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
            value !== null && typeof value === "object" && !Array.isArray(value)
                ? toSnakeCase(value as object)
                : Array.isArray(value)
                  ? value.map((item) =>
                        typeof item === "object" && item !== null
                            ? toSnakeCase(item)
                            : item,
                    )
                  : value,
        ]),
    ) as SnakeCased<T>;
}

export const stringToTitleCase = (str: string): string => {
    const first = str.toLowerCase().charAt(0).toUpperCase();

    const remainder = str.slice(1).toLowerCase();

    return first + remainder;
};

export const isStringNullOrEmpty = (
    str: string | null | undefined,
): str is null | undefined => str == null || str.trim().length === 0;

export const stringToIsoDate = (isoDate: string) => {
    const date = new Date(isoDate);

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export const stringArrToText = (arr: string[]) =>
    arr
        .map((item) => {
            const fmt = item.toLowerCase().replace(/_/g, " ");
            return fmt.charAt(0).toUpperCase() + fmt.slice(1);
        })
        .join(", ");

export const getFirstPathSegment = (str: string) => str.split("/")[1];

export function isBarcodeValid(barcode: string) {
    // Must be 12 (UPC-A) or 13 (EAN-13) digits
    if (!/^\d{12,13}$/.test(barcode)) return false;

    const digitArray = barcode.split("").map(Number);
    const checkDigit = digitArray.pop(); // Last digit
    if (checkDigit === undefined) return false;

    const isUpc = digitArray.length === 11;
    let sum = 0;

    digitArray.forEach((digit, i) => {
        // UPC-A: odd positions ×3, even ×1
        // EAN-13: odd positions ×1, even ×3
        const isTriplePosition = isUpc ? i % 2 === 0 : i % 2 !== 0;

        const multiplier = isTriplePosition ? 3 : 1;

        sum += digit * multiplier;
    });

    return (10 - (sum % 10)) % 10 === checkDigit;
}
