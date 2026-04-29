<template>
  <v-dialog :model-value="modelValue" max-width="720" @update:model-value="onUpdate">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <slot />
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" :disabled="loading" @click="onUpdate(false)">Cancelar</v-btn>
        <v-btn color="primary" :loading="loading" @click="emit('save')">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title: string
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save'): void
}>()

function onUpdate(value: boolean) {
  emit('update:modelValue', value)
}
</script>
