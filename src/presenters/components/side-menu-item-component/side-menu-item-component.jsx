import { useContext } from "react";
import { GlobalContext } from "../../utils/context";

export default function SideMenuItemComponent(props) {
    const to = props.to === undefined ? '#' : props.to;
    const onClick = props.onClick === undefined ? () => {} : props.onClick;
    const [ active ] = useContext(GlobalContext);
    const isActive = props.id === active;

    return (
        <a href={to} className={`list-group-item rounded list-group-item-action border-0 my-1 py-2 ripple ${isActive === true ? 'active' : ''}`} aria-current="true" onClick={onClick}>
            { props.icon && props.icon }
            <span className='ms-3'>{props.text}</span>
        </a>
    );
}