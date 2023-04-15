import { EggAppConfig, EggAppInfo, PowerPartial, Context } from 'midway';

export type DefaultConfig = PowerPartial<EggAppConfig>;

import * as dotenv from 'dotenv';
import * as path from 'path';

// const env = 'local';

const envFilePath = path.resolve(__dirname, '..', 'config', `.env.${process.env.NODE_ENV}`);

dotenv.config({ path: envFilePath });

// console.log();
// console.log(envFilePath);
// console.log(process.env.REDIS_HOST, 'redis host');
// console.log(process.env.REDIS_PORT, 'redis port');

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_{{keys}}';

  // elk log，404
  config.middleware = [ 'elkLogger', 'notFound' ];

  const bizConfig = {
    sourceUrl: '',
    elkLogger: {
      // request url match
      match(ctx: Context) {
        const reg = /.*/;
        return reg.test(ctx.url);
      },
      enable: true,
    },
  };
  // security
  config.security = {
    csrf: {
      enable: false,
    },
    methodnoallow: {
      enable: false,
    },
  };
  // CORS
  config.cors = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true,
    origin(ctx: Context) {
      const origin: string = ctx.get('origin');
      // console.log(origin, 'orgin');
      // access origin
      if (origin.indexOf('') > -1) {
        // console.log('come in');
        return origin;
      } else {
        return '*';
      }
    },
  };

  // logger
  config.logger = {
    outputJSON: false,
    appLogName: 'app.log',
    coreLogName: 'core.log',
    agentLogName: 'agent.log',
    errorLogName: 'error.log',
  };

  // business domain
  config.apiDomain = {};

  // jsonwebtoken
  config.jwt = {
    secret: '123456', // for test
    enable: true,
    match(ctx: Context) {
      const reg = /login|register/;
      return !reg.test(ctx.originalUrl);
    },
  };

  // socket io setting
  config.io = {
    namespace: {
      '/socket': {
        connectionMiddleware: [ 'auth', 'join', 'leave' ],
        packetMiddleware: [],
      },
    },
    // redis: {
    //   host: '127.0.0.1',
    //   port: 6379,
    //   password: 'MentalPoker2023',
    // },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    },
  };

  // config.redis = {
  //   client: {
  //     port: 6379,
  //     host: '127.0.0.1',
  //     password: 'MentalPoker2023',
  //     db: 0,
  //   },
  // };
  config.redis = {
    client: {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASSWORD,
      db: process.env.REDIS_DB,
    },
  };
  // config.mysql = {
  //   client: {
  //     // host
  //     host: '127.0.0.1',
  //     // pot
  //     port: '3306',
  //     // userName
  //     user: 'root',
  //     // password
  //     password: 'MentalPokerSQL',
  //     // database name
  //     database: 'poker',
  //   },
  //   app: true,
  //   agent: false,
  // };

  config.mysql = {
    client: {
      // host
      host: process.env.MYSQL_HOST,
      // pot
      port: process.env.MYSQL_PORT,
      // userName
      user: process.env.MYSQL_USER,
      // password
      password: process.env.MYSQL_PASSWORD,
      // database name
      database: process.env.MYSQL_DATABASE,
    },
    app: true,
    agent: false,
  };

  return {
    ...bizConfig,
    ...config,
  };
};
