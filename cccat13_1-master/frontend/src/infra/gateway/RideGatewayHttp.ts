import Account from "../../domain/Account";
import RideGateway from "./RideGateway";
import HttpClient from "./http/HttpClient";

export default class RideGatewayHttp implements RideGateway {

    constructor(readonly httpClient: HttpClient) { }

    async signup(input: Account): Promise<any> {
        const output = this.httpClient.post("http://localhost:3000/signup", input);
        return output;
    }

}