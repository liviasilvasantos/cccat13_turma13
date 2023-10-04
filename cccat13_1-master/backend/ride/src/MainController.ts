import AcceptRide from "./AcceptRide";
import GetAccount from "./GetAccount";
import GetRide from "./GetRide";
import HttpServer from "./HttpServer";
import RequestRide from "./RequestRide";
import Signup from "./Signup";

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
            return output;
        });

        httpServer.on("post", "/accept_ride", async function (params: any, body: any) {
            const output = await acceptRide.execute(body);
            return output;
        });
    }
}