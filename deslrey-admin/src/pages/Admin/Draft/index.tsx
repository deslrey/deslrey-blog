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

import { SquarePen, PenLine, Trash } from 'lucide-react';

import request from "../../../utils/request";
import type { Draft } from "../../../interfaces";
import { OperateType } from "../../../interfaces";
import styles from "./index.module.scss";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { Message } from "../../../utils/message";

const api = {
    draftList: "/admin/draft/draftList",
    deleteDraft: "/admin/draft/deleteDraft",
};

const DraftPage: React.FC = () => {

    const navigate = useNavigate()

    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [page, setPage] = useState(0); // MUI 页码是从 0 开始的
    const [rowsPerPage, setRowsPerPage] = useState(10); // 每页条数
    const [total, setTotal] = useState(0); // 总记录数

    // 拉取后端分页数据
    const fetchData = async (pageNum = 1, pageSize = rowsPerPage) => {
        const res = await request.get(api.draftList, {
            params: {
                page: pageNum,
                pageSize: pageSize,
            },
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
        navigate('/admin/addArticle')
    }

    const handlerEdit = (id: number) => {
        navigate(`/admin/editArticle?type=${OperateType.draft}&id=${id}`)
    }

    const handlerDelete = async (id: number) => {
        try {
            const res = await request.delete(`${api.deleteDraft}/${id}`)
            if (res && res.code === 200) {
                Message.success(res.message)
            } else {
                Message.error(res.message)
            }
        } catch (error) {
            Message.error("草稿删除失败")
        } finally {
            fetchData()
        }
    }

    return (
        <div className={styles.draftBox}>
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
                                <TableCell sx={{ width: 160 }}>创建时间</TableCell>
                                <TableCell sx={{ width: 80 }}>操作</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {drafts.length > 0 ? (
                                drafts.map((draft) => (
                                    <TableRow
                                        key={draft.id}
                                        hover
                                        sx={{
                                            "&:last-child td, &:last-child th": { border: 0 },
                                        }}
                                    >
                                        <TableCell>{draft.id}</TableCell>
                                        <TableCell>{draft.title}</TableCell>
                                        <TableCell>
                                            {draft.createTime
                                                ? dayjs(draft.createTime).format("YYYY-MM-DD HH:mm")
                                                : "—"}
                                        </TableCell>
                                        <TableCell sx={{ display: "flex", gap: "20px" }}>
                                            <SquarePen
                                                color="#000"
                                                onClick={() => handlerEdit(draft.id)}
                                            />
                                            <Trash
                                                color="#000"
                                                onClick={() => handlerDelete(draft.id)}
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

                {/* 分页组件 */}
                {drafts.length > 0 && (
                    <TablePagination
                        component="div"
                        count={total} // 后端返回的总数
                        page={page}   // 当前页（0-based）
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
        </div>
    );
};

export default DraftPage;
