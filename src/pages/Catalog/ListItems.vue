<template>
  <div class="w-full text-white">
    <JsonSchema :schema="schema" v-model="value" />
    <br />
    <pre>{{ value }}</pre>
  </div>
</template>

<script>
// import JsonSchema from '@roma219/vue-jsonschema-form';

const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      classNames: 'form-input rounded-md shadow-sm bg-red-500',
    },
    classname: {
      type: 'string',
    },
    baseclassname: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    user_id: {
      type: 'integer',
    },
    attributes: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
        },
        furniline: {
          type: 'string',
        },
        category: {
          type: 'string',
        },
        origin: {
          type: 'string',
        },
        environment: {
          type: 'string',
        },
        rare: {
          type: 'boolean',
        },
        color: {
          type: 'string',
        },
      },
    },
    assets: {
      type: 'object',
      properties: {
        sprite_image: {
          type: 'string',
          format: 'uri',
        },
        sprite_json: {
          type: 'string',
          format: 'uri',
        },
        sprite_file: {
          type: 'string',
          format: 'uri',
        },
        icon_image: {
          type: 'string',
          format: 'uri',
        },
      },
    },
  },
};

export default {
  name: 'App',
  // components: { JsonSchema },
  data() {
    return {
      value: {},
    };
  },
  computed: {
    schema() {
      return schema;
    },
  },
};
</script>
