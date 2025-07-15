const {getUserListModel,getCheckinGuestsModel, getCheckoutGuestsModel, getAdminDashboardStatusModel, getAdminDashboardDealModel} = require('../models/admin.model');

const getUserListRepo = async () => {
    return await getUserListModel();
}

const getCheckinGuestsRepo = async () => {
    return await getCheckinGuestsModel();
}

const getCheckoutGuestsRepo = async () => {
    return await getCheckoutGuestsModel();
}

const getAdminDashboardStatusRepo = async () => {
    return await getAdminDashboardStatusModel();
}

const getAdminDashboardDealRepo = async () => {
    return await getAdminDashboardDealModel(); 
}

module.exports = {
    getUserListRepo,
    getCheckinGuestsRepo,
    getCheckoutGuestsRepo,
    getAdminDashboardStatusRepo,
    getAdminDashboardDealRepo
}