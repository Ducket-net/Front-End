<!-- src/components/Home.vue -->
<template>
    <div class="grid grid-cols-3">
        <GameRoom :roomId="home" />
        <GameRoom :roomId="cake" />
    </div>
</template>

<script>
import GameRoom from "./GameRoom.vue";

export default {
    components: {
        GameRoom,
    },
    data() {
        return {
            home: "home",
            cake: "cake",
        };
    },
};
</script>
