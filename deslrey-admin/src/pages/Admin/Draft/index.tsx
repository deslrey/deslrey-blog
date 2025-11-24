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
} from "@mui/material";

import { SquarePen, PenLine, Trash } from 'lucide-react';
import request from "../../../utils/request";
import type { Draft } from "../../../interfaces";
import { OperateType } from "../../../interfaces";
import styles from "./index.module.scss";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { Message } from "../../../utils/message";
import { draftApi } from "../../../api";

const DraftPage: React.FC = () => {
    const navigate = useNavigate();

    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    // 删除确认弹窗控制
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // 新增确认弹窗控制
    const [openConfirmAdd, setOpenConfirmAdd] = useState(false);

    // 编辑确认弹窗控制
    const [openConfirmEdit, setOpenConfirmEdit] = useState(false);
    const [selectedEditId, setSelectedEditId] = useState<number | null>(null);

    // 获取数据
    const fetchData = async (pageNum = 1, pageSize = rowsPerPage) => {
        const res = await request.get(draftApi.draftList, {
            params: { page: pageNum, pageSize }
        });
        const data = res.data;
        setDrafts(data.list);
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

    // 点击新增按钮 -> 打开确认弹窗
    const handlerAddClick = () => {
        setOpenConfirmAdd(true);
    };

    // 确认跳转新增页
    const handleConfirmAdd = () => {
        setOpenConfirmAdd(false);
        navigate('/admin/addArticle');
    };

    // 点击编辑图标 -> 打开确认弹窗
    const handlerEditClick = (id: number) => {
        setSelectedEditId(id);
        setOpenConfirmEdit(true);
    };

    // 确认跳转编辑页
    const handleConfirmEdit = () => {
        if (!selectedEditId) return;
        setOpenConfirmEdit(false);
        navigate(`/admin/editArticle?type=${OperateType.draft}&id=${selectedEditId}`);
    };

    // 点击删除图标 -> 打开确认弹窗
    const handlerDeleteClick = (id: number) => {
        setSelectedId(id);
        setOpenConfirmDelete(true);
    };

    // 确认删除
    const handleConfirmDelete = async () => {
        if (!selectedId) return;
        try {
            const res = await request.delete(`${draftApi.deleteDraft}/${selectedId}`);
            if (res && res.code === 200) {
                Message.success(res.message);
            } else {
                Message.error(res.message);
            }
        } catch (error) {
            Message.error("草稿删除失败");
        } finally {
            setOpenConfirmDelete(false);
            setSelectedId(null);
            fetchData();
        }
    };

    return (
        <div className={styles.draftBox}>
            <div className={styles.header}>
                {/* 点击新增草稿时弹出确认框 */}
                <PenLine className={styles.addIcon} onClick={handlerAddClick} />
            </div>
            <Paper sx={{ borderRadius: 2, boxShadow: 3 }}>
                <TableContainer>
                    <Table className={styles.fixedTable}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: 60 }}>ID</TableCell>
                                <TableCell sx={{ width: 240 }}>标题</TableCell>
                                <TableCell sx={{ width: 160 }}>创建时间</TableCell>
                                <TableCell sx={{ width: 160 }}>最近更新</TableCell>
                                <TableCell sx={{ width: 100 }}>操作</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {drafts.length > 0 ? (
                                drafts.map((draft) => (
                                    <TableRow key={draft.id} hover>
                                        <TableCell>{draft.id}</TableCell>
                                        <TableCell>{draft.title}</TableCell>
                                        <TableCell>
                                            {draft.createTime
                                                ? dayjs(draft.createTime).format("YYYY-MM-DD HH:mm:ss")
                                                : "—"}
                                        </TableCell>
                                        <TableCell>
                                            {draft.createTime
                                                ? dayjs(draft.updateTime).format("YYYY-MM-DD HH:mm:ss")
                                                : "—"}
                                        </TableCell>
                                        <TableCell sx={{ display: "flex", gap: "16px" }}>
                                            <SquarePen
                                                color="#000"
                                                onClick={() => handlerEditClick(draft.id)}
                                                style={{ cursor: "pointer" }}
                                            />
                                            <Trash
                                                color="#d32f2f"
                                                onClick={() => handlerDeleteClick(draft.id)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        暂无更多数据
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {drafts.length > 0 && (
                    <TablePagination
                        component="div"
                        count={total}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 15, 25]}
                        labelRowsPerPage="每页行数"
                        labelDisplayedRows={({ from, to, count }) =>
                            `第 ${from}-${to} 条 / 共 ${count !== -1 ? count : `更多`} 条`
                        }
                    />
                )}
            </Paper>

            {/* 新增确认弹窗 */}
            <Dialog open={openConfirmAdd} onClose={() => setOpenConfirmAdd(false)}>
                <DialogTitle sx={{ textAlign: 'center' }}>确认操作</DialogTitle>
                <DialogContent sx={{ textAlign: 'center', mt: 1 }}>
                    确定要跳转到新增文章页面吗？未保存的操作将会丢失。
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
                    <Button variant="outlined" onClick={() => setOpenConfirmAdd(false)}>取消</Button>
                    <Button variant="contained" color="primary" onClick={handleConfirmAdd}>确定跳转</Button>
                </DialogActions>
            </Dialog>

            {/* 编辑确认弹窗 */}
            <Dialog open={openConfirmEdit} onClose={() => setOpenConfirmEdit(false)}>
                <DialogTitle sx={{ textAlign: 'center' }}>确认操作</DialogTitle>
                <DialogContent sx={{ textAlign: 'center', mt: 1 }}>
                    确定要进入编辑草稿页面吗？未保存的更改可能会丢失。
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
                    <Button variant="outlined" onClick={() => setOpenConfirmEdit(false)}>取消</Button>
                    <Button variant="contained" color="primary" onClick={handleConfirmEdit}>确定跳转</Button>
                </DialogActions>
            </Dialog>

            {/* 删除确认弹窗 */}
            <Dialog open={openConfirmDelete} onClose={() => setOpenConfirmDelete(false)}>
                <DialogTitle sx={{ textAlign: 'center' }}>确认操作</DialogTitle>
                <DialogContent sx={{ textAlign: 'center', mt: 1 }}>
                    确定要删除该草稿吗？删除后将无法恢复。
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
                    <Button variant="outlined" onClick={() => setOpenConfirmDelete(false)}>取消</Button>
                    <Button variant="contained" color="error" onClick={handleConfirmDelete}>确定删除</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DraftPage;
