import { FiLoader } from 'react-icons/fi'

export default function LoadingGrid() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative">
        <FiLoader className="animate-spin text-4xl text-primary-500" />
        <div className="absolute inset-0 animate-ping opacity-50">
          <FiLoader className="text-4xl text-primary-500" />
        </div>
      </div>
    </div>
  )
} 