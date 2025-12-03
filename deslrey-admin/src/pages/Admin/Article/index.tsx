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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Switch
} from "@mui/material";

import { SquarePen, PenLine } from 'lucide-react';
import request from "../../../utils/request";
import type { ArticleTpye } from "../../../interfaces";
import { OperateType } from "../../../interfaces";
import styles from "./index.module.scss";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { articleApi } from "../../../api";
import { Message } from "../../../utils/message";

const Article: React.FC = () => {
    const navigate = useNavigate();

    const [articles, setArticles] = useState<ArticleTpye[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [total, setTotal] = useState(0);

    // 弹窗控制
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<"add" | "edit" | null>(null);
    const [editId, setEditId] = useState<number | null>(null);

    // 拉取数据
    const fetchData = async (pageNum = 1, pageSize = rowsPerPage) => {
        const res = await request.get(articleApi.list, {
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

    const handleChangePage = (_: unknown, newPage: number) => {
        fetchData(newPage + 1, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setRowsPerPage(newSize);
        fetchData(1, newSize);
    };

    const handlerAdd = () => {
        setDialogType("add");
        setOpenDialog(true);
    };

    const handlerEdit = (id: number) => {
        setEditId(id);
        setDialogType("edit");
        setOpenDialog(true);
    };

    // 确认弹窗点击
    const handleConfirm = () => {
        if (dialogType === "add") {
            navigate("/admin/addArticle");
        } else if (dialogType === "edit" && editId !== null) {
            navigate(`/admin/editArticle?type=${OperateType.article}&id=${editId}`);
        }
        setOpenDialog(false);
    };

    // 切换文章可见状态
    const toggleVisible = async (id: number, current: boolean) => {
        try {
            const res = await request.post(articleApi.editExist, {
                id,
                exist: !current
            });

            Message.success(res.message)

            fetchData(page + 1, rowsPerPage);

        } catch (error) {
            console.error("更新可见状态失败", error);
        }
    };


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
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                >
                                    <TableCell>{article.id}</TableCell>
                                    <TableCell>{article.title}</TableCell>
                                    <TableCell>{article.category}</TableCell>
                                    <TableCell>{dayjs(article.createTime).format("YYYY-MM-DD HH:mm")}</TableCell>
                                    <TableCell>
                                        {article.updateTime
                                            ? dayjs(article.updateTime).format("YYYY-MM-DD HH:mm")
                                            : "—"}
                                    </TableCell>
                                    <TableCell>{article.views}</TableCell>
                                    <TableCell>{article.sticky ? "✅" : "❌"}</TableCell>
                                    <TableCell>{article.edit ? "✅" : "❌"}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={article.exist}
                                            onChange={() => toggleVisible(article.id, article.exist)}
                                            color="primary"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <SquarePen color="#000" onClick={() => handlerEdit(article.id)} />
                                    </TableCell>
                                </TableRow>
                            ))}

                            {articles.length < rowsPerPage && (
                                <TableRow className={styles.emptyRow}>
                                    <TableCell colSpan={10} />
                                </TableRow>
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
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="每页行数"
                    labelDisplayedRows={({ from, to, count }) =>
                        `第 ${from}-${to} 条 / 共 ${count !== -1 ? count : `更多`} 条`
                    }
                />
            </Paper>

            {/* 确认弹窗 */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>确认操作</DialogTitle>
                <DialogContent sx={{ textAlign: "center", fontSize: 16, mt: 1 }}>
                    {dialogType === "add"
                        ? "是否确定要新增文章？"
                        : "是否确定要编辑该文章？"}
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
                    <Button variant="outlined" onClick={() => setOpenDialog(false)}>取消</Button>
                    <Button variant="contained" onClick={handleConfirm}>确定</Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default Article;
