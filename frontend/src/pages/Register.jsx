import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/ui/Button";
import { Field, Input } from "../components/ui/Field";
import { useAuth } from "../context/AuthContext";
import { apiError } from "../lib/constants";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(email, password);
      navigate("/");
    } catch (err) {
      setError(apiError(err, "Registration failed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start organizing projects in under a minute.">
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
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </Field>
        {error && (
          <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </p>
        )}
        <Button type="submit" loading={submitting} className="mt-2 w-full justify-center">
          Create account
          {!submitting && <ArrowRight className="size-4" />}
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-brand hover:text-ink transition-colors">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
