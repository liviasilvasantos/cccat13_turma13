import crypto from "crypto";
import RideRepository from "../repository/RideRepository";
import PositionRepository from "../repository/PositionRepository";

export default class UpdatePosition {

    constructor(readonly rideRepository: RideRepository,
        readonly positionRepository: PositionRepository) {
    }

    async execute(position: any) {
        const ride = await this.rideRepository.getById(position.rideId);
        if (ride.getStatus() !== "in_progress") throw new Error("Ride is not in progress");

        const positionId = crypto.randomUUID();
        position.positionId = positionId;
        position.date = new Date();
        await this.positionRepository.save(position);

        return { positionId }
    }

}