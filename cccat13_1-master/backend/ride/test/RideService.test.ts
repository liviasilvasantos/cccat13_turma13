import RideService from "../src/RideService";
import AccountService from "../src/AccountService";

const createAccount = async function (isPassenger: boolean, isDriver: boolean = false) {
	const inputAccount = {
		name: "Sarah Doe",
		email: `sarah.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: isPassenger,
		isDriver: isDriver
	}
	const accountService = new AccountService();
	const output = await accountService.signup(inputAccount);
	const account = await accountService.getAccount(output.accountId);
	return account;
}

test("Deve solicitar uma corrida com status requested", async function () {
	const account = await createAccount(true);

	const input = {
		passengerId: account.account_id,
		from: {
			lat: -22.818439,
			lng: -47.064721
		},
		to: {
			lat: -22.847566,
			lng: -47.063104
		}
	}
	const rideService = new RideService();
	const output = await rideService.requestRide(input);

	const ride = await rideService.getRide(output.rideId);
	expect(ride.status).toBe("requested");
	expect(ride.passenger_id).toBe(input.passengerId);
	expect(ride.from_lat).toBe(input.from.lat.toString());
	expect(ride.from_lng).toBe(input.from.lng.toString());
	expect(ride.to_lat).toBe(input.to.lat.toString());
	expect(ride.to_lng).toBe(input.to.lng.toString());
});

test("Não deve solicitar uma corrida quando a conta não for de um passageiro", async function () {
	const account = await createAccount(false);

	const input = {
		passengerId: account.account_id,
		from: {
			lat: -22.818439,
			lng: -47.064721,
		},
		to: {
			lat: -22.847566,
			lng: -47.063104
		}
	}
	const rideService = new RideService();
	await expect(() => rideService.requestRide(input)).rejects.toThrow(new Error("account is not passenger"));
});

test("Não deve solicitar uma corrida quando já existir uma corrida para o passageiro", async function () {
	const account = await createAccount(true);

	const input = {
		passengerId: account.account_id,
		from: {
			lat: -22.818439,
			lng: -47.064721,
		},
		to: {
			lat: -22.847566,
			lng: -47.063104
		}
	}
	const rideService = new RideService();
	await rideService.requestRide(input);

	const exists = await rideService.existsActiveRidesByPassengerId(input.passengerId);
	expect(exists).toBe(true);

	await expect(() => rideService.requestRide(input)).rejects.toThrow(new Error(`already exist open ride for passenger id ${input.passengerId}`));
});

test("Não deve aceitar uma corrida quando a conta não for de um motorista", async function () {
	const account = await createAccount(false);

	const rideService = new RideService();
	await expect(() => rideService.acceptRide(account.account_id)).rejects.toThrow(new Error("account is not driver"));
});