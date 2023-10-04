import RideRepository from "../repository/RideRepository";
import Ride from "../../domain/Ride";
import { validate as validateUUID } from "uuid";
import AccountRepository from "../repository/AccountRepository";

export default class RequestRide {

    constructor(readonly rideRepository: RideRepository,
        readonly accountRepository: AccountRepository) {
    }

    async execute(input: Input) {
        if (!validateUUID(input.passengerId)) { throw new Error("account does not exists"); }

        const account = await this.accountRepository.getById(input.passengerId);
        if (!account?.isPassenger) { throw new Error("account is not passenger"); }

        const existsActiveRides = await this.rideRepository.existsActiveRidesByPassengerId(input.passengerId);
        if (existsActiveRides) { throw new Error(`already exist open ride for passenger id ${input.passengerId}`); }

        const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong,
            input.toLat, input.toLong);
        await this.rideRepository.save(ride);

        return { rideId: ride.rideId };
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