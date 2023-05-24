export const environment = {
  SERVER_URL: './',
  API_URL: 'https://www.evziyi.top/api',
  NODE_API_URL: 'http://localhost:3001/api', // node后端本地地址
  LOCAL: 'http://47.104.31.66:8080',
  weather: 'https://devapi.qweather.com/v7', // 实时天气
  city: 'https://geoapi.qweather.com/v2', // 城市天气
  API2D: 'https://openai.api2d.net/v1', // 正式接口，分布式部署，推荐使用
  API2D_OTHER: 'https://stream.api2d.net/v1', // api2d 备用接口，单机部署，支持流式返回，建议
  production: true
};
