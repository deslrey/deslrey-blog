import React, { useEffect, useState } from 'react'
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, TableSortLabel
} from "@mui/material";

import styles from './index.module.scss'
import type { Order, Tag } from '../../../interfaces';
import dayjs from 'dayjs';
import request from '../../../utils/request';
import { Message } from '../../../utils/message';
import { FolderPlus, SquarePen } from 'lucide-react';
import { tagApi } from '../../../api/adminApi';

const TagPage: React.FC = () => {

    const [tags, setTags] = useState<Tag[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    // 排序状态
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Tag>('createTime');

    // 表单弹窗控制
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<{ id?: number; tagTitle: string }>({
        tagTitle: '',
    });

    // 是否编辑模式
    const [isEdit, setIsEdit] = useState(false);

    // 确认弹窗控制
    const [confirmOpen, setConfirmOpen] = useState(false);

    // 获取标签列表
    const fetchData = async (pageNum = 1, pageSize = rowsPerPage) => {
        const res = await request.get(tagApi.tagList, {
            params: { page: pageNum, pageSize }
        });
        const data = res.data;
        setTags(data.list);
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

    // 打开编辑弹窗
    const handlerEdit = (tag: Tag) => {
        setIsEdit(true);
        setForm({
            id: tag.id,
            tagTitle: tag.tagTitle,
        });
        setOpen(true);
    };

    // 打开新增弹窗
    const handlerAdd = () => {
        setIsEdit(false);
        setForm({ tagTitle: '' });
        setOpen(true);
    };

    // 输入变化
    const handleFormChange = (key: keyof typeof form, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    // 排序
    const handleSort = (property: keyof Tag) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedTags = [...tags].sort((a, b) => {
        const valA = dayjs(a[orderBy] as any).valueOf();
        const valB = dayjs(b[orderBy] as any).valueOf();
        return order === 'asc' ? valA - valB : valB - valA;
    });

    // 点击保存，先校验，再弹出确认弹窗
    const handleSubmit = () => {
        if (!form.tagTitle.trim()) {
            Message.warning('请输入标签名称');
            return;
        }
        setConfirmOpen(true);
    };

    // 确认提交
    const handleConfirmSubmit = async () => {
        try {
            if (isEdit && form.id) {
                const res = await request.post(tagApi.updateTagTitle, form);
                Message.success(res.message);
            } else {
                const res = await request.post(tagApi.addTag, form);
                Message.success(res.message);
            }
            setOpen(false);
            fetchData(1, rowsPerPage);
        } catch (err: any) {
            Message.error(err.message || "请求失败");
        } finally {
            setConfirmOpen(false);
        }
    };

    return (
        <div className={styles.tagBox}>
            {/* 顶部新增按钮 */}
            <div className={styles.header}>
                <FolderPlus className={styles.addIcon} onClick={handlerAdd} />
            </div>

            <Paper sx={{ borderRadius: 2, boxShadow: 3 }}>
                <TableContainer>
                    <Table className={styles.fixedTable}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: 80, paddingLeft: 10 }}>ID</TableCell>
                                <TableCell sx={{ width: 150 }}>名称</TableCell>
                                <TableCell sx={{ width: 200 }} sortDirection={orderBy === 'createTime' ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === 'createTime'}
                                        direction={orderBy === 'createTime' ? order : 'asc'}
                                        onClick={() => handleSort('createTime')}
                                    >
                                        创建时间
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ width: 80 }}>操作</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedTags.map((tag) => (
                                <TableRow key={tag.id} hover>
                                    <TableCell sx={{ paddingLeft: 10 }}>{tag.id}</TableCell>
                                    <TableCell>{tag.tagTitle}</TableCell>
                                    <TableCell>{dayjs(tag.createTime).format("YYYY-MM-DD HH:mm")}</TableCell>
                                    <TableCell>
                                        <SquarePen
                                            color="#000"
                                            className={styles.editIcon}
                                            onClick={() => handlerEdit(tag)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
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
                    rowsPerPageOptions={[10, 15, 25]}
                    labelRowsPerPage="每页行数"
                    labelDisplayedRows={({ from, to, count }) =>
                        `第 ${from}-${to} 条 / 共 ${count !== -1 ? count : `更多`} 条`
                    }
                />
            </Paper>

            {/* 新增 / 编辑弹窗 */}
            <Dialog open={open} maxWidth="sm" fullWidth onClose={() => setOpen(false)}>
                <DialogTitle>{isEdit ? "编辑标签" : "新增标签"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="标签名称"
                        fullWidth
                        value={form.tagTitle}
                        onChange={(e) => handleFormChange('tagTitle', e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>取消</Button>
                    <Button variant="contained" onClick={handleSubmit}>保存</Button>
                </DialogActions>
            </Dialog>

            {/* 确认弹窗 */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle sx={{ textAlign: 'center' }}>确认操作</DialogTitle>
                <DialogContent sx={{ textAlign: 'center', mt: 1 }}>
                    {isEdit ? '是否确认修改该标签？' : '是否确认新增该标签？'}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
                    <Button variant="outlined" onClick={() => setConfirmOpen(false)}>取消</Button>
                    <Button variant="contained" onClick={handleConfirmSubmit}>确定</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TagPage;