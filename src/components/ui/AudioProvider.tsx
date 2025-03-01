'use client';

import React, { ReactNode } from 'react';
import AudioPlayer from './AudioPlayer';

interface AudioProviderProps {
  children: ReactNode;
}

export default function AudioProvider({ children }: AudioProviderProps) {
  return (
    <>
      {children}
      <AudioPlayer />
    </>
  );
}