import CpfValidator from "./CpfValidator";
import AccountRepository from "./AccountRepository";
import AccountRepositoryDatabase from "./AccountRepositoryDatabase";
import MailGateway from "./MailGateway";
import Account from "./Account";

export default class Signup {
	cpfValidator: CpfValidator;
	mailGateway: MailGateway;

	constructor(readonly accountRepository: AccountRepository) {
		this.cpfValidator = new CpfValidator();
		this.mailGateway = new MailGateway();
	}

	async execute(input: Input) {
		const existingAccount = await this.accountRepository.getByEmail(input.email);
		if (existingAccount) throw new Error("Account already exists");

		const account = Account.create(input.name, input.email, input.cpf, input.isPassenger, input.isDriver, input.carPlate);

		await this.accountRepository.save(account);
		await this.mailGateway.send(account.email, "Verification", `Please verify your code at first login ${account.verificationCode}`);
		return {
			accountId: account.accountId
		}
	}

}

type Input = {
	name: string,
	email: string,
	cpf: string,
	isPassenger: boolean,
	isDriver: boolean,
	carPlate: string
}