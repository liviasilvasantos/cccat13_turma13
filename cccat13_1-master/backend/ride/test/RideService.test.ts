import RideService from "../src/RideService";
import AccountService from "../src/AccountService";
import crypto from "crypto";

const createAccount = async function (isPassenger: boolean) {
	const inputAccount = {
		name: "Sarah Doe",
		email: `sarah.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: isPassenger,
		isDriver: !isPassenger,
		carPlate: "AAA9999"
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
	const passenger = await createAccount(true);
	
	const rideService = new RideService();
	const input = {
		driverId: passenger.account_id,
		rideId: crypto.randomUUID
	}
	await expect(() => rideService.acceptRide(input)).rejects.toThrow(new Error("account is not driver"));
});

test("Não deve aceitar uma corrida se o status não é requested", async function () {
	const driver = await createAccount(false);
	const passenger = await createAccount(true);

	const input = {
		passengerId: passenger.account_id,
		driverId: driver.account_id,
		from: {
			lat: -22.818439,
			lng: -47.064721,
		},
		to: {
			lat: -22.847566,
			lng: -47.063104
		},
		status: "completed"
	}
	const rideService = new RideService();
	const output = await rideService.saveRide(input);

	const inputAccept = {
		driverId: driver.account_id,
		rideId: output.rideId
	}
	await expect(() => rideService.acceptRide(inputAccept)).rejects.toThrow(new Error("ride is not requested"));
});


test("Não deve aceitar uma corrida se motorista tiver outra corrida ativa", async function () {
	const driver = await createAccount(false);
	const passenger = await createAccount(true);
	const rideService = new RideService();

	const inputActiveRide = {
		passengerId: passenger.account_id,
		driverId: driver.account_id,
		from: {
			lat: -22.818439,
			lng: -47.064721,
		},
		to: {
			lat: -22.847566,
			lng: -47.063104
		},
		status: "in_progress"
	}
	await rideService.saveRide(inputActiveRide);

	const input = {
		passengerId: passenger.account_id,
		driverId: driver.account_id,
		from: {
			lat: -22.818439,
			lng: -47.064721,
		},
		to: {
			lat: -22.847566,
			lng: -47.063104
		},
		status: "requested"
	}
	
	const output = await rideService.saveRide(input);

	const inputAccept = {
		driverId: driver.account_id,
		rideId: output.rideId
	}
	await expect(() => rideService.acceptRide(inputAccept)).rejects.toThrow(new Error("active ride already exists"));
});

test("Deve alterar status quando corrida é aceita", async function () {
	const driver = await createAccount(false);
	const passenger = await createAccount(true);
	const rideService = new RideService();

	const input = {
		passengerId: passenger.account_id,
		driverId: driver.account_id,
		from: {
			lat: -22.818439,
			lng: -47.064721,
		},
		to: {
			lat: -22.847566,
			lng: -47.063104
		},
		status: "requested"
	}
	
	const output = await rideService.saveRide(input);

	const inputAccept = {
		driverId: driver.account_id,
		rideId: output.rideId
	}
	await rideService.acceptRide(inputAccept);

	const ride = await rideService.getRide(output.rideId);
	expect(ride.status).toBe("accepted");
	expect(ride.driver_id).toBe(driver.account_id);
});

test.only("Deve iniciar uma corrida", async function () {
	const driver = await createAccount(false);
	const passenger = await createAccount(true);

	const rideService = new RideService();
	const input = {
		passengerId: passenger.account_id,
		driverId: driver.account_id,
		from: {
			lat: -22.818439,
			lng: -47.064721,
		},
		to: {
			lat: -22.847566,
			lng: -47.063104
		},
		status: "accepted"
	}
	
	const output = await rideService.saveRide(input);

	await rideService.startRide(output.rideId);

	const ride = await rideService.getRide(output.rideId);
	expect(ride.status).toBe("in_progress");

});

test.only("Deve iniciar uma corrida", async function () {
	const driver = await createAccount(false);
	const passenger = await createAccount(true);

	const rideService = new RideService();
	const input = {
		passengerId: passenger.account_id,
		driverId: driver.account_id,
		from: {
			lat: -22.818439,
			lng: -47.064721,
		},
		to: {
			lat: -22.847566,
			lng: -47.063104
		},
		status: "requested"
	}
	
	const output = await rideService.saveRide(input);

	await expect(() => rideService.startRide(output.rideId)).rejects.toThrow(new Error("Ride is not accepted"));

});