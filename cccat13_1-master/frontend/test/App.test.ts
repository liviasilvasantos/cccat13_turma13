import { mount } from "@vue/test-utils";
import AppVue from "../src/App.vue";

test("deve criar um passageiro", async function () {
    const wrapper = mount(AppVue, {});
    expect(wrapper.get(".signup-title").text()).toBe("Signup");

    wrapper.get(".signup-name").setValue("John Doe");
    wrapper.get(".signup-email").setValue(`john.doe${Math.random()}@gmail.com`);
    wrapper.get(".signup-cpf").setValue("95818705552");
    wrapper.get(".signup-is-passenger").setValue(true);

    await wrapper.get(".signup-submit").trigger("click");
    expect(wrapper.get(".signup-account-id").text()).toBeDefined();
    // console.log(wrapper.html());
});