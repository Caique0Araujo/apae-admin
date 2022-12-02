import { Formik } from "formik";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import './css/Users.min.css';
import * as yup from 'yup';
import { postCreateUser, postGetAll } from "../../../infra/repositories/user-repository";
import { toast, ToastContainer } from 'react-toastify';
import UserItem from "./components/user-item/user-item";
import { useEffect, useState } from "react";

const schema = yup
    .object()
    .shape({
        name: yup
            .string()
            .required('Insira o seu Nome')
            .min(5, 'Insira no mínimo 5 caracteres')
            .max(20, 'Insira no máximo 100 caracteres'),
        login: yup
            .string()
            .required('Insira o seu Login')
            .min(5, 'Insira no mínimo 5 caracteres')
            .max(20, 'Insira no máximo 20 caracteres'),
        password: yup
            .string()
            .required('Insira a sua Senha')
            .min(5, 'Insira no mínimo 5 caracteres')
            .max(15, 'Insira no máximo 15 caracteres')
    })
    .required();

export default function Users(props) {

    const [userSelected, setUserSelected] = useState(-1);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = props.token;

    useEffect(() => {
        getAllUsers();
    }, []);

    const getAllUsers = () => {
        setLoading(true);

        setTimeout(() => {
            postGetAll(token)
            .then((res) => {
                setUsers(res);
            })
            .catch((err) => {
                if (err.msg != null) {
                    toast(err.msg);
                } else {
                    toast('Ocorreu um erro interno');
                }
                setUsers([]);
            })
            .finally(() => {
                setLoading(false);
            });
        }, 2000);
    }

    const _submit = (data, { setSubmitting, resetForm }) => {
        postCreateUser(data.name, data.login, data.password, token)
            .then(() => {
                toast.success('Usuário criado com sucesso');
                resetForm();
            })
            .catch((err) => {
                if (err.msg !== undefined) {
                    toast(err.msg);
                } else {
                    toast('Ocorreu um erro interno');
                }
            })
            .finally(() => {
                setSubmitting(false);
            });
    }

    const selectUser = (id) => {
        if (userSelected === id) {
            setUserSelected(-1);
            return;
        }

        setUserSelected(id);
    }

    return (
        <main>
            <ToastContainer/>

            <Container fluid>
                <Row>
                    <Col className='left-side mt-5 pt-5 mx-3'>
                        <h2>Usuários</h2>
                        <p>Cadastre aqui novos usuários que poderão administrar o sistema</p>

                        <Formik
                            validationSchema={schema}
                            onSubmit={_submit}
                            initialValues={{
                                name: '',
                                login: '',
                                password: '',
                            }}
                        >
                            {({
                                handleSubmit,
                                handleChange,
                                values,
                                touched,
                                errors,
                                isSubmitting
                            }) => (
                                <Form noValidate onSubmit={handleSubmit} className='d-flex flex-column align-items-center my-4'>
                                    <Form.Group className="my-2 w-100">
                                        <Form.Control 
                                            placeholder="Nome"
                                            name="name"
                                            value={values.name || ''}
                                            onChange={handleChange}
                                            isValid={touched.name && !errors.name}
                                            isInvalid={!!errors.name}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="my-2 w-100">
                                        <Form.Control 
                                            placeholder="Login"
                                            name="login"
                                            value={values.login || ''}
                                            onChange={handleChange}
                                            isValid={touched.login && !errors.login}
                                            isInvalid={!!errors.login}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.login}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="my-2 w-100">
                                        <Form.Control 
                                            placeholder="Senha" 
                                            type="password"
                                            name="password"
                                            value={values.password || ''}
                                            onChange={handleChange}
                                            isValid={touched.password && !errors.password}
                                            isInvalid={!!errors.password}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Button type="submit" className="my-4 py-2 px-4" disabled={isSubmitting}>
                                        { isSubmitting ? <Spinner size="sm"/> : 'Cadastrar' }
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Col>

                    <div className="bar vh-100"></div>

                    <Col className="d-flex flex-column mt-5 pt-5 mx-3 align-items-center">
                        <h2 className='w-100'>Usuários cadastrados</h2>
                        <p>Para editar dados de um usuário cadastrado basta clicar nele e os dados serão preenchidos nos campos ao lado para serem editados.<br/>Para excluir um usuário clique nele e o botão “Excluir” irá aparecer.</p>
                    
                        { 
                            loading && 
                                <div className='d-flex flex-fill justify-content-center align-items-center'>
                                    <Spinner className="text-primary"/>
                                </div> 
                        }
                        
                        <Row>
                            { 
                                users.length > 0 && !loading && users.map((val) => 
                                    <UserItem 
                                        key={val.id_user} 
                                        id={val.id_user} 
                                        title={val.name} 
                                        subtitle={val.login} 
                                        active={userSelected === val.id_user} 
                                        onClick={selectUser}
                                    /> 
                                ) 
                            }
                        </Row>

                        { userSelected !== -1 && <Button className="my-4 py-2 px-4">Excluir</Button> }
                    </Col>
                </Row>
            </Container>
        </main>
    );
}