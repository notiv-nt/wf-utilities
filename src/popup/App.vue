<script lang="ts" setup>
import { onMounted, ref, type Ref } from 'vue';
import { getConfig, saveConfig, type IConfig } from '../config';

// @ts-ignore
const data: Ref<IConfig> = ref({});

async function save() {
  await saveConfig(data.value);
}

onMounted(async () => {
  data.value = await getConfig();
});
</script>

<template>
  <div class="p-4">
    <label class="block mb-3">
      <div class="form-label">Max loss</div>
      <input type="number" class="form-input" v-model="data.maxLoss" min="0" step="1" @input="save" />
    </label>

    <label class="block">
      <div class="form-label">Leverage</div>
      <input type="number" class="form-input" v-model="data.leverage" min="0" @input="save" />
    </label>
  </div>
</template>

<style lang="postcss" scoped></style>
