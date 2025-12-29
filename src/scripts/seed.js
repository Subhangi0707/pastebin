import mongoose from "mongoose";
import Paste from "../models/Paste.js";
import dotenv from "dotenv";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("Connected to MongoDB");

    await Paste.deleteMany({});

    const now = new Date();

    await Paste.insertMany([
      {
        _id: "seed1",
        content: "Hello from seed paste 1",
        max_views: 5,
        view_count: 0,
        expires_at: null,
      },
      {
        _id: "seed2",
        content: "This paste expires in 60 seconds",
        max_views: null,
        view_count: 0,
        expires_at: new Date(now.getTime() + 60 * 1000),
      },
      {
        _id: "seed3",
        content: "This paste has 1 view only",
        max_views: 1,
        view_count: 0,
        expires_at: null,
      },
      {
        _id: "seed4",
        content: "TTL + max views combined",
        max_views: 3,
        view_count: 1,
        expires_at: new Date(now.getTime() + 120 * 1000),
      }
    ]);

    console.log("Seed data inserted");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
