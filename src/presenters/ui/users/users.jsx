import { Formik } from "formik";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import './css/Users.min.css';
import * as yup from 'yup';
import { postCreateUser } from "../../../infra/repositories/user-repository";
import { toast, ToastContainer } from 'react-toastify';

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

    const _submit = (data, { setSubmitting, resetForm }) => {
        postCreateUser(data.name, data.login, data.password, props.token)
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

                    <Col className="mt-5 pt-5">
                        Mundo
                    </Col>
                </Row>
            </Container>
        </main>
    );
}