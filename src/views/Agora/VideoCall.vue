<script lang="ts" setup>
import AgoraRTC, {
  type IAgoraRTCClient,
  type ILocalAudioTrack,
  type ILocalVideoTrack,
} from 'agora-rtc-sdk-ng'
import { onMounted, ref } from 'vue'

let agoraClient: IAgoraRTCClient | null = null
const this_appId = ref(import.meta.env.VITE_AGORA_APP_ID ?? '')
const this_channel = ref(import.meta.env.VITE_AGORA_CHANNEL ?? '')
const this_token = ref(import.meta.env.VITE_AGORA_TOKEN ?? '')
const this_uid = ref(import.meta.env.VITE_AGORA_UID ?? '')

function agoraInit() {
  agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
  setupEventListeners()
}

agoraInit()
function setupEventListeners() {
  // Declare event handler for "user-published"
  agoraClient?.on('user-published', async (user, mediaType) => {
    // Subscribe to media streams
    await agoraClient?.subscribe(user, mediaType)
    if (mediaType === 'video') {
      // Specify the ID of the DOM element or pass a DOM object.
      user.videoTrack?.play('remote-user-video')
    }
    if (mediaType === 'audio') {
      user.audioTrack?.play()
    }
  })

  // Handle the "user-unpublished" event to unsubscribe from the user's media tracks
  agoraClient?.on('user-unpublished', async (user) => {
    const remotePlayerContainer = document.getElementById(user.uid.toString())
    remotePlayerContainer?.remove()
  })
}

// Declare variables for local tracks
let localAudioTrack: ILocalAudioTrack | null = null
let localVideoTrack: ILocalVideoTrack | null = null

// Create local audio and video tracks
async function createLocalMediaTracks() {
  localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
  localVideoTrack = await AgoraRTC.createCameraVideoTrack()
}

function displayLocalVideo() {
  // const localPlayerContainer = document.createElement('div')
  // localPlayerContainer.id = this_uid.value
  // localPlayerContainer.textContent = `Local user ${this_uid.value}`
  // localPlayerContainer.style.width = '640px'
  // localPlayerContainer.style.height = '480px'
  // document.body.append(localPlayerContainer)
  localVideoTrack?.play('local-user-video')
}

// Display remote user's video
// function displayRemoteVideo(user) {
//   const remotePlayerContainer = document.createElement('div')
//   remotePlayerContainer.id = user.uid.toString()
//   remotePlayerContainer.textContent = `Remote user ${user.uid}`
//   remotePlayerContainer.style.width = '640px'
//   remotePlayerContainer.style.height = '480px'
//   document.body.append(remotePlayerContainer)
//   user.videoTrack.play(remotePlayerContainer)
// }

async function publishLocalTracks() {
  const tracks = []
  if (localAudioTrack) tracks.push(localAudioTrack)
  if (localVideoTrack) tracks.push(localVideoTrack)
  await agoraClient?.publish(tracks)
}

async function joinChannel() {
  await agoraClient?.join(this_appId.value, this_channel.value, this_token.value, this_uid.value)
  await createLocalMediaTracks()
  displayLocalVideo()
  await publishLocalTracks()
}

async function leaveChannel() {
  // Stop the local media tracks to release the microphone and camera resources
  if (localAudioTrack) {
    localAudioTrack.close()
    localAudioTrack = null
  }
  if (localVideoTrack) {
    localVideoTrack.close()
    localVideoTrack = null
  }
  // Leave the channel
  await agoraClient?.leave()
}

onMounted(() => {})
</script>
<template>
  <div>Agora VideoCall</div>
  <div>
    <div>
      <span>你的appId</span>
      <input v-model="this_appId" />
    </div>
    <div>
      <span>你的channel</span>
      <input v-model="this_channel" />
    </div>
    <div>
      <span>你的token</span>
      <input v-model="this_token" />
    </div>
    <div>
      <span>你的uid</span>
      <input v-model="this_uid" />
    </div>
    <button @click="joinChannel()">join channel</button>
    <button @click="leaveChannel()">leave channel</button>
  </div>
  <div>
    <div id="local-user-video" style="width: 640px; height: 480px">local user</div>
    <div id="remote-user-video" style="width: 640px; height: 480px">remote user</div>
  </div>
</template>
