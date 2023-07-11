<template>
  <div class="h-96 flex justify-center items-center text-white">
    <div class="text-white text-center">
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
  </div>
</template>

<script>
import SpecialButton from '@/components/SpecialButton.vue';

export default {
  components: { SpecialButton },
};
</script>
