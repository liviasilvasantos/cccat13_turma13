import RideService from "../src/RideService";
import AccountService from "../src/AccountService";
import crypto from "crypto";
import Ride from "../src/Ride";

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
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104
	}
	const rideService = new RideService();
	const output = await rideService.requestRide(input);

	const ride = await rideService.getRide(output.rideId);
	expect(ride.getStatus()).toBe("requested");
	expect(ride.passengerId).toBe(input.passengerId);
	expect(ride.fromLat).toBe(input.fromLat.toString());
	expect(ride.fromLong).toBe(input.fromLong.toString());
	expect(ride.toLat).toBe(input.toLat.toString());
	expect(ride.toLong).toBe(input.toLong.toString());
});

test("Não deve solicitar uma corrida quando a conta não for de um passageiro", async function () {
	const account = await createAccount(false);

	const input = {
		passengerId: account.account_id,
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104
	}
	const rideService = new RideService();
	await expect(() => rideService.requestRide(input)).rejects.toThrow(new Error("account is not passenger"));
});

test("Não deve solicitar uma corrida quando já existir uma corrida para o passageiro", async function () {
	const account = await createAccount(true);

	const input = {
		passengerId: account.account_id,
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104
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
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104,
		status: "completed"
	}
	const rideService = new RideService();
	const ride = Ride.save(input.passengerId, input.driverId, "completed", input.fromLat, input.fromLong,
		input.toLat, input.toLong);
	const output = await rideService.saveRide(ride);

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
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104,
		status: "in_progress"
	}
	const rideActive = Ride.save(inputActiveRide.passengerId, inputActiveRide.driverId, "in_progress",
		inputActiveRide.fromLat, inputActiveRide.fromLong,
		inputActiveRide.toLat, inputActiveRide.toLong);
	await rideService.saveRide(rideActive);

	const input = {
		passengerId: passenger.account_id,
		driverId: driver.account_id,
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104,
		status: "requested"
	}

	const ride = Ride.create(input.passengerId, input.driverId, input.fromLat, input.fromLong,
		input.toLat, input.toLong);
	const output = await rideService.saveRide(ride);

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
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104,
		status: "requested"
	}

	const rideRequested = Ride.create(input.passengerId, input.driverId, input.fromLat, input.fromLong,
		input.toLat, input.toLong);
	const output = await rideService.saveRide(rideRequested);

	const inputAccept = {
		driverId: driver.account_id,
		rideId: output.rideId
	}
	await rideService.acceptRide(inputAccept);

	const ride = await rideService.getRide(output.rideId);
	expect(ride.getStatus()).toBe("accepted");
	expect(ride.driverId).toBe(driver.account_id);
});

test("Deve iniciar uma corrida", async function () {
	const driver = await createAccount(false);
	const passenger = await createAccount(true);

	const rideService = new RideService();
	const input = {
		passengerId: passenger.account_id,
		driverId: driver.account_id,
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104,
		status: "accepted"
	}

	const rideAccepted = Ride.save(input.passengerId, input.driverId, "accepted", input.fromLat, input.fromLong,
		input.toLat, input.toLong);
	const output = await rideService.saveRide(rideAccepted);

	await rideService.startRide(output.rideId);

	const ride = await rideService.getRide(output.rideId);
	expect(ride.getStatus()).toBe("in_progress");

});

test("Deve falhar ao iniciar uma corrida que não está aceita", async function () {
	const driver = await createAccount(false);
	const passenger = await createAccount(true);

	const rideService = new RideService();
	const input = {
		passengerId: passenger.account_id,
		driverId: driver.account_id,
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104,
		status: "requested"
	}

	const ride = Ride.create(input.passengerId, input.driverId, input.fromLat, input.fromLong,
		input.toLat, input.toLong);
	const output = await rideService.saveRide(ride);

	await expect(() => rideService.startRide(output.rideId)).rejects.toThrow(new Error("Ride is not accepted"));

});

test("Deve atualizar a posição da corrida", async function () {
	const driver = await createAccount(false);
	const passenger = await createAccount(true);

	const rideService = new RideService();
	const input = {
		passengerId: passenger.account_id,
		driverId: driver.account_id,
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104,
		status: "in_progress"
	}

	const ride = Ride.save(input.passengerId, input.driverId, "in_progress", input.fromLat, input.fromLong,
		input.toLat, input.toLong);
	const output = await rideService.saveRide(ride);

	const position = {
		rideId: output.rideId,
		lat: -11.818439,
		lng: -37.064721,
	}
	const outputPosition = await rideService.updatePosition(position);
	expect(outputPosition.positionId).toBeDefined();
});

test("Não deve atualizar posição se a corrida não estiver em andamento", async function () {
	const driver = await createAccount(false);
	const passenger = await createAccount(true);

	const rideService = new RideService();
	const input = {
		passengerId: passenger.account_id,
		driverId: driver.account_id,
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104,
		status: "accepcted"
	}

	const ride = Ride.save(input.passengerId, input.driverId, "accepcted", input.fromLat, input.fromLong,
		input.toLat, input.toLong);
	const output = await rideService.saveRide(ride);

	const position = {
		rideId: output.rideId,
		lat: -11.818439,
		lng: -37.064721,
	}

	await expect(() => rideService.updatePosition(position)).rejects.toThrow(new Error("Ride is not in progress"));
});

test("Deve finalizar corrida", async function () {
	const driver = await createAccount(false);
	const passenger = await createAccount(true);

	const rideService = new RideService();
	const input = {
		passengerId: passenger.account_id,
		driverId: driver.account_id,
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104,
		status: "in_progress"
	}

	const ride = Ride.save(input.passengerId, input.driverId, "in_progress", input.fromLat, input.fromLong,
		input.toLat, input.toLong);
	const output = await rideService.saveRide(ride);

	await rideService.finishRide(output.rideId);

	const outputRide = await rideService.getRide(output.rideId);
	expect(outputRide.getStatus()).toBe("completed");
});

test("Não deve finalizar corrida se não estiver em andamento", async function () {
	const driver = await createAccount(false);
	const passenger = await createAccount(true);

	const rideService = new RideService();
	const input = {
		passengerId: passenger.account_id,
		driverId: driver.account_id,
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104,
		status: "accepcted"
	}

	const ride = Ride.save(input.passengerId, input.driverId, "accepcted", input.fromLat, input.fromLong,
		input.toLat, input.toLong);
	const output = await rideService.saveRide(ride);

	await expect(() => rideService.finishRide(output.rideId)).rejects.toThrow(new Error("Ride is not in progress"));
})