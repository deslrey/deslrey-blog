import React, { useEffect, useState } from 'react'
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, TableSortLabel
} from "@mui/material";

import styles from './index.module.scss'
import type { Category, Order } from '../../../interfaces';
import dayjs from 'dayjs';
import request from '../../../utils/request';
import { Message } from '../../../utils/message';
import { FolderPlus, SquarePen } from 'lucide-react';
import { categoryApi } from '../../../api';

const CategoryPage: React.FC = () => {
    const [categorys, setCategorys] = useState<Category[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    // 排序状态
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Category>('createTime');

    // 表单弹窗控制
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<{ id?: number; categoryTitle: string }>({
        categoryTitle: '',
    });
    const [isEdit, setIsEdit] = useState(false);

    // 确认弹窗控制
    const [confirmOpen, setConfirmOpen] = useState(false);

    const fetchData = async (pageNum = 1, pageSize = rowsPerPage) => {
        const res = await request.get(categoryApi.categoryList, {
            params: { page: pageNum, pageSize }
        });
        const data = res.data;
        setCategorys(data.list);
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

    const handlerEdit = (category: Category) => {
        setIsEdit(true);
        setForm({ id: category.id, categoryTitle: category.categoryTitle });
        setOpen(true);
    };

    const handlerAdd = () => {
        setIsEdit(false);
        setForm({ categoryTitle: '' });
        setOpen(true);
    };

    const handleFormChange = (key: keyof typeof form, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSort = (property: keyof Category) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedCategorys = [...categorys].sort((a, b) => {
        const valA = dayjs(a[orderBy] as any).valueOf();
        const valB = dayjs(b[orderBy] as any).valueOf();
        return order === 'asc' ? valA - valB : valB - valA;
    });

    // 打开确认弹窗
    const handleSubmit = () => {
        if (!form.categoryTitle.trim()) {
            Message.warning('请输入分类名称');
            return;
        }
        setConfirmOpen(true);
    };

    // 确认提交
    const handleConfirmSubmit = async () => {
        try {
            if (isEdit && form.id) {
                const res = await request.post(categoryApi.updateCategoryTitle, form);
                Message.success(res.message);
            } else {
                const res = await request.post(categoryApi.addCategory, form);
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
        <div className={styles.categoryBox}>
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
                            {sortedCategorys.map((category) => (
                                <TableRow key={category.id} hover>
                                    <TableCell sx={{ paddingLeft: 10 }}>{category.id}</TableCell>
                                    <TableCell>{category.categoryTitle}</TableCell>
                                    <TableCell>{dayjs(category.createTime).format("YYYY-MM-DD HH:mm")}</TableCell>
                                    <TableCell>
                                        <SquarePen
                                            color="#000"
                                            className={styles.editIcon}
                                            onClick={() => handlerEdit(category)}
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

            {/* 表单弹窗 */}
            <Dialog open={open} maxWidth="sm" fullWidth onClose={() => setOpen(false)}>
                <DialogTitle>{isEdit ? "编辑分类" : "新增分类"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="分类名称"
                        fullWidth
                        value={form.categoryTitle}
                        onChange={(e) => handleFormChange('categoryTitle', e.target.value)}
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
                    {isEdit ? '是否确认修改该分类？' : '是否确认新增该分类？'}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
                    <Button variant="outlined" onClick={() => setConfirmOpen(false)}>取消</Button>
                    <Button variant="contained" onClick={handleConfirmSubmit}>确定</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CategoryPage;
