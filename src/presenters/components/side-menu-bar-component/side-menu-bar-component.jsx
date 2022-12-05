import { Container, Nav } from "react-bootstrap";
import SideMenuItemComponent from "../side-menu-item-component/side-menu-item-component";
import './css/SideMenuBarComponent.min.css';
import LogoApae from '../../../assets/images/logo-apae.png';
import { FaHome, FaUserAlt, FaNewspaper } from 'react-icons/fa';
import { IoBasket } from 'react-icons/io5';
import { SlLogout } from 'react-icons/sl';
import { invalidToken } from "../../utils/redirect";
import { useNavigate } from "react-router-dom";

export default function SideMenuBarComponent() {

    const navigate = useNavigate();

    const _onExit = () => {
        invalidToken(navigate);
    }

    return (
        <Nav className="d-lg-block sidebar">
            <Container className='d-flex flex-column mt-3 mb-5 align-items-center'>
                <div className='bg-white rounded-circle'>
                    <img alt='Logo APAE' src={LogoApae} width={100}/>
                </div>

                <h3 className='text-center my-2'>APAE - SJE<br/>Administrativo</h3>
            </Container>
            
            <div className="position-sticky">
                <div className="list-group list-group-flush mx-3">
                    <SideMenuItemComponent text='Início' icon={<FaHome/>} to='/' id={0}/>
                    <SideMenuItemComponent text='Usuários' icon={<FaUserAlt/>} to='/usuarios' id={1}/>
                    <SideMenuItemComponent text='Notícias' icon={<FaNewspaper/>} to='/noticias' id={2}/>
                    <SideMenuItemComponent text='Produtos' icon={<IoBasket/>} to='/produtos' id={3}/>
                </div>
            </div>

            <div className="position-bottom">
                <div className="list-group list-group-flush mx-3">
                    <SideMenuItemComponent text='Sair' icon={<SlLogout/>} id={-1} onClick={_onExit}/>
                </div>
            </div>
        </Nav>
    );
}