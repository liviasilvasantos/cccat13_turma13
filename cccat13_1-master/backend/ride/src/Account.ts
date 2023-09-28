import crypto from "crypto";
import CpfValidator from "./CpfValidator";

export default class Account {
    constructor(readonly accountId: string,
        readonly name: string,
        readonly email: string,
        readonly cpf: string,
        readonly isPassenger: boolean,
        readonly isDriver: boolean,
        readonly carPlate: string,
        readonly verificationCode: string,
        readonly date: Date) {

    }

    static create(name: string, email: string, cpf: string, isPassenger: boolean, isDriver: boolean, carPlate: string) {
        if (!name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name");
        if (!email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email");

        const cpfValidator = new CpfValidator();
        if (!cpfValidator.validate(cpf)) throw new Error("Invalid cpf");

        if (isDriver && !carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid plate");

        const accountId = crypto.randomUUID();
        const verificationCode = crypto.randomUUID();
        const date = new Date();
        return new Account(accountId, name, email, cpf, isPassenger, isDriver, carPlate, verificationCode, date);
    }

    static restore(accountId: string, name: string, email: string, cpf: string, isPassenger: boolean, isDriver: boolean, carPlate: string, verificationCode: string, date: Date) {
        return new Account(accountId, name, email, cpf, isPassenger, isDriver, carPlate, verificationCode, date);
    }
}