import crypto from "crypto";

export default class Ride {
    driverId?: string;

    private constructor(readonly rideId: string,
        readonly passengerId: string,
        driverId: string,
        private status: string,
        readonly fromLat: number,
        readonly fromLong: number,
        readonly toLat: number,
        readonly toLong: number,
        readonly date: Date) {
        this.driverId = driverId;
    }

    //static factory method
    static create(passengerId: string, driverId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
        const rideId = crypto.randomUUID();
        const status = "requested";
        const date = new Date();
        return new Ride(rideId, passengerId, driverId, status, fromLat, fromLong, toLat, toLong, date);
    }

    static save(passengerId: string, driverId: string, status: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
        const rideId = crypto.randomUUID();
        const date = new Date();
        return new Ride(rideId, passengerId, driverId, status, fromLat, fromLong, toLat, toLong, date);
    }

    static restore(rideId: string, passengerId: string, driverId: string, status: string, fromLat: number, fromLong: number, toLat: number, toLong: number, date: Date) {
        return new Ride(rideId, passengerId, driverId, status, fromLat, fromLong, toLat, toLong, date);
    }

    accept(driverId: string) {
        this.driverId = driverId;
        this.status = "accepted";
    }

    getStatus() {
        return this.status;
    }
}