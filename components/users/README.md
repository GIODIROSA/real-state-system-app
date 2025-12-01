# Components/Users - Componentes de Usuario

## Descripción

Componentes específicos para la gestión de usuarios. Implementan la UI para listar, crear, editar y eliminar usuarios.

## Componentes

### `UserTable`

Tabla que muestra la lista de usuarios con acciones de editar y eliminar.

```tsx
<UserTable
  users={users}
  onEdit={(user) => handleEdit(user)}
  onDelete={(user) => handleDelete(user)}
  isLoading={isLoading}
/>
```

### `UserForm`

Formulario para crear o editar usuarios. Incluye validación de campos.

```tsx
<UserForm
  user={selectedUser} // undefined para crear
  onSubmit={handleSubmit}
  onCancel={() => setIsOpen(false)}
  isLoading={isSubmitting}
/>
```

### `DeleteUserDialog`

Diálogo de confirmación para eliminar un usuario.

```tsx
<DeleteUserDialog
  user={selectedUser}
  isOpen={isDeleteOpen}
  onClose={() => setIsDeleteOpen(false)}
  onConfirm={handleDeleteConfirm}
  isLoading={isDeleting}
/>
```

## Buenas Prácticas

- Componentes enfocados en una sola responsabilidad
- Props tipadas con TypeScript
- Estados de carga manejados
- Validación de formularios incluida
