import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import RideGatewayHttp from './infra/gateway/RideGatewayHttp';

const app = createApp(App);
app.provide("rideGateway", new RideGatewayHttp());
app.mount('#app')
