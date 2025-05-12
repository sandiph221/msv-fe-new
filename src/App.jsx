import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login/Login";
import TestLogin from "./Pages/Login/Testlogin";
function Home() {
  return <h1 className="underline">THis still is Home Page</h1>;
}

function About() {
  return <h1 className="underline">About Page</h1>;
}

function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
