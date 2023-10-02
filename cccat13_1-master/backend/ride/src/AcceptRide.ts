import AccountService from "./AccountService";
import RideRepository from "./RideRepository";
import RideRepositoryDatabase from "./RideRepositoryDatabase";
import PositionRepository from "./PositionRepository";
import PositionRepositoryDatabase from "./PositionRepositoryDatabase";
import GetRide from "./GetRide";

export default class AcceptRide {

    accountService: AccountService;
    getRide: GetRide;

    constructor(readonly rideRepository: RideRepository,
        readonly positionRepository: PositionRepository) {
        this.accountService = new AccountService();
        this.getRide = new GetRide();
    }

    async execute(input: any) {
        const account = await this.accountService.getAccount(input.driverId);
        if (!account?.isDriver) { throw new Error("account is not driver"); }

        const ride = await this.getRide.execute(input.rideId);
        ride.accept(input.driverId);

        if (!ride.getDriverId()) { throw new Error("driver id is empty") }

        //FIX
        // const existsActiveRides = await this.rideRepository.existsActiveRidesByDriverId(ride.getDriverId());
        // if (existsActiveRides) { throw new Error("active ride already exists") }

        await this.rideRepository.update(ride);
        return;
    }
}