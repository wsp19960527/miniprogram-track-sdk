import Reporter from "./report";
import type { IConfig } from "./types/index";

export default class AutoTrack {
	config: IConfig;
	reporter: Reporter;
	constructor(config: IConfig, reporter: Reporter) {
		this.config = config;
		this.reporter = reporter;
	}
	setup() {
		this.overrideAppMethods();
		this.overridePageMethods();
		this.overrideComponentMethods();
	}
	overrideAppMethods() {
		const originalApp = App;
		const self = this;
		App = function (appOptions) {
			const originalOnLaunch = appOptions.onLaunch;
			const originalOnShow = appOptions.onShow;
			const oniginalOnHide = appOptions.onHide;
			const oniginalOnError = appOptions.onError;
			const onignalOnPageNotFound = appOptions.onPageNotFound;
			const onignalOnUnhandledRejection = appOptions.onUnhandledRejection;

			appOptions.onLaunch = function (options: WechatMiniprogram.App.LaunchShowOption) {
				self.reporter?.report("pv", {
					lifecircle: "appOnLaunch",
					...options,
				});
				return originalOnLaunch && originalOnLaunch.call(this, options);
			};
			appOptions.onShow = function (options: WechatMiniprogram.App.LaunchShowOption) {
				self.reporter?.report("pv", {
					lifecircle: "appOnShow",
					...options,
				});
				return originalOnShow && originalOnShow.call(this, options);
			};
			appOptions.onHide = function () {
				self.reporter?.report("pv", {
					lifecircle: "appOnHide",
					reportStrategy: "immediate",
				});
				return oniginalOnHide && oniginalOnHide.call(this);
			};
			appOptions.onError = function (error: string) {
				self.reporter?.report("error", {
					lifecircle: "onError",
					error: error,
				});
				return oniginalOnError && oniginalOnError.call(this, error);
			};
			appOptions.onPageNotFound = function (options: WechatMiniprogram.App.PageNotFoundOption) {
				self.reporter?.report("error", {
					lifecircle: "onPageNotFound",
					...options,
				});
				return onignalOnPageNotFound && onignalOnPageNotFound.call(this, options);
			};
			appOptions.onUnhandledRejection = function (error: WechatMiniprogram.OnUnhandledRejectionListenerResult) {
				self.reporter?.report("error", {
					lifecircle: "onUnhandledRejection",
					error,
				});
				return onignalOnUnhandledRejection && onignalOnUnhandledRejection.call(this, error);
			};
			return originalApp(appOptions);
		};
	}
	overridePageMethods() {
		const originalPage = Page;
		const self = this;

		Page = function (pageOptions: WechatMiniprogram.Page.Options<Record<string, any>, Record<string, any>>) {
			const originalOnLoad = pageOptions.onLoad;
			const originalOnShow = pageOptions.onShow;
			const originalOnHide = pageOptions.onHide;
			const originalOnUnload = pageOptions.onUnload;
			const originalOnShareAppMessage = pageOptions.onShareAppMessage;

			pageOptions.onLoad = function (options) {
				self.reporter?.report("pv", { ...options, lifecircle: "onLoad", route: this.is });
				return originalOnLoad && originalOnLoad.call(this, options);
			};
			pageOptions.onShow = function () {
				self.reporter.report("pv", { lifecircle: "onShow", route: this.is });
				return originalOnShow && originalOnShow.call(this);
			};

			pageOptions.onHide = function () {
				self.reporter.report("pv", {
					path: this.is,
					lifecircle: "onHide",
				});
				return originalOnHide && originalOnHide.call(this);
			};

			pageOptions.onUnload = function () {
				self.reporter.report("pv", {
					path: this.is,
					lifecircle: "onUnload",
					reportStrategy: "immediate",
				});
				return originalOnUnload && originalOnUnload.call(this);
			};

			pageOptions.onShareAppMessage = function (options) {
				const shareInfo = originalOnShareAppMessage ? originalOnShareAppMessage.call(this, options) : {};

				self.reporter.report("pv", {
					path: this.route,
					...shareInfo,
					...options,
					lifecircle: "onShareAppMessage",
				});

				return shareInfo;
			};
			pageOptions["globalTrack"] = self.track;

			return originalPage(pageOptions);
		};
	}
	overrideComponentMethods() {
		const originalComponent = Component;
		const self = this;
		Component = function (componentOptions: WechatMiniprogram.Component.Options<Record<string, any>, Record<string, any>, Record<string, (...args: any[]) => any>, any[]>) {
			if (!componentOptions.methods) {
				componentOptions.methods = {
					globalTrack: self.track,
				};
			} else {
				componentOptions.methods.globalTrack = self.track;
			}
			return originalComponent(componentOptions);
		};
	}
	track(e: WechatMiniprogram.TouchEvent) {
		// 有特殊标识的事件才上报
		const { dataset } = e.target || {};
		if (dataset?.track) {
			this.reporter.report("tap", { ...dataset });
		}
	}
}
