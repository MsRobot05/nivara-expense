import { useState } from "react";
import { supabase } from "./supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
    } catch (error) {
      setMessage(error.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup() {
    if (!email.trim() || password.length < 6) {
      setMessage("Enter your email and a password of at least 6 characters.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      setMessage("Account request submitted. Check your email if confirmation is required.");
    } catch (error) {
      setMessage(error.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="nv-login">
      <style>{`
        .nv-login, .nv-login * { box-sizing: border-box; }
        .nv-login {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #f7f9fc;
          color: #142747;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .nv-brand-panel {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: clamp(32px, 5vw, 76px);
          background: linear-gradient(145deg, #10203c, #183963 72%, #102442);
          color: white;
        }
        .nv-brand-panel:before, .nv-brand-panel:after {
          content: "";
          position: absolute;
          pointer-events: none;
          border-radius: 50%;
          border: 1px solid rgba(222, 187, 116, .22);
        }
        .nv-brand-panel:before {
          width: 620px; height: 620px;
          right: -360px; bottom: -240px;
          box-shadow: 0 0 0 45px rgba(255,255,255,.025), 0 0 0 100px rgba(255,255,255,.02);
        }
        .nv-brand-panel:after {
          width: 380px; height: 380px;
          right: -245px; bottom: -160px;
          background: linear-gradient(135deg, transparent, rgba(216,178,104,.22));
        }
        .nv-brand, .nv-brand-copy, .nv-benefits, .nv-brand-footer {
          position: relative; z-index: 1;
        }
        .nv-brand { display: flex; align-items: center; gap: 14px; }
        .nv-mark {
          display: grid; place-items: center;
          width: 48px; height: 48px; border-radius: 12px;
          background: #d9b875; color: #10203c;
          font-size: 29px; font-weight: 800;
        }
        .nv-brand-name { font-size: 23px; font-weight: 750; letter-spacing: 5px; }
        .nv-brand-tag { margin-top: 5px; font-size: 10px; letter-spacing: 3px; color: #d6dfed; }
        .nv-brand-copy { max-width: 520px; margin: 54px 0 42px; }
        .nv-brand-copy h1 {
          margin: 0 0 20px; font-size: clamp(38px, 4.2vw, 60px);
          line-height: 1.1; letter-spacing: -2px; font-weight: 700;
        }
        .nv-brand-copy h1 span { color: #e0bd79; }
        .nv-brand-copy p { max-width: 430px; color: #c8d4e6; font-size: 17px; line-height: 1.8; }
        .nv-benefits { display: grid; gap: 23px; }
        .nv-benefit { display: flex; align-items: center; gap: 15px; }
        .nv-benefit-icon {
          flex: 0 0 48px; height: 48px; border-radius: 50%;
          display: grid; place-items: center; background: rgba(255,255,255,.08);
          color: #e0bd79; font-size: 21px;
        }
        .nv-benefit strong { display: block; font-size: 14px; font-weight: 600; }
        .nv-benefit small { display: block; margin-top: 5px; color: #aebed5; font-size: 12px; }
        .nv-brand-footer { padding-top: 22px; margin-top: 45px; border-top: 1px solid rgba(255,255,255,.13); color: #aebed5; font-size: 10px; letter-spacing: 2px; }
        .nv-form-side {
          display: grid; place-items: center;
          padding: 36px clamp(20px, 5vw, 76px);
        }
        .nv-card { width: 100%; max-width: 460px; padding: clamp(26px, 4vw, 48px); background: white; border: 1px solid #e1e7f0; border-radius: 20px; box-shadow: 0 22px 65px rgba(23,45,79,.08); }
        .nv-card-brand { display: flex; justify-content: center; align-items: center; gap: 11px; margin-bottom: 38px; }
        .nv-card-brand .nv-mark { width: 40px; height: 40px; font-size: 24px; border-radius: 9px; }
        .nv-card-brand .nv-brand-name { color: #142747; font-size: 20px; }
        .nv-card-brand .nv-brand-tag { color: #667792; font-size: 8px; letter-spacing: 2px; }
        .nv-card h2 { margin: 0; text-align: center; font-size: 30px; letter-spacing: -1px; }
        .nv-subtitle { margin: 10px 0 30px; text-align: center; color: #73829b; font-size: 14px; }
        .nv-field { display: block; margin-bottom: 20px; color: #263b5b; font-size: 13px; font-weight: 600; }
        .nv-input-wrap { display: flex; align-items: center; gap: 10px; margin-top: 9px; padding: 0 13px; border: 1px solid #d8e0ec; border-radius: 9px; background: #fff; transition: border-color .2s, box-shadow .2s; }
        .nv-input-wrap:focus-within { border-color: #315b91; box-shadow: 0 0 0 3px rgba(49,91,145,.10); }
        .nv-input-wrap input { min-width: 0; width: 100%; height: 49px; border: 0; outline: none; background: transparent; color: #142747; font: inherit; font-size: 14px; }
        .nv-input-wrap input::placeholder { color: #9aa7ba; }
        .nv-eye { border: 0; background: transparent; color: #647794; cursor: pointer; padding: 5px; }
        .nv-primary {
          width: 100%; min-height: 49px; margin-top: 7px; border: 0; border-radius: 9px;
          background: linear-gradient(100deg, #19385f, #244d7e); color: white;
          font-size: 14px; font-weight: 650; cursor: pointer;
          box-shadow: 0 7px 16px rgba(25,56,95,.15); transition: transform .2s, opacity .2s;
        }
        .nv-primary:hover { transform: translateY(-1px); }
        .nv-primary:disabled, .nv-secondary:disabled { opacity: .6; cursor: wait; }
        .nv-secondary { width: 100%; margin-top: 12px; min-height: 46px; border: 1px solid #d8e0ec; border-radius: 9px; background: white; color: #284465; font-weight: 600; cursor: pointer; }
        .nv-message { margin: 16px 0 0; padding: 11px 12px; border-radius: 8px; background: #f1f5fa; color: #294568; font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; }
        .nv-secure { margin-top: 28px; text-align: center; color: #8997ab; font-size: 11px; }
        .nv-mobile-brand { display: none; }
        @media (max-width: 800px) {
          .nv-login { grid-template-columns: 1fr; }
          .nv-brand-panel { display: none; }
          .nv-form-side { min-height: 100vh; padding: 28px 18px; }
          .nv-card { max-width: 470px; padding: 30px 24px; }
          .nv-mobile-brand { display: flex; justify-content: center; align-items: center; gap: 10px; margin-bottom: 28px; }
          .nv-mobile-brand .nv-brand-name { color: #142747; font-size: 19px; }
          .nv-mobile-brand .nv-brand-tag { color: #667792; font-size: 8px; }
          .nv-card-brand { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nv-primary, .nv-input-wrap { transition: none; }
        }
      `}</style>

      <section className="nv-brand-panel">
        <div className="nv-brand">
          <div className="nv-mark">N</div>
          <div>
            <div className="nv-brand-name">NIVARA</div>
            <div className="nv-brand-tag">INTELLIGENT EXPENSES</div>
          </div>
        </div>

        <div>
          <div className="nv-brand-copy">
            <h1>Clarity in every <span>expense.</span></h1>
            <p>A smarter way to manage, review and control business spending.</p>
          </div>

          <div className="nv-benefits">
            <div className="nv-benefit">
              <div className="nv-benefit-icon">◇</div>
              <div><strong>Secure &amp; accountable</strong><small>Your expense records in one place.</small></div>
            </div>
            <div className="nv-benefit">
              <div className="nv-benefit-icon">↗</div>
              <div><strong>Simpler approvals</strong><small>Keep voucher reviews moving.</small></div>
            </div>
            <div className="nv-benefit">
              <div className="nv-benefit-icon">▥</div>
              <div><strong>Clearer insights</strong><small>Understand your business spending.</small></div>
            </div>
          </div>
        </div>

        <footer className="nv-brand-footer">NIVARA&nbsp; • &nbsp;EXPENSE CONTROL&nbsp; • &nbsp;BUILT FOR TEAMS</footer>
      </section>

      <section className="nv-form-side">
        <div className="nv-card">
          <div className="nv-mobile-brand">
            <div className="nv-mark">N</div>
            <div><div className="nv-brand-name">NIVARA</div><div className="nv-brand-tag">INTELLIGENT EXPENSES</div></div>
          </div>

          <div className="nv-card-brand">
            <div className="nv-mark">N</div>
            <div><div className="nv-brand-name">NIVARA</div><div className="nv-brand-tag">INTELLIGENT EXPENSES</div></div>
          </div>

          <h2>Welcome back</h2>
          <p className="nv-subtitle">Sign in to access your workspace.</p>

          <form onSubmit={handleLogin}>
            <label className="nv-field">
              Work email
              <div className="nv-input-wrap">
                <span aria-hidden="true">✉</span>
                <input type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
            </label>

            <label className="nv-field">
              Password
              <div className="nv-input-wrap">
                <span aria-hidden="true">▣</span>
                <input type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required />
                <button className="nv-eye" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
              </div>
            </label>

            <button className="nv-primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in  →"}
            </button>
          </form>

          <button className="nv-secondary" type="button" disabled={loading} onClick={handleSignup}>
            Create account
          </button>

          {message && <p className="nv-message" role="status">{message}</p>}

          <div className="nv-secure">♧ &nbsp; Secure access · Expense control</div>
        </div>
      </section>
    </main>
  );
}
