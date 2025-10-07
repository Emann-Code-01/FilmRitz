<template lang="html">
  <div class="relative">
    <div
      class="absolute inset-y-0 end-0 flex items-center pe-3.5 cursor-pointer"
      v-if="showHide"
      @click="toggleVisibility"
    >
      <svg
        class="w-4 h-4 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        v-if="!show"
      >
        <path d="M12 14.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z"></path>
        <path
          fill-rule="evenodd"
          d="M.55 12C2.078 7.132 6.626 3.6 12 3.6s9.922 3.532 11.45 8.4c-1.528 4.868-6.076 8.4-11.45 8.4S2.078 16.868.55 12Zm16.25 0a4.8 4.8 0 1 1-9.6 0 4.8 4.8 0 0 1 9.6 0Z"
          clip-rule="evenodd"
        ></path>
      </svg>
      <svg
        class="w-4 h-4 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        v-else
      >
        <path
          fill-rule="evenodd"
          d="M4.448 2.752a1.2 1.2 0 0 0-1.696 1.696l16.8 16.8a1.2 1.2 0 0 0 1.696-1.696l-1.767-1.768A12.018 12.018 0 0 0 23.45 12C21.92 7.132 17.373 3.6 12 3.6a11.95 11.95 0 0 0-5.414 1.289L4.45 2.752h-.002Zm5.114 5.112 1.816 1.818a2.404 2.404 0 0 1 2.94 2.94l1.817 1.816a4.8 4.8 0 0 0-6.573-6.573v-.001Z"
          clip-rule="evenodd"
        ></path>
        <path
          d="M14.945 20.036 11.7 16.79a4.8 4.8 0 0 1-4.49-4.489L2.802 7.894A11.976 11.976 0 0 0 .55 12c1.528 4.868 6.078 8.4 11.45 8.4 1.016 0 2.003-.126 2.945-.364Z"
        ></path>
      </svg>
    </div>
    <input
      :type="show ? 'text' : 'password'"
      :name="name"
      :id="id"
      :placeholder="placeholder"
      :class="error ? formClass.text.authError : formClass.text.auth"
      required
      v-model="input"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { formClass } from "./utils/common";

const props = defineProps({
  showHide: {
    type: Boolean,
    default() {
      return false;
    },
  },
  placeholder: {
    type: String,
    default() {
      return "Password";
    },
  },
  modelValue: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    default() {
      return "password";
    },
  },
  name: {
    type: String,
    default() {
      return "password";
    },
  },
  error: {
    type: Boolean,
    required: true,
  },
});
const input = ref<string>(props.modelValue)

watch(input, (w)=>emits('update:modelValue', w))


const emits = defineEmits([
  'update:modelValue',
]);

const show = ref(false);

function toggleVisibility() {
  show.value = !show.value;
}
</script>
