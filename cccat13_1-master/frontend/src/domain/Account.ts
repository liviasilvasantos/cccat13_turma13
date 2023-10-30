import CpfValidator from "./CpfValidator";

export default class Account {

    constructor(readonly name: string,
        readonly email: string,
        readonly cpf: string,
        readonly carPlate: string,
        readonly isPassenger: boolean,
        readonly isDriver: boolean) {
    }

    validate() {
        const errors: string[] = [];
        if (!this.name.match(/[a-zA-Z] [a-zA-Z]+/)) errors.push("Invalid name");
        if (!this.email.match(/^(.+)@(.+)$/)) errors.push("Invalid email");

        const cpfValidator = new CpfValidator();
        if (!cpfValidator.validate(this.cpf)) errors.push("Invalid cpf");

        if (this.isDriver && !this.carPlate.match(/[A-Z]{3}[0-9]{4}/)) errors.push("Invalid plate");
        return errors;
    }
}