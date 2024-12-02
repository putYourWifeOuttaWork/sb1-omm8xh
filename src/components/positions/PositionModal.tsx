import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FormField } from './FormField';
import { useFieldHighlight } from '../../hooks/useFieldHighlight';

interface PositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (position: any) => void;
  stockPrices: Record<string, number>;
  companyLogos: Record<string, { name: string; logo: string }>;
}

export function PositionModal({
  isOpen,
  onClose,
  onSubmit,
  stockPrices,
  companyLogos
}: PositionModalProps) {
  const [formData, setFormData] = useState({
    stock: '',
    positionType: 'short_put',
    strikePrice: '',
    quantity: 1,
    expirationDate: ''
  });

  const { highlightedField, moveToNextField } = useFieldHighlight([
    'stock-select',
    'position-type',
    'strike-price',
    'expiration-date'
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-element rounded-xl p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Add New Position
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Stock"
            type="select"
            value={formData.stock}
            onChange={(value) => setFormData(prev => ({ ...prev, stock: value }))}
            options={Object.entries(stockPrices).map(([symbol, price]) => ({
              value: symbol,
              label: `${companyLogos[symbol].name} (${symbol}) - $${price.toFixed(2)}`
            }))}
            validation={{ required: true }}
            highlightRef="stock-select"
            isHighlighted={highlightedField === 'stock-select'}
            onFocus={() => moveToNextField('position-type')}
          />

          <FormField
            label="Position Type"
            type="select"
            value={formData.positionType}
            onChange={(value) => setFormData(prev => ({ ...prev, positionType: value }))}
            options={[
              { value: 'short_put', label: 'Short Put' },
              { value: 'short_call', label: 'Short Call' }
            ]}
            highlightRef="position-type"
            isHighlighted={highlightedField === 'position-type'}
            onFocus={() => moveToNextField('strike-price')}
          />

          <FormField
            label="Strike Price"
            type="number"
            value={formData.strikePrice}
            onChange={(value) => setFormData(prev => ({ ...prev, strikePrice: value }))}
            validation={{ required: true, min: 0 }}
            highlightRef="strike-price"
            isHighlighted={highlightedField === 'strike-price'}
            onFocus={() => moveToNextField('expiration-date')}
          />

          <FormField
            label="Quantity"
            type="number"
            value={formData.quantity}
            onChange={(value) => setFormData(prev => ({ ...prev, quantity: value }))}
            validation={{ required: true, min: 1 }}
          />

          <FormField
            label="Expiration Date"
            type="date"
            value={formData.expirationDate}
            onChange={(value) => setFormData(prev => ({ ...prev, expirationDate: value }))}
            validation={{ required: true }}
            highlightRef="expiration-date"
            isHighlighted={highlightedField === 'expiration-date'}
          />

          <button
            type="submit"
            className="w-full bg-accent-blue dark:bg-accent-teal text-white py-3 rounded-lg
              hover:opacity-90 transition-opacity mt-6"
          >
            Add Position
          </button>
        </form>
      </div>
    </div>
  );
}