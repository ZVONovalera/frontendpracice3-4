import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ username: "", role: "" });
  const navigate = useNavigate();

  useEffect(() => {
    checkAccess();
    loadUsers();
  }, []);

  const checkAccess = async () => {
    try {
      const user = await api.getMe();
      if (user.role !== "admin") {
        alert("Доступ запрещен. Только для администраторов.");
        navigate("/");
      }
    } catch (err) {
      navigate("/login");
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      alert("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({ username: user.username, role: user.role });
  };

  const handleUpdate = async () => {
    if (!editForm.username.trim()) {
      alert("Имя пользователя не может быть пустым");
      return;
    }

    try {
      await api.updateUser(editingUser.id, editForm);
      await loadUsers();
      setEditingUser(null);
      alert("Пользователь обновлен");
    } catch (err) {
      console.error(err);
      alert("Ошибка обновления пользователя");
    }
  };

  const handleBlock = async (user) => {
    if (user.role === "admin") {
      alert("Нельзя заблокировать администратора");
      return;
    }

    const confirm = window.confirm(`Заблокировать пользователя ${user.username}?`);
    if (!confirm) return;

    try {
      await api.blockUser(user.id);
      await loadUsers();
      alert("Пользователь заблокирован");
    } catch (err) {
      console.error(err);
      alert("Ошибка блокировки пользователя");
    }
  };

  const handleLogout = async () => {
    await api.logout();
    navigate("/login");
  };

  if (loading) return <div style={{ textAlign: "center", padding: "2rem" }}>Загрузка...</div>;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f5f5f5" }}>
      <header style={{ background: "#2c3e50", color: "white", padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Админ панель</div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button style={{ padding: "0.5rem 1rem", background: "#95a5a6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }} onClick={() => navigate("/")}>
              На главную
            </button>
            <button style={{ padding: "0.5rem 1rem", background: "#e74c3c", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }} onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: "2rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "2rem" }}>Управление пользователями</h1>

          <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <thead style={{ background: "#34495e", color: "white" }}>
              <tr>
                <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Username</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Роль</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Статус</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={!user.isActive ? { opacity: 0.6, background: "#fafafa" } : {}}>
                  <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>{user.id}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>{user.username}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                    <span style={{
                      background: user.role === "admin" ? "#fee" : user.role === "seller" ? "#e3f2fd" : "#e8f5e9",
                      color: user.role === "admin" ? "#c33" : user.role === "seller" ? "#1976d2" : "#388e3c",
                      padding: "4px 8px", borderRadius: "4px"
                    }}>
                      {user.role === "admin" ? "Админ" : user.role === "seller" ? "Продавец" : "Пользователь"}
                    </span>
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                    <span style={{ color: user.isActive ? "#4caf50" : "#f44336", fontWeight: "bold" }}>
                      {user.isActive ? "Активен" : "Заблокирован"}
                    </span>
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                    <button style={{ padding: "4px 8px", marginRight: "4px", background: "#3498db", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }} onClick={() => handleEdit(user)}>
                      Редактировать
                    </button>
                    <button style={{ padding: "4px 8px", background: "#e74c3c", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }} onClick={() => handleBlock(user)} disabled={!user.isActive || user.role === "admin"}>
                      Заблокировать
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Модалка редактирования */}
      {editingUser && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }} onClick={() => setEditingUser(null)}>
          <div style={{ background: "white", padding: "2rem", borderRadius: "8px", width: "400px", maxWidth: "90%" }} onClick={(e) => e.stopPropagation()}>
            <h2>Редактирование пользователя</h2>
            <div style={{ marginBottom: "1rem" }}>
              <label>Имя пользователя</label>
              <input type="text" value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label>Роль</label>
              <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}>
                <option value="user">Пользователь</option>
                <option value="seller">Продавец</option>
                <option value="admin">Администратор</option>
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1.5rem" }}>
              <button style={{ padding: "0.5rem 1rem", background: "#95a5a6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }} onClick={() => setEditingUser(null)}>Отмена</button>
              <button style={{ padding: "0.5rem 1rem", background: "#3498db", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }} onClick={handleUpdate}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}