"use client";

import { useState } from "react";

interface User {
  id: number;
  name: string;
}

interface EditRoleFormProps {
  onSubmit: (userId: number, role: string) => void;
}

const EditRoleForm: React.FC<EditRoleFormProps> = ({ onSubmit }) => {
  const [searchQuery, setSearchQuery] = useState(""); // Para buscar usuarios por nombre
  const [users, setUsers] = useState<User[]>([]); // Lista de usuarios encontrados
  const [selectedUser, setSelectedUser] = useState<number | null>(null); // Usuario seleccionado
  const [selectedRole, setSelectedRole] = useState("user"); // Rol seleccionado

  // Simular búsqueda de usuarios
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(`/api/users?name=${searchQuery}`); // Endpoint de búsqueda
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser && selectedRole) {
      onSubmit(selectedUser, selectedRole);
    } else {
      alert("Debes seleccionar un usuario y un rol.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-[#01141f] text-white rounded-xl shadow-lg max-w-md"
    >
      <h2 className="text-2xl font-bold mb-4">Editar Roles</h2>

      <div className="mb-6">
        <label htmlFor="search" className="block font-medium mb-2">
          Buscar usuario por nombre:
        </label>
        <div className="flex gap-2">
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ingresa el nombre del usuario"
            className="flex-grow px-4 py-2 bg-[#02242d] text-white border border-[#03424a] rounded-full focus:outline-none focus:ring-2 focus:ring-[#03424a]"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="px-4 py-2 bg-[#03424a] rounded-full hover:bg-[#046a6a] transition-colors"
          >
            Buscar
          </button>
        </div>
      </div>

      {users.length > 0 && (
        <div className="mb-6">
          <label htmlFor="users" className="block font-medium mb-2">
            Seleccionar usuario:
          </label>
          <select
            id="users"
            value={selectedUser || ""}
            onChange={(e) => setSelectedUser(Number(e.target.value))}
            className="w-full px-4 py-2 bg-[#02242d] text-white border border-[#03424a] rounded-full focus:outline-none focus:ring-2 focus:ring-[#03424a]"
          >
            <option value="" disabled>
              Selecciona un usuario
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="roles" className="block font-medium mb-2">
          Seleccionar rol:
        </label>
        <select
          id="roles"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full px-4 py-2 bg-[#02242d] text-white border border-[#03424a] rounded-full focus:outline-none focus:ring-2 focus:ring-[#03424a]"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
        </select>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 rounded-full hover:bg-green-800 transition-colors"
      >
        Guardar cambios
      </button>
    </form>
  );
};

export default EditRoleForm;
