import RideService from "../src/RideService";
import AccountService from "../src/AccountService";

// test("Deve solicitar uma corrida", async function () {
// 	const input = {
// 		name: "John Doe",
// 		email: `john.doe${Math.random()}@gmail.com`,
// 		cpf: "95818705552",
// 		isPassenger: true
// 	}
// 	const accountService = new AccountService();
// 	const output = await accountService.signup(input);
// 	const account = await accountService.getAccount(output.accountId);
// 	console.log(account);
// 	expect(account.account_id).toBeDefined();
// 	expect(account.name).toBe(input.name);
// 	expect(account.email).toBe(input.email);
// 	expect(account.cpf).toBe(input.cpf);
// });

test("Não deve solicitar uma corrida quando a conta não for de um passageiro", async function () {
	const inputAccount = {
		name: "Sarah Doe",
		email: `sarah.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: false
	}
	const accountService = new AccountService();
	const output = await accountService.signup(inputAccount);
	const account = await accountService.getAccount(output.accountId);
	
	const input = {
		passengerId: account.account_id,
		from_lat: -22.818439,
		from_lng: -47.064721,
		to_lat: -22.847566,
		to_lng: -47.063104
	}
	const rideService = new RideService();
	await expect(() => rideService.requestRide(input)).rejects.toThrow(new Error("account is not passenger"));
});

test("Não deve solicitar uma corrida quando já existir uma corrida para o passageiro", async function () {
	const inputAccount = {
		name: "Sarah Doe",
		email: `sarah.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const accountService = new AccountService();
	const output = await accountService.signup(inputAccount);
	const account = await accountService.getAccount(output.accountId);
	
	const input = {
		passengerId: account.account_id,
		from_lat: -22.818439,
		from_lng: -47.064721,
		to_lat: -22.847566,
		to_lng: -47.063104
	}
	const rideService = new RideService();
	const ride = await rideService.requestRide(input);

	const exists = await rideService.existOpenRides(input.passengerId);
	expect(exists).toBe(true);

	await expect(() => rideService.requestRide(input)).rejects.toThrow(new Error(`already exist open ride for passenger id ${input.passengerId}`));
});

// test("Não deve criar um passageiro com nome inválido", async function () {
// 	const input = {
// 		name: "John",
// 		email: `john.doe${Math.random()}@gmail.com`,
// 		cpf: "95818705552",
// 		isPassenger: true
// 	}
// 	const accountService = new AccountService();
// 	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid name"));
// });

// test("Não deve criar um passageiro com email inválido", async function () {
// 	const input = {
// 		name: "John Doe",
// 		email: `john.doe${Math.random()}@`,
// 		cpf: "95818705552",
// 		isPassenger: true
// 	}
// 	const accountService = new AccountService();
// 	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid email"));
// });

// test("Não deve criar um passageiro com conta existente", async function () {
// 	const input = {
// 		name: "John Doe",
// 		email: `john.doe${Math.random()}@gmail.com`,
// 		cpf: "95818705552",
// 		isPassenger: true
// 	}
// 	const accountService = new AccountService();
// 	await accountService.signup(input)
// 	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Account already exists"));
// });

// test("Deve criar um motorista", async function () {
// 	const input = {
// 		name: "John Doe",
// 		email: `john.doe${Math.random()}@gmail.com`,
// 		cpf: "95818705552",
// 		carPlate: "AAA9999",
// 		isDriver: true
// 	}
// 	const accountService = new AccountService();
// 	const output = await accountService.signup(input);
// 	expect(output.accountId).toBeDefined();
// });

// test("Não deve criar um motorista com place do carro inválida", async function () {
// 	const input = {
// 		name: "John Doe",
// 		email: `john.doe${Math.random()}@gmail.com`,
// 		cpf: "95818705552",
// 		carPlate: "AAA999",
// 		isDriver: true
// 	}
// 	const accountService = new AccountService();
// 	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid plate"));
// });
