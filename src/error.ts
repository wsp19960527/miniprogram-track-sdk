import Reporter from "./report";
import type { IError } from "./types/index";

export default class ErrorTrack {
	reporter: Reporter;
	constructor(reportr: Reporter) {
		this.reporter = reportr;
	}
	setup() {
		// 监听小程序错误
		wx.onError(this.handleError.bind(this));

		// 监听Promise未捕获异常
		// wx.onUnhandledRejection(this.handleRejection.bind(this));

		// 监听资源加载失败
		wx.onPageNotFound(this.handlePageNotFound.bind(this));
	}
	handleError(error: WechatMiniprogram.Error) {
		this.trackError(error, { type: "js_error" });
	}

	// handleRejection(event: Error) {
	//   this.trackError(event.message, {
	//     type: 'promise_error',
	//     promise: event.promise
	//   });
	// }

	handlePageNotFound(res: WechatMiniprogram.OnPageNotFoundListenerResult) {
		this.reporter.report("error", {
			path: res.path,
			query: res.query,
			isEntryPage: res.isEntryPage,
			errorType: "page_not_found",
		});
	}
	trackError(error: IError, extra = {}) {
		const errorData = {
			...error,
			...extra,
			errorType: "error",
		};
		this.reporter.report("error", errorData);
	}
}
