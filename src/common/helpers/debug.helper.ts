export class DebugHelper {
  static debug(name: string, data?: any): void {
    const memoryUsage = process.memoryUsage();
    console.log('==== DBG | ' + name + ' time: ', new Date());
    console.log('==== DBG | ' + name + ' memory: ', {
      rss: memoryUsage.rss / 1024 / 1024,
      heapTotal: memoryUsage.heapTotal / 1024 / 1024,
      heapUsed: memoryUsage.heapUsed / 1024 / 1024,
      external: memoryUsage.external / 1024 / 1024,
    });
    if (data) {
      console.log('==== DBG | ' + name + ' data: ', data);
    }
  }
}
