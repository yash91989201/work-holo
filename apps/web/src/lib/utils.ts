import { type ClassValue, clsx } from "clsx";
import { format, formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatMessageTimestamp(date: Date | string): {
	relative: string;
	absolute: string;
	formatted: string;
} {
	const dateObj = typeof date === "string" ? new Date(date) : date;
	const today = new Date();
	const isToday =
		dateObj.getDate() === today.getDate() &&
		dateObj.getMonth() === today.getMonth() &&
		dateObj.getFullYear() === today.getFullYear();

	const formatted = isToday
		? format(dateObj, "h:mm a")
		: format(dateObj, "h:mm a MMM d, yyyy");

	return {
		relative: formatDistanceToNow(dateObj, { addSuffix: true }),
		absolute: format(dateObj, "PPpp"),
		formatted,
	};
}
