import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "No audio file provided." }, { status: 400 });
    }

    const sttUrl = process.env.STT_API_URL || 'http://localhost:8000/v1/audio/transcriptions';

    console.log(`Sending audio for STT to ${sttUrl}...`);
    
    const formDataForSTT = new FormData();
    formDataForSTT.append('file', file);
    formDataForSTT.append('model', 'small'); 

    const response = await fetch(sttUrl, {
      method: "POST",
      body: formDataForSTT,
      // ВАЖНО: не нужно указывать Content-Type вручную при отправке FormData через fetch, 
      // иначе граница (boundary) не сгенерируется.
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`STT server returned error: [${response.status}] ${errorText}`);
      throw new Error(`STT API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ text: data.text });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("Transcription error:", errorMsg);
    return NextResponse.json({ error: "Transcription failed." }, { status: 500 });
  }
}
