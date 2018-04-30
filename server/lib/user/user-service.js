import db from '../mongo';

export default {
    validateUser: function (loginUser) {
        return new Promise(function (resolve, reject) {
            db.findOne('user', loginUser).then((user) => {
                if (user) {
                    resolve(user);
                } else {
                    reject(false);
                }
            }, reject);
        });
    }
};
