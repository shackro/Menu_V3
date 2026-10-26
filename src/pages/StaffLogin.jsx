import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, Mail, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StaffLogin() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-10 text-stone-900 dark:bg-neutral-950 dark:text-neutral-100">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-amber-600 dark:text-neutral-400 dark:hover:text-amber-400">
          <ArrowLeft className="h-4 w-4" /> Back to Savanna Grill
        </Link>

        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
              <ShieldCheck className="h-7 w-7 text-amber-500" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">Savanna Grill</p>
            <h1 className="mt-2 text-2xl font-black tracking-tight">Staff sign in</h1>
            <p className="mt-2 text-sm text-stone-500 dark:text-neutral-400">
              Sign-in will be connected when the staff authentication backend is ready.
            </p>
          </div>

          <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-500 dark:text-neutral-400">Work email</span>
              <span className="relative block">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  autoComplete="username"
                  placeholder="name@savannagrill.co.ke"
                  disabled
                  className="w-full rounded-xl border border-stone-200 bg-stone-100 py-3 pl-10 pr-4 text-sm text-stone-500 disabled:cursor-not-allowed dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-500"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-500 dark:text-neutral-400">Password</span>
              <span className="relative block">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder="Provided by your manager"
                  disabled
                  className="w-full rounded-xl border border-stone-200 bg-stone-100 py-3 pl-10 pr-4 text-sm text-stone-500 disabled:cursor-not-allowed dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-500"
                />
              </span>
            </label>

            <button
              type="submit"
              disabled
              className="w-full cursor-not-allowed rounded-xl bg-amber-500/50 px-4 py-3 text-sm font-bold text-neutral-950/70"
            >
              Sign in unavailable
            </button>
          </form>

          <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-relaxed text-stone-600 dark:text-neutral-400">
            Authentication is not active yet. No demo credentials are used or stored in this app.
          </div>

          <Link
            to="/staff"
            className="mt-5 flex w-full items-center justify-center rounded-xl border border-stone-200 px-4 py-3 text-sm font-bold transition hover:border-amber-500 hover:text-amber-700 dark:border-neutral-700 dark:hover:text-amber-400"
          >
            View local dashboard preview
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
