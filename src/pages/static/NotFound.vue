<template>
  <div class="text-white mt-20 text-center">
    <h1 class="text-lg font-bold">404 - Not Found</h1>
    <p class="text-gray-400">The page you are looking for does not exist.</p>
    <div class="p-4">
      <SpecialButton
        buttonClass="w-full"
        @button-click="this.$router.push('/')"
      >
        Go Home
      </SpecialButton>
    </div>
  </div>
</template>

<script>
import SpecialButton from '@/components/SpecialButton.vue';

export default {
  components: { SpecialButton },
};
</script>
