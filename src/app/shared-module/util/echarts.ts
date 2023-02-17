/**
 * 图表数据公共option
 */
export class Charts {
  /**
   * 基础折线图
   * @param data
   * @param name
   */
  public static basicsLineChart(data: any, name?: string) {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        }
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 10
        },
        {
          start: 0,
          end: 10
        }
      ],
      xAxis: {
        type: 'category',
        // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: data,
          smooth: 0.6,
          symbol: 'none',
          type: 'line'
        }
      ]
    }
  }
}
