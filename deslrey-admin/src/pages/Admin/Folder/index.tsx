import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button
} from "@mui/material";
import styles from './index.module.scss';
import type { Folder } from '../../../interfaces/Folder';
import request from '../../../utils/request';
import dayjs from 'dayjs';
import { FolderPlus, SquarePen } from 'lucide-react';

const api = {
    list: '/folder/list',
    addFolder: '/folder/addFolder',
}

const FolderPage: React.FC = () => {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    // 弹窗控制
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ folderName: '', path: '' });


    const fetchData = async (pageNum = 1, pageSize = rowsPerPage) => {
        const res = await request.get(api.list, {
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

    const handlerEdit = (id: number) => {
        console.log("编辑", id);
    };

    // 打开添加弹窗
    const handlerAdd = () => {
        setForm({ folderName: '', path: '' }); // 清空
        setOpen(true);
    };


    // 输入框通用处理方法
    const handleFormChange = (key: keyof typeof form, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };


    // 提交新增
    const handleSubmit = async () => {
        const res = await request.post(api.addFolder, form);
        console.log("添加结果", res);
        setOpen(false);
        fetchData(1, rowsPerPage); // 刷新列表
    };


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
                                <TableCell sx={{ width: 60 }}>ID</TableCell>
                                <TableCell sx={{ width: 100 }}>名称</TableCell>
                                <TableCell sx={{ width: 240 }}>存储路径</TableCell>
                                <TableCell sx={{ width: 160 }}>创建时间</TableCell>
                                <TableCell sx={{ width: 80 }}>操作</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {folders.map((folder) => (
                                <TableRow key={folder.id} hover>
                                    <TableCell>{folder.id}</TableCell>
                                    <TableCell>{folder.folderName}</TableCell>
                                    <TableCell>{folder.path}</TableCell>
                                    <TableCell>
                                        {dayjs(folder.createTime).format("YYYY-MM-DD HH:mm")}
                                    </TableCell>
                                    <TableCell>
                                        <SquarePen color="#000" onClick={() => handlerEdit(folder.id)} />
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
                <DialogTitle>新增文件夹</DialogTitle>
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
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>取消</Button>
                    <Button variant="contained" onClick={handleSubmit}>保存</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default FolderPage;
