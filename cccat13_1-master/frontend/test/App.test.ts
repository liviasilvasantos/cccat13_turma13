import { mount } from "@vue/test-utils";
import AppVue from "../src/App.vue";
import RideGatewayHttp from '../src/infra/gateway/RideGatewayHttp';
import RideGateway from "../src/infra/gateway/RideGateway";
import AxiosAdapter from "../src/infra/gateway/http/AxiosAdapter";

function sleep (time: number) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, time);
	});
}

test("deve criar um passageiro", async function () {
    const httpClient = new AxiosAdapter();
    const wrapper = mount(AppVue, {
        global: {
            provide: { 
                rideGateway: new RideGatewayHttp(httpClient)
            }
        }
    });
    expect(wrapper.get(".signup-title").text()).toBe("Signup");

    wrapper.get(".signup-name").setValue("John Doe");
    wrapper.get(".signup-email").setValue(`john.doe${Math.random()}@gmail.com`);
    wrapper.get(".signup-cpf").setValue("95818705552");
    wrapper.get(".signup-is-passenger").setValue(true);

    await wrapper.get(".signup-submit").trigger("click");
    await sleep(200);
    expect(wrapper.get(".signup-account-id").text()).toHaveLength(36);
});

test("não deve criar um passageiro se cpf invalido", async function () {
    const httpClient = new AxiosAdapter();
    const wrapper = mount(AppVue, {
        global: {
            provide: { 
                rideGateway: new RideGatewayHttp(httpClient)
            }
        }
    });
    expect(wrapper.get(".signup-title").text()).toBe("Signup");

    wrapper.get(".signup-name").setValue("John Doe");
    wrapper.get(".signup-email").setValue(`john.doe${Math.random()}@gmail.com`);
    wrapper.get(".signup-cpf").setValue("12312312312");
    wrapper.get(".signup-is-passenger").setValue(true);

    await wrapper.get(".signup-submit").trigger("click");
    await sleep(200);
    expect(wrapper.get(".signup-error").text()).toBe("Invalid cpf");
});

test("não deve criar um passageiro se nome invalido", async function () {
    const httpClient = new AxiosAdapter();
    const wrapper = mount(AppVue, {
        global: {
            provide: { 
                rideGateway: new RideGatewayHttp(httpClient)
            }
        }
    });
    expect(wrapper.get(".signup-title").text()).toBe("Signup");

    wrapper.get(".signup-email").setValue(`john.doe${Math.random()}@gmail.com`);
    wrapper.get(".signup-cpf").setValue("12312312312");
    wrapper.get(".signup-is-passenger").setValue(true);

    await wrapper.get(".signup-submit").trigger("click");
    await sleep(200);
    expect(wrapper.get(".signup-error").text()).toBe("Invalid name");
});

test("não deve criar um passageiro se email ja cadastrado", async function () {
    const httpClient = new AxiosAdapter();
    const wrapper = mount(AppVue, {
        global: {
            provide: { 
                rideGateway: new RideGatewayHttp(httpClient)
            }
        }
    });
    expect(wrapper.get(".signup-title").text()).toBe("Signup");

    wrapper.get(".signup-name").setValue("John Doe");
    wrapper.get(".signup-email").setValue(`john.doe${Math.random()}@gmail.com`);
    wrapper.get(".signup-cpf").setValue("95818705552");
    wrapper.get(".signup-is-passenger").setValue(true);

    await wrapper.get(".signup-submit").trigger("click");
    await sleep(200);
    await wrapper.get(".signup-submit").trigger("click");
    await sleep(200);
    expect(wrapper.get(".signup-error").text()).toBe("Account already exists");
});

test("deve criar um passageiro usando fake", async function () {
    const rideGateway: RideGateway = {
        async signup(input:any): Promise<any>{
            return {
                accountId: crypto.randomUUID()
            }
        }
    }
    const wrapper = mount(AppVue, {
        global: {
            provide: { 
                rideGateway
            }
        }
    });
    expect(wrapper.get(".signup-title").text()).toBe("Signup");

    wrapper.get(".signup-name").setValue("John Doe");
    wrapper.get(".signup-email").setValue(`john.doe${Math.random()}@gmail.com`);
    wrapper.get(".signup-cpf").setValue("95818705552");
    wrapper.get(".signup-is-passenger").setValue(true);

    await wrapper.get(".signup-submit").trigger("click");
    expect(wrapper.get(".signup-account-id").text()).toHaveLength(36);
});

test("não deve criar um passageiro se nome invalido usando fake", async function () {
    const rideGateway: RideGateway = {
        async signup(input:any): Promise<any>{
            throw new Error("Invalid name")
        }
    }
    const wrapper = mount(AppVue, {
        global: {
            provide: { 
                rideGateway
            }
        }
    });
    expect(wrapper.get(".signup-title").text()).toBe("Signup");

    wrapper.get(".signup-email").setValue(`john.doe${Math.random()}@gmail.com`);
    wrapper.get(".signup-cpf").setValue("12312312312");
    wrapper.get(".signup-is-passenger").setValue(true);

    await wrapper.get(".signup-submit").trigger("click");
    expect(wrapper.get(".signup-error").text()).toBe("Invalid name");
});