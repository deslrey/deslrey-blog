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

} from "@mui/material";

import { SquarePen, PenLine } from 'lucide-react';

import request from "../../../utils/request";
import type { ArticleTpye } from "../../../interfaces";
import { OperateType } from "../../../interfaces";
import styles from "./index.module.scss";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const api = {
    list: "/admin/article/list",
};

const Article: React.FC = () => {

    const navigate = useNavigate()

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

        setPage(data.pageNum - 1);
        setRowsPerPage(data.pageSize);
    };

    useEffect(() => {
        fetchData(1, rowsPerPage);
    }, []);

    // 处理页码切换
    const handleChangePage = (_: unknown, newPage: number) => {
        fetchData(newPage + 1, rowsPerPage);
    };

    // 处理每页条数切换
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setRowsPerPage(newSize);
        fetchData(1, newSize); // 重置到第一页
    };

    const handlerAdd = () => {
        navigate(`/admin/addArticle?${OperateType.add}`)
    }

    const handlerEdit = (id: number) => {
        navigate(`/admin/addArticle?${OperateType.edit}}&id=${id}`)
    }

    return (
        <div className={styles.articleBox}>
            <div className={styles.header}>
                <PenLine className={styles.addIcon} onClick={handlerAdd} />
            </div>
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
                                        <SquarePen color="#000" onClick={() => handlerEdit(article.id)} />
                                    </TableCell>
                                </TableRow>
                            ))}

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
                    rowsPerPageOptions={[5, 10, 25]}
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
