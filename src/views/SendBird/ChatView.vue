<script setup lang="ts">
import SendbirdChat, { User } from '@sendbird/chat'
import { GroupChannelModule } from '@sendbird/chat/groupChannel'
import { ref, type Ref } from 'vue'

const sendbird: Ref<SendbirdChat | null> = ref(null)
const this_appId = ref(import.meta.env.VITE_APP_ID ?? '')
const this_user: Ref<User | null> = ref(null)
const this_userId = ref(import.meta.env.VITE_USER_ID ?? '')
const this_accessToken = ref(import.meta.env.VITE_ACCESS_TOKEN ?? '')

async function sendbirdInit(appId: string) {
  sendbird.value = SendbirdChat.init({
    appId,
    modules: [new GroupChannelModule()],
  })
  console.log('sendbirdInit sendbird: ', sendbird.value)
  try {
    this_user.value = await sendbird.value.connect(this_userId.value)
  } catch (error) {
    console.error('sendbirdConnect error: ', error)
  }
}
</script>
<template>
  <div>
    <h1>Sendbird Chat</h1>
  </div>
</template>
