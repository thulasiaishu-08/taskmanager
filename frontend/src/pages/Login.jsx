import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/ui/Button";
import { Field, Input } from "../components/ui/Field";
import { useAuth } from "../context/AuthContext";
import { apiError } from "../lib/constants";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(apiError(err, "Login failed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to pick up where you left off.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            icon={Mail}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </Field>
        <Field label="Password" htmlFor="password">
          <Input
            id="password"
            icon={Lock}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </Field>
        {error && (
          <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </p>
        )}
        <Button type="submit" loading={submitting} className="mt-2 w-full justify-center">
          Log in
          {!submitting && <ArrowRight className="size-4" />}
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-ink-muted">
        New here?{" "}
        <Link to="/register" className="font-medium text-brand hover:text-ink transition-colors">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
