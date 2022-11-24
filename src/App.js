import Login from "./presenters/ui/login/login";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-bootstrap";

function App() {
  return (
    <div className="App">
      <Login/>
    </div>
  );
}

export default App;
