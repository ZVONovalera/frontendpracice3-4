import React, { useMemo, useState, useEffect } from "react";
import "./goodsPage.css";

import GoodsList from "../../components/GoodsList";
import GoodsModal from "../../components/GoodsModal";
import { api } from "../../api";
export default function GoodsPage() {
  const [goods, setGoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingitem, setEditingItem] = useState(null);

  useEffect(() => {
    loadgoods();
  }, []);
  const loadgoods = async () => {
    try {
      setLoading(true);
      const data = await api.getGoods();
      setGoods(data);
    } catch (err) {
      console.error(err);
      alert("Ошибка загрузки товаров");
    } finally {
      setLoading(false);
    }
  };

  
  const openCreate = () => {
    setModalMode("create");
    setEditingItem(null);
    setModalOpen(true);
  };
  const openEdit = (item) => {
    setModalMode("edit");
    setEditingItem(item);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };
  const handleDelete = async (id) => {
    const ok = window.confirm("Удалить товар?");
    if (!ok) return;
    try {
      await api.deleteItem(id);
      setGoods((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Ошибка удаления товара");
    }
  };
  const handleSubmitModal = async (payload) => {
    try {
      if (modalMode === "create") {
        const newItem = await api.createItem(payload);
        setGoods((prev) => [...prev, newItem]);
      } else {
        const updatedItem = await api.updateItem(payload.id, payload);
        setGoods((prev) =>
          prev.map((u) => (u.id === payload.id ? updatedItem : u)),
        );
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Ошибка сохранения товара");
    }
  };
  return (
    <div className="page">
      <header className="header">
        <div className="header__inner">
          <div className="brand">Goods App</div>
          <div className="header__right">React</div>
        </div>
      </header>
      <main className="main">
        <div className="container">
          <div className="toolbar">
            <h1 className="title">Товары</h1>
            <button className="btn btn--primary" onClick={openCreate}>
              + Создать
            </button>
          </div>
          <GoodsList goods={goods} onEdit={openEdit} onDelete={handleDelete} />
        </div>
      </main>
      <footer className="footer">
        <div className="footer__inner">
          © {new Date().getFullYear()}
          Goods App
        </div>
      </footer>
      <GoodsModal
        open={modalOpen}
        mode={modalMode}
        initialItem={editingitem}
        onClose={closeModal}
        onSubmit={handleSubmitModal}
      />
    </div>
  );
}
