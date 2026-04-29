<template>
  <v-snackbar
    :model-value="visible"
    :color="color"
    timeout="3000"
    location="top right"
    @update:model-value="onUpdate"
  >
    {{ message }}
    <template #actions>
      <v-btn variant="text" @click="onUpdate(false)">Cerrar</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  message: string
  color: 'success' | 'error' | 'warning' | 'info'
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

function onUpdate(value: boolean) {
  emit('update:visible', value)
}
</script>
