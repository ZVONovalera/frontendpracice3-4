import React, { useState, useEffect } from "react";
import "./goodsPage.css";
import GoodsList from "../../components/GoodsList.jsx";
import GoodsModal from "../../components/GoodsModal.jsx";
import { api } from "../../api/index.js";
import { useNavigate } from "react-router-dom";

export default function GoodsPage() {
  const [goods, setGoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingitem, setEditingItem] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Загрузка пользователя при старте
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    loadUser();
    loadgoods();
  }, []);

  const loadUser = async () => {
    try {
      const data = await api.getMe();
      setUser(data);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  };

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
          prev.map((u) => (u.id === payload.id ? updatedItem : u))
        );
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Ошибка сохранения товара");
    }
  };

  const handleLogout = async () => {
    await api.logout();
    navigate("/login");
  };

  if (!user) {
    return <div>Загрузка...</div>;
  }

  const canEdit = user.role === "seller" || user.role === "admin";
  const canDelete = user.role === "admin";

  return (
    <div className="page">
      <header className="header">
        <div className="header__inner">
          <div className="brand">Goods App</div>
          <div className="header__right">
            <span style={{ marginRight: "1rem" }}>
              {user.username} ({user.role})
            </span>
            <button className="btn" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>
      </header>
      <main className="main">
        <div className="container">
          <div className="toolbar">
            <h1 className="title">Товары</h1>
            {canEdit && (
              <button className="btn btn--primary" onClick={openCreate}>
                + Создать
              </button>
            )}
          </div>
          <GoodsList
            goods={goods}
            onEdit={canEdit ? openEdit : null}
            onDelete={canDelete ? handleDelete : null}
          />
        </div>
      </main>
      <footer className="footer">
        <div className="footer__inner">
          © {new Date().getFullYear()} Goods App
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