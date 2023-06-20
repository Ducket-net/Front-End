<template>
  <img
    :ref="src"
    id="classname"
    class="ml-2"
    :src="src"
    @error="onImageError"
  />
</template>

<script>
export default {
  name: "FurniImg",
  props: {
    classname: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      src: `https://ducket-net.github.io/resources/icons/${this.replaceAsteriskWithUnderscore(
        this.classname
      )}_icon.png`,
    };
  },

  computed: {
    fallbackSrc() {
      return `https://ducket.net/assets/furni/${this.replaceAsteriskWithUnderscore(
        this.classname
      )}_icon.png`;
    },
  },
  methods: {
    replaceAsteriskWithUnderscore(classname) {
      const match = classname.match(/\*(\d+)$/);
      return match ? classname.replace(/\*(\d+)$/, "_" + match[1]) : classname;
    },
    onImageError() {
      console.log("error");
      this.src = this.fallbackSrc;
    },
    updateSrc(newClassname) {
      console.log("updateSrc");
      this.src = `https://ducket-net.github.io/resources/icons/${this.replaceAsteriskWithUnderscore(
        newClassname
      )}_icon.png`;
    },
  },
};
</script>
