<script setup lang="ts">
import { inject, ref } from "vue";
import RideGateway from '../infra/gateway/RideGateway';
import Account from "../domain/Account";

const account = ref(new Account("", "", "95818705552", "", false, false));

const accountId = ref("");
const error = ref("");
const rideGateway = inject("rideGateway") as RideGateway;

async function signup() {
  const errors = account.value.validate();
  if (errors.length > 0) {
    error.value = errors.join(", ");
    return;
  }

  try {
    const output = await rideGateway.signup(account.value);
    accountId.value = output.accountId;
  } catch (e: any) {
    error.value = e.message;
  }
}
</script>

<template>
  <div>
    <h2 class="signup-title">Signup</h2>
    <input class="signup-name" type="text" v-model="account.name" placeholder="Name"/>
    <input class="signup-email" type="text" v-model="account.email" placeholder="Email"/>
    <input class="signup-cpf" type="text" v-model="account.cpf" placeholder="CPF"/>
    Is passenger: <input class="signup-is-passenger" type="checkbox" v-model="account.isPassenger"/>
    <button class="signup-submit" @click="signup()">Submit</button>
    <span v-if="accountId" class="signup-account-id">{{ accountId }}</span>
    <span class="signup-error">{{ error }}</span>
  </div>
</template>

<style scoped></style>
