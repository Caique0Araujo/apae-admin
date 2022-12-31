import { useContext, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { GlobalContext } from '../../utils/context';
import { FaUserAlt } from 'react-icons/fa';
import './css/Home.min.css';
import { countProduct } from '../../../infra/repositories/product-repository';
import reactUseCookie from 'react-use-cookie';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { invalidToken } from "../../utils/redirect";
import { countNews } from '../../../infra/repositories/news-repository';
import { getUserByToken } from '../../../infra/repositories/user-repository';

export default function Home() {

    const [ , setActive ] = useContext(GlobalContext);
    const [ token ] = reactUseCookie('token');
    const [ userName, setUserName ] = useState('');
    const [ countProducts, setCountProducts] = useState(0);
    const [ news, setProducts] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        setActive(0);

        getCountProducts();
        getCountNews();
        getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setActive]);

    const getCountProducts = () => {
        countProduct(token)
            .then((res) => {
                setCountProducts(res.products_quantity);
            })
            .catch((err) => {
                if (err.status === 401) {
                    invalidToken(navigate);
                } else if (err.msg !== undefined) {
                    toast(err.msg);
                } else {
                    toast('Ocorreu um erro interno');
                }
            });
    }

    const getCountNews = () => {
        countNews(token)
            .then((res) => {
                setProducts(res.news_quantity);
            })
            .catch((err) => {
                if (err.status === 401) {
                    invalidToken(navigate);
                } else if (err.msg !== undefined) {
                    toast(err.msg);
                } else {
                    toast('Ocorreu um erro interno');
                }
            });
    }

    const getUser = () => {
        getUserByToken(token)
            .then((res) => {
                setUserName(res.name);
            })
            .catch((err) => {
                if (err.status === 401) {
                    invalidToken(navigate);
                } else if (err.msg !== undefined) {
                    toast(err.msg);
                } else {
                    toast('Ocorreu um erro interno');
                }
            });
    }

    return (
        <main className='pt-4'>
            <ToastContainer/>

            <Container className='p-5 home'>
                <Row className='pt-3'>
                    <Col>
                        <div className='d-flex p-4 rounded user-container'>
                            <div className='p-5 rounded-circle icon-bg'>
                                <FaUserAlt size={100} color={'white'}/>
                            </div>
                            <div className='d-flex flex-column ms-5'>
                                <span className='mb-5 user-title'>Usuário Atual</span>
                                <span className='user-name'>{userName}</span>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row className='pt-5'>
                    <Col className='pe-4'>
                        <div className='p-5 rounded d-flex flex-column align-items-center card-container'>
                            <span className='pb-4 text-center card-title'>Número de notícias publicadas</span>
                            <span className='py-3 card-qtd'>{news}</span>
                        </div>
                    </Col>

                    <Col className='pe-4'>
                        <div className='p-5 rounded d-flex flex-column align-items-center card-container'>
                            <span className='pb-4 text-center card-title'>Número de produtos no bazar</span>
                            <span className='py-3 card-qtd'>{countProducts}</span>
                        </div>
                    </Col>
                </Row>
            </Container>
        </main>
    );
}