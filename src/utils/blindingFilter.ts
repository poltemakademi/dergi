/**
 * BLINDED_FIELDS
 * 
 * The list of fields containing personally identifiable information (PII) 
 * that must be stripped to maintain academic double-blind peer review integrity.
 */
export const BLINDED_FIELDS = [
  'authors',
  'authorNames',
  'author',
  'author_id',
  'author_name',
  'institutions',
  'institution',
  'emails',
  'email',
  'orcid',
  'orcid_id',
  'affiliation',
  'affiliations',
  'submission_authors',
  'corresponding_author'
] as const;

/**
 * BlindedFields
 * A union type of all blacklisted PII fields.
 */
export type BlindedFields = typeof BLINDED_FIELDS[number];

/**
 * Primitive
 * Represents basic primitive types that require no recursive inspection.
 */
type Primitive = string | number | boolean | bigint | symbol | undefined | null;

/**
 * BuiltIn
 * Represents standard JavaScript objects that should be preserved as-is.
 */
type BuiltIn = Function | Date | RegExp;

/**
 * DeepOmitBlinded<T>
 * 
 * An advanced recursive type utility that dynamically traverses and removes
 * all keys defined in the `BLINDED_FIELDS` constant array from the data signature.
 * 
 * This ensures that downstream TypeScript consumers face compile-time errors
 * if they attempt to read or reference any blinded PII fields.
 */
export type DeepOmitBlinded<T> = T extends BuiltIn | Primitive
  ? T
  : T extends Array<infer U>
  ? Array<DeepOmitBlinded<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepOmitBlinded<U>>
  : T extends Map<infer K, infer V>
  ? Map<K, DeepOmitBlinded<V>>
  : T extends Set<infer V>
  ? Set<DeepOmitBlinded<V>>
  : {
      // Map keys: omit keys matching BlindedFields, and recursively transform values of remaining keys
      [K in keyof T as K extends BlindedFields ? never : K]: DeepOmitBlinded<T[K]>;
    };

// Pre-populate a Set for O(1) runtime lookups of blacklisted PII fields
const BLINDED_SET = new Set<string>(BLINDED_FIELDS);

/**
 * applyBlindingFilter
 * 
 * Performs deep recursive sanitization to strip PII fields from complex, nested
 * objects, collections, and arrays. This acts as a secondary client-side defense-in-depth
 * layer for academic double-blind integrity.
 * 
 * @param data The input data payload to sanitize.
 * @returns A structurally cloned copy of the data with all PII fields removed, typed strictly without those fields.
 */
export function applyBlindingFilter<T>(data: T): DeepOmitBlinded<T> {
  // 1. Handle null, undefined, or primitive values directly
  if (data === null || typeof data !== 'object') {
    return data as unknown as DeepOmitBlinded<T>;
  }

  // 2. Handle special built-in object instances that are not plain structures
  if (data instanceof Date || data instanceof RegExp) {
    return data as unknown as DeepOmitBlinded<T>;
  }

  // 3. Handle arrays natively and process items recursively
  if (Array.isArray(data)) {
    return data.map((item) => applyBlindingFilter(item)) as unknown as DeepOmitBlinded<T>;
  }

  // 4. Handle Sets natively and process items recursively
  if (data instanceof Set) {
    const sanitizedSet = new Set();
    for (const item of data) {
      sanitizedSet.add(applyBlindingFilter(item));
    }
    return sanitizedSet as unknown as DeepOmitBlinded<T>;
  }

  // 5. Handle Maps natively and process values recursively
  if (data instanceof Map) {
    const sanitizedMap = new Map();
    for (const [key, value] of data.entries()) {
      sanitizedMap.set(key, applyBlindingFilter(value));
    }
    return sanitizedMap as unknown as DeepOmitBlinded<T>;
  }

  // 6. Handle plain objects by filtering and cloning recursively
  const sanitizedObj: Record<string, any> = {};
  const keys = Object.keys(data);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!BLINDED_SET.has(key)) {
      // Key is not blacklisted, recursively sanitize and assign
      sanitizedObj[key] = applyBlindingFilter((data as Record<string, any>)[key]);
    }
  }

  return sanitizedObj as DeepOmitBlinded<T>;
}
