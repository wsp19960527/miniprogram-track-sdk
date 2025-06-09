import type { WechatMiniprogram } from "miniprogram-api-typings";
export type IReportStrategy = "immediate" | "threshold";
export interface IConfig {
	reportStrategy: IReportStrategy;
	reportUrl: string;
	collectDeviceInfo?: boolean;
	deviceInfo?: IDeviceInfo;
	threshold?: number;
	autoTrack: boolean;
}

export interface ReportEvent {
	event: string;
	timestamp: number;
	[key: string]: any;
}
export type IError = WechatMiniprogram.Error | WechatMiniprogram.OnPageNotFoundListenerResult | WechatMiniprogram.OnUnhandledRejectionListenerResult;
export interface IDeviceInfo {
	platform: string;
	version: string;
	sdkVersion: string;
	brand: string;
	model: string;
	language: string;
	appId: string;
}
export type EventName = "pv" | "tap" | "error";
export interface IEventItem {
	eventName: EventName;
	uuid?: string;
	timestamp: number;
	route?: string;
	extra?: any;
	reportStrategy?: IReportStrategy;
}
