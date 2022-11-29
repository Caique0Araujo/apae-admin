export default function SideMenuItemComponent(props) {
    return (
        <a href={props.to} className={`list-group-item rounded list-group-item-action border-0 my-1 py-2 ripple ${props.active === true ? 'active' : ''}`} aria-current="true">
            { props.icon && props.icon }
            <span className='ms-3'>{props.text}</span>
        </a>
    );
}