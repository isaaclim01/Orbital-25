import express from "express";
import { createBooking } from "../controllers/bookings.js";

const router = express.Router();

//CREATE
router.post("/", createBooking);
//UPDATE

//DELETE

//GET

//GET ALL

export default router;