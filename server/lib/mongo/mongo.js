let db = {};
export default db;
import mongodb from 'mongodb';
let ObjectID = mongodb.ObjectID;
import config from '../../etc';
const mongoDBConf = config.mongoDB;
import generic_pool from 'generic-pool';
import node_uuid from 'node-uuid';
import logger from '../log';
import poolLogger from '../log';

let pool = new generic_pool.Pool({
    name: 'mongodb-pool',
    max: mongoDBConf.pool.maxConnection || 10,
    create: function (callback) {
        try {
            const mongoUrl = 'mongodb://' + mongoDBConf.userName + ':' + mongoDBConf.password + '@' + mongoDBConf.host + ':' + mongoDBConf.port + '/' + mongoDBConf.dbName;

            mongodb.MongoClient.connect(mongoUrl, {
                server: {poolSize: 1},
                native_parser: true
            }, function (err, client) {
                if (err) {
                    logger.error('[create] mongoDB connect error:%s', err.toString());
                } else {
                    logger.info('[create] mongoDB connected successfully.');
                }

                callback(err, client);
            });
        } catch (e) {
            logger.error('[create] create mongoDB connection failed:%s.', e.toString());
        }
    },
    destroy: function (client) {
        try {
            client.close();
        } catch (e) {
            logger.error('[destroy] destroy mongoDB connection failed:%s.', e.toString());
        }
    },
    idleTimeoutMillis: mongoDBConf.pool.idleTimeoutMillis,
    priorityRange: 3,
    log: function (info, level) {
        if (mongoDBConf.mode === 'development') {
            poolLogger.verbose = function (msg) {
                poolLogger.info(msg);
            };
        } else {
            poolLogger.verbose = function () {
            };
        }

        poolLogger[level]('[database pool info] ' + info);
    }
});

// print pool information
let _printPoolInfo = () => {
    if (mongoDBConf.mode === 'development') {
        // if (console) {
        //     console.log('pool name: %s', pool.getName());
        //     console.log('pool size: %s', pool.getPoolSize());
        //     console.log('pool available objects count: %s', pool.availableObjectsCount());
        //     console.log('pool waiting clients count: %s', pool.waitingClientsCount());
        // }

        logger.info('[_printPoolInfo] pool name: %s', pool.getName());
        logger.info('[_printPoolInfo] pool size: %s', pool.getPoolSize());
        logger.info('[_printPoolInfo] pool available objects count: %s', pool.availableObjectsCount());
        logger.info('[_printPoolInfo] pool waiting clients count: %s', pool.waitingClientsCount());
    }
};

/**
 * insert entity
 * @method
 * @param {String} collection collection want save to
 * @param {Object} entity entity need to be saved
 * @return {Promise} promise
 */
db.insertOne = function (collection, entity) {
    _printPoolInfo();

    return new Promise((resolve, reject) => {
        try {
            pool.acquire((poolErr, client) => {
                if (poolErr) {
                    logger.error('[insertOne] poolError acquiring connection from pool:%s, when inserting collection:%s,entity is %s', poolErr.toString(), collection, JSON.stringify(entity));
                    reject(poolErr);
                    return;
                }

                const uuid = node_uuid.v4();
                logger.info('[insertOne] start insertOne %s, collection is:%s, entity is %s', uuid, collection, JSON.stringify(entity));
                client.collection(collection).insertOne(entity, (err, r) => {
                    if (err) {
                        logger.error('[insertOne] insertOne %s failed,err is %s', uuid, err);
                        pool.release(client);
                        reject(err);
                    } else {
                        logger.info('[insertOne] insertOne %s successfully', uuid);
                        pool.release(client);
                        resolve(r);
                    }
                });
            });
        } catch (e) {
            logger.error('[insertOne] acquire mongoDB connection failed:%s. when inserting collection:%s, entity is %s', e.toString(), collection, JSON.stringify(entity));
            reject(e.toString());
        }
    });
};

/**
 * insert entities
 * @param {String} collection collection want save to
 * @param {Objects} entities entities need to be saved
 * @return {Promise} promise
 */
