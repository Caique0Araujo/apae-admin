import { Container, Nav } from "react-bootstrap";
import SideMenuItemComponent from "../side-menu-item-component/side-menu-item-component";
import './css/SideMenuBarComponent.min.css';
import LogoApae from '../../../assets/images/logo-apae.png';
import { FaHome, FaUserAlt, FaNewspaper } from 'react-icons/fa';
import { IoBasket } from 'react-icons/io5';

export default function SideMenuBarComponent(props) {

    return (
        <Nav className="collapse d-lg-block sidebar collapse">
            <Container className='d-flex flex-column mt-3 mb-5 align-items-center'>
                <div className='bg-white rounded-circle'>
                    <img alt='Logo APAE' src={LogoApae} width={100}/>
                </div>

                <h3 className='text-center my-2'>APAE - SJE<br/>Administrativo</h3>
            </Container>
            
            <div className="position-sticky">
                <div className="list-group list-group-flush mx-3 mt-4">
                    <SideMenuItemComponent text='Início' icon={<FaHome/>} to='/' id={0}/>
                    <SideMenuItemComponent text='Usuários' icon={<FaUserAlt/>} to='/usuarios' id={1}/>
                    <SideMenuItemComponent text='Notícias' icon={<FaNewspaper/>} to='#' id={2}/>
                    <SideMenuItemComponent text='Produtos' icon={<IoBasket/>} to='#' id={3}/>
                </div>
            </div>
        </Nav>
    );
}