export default interface RideRepository {
    save(ride: any): Promise<void>;
    update (ride: any): Promise<void>;
    getById(rideId: string): Promise<any>;
    existsActiveRidesByPassengerId(passengerId: string): Promise<boolean>;
    existsActiveRidesByDriverId(driverId: string): Promise<boolean>;
}