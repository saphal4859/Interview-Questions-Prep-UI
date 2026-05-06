import { useEffect, useState } from "react";

import {
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  NotebookPen,
  Boxes,
  Leaf,
  Atom,
  Cpu,
  Search,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

export default function NotesSidebar({
  notesData,
  selectedUrl,
  setSelectedUrl,
  setSelectedTitle,
  sidebarOpen,
  setSidebarOpen,
}) {
  const [expandedSections, setExpandedSections] = useState({});

  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Persist selected note
  useEffect(() => {
    localStorage.setItem("selected-note", selectedUrl);
  }, [selectedUrl]);

  // 🔹 Toggle parent
  const toggleSection = (sectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  // 🔹 Parent Icons
  const getParentIcon = (name) => {
    const lower = name.toLowerCase();

    if (lower.includes("spring")) {
      return <Leaf size={17} />;
    }

    if (lower.includes("react")) {
      return <Atom size={17} />;
    }

    if (lower.includes("dsa")) {
      return <Cpu size={17} />;
    }

    if (lower.includes("system")) {
      return <Boxes size={17} />;
    }

    return <NotebookPen size={17} />;
  };

  // 🔹 Filter notes
  const filteredNotes = notesData
    .map((item) => {
      // DIRECT NOTE
      if (item.url) {
        const matches = item.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        return matches ? item : null;
      }

      // CHILDREN
      const filteredChildren =
        item.children?.filter((child) =>
          child.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ) || [];

      // Auto expand matching parents
      if (searchTerm && filteredChildren.length > 0) {
        expandedSections[item.name] = true;
      }

      return filteredChildren.length > 0
        ? {
            ...item,
            children: filteredChildren,
          }
        : null;
    })
    .filter(Boolean);

  return (
    <motion.div
      animate={{
        width: sidebarOpen ? 288 : 60,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
        bg-white border-r flex flex-col
        shadow-sm
      "
    >
      {/* HEADER */}
      <div
        className="
          h-[60px]
          border-b
          flex items-center justify-between
          px-3
          shrink-0
        "
      >
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{
                opacity: 0,
                x: -8,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -8,
              }}
              className="
                flex items-center gap-2
              "
            >
              <NotebookPen size={19} className="text-indigo-600" />

              <h1 className="text-lg font-semibold">Notes</h1>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="
            w-8 h-8 rounded-lg
            flex items-center justify-center
            hover:bg-gray-100
            transition
          "
        >
          {sidebarOpen ? (
            <PanelLeftClose size={18} />
          ) : (
            <PanelLeftOpen size={18} />
          )}
        </button>
      </div>

      {/* SEARCH */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
            }}
            className="p-3 border-b"
          >
            <div className="relative">
              <Search
                size={15}
                className="
                  absolute left-3 top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  w-full
                  pl-9 pr-3 py-2
                  text-sm
                  border rounded-xl
                  bg-gray-50
                  focus:outline-none
                  focus:ring-2
                  focus:ring-indigo-500/30
                  focus:border-indigo-400
                "
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filteredNotes.map((item) => {
          const hasChildren = item.children?.length > 0;

          // 🔹 DIRECT NOTE
          if (!hasChildren) {
            return (
              <button
                key={item.name}
                onClick={() => {
                  setSelectedUrl(item.url);

                  setSelectedTitle(item.name);
                }}
                className={`
                  relative
                  w-full
                  flex items-center gap-3
                  px-3 py-2.5
                  rounded-xl
                  text-sm
                  transition-all duration-200
                  hover:bg-gray-100
                  hover:translate-x-[2px]
                  ${
                    selectedUrl === item.url
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-700"
                  }
                `}
              >
                {/* ACTIVE BAR */}
                {selectedUrl === item.url && (
                  <motion.div
                    layoutId="active-pill"
                    className="
                      absolute left-0 top-1 bottom-1
                      w-1 rounded-r-full
                      bg-indigo-600
                    "
                  />
                )}

                <div className="text-gray-500">{getParentIcon(item.name)}</div>

                {sidebarOpen && <span className="truncate">{item.name}</span>}
              </button>
            );
          }

          // 🔹 PARENT
          return (
            <div key={item.name}>
              <button
                onClick={() => toggleSection(item.name)}
                className="
                  w-full
                  flex items-center justify-between
                  px-3 py-2.5
                  rounded-xl
                  hover:bg-gray-100
                  transition-all duration-200
                "
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-500">
                    {getParentIcon(item.name)}
                  </div>

                  {sidebarOpen && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </div>

                {sidebarOpen && (
                  <motion.div
                    animate={{
                      rotate: expandedSections[item.name] ? 90 : 0,
                    }}
                  >
                    <ChevronRight size={16} className="text-gray-400" />
                  </motion.div>
                )}
              </button>

              {/* CHILDREN */}
              <AnimatePresence>
                {expandedSections[item.name] && sidebarOpen && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.22,
                    }}
                    className="
                        overflow-hidden
                      "
                  >
                    <div
                      className="
                          ml-5 pl-4
                          border-l border-gray-200
                          space-y-1 mt-1
                        "
                    >
                      {item.children.map((child) => (
                        <button
                          key={child.name}
                          onClick={() => {
                            setSelectedUrl(child.url);

                            setSelectedTitle(`${item.name} / ${child.name}`);
                          }}
                          className={`
                                relative
                                w-full text-left
                                px-3 py-2
                                rounded-lg
                                text-sm
                                transition-all duration-200
                                hover:bg-gray-100
                                hover:translate-x-[2px]
                                ${
                                  selectedUrl === child.url
                                    ? "bg-indigo-50 text-indigo-700 font-medium"
                                    : "text-gray-600"
                                }
                              `}
                        >
                          {/* ACTIVE BAR */}
                          {selectedUrl === child.url && (
                            <motion.div
                              layoutId="active-pill"
                              className="
                                    absolute left-0 top-1 bottom-1
                                    w-1 rounded-r-full
                                    bg-indigo-600
                                  "
                            />
                          )}

                          {child.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
