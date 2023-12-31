import AcceptRide from "../../application/usecase/AcceptRide";
import GetAccount from "../../application/usecase/GetAccount";
import GetRide from "../../application/usecase/GetRide";
import HttpServer from "../http/HttpServer";
import RequestRide from "../../application/usecase/RequestRide";
import Signup from "../../application/usecase/Signup";

//interface adapter
export default class MainController {

    constructor(readonly httpServer: HttpServer, signup: Signup, getAccount: GetAccount,
        requestRide: RequestRide, getRide: GetRide, acceptRide: AcceptRide) {

        httpServer.on("post", "/signup", async function (params: any, body: any) {
            const output = await signup.execute(body);
            return output;
        });

        httpServer.on("get", "/accounts/:accountId", async function (params: any, body: any) {
            const output = await getAccount.execute(params.accountId);
            return output;
        });

        httpServer.on("post", "/request_ride", async function (params: any, body: any) {
            const output = await requestRide.execute(body);
            return output;
        });

        httpServer.on("get", "/rides/:rideId", async function (params: any, body: any) {
            const output = await getRide.execute(params.rideId);
            console.log(output);
            
            return output;
        });

        httpServer.on("post", "/accept_ride", async function (params: any, body: any) {
            const output = await acceptRide.execute(body);
            return output;
        });
    }
}