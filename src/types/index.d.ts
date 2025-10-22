import type { WechatMiniprogram } from "miniprogram-api-typings";
export type IReportStrategy = "immediate" | "threshold";
export interface IConfig {
	/** 上报策略 */
	reportStrategy: IReportStrategy;
	/** 上报接口地址 */
	reportUrl: string;
	/** 是否收集设备信息 */
	collectDeviceInfo?: boolean;
	/** 设备信息 */
	deviceInfo?: IDeviceInfo;
	/** 上报阈值 */
	threshold?: number;
	/** 是否自动上报app page components 生命周期 */
	autoTrack: boolean;
}

export interface ReportEvent {
	event: string;
	timestamp: number;
	[key: string]: any;
}
export type IError = WechatMiniprogram.Error | WechatMiniprogram.OnPageNotFoundListenerResult | WechatMiniprogram.OnUnhandledRejectionListenerResult;
export interface IDeviceInfo {
	/** 平台 */
	platform: string;
	/** 版本 */
	version: string;
	/** sdk版本 */
	sdkVersion: string;
	/** 品牌 */
	brand: string;
	/** 型号 */
	model: string;
	/** 语言 */
	language: string;
	/** appId */
	appId: string;
}
export type EventName = "pv" | "tap" | "error";
export interface IEventItem {
	/** 事件名称 */
	eventName: EventName;
	/** 用户标识 */
	uuid?: string;
	/** 事件时间 */
	timestamp: number;
	/** 页面地址 */
	route?: string;
	/** 额外参数 ，如点击事件的元素等 */
	extra?: any;
	/** 上报策略 */
	reportStrategy?: IReportStrategy;
}
