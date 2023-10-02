import RideRepository from "./RideRepository";
import RideRepositoryDatabase from "./RideRepositoryDatabase";

export default class VerifyExistsActiveRidesByPassengerId {

    constructor(readonly rideRepository: RideRepository) { }

    async execute(passengerId: string) {
        return await this.rideRepository.existsActiveRidesByPassengerId(passengerId);
    }

}