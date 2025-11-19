// src/components/DeleteUserButton.jsx
'use client';

import { useState } from 'react';

export default function DeleteUserButton({ userId, userName, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Yakin ingin kick ${userName}? Data akan hilang permanen!`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onDelete?.(userId);
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menghapus user');
      }
    } catch (err) {
      alert('Error jaringan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
        loading
          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
          : 'bg-red-100 text-red-600 hover:bg-red-200'
      }`}
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}