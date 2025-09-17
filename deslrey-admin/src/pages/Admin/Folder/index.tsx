import React, { useEffect, useState } from 'react'

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

import styles from './index.module.scss'
import type { Folder } from '../../../interfaces/Folder'
import request from '../../../utils/request'
import dayjs from 'dayjs';
import { FolderPlus, SquarePen } from 'lucide-react';


const api = {
    list: '/folder/list'
}

const FolderPage: React.FC = () => {

    const [folders, setFolders] = useState<Folder[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [total, setTotal] = useState(0)

    const fetchData = async (pageNum = 1, pageSize = rowsPerPage) => {
        const res = await request.get(api.list, {
            params: {
                type: 'all',
                page: pageNum,
                pageSize: pageSize
            }
        })

        const data = res.data

        console.log(data)

        setFolders(data.list)
        setTotal(data.total)
        setPage(data.pageNum - 1)
        setRowsPerPage(data.pageSize)
    }

    useEffect(() => {
        fetchData(1, rowsPerPage)
    }, [])

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

    const handlerEdit = (id: number) => {

    }
    const handlerAdd = () => {

    }

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
                                <TableRow
                                    key={folder.id}
                                    hover
                                    sx={{
                                        "&:last-child td, &:last-child th": { border: 0 },
                                    }}
                                >
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
}

export default FolderPage