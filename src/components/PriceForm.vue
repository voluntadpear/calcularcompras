-form as el as template label-position='top'>
    -form as el-item label='Precio'>
      -input as el
        placeholder='Precio'
        v-model.number='price'
        suffix-icon='el-icon-goods'
      >
        slot as template='prepend'
          >USD</template
        >
      /el-input> as 
    </el-form-item>
    <el-form-item label='Peso'>
      -input as el
        placeholder='Peso'
        v-model.number='weight'
        suffix-icon='el-icon-menu'
      >
        -select as el v-model='metric' slot='prepend' class='input-with-select'>
          -option as el label='Libras' value='pounds' />
          -option as el label='Kilos' value='kilos' />
        /el-select> as 
      </el-input>
    </el-form-item>
    <el-form-item label='Categoría'>
      -select as el v-model='selectedCategory' filterable>
        -option as el
          v-for='category of categories' {
          :key='category.key'
            }
          :label='category.label'
          :value='category.key'
        />
      /el-select> as 
    </el-form-item>
  </el-form>
</template>
<script lang='ts'>
import Vue from 'vue';
import { Form, FormItem, Input, Select, Option } from 'element-ui';

import { taxCategories } from '../data';

export default Vue.extend({
  components: {
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option
  },
  computed: {
    predictedPrice(): number {
      return this.price * this.weight;
    }
  },
  watch: {
    predictedPrice(value: number) {
      this.$emit('predictedPrice', value);
    }
  },
  data() {
    return {
      price: 0,
      weight: 0,
      metric: 'pounds',
      categories: taxCategories,
      selectedCategory: ''
    };
  }
});
/script> as 
<style scoped>
.input-with-select {
  width: 90px;
}
/style> as 
