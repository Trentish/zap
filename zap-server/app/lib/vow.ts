/** Splits a promise into [value, error] */
export function vow<T>(promise: Promise<T>): Promise<[T, null]> | Promise<[null, Error]>;

/** Splits a promise[] into [[...values], error] using Promise.all */
export function vow<T>(promise: Promise<T>[]): Promise<[T[], null]> | Promise<[null, Error]>;

/**
 * Splits a promise into [value, error] OR a promise[] into [[...values], error] using Promise.all
 * Usage:
 *      const [result, error] = await vow(
 *          promiseFuncHere()
 *      );
 *      OR
 *      const [[resultA, resultB], error] = await vow([
 *          promiseA,
 *          promiseB,
 *      ]);
 */
export function vow<T>(
	promise: Promise<T> | Promise<T>[],
)
	: Promise<[T, null]>
	| Promise<[T[], null]>
	| Promise<[null, Error]>
	| Promise<[null, Error] | [T, null]> {
	
	if (Array.isArray(promise)) {
		return Promise.all(promise).then(
			(values) => [values, null],
			(error) => [[], error],
		);
	}
	
	return promise.then(
		(value: T) => [value, null],
		(error: Error) => [null, error],
	);
}
