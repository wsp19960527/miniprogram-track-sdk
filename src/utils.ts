import type { IEventItem } from "./types/index";

type CompressData = (a: IEventItem[], b: IEventItem[]) => IEventItem[];
export const compressData: CompressData = (data, list) => {
	return [...data, ...list];
};
export function getRoute() {
	return getCurrentPages().pop();
}
// debounce.ts
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
) {
  let timer: ReturnType<typeof setTimeout> | null = null

  const debounced = function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  return debounced as T & { cancel: () => void }
}
