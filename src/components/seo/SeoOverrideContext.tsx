import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface SeoOverride {
  title: string;
  description: string;
}

interface SeoOverrideValue {
  override: SeoOverride | null;
  setOverride: (value: SeoOverride | null) => void;
}

const SeoOverrideContext = createContext<SeoOverrideValue | null>(null);

export function SeoOverrideProvider({ children }: { children: ReactNode }) {
  const [override, setOverride] = useState<SeoOverride | null>(null);
  const value = useMemo(() => ({ override, setOverride }), [override]);
  return (
    <SeoOverrideContext.Provider value={value}>
      {children}
    </SeoOverrideContext.Provider>
  );
}

function useSeoOverrideContext() {
  const ctx = useContext(SeoOverrideContext);
  if (!ctx) {
    throw new Error('useSeoOverrideContext must be used within SeoOverrideProvider');
  }
  return ctx;
}

/** 개별 페이지에서 title/description을 라우트 기본값 대신 덮어쓰고 싶을 때 사용. */
export function useSeoOverride(value: SeoOverride | null) {
  const { setOverride } = useSeoOverrideContext();

  useEffect(() => {
    setOverride(value);
    return () => setOverride(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.title, value?.description]);
}

export function useSeoOverrideValue() {
  return useSeoOverrideContext().override;
}
