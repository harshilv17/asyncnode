import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import {config} from "./config.ts";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: config.DatabaseUrl });
export const db = drizzle({ client: pool });