db.insertMany = function (collection, entities) {
    _printPoolInfo();

    return new Promise((resolve, reject) => {
        try {
            pool.acquire((poolErr, client) => {
                if (poolErr) {
                    logger.error('[insertMany] poolError acquiring connection from pool:%s, when inserting collection:%s,entities is %s', poolErr.toString(), collection, JSON.stringify(entities));
                    reject(poolErr);
                    return;
                }

                const uuid = node_uuid.v4();
                logger.info('[insertMany] start insertMany %s, collection is:%s, entities is %s', uuid, collection, JSON.stringify(entities));
                client.collection(collection).insertMany(entities, (err, r) => {
                    if (err) {
                        logger.error('[insertMany] insertMany %s failed,err is %s', uuid, err);
                        pool.release(client);
                        reject(err);
                    } else {
                        logger.info('[insertMany] insertMany %s successfully', uuid);
                        pool.release(client);
                        resolve(r);
                    }
                });
            });
        } catch (e) {
            logger.error('[insertMany] acquire mongoDB connection failed:%s. when saving collection:%s, entities is %s', e.toString(), collection, JSON.stringify(entities));
            reject(e.toString());
        }
    });
};

/**
 * find entity
 * @param {String} collection collection want find
 * @param {Object} entity entity need to be find
 * @param {Object} projections projections to limit the query
 * @param {Number} skip skip record count
 * @param {Number} limit limit record count
 * @return {Promise} promise
 */
db.find = function (collection, entity, skip = 0, limit = 20, sortObj, projections = {}) {
    _printPoolInfo();

    entity._id && (entity._id = ObjectID(entity._id));

    return new Promise((resolve, reject) => {
        try {
            pool.acquire((poolErr, client) => {
                if (poolErr) {
                    logger.error('[find] poolError acquiring connection from pool:%s, when finding collection:%s,entity is %s', poolErr.toString(), collection, JSON.stringify(entity));
                    reject(poolErr);
                    return;
                }

                const uuid = node_uuid.v4();
                logger.info('[find] start find %s, collection is:%s, entity is %s', uuid, collection, JSON.stringify(entity));
                client.collection(collection).find(entity).sort(sortObj).project(projections).skip(skip).limit(limit).toArray((err, r) => {
                    if (err) {
                        logger.error('[find] find %s failed,err is %s', uuid, err);
                        pool.release(client);
                        reject(err);
                    } else {
                        logger.info('[find] find %s successfully', uuid);
                        pool.release(client);
                        resolve(r);
                    }
                });
            });
        } catch (e) {
            logger.error('[find] acquire mongoDB connection failed:%s. when finding collection:%s, entity is %s', e.toString(), collection, JSON.stringify(entity));
            reject(e.toString());
        }
    });
};

/**
 * find one entity
 * @param {String} collection collection want find
 * @param {Object} entity entity need to be find
 * @param {Object} projections projections to limit the query
 * @return {Promise} promise
 */
db.findOne = function (collection, entity, projections = {}) {
    _printPoolInfo();

    entity._id && (entity._id = ObjectID(entity._id));

    return new Promise((resolve, reject) => {
        try {
            pool.acquire((poolErr, client) => {
                if (poolErr) {
                    logger.error('[findOne] poolError acquiring connection from pool:%s, when finding one collection:%s,entity is %s', poolErr.toString(), collection, JSON.stringify(entity));
                    reject(poolErr);
                    return;
                }
                const uuid = node_uuid.v4();
                logger.info('[findOne] start find one %s, collection is:%s, entity is %s', uuid, collection, JSON.stringify(entity));
                client.collection(collection).find(entity).project(projections).limit(1).next((err, r) => {
                    if (err) {
                        logger.error('[findOne] find one %s failed,err is %s', uuid, err);
                        pool.release(client);
                        reject(err);
                    } else {
                        logger.info('[findOne] find one %s successfully', uuid);
                        pool.release(client);
                        resolve(r);
                    }
                });
            });
        } catch (e) {
            logger.error('[findOne] acquire mongoDB connection failed:%s. when finding one collection:%s, entity is %s', e.toString(), collection, JSON.stringify(entity));
            reject(e.toString());
        }
    });
};

