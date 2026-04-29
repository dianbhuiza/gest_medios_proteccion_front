<template>
  <v-dialog :model-value="modelValue" max-width="420" @update:model-value="onUpdate">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" :disabled="loading" @click="onUpdate(false)">{{ cancelText }}</v-btn>
        <v-btn color="error" :loading="loading" @click="emit('confirm')">{{ confirmText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    message: string
    loading?: boolean
    cancelText?: string
    confirmText?: string
  }>(),
  {
    loading: false,
    cancelText: 'Cancelar',
    confirmText: 'Eliminar',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()

function onUpdate(value: boolean) {
  emit('update:modelValue', value)
}
</script>
