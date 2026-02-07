import { type ColumnDef } from "@components-kit/react";

export interface User {
  email: string;
  id: number;
  name: string;
  role: string;
}

export const users: User[] = [
  { email: "alice@example.com", id: 1, name: "Alice Johnson", role: "Admin" },
  { email: "bob@example.com", id: 2, name: "Bob Smith", role: "User" },
  { email: "carol@example.com", id: 3, name: "Carol White", role: "Editor" },
];

export const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
];

export const InfoIcon = () => (
  <svg fill="currentColor" height="20" viewBox="0 0 20 20" width="20">
    <path
      clipRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
      fillRule="evenodd"
    />
  </svg>
);

export const SearchIcon = () => (
  <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16">
    <path
      clipRule="evenodd"
      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
      fillRule="evenodd"
    />
  </svg>
);
