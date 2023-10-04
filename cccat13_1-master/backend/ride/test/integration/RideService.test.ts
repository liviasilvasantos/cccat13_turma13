import crypto from "crypto";
import Ride from "../../src/domain/Ride";
import RequestRide from "../../src/application/usecase/RequestRide";
import GetRide from "../../src/application/usecase/GetRide";
import AcceptRide from "../../src/application/usecase/AcceptRide";
import Signup from "../../src/application/usecase/Signup";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import AccountRepository from "../../src/application/repository/AccountRepository";
import Connection from "../../src/infra/database/Connection";
import AccountRepositoryDatabase from "../../src/infra/repository/AccountRepositoryDatabase";
import RideRepository from "../../src/application/repository/RideRepository";
import PositionRepository from "../../src/application/repository/PositionRepository";
import RideRepositoryDatabase from "../../src/infra/repository/RideRepositoryDatabase";
import PositionRepositoryDatabase from "../../src/infra/repository/PositionRepositoryDatabase";
import SaveRide from "../../src/application/usecase/SaveRide";
import StartRide from "../../src/application/usecase/StartRide";
import UpdatePosition from "../../src/application/usecase/UpdatePosition";
import FinishRide from "../../src/application/usecase/FinishRide";

let connection: Connection;
let accountRepository: AccountRepository;
let rideRepository: RideRepository;
let positionRepository: PositionRepository;
let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let saveRide: SaveRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
let finishRide: FinishRide;

beforeEach(function () {
	connection = new PgPromiseAdapter();
	accountRepository = new AccountRepositoryDatabase(connection);
	rideRepository = new RideRepositoryDatabase(connection);
	positionRepository = new PositionRepositoryDatabase(connection)

	signup = new Signup(accountRepository);
	requestRide = new RequestRide(rideRepository, accountRepository);
	getRide = new GetRide(rideRepository);
	acceptRide = new AcceptRide(rideRepository, accountRepository);
	saveRide = new SaveRide(rideRepository);
	startRide = new StartRide(rideRepository);
	updatePosition = new UpdatePosition(rideRepository, positionRepository);
	finishRide = new FinishRide(rideRepository);
});

afterEach(async function () {
	await connection.close();
})

const createAccount = async function (isPassenger: boolean) {
	const inputAccount = {
		name: "Sarah Doe",
		email: `sarah.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: isPassenger,
		isDriver: !isPassenger,
		carPlate: "AAA9999"
	}

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
	const output = await requestRide.execute(input);

	//then
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
	await requestRide.execute(input);

	const exists = await rideRepository.existsActiveRidesByPassengerId(input.passengerId);
	expect(exists).toBe(true);

	await expect(() => requestRide.execute(input)).rejects.toThrow(new Error(`already exist open ride for passenger id ${input.passengerId}`));
});

test("Não deve aceitar uma corrida quando a conta não for de um motorista", async function () {
	const passenger = await createAccount(true);
	const input = {
		driverId: passenger?.accountId,
		rideId: crypto.randomUUID
	}

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

	const ride = Ride.save(input.passengerId, input.driverId, "completed", input.fromLat, input.fromLong,
		input.toLat, input.toLong);
	const output = await saveRide.execute(ride);

	const inputAccept = {
		driverId: driver?.accountId,
		rideId: output.rideId
	}
	await expect(() => acceptRide.execute(inputAccept)).rejects.toThrow(new Error("ride is not requested"));
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
	const output = await saveRide.execute(rideRequested);

	const inputAccept = {
		driverId: driver?.accountId,
		rideId: output.rideId
	}
	await acceptRide.execute(inputAccept);

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
	const output = await saveRide.execute(rideAccepted);

	await startRide.execute(output.rideId);

	const ride = await getRide.execute(output.rideId);
	expect(ride.getStatus()).toBe("in_progress");
});

test("Deve falhar ao iniciar uma corrida que não está aceita", async function () {
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

	const ride = Ride.save(input.passengerId, input.driverId, input.status, input.fromLat, input.fromLong,
		input.toLat, input.toLong);
	const output = await saveRide.execute(ride);

	await expect(() => startRide.execute(output.rideId)).rejects.toThrow(new Error("Ride is not accepted"));

});

test("Deve atualizar a posição da corrida", async function () {
	const driver = await createAccount(false);
	const passenger = await createAccount(true);

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
	const output = await saveRide.execute(ride);

	const position = {
		rideId: output.rideId,
		lat: -11.818439,
		lng: -37.064721,
	}
	const outputPosition = await updatePosition.execute(position);
	expect(outputPosition.positionId).toBeDefined();
});

test("Não deve atualizar posição se a corrida não estiver em andamento", async function () {
	const driver = await createAccount(false);
	const passenger = await createAccount(true);

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
	const output = await saveRide.execute(ride);

	const position = {
		rideId: output.rideId,
		lat: -11.818439,
		lng: -37.064721,
	}

	await expect(() => updatePosition.execute(position)).rejects.toThrow(new Error("Ride is not in progress"));
});

test("Deve finalizar corrida", async function () {
	const driver = await createAccount(false);
	const passenger = await createAccount(true);

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
	const output = await saveRide.execute(ride);

	await finishRide.execute(output.rideId);

	const outputRide = await getRide.execute(output.rideId);
	expect(outputRide.getStatus()).toBe("completed");
});

test("Não deve finalizar corrida se não estiver em andamento", async function () {
	const driver = await createAccount(false);
	const passenger = await createAccount(true);

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
	const output = await saveRide.execute(ride);

	await expect(() => finishRide.execute(output.rideId)).rejects.toThrow(new Error("Ride is not in progress"));
});