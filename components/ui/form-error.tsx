import React from 'react';

interface FormErrorProps {
  error?: string;
}

export default function FormError({ error }: FormErrorProps) {
  if (!error) return null;
  
  return (
    <div className="text-destructive text-sm mt-1 font-medium">
      {error}
    </div>
  );
}