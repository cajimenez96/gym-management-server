export function camelToSnakeCase(
  obj: Record<string, any>,
): Record<string, any> {
  return Object.keys(obj).reduce(
    (acc, key) => {
      const newKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`,
      );
      const value = obj[key];

      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        acc[newKey] = camelToSnakeCase(value);
      } else if (Array.isArray(value)) {
        acc[newKey] = value.map((item) =>
          typeof item === 'object' && item !== null
            ? camelToSnakeCase(item)
            : item,
        );
      } else {
        acc[newKey] = value;
      }

      return acc;
    },
    {} as Record<string, any>,
  );
}

function snakeToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => snakeToCamelCase(v));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
        snakeToCamelCase(value),
      ]),
    );
  }
  return obj;
}

export function transformSupabaseResultToCamelCase<T>(result: any): T {
  return snakeToCamelCase(result) as T;
}
