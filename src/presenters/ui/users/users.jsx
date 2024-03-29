import { Formik, useFormik } from "formik";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import './css/Users.min.css';
import * as yup from 'yup';
import { deleteUser, getUserById, postCreateUser, getAll, updateUser } from "../../../infra/repositories/user-repository";
import { toast, ToastContainer } from 'react-toastify';
import UserItem from "./components/user-item/user-item";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getCookie } from 'react-use-cookie';
import { invalidToken } from "../../utils/redirect";
import { GlobalContext } from "../../utils/context";

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
    const navigate = useNavigate();
    const token = getCookie('token');
    const [ , setActive ] = useContext(GlobalContext);

    useEffect(() => {
        setActive(1);
        getAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setActive]);

    const getAllUsers = () => {
        setLoading(true);

        getAll(token)
            .then((res) => {
                setUsers(res);
            })
            .catch((err) => {
                if (err.status === 401) {
                    invalidToken(navigate);
                    return;
                }

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
    }

    const _submit = (data, { setSubmitting, resetForm }) => {
        if (userSelected !== -1) {
            setSubmitting(true);
            updateUser(userSelected, data.name, data.login, data.password, token)
                .then(() => {
                    toast.success('Usuário atualizado com sucesso');
                    resetForm();
                    setUserSelected(-1);
                    getAllUsers();
                })
                .catch((err) => {
                    if (err.status === 401) {
                        invalidToken(navigate);
                        return;
                    }

                    if (err.msg !== undefined) {
                        toast(err.msg);
                    } else {
                        toast('Ocorreu um erro interno');
                    }
                })
                .finally(() => {
                    setSubmitting(false); 
                });
            return;
        }

        postCreateUser(data.name, data.login, data.password, token)
            .then(() => {
                toast.success('Usuário criado com sucesso');
                resetForm();
                getAllUsers();
            })
            .catch((err) => {
                if (err.status === 401) {
                    invalidToken(navigate);
                    return;
                }

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

    const formikProps = useFormik({
        initialValues: {
            name: '',
            login: '',
            password: '',
        },
        validationSchema: schema,
        onSubmit: _submit,
    });

    const selectUser = (id) => {
        if (userSelected === id) {
            formikProps.resetForm();
            setUserSelected(-1);
            return;
        }

        setUserSelected(id);
        getUserById(id, token)
            .then((res) => {
                formikProps.setFieldValue("name", res.name);
                formikProps.setFieldError('name', undefined);
                formikProps.setFieldValue("login", res.login);
            })
            .catch((err) => {
                if (err.status === 401) {
                    invalidToken(navigate);
                    return;
                }
                
                if (err.msg !== undefined) {
                    toast(err.msg);
                } else {
                    toast('Ocorreu um erro interno');
                }

                setUserSelected(-1);
            });
    }

    const deleteSelectedUser = () => {
        if (userSelected === -1) {
            toast('Selecione um usuário');
            return;
        }

        // TODO: Usuário não pode deletar a si mesmo

        deleteUser(userSelected, token)
            .then(() => {
                toast.success('Usuário deletado');
                setUserSelected(-1);
                getAllUsers();
                formikProps.resetForm();
            })
            .catch((err) => {
                if (err.status === 401) {
                    invalidToken(navigate);
                    return;
                }
                
                if (err.msg !== undefined) {
                    toast(err.msg);
                } else {
                    toast('Ocorreu um erro interno');
                }
            });
    }

    return (
        <main className="users">
            <ToastContainer/>

            <Container fluid>
                <Row className='vh-100'>
                    <Col className='left-side mt-5 pt-5 mx-3'>
                        <h2>Usuários</h2>
                        <p>Cadastre aqui novos usuários que poderão administrar o sistema</p>

                        <Formik>
                            <Form noValidate onSubmit={formikProps.handleSubmit} className='d-flex flex-fill flex-column align-items-center my-4'>
                                <Form.Group className="my-2 w-100">
                                    <Form.Control 
                                        placeholder="Nome"
                                        name="name"
                                        value={formikProps.values.name || ''}
                                        onChange={formikProps.handleChange}
                                        isValid={formikProps.touched.name && !formikProps.errors.name}
                                        isInvalid={!!formikProps.errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">{formikProps.errors.name}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="my-2 w-100">
                                    <Form.Control 
                                        placeholder="Login"
                                        name="login"
                                        value={formikProps.values.login || ''}
                                        onChange={formikProps.handleChange}
                                        isValid={formikProps.touched.login && !formikProps.errors.login}
                                        isInvalid={!!formikProps.errors.login}
                                    />
                                    <Form.Control.Feedback type="invalid">{formikProps.errors.login}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="my-2 w-100">
                                    <Form.Control 
                                        placeholder="Senha" 
                                        type="password"
                                        name="password"
                                        value={formikProps.values.password || ''}
                                        onChange={formikProps.handleChange}
                                        isValid={formikProps.touched.password && !formikProps.errors.password}
                                        isInvalid={!!formikProps.errors.password}
                                    />
                                    <Form.Control.Feedback type="invalid">{formikProps.errors.password}</Form.Control.Feedback>
                                </Form.Group>

                                <Button type="submit" className="my-4 py-2 px-4" disabled={formikProps.isSubmitting}>
                                    { formikProps.isSubmitting ? <Spinner size="sm"/> : 'Salvar' }
                                </Button>
                            </Form>
                        </Formik>
                    </Col>

                    <div className="bar"></div>

                    <Col className="d-flex flex-column mt-5 pt-5 mx-3 align-items-center">
                        <h2 className='w-100'>Usuários cadastrados</h2>
                        <p className='w-100'>Para editar dados de um usuário cadastrado basta clicar nele e os dados serão preenchidos nos campos ao lado para serem editados.<br/>Para excluir um usuário clique nele e o botão “Excluir” irá aparecer.</p>
                    
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

                        { userSelected !== -1 && <Button className="my-4 py-2 px-4" onClick={deleteSelectedUser}>Excluir</Button> }
                    </Col>
                </Row>
            </Container>
        </main>
    );
}