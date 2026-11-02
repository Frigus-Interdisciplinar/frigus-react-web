export async function serviceCall<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (cause) {
    if (cause instanceof Error) throw cause;
    throw new Error("Não foi possível concluir a operação.", { cause });
  }
}
