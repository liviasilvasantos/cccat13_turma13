import AccountRepository from "../repository/AccountRepository";
import AccountRepositoryDatabase from "../../infra/repository/AccountRepositoryDatabase";

export default class GetAccount {

	constructor(readonly accountRepository: AccountRepository) { }

	async execute(accountId: string) {
		const account = await this.accountRepository.getById(accountId);
		return account;
	}
}
