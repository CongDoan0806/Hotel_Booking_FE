const {getUserListModel} = require('../models/admin.model');

const getUserListRepo = async () => {
    return await getUserListModel();
}

module.exports = {
    getUserListRepo
}