import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { AlertCircle } from 'lucide-react';

interface TwoFactorSetupProps {
  onToggle: (enabled: boolean) => Promise<void>;
}

export const TwoFactorSetup = ({ onToggle }: TwoFactorSetupProps) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = async () => {
    if (!isEnabled) {
      setShowSetup(true);
    } else {
      setIsSubmitting(true);
      try {
        await onToggle(false);
        setIsEnabled(false);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onToggle(true);
      setIsEnabled(true);
      setShowSetup(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-6">Two-Factor Authentication</h3>

      <div className="max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-medium">
              {isEnabled ? 'Enabled' : 'Not Enabled'}
            </p>
            <p className="text-sm text-gray-500">
              Add an extra layer of security to your account
            </p>
          </div>
          <button
            onClick={handleToggle}
            disabled={isSubmitting}
            className={`${
              isEnabled
                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            } px-4 py-2 rounded-lg transition-colors`}
          >
            {isSubmitting
              ? 'Processing...'
              : isEnabled
              ? 'Disable'
              : 'Enable'}
          </button>
        </div>

        {showSetup && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg flex items-center justify-center">
              <QRCodeSVG
                value="otpauth://totp/KiwiHR:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=KiwiHR"
                size={200}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Setup Instructions:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Install an authenticator app (Google/Microsoft)</li>
                    <li>Scan the QR code with the app</li>
                    <li>Enter the verification code below</li>
                  </ol>
                </div>
              </div>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="input-field"
                  placeholder="Enter 6-digit code"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowSetup(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={verificationCode.length !== 6 || isSubmitting}
                  className="btn-primary"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </form>
          </div>
        )}

        {isEnabled && (
          <div className="mt-6 bg-green-50 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="text-green-600 mt-0.5 mr-2" size={16} />
              <div className="text-sm text-green-700">
                <p className="font-medium">Two-factor authentication is active</p>
                <p className="mt-1">
                  Your account is now protected with an additional layer of security.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};