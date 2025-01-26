interface TabButtonProps {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}

export default function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all
                ${active 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-dark-700'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
} 