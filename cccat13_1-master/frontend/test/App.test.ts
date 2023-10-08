import { mount } from "@vue/test-utils";
import AppVue from "../src/App.vue";

test("App.test.ts", function () {
    const wrapper = mount(AppVue, {});
    console.log(wrapper.html());

    expect(wrapper.get("h1").text()).toBe("Vite + Vue");
});