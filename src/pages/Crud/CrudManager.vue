<!-- CrudManager.vue -->
<template>
  <div>
    <div v-for="item in items" :key="item.id" class="item">
      <!-- Display item properties -->
      <button @click="editItem(item)">Edit</button>
      <button @click="deleteItem(item)">Delete</button>
    </div>
    <json-schema-form
      :schema="schema"
      :item="selectedItem"
      @submit="submitForm"
    />
  </div>
</template>

<script>
import JsonSchemaForm from './SchemaForm.vue';

export default {
  components: {
    JsonSchemaForm,
  },
  props: {
    schema: Object,
    items: Array,
  },
  data() {
    return {
      selectedItem: null,
    };
  },
  methods: {
    editItem(item) {
      this.selectedItem = item;
    },
    deleteItem(item) {
      this.$emit('delete', item);
    },
    submitForm(formData) {
      this.$emit('submit', formData);
      this.selectedItem = null;
    },
  },
};
</script>
