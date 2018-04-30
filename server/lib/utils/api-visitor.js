import http from 'http';
import https from 'https';

export default {
    visit: function (host, port, isSecure, apiPath, options, data) {
        return new Promise(function (resolve, reject) {
            let params = {
                hostname: host,
                port: port,
                path: apiPath,
                method: (options && options.method) || 'get'
            };

            options && options.headers && (params.headers = options.headers);
            let requester = isSecure ? https : http;

            let req = requester.request(params, (res) => {
                res.setEncoding('utf-8');
                let allData = [];
                res.on('data', function (reSdata) {
                    allData.push(reSdata);
                });

                res.on('end', function (reSdata) {
                    reSdata && allData.push(reSdata);
                    try {
                        resolve(JSON.parse(allData.join('')));
                    } catch (e) {
                        resolve(allData.join(''));
                    }
                });
            });

            req.on('error', function (err) {
                reject(err);
            });

            data && req.write(data);
            req.end();
        });
    }
};
