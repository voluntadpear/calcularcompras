import { mount, createLocalVue, config, Wrapper } from '@vue/test-utils';
import ElementUI from 'element-ui'
import flushPromises from 'flush-promises'

import App from '@/App.vue';
import { VueConstructor } from 'vue';

function mockFetch(data: any) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => data
    })
  );
}

describe('App.vue', () => {
  let localVue: VueConstructor;
  let wrapper: Wrapper<App>;
  beforeAll(() => {
    if (config && config.stubs) {
      config.stubs.transition = false
    }
    localVue = createLocalVue();
    localVue.use(ElementUI);
    window.fetch = mockFetch({dolarpy: {cambioschaco: {venta: 6000}}});
    wrapper = mount(App, {localVue});
    
  });
  it('makes correct shipping prediction for a basic courier', async () => {
    const priceInput = wrapper.find('input[aria-label="Precio"]') 
    priceInput.setValue('$ 40.50');
    const weightInput = wrapper.find('input[aria-label="Peso"]') 
    weightInput.setValue('2,50')
    const courierInput = wrapper.find('input[name="Courier"]')
    courierInput.trigger('click')
    const courierOptions = wrapper.findAll('.el-select-dropdown__item');
    const netboxOption = courierOptions.wrappers.find(option => option.text() === 'Netbox')
    if (netboxOption) {
      netboxOption.trigger('click');
    }
    await wrapper.vm.$nextTick();
    // we need to wait since watchers are deferred to the next update cycle 
    const predictedPriceEl = wrapper.find('h2[aria-label="Costo total"]')
    expect(predictedPriceEl.exists()).toBe(true);
    // We fallback to EN decimal separators because of https://stackoverflow.com/questions/23199909/using-tolocalestring-in-node-js/23200062#23200062
    expect(predictedPriceEl.text()).toBe('USD $64.31')
    await window.fetch("test");
    const predictedPriceGs = wrapper.find('h3[aria-label="Costo en guaraníes"]')
    expect(predictedPriceGs.exists()).toBe(true)
    expect(predictedPriceGs.text()).toBe("(Gs. 385,884)")
  });
  it('makes correct shipping prediction when changing between tax included price and not tax included price', async () => {
    const priceInput = wrapper.find('input[aria-label="Precio"]') 
    priceInput.setValue('$ 40.50');
    const weightInput = wrapper.find('input[aria-label="Peso"]') 
    weightInput.setValue('2,50')
    const courierInput = wrapper.find('input[name="Courier"]')
    courierInput.trigger('click')
    const courierOptions = wrapper.findAll('.el-select-dropdown__item');
    const globalboxOption = courierOptions.wrappers.find(option => option.text() === 'Globalbox')
    if (globalboxOption) {
      globalboxOption.trigger('click');
    }
    await flushPromises();
    const predictedPriceEl = wrapper.find('h2[aria-label="Costo total"]')
    expect(predictedPriceEl.exists()).toBe(true);
    expect(predictedPriceEl.text()).toBe('USD $64.88')
    const predictedPriceGs = wrapper.find('h3[aria-label="Costo en guaraníes"]')
    expect(predictedPriceGs.exists()).toBe(true)
    expect(predictedPriceGs.text()).toBe("(Gs. 389,286)")
    const taxIncludedCheck = wrapper.find('label[aria-label="Plan con impuestos incluidos"]')
    taxIncludedCheck.trigger('click');
    expect(predictedPriceEl.text()).toBe('USD $64.48')
    expect(predictedPriceGs.text()).toBe("(Gs. 386,856)")
  });
  it('makes correct shipping prediction when asking for a item of more than 100 USD', async () => {
    const priceInput = wrapper.find('input[aria-label="Precio"]') 
    priceInput.setValue('$ 120.35');
    const weightInput = wrapper.find('input[aria-label="Peso"]') 
    weightInput.setValue('3,20')
    const courierInput = wrapper.find('input[name="Courier"]')
    courierInput.trigger('click')
    const couriersOptions = wrapper.findAll('.el-select-dropdown__item');
    const globalboxOption = couriersOptions.wrappers.find(option => option.text() === 'Globalbox')
    if (globalboxOption) {
      globalboxOption.trigger('click');
    }
    const categoriesInput = wrapper.find('input[name="Categoría"]')
    categoriesInput.trigger('click')
    const categoriesOptions = wrapper.findAll('.el-select-dropdown__item');
    const celularesOption = categoriesOptions.wrappers.find(option => option.text() === 'Celulares')
    if (celularesOption) {
      celularesOption.trigger('click');
    }
    await flushPromises();
    const predictedPriceEl = wrapper.find('h2[aria-label="Costo total"]')
    expect(predictedPriceEl.exists()).toBe(true);
    expect(predictedPriceEl.text()).toBe('USD $169.57')
    const predictedPriceGs = wrapper.find('h3[aria-label="Costo en guaraníes"]')
    expect(predictedPriceGs.exists()).toBe(true)
    expect(predictedPriceGs.text()).toBe("(Gs. 1,017,441)")
  });
});
