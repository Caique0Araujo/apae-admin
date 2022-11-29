import Login from "./presenters/ui/login/login";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { useCookies } from "react-cookie";
import Home from "./presenters/ui/home/home";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SideMenuBarComponent from "./presenters/components/side-menu-bar-component/side-menu-bar-component";

function App() {

  const [ cookies ] = useCookies(['token']);

  if (cookies.token === undefined) {
    return <Login/>
  }

  return (
    <BrowserRouter>
      <header>
          <SideMenuBarComponent/>
      </header>

      <Routes>
        <Route path='/' element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
