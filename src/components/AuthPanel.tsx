import React, { useState } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail, signOut, User } from 'firebase/auth';
import { auth, firebaseConfigured } from '../firebase';
import { LogIn, LogOut, Mail, ShieldCheck } from 'lucide-react';

export function AuthPanel({ user }: { user: User | null }) {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [mode,setMode]=useState<'signin'|'signup'>('signin');
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);
  if (!firebaseConfigured || !auth) return <div className="mx-4 my-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">Cloud sign-in is not configured yet. You can practise on this device; add Firebase web settings to enable Google and email accounts.</div>;
  const run=async(action:()=>Promise<unknown>)=>{setBusy(true);setMessage('');try{await action();setPassword('');}catch(e){setMessage(e instanceof Error?e.message:'Authentication failed. Please try again.');}finally{setBusy(false);}};
  if(user)return <div className="mx-4 my-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm"><span className="flex items-center gap-2 text-emerald-900"><ShieldCheck size={16}/><span className="max-w-[220px] truncate">{user.displayName||user.email||'Signed in'}</span></span><button onClick={()=>void run(()=>signOut(auth))} className="flex items-center gap-2 rounded-lg border border-emerald-300 px-3 py-1.5 font-semibold text-emerald-900"><LogOut size={15}/> Sign out</button></div>;
  return <section className="mx-4 my-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-3"><h3 className="font-bold text-slate-900">Save your learning progress</h3><p className="text-xs text-slate-500">Sign in to sync your progress across devices. Learning remains free.</p></div>
    <div className="flex flex-wrap gap-2">
      <button disabled={busy} onClick={()=>void run(()=>signInWithPopup(auth,new GoogleAuthProvider()))} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">Continue with Google</button>
      <button disabled={busy} onClick={()=>setMode(mode==='signin'?'signup':'signin')} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700">{mode==='signin'?'Create account':'I have an account'}</button>
    </div>
    <form className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]" onSubmit={e=>{e.preventDefault();void run(()=>mode==='signup'?createUserWithEmailAndPassword(auth,email,password):signInWithEmailAndPassword(auth,email,password));}}>
      <input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" className="min-w-0 rounded-xl border border-slate-300 px-3 py-2.5 text-sm"/>
      <input required minLength={6} type="password" autoComplete={mode==='signup'?'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (6+ characters)" className="min-w-0 rounded-xl border border-slate-300 px-3 py-2.5 text-sm"/>
      <button disabled={busy} className="rounded-xl bg-[#4F7CFF] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"><span className="flex items-center gap-1"><LogIn size={15}/>{mode==='signup'?'Register':'Sign in'}</span></button>
    </form>
    {mode==='signin'&&<button disabled={busy||!email} onClick={()=>void run(()=>sendPasswordResetEmail(auth,email))} className="mt-2 text-xs font-semibold text-blue-700 underline disabled:opacity-40">Forgot password?</button>}
    {message&&<p role="alert" className="mt-2 break-words text-xs text-rose-700">{message}</p>}
    <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-400"><Mail size={12}/> Your account is used only to save your learning progress.</p>
  </section>;
}
