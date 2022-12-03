import { useContext } from "react";
import { GlobalContext } from "../../utils/context";

export default function SideMenuItemComponent(props) {
    const [ active ] = useContext(GlobalContext);
    const isActive = props.id === active;

    return (
        <a href={props.to} className={`list-group-item rounded list-group-item-action border-0 my-1 py-2 ripple ${isActive === true ? 'active' : ''}`} aria-current="true">
            { props.icon && props.icon }
            <span className='ms-3'>{props.text}</span>
        </a>
    );
}