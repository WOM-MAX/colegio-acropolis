'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { getCategoryColor } from '@/lib/utils';

export default function JournalFilters({ categorias }: { categorias: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('categoria') || '';
  const currentQ = searchParams.get('q') || '';
  const currentOrden = searchParams.get('orden') || 'desc';

  const [searchTerm, setSearchTerm] = useState(currentQ);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 400);

  // Update query when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== currentQ) {
      updateFilters({ q: debouncedSearchTerm });
    }
  }, [debouncedSearchTerm]);

  const updateFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      
      // Reseteamos a la pág 1 si hubiera paginación, etc.
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  return (
    <div className="mb-10 space-y-6 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por título o contenido..."
            className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-negro focus:border-azul-acropolis focus:bg-white focus:outline-none focus:ring-1 focus:ring-azul-acropolis transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Orden */}
        <div className="flex items-center gap-2">
          <label htmlFor="orden" className="text-sm font-medium text-gray-500">Ordenar por:</label>
          <select
            id="orden"
            className="rounded-full border border-gray-200 bg-white py-2 pl-4 pr-10 text-sm text-negro focus:border-azul-acropolis focus:outline-none focus:ring-1 focus:ring-azul-acropolis"
            value={currentOrden}
            onChange={(e) => updateFilters({ orden: e.target.value })}
          >
            <option value="desc">Más recientes</option>
            <option value="asc">Más antiguas</option>
          </select>
        </div>
      </div>

      {/* Categorias */}
      <div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilters({ categoria: null })}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              currentCategory === ''
                ? 'bg-azul-acropolis text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          
          {categorias.map((cat) => {
            const catColors = getCategoryColor(cat);
            return (
              <button
                key={cat}
                onClick={() => updateFilters({ categoria: cat })}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${catColors} ${
                  currentCategory === cat
                    ? 'ring-2 ring-azul-acropolis ring-offset-2 shadow-md'
                    : 'opacity-70 hover:opacity-100 hover:shadow-sm'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
