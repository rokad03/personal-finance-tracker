export const fetchUsersApi = async () => {
  const res = await fetch("https://dummyjson.com/users");

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
};
