import {useState, useEffect} from "react"
import api from "../api"
import Note from "../components/Note"
import Ride from "../components/Ride"
import "../styles/Home.css"
import Map from "../components/MapContainer"

function Home() {
    const [notes, setNotes] = useState([]);
    const [rides, setRides] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [formData, setFormData] = useState({
        from_location: '',
        to_location: '',
        from_lat: '',
        from_lon: '',
        to_lat: '',
        to_lon: '',
        date: '',
        time: '',
        seats_available: 1,
        luggage_capacity: '',
        additional_notes: ''
      });
    useEffect(() => {
        getNotes();
        getRides();
    }, [])


    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => res.data)
            .then((data) => { setNotes(data); console.log(data); })
            .catch((err) => alert(err));
    };




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

    const getRides = () => {
        api
            .get("/api/rides/")
            .then((res) => res.data)
            .then((data) => { setRides(data); console.log(data); })
            .catch((err) => alert(err));
    };

    const deleteRide = (id) => {
        api.delete(`/api/rides/delete/${id}/`).then((res) => {
            if (res.status === 204) alert("Note deleted")
            else alert("Failed to delete note.")
            getRides();
        }).catch((error) => alert(error));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await api.post('/api/rides/', formData);
          console.log('Ride created:', response.data);
          getRides();
          // Handle successful submission (e.g., clear form, show success message)
        } catch (error) {
          console.error('Error creating ride:', error);
          // Handle submission error (e.g., show error message)
        }
      }






    const deleteNote = (id) => {
        api.delete(`/api/notes/delete/${id}/`).then((res) => {
            if (res.status === 204) alert("Note deleted")
            else alert("Failed to delete note.")
            getNotes();
        }).catch((error) => alert(error));
    }

    const createNote = (e) => {
        e.preventDefault()
        api.post("/api/notes/", {content, title}). then((res) => {
            if (res.status === 201) alert("Note created")
            else alert("Failed to make note.")
            getNotes();
        }).catch((error) => alert(error));
    }

    return <div>
        <div>
            <h2>Notes</h2>
            {notes.map((note) =>(
                <Note note={note} onDelete={deleteNote} key={note.id} />
            ))}
        </div>
        <h2>Create a Note</h2>
        <form onSubmit={createNote}>
            <label htmlFor="title">Title:</label>
            <br/>
            <input 
                type="text"
                id="title"
                name="title"
                required
                onChange={(e) => setTitle(e.target.value)}
                value={title}
            />
            <label htmlFor="content">Content:</label>
            <br/>
            <textarea 
                id="content" 
                name="content" 
                required 
                value={content} 
                onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <br/>
            <input type="submit" value="Submit"></input>
        </form>












        <div>
            <h2>Rides</h2>
            {rides.map((ride) =>(
                <Ride 
            ride={ride} 
            onDelete={deleteRide} 
            key={ride.id} 
        />            ))}
        </div>
      <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="from_location"
        value={formData.from_location}
        onChange={handleChange}
        placeholder="From Location"
        required
      />
      <input
        type="text"
        name="to_location"
        value={formData.to_location}
        onChange={handleChange}
        placeholder="To Location"
        required
      />
      <input
        type="number"
        name="from_lat"
        value={formData.from_lat}
        onChange={handleChange}
        placeholder="From Latitude"
        step="any"
      />
      <input
        type="number"
        name="from_lon"
        value={formData.from_lon}
        onChange={handleChange}
        placeholder="From Longitude"
        step="any"
      />
      <input
        type="number"
        name="to_lat"
        value={formData.to_lat}
        onChange={handleChange}
        placeholder="To Latitude"
        step="any"
      />
      <input
        type="number"
        name="to_lon"
        value={formData.to_lon}
        onChange={handleChange}
        placeholder="To Longitude"
        step="any"
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <input
        type="time"
        name="time"
        value={formData.time}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="seats_available"
        value={formData.seats_available}
        onChange={handleChange}
        min="1"
        required
      />
      <input
        type="text"
        name="luggage_capacity"
        value={formData.luggage_capacity}
        onChange={handleChange}
        placeholder="Luggage Capacity"
      />
      <textarea
        name="additional_notes"
        value={formData.additional_notes}
        onChange={handleChange}
        placeholder="Additional Notes"
      />
      <button type="submit">Create Ride</button>
    </form>
    </div>
}

export default Home