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
      <v-select
        v-model="tipoTalla"
        label="Tipo talla"
        variant="outlined"
        :items="tipos"
        :error-messages="errors.tipo_talla ? [errors.tipo_talla] : []"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const nombre = defineModel<string>('nombre', { required: true })
const tipoTalla = defineModel<string>('tipoTalla', { required: true })

defineProps<{
  errors: Record<string, string | undefined>
}>()

const tipos = ['overol', 'botas', 'sin_talla']
</script>
