import { format } from 'date-fns';

interface PositionData {
  symbol: string;
  positionType: 'short_put' | 'short_call';
  strikePrice: number;
  currentPrice: number;
  quantity: number;
  creditReceived: number;
  expirationDate: string;
  currentOptionPrice: number;
}

export function exportPositionsToCSV(positions: PositionData[]) {
  // CSV Headers
  const headers = [
    'Symbol',
    'Position Type',
    'Strike Price',
    'Current Price',
    'Quantity',
    'Credit Received',
    'Expiration Date',
    'Current Option Price',
    'Unrealized P/L',
    'P/L %',
    'Export Date'
  ];

  // Transform positions data into CSV rows
  const rows = positions.map(position => {
    const unrealizedPL = (position.creditReceived - position.currentOptionPrice) * position.quantity * 100;
    const plPercentage = ((position.creditReceived - position.currentOptionPrice) / position.creditReceived) * 100;

    return [
      position.symbol,
      position.positionType === 'short_put' ? 'Short Put' : 'Short Call',
      position.strikePrice.toFixed(2),
      position.currentPrice.toFixed(2),
      position.quantity,
      position.creditReceived.toFixed(2),
      position.expirationDate,
      position.currentOptionPrice.toFixed(2),
      unrealizedPL.toFixed(2),
      plPercentage.toFixed(2) + '%',
      format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `positions_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}