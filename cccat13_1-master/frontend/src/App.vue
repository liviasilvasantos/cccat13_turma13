<script setup lang="ts">
  import {inject, ref} from "vue";
  import RideGateway from './infra/gateway/RideGateway';

  const input = ref({
    name: "",
    email:"",
    cpf: "95818705552",
    isPassenger:false,
    isDriver:false
  });

  const accountId = ref("");
  const error = ref("");
  const rideGateway = inject("rideGateway") as RideGateway;

  async function signup(){
    try {
      const output = await rideGateway.signup(input.value);
      accountId.value = output.accountId;
    }catch(e:any){
      error.value = e.message;
    }
  }
</script>

<template>
  <div>
    <h2 class="signup-title">Signup</h2>
    <input class="signup-name" type="text" v-model="input.name"/>
    <input class="signup-email" type="text" v-model="input.email"/>
    <input class="signup-cpf" type="text" v-model="input.cpf"/>
    <input class="signup-is-passenger" type="checkbox" v-model="input.isPassenger"/>
    <button class="signup-submit" @click="signup()">Submit</button>
    <span v-if="accountId" class="signup-account-id">{{ accountId }}</span>
    <span class="signup-error">{{ error }}</span>
  </div>
</template>

<style scoped>
</style>
