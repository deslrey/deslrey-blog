import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, TableSortLabel
} from "@mui/material";
import styles from './index.module.scss';
import type { Folder, Order } from '../../../interfaces';
import request from '../../../utils/request';
import dayjs from 'dayjs';
import { FolderPlus, SquarePen } from 'lucide-react';
import { Message } from '../../../utils/message';
import { folderApi } from '../../../api';

const FolderPage: React.FC = () => {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    // 排序状态
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Folder>('createTime');

    // 表单弹窗控制
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<{ id?: number; folderName: string; path: string }>({
        folderName: '',
        path: ''
    });

    // 是否编辑模式
    const [isEdit, setIsEdit] = useState(false);

    // 确认弹窗控制
    const [confirmOpen, setConfirmOpen] = useState(false);

    const fetchData = async (pageNum = 1, pageSize = rowsPerPage) => {
        const res = await request.get(folderApi.list, {
            params: { type: 'all', page: pageNum, pageSize: pageSize }
        });
        const data = res.data;
        setFolders(data.list);
        setTotal(data.total);
        setPage(data.pageNum - 1);
        setRowsPerPage(data.pageSize);
    };

    useEffect(() => { fetchData(1, rowsPerPage); }, []);

    const handleChangePage = (_: unknown, newPage: number) => {
        fetchData(newPage + 1, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setRowsPerPage(newSize);
        fetchData(1, newSize);
    };

    // 点击编辑
    const handlerEdit = (folder: Folder) => {
        setIsEdit(true);
        setForm({
            id: folder.id,
            folderName: folder.folderName,
            path: folder.path
        });
        setOpen(true);
    };

    // 打开新增弹窗
    const handlerAdd = () => {
        setIsEdit(false);
        setForm({ folderName: '', path: '' }); // 清空
        setOpen(true);
    };

    // 输入框通用处理方法
    const handleFormChange = (key: keyof typeof form, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    // 校验函数
    const validateForm = () => {
        if (!form.folderName.trim()) {
            Message.warning('请输入文件夹名称');
            return false;
        }
        if (!form.path.trim()) {
            Message.warning('请输入存储路径');
            return false;
        }
        return true;
    };

    // 打开确认弹窗（先校验）
    const handleOpenConfirm = () => {
        if (!validateForm()) return;
        setConfirmOpen(true);
    };

    // 确认提交
    const handleConfirmSubmit = async () => {
        try {
            if (isEdit && form.id) {
                // 编辑
                const res = await request.post(folderApi.updateFolder, form);
                Message.success(res.message);
            } else {
                // 新增
                const res = await request.post(folderApi.addFolder, form);
                Message.success(res.message);
            }
        } catch (err: any) {
            Message.error(err.message || "请求失败");
        } finally {
            setConfirmOpen(false);
            setOpen(false);
            fetchData(1, rowsPerPage);
        }
    };

    // 切换排序
    const handleSort = (property: keyof Folder) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // 排序函数
    const sortedFolders = [...folders].sort((a, b) => {
        const valA = dayjs(a[orderBy] as any).valueOf();
        const valB = dayjs(b[orderBy] as any).valueOf();
        return order === 'asc' ? valA - valB : valB - valA;
    });


    return (
        <div className={styles.folderBox}>
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
                                <TableCell sx={{ width: 240 }}>存储路径</TableCell>
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
                            {sortedFolders.map((folder) => (
                                <TableRow key={folder.id} hover>
                                    <TableCell sx={{ paddingLeft: 10 }}>{folder.id}</TableCell>
                                    <TableCell>{folder.folderName}</TableCell>
                                    <TableCell>{folder.path}</TableCell>
                                    <TableCell>{dayjs(folder.createTime).format("YYYY-MM-DD HH:mm")}</TableCell>
                                    <TableCell>
                                        <SquarePen color="#000" onClick={() => handlerEdit(folder)} />
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
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle sx={{ textAlign: 'center' }}>{isEdit ? "编辑文件夹" : "新增文件夹"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="文件夹名称"
                        fullWidth
                        value={form.folderName}
                        onChange={(e) => handleFormChange('folderName', e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="存储路径"
                        fullWidth
                        value={form.path}
                        onChange={(e) => handleFormChange('path', e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
                    <Button variant="outlined" onClick={() => setOpen(false)}>取消</Button>
                    <Button variant="contained" onClick={handleOpenConfirm}>保存</Button>
                </DialogActions>
            </Dialog>

            {/* 确认弹窗 */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle sx={{ textAlign: 'center' }}>确认操作</DialogTitle>
                <DialogContent sx={{ textAlign: 'center', mt: 1 }}>
                    {isEdit ? '是否确定要保存修改？' : '是否确定要新增文件夹？'}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
                    <Button variant="outlined" onClick={() => setConfirmOpen(false)}>取消</Button>
                    <Button variant="contained" onClick={handleConfirmSubmit}>确定</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default FolderPage;
