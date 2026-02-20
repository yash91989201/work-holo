/**
 * Returns whether a permission bit is enabled in a hex-encoded bitset.
 */
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

/**
 * Creates an empty bitset sized for the provided permission count.
 */
export function createEmptyBitset(totalPermissions: number): Uint8Array {
  return new Uint8Array(Math.ceil(totalPermissions / 8));
}

/**
 * Sets one bit index to enabled in a mutable bitset.
 */
export function setBit(bitset: Uint8Array, index: number): void {
  const byteIndex = Math.floor(index / 8);
  const bitPosition = index % 8;
  if (byteIndex < bitset.length) {
    bitset[byteIndex] = (bitset[byteIndex] ?? 0) | (1 << bitPosition);
  }
}

/**
 * Encodes a bitset to a compact lowercase hex string.
 */
export function bitsetToHex(bitset: Uint8Array): string {
  return Array.from(bitset)
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}
