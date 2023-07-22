export const getProtectedData = async <T>(
  endPoint: string,
  token: string | null,
): Promise<T> => {
  const response = await fetch(
    import.meta.env.VITE_BACKEND_URL + "/" + endPoint,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const data = await response.json();
  if (response.ok) return data as T;

  if (response.status === 401) throw new Error(`401: Unauthorized`);
  throw new Error(`Could not fetch data from /${endPoint}`);
};

export const mutateProtectedData = async <T, U>(
  endPoint: string,
  body: U,
  token: string | null,
  method: "POST" | "PATCH" | "DELETE" = "POST",
): Promise<T> => {
  const response = await fetch(
    import.meta.env.VITE_BACKEND_URL + "/" + endPoint,
    {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    },
  );
  const data = await response.json();
  if (response.ok) return data as T;

  if (response.status === 401) throw new Error(`401: Unauthorized`);
  throw new Error(`Could not fetch data from /${endPoint}`);
};
