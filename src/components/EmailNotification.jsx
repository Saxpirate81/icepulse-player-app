import React, { useState, useEffect } from 'react';
import { X, Copy, CheckCircle, Mail, Link as LinkIcon } from 'lucide-react';

// Notification component to show invitation/reset links
export const EmailNotification = ({ type, email, link, onClose, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    if (onCopy) onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  const getTitle = () => {
    if (type === 'invitation') return 'Invitation Sent';
    if (type === 'password-reset') return 'Password Reset Link';
    return 'Email Sent';
  };

  const getMessage = () => {
    if (type === 'invitation') {
      return `An invitation has been sent to ${email}. Since email service is not configured, please copy the link below to share with them:`;
    }
    if (type === 'password-reset') {
      return `A password reset link has been generated for ${email}. Since email service is not configured, please copy the link below:`;
    }
    return 'Email sent successfully.';
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-md border border-zinc-800">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
              <Mail className="text-cyan-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white uppercase">
                {getTitle()}
              </h3>
              <p className="text-zinc-400 text-xs">
                {type === 'invitation' ? 'Invitation Link' : 'Reset Link'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-zinc-300 text-sm">
            {getMessage()}
          </p>

          <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <LinkIcon className="text-cyan-400" size={16} />
              <span className="text-xs font-bold text-zinc-500 uppercase">Link</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={link}
                readOnly
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-lg font-bold text-sm uppercase transition-colors flex items-center gap-2 ${
                  copied
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : 'bg-cyan-600 text-white hover:bg-cyan-500'
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
            <p className="text-yellow-400 text-xs">
              <strong>Note:</strong> Email service is not configured. Copy this link and share it manually with the user.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-cyan-600 text-white px-4 py-3 rounded-xl font-bold uppercase text-sm hover:bg-cyan-500 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