/**
 * aggregate
 * @param {String} collection collection want find
 * @param {Array} pipeline pipeline to execute
 * @param {Object} options options
 * @return {Promise} promise
 */
db.aggregate = function (collection, pipeline, options = {}) {
    _printPoolInfo();

    return new Promise((resolve, reject) => {
        try {
            pool.acquire((poolErr, client) => {
                if (poolErr) {
                    logger.error('[aggregate] poolError acquiring connection from pool:%s, when aggregating collection:%s,pipeline is %s', poolErr.toString(), collection, JSON.stringify(pipeline));
                    reject(poolErr);
                    return;
                }

                const uuid = node_uuid.v4();
                logger.info('[aggregate] start aggregate %s, collection is:%s, pipeline is %s', uuid, collection, JSON.stringify(pipeline));
                client.collection(collection).aggregate(pipeline, options, (err, r) => {
                    if (err) {
                        logger.error('[aggregate] aggregate %s failed,err is %s', uuid, err);
                        pool.release(client);
                        reject(err);
                    } else {
                        logger.info('[aggregate] aggregate %s successfully', uuid);
                        pool.release(client);
                        resolve(r);
                    }
                });
            });
        } catch (e) {
            logger.error('[aggregate] acquire mongoDB connection failed:%s. when aggregating collection:%s, pipeline is %s', e.toString(), collection, JSON.stringify(pipeline));
            reject(e.toString());
        }
    });
};

/**
 * update entity
 * @param {String} collection collection want update
 * @param {Object} operator operator need to be update
 * @return {Promise} promise
 */
db.updateOne = function (collection, criteria, operator) {
    _printPoolInfo();

    return new Promise((resolve, reject) => {
        try {
            pool.acquire((poolErr, client) => {
                if (poolErr) {
                    logger.error('[update] poolError acquiring connection from pool:%s, when updatding collection:%s,operator is %s', poolErr.toString(), collection, JSON.stringify(operator));
                    reject(poolErr);
                    return;
                }
                const uuid = node_uuid.v4();
                logger.info('[update] start update %s, collection is:%s, operator is %s', uuid, collection, JSON.stringify(operator));
                client.collection(collection).updateOne(criteria, operator, {}, (err, r) => {
                    if (err) {
                        logger.error('[update] update %s failed,err is %s', uuid, err);
                        pool.release(client);
                        reject(err);
                    } else {
                        logger.info('[update] update %s successfully', uuid);
                        pool.release(client);
                        resolve(r);
                    }
                });
            });
        } catch (e) {
            logger.error('[update] acquire mongoDB connection failed:%s. when updatding collection:%s, operator is %s', e.toString(), collection, JSON.stringify(operator));
            reject(e.toString());
        }
    });
};

/**
 * remove entitys
 * @param {String} collection collection want remove
 * @param {Object} entity entity need to be removed
 * @return {Promise} promise
 */
db.deleteOne = function (collection, entity) {
    _printPoolInfo();

    return new Promise((resolve, reject) => {
        try {
            pool.acquire((poolErr, client) => {
                if (poolErr) {
                    logger.error('[remove] poolError acquiring connection from pool:%s, when removing collection:%s,entity is %s', poolErr.toString(), collection, JSON.stringify(entity));
                    reject(poolErr);
                    return;
                }
                const uuid = node_uuid.v4();
                logger.info('[remove] start remove %s, collection is:%s, entity is %s', uuid, collection, JSON.stringify(entity));
                client.collection(collection).deleteOne(entity, (err, r) => {
                    if (err) {
                        logger.error('[remove] remove %s failed,err is %s', uuid, err);
                        pool.release(client);
                        reject(err);
                    } else {
                        logger.info('[remove] remove %s successfully', uuid);
                        pool.release(client);
                        resolve(r);
                    }
                });
            });
        } catch (e) {
            logger.error('[save] acquire mongoDB connection failed:%s. when removing collection:%s, entity is %s', e.toString(), collection, JSON.stringify(entity));
            reject(e.toString());
        }
    });
};
