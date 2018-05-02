import db from '../mongo';

export default {
    validateUser: function (loginUser) {
        return db.findOne('user', loginUser);
    }
};
