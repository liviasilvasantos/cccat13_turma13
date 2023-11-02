<script setup lang="ts">
import { inject, ref } from "vue";
import RideGateway from '../infra/gateway/RideGateway';

const ride = ref("") as any;
const rideId = ref("");
const error = ref("");
const rideGateway = inject("rideGateway") as RideGateway;

async function submit() {
    try {
        const output = await rideGateway.getRide(rideId.value);
        ride.value = output;
    } catch (e: any) {
        error.value = e.message;
    }
}
</script>

<template>
    <div>
        <h2 class="get-ride-title">Get Ride</h2>
        <input type="text" class="get-ride-ride-id" v-model="rideId" placeholder="Passenger ID" />
        <button class="get-ride-submit" @click="submit()">Submit</button>
        <span class="get-ride-passenger-id">{{ ride.passengerId }}</span>
        <span class="get-ride-status">{{ ride.status }}</span>
    </div>
</template>