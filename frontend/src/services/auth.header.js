export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.token) {
    return { "X-access-token": user.token };
  } else {
    return {};
  }
}
