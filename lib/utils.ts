import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));


 // Converts a File to a blob URL.
 // Remember to call URL.revokeObjectURL() when done to free memory.

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);
export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

// FORMAT DATE TIME
export const formatDateTime = (dateString: Date | string) => {
    const date = new Date(dateString);
    const dateTimeOptions: Intl.DateTimeFormatOptions = {
        // weekday: "short", // abbreviated weekday name (e.g., 'Mon')
        month: "short", // abbreviated month name (e.g., 'Oct')
        day: "numeric", // numeric day of the month (e.g., '25')
        year: "numeric", // numeric year (e.g., '2023')
        hour: "numeric", // numeric hour (e.g., '8')
        minute: "numeric", // numeric minute (e.g., '30')
        hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    };

    const dateDayOptions: Intl.DateTimeFormatOptions = {
        weekday: "short", // abbreviated weekday name (e.g., 'Mon')
        year: "numeric", // numeric year (e.g., '2023')
        month: "2-digit", // abbreviated month name (e.g., 'Oct')
        day: "2-digit", // numeric day of the month (e.g., '25')
    };

    const dateOptions: Intl.DateTimeFormatOptions = {
        month: "short", // abbreviated month name (e.g., 'Oct')
        year: "numeric", // numeric year (e.g., '2023')
        day: "numeric", // numeric day of the month (e.g., '25')
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "numeric", // numeric hour (e.g., '8')
        minute: "numeric", // numeric minute (e.g., '30')
        hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    };

    const formattedDateTime: string = date.toLocaleString(
        "en-US",
        dateTimeOptions,
    );

    const formattedDateDay: string = date.toLocaleString(
        "en-US",
        dateDayOptions,
    );

    const formattedDate: string = date.toLocaleString(
        "en-US",
        dateOptions,
    );

    const formattedTime: string = date.toLocaleString(
        "en-US",
        timeOptions,
    );

    return {
        dateTime: formattedDateTime,
        dateDay: formattedDateDay,
        dateOnly: formattedDate,
        timeOnly: formattedTime,
    };
};

export function encodeKey(passkey: string) {
    // Convert Unicode string to bytes, then to base64
    const bytes = new TextEncoder().encode(passkey);
    const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('');
    return btoa(binString);
}

export function decodeKey(passkey: string) {
    // Decode base64 to bytes, then to Unicode string
    const binString = atob(passkey);
    const bytes = Uint8Array.from(binString, (char) => char.codePointAt(0)!);
    return new TextDecoder().decode(bytes);
}
