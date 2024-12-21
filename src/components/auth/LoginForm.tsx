import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle, Building2, Shield, Users, DollarSign, Scale, User } from 'lucide-react';

interface TestCredential {
  role: string;
  email: string;
  password: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

const TEST_CREDENTIALS: TestCredential[] = [
  {
    role: 'Super Admin',
    email: 'super.admin@kiwihr.co.nz',
    password: 'password123',
    icon: Shield,
    description: 'Full platform access',
    color: 'indigo'
  },
  {
    role: 'HR Manager',
    email: 'hr.manager@kiwihr.co.nz',
    password: 'password123',
    icon: Users,
    description: 'Organization-wide HR access',
    color: 'blue'
  },
  {
    role: 'Team Leader',
    email: 'team.leader@kiwihr.co.nz',
    password: 'password123',
    icon: Building2,
    description: 'Team management access',
    color: 'green'
  },
  {
    role: 'Payroll Admin',
    email: 'payroll.admin@kiwihr.co.nz',
    password: 'password123',
    icon: DollarSign,
    description: 'Payroll management access',
    color: 'yellow'
  },
  {
    role: 'Compliance Officer',
    email: 'compliance.officer@kiwihr.co.nz',
    password: 'password123',
    icon: Scale,
    description: 'Compliance management access',
    color: 'red'
  },
  {
    role: 'Employee',
    email: 'employee@kiwihr.co.nz',
    password: 'password123',
    icon: User,
    description: 'Basic employee access',
    color: 'purple'
  }
];

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = (credential: TestCredential) => {
    setEmail(credential.email);
    setPassword(credential.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-4xl font-bold text-indigo-900 mb-2">KiwiHR</h1>
        <h2 className="text-center text-xl text-gray-600">
          Modern HR Software for NZ Businesses
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center space-x-2 btn-primary py-3"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Sign in</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Test Credentials</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {TEST_CREDENTIALS.map((cred) => {
                const Icon = cred.icon;
                return (
                  <button
                    key={cred.role}
                    onClick={() => handleTestLogin(cred)}
                    className={`w-full p-4 border rounded-lg hover:border-${cred.color}-500 hover:shadow-md transition-all group`}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg bg-${cred.color}-100 group-hover:bg-${cred.color}-200 transition-colors`}>
                        <Icon className={`text-${cred.color}-600`} size={20} />
                      </div>
                      <div className="ml-4 text-left">
                        <p className="font-medium text-gray-900">{cred.role}</p>
                        <p className="text-sm text-gray-500">{cred.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};