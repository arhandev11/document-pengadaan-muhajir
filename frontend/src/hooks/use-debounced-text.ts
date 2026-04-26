import { useEffect, useRef, useState } from 'react'

/**
 * Local controlled state + debounced save — reusable untuk inline editing.
 * Save hanya di-fire 800ms setelah user berhenti mengetik.
 */
export function useDebouncedText(
  initialValue: string | null,
  save: (value: string) => void | Promise<void>,
  delay = 800,
) {
  const [local, setLocal] = useState(initialValue ?? '')
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  // Sync inbound changes (data datang dari server/parent)
  useEffect(() => {
    setLocal(initialValue ?? '')
  }, [initialValue])

  function handleChange(value: string) {
    setLocal(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => save(value), delay)
  }

  return [local, handleChange] as const
}
