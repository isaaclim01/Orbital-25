import express from "express"
import 'dotenv/config'
import { createClient } from "@supabase/supabase-js";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js"
import cors from 'cors';
import bookingsRoute from "./routes/bookings.js";


const app = express();
// Enable CORS with specific frontend origin
app.use(cors({
  origin: 'http://localhost:3000', // Your React app
  credentials: true, // If using cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_SERVICE_KEY
);

//middlewares
app.use(cookieParser());
app.use(express.json());
// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request from ${req.get('origin')}`);
  console.log('Headers:', req.headers);
  console.log('Query:', req.query);
  next();
});

app.use("/api/auth", authRoute);
app.use("/api/bookings", bookingsRoute);
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