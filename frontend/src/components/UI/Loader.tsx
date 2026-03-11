import { Sparkles } from 'lucide-react'

interface props{
    text:string
}
export function Loader({text }:props) {

  return (
   <div className="flex w-full flex-col items-center justify-center h-screen gap-4 ">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-[3px] border-avocado-smoothie/10" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-avocado-smoothie animate-spin" />
            <Sparkles size={18} className="absolute inset-0 m-auto text-avocado-smoothie font-bold" />
          </div>
          <p className="text-xs text-avocado-smoothie tracking-[0.2em] uppercase font-medium">{text}...</p>
        </div>
  )
}

export default Loader