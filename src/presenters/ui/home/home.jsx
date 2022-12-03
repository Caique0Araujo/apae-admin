import { useContext, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { GlobalContext } from '../../utils/context';

export default function Home() {

    const [ , setActive ] = useContext(GlobalContext);

    useEffect(() => {
        setActive(0);
    }, [setActive]);

    return (
        <div>
            <main>
                <Container className='pt-4'>
                    <h2>Hello World</h2>
                </Container>
            </main>
        </div>
    );
}