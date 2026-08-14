const projects = [
  {
    name: "QueryMind",
    description: "AI-powered Natural Language to SQL",
    url: "https://qureymind-1.onrender.com/",
  },
  {
    name: "AI Farmer Query Support",
    description: "Smart India Hackathon Project",
    url: "https://farmer-project-1-fr0p.onrender.com/",
  },
  {
    name: "Mental Health Score Prediction",
    description: "FastAPI + Scikit-learn",
    url: "https://mental-health-frontend-qu5k.onrender.com/",
  },
  {
    name: "MoodMate",
    description: "AI-powered emotion analysis",
    url: null,
  },
];

export default function ProjectsWindow({ onClose }) {
  const openProject = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="projects-window">

      <div className="projects-titlebar">

        <div className="projects-title">
          📁 Projects
        </div>

        <button
          className="window-close"
          onClick={onClose}
        >
          ×
        </button>

      </div>

      <div className="projects-toolbar">

  <button className="toolbar-button">
    ←
  </button>

  <button className="toolbar-button">
    →
  </button>

  <button className="toolbar-button">
    ↑
  </button>

  <div className="address-bar">
    <span>📁</span>
    <span>This PC</span>
    <span className="path-arrow">›</span>
    <span>Projects</span>
  </div>

</div>

      <div className="projects-content">

        {projects.map((project) => (

          <div
            key={project.name}
            className={`project-item ${
              project.url ? "project-clickable" : "project-disabled"
            }`}
            onClick={() => openProject(project.url)}
          >

            <div className="project-icon">
              📁
            </div>

            <div>

              <strong>
                {project.name}
              </strong>

              <span>
                {project.description}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}