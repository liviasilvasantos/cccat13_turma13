import Connection from "./Connection";
import pgp from "pg-promise";

export default class PgPromiseAdapter implements Connection {
    connection: any;

    constructor() {
        this.connection = pgp()("postgres://postgres:123456@192.168.15.23:5432/app");
    }
    query(stament: string, data: any): Promise<any> {
        return this.connection.query(stament, data);
    }
    async close(): Promise<void> {
        await this.connection.$pool.end();
    }

}