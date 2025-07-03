const RoomModel = require("../models/room.model");

const getAllRooms = async () => {
  return await RoomModel.getAll();
};

const getRoomById = async (id) => {
  const room = await RoomModel.getById(id);
  if (!room) {
    throw new Error("Room not found");
  }
  return room;
};

const createRoom = async (roomData) => {
  return await RoomModel.create(roomData);
};

const updateRoom = async (id, roomData) => {
  const updatedRoom = await RoomModel.update(id, roomData);
  if (!updatedRoom) {
    throw new Error("Failed to update. Room not found.");
  }
  return updatedRoom;
};

const deleteRoom = async (id) => {
  const deletedRoom = await RoomModel.remove(id);
  if (!deletedRoom) {
    throw new Error("Failed to delete. Room not found.");
  }
  return deletedRoom;
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
