// 1. log to file, maxsize, daily
import bunyan from 'bunyan';
import config from '../../etc';

export default bunyan.createLogger(config.logging.bunyan);
