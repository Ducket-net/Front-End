<template>
  <div class="container">
    <div class="text"><slot></slot></div>
  </div>
</template>

<script>
export default {
  name: "TextMask",
};
</script>

<style scoped>
.container {
  position: relative;
  overflow: hidden;
  width: 120px;
}

.bg-video-container {
  border-radius: 50px; /* Add border-radius */
}

.container > .text {
  display: flex;
  padding: 2px;
  padding-left: 9px;
  padding-right: 9px;
  font-size: 14px;
  user-select: none;
  position: relative;
  color: transparent; /* Make the text color transparent */
}

.container > .text::before {
  content: attr(data-text); /* Inherit the text from data-text attribute */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("/public/white.mp4") no-repeat;
  background-size: cover;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  background-clip: text;
}
</style>
