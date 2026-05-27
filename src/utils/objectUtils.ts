import type { CamelCased } from "./textUtils";

export function toCamelCase<T>(obj: T): CamelCased<T> {
	if (Array.isArray(obj)) {
		return obj.map(toCamelCase) as CamelCased<T>;
	}

	if (obj !== null && typeof obj === "object") {
		return Object.fromEntries(
			Object.entries(obj).map(([key, value]) => [
				key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
				toCamelCase(value)
			])
		) as CamelCased<T>;
	}

	return obj as CamelCased<T>;
}