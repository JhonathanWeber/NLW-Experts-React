

export class Notes {
    findNotesOnStorage() {
        const notesOnStorage = localStorage.getItem("notes");
        if (notesOnStorage) return JSON.parse(notesOnStorage);
        return [];

    }

}
