// driver
// adapter
import express from "express";
import AccountService from "./AccountService";
import RideService from "./RideService";
const app = express();

app.use(express.json());

// port
const accountService = new AccountService();
const rideService = new RideService();

app.post("/signup", async function (req, res) {
    const input = req.body;
    const output = await accountService.signup(input);
    res.json(output);
});

app.post("/rides/request", async function (req, res) {
    const input = req.body;
    const output = await rideService.requestRide(input);
    res.json(output);
})

app.post("/rides/accpept", async function (req, res) {
    const input = req.body;
    const output = await rideService.acceptRide(input);
    res.json(output);
})

app.get("/accounts/:accountId", async function (req, res) {
    const output = await accountService.getAccount(req.params.accountId);
    res.json(output);
});

app.get("/rides/:rideId", async function (req, res) {
    const output = await rideService.getRide(req.params.rideId);
    res.json(output);
})

app.listen(3000);
