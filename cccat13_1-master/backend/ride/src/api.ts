// driver
// adapter
import Signup from "./Signup";
import RequestRide from "./RequestRide";
import AcceptRide from "./AcceptRide";
import GetAccount from "./GetAccount";
import GetRide from "./GetRide";
import PgPromiseAdapter from "./PgPromiseAdapter";
import AccountRepositoryDatabase from "./AccountRepositoryDatabase";
import RideRepositoryDatabase from "./RideRepositoryDatabase";
import ExpressAdapter from "./ExpressAdapter";
import MainController from "./MainController";

const connection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase(connection);
const rideRepository = new RideRepositoryDatabase(connection);

const signup = new Signup(accountRepository);
const requestRide = new RequestRide(rideRepository, accountRepository);
const acceptRide = new AcceptRide(rideRepository, accountRepository);
const getAccount = new GetAccount(accountRepository);
const getRide = new GetRide(rideRepository);

const httpServer = new ExpressAdapter();
new MainController(httpServer, signup, getAccount, requestRide, getRide, acceptRide);
httpServer.listen(3000);

// port
