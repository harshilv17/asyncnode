export default function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col gap-[5px]">
        <div className="h-[3px] w-6 rounded-full bg-amber-600" />
        <div className="h-[3px] w-[18px] rounded-full bg-amber-800/75" />
        <div className="h-[3px] w-3 rounded-full bg-amber-900/45" />
      </div>
      <a href="/">
        <span className="font-display font-bold text-[21px] tracking-tight text-[#f0eee9] leading-none"
        >
          AsyncNode
        </span>
      </a>
    </div>
  )
}
