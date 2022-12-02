import { Button, Container, Form, Row, Spinner } from "react-bootstrap";
import * as yup from 'yup';
import { Formik } from 'formik';
import './css/Login.min.css';
import { postLogin } from "../../../infra/repositories/user-repository";
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';
import LogoApae from '../../../assets/images/logo-apae.png';
import { setCookie } from "react-use-cookie";

const schema = yup
    .object()
    .shape({
        login: yup
            .string()
            .required('Insira o seu login')
            .min(5, 'Insira no mínimo 5 caracteres')
            .max(20, 'Insira no máximo 20 caracteres'),
        password: yup
            .string()
            .required('Insira a sua senha')
            .min(5, 'Insira no mínimo 5 caracteres')
            .max(15, 'Insira no máximo 15 caracteres')
    })
    .required();

export default function Login() {

    const [ error, setError ] = useState(null);

    const _submit = (data, { setSubmitting }) => {
        setError(null);

        postLogin(data.login, data.password)
        .then((res) => {
            setCookie('token', res.token, { path: '/' });
            window.location.reload(false);
        }).catch((err) => {
            if (err.msg) {
                setError(err.msg);
            } else {
                toast('Ocorreu um erro interno');
            }
        }).finally(() => {
            setSubmitting(false);
        });
    }

    return (
        <>
            <ToastContainer/>

            <Container fluid className="d-flex vh-100 align-items-center">
                <Row className='vw-100'>
                    <div className="d-flex justify-content-center">
                        <div className="center-container shadow p-3 mb-5 bg-body rounded">

                            <div className='d-flex flex-column justify-content-center align-items-center'>
                                <img alt='APAE logo' src={LogoApae} width={120}/>
                                <h2>APAE - SJE</h2>
                                <h3>Setor Administrativo</h3>
                            </div>

                            <Formik
                                validationSchema={schema}
                                onSubmit={_submit}
                                initialValues={{
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
                                    <Form noValidate onSubmit={handleSubmit}>
                                        <Form.Group
                                            controlId="validationFormik101"
                                            className="position-relative field"
                                        >
                                            <Form.Label>Login:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="usuario"
                                                name="login"
                                                value={values.login || ''}
                                                onChange={handleChange}
                                                isValid={touched.login && !errors.login}
                                                isInvalid={!!errors.login}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.login}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group
                                            controlId="validationFormik102"
                                            className="position-relative field"
                                        >
                                            <Form.Label>Senha</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="*******"
                                                name="password"
                                                value={values.password || ''}
                                                onChange={handleChange}
                                                isValid={touched.password && !errors.password}
                                                isInvalid={!!errors.password}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                        </Form.Group>

                                        { error && <p>{error}</p> }

                                        <Button type="submit" className='w-100' disabled={isSubmitting}>
                                            { isSubmitting ? <Spinner size="sm"/> : 'Entrar' }
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </Row>
            </Container>
        </>
    );
}