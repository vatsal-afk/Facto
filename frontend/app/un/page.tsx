import Conventions from '@/components/un-conventions'

export default function UNPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">United Nations Conventions</h1>
      {/* <h1 className="text-3xl font-bold mb-6 text-center">Know about recent United Nations conventions</h1> */}
      <Conventions />
    </div>
  )
}

