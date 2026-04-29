<template>
  <v-text-field
    v-model="nombre"
    label="Nombre"
    variant="outlined"
    :error-messages="error ? [error] : []"
    required
  />
</template>

<script setup lang="ts">
const nombre = defineModel<string>('nombre', { required: true })

withDefaults(
  defineProps<{
    error?: string
  }>(),
  {
    error: undefined,
  },
)
</script>
