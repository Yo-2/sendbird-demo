<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div>
    <div class="nav">
      <RouterLink to="/">Sendbird_DirectCall</RouterLink>
      <RouterLink to="/sendBirdGroupCall">Sendbird_GroupCall</RouterLink>
      <RouterLink to="/sendBirdChat">Sendbird_ChatCall</RouterLink>
      <RouterLink to="/agora/videoCall">Agora_VideoCall</RouterLink>
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
