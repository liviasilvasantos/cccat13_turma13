import Account from "../../domain/Account";

export default interface RideGateway {
    signup(input: Account): Promise<any>;
}