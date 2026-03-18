import {Database, getDatabase} from "@firebase/database";
import {app} from "./app";

export const db: Database = getDatabase(app);
