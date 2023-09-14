export default interface AccountRepository {
	save (account: any): Promise<void>;
	getByEmail (email: string): Promise<any>;
	getById (accountId: string): Promise<any>;
}