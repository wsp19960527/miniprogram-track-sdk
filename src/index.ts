import Tracker from "./core";
import type { IConfig } from "./types/index";

let instance: Tracker | null = null;

const defaultConfig: IConfig = {
	threshold: 10,
	autoTrack: false,
	reportStrategy: "threshold",
	reportUrl: "",
};
export const initTracker = (config: IConfig) => {
	if (instance) return instance;
	const mergeConfig: IConfig = {
		...defaultConfig,
		...config,
	};
	instance = new Tracker(mergeConfig);
	return instance;
};
