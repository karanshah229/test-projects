import pino from 'pino';

function appLogFormatter(info: object) {
  const logObj: any = {};
  const transformMap = {
    timestamp: 'timestamp',
    level: 'severity',
    namespace: 'namespace',
    environment: 'environment',
    'entity.guid': 'entity.guid',
    hostname: 'hostname',
    'entity.name': 'entity.name',
    'entity.type': 'entity.type',
    'error.class': 'error.class',
    'error.stack': 'error.stack',
    message: 'text_payload',
    'span.id': 'span.id',
    'trace.id': 'trace.id',
  };
  Object.keys(transformMap).forEach((key) => {
    if (info[key]) {
      logObj[transformMap[key]] = info[key];
      // eslint-disable-next-line
      delete info[key];
    }
  });
  // Move custom key-value pairs inside 'labels'
  logObj.labels = info;
  return { ...logObj };
}

let options: any = {};
if (typeof window === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const nrpino = require('@newrelic/pino-enricher');
  options = nrpino();
}

const logLevel = process.env.NODE_ENV === 'production' ? 'error' : 'debug';

const logger = pino({
  browser: {
    asObject: true,
    write: {
      info: (obj) => {
        // @TODO: implement info level logging for browser
        // eslint-disable-next-line
        console.info(obj);
      },
      warn: (obj) => {
        // @TODO: implement warn level logging for browser
        // eslint-disable-next-line
        console.warn(obj);
      },
      error: (obj: any) => {
        if (typeof (window as any).newrelic === 'undefined') {
          // eslint-disable-next-line
          console.error(obj);
        } else {
          (window as any).newrelic.noticeError(obj);
        }
      },
    },
  },
  ...(process.env.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
    },
  }),
  level: logLevel,
  base: {
    namespace: 'SkillUp Frontend',
    environment: process.env.NODE_ENV,
  },
  mixin: options.mixin,
  timestamp: options.timestamp,
  messageKey: 'text_payload',
  formatters: {
    log(object: any) {
      let logObj = object;
      if (process.env.NEW_RELIC_ENABLED === 'true') logObj = options.formatters.log(logObj);
      logObj = appLogFormatter(logObj);
      return logObj;
    },
    level(label) {
      return { severity: label.toUpperCase() };
    },
  },
});

export { logger };
