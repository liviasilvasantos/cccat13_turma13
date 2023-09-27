import AccountService from "./AccountService";
import crypto from "crypto";
import RideRepository from "./RideRepository";
import RideRepositoryDatabase from "./RideRepositoryDatabase";
import PositionRepository from "./PositionRepository";
import PositionRepositoryDatabase from "./PositionRepositoryDatabase";
import Ride from "./Ride";
import { validate as validateUUID } from "uuid";

export default class RideService {

    accountService: AccountService;

    constructor(readonly rideRepository: RideRepository = new RideRepositoryDatabase(),
        readonly positionRepository: PositionRepository = new PositionRepositoryDatabase()) {
        this.accountService = new AccountService();
    }

    async requestRide(input: any) {
        if (!validateUUID(input.passengerId)) { throw new Error("account does not exists"); }

        const account = await this.accountService.getAccount(input.passengerId);
        if (!account.is_passenger) { throw new Error("account is not passenger"); }

        const existsActiveRides = await this.rideRepository.existsActiveRidesByPassengerId(input.passengerId);
        if (existsActiveRides) { throw new Error(`already exist open ride for passenger id ${input.passengerId}`); }

        const ride = Ride.create(input.passengerId, input.driverId, input.fromLat, input.fromLong,
            input.toLat, input.toLong);
        return await this.saveRide(ride);
    }

    async acceptRide(input: any) {
        const account = await this.accountService.getAccount(input.driverId);
        if (!account.is_driver) { throw new Error("account is not driver"); }

        const ride = await this.getRide(input.rideId);
        ride.accept(input.driverId);

        if (!ride.driverId) { throw new Error("driver id is empty") }

        const existsActiveRides = await this.rideRepository.existsActiveRidesByDriverId(ride.driverId);
        if (existsActiveRides) { throw new Error("active ride already exists") }

        await this.rideRepository.update(ride);
        return;
    }

    async saveRide(ride: Ride) {
        await this.rideRepository.save(ride);
        const rideId = ride.rideId;
        return { rideId };
    }

    async existsActiveRidesByPassengerId(passengerId: string) {
        return this.rideRepository.existsActiveRidesByPassengerId(passengerId);
    }

    async getRide(rideId: string) {
        return this.rideRepository.getById(rideId);
    }

    async startRide(rideId: string) {
        const ride = await this.getRide(rideId);
        if (ride.getStatus() !== "accepted") throw new Error("Ride is not accepted");

        ride.start();
        await this.rideRepository.update(ride);
        return;
    }

    async updatePosition(position: any) {
        const ride = await this.getRide(position.rideId);
        if (ride.getStatus() !== "in_progress") throw new Error("Ride is not in progress");

        const positionId = crypto.randomUUID();
        position.positionId = positionId;
        position.date = new Date();
        await this.positionRepository.save(position);

        return { positionId }
    }

    async finishRide(rideId: string) {
        const ride = await this.getRide(rideId);
        if (ride.getStatus() !== "in_progress") throw new Error("Ride is not in progress");

        const distance = 22.55;
        const fare = 14.50;
        ride.finish(distance, fare);
        await this.rideRepository.update(ride);
        return;
    }
}