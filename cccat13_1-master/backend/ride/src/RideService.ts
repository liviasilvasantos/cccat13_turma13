import AccountService from "./AccountService";
import crypto from "crypto";
import pgp from "pg-promise";

export default class RideService {    

	async requestRide (input: any) {
        const connection = pgp()("postgres://postgres:123456@192.168.15.23:5432/app");
        try {
            console.log(`requesting ride for ${input.passengerId} from (${input.from_lat},${input.from_lng}) to (${input.to_lat},${input.to_lng})`);

            const account = await new AccountService().getAccount(input.passengerId);

            // deve verificar se o account_id tem is_passenger true
            if(!account.is_passenger){
                throw new Error("account is not passenger");
            }

            //deve verificar se já não existe uma corrida do passageiro em status diferente de "completed", se existir lançar um erro
            const existOpenRides = await this.existOpenRides(account.account_id);
            if(existOpenRides){
                throw new Error(`already exist open ride for passenger id ${account.account_id}`);
            }

            //deve gerar o ride_id (uuid)
            const rideId = crypto.randomUUID();

            //deve definir o status como "requested"
            const status = "requested";
            // deve definir date com a data atual
            const date = new Date();
            
            await connection.query("insert into cccat13.ride (ride_id, account_id, from_lat, from_lng, to_lat, to_lng, date, status) values ($1, $2, $3, $4, $5, $6, $7, $8)", [rideId, input.passengerId,input.from_lat, input.from_lng, input.to_lat, input.to_lng, date, status]);
            return {rideId};
        } finally {
            await connection.$pool.end();
        }
	}

    async existOpenRides (passengerId: string) {
		const connection = pgp()("postgres://postgres:123456@192.168.15.23:5432/app");
		const [countRides] = await connection.query("select count(1) from cccat13.ride where account_id = $1 and status != 'completed'", [passengerId]);
		await connection.$pool.end();
        
		return countRides && countRides.count > 0;
	}
}