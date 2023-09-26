import Ride from "./Ride";

export default interface RideRepository {
    save(ride: Ride): Promise<void>;
    update (ride: any): Promise<void>;
    getById(rideId: string): Promise<Ride>;
    existsActiveRidesByPassengerId(passengerId: string): Promise<boolean>;
    existsActiveRidesByDriverId(driverId: string): Promise<boolean>;
}