import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Check, Edit2, ChevronRight, AlertCircle, Download } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useBrandVoice } from '@/context/BrandVoiceContext';
import StrategicDataService from '@/services/StrategicDataService';

// ... rest of the file remains the same ... 