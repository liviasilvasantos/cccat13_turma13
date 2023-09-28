import AccountRepository from "./AccountRepository";
import AccountRepositoryDatabase from "./AccountRepositoryDatabase";

export default class GetAccount {

	constructor(readonly accountRepository: AccountRepository = new AccountRepositoryDatabase()) { }

	async execute(accountId: string) {
		const account = await this.accountRepository.getById(accountId);
		return account;
	}
}
