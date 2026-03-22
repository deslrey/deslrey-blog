import React, { useEffect, useState } from "react";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    MenuItem,
    Button,
    Chip,
    Tooltip,
    CircularProgress
} from "@mui/material";
import dayjs from "dayjs";
import styles from "./index.module.scss";
import request from "../../../utils/http";
import { visitApi } from "../../../api";
import type { VisitLog } from "../../../types";

type FilterState = {
    keyword: string;
    device: string;
    startDate: string;
    endDate: string;
};

const defaultFilters: FilterState = {
    keyword: "",
    device: "",
    startDate: "",
    endDate: ""
};

const deviceOptions = [
    { label: "全部设备", value: "" },
    { label: "电脑", value: "PC" },
    { label: "手机", value: "Mobile" },
    { label: "平板", value: "Tablet" },
    { label: "未知", value: "Unknown" }
];

const VisitLogPage: React.FC = () => {
    const [logs, setLogs] = useState<VisitLog[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState<FilterState>(defaultFilters);
    const [loading, setLoading] = useState(false);

    const fetchLogs = async (
        pageNum = 1,
        pageSize = rowsPerPage,
        currentFilters: FilterState = filters
    ) => {
        setLoading(true);
        try {
            const params = {
                page: pageNum,
                pageSize,
                keyword: currentFilters.keyword || undefined,
                device: currentFilters.device || undefined,
                startDate: currentFilters.startDate || undefined,
                endDate: currentFilters.endDate || undefined
            };
            const res = await request.get(visitApi.logs, { params });
            const data = res.data ?? {};
            setLogs(data.list ?? []);
            const currentPage = data.page ?? data.pageNum ?? pageNum;
            const currentSize = data.pageSize ?? data.size ?? pageSize;
            setPage(Math.max(currentPage - 1, 0));
            setRowsPerPage(currentSize);
            setTotal(data.total ?? data.count ?? 0);
        } catch (error) {
            console.error("Failed to load visit logs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs(1, rowsPerPage, defaultFilters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangePage = (_: unknown, newPage: number) => {
        fetchLogs(newPage + 1, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setRowsPerPage(newSize);
        fetchLogs(1, newSize);
    };

    const handleInputChange = (field: keyof FilterState, value: string) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleSearch = () => {
        fetchLogs(1, rowsPerPage, filters);
    };

    const handleReset = () => {
        setFilters(defaultFilters);
        fetchLogs(1, rowsPerPage, defaultFilters);
    };

    const renderPathCell = (value: string, emptyText = "N/A") => (
        <Tooltip title={value || emptyText}>
            <span className={styles.ellipsis}>{value || emptyText}</span>
        </Tooltip>
    );

    const renderDeviceChip = (device: string) => {
        const deviceMap: Record<string, { label: string; color: string }> = {
            PC: { label: "电脑", color: "#4caf50" },
            Mobile: { label: "手机", color: "#1976d2" },
            Tablet: { label: "平板", color: "#ff9800" },
            Unknown: { label: "未知", color: "#9e9e9e" }
        };
        const deviceInfo = deviceMap[device] || { label: "未知", color: "#616161" };
        return (
            <Chip
                label={deviceInfo.label}
                size="small"
                sx={{ borderRadius: 1, backgroundColor: deviceInfo.color, color: "#fff" }}
            />
        );
    };

    return (
        <div className={styles.visitPage}>
            <Paper className={styles.filterCard}>
                <div className={styles.filters}>
                    <TextField
                        label="关键词"
                        placeholder="IP / 路径 / 地区"
                        value={filters.keyword}
                        onChange={(e) => handleInputChange("keyword", e.target.value)}
                        size="small"
                    />
                    <TextField
                        select
                        label="设备类型"
                        value={filters.device}
                        onChange={(e) => handleInputChange("device", e.target.value)}
                        size="small"
                    >
                        {deviceOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="开始日期"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={filters.startDate}
                        onChange={(e) => handleInputChange("startDate", e.target.value)}
                        size="small"
                    />
                    <TextField
                        label="结束日期"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={filters.endDate}
                        onChange={(e) => handleInputChange("endDate", e.target.value)}
                        size="small"
                    />
                    <div className={styles.actions}>
                        <Button variant="contained" onClick={handleSearch}>搜索</Button>
                        <Button variant="outlined" onClick={handleReset}>重置</Button>
                    </div>
                </div>
            </Paper>

            <Paper sx={{ borderRadius: 2, boxShadow: 3 }}>
                <TableContainer className={styles.tableWrapper}>
                    {loading && (
                        <div className={styles.loadingOverlay}>
                            <CircularProgress size={32} />
                        </div>
                    )}
                    <Table className={styles.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: 80 }}>序号</TableCell>
                                <TableCell sx={{ width: 170 }}>访问时间</TableCell>
                                <TableCell sx={{ width: 140 }}>IP地址</TableCell>
                                <TableCell sx={{ width: 180 }}>访问地区</TableCell>
                                <TableCell>来源页面</TableCell>
                                <TableCell>访问路径</TableCell>
                                <TableCell sx={{ width: 120 }}>设备类型</TableCell>
                                <TableCell>浏览器信息</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        {loading ? "加载中..." : "暂无数据"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log.id} hover>
                                        <TableCell>{log.id ?? '—'}</TableCell>
                                        <TableCell>
                                            {log.visitTime ? dayjs(log.visitTime).format("YYYY-MM-DD HH:mm:ss") : '—'}
                                        </TableCell>
                                        <TableCell>{log.ip || "无"}</TableCell>
                                        <TableCell>{log.location || "未知"}</TableCell>
                                        <TableCell>{renderPathCell(log.referer, "无来源")}</TableCell>
                                        <TableCell>{renderPathCell(log.path, "无路径")}</TableCell>
                                        <TableCell>{renderDeviceChip(log.device)}</TableCell>
                                        <TableCell>{renderPathCell(log.userAgent, "无浏览器信息")}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={total}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[10, 20, 50]}
                    labelRowsPerPage="每页行数"
                    labelDisplayedRows={({ from, to, count }) =>
                        `第 ${from}-${to} 条 / 共 ${count !== -1 ? count : "更多"} 条`
                    }
                />
            </Paper>
        </div>
    );
};

export default VisitLogPage;
