import { getRoute, debounce } from "./utils";
import Cache from "./cache";
import type { EventName, IConfig, IEventItem } from "./types/index";
export default class Reporter {
  config: IConfig;
  isReporting = false;
  threshold: number = 10;
  cache;
  tempCache = [];
  debounceFlush: (list: IEventItem[]) => void
  constructor(config: IConfig) {
    this.config = config;
    this.isReporting = false;
    if (config.threshold) {
      this.threshold = config.threshold;
    }
    this.cache = new Cache(config.threshold);
    this.debounceFlush = debounce(this.flush)
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
    // 立即上报方式
    if (this.config.reportStrategy === 'immediate') {
      this.sendData([event])
    } else {
      const isThreshold = this.cache.add(event);
      // 不在判断是否超过阈值 or 
      let isImmediate = isThreshold || event.extra.reportStrategy === "immediate"
      if (isImmediate) {
        const events = this.cache.getALl();
        this.debounceFlush(events);
      }
    }
  }
  async flush(events: IEventItem[]) {
    //this.isReporting || 
    if (this.isReporting || this.cache.isEmpty()) return;
    this.isReporting = true;

    try {
      await this.sendData(events);
    } catch (error) {
      console.log('report:flush:error', error)
      this.reTryLater(events);
    } finally {
      this.isReporting = false
    }
  }
  scheduleReport() { }
  async sendData(events: IEventItem[]) {
    return new Promise((resolve, reject): void => {
      wx.request({
        url: this.config.reportUrl!,
        method: "POST",
        header: {
          "Content-Type": "application/json",
        },
        data: events,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
          } else {
            reject(new Error(`Report failed with status: ${res.statusCode}`));
          }
        },
        fail: (error) => {
          console.log('report:sendData error', error)
          reject()
        },
      });
    });
  }
  reTryLater(events: IEventItem[]) {
    // 指数退避重试策略
    // setTimeout(() => {
    //   this.sendData(events);
    // }, 2000);
  }
}
