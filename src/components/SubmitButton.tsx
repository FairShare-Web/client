'use client'

import { useFormStatus } from 'react-dom'

export default function SubmitButton() {
  const { pending } = useFormStatus()
 
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-blue-200 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center active:scale-[0.98]"
    >
      {pending ? (
        <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        'Register Project'
      )}
    </button>
  )
}
