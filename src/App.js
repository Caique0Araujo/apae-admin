import Login from "./presenters/ui/login/login";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import useCookie from "react-use-cookie";
import Home from "./presenters/ui/home/home";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SideMenuBarComponent from "./presenters/components/side-menu-bar-component/side-menu-bar-component";
import Users from "./presenters/ui/users/users";
import './css/Default.min.css';
import { GlobalContext } from "./presenters/utils/context";
import { useState } from "react";
import News from "./presenters/ui/news/news";

function App() {

  const [ token ] = useCookie('token', '');
  const [ active, setActive ] = useState(0);

  if (token === '') {
    return <Login/>
  }

  return (
    <GlobalContext.Provider value={[active, setActive]}>
      <BrowserRouter>
        <header>
            <SideMenuBarComponent/>
        </header>

        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/usuarios' element={<Users />}/>
          <Route path="/noticias" element={<News />}/>
        </Routes>
      </BrowserRouter>
    </GlobalContext.Provider>
  );
}

export default App;
