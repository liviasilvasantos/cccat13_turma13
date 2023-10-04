// resource - driven actor
// adapter
import RideRepository from "../../application/repository/RideRepository";
import Ride from "../../domain/Ride";
import Connection from "../database/Connection";

export default class RideRepositoryDatabase implements RideRepository {

	constructor(readonly connection: Connection) {
	}

	async save(ride: Ride) {
		await this.connection.query("insert into cccat13.ride (ride_id, passenger_id, from_lat, from_lng, to_lat, to_lng, status, date, driver_id) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [ride.rideId, ride.passengerId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.getStatus(), ride.date, ride.getDriverId()]);
	}

	async update(ride: Ride): Promise<void> {
		await this.connection.query("update cccat13.ride set driver_id = $1, status = $2, distance = $3, fare = $4 where ride_id = $5", [ride.getDriverId(), ride.getStatus(), ride.getDistance(), ride.getFare(), ride.rideId]);
	}

	async getById(rideId: string): Promise<Ride> {
		const [rideData] = await this.connection.query("select * from cccat13.ride where ride_id = $1", [rideId]);
		return Ride.restore(rideData.ride_id, rideData.passenger_id, rideData.driver_id, rideData.status, parseFloat(rideData.from_lat),
			parseFloat(rideData.from_lng), parseFloat(rideData.to_lat), parseFloat(rideData.to_lng), rideData.date);
	}

	async existsActiveRidesByPassengerId(passengerId: string): Promise<boolean> {
		const [ridesData] = await this.connection.query("select count(1) from cccat13.ride where passenger_id = $1 and status != 'completed'", [passengerId]);
		return ridesData && ridesData.count > 0;
	}

	async existsActiveRidesByDriverId(driverId: string): Promise<boolean> {
		const [ridesData] = await this.connection.query("select count(1) from cccat13.ride where driver_id = $1 and status in ('accepted', 'in_progress')", [driverId]);
		return ridesData && ridesData.count > 0;
	}

}
