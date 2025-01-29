export default interface ForgotPassword {
    email: string;
}

export interface UpdateForgotPassword {
    token: string | null;
    username: string | null;
    password: string;
    confirmPassword: string;
}
