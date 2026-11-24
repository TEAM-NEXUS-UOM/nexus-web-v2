// TEMPORARY: dev-only tool to act as any mock user.
import { useNavigate } from "react-router-dom";
import { useAuth } from "../shared/components/auth/useAuth";
import { getMockUsers, getHomePath } from "../shared/services/authService";

function DevRoleSwitcher() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const users = getMockUsers();

  const handleChange = (userId: string) => {
    if (userId === "") {
      logout();
      navigate("/");
      return;
    }
    const next = users.find((u) => u.userId === userId);
    if (!next) return;
    login(next);
    navigate(getHomePath(next.role));
  };

  return (
    <div className="fixed bottom-4 right-4 z-100 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs shadow-lg">
      <label
        htmlFor="dev-user-select"
        className="mb-1 block font-semibold text-amber-900"
      >
        DEV · Act as
      </label>
      <select
        id="dev-user-select"
        value={user?.userId ?? ""}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded border border-amber-300 bg-white px-2 py-1"
      >
        <option value="">Logged out</option>
        {users.map((u) => (
          <option key={u.userId} value={u.userId}>
            {u.role} · {u.fullName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DevRoleSwitcher;
