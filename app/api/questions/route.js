import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Funzione helper per determinare il percorso del file JSON
function getFilePath(subject) {
  const fileName = `${subject}Questions.json`;
  return path.join(process.cwd(), "data", fileName);
}

// Metodo GET
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get("subject");

  if (!subject) {
    return NextResponse.json(
      { error: "Subject parameter is required" },
      { status: 400 }
    );
  }

  const filePath = getFilePath(subject);

  try {
    const fileContents = await fs.promises.readFile(filePath, "utf8");
    const questions = JSON.parse(fileContents);
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json(
      { error: "Subject not found or invalid" },
      { status: 404 }
    );
  }
}

// Metodo POST
export async function POST(request) {
  const { subject, question } = await request.json();

  if (!subject || !question) {
    return NextResponse.json(
      { error: "Subject and question are required" },
      { status: 400 }
    );
  }

  const filePath = getFilePath(subject);

  try {
    // Legge il file esistente
    const fileContents = await fs.promises.readFile(filePath, "utf8");
    const questions = JSON.parse(fileContents);

    // Aggiunge la nuova domanda
    questions.push(question);

    // Scrive di nuovo il file aggiornato
    await fs.promises.writeFile(filePath, JSON.stringify(questions, null, 2));

    return NextResponse.json({ message: "Question added successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to update questions" },
      { status: 500 }
    );
  }
}
