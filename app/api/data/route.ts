import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/services/mongodb";
import { DataToPrint, StorePayload } from "@/interfaces/labels-inteface";
import { verifyToken } from "@/utils/jwt";

export async function POST(request: NextRequest) {
  try {
    const body: DataToPrint = await request.json();

    // Validar que tenga los campos requeridos
    if (!body.storeID || !body.labels || body.labels.length === 0) {
      return NextResponse.json(
        { message: "Error al guardar los datos" },
        { status: 500 },
      );
    }

    const db = await getDb();
    const collection = db.collection("queue");

    const payload: StorePayload = verifyToken(body.storeID);
    console.log(payload.data.id);

    // Añadir timestamp de creación
    const dataWithTimestamp: DataToPrint = {
      ...body,
      storeID: payload.data.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(dataWithTimestamp);

    return NextResponse.json(
      {
        message: "Datos guardados correctamente",
        id: result.insertedId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error al guardar datos:", error);
    return NextResponse.json(
      {
        message: "Error al guardar los datos",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection("queue");

    const data = await collection.find().toArray();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error al obtener datos:", error);
    return NextResponse.json(
      {
        message: "Error al obtener los datos",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
