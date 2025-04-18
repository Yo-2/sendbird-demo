<script setup lang="ts">
import SendBirdCall, {
  type AcceptParams,
  type AuthOption,
  type DialParams,
  type DirectCall,
} from 'sendbird-calls'
import { onMounted, ref, type Ref } from 'vue'

console.log(import.meta.env)
const appId = import.meta.env.VITE_APP_ID
const this_userId = ref(import.meta.env.VITE_USER_ID ?? '')
const this_accessToken = ref(import.meta.env.VITE_ACCESS_TOKEN ?? '')
const dial_userId = ref(import.meta.env.VITE_REMOTE_USER_ID ?? '')
const directCall: Ref<DirectCall | null> = ref(null)
const callMsg = ref('沒有來電')

SendBirdCall.init(appId)

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
  directCall.value = SendBirdCall.dial(dialParams, (call, error) => {
    if (error) {
      console.error('dial error: ', error)
    }
    console.log('dial call: ', call)
  })

  directCall.value.onEstablished = (call) => {
    console.log('dial onEstablished: ', call)
  }

  directCall.value.onConnected = (call) => {
    console.log('dial onConnected: ', call)
  }

  directCall.value.onEnded = (call) => {
    console.log('dial onEnded: ', call)
    directCall.value?.end()
    directCall.value = null
  }

  directCall.value.onRemoteAudioSettingsChanged = (call) => {
    console.log('dial onRemoteAudioSettingsChanged: ', call)
  }

  directCall.value.onRemoteVideoSettingsChanged = (call) => {
    console.log('dial onRemoteVideoSettingsChanged: ', call)
  }
}

const callOnRinging = (call: DirectCall) => {
  if (!call) {
    return
  }
  callMsg.value = '有來電'
  call.onEstablished = (call) => {
    console.log('onEstablished: ', call)
    callMsg.value = 'call onEstablished'
  }

  call.onConnected = (call) => {
    console.log('onConnected: ', call)
    callMsg.value = '接通通話'
  }

  call.onEnded = (call) => {
    console.log('onEnded: ', call)
    callMsg.value = '結束通話'
  }

  call.onRemoteAudioSettingsChanged = (call) => {
    console.log('onRemoteAudioSettingsChanged: ', call)
  }

  call.onRemoteVideoSettingsChanged = (call) => {
    console.log('onRemoteVideoSettingsChanged: ', call)
  }

  directCall.value = call
}

function callAccept(call: DirectCall | null) {
  if (!call) {
    return
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

onMounted(() => {
  console.log('addListener: onRinging')
  SendBirdCall.addListener('sendbirdCallOnRinging', {
    onRinging: (call) => {
      console.log('onRinging: ', call)
      callOnRinging(call)
    },
  })
})
</script>

<template>
  <main>
    <h1>Sendbird DirectCall</h1>
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
    <div>
      <span>{{ callMsg }}</span>
      <button @click="callAccept(directCall)">接受</button>
      <button @click="directCall?.end()">拒絕</button>
      <button @click="directCall?.stopVideo()">關閉鏡頭</button>
      <button @click="directCall?.startVideo()">關閉鏡頭</button>
      <button @click="directCall?.muteMicrophone()">關閉聲音</button>
      <button @click="directCall?.unmuteMicrophone()">開啟聲音</button>
    </div>
    <video id="remote_video_element_id" autoPlay></video>
    <video id="local_video_element_id" autoPlay :muted="true"></video>
  </main>
</template>
