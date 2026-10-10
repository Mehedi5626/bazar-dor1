
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoURI = process.env.BETTER_AUTH_MONGODB_URI;

if (!mongoURI) {
  throw new Error("BETTER_AUTH_MONGODB_URI is missing in .env");
}

const client = new MongoClient(mongoURI);
const db = client.db("better-auth");

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  database: mongodbAdapter(db, { client }),
});
