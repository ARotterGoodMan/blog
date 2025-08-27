import {Serverd} from "@/tools/Server.ts";
import {useGlobalStore} from "@/config/global.ts";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}


function loadNotesFromLocal(): Note[] {
  const saved = localStorage.getItem("notes");
  return saved ? JSON.parse(saved) : [];
}

function saveNotesToLocal(notes: Note[]): void {
  localStorage.setItem("notes", JSON.stringify(notes));
}

export async function loadNotes(): Promise<Note[]> {
  let global = useGlobalStore();
  if (global.user.token) {
    return Serverd.get_notes().then(
      (res) => {
        const data = res.data.data;
        console.log(res.data.data)
        return Array.isArray(data) ? data : [];
      },
      (err) => {
        console.error(
          "Failed to load notes from API, falling back to local storage.",
          err
        );
        return loadNotesFromLocal();
      }
    );
  } else {
    return loadNotesFromLocal();
  }
}

export async function saveNotes(notes: Note[]): Promise<void> {
  let global = useGlobalStore();
  if (global.user.token) {
    try {
      // 遍历保存每条笔记
      for (const note of notes) {
        await Serverd.save_note(note);
      }
    } catch (err) {
      console.error(
        "Failed to save notes to API, falling back to local storage.",
        err
      );
      saveNotesToLocal(notes);
    }
  } else {
    saveNotesToLocal(notes);
  }
}

export async function deleteNote(notes: Note[], id: string): Promise<Note[]> {
  const newNotes = notes.filter((n) => n.id !== id);
  let global = useGlobalStore();
  if (global.user.token) {
    try {
      await Serverd.delete_note(id);
    } catch (err) {
      console.error(
        "Failed to delete note from API, falling back to local storage.",
        err
      );
      saveNotesToLocal(newNotes);
    }
  } else {
    saveNotesToLocal(newNotes);
  }

  return newNotes;
}
