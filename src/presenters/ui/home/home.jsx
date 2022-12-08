import { useContext, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { GlobalContext } from '../../utils/context';
import { FaUserAlt } from 'react-icons/fa';

export default function Home() {

    const [ , setActive ] = useContext(GlobalContext);

    useEffect(() => {
        setActive(0);
    }, [setActive]);

    return (
        <main className='pt-4'>
            <Container className='p-5'>
                <Row className='pt-5'>
                    <Col>
                        <div className='d-flex p-5 rounded' style={{backgroundColor: '#F2F2F2'}}>
                            <div className='p-5 rounded-circle' style={{backgroundColor: '#666666'}}>
                                <FaUserAlt size={120}/>
                            </div>
                            Usuário Atual
                        </div>
                    </Col>
                </Row>
                <Row className='py-5'>
                    <Col className='pe-4'>Noticias</Col>
                    <Col className='ps-4'>Produtos</Col>
                </Row>
            </Container>
        </main>
    );
}