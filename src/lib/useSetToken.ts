export async function setToken(token: string) {
  const res = await fetch("/api/set-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) throw new Error("Unable to persist login session");
}
