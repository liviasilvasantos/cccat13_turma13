// driver
// adapter
import Signup from "./application/usecase/Signup";
import RequestRide from "./application/usecase/RequestRide";
import AcceptRide from "./application/usecase/AcceptRide";
import GetAccount from "./application/usecase/GetAccount";
import GetRide from "./application/usecase/GetRide";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import AccountRepositoryDatabase from "./infra/repository/AccountRepositoryDatabase";
import RideRepositoryDatabase from "./infra/repository/RideRepositoryDatabase";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import MainController from "./infra/controller/MainController";

const connection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase(connection);
const rideRepository = new RideRepositoryDatabase(connection);

const signup = new Signup(accountRepository);
const requestRide = new RequestRide(rideRepository, accountRepository);
const acceptRide = new AcceptRide(rideRepository, accountRepository);
const getAccount = new GetAccount(accountRepository);
const getRide = new GetRide(rideRepository, accountRepository);

const httpServer = new ExpressAdapter();
new MainController(httpServer, signup, getAccount, requestRide, getRide, acceptRide);

httpServer.listen(3000);
// port