import { FileText, Folder } from "lucide-react";
import Taskbar from "./Taskbar";
import { useState } from "react";
import ChatWindow from "./ChatWindow";
import ProjectsWindow from "./ProjectsWindow";
import SearchWindow from "./SearchWindow";

export default function Desktop() {

  const [chatOpen,setChatOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const handleWindowsClick = ()=>{
    setChatOpen(true);
  }

  const handleCloseChat =()=>{
    setChatOpen(false);
  }
  const handleSearchClick = () => {
  setSearchOpen(true);
};

  return (
    <div className="desktop">

      <div className="desktop-icons">

       {/* Resume */}
        <div
          className="desktop-icon"
          onClick={() => window.open("/resume.pdf", "_blank")}
        >
          <FileText size={42} strokeWidth={1.5} />
          <span>Resume</span>
        </div>

       {/* About Me */}
          <div
            className="desktop-icon"
            onClick={() =>
              window.open("https://yashiyadav7.my.canva.site/", "_blank")
            }
          >
            <Folder size={42} strokeWidth={1.5} />
            <span>About Me</span>
          </div>

        {/* Projects */}
      <div
        className="desktop-icon"
        onClick={() => setProjectsOpen(true)}
      >
        <Folder size={42} strokeWidth={1.5} />
        <span>Projects</span>
      </div>

      </div>

      {/* AI ASSISTANT */}

      {chatOpen && (
      <ChatWindow onClose={handleCloseChat}/>
      )}
      {projectsOpen && (
  <ProjectsWindow
    onClose={() => setProjectsOpen(false)}
  />
)}
{searchOpen && (
  <SearchWindow
    onClose={() => setSearchOpen(false)}
    onOpenAI={handleWindowsClick}
    onOpenProjects={() => setProjectsOpen(true)}
  />
)}



 {/* TASKBAR */}
      <Taskbar
  onWindowsClick={handleWindowsClick}
  onSearchClick={handleSearchClick}
/>

    </div>
  );
}