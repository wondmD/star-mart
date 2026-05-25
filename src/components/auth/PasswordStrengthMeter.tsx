'use client';

import { useMemo } from 'react';
import { checkPasswordStrength } from '@/schemas';

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const passwordStrength = useMemo(() => checkPasswordStrength(password), [password]);

  if (!password) {
    return null;
  }

  const strengthColor =
    passwordStrength.strength === 'strong'
      ? '#10b981'
      : passwordStrength.strength === 'good'
        ? '#f59e0b'
        : passwordStrength.strength === 'fair'
          ? '#f97316'
          : '#ef4444';

  return (
    <div className="mt-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
          Password Strength
        </span>
        <span className="text-xs font-semibold" style={{ color: strengthColor }}>
          {passwordStrength.strength.charAt(0).toUpperCase() + passwordStrength.strength.slice(1)}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-300">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${(passwordStrength.score / 5) * 100}%`,
            backgroundColor: strengthColor,
          }}
        />
      </div>
    </div>
  );
}
