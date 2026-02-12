// components/common/DataTable.tsx
interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onView?: (item: T) => void;
  onDelete?: (id: string) => Promise<void>;
  emptyMessage?: string;
  // Pagination props
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}
