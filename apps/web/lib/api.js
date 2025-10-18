//small helper for authenticated fetches

export async function api(path, options = {}) {
  const res = await fetch(`http://localhost:3001${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
