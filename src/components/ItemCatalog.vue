<template>
    <div>
        <h2>Catalog</h2>
        <div v-for="item in items" :key="item.id">
            {{ item.name }}
        </div>
    </div>
</template>

<script>
export default {
    name: "ItemCatalog",
    props: ["items"],
};
</script>
