import React, { useEffect, useState } from "react";
export default function GoodsModal({
  open,
  mode,
  initialItem,
  onClose,
  onSubmit,
}) 
{
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  useEffect(() => {
    if (!open) return;
    setName(initialItem?.name ?? "");
    setCategory(initialItem?.category ?? "");
    setDescription(initialItem?.description ?? "");
    setPrice(initialItem?.price != null ? String(initialItem.price) : "");
    setStock(initialItem?.stock != null ? String(initialItem.stock) : "");
    setImageUrl(initialItem?.imageUrl ?? "");
  }, [open, initialItem]);
  if (!open) return null;
  const title =
    mode === "edit" ? "Редактирование товара" : "Создание товара";
  const handleSubmit = (e) => {
  e.preventDefault();
  
  const trimmed = name.trim();
  const trimmedCategory = category.trim();  
  const trimmedDesc = description.trim();
  const trimmedImageUrl = imageUrl.trim();
  const parsedPrice = Number(price);
  const parsedStock = Number(stock);

  
  if (!trimmed || !trimmedCategory || !trimmedDesc || !trimmedImageUrl) {
    alert("Заполните все поля: название, категория, описание и URL изображения");
    return;
  }

  
  if (!Number.isFinite(parsedPrice) || parsedPrice < 0 || parsedPrice > 9999999) {
    alert("Введите корректный ценник (0–9999999)");
    return;
  }


  if (!Number.isFinite(parsedStock) || parsedStock < 0) {
    alert("Введите корректное количество на складе");
    return;
  }

  onSubmit({
    id: initialItem?.id,
    name: trimmed,
    category: trimmedCategory,
    description: trimmedDesc,
    price: parsedPrice,
    stock: parsedStock,
    imageUrl: trimmedImageUrl,
  });
};
  return ( // модальные окн
    <div className="backdrop" onMouseDown={onClose}>
      <div
        className="modal"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal__header">
          <div className="modal__title">{title}</div>
          <button className="iconBtn" onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <label className="label">
            Название
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, гвоздь"
              autoFocus
            />
          </label>
          <label className="label">
            Стоимость
            <input
              className="input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Например, 100"
              inputMode="numeric"
            />
          </label>
          <label className="label">
            URL изображения
            <input
              className="input"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </label>
          <label className="label">
        Категория
        <input
          className="input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Например, Электроника"
        />
      </label>

      <label className="label">
        Описание
        <textarea  
          className="input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Подробное описание товара"
          rows="3"
        />
      </label>

      <label className="label">
        Количество на складе
        <input
          className="input"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="0"
          type="number"
          min="0"
        />
      </label>
          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary">
              {mode === "edit" ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
