<script setup lang="ts">
import SendBirdCall, { Room, type AuthOption } from 'sendbird-calls'
import { ref, type Ref } from 'vue'

const this_appId = ref(import.meta.env.VITE_APP_ID ?? '')
const this_room: Ref<Room | null> = ref(null)
const this_userId = ref(import.meta.env.VITE_USER_ID ?? '')
const this_accessToken = ref(import.meta.env.VITE_ACCESS_TOKEN ?? '')
const dial_userId = ref(import.meta.env.VITE_REMOTE_USER_ID ?? '')
const this_invitation: Ref<SendBirdCall.RoomInvitation | null> = ref(null)
const inviteMsg = ref('沒有群組邀請')

function sendbirdInit(appId: string) {
  console.log('init...')
  SendBirdCall.init(appId)
  console.log('addListener: onRinging')
  SendBirdCall.addListener('sendbirdGroupCall', {
    onInvitationReceived: (invitation) => {
      console.log('onInvitationReceived: ', invitation)
      inviteMsg.value = '有群組邀請'
      this_invitation.value = invitation
    },
  })
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

function createRoom() {
  const roomParams = {
    roomType: SendBirdCall.RoomType.SMALL_ROOM_FOR_VIDEO,
  }

  SendBirdCall.createRoom(roomParams)
    .then((room) => {
      console.log('createRoom: ', room)
      this_room.value = room
      const enterParams = {
        videoEnabled: true,
        audioEnabled: true,
      }
      this_room.value
        .enter(enterParams)
        .then(() => {
          console.log('enter room...')
          const localMediaView = document.getElementById(
            'local_video_element_id',
          ) as HTMLVideoElement
          // Set local media view.
          this_room.value?.localParticipant?.setMediaView(localMediaView)
          // Called when a remote participant is connected to the media stream and starts sending the media stream.
          this_room.value?.on('remoteParticipantStreamStarted', (remoteParticipant) => {
            // Create a new HTMLMediaElement to set remote participant's media stream.
            const remoteMediaView = document.createElement('video')
            // It is recommended to set a media view element's autoplay property to true.
            remoteMediaView.autoplay = true
            remoteParticipant.setMediaView(remoteMediaView)
            document.body.appendChild(remoteMediaView)
          })
        })
        .catch((err) => {
          console.error('enterRoom error: ', err)
        })
    })
    .catch((err) => {
      console.error('createRoom error: ', err)
    })
}

function muteMicrophone() {
  this_room.value?.localParticipant.muteMicrophone()
}
function unmuteMicrophone() {
  this_room.value?.localParticipant.unmuteMicrophone()
}
function stopVideo() {
  this_room.value?.localParticipant.stopVideo()
}
function startVideo() {
  this_room.value?.localParticipant.startVideo()
}

async function invite(inviteeId: string) {
  if (!this_room.value) {
    return
  }
  try {
    await this_room.value.sendInvitation(inviteeId)
  } catch (e) {
    console.error('invite error: ', e)
  }
}

function exitRoom() {
  if (!this_room.value) {
    return
  }
  try {
    this_room.value.exit()
    console.log('exit room...')
  } catch (e) {
    console.error('exitRoom error: ', e)
  }
}

async function deleteRoom() {
  if (!this_room.value) {
    return
  }
  try {
    await this_room.value.delete()
    console.log('delete room...')
    this_room.value = null
  } catch (e) {
    console.error('deleteRoom error: ', e)
  }
}

async function acceptInvitation(invitation: SendBirdCall.RoomInvitation | null) {
  if (!invitation) {
    return
  }
  try {
    await invitation.accept()
  } catch (e) {
    console.error('acceptInvitation error: ', e)
  }
}

async function declineInvitation(invitation: SendBirdCall.RoomInvitation | null) {
  if (!invitation) {
    return
  }
  try {
    await invitation.decline()
    console.log('decline invitation...')
    inviteMsg.value = '沒有群組邀請'
  } catch (e) {
    console.error('declineInvitation error: ', e)
  }
}
</script>
<template>
  <div>Sendbird GroupCall</div>
  <div>
    <div>
      <span>你的appId</span>
      <input v-model="this_appId" />
    </div>
    <button @click="sendbirdInit(this_appId)">init</button>
  </div>
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
      <span>remote userId</span>
      <input v-model="dial_userId" />
    </div>
    <button @click="invite(dial_userId)">invite</button>
  </div>
  <div>
    <button @click="createRoom">create room</button>
    <button @click="exitRoom">exit room</button>
    <button @click="deleteRoom">delete room</button>
  </div>
  <div>
    <span>{{ inviteMsg }}</span>
    <button @click="acceptInvitation(this_invitation)">接受</button>
    <button @click="declineInvitation(this_invitation)">拒絕</button>
    <button @click="stopVideo()">關閉鏡頭</button>
    <button @click="startVideo()">開啟鏡頭</button>
    <button @click="muteMicrophone()">關閉聲音</button>
    <button @click="unmuteMicrophone()">開啟聲音</button>
  </div>
  <div>
    <video id="local_video_element_id" style="width: 640px; height: 480px" autoplay></video>
  </div>
</template>
