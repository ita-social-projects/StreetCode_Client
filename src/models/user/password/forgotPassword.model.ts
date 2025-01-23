export default interface ForgotPasswordDto {
    email: string;
}

export interface UpdateForgotPasswordDTO {
    token: string | null;
    username: string | null;
    password: string;
    confirmPassword: string;
}
