export default {
  url: process.env.NODE_ENV === 'production'
    ? 'http://mentalpoker.jp:7001'
    : process.env.NODE_ENV === 'local'
      ? 'http://127.0.0.1:7001'
      : process.env.NODE_ENV === 'aws'
        ? 'http://ec2-18-179-2-1.ap-northeast-1.compute.amazonaws.com:7001' : 'http://127.0.0.1:7001',
  // url: process.env.NODE_ENV !== 'production' ?
  //   process.env.NODE_ENV === 'develop' ? 'http://127.0.0.1:7001'
  //     : 'http://127.0.0.1:7001' : 'http://www.jojgame.com:7001',
  res: location.href.split('#')[0] + '#',
};
