// 城市信息
export interface LocationInterface {
  name: string; // 地区/城市名称
  id: string; // 地区/城市ID
  lat: string; // 地区/城市纬度
  lon: string; // 地区/城市经度
  adm2: string; // 地区/城市的上级行政区划名称
  adm1: string; // 地区/城市所属一级行政区域
  country: string; // 地区/城市所属国家名称
  tz: string; // 地区/城市所在时区
  utcOffset: string; // 地区/城市目前与UTC时间偏移的小时数，参考详细说明
  isDst: string; // 地区/城市是否当前处于夏令时。1 表示当前处于夏令时，0 表示当前不是夏令时。
  type: string; // 地区/城市的属性
  rank: string; // 地区评分
  fxLink: string; // 该地区的天气预报网页链接，便于嵌入你的网站或应用
}

export interface CityInterface {
  code: string; // API状态码，具体含义请参考状态码
  location: LocationInterface;
  refer: {
    sources: string; // 原始数据来源，或数据源说明，可能为空
    license: string; // 数据许可或版权声明，可能为空
  };
}

export interface NowInterface {
  obsTime: string;  // 数据观测时间
  temp: string;  // 温度，默认单位：摄氏度
  feelsLike: string;  // 体感温度，默认单位：摄氏度
  icon: string;  // 天气状况和图标的代码，图标可通过天气状况和图标下载
  text: string;  // 天气状况的文字描述，包括阴晴雨雪等天气状态的描述
  wind360: string;  // 风向360角度
  windDir: string;  // 风向
  windScale: string;  // 风力等级
  windSpeed: string;  // 风速，公里/小时
  humidity: string;  // 相对湿度，百分比数值
  precip: string;  // 当前小时累计降水量，默认单位：毫米
  pressure: string;  // 大气压强，默认单位：百帕
  vis: string;  // 能见度，默认单位：公里
  cloud: string;  // 云量，百分比数值。可能为空
  dew: string;  // 露点温度。可能为空
}

interface ReferInterface {
  sources: string;  // 原始数据来源，或数据源说明，可能为空
  license: string;  // 数据许可或版权声明，可能为空
}

// 实时天气
export interface WeatherNowInterface {
  code: string; // API状态码，具体含义请参考状态码
  updateTime: string; // 当前API的最近更新时间
  fxLink: string; // 当前数据的响应式页面，便于嵌入网站或应用
  now: NowInterface;
  refer: ReferInterface;
}

// 未来几天天气
export interface FutureWeatherInterface {
  code: string; // API状态码，具体含义请参考状态码
  updateTime: string; // 当前API的最近更新时间
  fxLink: string; // 当前数据的响应式页面，便于嵌入网站或应用
  hourly: DailyInterface[]; // 逐小时信息
  daily: DailyInterface[]; // 逐天信息
}

// 逐天信息
export interface DailyInterface {
  fxDate; // 预报日期
  sunrise; // 日出时间
  sunset; // 日落时间
  moonrise; // 月升时间
  moonset; // 月落时间
  moonPhase; // 月相名称
  moonPhaseIcon; // 月相图标代码，图标可通过天气状况和图标下载
  tempMax; // 预报当天最高温度
  tempMin; // 预报当天最低温度
  iconDay; // 预报白天天气状况的图标代码，图标可通过天气状况和图标下载
  textDay; // 预报白天天气状况文字描述，包括阴晴雨雪等天气状态的描述
  iconNight; // 预报夜间天气状况的图标代码，图标可通过天气状况和图标下载
  textNight; // 预报晚间天气状况文字描述，包括阴晴雨雪等天气状态的描述
  wind360Day; // 预报白天风向360角度
  windDirDay; // 预报白天风向
  windScaleDay; // 预报白天风力等级
  windSpeedDay; // 预报白天风速，公里/小时
  wind360Night; // 预报夜间风向360角度
  windDirNight; // 预报夜间当天风向
  windScaleNight; // 预报夜间风力等级
  windSpeedNight; // 预报夜间风速，公里/小时
  precip; // 预报当天总降水量，默认单位：毫米
  uvIndex; // 紫外线强度指数
  humidity; // 相对湿度，百分比数值
  pressure; // 大气压强，默认单位：百帕
  vis; // 能见度，默认单位：公里
  cloud; // 云量，百分比数值。可能为空
}

// 逐小时信息
export interface HourlyInterface {
  fxTime; // 预报时间
  temp; // 温度，默认单位：摄氏度
  icon; // 天气状况和图标的代码，图标可通过天气状况和图标下载
  text; // 天气状况的文字描述，包括阴晴雨雪等天气状态的描述
  wind360; // 风向360角度
  windDir; // 风向
  windScale; // 风力等级
  windSpeed; // 风速，公里/小时
  humidity; // 相对湿度，百分比数值
  precip; // 当前小时累计降水量，默认单位：毫米
  pop; // 逐小时预报降水概率，百分比数值，可能为空
  pressure; // 大气压强，默认单位：百帕
  cloud; // 云量，百分比数值。可能为空
  dew; // 露点温度。可能为空
}
