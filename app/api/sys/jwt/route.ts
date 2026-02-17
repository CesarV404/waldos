import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/utils/jwt";

/**
 * POST /api/sys/jwt
 * Genera un JWT a partir de un payload enviado en el request
 *
 * Body esperado:
 * {
 *   "userId": number,
 *   "email": string,
 *   "role": string,
 *   ... otros datos
 * }
 *
 * Response:
 * {
 *   "token": string
 *   "message": string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Obtener el payload del body
    const payload = await request.json();

    // Validar que el payload no esté vacío
    if (!payload || Object.keys(payload).length === 0) {
      return NextResponse.json(
        {
          error: "El payload no puede estar vacío",
          message:
            "Por favor, envía un objeto con datos para codificar en el token",
        },
        { status: 400 },
      );
    }

    // Generar el token
    const token = generateToken(payload);

    return NextResponse.json(
      {
        success: true,
        message: "Token generado exitosamente",
        token,
        payload,
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";

    // Manejo específico de errores
    if (message.includes("JWT_SECRET")) {
      return NextResponse.json(
        {
          error: "Configuración del servidor",
          message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        error: "Error al generar el token",
        message,
      },
      { status: 500 },
    );
  }
}
