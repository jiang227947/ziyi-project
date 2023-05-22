/**
 * 调用示例
 */

/*sendRequest(
  // 请求列表
  [
    () => requestControl('A', 10),
    () => requestControl('B', 20),
    () => requestControl('C', 30),
    () => requestControl('D', 40),
    () => requestControl('E', 50),
    () => requestControl('F', 10),
    () => requestControl('G', 20),
    () => requestControl('H', 30)
  ],
  // 并发数量
  2,
  // 结果
  (res, err) => {
    console.log('res is:', res);
    console.log('err is:', err);
  }
);*/
/**
 *  * Promise并发控制示例一
 * 控制并发数、手动发起请求（入栈）、请求结束（出栈），finally检查
 * 缺点：递归，需要避免重复调用
 * @param requestList 请求列表
 * @param limits 并发数量
 * @param callback 回调
 */
export function sendRequest(requestList: any, limits: number, callback: any): void {
  // 进行
  const runningPool: any[] = [];
  // 等待
  const waitingPool: any[] = [];
  // 结果
  const resultList: any[] = [];
  // 错误
  const errorList: any[] = [];

  const walker = (req: any) => {
    setTimeout(() => {
      req()
        .then((res) => {
          // 保存结果
          resultList.push(res);
        })
        .catch((err) => {
          // 保存错误
          errorList.push(err);
        })
        .finally(() => {
          // 检查
          runningPool.shift();
          // 如果还有等待执行的方法
          if (waitingPool.length > 0) {
            // 则删除等待的方法
            const _req = waitingPool.shift();
            // 添加进执行
            runningPool.push(_req);
            console.log('runningPool', runningPool, 'waitingPool', waitingPool);
            // 执行
            walker(_req);
          }
          // 如果等待列表和执行中的列表都为空则当做处理完成
          if (waitingPool.length === 0 && runningPool.length === 0) {
            // 返回结果
            callback && callback(resultList, errorList);
          }
        });
    }, 1000);
  };

  // 循环请求列表 匹配并发数量
  requestList.forEach((req) => {
    // 判断如果执行中的长度小于并发数
    if (runningPool.length < limits) {
      // 则将等待中的请求添加
      runningPool.push(req);
      // 执行
      walker(req);
    } else {
      // 执行中的长度大于并发数则将等待中的
      waitingPool.push(req);
    }
  });
}


/**
 * 模拟请求
 */
export function requestControl(str: string, num: number): Promise<string> {
  return new Promise<string>(((resolve, reject) => {
    const random: string = (Math.random() * 10).toFixed(0);
    // console.log('random', random);
    if (+random >= 7) {
      reject(`${str}-${num} :error`);
    } else {
      resolve(`${str}-${num} :${random}`);
    }
  }));
}

// function createRequestPool(limit: number) {
//   const queue = [];
//
//   return (func: () => Promise<any>) => {
//     return new Promise(res => {
// // ...
//     });
//   };
// }

// const limitRequest = createRequestPool(5) // 限制同时并发数量为 5 个

// limitRequest(() => new Promise() => {...})).then()

// limitRequest(() => request('/userinfo')).then()
