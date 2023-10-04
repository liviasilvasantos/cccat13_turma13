import RideRepository from "../repository/RideRepository";
import AccountRepository from "../repository/AccountRepository";

export default class AcceptRide {

    constructor(readonly rideRepository: RideRepository, readonly accountRepository: AccountRepository) {
    }

    async execute(input: any) {
        const account = await this.accountRepository.getById(input.driverId);
        if (!account?.isDriver) { throw new Error("account is not driver"); }

        const ride = await this.rideRepository.getById(input.rideId);
        ride.accept(input.driverId);

        if (!ride.getDriverId()) { throw new Error("driver id is empty") }

        const existsActiveRides = await this.rideRepository.existsActiveRidesByDriverId(input.driverId);
        if (existsActiveRides) { throw new Error("active ride already exists") }

        await this.rideRepository.update(ride);
        return;
    }
}