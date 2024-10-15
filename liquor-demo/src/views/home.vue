<script setup lang="ts">
import Test from '@/components/test.vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
function toAbout() {
  router.push('/about')
}
</script>

<template>
  <div class="flex-center h-[100vh] w-full">
    <Test @click="toAbout" />
  </div>
</template>

<style lang="scss" scoped></style>
