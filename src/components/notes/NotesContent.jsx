import { ExternalLink } from "lucide-react";

export default function NotesContent({ selectedUrl, selectedTitle }) {
  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* TOP BAR */}
      <div
        className="
          h-[60px]
          bg-white border-b
          px-5
          flex items-center justify-between
          shrink-0
        "
      >
        {/* BREADCRUMB */}
        <div className="text-sm truncate">
          <span className="text-gray-900 font-medium">{selectedTitle}</span>
        </div>

        {/* OPEN BUTTON */}
        <button
          onClick={() => window.open(selectedUrl, "_blank")}
          className="
            flex items-center gap-1.5
            text-sm text-gray-600
            hover:text-indigo-600
            transition
          "
        >
          <ExternalLink size={15} />
          Open
        </button>
      </div>

      {/* IFRAME */}
      <div className="flex-1 bg-white">
        <iframe
          src={selectedUrl}
          title="Notes"
          className="
            w-full h-full border-0
          "
        />
      </div>
    </div>
  );
}
