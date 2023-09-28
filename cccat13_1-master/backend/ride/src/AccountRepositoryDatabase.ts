import AccountRepository from "./AccountRepository";
import pgp from "pg-promise";
import Account from "./Account";

export default class AccountRepositoryDatabase implements AccountRepository {

	constructor() {
	}

	async save(account: Account) {
		const connection = pgp()("postgres://postgres:123456@192.168.15.23:5432/app");
		await connection.query("insert into cccat13.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, date, is_verified, verification_code) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver, account.date, false, account.verificationCode]);
		await connection.$pool.end();
	}

	async getByEmail(email: string) {
		const connection = pgp()("postgres://postgres:123456@192.168.15.23:5432/app");
		const [accountData] = await connection.query("select * from cccat13.account where email = $1", [email]);
		await connection.$pool.end();
		if(!accountData) return;
		return Account.restore(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.is_passenger, accountData.is_driver, accountData.car_plate, accountData.verification_code, accountData.date);
	}

	async getById(accountId: string) {
		const connection = pgp()("postgres://postgres:123456@192.168.15.23:5432/app");
		const [accountData] = await connection.query("select * from cccat13.account where account_id = $1", [accountId]);
		await connection.$pool.end();
		if(!accountData) return;
		return Account.restore(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.is_passenger, accountData.is_driver, accountData.car_plate, accountData.verification_code, accountData.date);
	}
}