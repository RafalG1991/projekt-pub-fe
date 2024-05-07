import './MenuItem.css';

const MenuItem = props => {
    return (
        <div className="item-wrapper">
            <div className="item-description">
                <p>{props.item.name}</p>
                <p>placeholder</p>
                <p>${props.item.price}</p>
            </div>
        </div>
    )
}

export default MenuItem;