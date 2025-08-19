
import { log } from './logger.ts';

console.log("--- Starting Log Test ---");


log("backend", "error", "handler", "received string, expected bool");

log("backend", "fatal", "db", "Critical database connection failure.");

log("frontend", "info", "component", "User clicked the login button.");