// resource - driven actor
// adapter
import pgp from "pg-promise";
import PositionRepository from "./PositionRepository";

export default class PositionRepositoryDatabase implements PositionRepository {

	constructor() {
	}

	async save(position: any) {
		const connection = pgp()("postgres://postgres:123456@192.168.15.23:5432/app");
		await connection.query("insert into cccat13.position (position_id, ride_id, lat, lng, date) values ($1, $2, $3, $4, $5)", [position.positionId, position.rideId, position.lat, position.lng, position.date]);
		await connection.$pool.end();
	}

}
