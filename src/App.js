import Login from "./presenters/ui/login/login";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { useCookies } from "react-cookie";

function App() {

  const [ cookies ] = useCookies(['token']);

  if (cookies.token == undefined) {
    return <Login/>
  }

  return (
    <div>
      <p>Logado</p>
    </div>
  );
}

export default App;
