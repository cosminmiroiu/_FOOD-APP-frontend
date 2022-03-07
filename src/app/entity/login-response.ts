import { User } from "./user";

export class LoggedInResponse {
    expirationDate: string;
    jwtToken: string;
    user: User;
}
