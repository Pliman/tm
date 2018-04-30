export default {
    'application': {},
    'logging': {
        'bunyan': {
            'name': 'app',
            streams: [{
                type: 'rotating-file',
                level: 'debug',
                path: 'app.log',
                period: '1d',
                count: 10
            }]
        }
    },
    'mongoDB': {
        'host': '192.168.0.100',
        'port': '27017',
        'dbName': 'tm',
        'userName': 'tm',
        'password': 'ok#Again!',
        // development or production
        'mode': 'production',
        'pool': {
            'maxConnection': 10,
            'idleTimeoutMillis': 30000
        }
    }
};
