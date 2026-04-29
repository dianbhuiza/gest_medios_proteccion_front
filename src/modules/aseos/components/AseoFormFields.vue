<template>
  <v-row>
    <v-col cols="12" md="8">
      <v-text-field
        v-model="nombre"
        label="Nombre"
        variant="outlined"
        :error-messages="errors.nombre ? [errors.nombre] : []"
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-text-field
        v-model.number="cantidad"
        type="number"
        min="0"
        label="Cantidad"
        variant="outlined"
        :error-messages="errors.cantidad ? [errors.cantidad] : []"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const nombre = defineModel<string>('nombre', { required: true })
const cantidad = defineModel<number>('cantidad', { required: true })

defineProps<{
  errors: Record<string, string | undefined>
}>()
</script>
