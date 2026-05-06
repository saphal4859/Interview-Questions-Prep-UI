import { useMemo, useState } from "react";

import TopFilterBar from "../components/TopFilterBar";

import NotesSidebar from "../components/notes/NotesSidebar";
import NotesContent from "../components/notes/NotesContent";

import { notesData } from "../data/notesData";

export default function NotesPage() {
  // 🔹 Initial note
  const initialData = useMemo(() => {
    for (const item of notesData) {
      if (item.url) {
        return {
          url: item.url,
          title: item.name,
        };
      }

      if (item.children?.length > 0) {
        return {
          url: item.children[0].url,
          title: `${item.name} / ${item.children[0].name}`,
        };
      }
    }

    return {
      url: "",
      title: "",
    };
  }, []);

  const savedNote = localStorage.getItem("selected-note");

  const [selectedUrl, setSelectedUrl] = useState(savedNote || initialData.url);

  const [selectedTitle, setSelectedTitle] = useState(initialData.title);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* 🔥 TOP BAR */}
      <TopFilterBar showFilters={false} />

      {/* 🔹 MAIN */}
      <div className="flex flex-1 overflow-hidden">
        <NotesSidebar
          notesData={notesData}
          selectedUrl={selectedUrl}
          setSelectedUrl={setSelectedUrl}
          setSelectedTitle={setSelectedTitle}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <NotesContent selectedUrl={selectedUrl} selectedTitle={selectedTitle} />
      </div>
    </div>
  );
}
