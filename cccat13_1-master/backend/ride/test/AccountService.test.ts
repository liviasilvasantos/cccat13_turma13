import AccountRepositoryDatabase from "../src/AccountRepositoryDatabase";
import sinon from "sinon";
import MailGateway from "../src/MailGateway";
import AccountRepositoryMemory from "../src/AccountRepositoryMemory";
import Account from "../src/Account";
import Signup from "../src/Signup";
import GetAccount from "../src/GetAccount";
import AccountRepository from "../src/AccountRepository";
import PgPromiseAdapter from "../src/PgPromiseAdapter";
import Connection from "../src/Connection";

let connection: Connection;
let accountRepository: AccountRepository;
let signup: Signup;
let getAccount: GetAccount;

beforeEach(function () {
	connection = new PgPromiseAdapter();
	accountRepository = new AccountRepositoryDatabase(connection);

	signup = new Signup(accountRepository);
	getAccount = new GetAccount(accountRepository);
})

afterEach(async function () {
	await connection.close();
})

test("Deve criar um passageiro", async function () {
	const input: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const output = await signup.execute(input);

	const account = await getAccount.execute(output.accountId);
	expect(account?.accountId).toBeDefined();
	expect(account?.name).toBe(input.name);
	expect(account?.email).toBe(input.email);
	expect(account?.cpf).toBe(input.cpf);
});

test("Não deve criar um passageiro com cpf inválido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705500",
		isPassenger: true,
		isDriver: false,
		carPlate: ""
	}
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Não deve criar um passageiro com nome inválido", async function () {
	const input = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true,
		isDriver: false,
		carPlate: ""
	}
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar um passageiro com email inválido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@`,
		cpf: "95818705552",
		isPassenger: true,
		isDriver: false,
		carPlate: ""
	}
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve criar um passageiro com conta existente", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true,
		isDriver: false,
		carPlate: ""
	}
	await signup.execute(input)
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Account already exists"));
});

test("Deve criar um motorista", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		carPlate: "AAA9999",
		isDriver: true,
		isPassenger: false
	}
	const output = await signup.execute(input);
	expect(output.accountId).toBeDefined();
});

test("Não deve criar um motorista com place do carro inválida", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		carPlate: "AAA999",
		isDriver: true,
		isPassenger: false
	}
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid plate"));
});


test("Deve criar um passageiro com stub", async function () {
	const input: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const stubSave = sinon.stub(AccountRepositoryDatabase.prototype, "save").resolves();
	const stubGetByEmail = sinon.stub(AccountRepositoryDatabase.prototype, "getByEmail").resolves();

	const output = await signup.execute(input);

	const sutbGetById = sinon.stub(AccountRepositoryDatabase.prototype, "getById").resolves(
		Account.create(input.name, input.email, input.cpf, input.isPassenger, false, ""));

	const account = await getAccount.execute(output.accountId);

	expect(account?.accountId).toBeDefined();
	expect(account?.name).toBe(input.name);
	expect(account?.email).toBe(input.email);
	expect(account?.cpf).toBe(input.cpf);

	sutbGetById.restore();
	stubGetByEmail.restore();
	stubSave.restore();
});

test("Deve criar um passageiro com spy", async function () {
	const input: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}

	const spy = sinon.spy(MailGateway.prototype, "send");
	const stubSave = sinon.stub(AccountRepositoryDatabase.prototype, "save").resolves();
	const stubGetByEmail = sinon.stub(AccountRepositoryDatabase.prototype, "getByEmail").resolves();

	const output = await signup.execute(input);

	const stubGetById = sinon.stub(AccountRepositoryDatabase.prototype, "getById").resolves(
		Account.create(input.name, input.email, input.cpf, input.isPassenger, false, "")
	);
	const account = await getAccount.execute(output.accountId);

	expect(account?.accountId).toBeDefined();
	expect(account?.name).toBe(input.name);
	expect(account?.email).toBe(input.email);
	expect(account?.cpf).toBe(input.cpf);

	expect(spy.calledOnce).toBeTruthy();

	stubGetByEmail.restore();
	stubGetById.restore();
	stubSave.restore();
	spy.restore();
});

test("Deve criar um passageiro com mock", async function () {
	const input: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const mock = sinon.mock(MailGateway.prototype);
	mock.expects("send").withArgs(input.email, "Verification").calledOnce;

	const stubSave = sinon.stub(AccountRepositoryDatabase.prototype, "save").resolves();
	const stubGetByEmail = sinon.stub(AccountRepositoryDatabase.prototype, "getByEmail").resolves();

	const output = await signup.execute(input);

	const stubGetById = sinon.stub(AccountRepositoryDatabase.prototype, "getById").resolves(
		Account.create(input.name, input.email, input.cpf, input.isPassenger, false, "")
	);
	const account = await getAccount.execute(output.accountId);

	expect(account?.accountId).toBeDefined();
	expect(account?.name).toBe(input.name);
	expect(account?.email).toBe(input.email);
	expect(account?.cpf).toBe(input.cpf);

	mock.verify();

	stubGetByEmail.restore();
	stubGetById.restore();
	stubSave.restore();
	mock.restore();
});

test("Deve criar um passageiro com fake", async function () {
	const accountRepositoryMemory = new AccountRepositoryMemory();
	const input: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const signup = new Signup(accountRepositoryMemory);
	const output = await signup.execute(input);

	const getAccount = new GetAccount(accountRepositoryMemory);
	const account = await getAccount.execute(output.accountId);

	expect(account?.accountId).toBeDefined();
	expect(account?.name).toBe(input.name);
	expect(account?.email).toBe(input.email);
	expect(account?.cpf).toBe(input.cpf);
});