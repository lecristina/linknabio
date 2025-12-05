export type AppUser = {
  id: string;
  name: string;
  email: string;
};

export class UserService {
  async getCurrentUser(): Promise<AppUser> {
    return {
      id: "mock-user-1",
      name: "Axolotl User",
      email: "user@example.com",
    };
  }
}
