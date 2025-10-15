export interface IRegisterDTO {
  email: string;
  password: string;
  name: string;
  surname: string;
  city?: string;
  old: number;
}

export interface ILoginDTO {
  email: string;
  password: string;
}
