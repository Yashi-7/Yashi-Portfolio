import { Search, Volume2, Wifi, Battery } from "lucide-react";

const GITHUB_URL = "https://github.com/Yashi-7";
const LEETCODE_URL = "https://leetcode.com/u/Yashi_16/";

export default function Taskbar({onWindowsClick, onSearchClick,}) {
  return (
    <div className="taskbar">

      <div className="taskbar-center">

        {/* Windows / AI Assistant */}
        <button className="taskbar-icon" 
        onClick ={onWindowsClick}>
          <img
            src="/icons/windows.svg"
            alt="Windows"
            className="windows-logo"
          />
        </button>

        {/* Search */}
        <button
  className="taskbar-icon"
  onClick={onSearchClick}
>
  <Search size={21} strokeWidth={2} />
</button>

        {/* GitHub */}
        <button className="taskbar-icon"
          onClick={() => window.open(GITHUB_URL, "_blank")} >
          <img
            src="/icons/github.png"
            alt="GitHub"
            className="brand-image"
          />
        </button>

        {/* LeetCode */}
        <button className="taskbar-icon"
          onClick={()=> window.open(LEETCODE_URL,'_blank')}>
          <img
            src="/icons/leetcode.png"
            alt="LeetCode"
            className="brand-image"
          />
        </button>

      </div>

      <div className="system-tray">

        <Volume2 size={17} />
        <Wifi size={17} />
        <Battery size={18} />

        <div className="clock">
          <div>21:47</div>
          <div>14/08/2026</div>
        </div>

      </div>

    </div>
  );
}