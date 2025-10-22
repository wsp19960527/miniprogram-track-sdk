# 小程序埋点

## 安装

```bash
npm install km-miniprogram-track-sdk
```

## 使用

```js
// app.ts

import { initTracker } from "km-miniprogram-track-sdk";
const ins = initTracker({
	reportStrategy: "threshold",
	reportUrl: "you api",
	autoTrack: true,
	threshold: 5,
});
```
