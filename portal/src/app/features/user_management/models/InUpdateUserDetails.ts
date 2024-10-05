export class InUpdateUserDetails {
  id: number;
  name: string;
  userName: string;
  email: string;

  constructor(id: number, name: string, userName: string, email: string) {
    this.id = id;
    this.name = name;
    this.userName = userName;
    this.email = email;
  }
}
