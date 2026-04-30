import React, { useState } from "react";
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
import request from "../../../utils/http";
import type { ArticleTpye } from "../../../types";
import { OperateType } from "../../../types";
import styles from "./index.module.scss";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { articleApi } from "../../../api";
import { Message } from "../../../utils/message";
import { usePagedQuery } from "../../../hooks/usePagedQuery";

const Article: React.FC = () => {
    const navigate = useNavigate();

    const {
        list: articles,
        page,
        rowsPerPage,
        total,
        fetchPage,
        onPageChange,
        onRowsPerPageChange,
    } = usePagedQuery<ArticleTpye>({
        apiPath: articleApi.list,
        initialRowsPerPage: 5,
    });

    // 弹窗控制
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<"add" | "edit" | null>(null);
    const [editId, setEditId] = useState<number | null>(null);

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
        setOpenDialog(false);
        setTimeout(() => {
            if (dialogType === "add") {
                navigate("/admin/addArticle");
            } else if (dialogType === "edit" && editId !== null) {
                navigate(`/admin/editArticle?type=${OperateType.article}&id=${editId}`);
            }
        }, 100);
    };

    // 切换文章可见状态
    const toggleVisible = async (id: number, current: boolean) => {
        try {
            const res = await request.post(articleApi.editExist, {
                id,
                exist: !current
            });

            Message.success(res.message)

            fetchPage(page + 1, rowsPerPage);

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
                                <TableCell sx={{ width: 80 }}>浏览量</TableCell>
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
                                    <TableCell>{article.id ?? '—'}</TableCell>
                                    <TableCell>{article.title || '无标题'}</TableCell>
                                    <TableCell>{article.category || '未分类'}</TableCell>
                                    <TableCell>{article.createTime ? dayjs(article.createTime).format("YYYY-MM-DD HH:mm") : '—'}</TableCell>
                                    <TableCell>
                                        {article.updateTime
                                            ? dayjs(article.updateTime).format("YYYY-MM-DD HH:mm")
                                            : "—"}
                                    </TableCell>
                                    <TableCell>{typeof article.views === 'number' ? article.views : 0}</TableCell>
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
                    onPageChange={onPageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={onRowsPerPageChange}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="每页行数"
                    labelDisplayedRows={({ from, to, count }) =>
                        `第 ${from}-${to} 条 / 共 ${count !== -1 ? count : `更多`} 条`
                    }
                />
            </Paper>

            {/* 确认弹窗 */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} disablePortal>
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
