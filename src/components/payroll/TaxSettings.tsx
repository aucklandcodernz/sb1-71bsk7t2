import React from 'react';

interface TaxSettingsProps {
  taxCode: string;
  setTaxCode: (code: string) => void;
  kiwiSaverRate: number;
  setKiwiSaverRate: (rate: number) => void;
  hasStudentLoan: boolean;
  setHasStudentLoan: (has: boolean) => void;
  errors: Record<string, string>;
}

export const TaxSettings = ({
  taxCode,
  setTaxCode,
  kiwiSaverRate,
  setKiwiSaverRate,
  hasStudentLoan,
  setHasStudentLoan,
  errors,
}: TaxSettingsProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h4 className="font-medium mb-4">Tax Settings</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tax Code
          </label>
          <select
            value={taxCode}
            onChange={(e) => setTaxCode(e.target.value)}
            className="input-field"
          >
            <option value="M">M (Main employment)</option>
            <option value="M SL">M SL (Main employment with student loan)</option>
            <option value="S">S (Secondary employment)</option>
            <option value="SH">SH (Secondary higher rate)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            KiwiSaver Rate
          </label>
          <select
            value={kiwiSaverRate}
            onChange={(e) => setKiwiSaverRate(parseInt(e.target.value))}
            className={`input-field ${errors.kiwiSaver ? 'border-red-500' : ''}`}
          >
            <option value={3}>3%</option>
            <option value={4}>4%</option>
            <option value={6}>6%</option>
            <option value={8}>8%</option>
            <option value={10}>10%</option>
          </select>
          {errors.kiwiSaver && (
            <p className="mt-1 text-sm text-red-600">{errors.kiwiSaver}</p>
          )}
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={hasStudentLoan}
              onChange={(e) => setHasStudentLoan(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600"
            />
            <span className="text-sm text-gray-700">Has student loan</span>
          </label>
        </div>
      </div>
    </div>
  );
};