/* import { ref } from 'vue'

export const userName = () => {
  const name = ref(Math.floor(Math.random()))
  const setName = (v) => {
    name.value = v
  }
  return {
    name,
    setName
  }
} */


import { ref } from 'vue';

export const useName = () => {
  const name = ref('')
  const setName = (v) => {
    name.value = v
  }
  return {
    name,
    setName
  }
}
