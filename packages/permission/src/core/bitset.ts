export function checkBit(hexBitset: string, bitIndex: number): boolean {
  const byteIndex = Math.floor(bitIndex / 8);
  const bitPosition = bitIndex % 8;
  const hexOffset = byteIndex * 2;

  if (hexOffset + 2 > hexBitset.length) return false;

  const byteValue = Number.parseInt(
    hexBitset.slice(hexOffset, hexOffset + 2),
    16
  );
  return (byteValue & (1 << bitPosition)) !== 0;
}
