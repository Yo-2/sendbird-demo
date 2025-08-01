import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'sendBirdDirectCall',
      component: () => import('../views/SendBird/DirectCallView.vue'),
    },
    {
      path: '/sendBirdGroupCall',
      name: 'sendBirdGroupCall',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SendBird/GroupCallView.vue'),
    },
    {
      path: '/sendBirdChat',
      name: 'sendBirdChat',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SendBird/ChatView.vue'),
    },
    {
      path: '/agora/videoCall',
      name: 'agoraVideoCall',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Agora/VideoCall.vue'),
    },
  ],
})

export default router
