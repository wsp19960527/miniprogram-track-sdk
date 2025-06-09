import type { IEventItem } from "./types/index";

export default class Cache {
	threshold = 10;
	list: Set<IEventItem>;
	retryCount = 0;
	constructor(threshold: number = 10) {
		this.threshold = threshold;
		this.list = new Set();
	}
	add(item: IEventItem): boolean {
    this.list.add(item);
		return this.list.size >= this.threshold;
	}
	getALl() {
		let result = [...this.list];
		this.clear();
		return result;
	}
	getRetryCount() {
		return this.retryCount;
	}
	setRetryCount(count: number) {
		this.retryCount = count;
	}
	isEmpty() {
		return this.list.size <= 0;
	}
	isThreshold() {
		return this.list.size >= this.threshold;
	}
	clear() {
    this.list.clear();
	}
}
