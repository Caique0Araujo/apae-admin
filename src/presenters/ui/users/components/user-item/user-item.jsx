import { Col } from "react-bootstrap";

export default function UserItem(props) {

    return (
        <Col className={`user-item d-flex flex-column px-3 py-2 rounded border border-2 text-center m-2 ${props.active && 'active'}`} onClick={() => props.onClick(props.id)}>
            <span className="title">{props.title}</span>
            <span className="subtitle">{props.subtitle}</span>
        </Col>
    );
}