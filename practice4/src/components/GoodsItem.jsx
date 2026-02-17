import React from "react";
export default function GoodsItem({ item, onEdit, onDelete }) {
  return (
    <div className="itemRow">
      <div className="itemMain">
        <div className="itemId">#{item.id}</div>
        <div className="itemName">{item.name}</div>
        <div className="itemCategory">{item.category}</div>  
        <div className="itemDescription">{item.description}</div>  
        <div className="itemPrice">{item.price} руб</div>
        <div className="itemStock">В наличии: {item.stock} шт</div>  
      </div>
      <div className="itemActions">
        <button className="btn" onClick={() => onEdit(item)}>
          Редактировать
        </button>
        <button className="btn btn--danger" onClick={() => onDelete(item.id)}>
          Удалить
        </button>
      </div>
    </div>
  );
}