import Login from "./presenters/ui/login/login";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { useCookies } from "react-cookie";
import Home from "./presenters/ui/home/home";

function App() {

  const [ cookies ] = useCookies(['token']);

  if (cookies.token === undefined) {
    return <Login/>
  }

  return (
    <Home/>
  );
}

export default App;
