import { Col } from "react-bootstrap";
import './css/NewsItem.min.css';

export default function NewsItem(props) {
    var title = props.title;
    if (title.length >= 25) {
        title = props.title.substring(0,25);
        title += '...';
    }

    const buffer = props.buffer;

    return (
        <Col key={props.id} className={`news-item d-flex flex-column justify-content-between px-3 py-2 rounded border border-2 text-center m-2 ${props.active && 'active'}`} onClick={() => props.onClick(props.id)}>
            <span className="title">{props.title}</span>
            <div className="image-container rounded mt-2 bg-white">
                <img src={`data:image/png;base64,${buffer}`} alt={props.title} height={150} />
            </div>
        </Col>
    );
}