import { ChangeEvent, useState } from "react";
import logo from "./assets/logo-nlw-expert.svg";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";
import { Notes } from "./functions/notesFunctions";

export interface Note {
  id: string;
  date: Date;
  content: string;
}

const notesFunctions = new Notes();

export function App() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>(
    notesFunctions.findNotesOnStorage()
  );

  function onNoteCreated(content: string) {
    let uuid: any = () => crypto.randomUUID;
    const newNote = {
      id: uuid,
      date: new Date(),
      content: content,
    };
    const notesArray = [newNote, ...notes];
    setNotes(notesArray);
    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    setSearch(query);
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter((note) => note.id !== id);
    setNotes(notesArray);
    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLowerCase().includes(search.toLowerCase())
        )
      : notes;

  return (
    <>
      <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
        <img src={logo} alt="NLW Expert" />
        <form className="w-full">
          <input
            type="text"
            name=""
            id=""
            placeholder="Busque em suas notas"
            className="w-full bg-transparent text-3xl font-semibold tracking-tight placeholder:text-slate-500 outline-none"
            onChange={handleSearch}
          />
          <div className="h-px bg-slate-700"></div>
        </form>
        <div className="grid grid-cols-1 md:grid-col-2 lg:grid-cols-3 auto-rows-[250px] gap-6">
          <NewNoteCard onNoteCreated={onNoteCreated} />

          {filteredNotes.map((note) => {
            return (
              <NoteCard
                key={note.id}
                note={note}
                onDeleteNote={onNoteDeleted}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
