export function normalizePath(value: string): string {
  if (!value) return "/";
  const withSlash = value.startsWith("/") ? value : `/${value}`;
  const trimmed = withSlash.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function withBasePath(basePath: string, path: string): string {
  const normalizedBase = basePath ? normalizePath(basePath) : "";
  const normalizedPath = normalizePath(path);
  if (!normalizedBase) return normalizedPath;
  if (normalizedPath === "/") return normalizedBase;
  return `${normalizedBase}${normalizedPath}`;
}
