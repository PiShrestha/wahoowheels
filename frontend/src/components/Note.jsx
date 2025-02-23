import { useState, useEffect } from "react";
import api from "../api";
import SingleNote from "./SingleNote";
import "../styles/Note.css";
import LoadingIndicator from "./LoadingIndicator";

function Note() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Note deleted");
        else alert("Failed to delete note.");
        getNotes();
      })
      .catch((error) => alert(error));
  };

  const createNote = (e) => {
    e.preventDefault();
    setLoading(true);
    api
      .post("/api/notes/", { title, content })
      .then((res) => {
        if (res.status === 201) alert("Note created");
        else alert("Failed to make note.");
        getNotes();
      })
      .catch((error) => alert(error))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <h2>Notes</h2>
      {notes.map((note) => (
        <SingleNote note={note} onDelete={deleteNote} key={note.id} />
      ))}

      <h2>Create a Note</h2>
      <form onSubmit={createNote} className="form-container">
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <br />
        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          id="content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <br />
        {loading && <LoadingIndicator />}
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Note;
