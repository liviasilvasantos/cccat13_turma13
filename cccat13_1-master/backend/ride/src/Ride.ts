import crypto from "crypto";

export default class Ride {

    private constructor(readonly rideId: string,
        readonly passengerId: string,
        private status: string,
        readonly fromLat: number,
        readonly fromLong: number,
        readonly toLat: number,
        readonly toLong: number,
        readonly date: Date,
        private driverId?: string,
        private distance?: number,
        private fare?: number
        ) {
    }

    //static factory method
    static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
        const rideId = crypto.randomUUID();
        const status = "requested";
        const date = new Date();
        return new Ride(rideId, passengerId, status, fromLat, fromLong, toLat, toLong, date);
    }

    static save(passengerId: string, driverId: string, status: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
        const rideId = crypto.randomUUID();
        const date = new Date();
        return new Ride(rideId, passengerId, status, fromLat, fromLong, toLat, toLong, date, driverId, undefined, undefined);
    }

    static restore(rideId: string, passengerId: string, driverId: string, status: string, fromLat: number, fromLong: number, toLat: number, toLong: number, date: Date) {
        return new Ride(rideId, passengerId, status, fromLat, fromLong, toLat, toLong, date, driverId, undefined, undefined);
    }

    accept(driverId: string) {
        if (this.status !== "requested") { throw new Error("ride is not requested"); }
        this.driverId = driverId;
        this.status = "accepted";
    }

    start() {
        this.status = "in_progress";
    }

    finish(distance: number, fare: number) {
        this.distance = distance;
        this.fare = fare;
        this.status = "completed";
    }

    getStatus() {
        return this.status;
    }

    getDistance() {
        return this.distance;
    }

    getFare() {
        return this.fare;
    }

    getDriverId() {
        return this.driverId;
    }
}