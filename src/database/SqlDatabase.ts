import * as mysql from "mysql";
import Logger from "../logging/Logger";

export default class SqlDatabase {
    /**
     * The connection pool for the database.
     */
    public static Pool: mysql.Pool;

    /**
     * Initializes & connects to the MySQL database.
     * @param host
     * @param user
     * @param password
     * @param database
     * @param connectionLimit
     * @constructor
     */
    public static Initialize(host: string, user: string, password: string, database: string, connectionLimit: number): void {
        if (SqlDatabase.Pool != undefined)
            throw Error("SqlDatabase can only be initialized once.");
        
        SqlDatabase.Pool = mysql.createPool({
            host,
            user,
            password,
            database,
            connectionLimit
        });
        
        Logger.Success("Successfully created MySQL Database Pool.");
    }

    /**
     * Executes a database query.
     * @param query
     * @param values Any prepared statement values in order.
     * @constructor
     */
    public static Execute(query: string, values: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            SqlDatabase.Pool.query(query, values, (error: any, data: any, fields: any) => {
                if (error) {
                    Logger.Error(error);
                    return reject(error);
                }
                
                return resolve(data);
            });
        });
    }
}