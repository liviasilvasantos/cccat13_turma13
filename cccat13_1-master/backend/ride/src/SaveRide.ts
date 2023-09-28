import RideRepository from "./RideRepository";
import RideRepositoryDatabase from "./RideRepositoryDatabase";
import Ride from "./Ride";

export default class SaveRide {

    constructor(readonly rideRepository: RideRepository = new RideRepositoryDatabase()) { }

    async execute(ride: Ride) {
        await this.rideRepository.save(ride);
        const rideId = ride.rideId;
        return { rideId };
    }
}