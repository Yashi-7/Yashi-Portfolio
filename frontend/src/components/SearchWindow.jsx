import { useState } from "react";

const searchItems = [
  {
    name: "Resume",
    description: "View Yashi's resume",
    type: "resume",
  },
  {
    name: "About Me",
    description: "Learn more about Yashi",
    type: "about",
  },
  {
    name: "Projects",
    description: "View Yashi's projects",
    type: "projects",
  },
  {
    name: "AI Assistant",
    description: "Ask the AI assistant about Yashi",
    type: "ai",
  },
];

export default function SearchWindow({
  onClose,
  onOpenAI,
  onOpenProjects,
}) {
  const [search, setSearch] = useState("");

  const filteredItems = searchItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleItemClick = (item) => {
    if (item.type === "resume") {
      window.open("/resume.pdf", "_blank");
    }

    if (item.type === "about") {
      window.open(
        "https://yashiyadav7.my.canva.site/",
        "_blank"
      );
    }

    if (item.type === "projects") {
      onOpenProjects();
      onClose();
    }

    if (item.type === "ai") {
      onOpenAI();
      onClose();
    }
  };

  return (
    <div className="search-window">

      <div className="search-titlebar">

        <div className="search-title">
          🔍 Search
        </div>

        <button
          className="window-close"
          onClick={onClose}
        >
          ×
        </button>

      </div>

      <div className="search-content">

        <input
          autoFocus
          type="text"
          placeholder="Search this portfolio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <div className="search-results">

          {filteredItems.length > 0 ? (

            filteredItems.map((item) => (

              <div
                key={item.type}
                className="search-item"
                onClick={() => handleItemClick(item)}
              >

                <div className="search-item-icon">
                  {item.type === "resume" && "📄"}
                  {item.type === "about" && "📁"}
                  {item.type === "projects" && "📁"}
                  {item.type === "ai" && "✦"}
                </div>

                <div>
                  <strong>{item.name}</strong>
                  <span>{item.description}</span>
                </div>

              </div>

            ))

          ) : (

            <div className="no-results">
              No results found.
            </div>

          )}

        </div>

      </div>

    </div>
  );
}