import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  getRoomsByHotel,
  updateRoom,
  updateRoomAvailability,
} from "../controllers/room.js";

const router = express.Router();

//CREATE
router.post("/", createRoom);
//UPDATE
router.put("/availability/:id", updateRoomAvailability);
router.put("/:id", updateRoom);
//DELETE
router.delete("/:id", deleteRoom);
//GET
router.get("/find/:id", getRoom);
//GET ALL
router.get("/", getRooms);
router.get("/hotel/:hotelid", getRoomsByHotel);

export default router;