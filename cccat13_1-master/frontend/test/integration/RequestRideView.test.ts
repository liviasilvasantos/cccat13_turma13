import { mount } from "@vue/test-utils";
import SignupView from "../../src/view/SignupView.vue";
import RequestRideView from "../../src/view/RequestRideView.vue";
import GetRideView from "../../src/view/GetRideView.vue";
import RideGatewayHttp from '../../src/infra/gateway/RideGatewayHttp';
import RideGateway from "../../src/infra/gateway/RideGateway";
import AxiosAdapter from "../../src/infra/gateway/http/AxiosAdapter";
import FetchAdapter from "../../src/infra/gateway/http/FetchAdapter";
import Account from "../../src/domain/Account";
import GeolocationGateway from "../../src/infra/gateway/GeolocationGateway";

function sleep (time: number) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, time);
	});
}

test("deve solicitar uma corrida", async function () {
    const httpClient = new AxiosAdapter();
    // const httpClient = new FetchAdapter();
    const wrapperSignupView = mount(SignupView, {
        global: {
            provide: { 
                rideGateway: new RideGatewayHttp(httpClient)
            }
        }
    });
    wrapperSignupView.get(".signup-name").setValue("John Doe");
    wrapperSignupView.get(".signup-email").setValue(`john.doe${Math.random()}@gmail.com`);
    wrapperSignupView.get(".signup-cpf").setValue("95818705552");
    wrapperSignupView.get(".signup-is-passenger").setValue(true);

    await wrapperSignupView.get(".signup-submit").trigger("click");
    await sleep(200);
    const accountId = wrapperSignupView.get(".signup-account-id").text();

    const geolocationGateway: GeolocationGateway = {
        async getGeolocation(): Promise<any> {
            return {
                lat: -22.818439,
                long: -47.064721
            };
        }
    }
    const wrapperRequestRideView = mount(RequestRideView, {
        global: {
            provide: { 
                rideGateway: new RideGatewayHttp(httpClient),
                geolocationGateway: geolocationGateway
            }
        }
    });
    expect(wrapperRequestRideView.get(".request-ride-title").text()).toBe("Request Ride");
    wrapperRequestRideView.get(".request-ride-passenger-id").setValue(accountId);
    wrapperRequestRideView.get(".request-ride-from-lat").setValue(-22.818439);
    wrapperRequestRideView.get(".request-ride-from-long").setValue(-47.064721);
    wrapperRequestRideView.get(".request-ride-to-lat").setValue(-22.847566);
    wrapperRequestRideView.get(".request-ride-to-long").setValue(-47.063104);
    await wrapperRequestRideView.get(".request-ride-submit").trigger("click");
    await sleep(200);
    const rideId = wrapperRequestRideView.get(".request-ride-ride-id").text();
    console.log('rideId', rideId);
    
    const wrapperGetRideView = mount(GetRideView, {
        global: {
            provide: { 
                rideGateway: new RideGatewayHttp(httpClient)
            }
        }
    });
    wrapperGetRideView.get(".get-ride-ride-id").setValue(rideId);
    await wrapperGetRideView.get(".get-ride-submit").trigger("click");
    await sleep(200);
    expect(wrapperGetRideView.get(".get-ride-title").text()).toBe("Get Ride");
    expect(wrapperGetRideView.get(".get-ride-passenger-name").text()).toBe("John Doe");
	expect(wrapperGetRideView.get(".get-ride-status").text()).toBe("requested");
});

