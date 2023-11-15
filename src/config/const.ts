export const BitFieldPermissions = {
    ViewPublicPages: 1 << 0, // 1
    ViewPrivatePages: 1 << 1, // 2
    Administrator: 1 << 2, // 4
    // Total = 7
};

export type PermissionKey = keyof typeof BitFieldPermissions;

export const PermissionKeysArray = Object.keys(
    BitFieldPermissions
) as PermissionKey[];

interface Permission {
    name: string;
    key: string;
    bit: number;
    description: string;
}

export const Permissions: Permission[] = [
    {
        name: "View Public Pages",
        key: "ViewPublicPages",
        bit: BitFieldPermissions.ViewPublicPages,
        description:
            "Anyone with this permission will be able to view public pages.",
    },
    {
        name: "View Private Pages",
        key: "ViewPrivatePages",
        bit: BitFieldPermissions.ViewPrivatePages,
        description:
            "Anyone with this permission will be able to view private pages.",
    },
    {
        name: "Administrator",
        key: "Administrator",
        bit: BitFieldPermissions.Administrator,
        description:
            "Anyone with this permission will have full access to the site.",
    },
];
