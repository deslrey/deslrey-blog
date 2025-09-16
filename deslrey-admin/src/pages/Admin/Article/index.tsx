import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Button
} from "@mui/material";
import request from "../../../utils/request";
import type { ArticleTpye } from "../../../interfaces/Article";
import styles from "./index.module.scss";
import dayjs from "dayjs";

const api = {
    list: "/admin/article/list",
};

const Article: React.FC = () => {
    const [articles, setArticles] = useState<ArticleTpye[]>([]);
    const [page, setPage] = useState(0); // MUI 页码是从 0 开始的
    const [rowsPerPage, setRowsPerPage] = useState(5); // 每页条数
    const [total, setTotal] = useState(0); // 总记录数

    // 拉取后端分页数据
    const fetchData = async (pageNum = 1, pageSize = rowsPerPage) => {
        const res = await request.get(api.list, {
            params: {
                page: pageNum,
                pageSize: pageSize,
            },
        });

        const data = res.data;
        setArticles(data.list);
        setTotal(data.total);

        // 同步 MUI 页码（MUI 从 0 开始，后端从 1 开始）
        setPage(data.pageNum - 1);
        setRowsPerPage(data.pageSize);
    };

    useEffect(() => {
        fetchData(1, rowsPerPage);
    }, []);

    // 处理页码切换
    const handleChangePage = (_: unknown, newPage: number) => {
        fetchData(newPage + 1, rowsPerPage); // 后端是从 1 开始的
    };

    // 处理每页条数切换
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setRowsPerPage(newSize);
        fetchData(1, newSize); // 重置到第一页
    };

    return (
        <div className={styles.articleBox}>
            <Paper sx={{ borderRadius: 2, boxShadow: 3 }}>
                <TableContainer>
                    <Table className={styles.fixedTable}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: 60 }}>ID</TableCell>
                                <TableCell sx={{ width: 240 }}>标题</TableCell>
                                <TableCell sx={{ width: 120 }}>分类</TableCell>
                                <TableCell sx={{ width: 160 }}>创建时间</TableCell>
                                <TableCell sx={{ width: 160 }}>修改时间</TableCell>
                                <TableCell sx={{ width: 100 }}>浏览量</TableCell>
                                <TableCell sx={{ width: 80 }}>置顶</TableCell>
                                <TableCell sx={{ width: 80 }}>已编辑</TableCell>
                                <TableCell sx={{ width: 80 }}>可见</TableCell>
                                <TableCell sx={{ width: 80 }}>操作</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {articles.map((article) => (
                                <TableRow
                                    key={article.id}
                                    hover
                                    sx={{
                                        "&:last-child td, &:last-child th": { border: 0 },
                                    }}
                                >
                                    <TableCell>{article.id}</TableCell>
                                    <TableCell>{article.title}</TableCell>
                                    <TableCell>{article.category}</TableCell>
                                    <TableCell>
                                        {dayjs(article.createTime).format("YYYY-MM-DD HH:mm")}
                                    </TableCell>
                                    <TableCell>
                                        {article.updateTime
                                            ? dayjs(article.updateTime).format("YYYY-MM-DD HH:mm")
                                            : "—"}
                                    </TableCell>
                                    <TableCell>{article.views}</TableCell>
                                    <TableCell>{article.sticky ? "✅" : "❌"}</TableCell>
                                    <TableCell>{article.edit ? "✅" : "❌"}</TableCell>
                                    <TableCell>{article.exist ? "✅" : "❌"}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="success" size="small">
                                            编辑
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {/* 空行填充，保持高度 */}
                            {articles.length < rowsPerPage && (
                                <TableRow className={styles.emptyRow}>
                                    <TableCell colSpan={9} />
                                </TableRow>
                            )}
                        </TableBody>

                    </Table>
                </TableContainer>

                {/* 分页组件 */}
                <TablePagination
                    component="div"
                    count={total} // 后端返回的总数
                    page={page}   // 当前页（0-based）
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[2, 5, 10, 25]}
                    labelRowsPerPage="每页行数"
                    labelDisplayedRows={({ from, to, count }) =>
                        `第 ${from}-${to} 条 / 共 ${count !== -1 ? count : `更多`} 条`
                    }
                />

            </Paper>
        </div>
    );
};

export default Article;
