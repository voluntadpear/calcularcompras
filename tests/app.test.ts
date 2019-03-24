import { mount, createLocalVue, config } from '@vue/test-utils';
import ElementUI from 'element-ui'
import flushPromises from 'flush-promises'

import App from '@/App.vue';
import PriceForm from '@/components/PriceForm.vue';
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
  beforeAll(() => {
    if (config && config.stubs) {
      config.stubs.transition = false
    }
    localVue = createLocalVue();
    localVue.use(ElementUI);
    window.fetch = mockFetch({dolarpy: {cambioschaco: {venta: 6000}}})
  })
  it('makes correct shipping prediction', async () => {
    const wrapper = mount(App, {localVue});
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
    // we need to wait since watchers are deferred to the next update cycle 
    await flushPromises();
    const predictedPriceEl = wrapper.find('h2.predicted-price-output')
    expect(predictedPriceEl.exists()).toBe(true);
    expect(predictedPriceEl.text()).toBe('USD $64.31')
  });
});
