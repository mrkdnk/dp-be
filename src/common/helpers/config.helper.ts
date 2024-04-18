import * as dotenv from 'dotenv';

export class ConfigHelper {
  static load(): void {
    if (process.env.NODE_ENV === 'test') {
      dotenv.config({ path: '.env.test' });
    } else {
      dotenv.config();
    }
  }
}
