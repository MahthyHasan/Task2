import express from "express";
import {
    getUser,
    logIn,
    logOut,
    signUp,
    updateUserLocation,
    getUserWeather,
} from "../controllers/auth.controller.js";
import { fetchWeather } from "../controllers/weather.controller.js";
import { protectedRoute } from "../middleLayers/protectRoute.js";

const router = express.Router();

// Auth routes
router.get("/getUser", protectedRoute, getUser);
router.post("/signUp", signUp);
router.post("/logIn", logIn);
router.post("/logOut", logOut);
router.put("/:id/location", protectedRoute, updateUserLocation);

// Weather routes
router.get("/:id/weather/:date", protectedRoute, getUserWeather);
router.get("/weather/fetch", fetchWeather); // New route to fetch and store weather

export default router;
