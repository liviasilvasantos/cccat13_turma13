// resource - driven actor
// adapter
import PositionRepository from "./PositionRepository";
import Connection from "./Connection";

export default class PositionRepositoryDatabase implements PositionRepository {

	constructor(readonly connection: Connection) {
	}

	async save(position: any) {
		await this.connection.query("insert into cccat13.position (position_id, ride_id, lat, lng, date) values ($1, $2, $3, $4, $5)", [position.positionId, position.rideId, position.lat, position.lng, position.date]);
	}

}
