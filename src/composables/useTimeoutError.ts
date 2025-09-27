import { type Ref } from 'vue'
import { useTimeoutFn } from '@vueuse/core'

export function useTimeoutError(value: Ref<string | boolean>, timer: number) {
  useTimeoutFn(() => {
    value.value = ''
  }, timer).start()
}
