import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

export function useModalFocus(modal: any) {
  const { activate: activate, deactivate: deactivate } = useFocusTrap(
    () => modal.value?.$el
  )

  function onEnter() {
    activate()
  }
  function onLeave() {
    deactivate()
  }

  return { onEnter, onLeave }
}
