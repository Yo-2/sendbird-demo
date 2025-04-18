<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div>
    <div class="nav">
      <RouterLink to="/">Sendbird_Call</RouterLink>
      <RouterLink to="/about">Sendbird_Chat</RouterLink>
    </div>

    <RouterView />
  </div>
</template>

<style scoped>
.nav {
  display: flex;
  gap: 10px;
}
</style>
