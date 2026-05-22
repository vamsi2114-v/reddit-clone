import { Suspense } from 'react'
import SubmitForm from './SubmitForm'

export default function SubmitPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mt-6">Loading...</div>}>
      <SubmitForm />
    </Suspense>
  )
}