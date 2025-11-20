
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { type User } from '../types';
import { ChevronLeftIcon } from '../constants';

interface SignUpScreenProps {
  onSignInClick: () => void;
  onSignUpSuccess: () => void;
  onBack: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignInClick, onSignUpSuccess, onBack }) => {
  const [step, setStep] = useState(1); // 1 for details, 2 for OTP
  const [details, setDetails] = useState<Omit<User, 'role' | 'bio' | 'avatarUrl'>>({
      name: '',
      phone: '',
      email: '',
      address: '',
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { signup } = useContext(AuthContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDetails({
        ...details,
        [e.target.name]: e.target.value,
    });
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.name || !details.phone || !details.email) {
        setError('Please fill out all required fields.');
        return;
    }
    setError('');
    // In a real app, you would trigger sending an OTP here.
    setStep(2); 
  };
  
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Using a mock OTP for this simulation
    if (otp === '1234') {
        if (signup(details)) {
            onSignUpSuccess();
        } else {
            setError('Could not create account. The phone number may already be in use.');
            setStep(1); // Go back to details step
        }
    } else {
        setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#F9F5F0]">
      <div className="absolute top-4 left-4 z-20">
             <button onClick={onBack} className="bg-white/80 backdrop-blur p-2 rounded-full shadow-sm hover:bg-white">
                 <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
             </button>
        </div>
      <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto-format=fit=crop" alt="Interior design" className="w-full h-full object-cover opacity-20"/>
        </div>
        <div className="relative z-10 w-full max-w-sm bg-white/70 backdrop-blur-md p-8 rounded-lg shadow-2xl">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                {step === 1 ? 'Create Account' : 'Verify Phone'}
            </h1>
            <p className="text-center text-gray-500 mb-8">
                {step === 1 ? 'Join the Roberts family' : `Enter the OTP sent to ${details.phone}`}
            </p>

            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

            {step === 1 && (
                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" value={details.name} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <input type="tel" name="phone" value={details.phone} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" name="email" value={details.email} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Delivery Address (Optional)</label>
                        <textarea name="address" value={details.address} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md h-20"></textarea>
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
                        <input 
                            type="text" 
                            placeholder="••••"
                            maxLength={4}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 text-center tracking-[1em]"
                            autoFocus
                        />
                    </div>
                    <button type="submit" className="w-full bg-gray-800 text-white py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors">
                        Create Account
                    </button>
                     <button type="button" onClick={() => { setStep(1); setError(''); setOtp('')}} className="w-full text-center text-sm text-gray-600 hover:underline">
                        Change details
                    </button>
                </form>
            )}

            <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{' '}
                <button onClick={onSignInClick} className="font-semibold text-gray-800 hover:underline">
                    Sign In
                </button>
            </p>
        </div>
    </div>
  );
};

export default SignUpScreen;
