import { Container } from 'react-bootstrap';
import SideMenuBarComponent from '../../components/side-menu-bar-component/side-menu-bar-component';
import './css/Home.min.css';

export default function Home() {
    return (
        <div>
            <header>
                <SideMenuBarComponent/>
            </header>

            <main>
                <Container className='pt-4'>
                    <h2>Hello World</h2>
                </Container>
            </main>
        </div>
    );
}