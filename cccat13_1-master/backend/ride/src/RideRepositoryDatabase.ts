// resource - driven actor
// adapter
import pgp from "pg-promise";
import RideRepository from "./RideRepository";
import Ride from "./Ride";

export default class RideRepositoryDatabase implements RideRepository {

	constructor () {
	}
	
	async save (ride: Ride) {
		const connection = pgp()("postgres://postgres:123456@192.168.15.23:5432/app");
		await connection.query("insert into cccat13.ride (ride_id, passenger_id, from_lat, from_lng, to_lat, to_lng, status, date, driver_id) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [ride.rideId, ride.passengerId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.getStatus(), ride.date, ride.getDriverId()]);
		await connection.$pool.end();
	}

	async update(ride: Ride): Promise<void> {
		const connection = pgp()("postgres://postgres:123456@192.168.15.23:5432/app");
		await connection.query("update cccat13.ride set driver_id = $1, status = $2, distance = $3, fare = $4 where ride_id = $5", [ride.getDriverId(), ride.getStatus(), ride.getDistance(), ride.getFare(), ride.rideId]);
		await connection.$pool.end();
	}
	
	async getById(rideId: string): Promise<Ride> {
		const connection = pgp()("postgres://postgres:123456@192.168.15.23:5432/app");
		const [rideData] = await connection.query("select * from cccat13.ride where ride_id = $1", [rideId]);
		await connection.$pool.end();
		return Ride.restore(rideData.ride_id, rideData.passenger_id, rideData.driver_id, rideData.status, parseFloat(rideData.from_lat), 
		parseFloat(rideData.from_lng), parseFloat(rideData.to_lat), parseFloat(rideData.to_lng), rideData.date);
	}

	async existsActiveRidesByPassengerId(passengerId: string): Promise<boolean> {
		const connection = pgp()("postgres://postgres:123456@192.168.15.23:5432/app");
		const [ridesData] = await connection.query("select count(1) from cccat13.ride where passenger_id = $1 and status != 'completed'", [passengerId]);
		await connection.$pool.end();
		
		return ridesData && ridesData.count > 0;
	}

	async existsActiveRidesByDriverId(driverId: string): Promise<boolean> {
		const connection = pgp()("postgres://postgres:123456@192.168.15.23:5432/app");
		const [ridesData] = await connection.query("select count(1) from cccat13.ride where driver_id = $1 and status in ('accepted', 'in_progress')", [driverId]);
		await connection.$pool.end();
		return ridesData && ridesData.count > 0;
	}
	
}
