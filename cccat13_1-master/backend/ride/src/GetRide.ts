import RideRepository from "./RideRepository";
import RideRepositoryDatabase from "./RideRepositoryDatabase";

export default class GetRide {

    constructor(readonly rideRepository: RideRepository) {}

    async execute(rideId: string) {
        return await this.rideRepository.getById(rideId);
    }
}