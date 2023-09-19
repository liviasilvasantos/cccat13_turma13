import AccountRepositoryDatabase from "../src/AccountRepositoryDatabase";
import AccountService from "../src/AccountService";
import sinon from "sinon";
import MailGateway from "../src/MailGateway";

test("Deve criar um passageiro", async function () {
	const input:any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const accountService = new AccountService();
	const output = await accountService.signup(input);
	const account = await accountService.getAccount(output.accountId);

	expect(account.account_id).toBeDefined();
	expect(account.name).toBe(input.name);
	expect(account.email).toBe(input.email);
	expect(account.cpf).toBe(input.cpf);
});

test("Não deve criar um passageiro com cpf inválido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705500",
		isPassenger: true
	}
	const accountService = new AccountService();
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Não deve criar um passageiro com nome inválido", async function () {
	const input = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const accountService = new AccountService();
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar um passageiro com email inválido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@`,
		cpf: "95818705552",
		isPassenger: true
	}
	const accountService = new AccountService();
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve criar um passageiro com conta existente", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const accountService = new AccountService();
	await accountService.signup(input)
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Account already exists"));
});

test("Deve criar um motorista", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		carPlate: "AAA9999",
		isDriver: true
	}
	const accountService = new AccountService();
	const output = await accountService.signup(input);
	expect(output.accountId).toBeDefined();
});

test("Não deve criar um motorista com place do carro inválida", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		carPlate: "AAA999",
		isDriver: true
	}
	const accountService = new AccountService();
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid plate"));
});


test("Deve criar um passageiro com stub", async function () {
	const input:any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	sinon.stub(AccountRepositoryDatabase.prototype, "save").resolves();
	sinon.stub(AccountRepositoryDatabase.prototype, "getByEmail").resolves();

	const accountService = new AccountService();
	const output = await accountService.signup(input);

	input.account_id = output.accountId;
	sinon.stub(AccountRepositoryDatabase.prototype, "getById").resolves(input);
	const account = await accountService.getAccount(output.accountId);

	expect(account.account_id).toBeDefined();
	expect(account.name).toBe(input.name);
	expect(account.email).toBe(input.email);
	expect(account.cpf).toBe(input.cpf);
});

test("Deve criar um passageiro com spy", async function () {
	const input:any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}

	const spy = sinon.spy(MailGateway.prototype, "send");
	sinon.stub(AccountRepositoryDatabase.prototype, "save").resolves();
	sinon.stub(AccountRepositoryDatabase.prototype, "getByEmail").resolves();

	const accountService = new AccountService();
	const output = await accountService.signup(input);

	input.account_id = output.accountId;
	sinon.stub(AccountRepositoryDatabase.prototype, "getById").resolves(input);
	const account = await accountService.getAccount(output.accountId);

	expect(account.account_id).toBeDefined();
	expect(account.name).toBe(input.name);
	expect(account.email).toBe(input.email);
	expect(account.cpf).toBe(input.cpf);

	expect(spy.calledOnce).toBeTruthy();
});

test("Deve criar um passageiro com mock", async function () {
	const input:any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const mock = sinon.mock(MailGateway.prototype);
	mock.expects("send").withArgs(input.email, "Verification").calledOnce;

	sinon.stub(AccountRepositoryDatabase.prototype, "save").resolves();
	sinon.stub(AccountRepositoryDatabase.prototype, "getByEmail").resolves();

	const accountService = new AccountService();
	const output = await accountService.signup(input);

	input.account_id = output.accountId;
	sinon.stub(AccountRepositoryDatabase.prototype, "getById").resolves(input);
	const account = await accountService.getAccount(output.accountId);

	expect(account.account_id).toBeDefined();
	expect(account.name).toBe(input.name);
	expect(account.email).toBe(input.email);
	expect(account.cpf).toBe(input.cpf);

	mock.verify();
});