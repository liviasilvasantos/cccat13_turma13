export default interface Connection {

    query(stament: string, data: any): Promise<any>;
    close(): Promise<void>;

}