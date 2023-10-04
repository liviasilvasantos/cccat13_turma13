import RideRepository from "../repository/RideRepository";
import RideRepositoryDatabase from "../../infra/repository/RideRepositoryDatabase";
import Ride from "../../domain/Ride";

export default class SaveRide {

    constructor(readonly rideRepository: RideRepository) { }

    async execute(ride: Ride) {
        await this.rideRepository.save(ride);
        const rideId = ride.rideId;
        return { rideId };
    }
}