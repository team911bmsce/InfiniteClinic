import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TView from "./components/tests/TView";
import About from "./components/About";
import NavBar from "./components/NavBar";
import PView from "./components/patients/PView";
import TimeSlotsView from "./components/timeslots/TimeSlotsView";
import UTestView from "./components/userpages/UTestView";

function App() {
  const myWidth = 240;
  return (
    <div className="App">
      <NavBar
        drawerWidth={myWidth}
        content={
          <Routes>
            <Route path="tests/" element={<TView />} />
            <Route path="/patients" element={<PView />} />
            <Route path="/view" element={<UTestView />} />
            <Route path="tests/:id/timeslots" element={<TimeSlotsView />} />
          </Routes>
        }
      />
    </div>
  );
}

export default App;
