import AccountService from "./AccountService";
import RideRepository from "./RideRepository";
import RideRepositoryDatabase from "./RideRepositoryDatabase";
import PositionRepository from "./PositionRepository";
import PositionRepositoryDatabase from "./PositionRepositoryDatabase";
import Ride from "./Ride";
import { validate as validateUUID } from "uuid";
import SaveRide from "./SaveRide";

export default class RequestRide {

    accountService: AccountService;
    saveRide: SaveRide;

    constructor(readonly rideRepository: RideRepository = new RideRepositoryDatabase(),
        readonly positionRepository: PositionRepository = new PositionRepositoryDatabase()) {
        this.accountService = new AccountService();
        this.saveRide = new SaveRide();
    }

    async execute(input: Input) {
        if (!validateUUID(input.passengerId)) { throw new Error("account does not exists"); }

        const account = await this.accountService.getAccount(input.passengerId);
        if (!account?.isPassenger) { throw new Error("account is not passenger"); }

        const existsActiveRides = await this.rideRepository.existsActiveRidesByPassengerId(input.passengerId);
        if (existsActiveRides) { throw new Error(`already exist open ride for passenger id ${input.passengerId}`); }

        const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong,
            input.toLat, input.toLong);
        return await this.saveRide.execute(ride);
    }

}

//contrato de entrada - data transfer object (DTO)
type Input = {
    passengerId: string,
    driverId?: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
}