import React from "react";
import GoodsItem from "./GoodsItem";
export default function GoodsList({ goods, onEdit, onDelete }) {
  if (!goods.length) {
    return <div className="empty">Товаров пока нет</div>;
  }
  return (
    <div className="list">
      {goods.map((u) => (
        <GoodsItem key={u.id} item={u} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
