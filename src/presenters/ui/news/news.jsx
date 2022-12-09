import { Formik, useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { GlobalContext } from "../../utils/context";
import * as yup from 'yup';
import ImgBg from '../../../assets/images/image_background.png';
import './css/News.min.css';
import { createNews, deleteNews, getAll } from "../../../infra/repositories/news-repository";
import { getCookie } from 'react-use-cookie';
import { invalidToken } from "../../utils/redirect";
import { useNavigate } from "react-router-dom";
import NewsItem from "./components/news-item/news-item";

const schema = yup
    .object()
    .shape({
        title: yup
            .string()
            .required('Insira o título da Notícia')
            .max(100, 'Insira no máximo 100 caracteres'),
        text: yup
            .string()
            .required('Insira as informações sobre a Notícia')
            .min(10, 'Insira no mínimo 10 caracteres'),
        file: yup
            .mixed()
            .required('Insira a imagem de capa da Notícias')
    })
    .required();


export default function News() {
    const [ , setActive ] = useContext(GlobalContext);
    const [ news, setNews ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ newsSelected, setNewsSelected ] = useState(-1);
    const [ file, setFile ] = useState(undefined);
    const token = getCookie('token');
    const navigate = useNavigate();

    const _onSubmit = (data, { setSubmitting, resetForm }) => {
        setSubmitting(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', data.title);
        formData.append('text', data.text);

        createNews(formData, token)
            .then(() => {
                toast.success('Noticia criada com sucesso');
                setFile(undefined);
                getAllNews();
                resetForm();
            })
            .catch((err) => {
                if (err.status === 401) {
                    invalidToken(navigate);
                } else if (err.msg !== undefined) {
                    toast(err.msg);
                } else {
                    toast('Ocorreu um erro interno');
                }
            })
            .finally(() => {
                setSubmitting(false);
            });
    }

    const formikProps = useFormik({
        onSubmit: _onSubmit,
        validationSchema: schema,
        initialValues: {
            title: '',
            text: '',
            file: undefined,
        },
    });

    useEffect(() => {
        setActive(2);
        getAllNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setActive]);

    const getAllNews = () => {
        setLoading(true);

        getAll(token)
            .then((res) => {
                setNews(res);
            })
            .catch((err) => {
                if (err.status === 401) {
                    invalidToken(navigate);
                } else if (err.msg !== undefined) {
                    toast(err.msg);
                } else {
                    toast('Ocorreu um erro interno');
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const _setFile = (e) => {
        const f = e.target.files[0];
        setFile(f);

        formikProps.setFieldValue('file', e.target.files);
    }

    const selectNews = (id) => {
        if (newsSelected === id) {
            setNewsSelected(-1);
            return;
        }
        setNewsSelected(id);
    }

    const deleteSelectedNews = () => {
        if (newsSelected === -1) {
            return;
        }

        deleteNews(newsSelected, token)
            .then(() => {
                toast.success('Noticia deletada com sucesso');
                getAllNews();
                setNewsSelected(-1);
            })
            .catch((err) => {
                if (err.status === 401) {
                    invalidToken(navigate);
                } else if (err.msg !== undefined) {
                    toast(err.msg);
                } else {
                    toast('Ocorreu um erro interno');
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <main className="news">
            <ToastContainer/>

            <Container fluid>
                <Row className='vh-100'>
                    <Col className='left-side mt-5 pt-5 mx-3'>
                        <h2>Notícias</h2>
                        <p>Cadastre aqui novas notícias para aparecerem no site</p>

                        <Formik>
                            <Form noValidate onSubmit={formikProps.handleSubmit} className='d-flex flex-fill flex-column align-items-center my-4'>
                                <Form.Group className="my-2 w-100">
                                    <Form.Control 
                                        placeholder="Título"
                                        name="title"
                                        value={formikProps.values.title || ''}
                                        onChange={formikProps.handleChange}
                                        isValid={formikProps.touched.title && !formikProps.errors.title}
                                        isInvalid={!!formikProps.errors.title}
                                    />
                                    <Form.Control.Feedback type="invalid">{formikProps.errors.title}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="my-2 w-100">
                                    <Form.Control 
                                        placeholder="Conteúdo"
                                        name="text"
                                        as="textarea"
                                        value={formikProps.values.text || ''}
                                        onChange={formikProps.handleChange}
                                        isValid={formikProps.touched.text && !formikProps.errors.text}
                                        isInvalid={!!formikProps.errors.text}
                                    />
                                    <Form.Control.Feedback type="invalid">{formikProps.errors.text}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="my-2 w-100">
                                    <Form.Control 
                                        type="file"
                                        name="file"
                                        value={undefined}
                                        onChange={_setFile}
                                        multiple={false}
                                        isValid={formikProps.touched.file && !formikProps.errors.file}
                                        isInvalid={!!formikProps.errors.file}
                                    />
                                    <Form.Control.Feedback type="invalid">{formikProps.errors.file}</Form.Control.Feedback>
                                </Form.Group>

                                <Button type="submit" className="my-4 py-2 px-4" disabled={formikProps.isSubmitting}>
                                    { formikProps.isSubmitting ? <Spinner size="sm"/> : 'Salvar' }
                                </Button>
                            </Form>
                        </Formik>
                    </Col>

                    <div className="bar"></div>

                    <Col className="d-flex flex-column mt-5 pt-5 mx-3 align-items-center">
                        <h2 className='w-100'>Notícias cadastradas</h2>
                        <p className='w-100'>Para editar dados de uma notícia cadastrado basta clicar nela e os dados serão preenchidos nos campos ao lado para serem editados.<br/>Para excluir uma notícia clique nela e o botão “Excluir” irá aparecer.</p>
                    
                        { 
                            loading && 
                                <div className='d-flex flex-fill justify-content-center align-items-center'>
                                    <Spinner className="text-primary"/>
                                </div>
                        }

                        {
                            news.length === 0 && !loading &&
                                <div className='w-100 d-flex mt-5'>
                                    <img src={ImgBg} alt='background' height={350}/>
                                </div>
                        }
                        
                        <Row>
                            { 
                                news.length > 0 && !loading && news.map((val) => 
                                    <NewsItem 
                                        key={val.id_news} 
                                        id={val.id_news} 
                                        title={val.title} 
                                        active={newsSelected === val.id_news} 
                                        buffer={val.image_path}
                                        onClick={selectNews}
                                    /> 
                                ) 
                            }
                        </Row>

                        { 
                            newsSelected !== -1 && 
                                <Button className="my-4 py-2 px-4" onClick={deleteSelectedNews}>Excluir</Button> 
                        }
                    </Col>
                </Row>
            </Container>
        </main>
    );
}