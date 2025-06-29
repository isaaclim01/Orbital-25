import express from "express"
import 'dotenv/config'
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js"


const app = express();

const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_SERVICE_KEY
);

//middlewares
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
// app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});


app.listen(8800, ()=>{
    console.log("Connected to backend.");
});

export default supabase;