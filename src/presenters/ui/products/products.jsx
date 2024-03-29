import { Formik, useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { GlobalContext } from "../../utils/context";
import * as yup from 'yup';
import ImgBg from '../../../assets/images/image_background.png';
import './css/Products.min.css';
import { getCookie } from 'react-use-cookie';
import { createProduct, deleteProduct, getAll, getById, updateProduct } from "../../../infra/repositories/product-repository";
import { invalidToken } from "../../utils/redirect";
import { useNavigate } from "react-router-dom";
import ProductItem from "./components/product-item/product-item";

const schema = yup
    .object()
    .shape({
        title: yup
            .string()
            .required('Insira o título do Produto')
            .max(255, 'Insira no máximo 255 caracteres'),
        description: yup
            .string()
            .required('Insira as informações sobre o Produto')
            .min(10, 'Insira no mínimo 10 caracteres'),
        price: yup
            .number()
            .required('Insira o preço do Produto'),
        file: yup
            .mixed()
            .required('Insira a imagem de capa do Produto')
            .test('fileSize', 'A imagem deve ter no máximo 20MB', value => value && value[0].size <= 5000000)
            .test('fileType', 'Apenas imagens PNG, JPEG ou JPG', value => {
                const isPng = value[0].type === 'image/png';
                const isJpeg = value[0].type === 'image/jpeg';
                const isJpg = value[0].type === 'image/jpg';
                const isValidType = isPng || isJpeg || isJpg;
                
                return value && isValidType;
            }),
    })
    .required();


export default function Products() {
    const [ , setActive ] = useContext(GlobalContext);
    const [ products, setProducts ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ productSelected, setProductSelected ] = useState(-1);
    const [ file, setFile ] = useState(undefined);
    const navigate = useNavigate();
    const token = getCookie('token');

    const _onSubmit = (data, { setSubmitting, resetForm }) => {
        setSubmitting(false);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', data.title);
        formData.append('description', data.description);
        formData.append('price', data.price);

        if (productSelected !== -1) {
            formData.append('id_product', productSelected);

            updateProduct(formData, token)
                .then(() => {
                    toast.success('Produto atualizado com sucesso');
                    setFile(undefined);
                    getAllProducts();
                    resetForm();
                    setProductSelected(-1);
                    document.getElementById("fileInput").value = "";
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
            return;
        }

        createProduct(formData, token)
            .then(() => {
                toast.success('Produto criado com sucesso');
                setFile(undefined);
                getAllProducts();
                resetForm();
                document.getElementById("fileInput").value = "";
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
            description: '',
            price: undefined,
            file: undefined,
        },
    });

    useEffect(() => {
        setActive(3);

        getAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setActive]);

    const getAllProducts = () => {
        setLoading(true);

        getAll(token)
            .then((res) => {
                setProducts(res);
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

    const selectProduct = (id) => {
        if (productSelected === id) {
            formikProps.resetForm();
            setFile(undefined);
            setProductSelected(-1);
            return;
        }

        setProductSelected(id);
        getById(id, token)
            .then((res) => {
                const buffer = res.image_path;
                const file = dataURLtoFile(`data:image/png;base64,${buffer}`, `${res.name}.png`);
                
                formikProps.setFieldValue('title', res.name);
                formikProps.setFieldValue('description', res.description);
                formikProps.setFieldValue('price', res.price);

                setFile(file);
                formikProps.setFieldValue('file', file);
            })
            .catch((err) => {
                console.log(err);
                if (err.status === 401) {
                    invalidToken(navigate);
                } else if (err.msg !== undefined) {
                    toast(err.msg);
                } else {
                    toast('Ocorreu um erro interno');
                }
            });
    }

    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, {type:mime});
    }

    const deleteSelectedProduct = () => {
        if (productSelected === -1) {
            return;
        }

        deleteProduct(productSelected, token)
            .then(() => {
                toast.success('Noticia deletada com sucesso');
                getAllProducts();
                setProductSelected(-1);
                formikProps.resetForm();
                setFile(undefined);
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
        <main className="products">
            <ToastContainer/>

            <Container fluid>
                <Row className='vh-100'>
                    <Col className='left-side mt-5 pt-5 mx-3'>
                        <h2>Produtos</h2>
                        <p>Cadastre aqui novos produtos para aparecerem no bazar do site</p>

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
                                        placeholder="Descrição"
                                        name="description"
                                        as="textarea"
                                        value={formikProps.values.description || ''}
                                        onChange={formikProps.handleChange}
                                        isValid={formikProps.touched.description && !formikProps.errors.description}
                                        isInvalid={!!formikProps.errors.description}
                                    />
                                    <Form.Control.Feedback type="invalid">{formikProps.errors.description}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="my-2 w-100">
                                    <Form.Control 
                                        placeholder="Preço"
                                        name="price"
                                        type="number"
                                        value={formikProps.values.price || ''}
                                        onChange={formikProps.handleChange}
                                        isValid={formikProps.touched.price && !formikProps.errors.price}
                                        isInvalid={!!formikProps.errors.price}
                                    />
                                    <Form.Control.Feedback type="invalid">{formikProps.errors.price}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="my-2 w-100">
                                    <Form.Control 
                                        id="fileInput"
                                        type="file"
                                        name="file"
                                        value={undefined}
                                        onChange={_setFile}
                                        multiple={false}
                                        accept="image/x-png, image/jpeg, image/jpg"
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
                        <h2 className='w-100'>Produtos cadastrados</h2>
                        <p className='w-100'>Para editar dados de um produto cadastrado basta clicar nele e os dados serão preenchidos nos campos ao lado para serem editados.<br/>Para excluir um produto clique nele e o botão “Excluir” irá aparecer.</p>
                    
                        { 
                            loading && 
                                <div className='d-flex flex-fill justify-content-center align-items-center'>
                                    <Spinner className="text-primary"/>
                                </div>
                        }

                        {
                            products.length === 0 && !loading &&
                                <div className='w-100 d-flex mt-5'>
                                    <img src={ImgBg} alt='background' height={350}/>
                                </div>
                        }
                        
                        <Row>
                            { 
                                products.length > 0 && !loading && products.map((val) => 
                                    <ProductItem 
                                        key={val.id_product} 
                                        id={val.id_product} 
                                        title={val.name} 
                                        subtitle={val.login} 
                                        buffer={val.image_path}
                                        price={val.price}
                                        active={productSelected === val.id_product} 
                                        onClick={selectProduct}
                                    /> 
                                ) 
                            }
                        </Row>

                        { 
                            productSelected !== -1 && 
                                <Button className="my-4 py-2 px-4" onClick={deleteSelectedProduct}>Excluir</Button> 
                        }
                    </Col>
                </Row>
            </Container>
        </main>
    );
}