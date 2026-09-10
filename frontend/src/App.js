import { useEffect, useState } from 'react';
import './App.css';
import { Footer } from './footer';
import { Context } from './usecontext';
import { Header } from './header';
import { Rout } from './routes';
import { AdminHeader } from './adminheader';
import ScrollToTop from './scrolltotop';
import { getStoredToken, clearStoredToken } from './auth';

function App() {
  const [id, setid] = useState("")
  const [utype, setutype] = useState("")
  const [mail, setmail] = useState("")

  useEffect(() => {
    try {
      const token = getStoredToken();
      if (!token) {
        setutype('');
        setid('');
        setmail('');
        return;
      }

      const parts = String(token).split('.');
      if (parts.length === 3) {
        const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(atob(payload));
        const role = decoded.usertype || decoded.userType || decoded.UserType || '';
        setutype(role);
        setid(decoded.id || '');
        setmail(decoded.mail || '');
      }
    } catch (error) {
      clearStoredToken();
      setutype('');
      setid('');
      setmail('');
    }
  }, []);

  return (
    <div className="App">
      <Context.Provider value={{ id, setid, utype, setutype, mail, setmail }}>
        {utype === 'admin' ? <AdminHeader /> : <Header />}
        <ScrollToTop />
        <Rout />
        <Footer />
      </Context.Provider>
    </div>
  );
}

export default App;
