export default class MailGateway {
    constructor() { }

    async send(email: string, subject: string, message: string) {
        console.log(`sending mail for [${email}] with subject [${subject}] and message [${message}]`);
    }
}