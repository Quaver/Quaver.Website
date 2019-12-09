import Server from "./Server";
import SqlDatabase from "./database/SqlDatabase";
const config = require("./config/config.json");

class Program {
    /**
     * Main execution point
     */
    public static async Main(): Promise<void> {
        await SqlDatabase.Initialize(config.databaseSql.host, config.databaseSql.user, config.databaseSql.password, config.databaseSql.database, 10);
        new Server(config.port);
    }
}

Program.Main();