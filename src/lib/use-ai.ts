import { useServerFn } from "@tanstack/react-start";
import { useCallback, useState } from "react";
import { runAi } from "./ai.functions";

export type AiKind = "email" | "meeting" | "plan" | "research" | "chat";

export function useAi<T>(kind: AiKind) {
  const call = useServerFn(runAi);
  const [result, setResult] = useState<T | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (
      input: Record<string, unknown>,
      history: { role: string; content: string }[] = [],
    ): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await call({ data: { kind, input, history } });
        setResult(res.data as T);
        setIsMock(Boolean(res.mock));
        return res.data as T;
      } catch {
        setError("We couldn't generate your response right now. Please try again.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [call, kind],
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { generate, result, setResult, isMock, loading, error, reset };
}
