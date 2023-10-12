import RideGateway from "./RideGateway";
import axios from "axios";

export default class RideGatewayHttp implements RideGateway {
    async signup(input: any): Promise<any> {
        const response = await axios.post("http://localhost:3000/signup", input);
        const output = response.data;
        return output;
    }

}