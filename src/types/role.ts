interface RolePermission {
    permission_id: number;
}

interface Role {
    id: number;
    name: string;
    description: string;
    role_permissions: RolePermission[];
}