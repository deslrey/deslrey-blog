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


const api = {
    categoryList: '/category/categoryList',
    updateCategoryTitle: '/category/updateCategoryTitle',
    addCategory: '/category/addCategory',
}

const CategoryPage: React.FC = () => {

    const [categorys, setCategorys] = useState<Category[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);



    // 排序状态
    const [order, setOrder] = useState<Order>('desc');
    const [orderBy, setOrderBy] = useState<keyof Category>('createTime');

    // 弹窗控制
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<{ id?: number; categoryTitle: string; }>({
        categoryTitle: '',
    });

    // 是否编辑模式
    const [isEdit, setIsEdit] = useState(false);

    const fetchData = async (pageNum = 1, pageSize = rowsPerPage) => {
        const res = await request.get(api.categoryList, {
            params: {
                page: pageNum, pageSize: pageSize
            }
        })

        const data = res.data
        setCategorys(data.list)
        setTotal(data.total);
        setPage(data.pageNum - 1);
        setRowsPerPage(data.pageSize);
    }


    useEffect(() => {
        fetchData(1, rowsPerPage)
    }, [])


    const handleChangePage = (_: unknown, newPage: number) => {
        fetchData(newPage + 1, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setRowsPerPage(newSize);
        fetchData(1, newSize);
    };

    // 点击编辑
    const handlerEdit = (category: Category) => {
        setIsEdit(true);
        setForm({
            id: category.id,
            categoryTitle: category.categoryTitle,
        });
        setOpen(true);
    };

    // 打开新增弹窗
    const handlerAdd = () => {
        setIsEdit(false);
        setForm({ categoryTitle: '' }); // 清空
        setOpen(true);
    };

    // 输入框通用处理方法
    const handleFormChange = (key: keyof typeof form, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    // 切换排序
    const handleSort = (property: keyof Category) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // 排序函数
    const sortedCategorys = [...categorys].sort((a, b) => {
        const valA = dayjs(a[orderBy] as any).valueOf();
        const valB = dayjs(b[orderBy] as any).valueOf();
        return order === 'asc' ? valA - valB : valB - valA;
    });


    // 提交（新增或编辑）
    const handleSubmit = async () => {
        try {
            if (isEdit && form.id) {
                // 编辑
                const res = await request.post(api.updateCategoryTitle, form);
                Message.success(res.message);
            } else {
                // 新增
                const res = await request.post(api.addCategory, form);
                Message.success(res.message);
            }
        } catch (err: any) {
            Message.error(err.message || "请求失败");
        } finally {
            setOpen(false);
            fetchData(1, rowsPerPage);
        }
    };

    return (
        <div className={styles.categoryBox}>
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
                                        <SquarePen color="#000" onClick={() => handlerEdit(category)} />
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
            <Dialog open={open} maxWidth="sm" fullWidth onClose={() => setOpen(false)} >
                <DialogTitle>{isEdit ? "编辑分类" : "新增分类"}</DialogTitle>
                <DialogContent >
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
        </div>
    );
}

export default CategoryPage