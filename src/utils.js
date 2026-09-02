import { dirname } from "path";
import { fileURLToPath } from "url";

export const root = dirname(fileURLToPath(import.meta.url));