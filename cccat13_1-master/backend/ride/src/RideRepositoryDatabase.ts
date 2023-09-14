// resource - driven actor
// adapter
import pgp from "pg-promise";
import RideRepository from "./RideRepository";

export default class RideRepositoryDatabase implements RideRepository {

	constructor () {
	}
	
	async save (ride: any) {
		const connection = pgp()("postgres://postgres:123456@192.168.15.23:5432/app");
		await connection.query("insert into cccat13.ride (ride_id, passenger_id, from_lat, from_lng, to_lat, to_lng, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)", [ride.rideId, ride.passengerId, ride.from.lat, ride.from.lng, ride.to.lat, ride.to.lng, ride.status, ride.date]);
		await connection.$pool.end();
	}
	
	async getById(rideId: string): Promise<any> {
		const connection = pgp()("postgres://postgres:123456@192.168.15.23:5432/app");
		const [rideData] = await connection.query("select * from cccat13.ride where ride_id = $1", [rideId]);
		await connection.$pool.end();
		return rideData;
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