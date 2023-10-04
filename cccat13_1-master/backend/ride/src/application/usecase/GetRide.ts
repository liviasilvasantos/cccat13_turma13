import RideRepository from "../repository/RideRepository";
import RideRepositoryDatabase from "../../infra/repository/RideRepositoryDatabase";

export default class GetRide {

    constructor(readonly rideRepository: RideRepository) {}

    async execute(rideId: string) {
        return await this.rideRepository.getById(rideId);
    }
}