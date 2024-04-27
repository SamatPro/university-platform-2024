import {jwtDecode} from 'jwt-decode';

// Определение типа для декодированного токена, если вы используете TypeScript
interface DecodedToken {
    userId: number;
    exp: number;  // Срок действия токена
    iat: number;  // Время выпуска токена
    username: string;
    // Добавьте другие поля, которые вы сохраняете в токене
}

/**
 * Декодирует JWT и возвращает его payload.
 * @param token - JWT в формате строки.
 * @returns DecodedToken - декодированный payload токена.
 */
const decodeToken = (token: string): DecodedToken | null => {
    try {
        return jwtDecode<DecodedToken>(token);
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};

export default decodeToken;
