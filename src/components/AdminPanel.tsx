import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Send, Users, BellRing, X, LogIn } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext.tsx';

export default function AdminPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, login, isAdmin, loading } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const sendNotification = async () => {
    if (!title || !body) return;
    setIsSending(true);
    setStatus('Sending to victims...');

    const path = 'broadcasts';
    try {
      await addDoc(collection(db, path), {
        title,
        body,
        sentAt: new Date().toISOString(),
        sender: user?.email
      });

      setStatus('Successfully broadcasted to Hall of Regrets!');
      setTimeout(() => {
        setStatus(null);
        setTitle('');
        setBody('');
      }, 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    } finally {
      setIsSending(false);
    }
  };

  if (isOpen && loading) {
    return (
      <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (isOpen && !user) {
    return (
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-6 text-center"
        >
           <div className="max-w-md">
             <Shield size={64} className="mx-auto text-primary mb-6" />
             <h2 className="text-3xl font-serif font-black text-white mb-4 italic">IDENTIFICATION REQUIRED</h2>
             <p className="text-white/60 mb-8">You must be logged in to access the High Command panel. Only authorized SCA staff can broadcast chaos.</p>
             <div className="flex flex-col gap-4">
               <button 
                 onClick={login}
                 className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-xl hover:bg-primary-dark transition-all"
               >
                 <LogIn size={18} />
                 Sign in with Google
               </button>
               <button onClick={onClose} className="px-8 py-3 text-white/40 hover:text-white font-black uppercase tracking-widest transition-colors">Abort Mission</button>
             </div>
           </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (isOpen && !isAdmin) {
    return (
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-6 text-center"
        >
           <div className="max-w-md">
             <Shield size={64} className="mx-auto text-primary mb-6" />
             <h2 className="text-3xl font-serif font-black text-white mb-4 italic">ACCESS DENIED</h2>
             <p className="text-white/60 mb-2">Authenticated as: <span className="text-white font-bold">{user?.email}</span></p>
             <p className="text-white/60 mb-8">This account is not in the SCA High Command list. Only the specified admin ({'mehaalkhan.2@gmail.com'}) can perform this action.</p>
             <button onClick={onClose} className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest rounded-xl">Go back to your misery</button>
           </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          className="fixed inset-y-0 left-0 w-full max-w-lg bg-primary-dark text-white shadow-2xl z-[200] p-12 overflow-y-auto"
        >
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full">
            <X size={24} />
          </button>

          <header className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="text-accent" size={32} />
              <h2 className="text-2xl font-serif font-black uppercase tracking-tight">SCA High Command</h2>
            </div>
            <p className="text-white/40 text-sm">Broadcasting confusion since 20XX.</p>
          </header>

          <div className="space-y-8">
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <BellRing size={20} className="text-accent" />
                Broadcast Notification
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Message Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. FEE HIKE INBOUND!"
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Detailed Confusion</label>
                  <textarea 
                    rows={4}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Describe the disaster..."
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors resize-none"
                  />
                </div>

                <button 
                  onClick={sendNotification}
                  disabled={isSending || !title || !body}
                  className="w-full bg-accent text-white py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSending ? 'Transmitting Chaos...' : 'Dispatch Disaster'}
                  <Send size={18} />
                </button>

                {status && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-xs font-bold text-accent tracking-widest"
                  >
                    {status}
                  </motion.p>
                )}
              </div>
            </div>

            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Users size={20} className="text-accent" />
                Target Population
              </h3>
              <p className="text-white/40 text-sm mb-6">You are targeting currently active victims who haven't escaped yet.</p>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-accent animate-pulse" />
                </div>
                <span className="text-xs font-black">ALL</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
