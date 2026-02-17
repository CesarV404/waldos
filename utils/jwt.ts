import { StorePayload } from "@/interfaces/labels-inteface";
import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

/**
 * Genera un JWT a partir de un objeto
 * @param {TokenPayload} payload - Objeto a codificar en el JWT
 * @param {string} secret - Clave secreta para firmar el token (por defecto usa variable de entorno)
 * @param {GenerateTokenOptions} options - Opciones adicionales para jwt.sign()
 * @returns {string} Token JWT generado
 * @throws {Error} Si JWT_SECRET no está definido o hay error en la generación
 */
export function generateToken(
  payload: JwtPayload,
  secret: string = process.env.JWT_SECRET || "",
  options: SignOptions = {},
): string {
  if (!secret) {
    throw new Error(
      "JWT_SECRET no está definido. Por favor, configura la variable de entorno JWT_SECRET.",
    );
  }

  // Opciones por defecto
  const defaultOptions: SignOptions = {
    algorithm: "HS256",
    ...options,
  };

  try {
    const token: string = jwt.sign(payload, secret, defaultOptions);
    return token;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    throw new Error(`Error al generar el token: ${message}`);
  }
}

/**
 * Verifica y decodifica un JWT
 * @param {string} token - Token JWT a verificar
 * @param {string} secret - Clave secreta para verificar (por defecto usa variable de entorno)
 * @returns {TokenPayload} Payload decodificado del token
 * @throws {Error} Si JWT_SECRET no está definido o la verificación falla
 */
export function verifyToken(
  token: string,
  secret: string = process.env.JWT_SECRET || "",
): StorePayload {
  if (!secret) {
    throw new Error(
      "JWT_SECRET no está definido. Por favor, configura la variable de entorno JWT_SECRET.",
    );
  }

  try {
    const decoded: StorePayload | string = jwt.verify(token, secret) as
      | StorePayload
      | string;
    const payload: StorePayload =
      typeof decoded === "string"
        ? { data: { name: "", id: "", type: "" } }
        : decoded;

    return payload;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    throw new Error(`Error al verificar el token: ${message}`);
  }
}
