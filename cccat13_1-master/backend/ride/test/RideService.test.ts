import RideService from "../src/RideService";
import crypto from "crypto";
import Ride from "../src/Ride";
import RequestRide from "../src/RequestRide";
import GetRide from "../src/GetRide";
import AcceptRide from "../src/AcceptRide";
import Signup from "../src/Signup";
import VerifyExistsActiveRidesByPassengerId from "../src/VerifyExistsActiveRidesByPassengerId";
import SaveRide from "../src/SaveRide";
import StartRide from "../src/StartRide";

const createAccount = async function (isPassenger: boolean) {
	const inputAccount = {
		name: "Sarah Doe",
		email: `sarah.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: isPassenger,
		isDriver: !isPassenger,
		carPlate: "AAA9999"
	}

	const signup = new Signup();
	const output = await signup.execute(inputAccount);
	return output
}

test("Deve solicitar uma corrida com status requested", async function () {
	//given
	const account = await createAccount(true);

	const input = {
		passengerId: account.accountId,
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104
	}

	//when
	const requestRide = new RequestRide();
	const output = await requestRide.execute(input);

	//then
	const getRide = new GetRide();
	const ride = await getRide.execute(output.rideId);
	expect(ride.getStatus()).toBe("requested");
	expect(ride.passengerId).toBe(input.passengerId);
	expect(ride.fromLat).toBe(input.fromLat);
	expect(ride.fromLong).toBe(input.fromLong);
	expect(ride.toLat).toBe(input.toLat);
	expect(ride.toLong).toBe(input.toLong);
});

test("Não deve solicitar uma corrida quando o passageiro é inválido", async function () {
	//given
	const requestRide = new RequestRide();
	const input = {
		passengerId: "conta invalida qualquer",
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104
	}

	//when
	//then
	await expect(() => requestRide.execute(input)).rejects.toThrow(new Error("account does not exists"));
})

test("Não deve solicitar uma corrida quando a conta não for de um passageiro", async function () {
	const account = await createAccount(false);

	const input = {
		passengerId: account.accountId,
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104
	}
	const requestRide = new RequestRide();
	await expect(() => requestRide.execute(input)).rejects.toThrow(new Error("account is not passenger"));
});

test("Não deve solicitar uma corrida quando já existir uma corrida para o passageiro", async function () {
	const account = await createAccount(true);

	const input = {
		passengerId: account.accountId,
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104
	}
	const requestRide = new RequestRide();
	await requestRide.execute(input);

	const verifyExistsActiveRidesByPassengerId = new VerifyExistsActiveRidesByPassengerId();
	const exists = await verifyExistsActiveRidesByPassengerId.execute(input.passengerId);
	expect(exists).toBe(true);

	await expect(() => requestRide.execute(input)).rejects.toThrow(new Error(`already exist open ride for passenger id ${input.passengerId}`));
});

test("Não deve aceitar uma corrida quando a conta não for de um motorista", async function () {
	const passenger = await createAccount(true);
	const input = {
		driverId: passenger?.accountId,
		rideId: crypto.randomUUID
	}

	const acceptRide = new AcceptRide();
	await expect(() => acceptRide.execute(input)).rejects.toThrow(new Error("account is not driver"));
});

test("Não deve aceitar uma corrida se o status não é requested", async function () {
	const driver = await createAccount(false);
	const passenger = await createAccount(true);

	const input = {
		passengerId: passenger?.accountId,
		driverId: driver?.accountId,
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
		driverId: driver?.accountId,
		rideId: output.rideId
	}
	await expect(() => rideService.acceptRide(inputAccept)).rejects.toThrow(new Error("ride is not requested"));
});


test("Não deve aceitar uma corrida se motorista tiver outra corrida ativa", async function () {
	const driver = await createAccount(false);
	const passenger = await createAccount(true);

	const inputActiveRide = {
		passengerId: passenger?.accountId,
		driverId: driver?.accountId,
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104,
		status: "in_progress"
	}
	const rideActive = Ride.save(inputActiveRide.passengerId, inputActiveRide.driverId, "in_progress",
		inputActiveRide.fromLat, inputActiveRide.fromLong,
		inputActiveRide.toLat, inputActiveRide.toLong);
	const saveRide = new SaveRide();
	await saveRide.execute(rideActive);

	const input = {
		passengerId: passenger?.accountId,
		driverId: driver?.accountId,
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104,
		status: "requested"
	}

	const ride = Ride.save(input.passengerId, input.driverId, input.status, input.fromLat, input.fromLong,
		input.toLat, input.toLong);
	const output = await saveRide.execute(ride);

	const inputAccept = {
		driverId: driver?.accountId,
		rideId: output.rideId
	}
	const acceptRide = new AcceptRide();
	await expect(() => acceptRide.execute(inputAccept)).rejects.toThrow(new Error("active ride already exists"));
});

test("Deve alterar status quando corrida é aceita", async function () {
	const driver = await createAccount(false);
	const passenger = await createAccount(true);

	const input = {
		passengerId: passenger?.accountId,
		driverId: driver?.accountId,
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104,
		status: "requested"
	}

	const rideRequested = Ride.save(input.passengerId, input.driverId, input.status, input.fromLat, input.fromLong,
		input.toLat, input.toLong);
	const saveRide = new SaveRide();
	const output = await saveRide.execute(rideRequested);

	const inputAccept = {
		driverId: driver?.accountId,
		rideId: output.rideId
	}
	const acceptRide = new AcceptRide();
	await acceptRide.execute(inputAccept);

	const getRide = new GetRide();
	const ride = await getRide.execute(output.rideId);
	expect(ride.getStatus()).toBe("accepted");
	expect(ride.getDriverId()).toBe(driver?.accountId);
});

test("Deve iniciar uma corrida", async function () {
	const driver = await createAccount(false);
	const passenger = await createAccount(true);

	const input = {
		passengerId: passenger?.accountId,
		driverId: driver?.accountId,
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104,
		status: "accepted"
	}

	const rideAccepted = Ride.save(input.passengerId, input.driverId, input.status, input.fromLat, input.fromLong,
		input.toLat, input.toLong);
	const saveRide = new SaveRide();
	const output = await saveRide.execute(rideAccepted);

	const startRide = new StartRide();
	await startRide.execute(output.rideId);

	const getRide = new GetRide();
	const ride = await getRide.execute(output.rideId);
	expect(ride.getStatus()).toBe("in_progress");

});

test("Deve falhar ao iniciar uma corrida que não está aceita", async function () {
	const driver = await createAccount(false);
	const passenger = await createAccount(true);

	const rideService = new RideService();
	const input = {
		passengerId: passenger?.accountId,
		driverId: driver?.accountId,
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104,
		status: "requested"
	}

	const ride = Ride.save(input.passengerId, input.driverId, input.status, input.fromLat, input.fromLong,
		input.toLat, input.toLong);
	const output = await rideService.saveRide(ride);

	await expect(() => rideService.startRide(output.rideId)).rejects.toThrow(new Error("Ride is not accepted"));

});

test("Deve atualizar a posição da corrida", async function () {
	const driver = await createAccount(false);
	const passenger = await createAccount(true);

	const rideService = new RideService();
	const input = {
		passengerId: passenger?.accountId,
		driverId: driver?.accountId,
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104,
		status: "in_progress"
	}

	const ride = Ride.save(input.passengerId, input.driverId, input.status, input.fromLat, input.fromLong,
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
		passengerId: passenger?.accountId,
		driverId: driver?.accountId,
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104,
		status: "accepcted"
	}

	const ride = Ride.save(input.passengerId, input.driverId, input.status, input.fromLat, input.fromLong,
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
		passengerId: passenger?.accountId,
		driverId: driver?.accountId,
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104,
		status: "in_progress"
	}

	const ride = Ride.save(input.passengerId, input.driverId, input.status, input.fromLat, input.fromLong,
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
		passengerId: passenger?.accountId,
		driverId: driver?.accountId,
		fromLat: -22.818439,
		fromLong: -47.064721,
		toLat: -22.847566,
		toLong: -47.063104,
		status: "accepcted"
	}

	const ride = Ride.save(input.passengerId, input.driverId, input.status, input.fromLat, input.fromLong,
		input.toLat, input.toLong);
	const output = await rideService.saveRide(ride);

	await expect(() => rideService.finishRide(output.rideId)).rejects.toThrow(new Error("Ride is not in progress"));
})