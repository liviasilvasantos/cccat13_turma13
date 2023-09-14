import AccountService from "./AccountService";
import crypto from "crypto";
import pgp from "pg-promise";
import RideRepository from "./RideRepository";
import RideRepositoryDatabase from "./RideRepositoryDatabase";

export default class RideService {
    rideRepository: RideRepository;
    accountService: AccountService;

    constructor() {
        this.rideRepository = new RideRepositoryDatabase();
        this.accountService = new AccountService();
    }

    async acceptRide(driver_id: string) {
        const account = await this.accountService.getAccount(driver_id);

        // deve verificar se o account_id tem is_driver true
        if (!account.is_driver) {
            throw new Error("account is not driver");
        }

        // * deve verificar se o status da corrida é "requested", se não for, lançar um erro
        // * deve verificar se o motorista já tem outra corrida com status "accepted" ou "in_progress", se tiver lançar um erro
        // * deve associar o driver_id na corrida
        // * deve mudar o status para "accepted"

        return;
    }

    async requestRide(input: any) {
        const account = await this.accountService.getAccount(input.passengerId);

        if (!account.is_passenger) {
            throw new Error("account is not passenger");
        }

        const existOpenRides = await this.rideRepository.existsActiveRidesByPassengerId(input.passengerId);
        if (existOpenRides) {
            throw new Error(`already exist open ride for passenger id ${input.passengerId}`);
        }

        const rideId = crypto.randomUUID();

        input.rideId = rideId;
        input.status = "requested";
        input.date = new Date();
        await this.rideRepository.save(input);
        return { rideId };
    }

    async existsActiveRidesByPassengerId(passengerId: string) {
        return this.rideRepository.existsActiveRidesByPassengerId(passengerId);
    }

    async getRide(rideId: string) {
        return this.rideRepository.getById(rideId);
    }

}