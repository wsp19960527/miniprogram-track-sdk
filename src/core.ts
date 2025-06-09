import AutoTrack from "./autoTrack";
import Reporter from "./report";
import type { IConfig } from "./types/index";
class Tracker {
	config: IConfig;
	reporter: Reporter;
	autoTrack: AutoTrack;
	constructor(config: IConfig) {
		if (config.collectDeviceInfo) {
			config.deviceInfo = this.getDeviceInfo();
		}
		this.config = config;
		this.reporter = new Reporter(config);
		this.autoTrack = new AutoTrack(this.config, this.reporter);
		this.init();
	}
	init() {
		if (this.config.autoTrack) {
			const autoTrack = new AutoTrack(this.config, this.reporter);
			autoTrack.setup();
		}
	}
	getDeviceInfo() {
		const systemInfo = wx.getDeviceInfo();
		const appBaseInfo = wx.getAppBaseInfo();
		return {
			platform: systemInfo.platform,
			version: appBaseInfo.version,
			sdkVersion: appBaseInfo.SDKVersion,
			brand: systemInfo.brand,
			model: systemInfo.model,
			language: appBaseInfo.language,
			appId: appBaseInfo.host.appId,
		};
	}
}
export default Tracker;
