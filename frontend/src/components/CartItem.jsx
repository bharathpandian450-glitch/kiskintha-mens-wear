import { getImageUrl } from '../api';

const getImageSrc = (img) => getImageUrl(img);


function CartItem({ item, onRemove, onUpdateQuantity }) {
    return (
        <div className="cart-item">
            <div className="cart-item-image">
                {item.image ? (
                    <img src={getImageSrc(item.image)} alt={item.name} />
                ) : (
                    <span className="placeholder">👔</span>
                )}
            </div>

            <div className="cart-item-details">
                <div className="name">{item.name}</div>
                <div className="size" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                    <span className="badge badge-secondary" style={{ background: '#e2e8f0', color: '#1e293b' }}>Size: {item.size}</span>
                    {item.color && (
                        <span className="badge badge-primary" style={{ background: '#dbeafe', color: '#1e40af', fontWeight: '600' }}>
                            Color: {item.color}
                        </span>
                    )}
                </div>
                <div className="price" style={{ marginTop: '6px' }}>₹{Number(item.price).toLocaleString('en-IN')}</div>
            </div>

            <div className="cart-item-quantity">
                <div className="quantity-controls">
                    <button onClick={() => onUpdateQuantity(item.id, item.size, item.quantity - 1, item.color)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.size, item.quantity + 1, item.color)}>+</button>
                </div>
            </div>

            <div className="cart-item-subtotal">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
            </div>

            <button className="cart-item-remove" onClick={() => onRemove(item.id, item.size, item.color)}>
                🗑️
            </button>
        </div>
    );
}

export default CartItem;
