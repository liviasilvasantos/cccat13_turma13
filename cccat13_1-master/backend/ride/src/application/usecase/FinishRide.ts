import RideRepository from "../repository/RideRepository";

export default class FinishRide {

    constructor(readonly rideRepository: RideRepository) {
    }

    async execute(rideId: string) {
        const ride = await this.rideRepository.getById(rideId);
        if (ride.getStatus() !== "in_progress") throw new Error("Ride is not in progress");

        const distance = 22.55;
        const fare = 14.50;
        ride.finish(distance, fare);
        await this.rideRepository.update(ride);
        return;
    }
}