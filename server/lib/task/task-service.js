import moment from 'moment'
import mongodb from 'mongodb';
let ObjectID = mongodb.ObjectID;

import db from '../mongo';

const TASK_COLLECTION = 'task';

export default {
    createTask: (task) => {
        task.createtime = new Date();
        return db.insertOne(TASK_COLLECTION, task);
    },
    startTask: (taskId) => {
        let startTask = {_id: ObjectID(taskId)};
        return db.updateOne(TASK_COLLECTION, startTask, {
            $set: {
                status: 1,
                starttime: new Date()
            }
        });
    },
    completeTask: (taskId) => {
        let completeTask = {_id: ObjectID(taskId)};

        return db.findOne(TASK_COLLECTION, completeTask).then((task) => {
            let completetime = moment();
            let actualtime = moment.duration(completetime.diff(task.starttime)).toString();

            return db.updateOne(TASK_COLLECTION, completeTask, {
                $set: {
                    status: 3,
                    completetime: completetime.toDate(),
                    actualtime: actualtime
                }
            });
        });
    },
    getUndoneTasks: () => {
        return db.find(TASK_COLLECTION, {status: {"$lt": 3}});
    },
    getRecent3MonthDoneTasks: () => {
        let threeMonthAgo = moment().subtract(3, 'months').toDate();
        return db.find(TASK_COLLECTION, {status: 3, createtime: {"$gt": threeMonthAgo}}, 0, 10000, {createtime: -1});
    }
};
