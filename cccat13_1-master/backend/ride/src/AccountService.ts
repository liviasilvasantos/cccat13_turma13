import crypto from "crypto";
import CpfValidator from "./CpfValidator";
import AccountRepository from "./AccountRepository";
import AccountRepositoryDatabase from "./AccountRepositoryDatabase";
import MailGateway from "./MailGateway";

export default class AccountService {
	cpfValidator: CpfValidator;
	accountRepository: AccountRepository;
	mailGateway: MailGateway;

	constructor() {
		this.cpfValidator = new CpfValidator();
		this.accountRepository = new AccountRepositoryDatabase();
		this.mailGateway = new MailGateway();
	}

	async signup(input: any) {
		const accountId = crypto.randomUUID();
		const verificationCode = crypto.randomUUID();
		const date = new Date();
		
		const existingAccount = await this.accountRepository.getByEmail(input.email);
		if (existingAccount) throw new Error("Account already exists");
		
		if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name");
		if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email");
		if (!this.cpfValidator.validate(input.cpf)) throw new Error("Invalid cpf");
		if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid plate");

		const account = {
			name: input.name,
			email: input.email,
			cpf: input.cpf,
			verificationCode: verificationCode,
			accountId: accountId,
			date: date,
			isDriver: input.isDriver,
			isPassenger: input.isPassenger,
			carPlate: input.carPlate
		}
		await this.accountRepository.save(account);

		await this.mailGateway.sendEmail(input.email, "Verification", `Please verify your code at first login ${verificationCode}`);
		return {
			accountId
		}
	}

	async getAccount(accountId: string) {
		const account = await this.accountRepository.getById(accountId);
		return account;
	}
}
