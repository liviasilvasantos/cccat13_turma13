import RideRepository from "./RideRepository";
import RideRepositoryDatabase from "./RideRepositoryDatabase";
import PositionRepository from "./PositionRepository";
import PositionRepositoryDatabase from "./PositionRepositoryDatabase";
import GetRide from "./GetRide";

export default class StartRide {

    getRide: GetRide;

    constructor(readonly rideRepository: RideRepository,
        readonly positionRepository: PositionRepository) {
        this.getRide = new GetRide();
    }

    async execute(rideId: string) {
        const ride = await this.getRide.execute(rideId);
        if (ride.getStatus() !== "accepted") throw new Error("Ride is not accepted");

        ride.start();
        await this.rideRepository.update(ride);
        return;
    }

}