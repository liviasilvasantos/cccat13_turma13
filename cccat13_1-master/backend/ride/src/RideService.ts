import AccountService from "./AccountService";
import crypto from "crypto";
import RideRepository from "./RideRepository";
import RideRepositoryDatabase from "./RideRepositoryDatabase";

export default class RideService {
    rideRepository: RideRepository;
    accountService: AccountService;

    constructor() {
        this.rideRepository = new RideRepositoryDatabase();
        this.accountService = new AccountService();
    }

    async acceptRide(input: any) {
        const account = await this.accountService.getAccount(input.driverId);

        if (!account.is_driver) {
            throw new Error("account is not driver");
        }

        const ride = await this.getRide(input.rideId);
        console.log('ride', ride);
        
        if (ride.status !== "requested") {
            throw new Error("ride is not requested");
        }

        const existsActiveRides = await this.rideRepository.existsActiveRidesByDriverId(ride.driver_id);
        if (existsActiveRides) {
            throw new Error("active ride already exists")
        }
        // * deve associar o driver_id na corrida
        // * deve mudar o status para "accepted"

        return;
    }

    async requestRide(input: any) {
        const account = await this.accountService.getAccount(input.passengerId);

        if (!account.is_passenger) {
            throw new Error("account is not passenger");
        }

        const existsActiveRides = await this.rideRepository.existsActiveRidesByPassengerId(input.passengerId);
        if (existsActiveRides) {
            throw new Error(`already exist open ride for passenger id ${input.passengerId}`);
        }

        const ride = {
            status: "requested",
            passengerId: input.passengerId,
            from: input.from,
            to: input.to
        }

        return await this.saveRide(ride);
    }

    async saveRide(input: any) {
        const rideId = crypto.randomUUID();
        const ride = {
            rideId,
            status: input.status,
            date: new Date(),
            passengerId: input.passengerId,
            driverId: input.driverId,
            from: input.from,
            to: input.to
        }

        await this.rideRepository.save(ride);
        return { rideId };
    }

    async existsActiveRidesByPassengerId(passengerId: string) {
        return this.rideRepository.existsActiveRidesByPassengerId(passengerId);
    }

    async getRide(rideId: string) {
        return this.rideRepository.getById(rideId);
    }

}