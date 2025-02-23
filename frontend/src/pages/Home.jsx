import { useState, useEffect } from "react";
import api from "../api";
import Ride from "../components/Ride";
import "../styles/Home.css";
import Map from "../components/MapContainer";

function Home() {
  return (
    <div>
      <Map />
    </div>
  );
}

export default Home;
