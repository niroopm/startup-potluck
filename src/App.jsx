import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import Members from './pages/Members.jsx';
import Rsvp from './pages/Rsvp.jsx';
import Events from './pages/Events.jsx';
import Contact from './pages/Contact.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/members" element={<Members />} />
          <Route path="/rsvp" element={<Rsvp />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact" element={<Contact />} />
          {/* Not linked in the header nav on purpose — direct URL only. */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
