export class User {
  id: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
  createdAt: number;
  updatedAt: number;
}
