import RideRepository from "../repository/RideRepository";
import RideRepositoryDatabase from "../../infra/repository/RideRepositoryDatabase";
import AccountRepository from "../repository/AccountRepository";

export default class GetRide {

    constructor(readonly rideRepository: RideRepository,
        readonly accountRepository: AccountRepository) { }

    async execute(rideId: string) {
        const ride = await this.rideRepository.getById(rideId);
        const account = await this.accountRepository.getById(ride.passengerId);
        return Object.assign(ride, { passenger: account });
    }
}