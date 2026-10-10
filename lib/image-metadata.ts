/** Strip descriptive metadata without re-encoding the image payload or removing its color profile. */
function orientation(bytes: Uint8Array) {
  const start =
    bytes[0] === 69 && bytes[1] === 120 && bytes[2] === 105 && bytes[3] === 102
      ? 6
      : 0;
  if (bytes.length < start + 8) return 1;
  const view = new DataView(
      bytes.buffer,
      bytes.byteOffset + start,
      bytes.length - start,
    ),
    little = view.getUint16(0) === 0x4949;
  if (!little && view.getUint16(0) !== 0x4d4d) return 1;
  if (view.getUint16(2, little) !== 42) return 1;
  const at = view.getUint32(4, little);
  if (at + 2 > view.byteLength) return 1;
  const count = view.getUint16(at, little);
  for (let i = 0; i < count; i++) {
    const p = at + 2 + i * 12;
    if (p + 12 > view.byteLength) break;
    if (
      view.getUint16(p, little) === 0x0112 &&
      view.getUint16(p + 2, little) === 3 &&
      view.getUint32(p + 4, little) === 1
    )
      return view.getUint16(p + 8, little);
  }
  return 1;
}
function checkOrientation(bytes: Uint8Array) {
  if (orientation(bytes) !== 1)
    throw Error(
      "This image uses an EXIF rotation. Choose Re-encode pixels to remove metadata while keeping its displayed orientation.",
    );
}
const text = (b: Uint8Array) => String.fromCharCode(...b);
export async function stripImageMetadata(file: File): Promise<Blob> {
  const bytes = new Uint8Array(await file.arrayBuffer()),
    view = new DataView(bytes.buffer);
  if (bytes[0] === 255 && bytes[1] === 216) {
    const parts: Uint8Array[] = [bytes.slice(0, 2)];
    let p = 2;
    while (p < bytes.length) {
      const start = p;
      if (bytes[p++] !== 255)
        throw Error(
          "Invalid JPEG metadata structure. Choose Re-encode pixels.",
        );
      while (bytes[p] === 255) p++;
      const marker = bytes[p++];
      if (marker === 218 || marker === 217) {
        parts.push(bytes.slice(start));
        return new Blob(
          parts.map((b) => new Uint8Array(b).buffer),
          { type: "image/jpeg" },
        );
      }
      if (marker === 1 || (marker >= 208 && marker <= 215)) {
        parts.push(bytes.slice(start, p));
        continue;
      }
      if (p + 2 > bytes.length) throw Error("Truncated JPEG.");
      const length = view.getUint16(p);
      if (length < 2 || p + length > bytes.length)
        throw Error("Truncated JPEG metadata.");
      const data = bytes.slice(p + 2, p + length);
      if (marker === 225 && text(data.slice(0, 4)) === "Exif")
        checkOrientation(data);
      const app = marker >= 224 && marker <= 239,
        keep =
          (!app && marker !== 254) ||
          (marker === 226 && text(data.slice(0, 12)) === "ICC_PROFILE\0") ||
          (marker === 238 && text(data.slice(0, 5)) === "Adobe");
      if (keep) parts.push(bytes.slice(start, p + length));
      else if (
        marker === 224 &&
        text(data.slice(0, 5)) === "JFIF\0" &&
        data.length >= 14
      ) {
        const jfif = bytes.slice(start, p + 16);
        jfif[jfif.length - 2] = 0;
        jfif[jfif.length - 1] = 0;
        new DataView(jfif.buffer).setUint16(p - start, 16);
        parts.push(jfif);
      }
      p += length;
    }
    throw Error("Incomplete JPEG.");
  }
  if (bytes.length >= 8 && text(bytes.slice(1, 4)) === "PNG") {
    const parts: Uint8Array[] = [bytes.slice(0, 8)];
    let p = 8;
    while (p + 12 <= bytes.length) {
      const length = view.getUint32(p),
        end = p + 12 + length;
      if (end > bytes.length) throw Error("Truncated PNG chunk.");
      const kind = text(bytes.slice(p + 4, p + 8));
      if (kind === "eXIf") checkOrientation(bytes.slice(p + 8, p + 8 + length));
      if (!["eXIf", "tEXt", "zTXt", "iTXt", "tIME"].includes(kind))
        parts.push(bytes.slice(p, end));
      p = end;
      if (kind === "IEND")
        return new Blob(
          parts.map((b) => new Uint8Array(b).buffer),
          { type: "image/png" },
        );
    }
    throw Error("Incomplete PNG.");
  }
  if (
    bytes.length >= 12 &&
    text(bytes.slice(0, 4)) === "RIFF" &&
    text(bytes.slice(8, 12)) === "WEBP"
  ) {
    const parts: Uint8Array[] = [];
    let p = 12;
    while (p + 8 <= bytes.length) {
      const kind = text(bytes.slice(p, p + 4)),
        length = view.getUint32(p + 4, true),
        end = p + 8 + length + (length % 2);
      if (end > bytes.length) throw Error("Truncated WebP chunk.");
      if (kind === "EXIF") checkOrientation(bytes.slice(p + 8, p + 8 + length));
      if (!["EXIF", "XMP "].includes(kind)) {
        const chunk = bytes.slice(p, end);
        if (kind === "VP8X" && length >= 10) chunk[8] &= ~12;
        parts.push(chunk);
      }
      p = end;
    }
    if (p !== bytes.length) throw Error("Invalid WebP structure.");
    const header = bytes.slice(0, 12);
    new DataView(header.buffer).setUint32(
      4,
      4 + parts.reduce((n, b) => n + b.length, 0),
      true,
    );
    return new Blob(
      [header.buffer, ...parts.map((b) => new Uint8Array(b).buffer)],
      { type: "image/webp" },
    );
  }
  throw Error(
    "Preserve image data supports JPG, PNG and WebP. Choose Re-encode pixels for this format.",
  );
}
