'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';

import { fetchGuides } from '@/actions/guide';
import { GuideModel } from '@/types/models/guides';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '../_components/GuideListDataTable';
import { columns } from '../_components/GuideListColumns';

export default function Page() {
  const [guides, setGuides] = useState<GuideModel[]>([]);

  useEffect(() => {
    fetchGuidesData();
  }, []);

  const fetchGuidesData = async () => {
    const { success, data, message } = await fetchGuides();
    if (!success) {
      return;
    }

    const sortedData = data?.sort((a, b) => {
      if (a.location.placeName < b.location.placeName) {
        return -1;
      }
      if (a.location.placeName > b.location.placeName) {
        return 1;
      }
      return 0;
    });

    setGuides(sortedData || []);
  };

  return (
    <div>
      <DataTable columns={columns} data={guides} />
    </div>
  );
}
