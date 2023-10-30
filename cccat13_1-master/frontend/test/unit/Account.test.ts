import Account from "../../src/domain/Account";


test("deve validar uma account", () => {
    const account = new Account("", "", "", "", false, false);
    expect(account.validate().join(", ")).toBe("Invalid name, Invalid email, Invalid cpf");
});