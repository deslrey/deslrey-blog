import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import request from "../utils/http";

type PageResponse<T> = {
    list?: T[];
    total?: number;
    pageNum?: number;
    pageSize?: number;
};

type UsePagedQueryOptions<T> = {
    apiPath: string;
    initialRowsPerPage?: number;
    mapData?: (raw: unknown) => PageResponse<T>;
};

export function usePagedQuery<T>({
    apiPath,
    initialRowsPerPage = 10,
    mapData,
}: UsePagedQueryOptions<T>) {
    const [list, setList] = useState<T[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchPage = useCallback(
        async (pageNum = 1, pageSize = rowsPerPage) => {
            setLoading(true);
            const res = await request.get(apiPath, {
                params: { page: pageNum, pageSize },
            });
            const raw = mapData ? mapData(res.data) : (res.data ?? {});
            setList(raw.list ?? []);
            setTotal(raw.total ?? 0);
            setPage(Math.max((raw.pageNum ?? pageNum) - 1, 0));
            setRowsPerPage(raw.pageSize ?? pageSize);
            setLoading(false);
        },
        [apiPath, mapData, rowsPerPage]
    );

    useEffect(() => {
        fetchPage(1, initialRowsPerPage);
    }, [fetchPage, initialRowsPerPage]);

    return {
        list,
        page,
        rowsPerPage,
        total,
        loading,
        setList,
        fetchPage,
        onPageChange: (_: unknown, nextPage: number) => fetchPage(nextPage + 1, rowsPerPage),
        onRowsPerPageChange: (event: ChangeEvent<HTMLInputElement>) => {
            const nextSize = parseInt(event.target.value, 10);
            fetchPage(1, nextSize);
        },
    };
}
