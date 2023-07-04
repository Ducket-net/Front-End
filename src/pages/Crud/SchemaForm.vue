<!-- JsonSchemaForm.vue -->
<template>
  <form @submit.prevent="submitForm">
    <template v-for="(field, key) in schema.properties">
      <label :for="key" :key="key + '-label'">{{ field.title }}</label>
      <input
        :type="field.type"
        :id="key"
        :key="key"
        v-model="formData[key]"
        :required="isRequired(key)"
      />
    </template>
    <button type="submit">Submit</button>
  </form>
</template>

<script>
export default {
  props: {
    schema: Object,
    item: Object,
  },
  data() {
    return {
      formData: this.item || {},
    };
  },
  methods: {
    submitForm() {
      this.$emit('submit', this.formData);
    },
    isRequired(key) {
      return this.schema.required && this.schema.required.includes(key);
    },
  },
};
</script>
