import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

interface SignInScreenProps {
  onSignUpClick: () => void;
  onSignInSuccess: () => void;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ onSignUpClick, onSignInSuccess }) => {
  const [step, setStep] = useState(1); // 1 for phone, 2 for OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) {
      setError('');
      setStep(2);
    } else {
      setError('Please enter a valid phone number.');
    }
  };
  
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(phone, otp)) {
        onSignInSuccess();
    } else {
        setError('Invalid phone number or OTP.');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#F9F5F0]">
        <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1556742044-53342c8a7536?q=80&w=1887&auto-format&fit=crop" alt="Interior design" className="w-full h-full object-cover opacity-20"/>
        </div>

        <div className="relative z-10 w-full max-w-sm bg-white/70 backdrop-blur-md p-8 rounded-lg shadow-2xl">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Welcome Back
            </h1>
            <p className="text-center text-gray-500 mb-8">Sign in to continue</p>

            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

            {step === 1 && (
                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <input 
                            type="tel" 
                            placeholder="+254 712 345 678"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                        />
                    </div>
                    <button type="submit" className="w-full bg-gray-800 text-white py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors">
                        Continue
                    </button>
                </form>
            )}

            {step === 2 && (
                 <form onSubmit={handleOtpSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Enter OTP</label>
                        <p className="text-xs text-gray-500">An OTP has been sent to {phone}</p>
                        <input 
                            type="text" 
                            placeholder="••••"
                            maxLength={4}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 text-center tracking-[1em]"
                        />
                    </div>
                    <button type="submit" className="w-full bg-gray-800 text-white py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors">
                        Sign In
                    </button>
                    <button type="button" onClick={() => { setStep(1); setError(''); setOtp('')}} className="w-full text-center text-sm text-gray-600 hover:underline">
                        Change phone number
                    </button>
                </form>
            )}

            <p className="text-center text-sm text-gray-500 mt-6">
                Don't have an account?{' '}
                <button onClick={onSignUpClick} className="font-semibold text-gray-800 hover:underline">
                    Sign Up
                </button>
            </p>
        </div>
    </div>
  );
};

export default SignInScreen;