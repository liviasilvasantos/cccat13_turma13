// driver
// adapter
import express from "express";
import Signup from "./Signup";
import RequestRide from "./RequestRide";
import AcceptRide from "./AcceptRide";
import GetAccount from "./GetAccount";
import GetRide from "./GetRide";
import PgPromiseAdapter from "./PgPromiseAdapter";
import AccountRepositoryDatabase from "./AccountRepositoryDatabase";
import RideRepositoryDatabase from "./RideRepositoryDatabase";

const app = express();
app.use(express.json());

const connection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase(connection);
const rideRepository = new RideRepositoryDatabase(connection);

// port
app.post("/signup", async function (req, res) {
    const input = req.body;
    const signup = new Signup(accountRepository);
    const output = await signup.execute(input);
    res.json(output);
});

app.post("/rides/request", async function (req, res) {
    const input = req.body;
    const requestRide = new RequestRide(rideRepository, accountRepository);
    const output = await requestRide.execute(input);
    res.json(output);
})

app.post("/rides/accpept", async function (req, res) {
    const input = req.body;
    const acceptRide = new AcceptRide(rideRepository, accountRepository);
    const output = await acceptRide.execute(input);
    res.json(output);
})

app.get("/accounts/:accountId", async function (req, res) {
    const getAccount = new GetAccount(accountRepository);
    const output = await getAccount.execute(req.params.accountId);
    res.json(output);
});

app.get("/rides/:rideId", async function (req, res) {
    const getRide = new GetRide(rideRepository);
    const output = await getRide.execute(req.params.rideId);
    res.json(output);
})

app.listen(3000);
