<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-card" role="dialog" aria-modal="true">
          <button
            type="button"
            class="modal-close"
            aria-label="Закрыть"
            @click="$emit('close')"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L11 11M11 1L1 11"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linecap="round"
              />
            </svg>
          </button>

          <div class="modal-content">
            <p class="modal-message">{{ message }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  message: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

watch(
  () => props.isOpen,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : '';
  }
);

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) emit('close');
};

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', onKeydown);
}

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown);
  document.body.style.overflow = '';
});
</script>

<style scoped>
 .modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45); 
  display: flex;
  align-items: flex-start; 
  justify-content: center;
  padding: 450px 20px 20px;
  z-index: 9999;
  overflow-y: auto;
}

 .modal-card {
  background: #ffffff;
  border-radius: 20px;
  width: 695px;     
  max-width: 100%;
  min-height: 141px;             
  padding: 24px 28px;
  position: relative;
  display: block;               
  box-shadow: 0 12px 43px -2px rgba(0, 0, 0, 0.08); 
}

.modal-close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  padding: 0;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #262626;
  border-radius: 4px;
  transition: background 0.15s ease, color 0.15s ease;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.06);
  color: #000;
}

.modal-close:focus-visible {
  outline: 2px solid #40a9ff;
  outline-offset: 1px;
}

.modal-content {
  padding-right: 20px; 
  padding-top: 25px;  
}

.modal-message {
  margin: 0;
  font-family: "Poppins", sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 100%;
  color: #141414;
  text-align: center;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
