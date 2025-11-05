import "./MenuListItem.css";

type MenuItemData = {
  id: number;
  name: string;
  price: number;
  description?: string;
};

type Props = {
  item: MenuItemData;
};

const MenuListItem = ({ item }: Props) => {
  return (
    <div className="drink-card">
      <div className="drink-image-container">
        <img
          className="drink-image"
          src={`${process.env.PUBLIC_URL}/${item.name.toLowerCase()}.jpg`}
          alt={item.name}
        />
      </div>
      <div className="drink-details">
        <h2 className="drink-name">{item.name}</h2>
        {item.description && (
          <p className="drink-description">{item.description}</p>
        )}
        <p className="drink-price">${item.price}</p>
      </div>
    </div>
  );
};

export default MenuListItem;
