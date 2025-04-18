<script setup lang="ts">
import SendBirdCall, {
  type AcceptParams,
  type AuthOption,
  type DialParams,
  type DirectCall,
} from 'sendbird-calls'
import { onMounted, ref } from 'vue'

console.log(import.meta.env)
const appId = import.meta.env.VITE_APP_ID
const this_userId = ref(import.meta.env.VITE_USER_ID ?? '')
const this_accessToken = ref(import.meta.env.VITE_ACCESS_TOKEN ?? '')
const dial_userId = ref(import.meta.env.VITE_REMOTE_USER_ID ?? '')

SendBirdCall.init(appId)

const acceptCall = (call: DirectCall) => {
  call.onEstablished = (call) => {
    console.log('onEstablished: ', call)
  }

  call.onConnected = (call) => {
    console.log('onConnected: ', call)
  }

  call.onEnded = (call) => {
    console.log('onEnded: ', call)
  }

  call.onRemoteAudioSettingsChanged = (call) => {
    console.log('onRemoteAudioSettingsChanged: ', call)
  }

  call.onRemoteVideoSettingsChanged = (call) => {
    console.log('onRemoteVideoSettingsChanged: ', call)
  }

  const acceptParams: AcceptParams = {
    callOption: {
      localMediaView: document.getElementById('local_video_element_id') as HTMLVideoElement,
      remoteMediaView: document.getElementById('remote_video_element_id') as HTMLVideoElement,
      audioEnabled: true,
      videoEnabled: true,
    },
  }

  call.accept(acceptParams)
}

function authenticate(authOption: AuthOption) {
  // console.log('authOption: ', authOption)
  SendBirdCall.authenticate(authOption, (result, error) => {
    if (error) {
      console.error('error: ', error)
    } else {
      console.log('result: ', result)
      SendBirdCall.connectWebSocket()
        .then(() => {
          console.log('Successfully connected to WebSocket... ')
        })
        .catch((err) => {
          console.error('connectWebSocket error: ', err)
        })
    }
  })
}

function dial(remote_userId: string) {
  console.log('remote_userId: ', remote_userId)
  SendBirdCall.useMedia({ audio: true, video: true })
  const dialParams: DialParams = {
    userId: remote_userId,
    isVideoCall: true,
    callOption: {
      localMediaView: document.getElementById('local_video_element_id') as HTMLVideoElement,
      remoteMediaView: document.getElementById('remote_video_element_id') as HTMLVideoElement,
      audioEnabled: true,
      videoEnabled: true,
    },
  }
  const call = SendBirdCall.dial(dialParams, (call, error) => {
    if (error) {
      console.error('dial error: ', error)
    }
    console.log('dial call: ', call)
  })

  call.onEstablished = (call) => {
    //...
  }

  call.onConnected = (call) => {
    //...
  }

  call.onEnded = (call) => {
    //...
  }

  call.onRemoteAudioSettingsChanged = (call) => {
    //...
  }

  call.onRemoteVideoSettingsChanged = (call) => {
    //...
  }
}

onMounted(() => {
  console.log('addListener: onRinging')
  SendBirdCall.addListener('sendbirdCallOnRinging', {
    onRinging: (call) => {
      console.log('onRinging: ', call)
      acceptCall(call)
    },
  })
})
</script>

<template>
  <main>
    <h1>SendBird GroupCall</h1>
    <div>
      <div>
        <span>你的userId</span>
        <input v-model="this_userId" />
      </div>
      <div>
        <span>你的accessToken</span>
        <input v-model="this_accessToken" />
      </div>
      <button @click="authenticate({ userId: this_userId, accessToken: this_accessToken })">
        auth
      </button>
    </div>
    <div>
      <div>
        <span>要撥打的userId</span>
        <input v-model="dial_userId" />
      </div>
      <button @click="dial(dial_userId)">dial</button>
    </div>
    <video id="remote_video_element_id" autoPlay></video>
    <video id="local_video_element_id" autoPlay :muted="true"></video>
  </main>
</template>
