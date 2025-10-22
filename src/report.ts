import { getRoute } from "./utils";
import type { EventName, IConfig, IEventItem, IReportStrategy } from "./types/index";
export default class Reporter {
  config: IConfig;
  threshold: number = 10;
  waitingList: Set<IEventItem> = new Set(); // 等待上报的事件队列
  failEventList: IEventItem[] = []; // 失败的事件队列
  isReporting = false; // 是否正在上报中
  constructor(config: IConfig) {
    this.config = config;
    if (config.threshold) {
      this.threshold = config.threshold;
    }
  }
  report(eventName: EventName, data: any = {}) {
    let route = data.route || undefined;
    if (!route) {
      route = getRoute()?.route;
    }
    const event: IEventItem = {
      eventName,
      timestamp: Date.now(),
      extra: data,
      route,
    };
    if (event.reportStrategy) {
      event.reportStrategy = event.reportStrategy as IReportStrategy;
      delete event.extra.reportStrategy;
    }
    // 立即上报方式
    if (this.config.reportStrategy === 'immediate') {
      this.sendData([event])
    } else {
      this.waitingList.add(event);
      // 不在判断是否超过阈值 or 
      let isImmediate = this.waitingList.size >= this.threshold || event.reportStrategy === "immediate"
      if (isImmediate) {
        const events = [...this.waitingList.values()];
        this.waitingList.clear();
        this.sendData(events);
      }
    }
  }
  sendData(events: IEventItem[]) {
    return new Promise((resolve, reject): void => {
      // 之前失败的数据一起上报
      let { config } = this
      const failed = this.failEventList.splice(0, this.failEventList.length);
      if (failed.length) {
        events = events.concat(failed)
      }
      if (!config.reportUrl) {
        reject(new Error("Report URL is not configured"));
        return;
      }
      wx.request({
        url: config.reportUrl,
        method: "POST",
        header: {
          "Content-Type": "application/json",
        },
        data: events,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
          } else {
            this.failCallback(events);
            reject(new Error(`Report failed with status: ${res.statusCode}`));
          }
        },
        fail: (error) => {
          this.failCallback(events);
          console.log('report:sendData error', error)
          reject(error)
        },
      });
    });
  }
  failCallback(events: IEventItem[]) {
    this.failEventList.push(...events)
  }
}
