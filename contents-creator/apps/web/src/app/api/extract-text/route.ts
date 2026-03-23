export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file' }, { status: 400 });
  }

  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'docx') {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await mammoth.extractRawText({ buffer });
    return NextResponse.json({ text: result.value });
  }

  // MD/TXT는 직접 읽기
  const text = await file.text();
  return NextResponse.json({ text });
}
