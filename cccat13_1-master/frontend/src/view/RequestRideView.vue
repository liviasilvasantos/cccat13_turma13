<script setup lang="ts">
import { inject, ref } from "vue";
import RideGateway from '../infra/gateway/RideGateway';

const ride: any = ref({
    passenderId: "",
    from: {
        lat: 0,
        long: 0
    },
    to: {
        lat: 0,
        long: 0
    }
});
const rideId = ref("");
const error = ref("");
const rideGateway = inject("rideGateway") as RideGateway;

async function submit() {
    try {
        const output = await rideGateway.requestRide(ride.value);
        rideId.value = output.rideId;
    } catch (e: any) {
        error.value = e.message;
    }
}
</script>

<template>
    <div>
        <h2 class="request-ride-title">Request Ride</h2>
        <input type="text" class="request-ride-passenger-id" v-model="ride.passengerId" placeholder="Passenger ID" />
        <input type="text" class="request-ride-from-lat" v-model="ride.from.lat" placeholder="From Latitude" />
        <input type="text" class="request-ride-from-long" v-model="ride.from.long" placeholder="From Longitude" />
        <input type="text" class="request-ride-to-lat" v-model="ride.to.lat" placeholder="To Latitude" />
        <input type="text" class="request-ride-to-long" v-model="ride.to.long" placeholder="To Longitude" />
        <button class="request-ride-submit" @click="submit()">Submit</button>
        <span v-if="rideId" class="request-ride-ride-id">{{ rideId }}</span>
        <span class="request-ride-error">{{ error }}</span>
    </div>
</template>