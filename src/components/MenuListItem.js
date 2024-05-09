import './MenuListItem.css';
const MenuItem = props => {
    return (
      <div className="drink-card">
        <div className="drink-image-container">
          <img className="drink-image" src={process.env.PUBLIC_URL + `/${props.item.name.toLowerCase()}.jpg`} alt={props.item.name}/>
        </div>
        <div className="drink-details">
          <h2 className="drink-name">{props.item.name}</h2>
          <p className="drink-description">{props.item.description}</p>
          <p className="drink-price">{props.item.price}</p>
        </div>
      </div>
)
}

export default MenuItem;