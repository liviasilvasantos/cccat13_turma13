import AccountService from "./AccountService";
import crypto from "crypto";
import RideRepository from "./RideRepository";
import RideRepositoryDatabase from "./RideRepositoryDatabase";
import PositionRepository from "./PositionRepository";
import PositionRepositoryDatabase from "./PositionRepositoryDatabase";

export default class RideService {
	accountService: AccountService;

    constructor(readonly rideRepository: RideRepository = new RideRepositoryDatabase(), 
        readonly positionRepository: PositionRepository = new PositionRepositoryDatabase()) {
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

        const rideUpdate = {
            driverId: ride.driver_id, 
            status: "accepted", 
            rideId: ride.ride_id
        }
        await this.rideRepository.update(rideUpdate);
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

    async startRide(rideId: string) {
		const ride = await this.getRide(rideId);
        if(ride.status !== "accepted") throw new Error("Ride is not accepted");
        
        const updateRide = {
            driverId: ride.driver_id,
            rideId: ride.ride_id,
            status: "in_progress"
        }
        
        this.rideRepository.update(updateRide);
        return;
    }

    async updatePosition(position: any) {
		const ride = await this.getRide(position.rideId);
        if(ride.status !== "in_progress") throw new Error("Ride is not in progress");

        const positionId = crypto.randomUUID();
        position.positionId = positionId;
        position.date = new Date();
        await this.positionRepository.save(position);

        return { positionId }
	}
}