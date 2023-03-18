// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  SERVER_URL: './',
  API_URL: 'https://www.evziyi.top/api',
  LOCAL: 'http://localhost:8080',
  weather: 'https://devapi.qweather.com/v7', // 实时天气
  city: 'https://geoapi.qweather.com/v2', // 城市天气
  API2D: 'https://openai.api2d.net/v1', // 正式接口，分布式部署，推荐使用
  API2D_OTHER: 'https://stream.api2d.net/v1', // api2d 备用接口，单机部署，支持流式返回，建议
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
