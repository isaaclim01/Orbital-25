import express from "express";
import { createBooking, deleteBooking, getAllBookings, getBooking, updateBooking } from "../controllers/bookings.js";

const router = express.Router();

//CREATE
router.post("/", createBooking);
//UPDATE
router.put("/:id", updateBooking);
//DELETE
router.delete("/:id", deleteBooking);
//GET
router.get("/:id", getBooking);
//GET ALL
router.get("/", getAllBookings);

export default router;