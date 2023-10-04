import Ride from "../../src/domain/Ride"

test("Deve criar uma corrida", function () {
    const ride = Ride.create("12", 12.4, 15.4, 45.5, 23.5);
    expect(ride.rideId).toBeDefined();
    expect(ride.getStatus()).toBe("requested");
});

test("Deve aceitar uma corrida", function () {
    const ride = Ride.create("12", 12.4, 15.4, 45.5, 23.5);
    ride.accept("111");
    expect(ride.rideId).toBeDefined();
    expect(ride.getStatus()).toBe("accepted");
    expect(ride.getDriverId()).toBe("111");
});