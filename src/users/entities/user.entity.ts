export class User {
  id: string;
  email: string;
  password: string;
  role: Role;
  createdAt: number;
  updatedAt: number;
}

enum Role {
  admin = 'ADMIN',
  user = 'User',
}
