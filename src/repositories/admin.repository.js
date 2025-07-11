const {getUserListModel,getCheckinGuestsModel, getCheckoutGuestsModel} = require('../models/admin.model');

const getUserListRepo = async () => {
    return await getUserListModel();
}

const getCheckinGuestsRepo = async () => {
    return await getCheckinGuestsModel();
}

const getCheckoutGuestsRepo = async () => {
    return await getCheckoutGuestsModel();
}
module.exports = {
    getUserListRepo,
    getCheckinGuestsRepo,
    getCheckoutGuestsRepo
}