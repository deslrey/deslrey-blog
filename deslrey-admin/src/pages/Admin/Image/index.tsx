import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TableSortLabel, Autocomplete, TextField
} from "@mui/material";
import styles from './index.module.scss';
import { type Folder, type Image, type Order } from '../../../interfaces';
import request from '../../../utils/request';
import dayjs from 'dayjs';
import { Copy, Eye, ImageUp, ScanSearch } from 'lucide-react';
import { Message } from '../../../utils/message';
import { formatFileSize } from '../../../utils/format';
import { imageApi } from '../../../api';


const ImageTable: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [images, setImages] = useState<Image[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Image>('createTime');

    const [openDialog, setOpenDialog] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [folderId, setFolderId] = useState<number | null>(null);
    const [folders, setFolders] = useState<Folder[]>([]);

    const [openPreview, setOpenPreview] = useState(false);

    const [searchFolderName, setSearchFolderName] = useState<string>('')

    // 点击 Eye 打开预览
    const handlePreview = (url: string) => {
        setPreviewUrl(url);
        setOpenPreview(true);
    };

    // 拉取文件夹列表并去重
    const fetchFolders = async () => {
        const res = await request.get<Folder[]>(imageApi.folderNameList);
        const uniqueFolders = Array.from(
            new Map(res.data.map((f: Folder) => [f.id, f])).values()
        );
        setFolders(uniqueFolders);
    };

    const fetchData = async (pageNum = 1, pageSize = rowsPerPage) => {
        const res = await request.get(imageApi.list, {
            params: {
                page: pageNum,
                pageSize: pageSize
            }
        });
        const data = res.data;

        setImages(data.list);
        setTotal(data.total);
        setPage(data.pageNum - 1);
        setRowsPerPage(data.pageSize);
    };

    useEffect(() => {
        fetchData(1, rowsPerPage);
        fetchFolders();
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setOpenDialog(true);
        }
    };

    const handleUpload = async () => {
        if (!file || !folderId) {
            Message.error("请选择文件夹");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folderId", String(folderId));

        try {
            const res = await request.post(imageApi.uploadImage, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.code === 200) {
                Message.success(res.message);
            } else {
                Message.error(res.message)
            }
            setOpenDialog(false);
            fetchData(page + 1, rowsPerPage);
        } catch (error) {
            Message.error("上传失败");
        }
    };

    const obscureFolderName = async () => {
        if (!searchFolderName) {
            return
        }

        try {
            const res = await request.get(imageApi.obscureFolderName, {
                params: {
                    folderName: searchFolderName
                }
            })
            if (res && res.code === 200) {
                setImages(res.data)
                Message.success('查找成功')
                return
            }
        } catch (error) {

        }
    }

    // 分页
    const handleChangePage = (_: unknown, newPage: number) => {
        fetchData(newPage + 1, rowsPerPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setRowsPerPage(newSize);
        fetchData(1, newSize);
    };

    // 排序
    const handleSort = (property: keyof Image) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedImages = [...images].sort((a, b) => {
        const valA = dayjs(a[orderBy] as any).valueOf();
        const valB = dayjs(b[orderBy] as any).valueOf();
        return order === 'asc' ? valA - valB : valB - valA;
    });

    // 复制图片链接
    const handleCopyLink = () => {
        if (previewUrl) {
            navigator.clipboard.writeText(previewUrl)
                .then(() => Message.success("复制成功"))
                .catch(() => Message.error("复制失败"));
        }
    };

    return (
        <div className={styles.imageBox}>
            <div className={styles.header}>
                <div className={styles.uploadBox}>
                    <input
                        accept="image/*"
                        id="upload-file"
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                    <label htmlFor="upload-file">
                        <Button variant="outlined" component="span">
                            <ImageUp color='#000' />
                        </Button>
                    </label>
                </div>

                <div className={styles.searchFolderName}>
                    <Autocomplete
                        freeSolo
                        disablePortal
                        options={folders.map(f => f.folderName)}
                        value={searchFolderName}
                        onInputChange={(_, newValue) => setSearchFolderName(newValue)}
                        sx={{ width: 280 }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="文件夹名称"
                                variant="outlined"
                                size="small"
                                placeholder="输入或选择文件夹名"
                            />
                        )}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={obscureFolderName}
                        sx={{ ml: 2, height: 40 }}
                        startIcon={<ScanSearch size={18} />}
                    >
                        查询
                    </Button>
                </div>

            </div>

            <Paper sx={{ borderRadius: 2, boxShadow: 3 }}>
                <TableContainer>
                    <Table className={styles.fixedTable}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: 80, paddingLeft: 10 }}>ID</TableCell>
                                <TableCell sx={{ width: 80 }}>名称</TableCell>
                                <TableCell sx={{ width: 80 }}>归属</TableCell>
                                <TableCell sx={{ width: 80 }}>大小</TableCell>
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
                            {sortedImages.map((image, index) => (
                                <TableRow key={`${image.id}-${index}`} hover>
                                    <TableCell sx={{ paddingLeft: 10 }}>{image.id}</TableCell>
                                    <TableCell>{image.imageName}</TableCell>
                                    <TableCell>{image.folderName}</TableCell>
                                    <TableCell>{formatFileSize(image.size)}</TableCell>
                                    <TableCell>{image.path}</TableCell>
                                    <TableCell>{dayjs(image.createTime).format("YYYY-MM-DD HH:mm")}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handlePreview(image.url)}>
                                            <Eye color="#000" />
                                        </Button>
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

            {/* 上传弹窗 */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth disableRestoreFocus>
                <DialogTitle>上传图片</DialogTitle>
                <DialogContent>
                    {previewUrl && (
                        <div className={styles.previewWrapper}>
                            <img src={previewUrl} alt="预览" className={styles.previewImage} />
                        </div>
                    )}

                    <Autocomplete
                        options={folders}
                        getOptionLabel={(option) => option.folderName}
                        value={folders.find(f => f.id === folderId) || null}
                        onChange={(_, newValue) => setFolderId(newValue ? newValue.id : null)}
                        renderOption={(props, option, { index }) => (
                            <li {...props} key={`${option.id}-${index}`}>{option.folderName}</li>
                        )}
                        renderInput={(params) => (
                            <TextField {...params} label="选择文件夹" variant="outlined" fullWidth />
                        )}
                        clearOnEscape
                        disableClearable={false}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>取消</Button>
                    <Button onClick={handleUpload} variant="contained">上传</Button>
                </DialogActions>
            </Dialog>

            {/* 图片预览弹窗 */}
            <Dialog
                open={openPreview}
                onClose={() => setOpenPreview(false)}
                maxWidth="md"
                fullWidth
                disableRestoreFocus
            >
                <DialogTitle>图片预览</DialogTitle>
                <DialogContent>
                    {previewUrl && (
                        <div className={styles.previewWrapper}>
                            <img src={previewUrl} alt="预览" className={styles.previewImage} />
                            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div className={styles.urlBox}>
                                    <TextField
                                        value={previewUrl}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        InputProps={{
                                            readOnly: true,
                                            style: {
                                                textOverflow: "clip",   // 取消省略号
                                                whiteSpace: "nowrap",   // 单行显示
                                                overflow: "visible",    // 允许内容完整展示
                                            }
                                        }}
                                    />

                                    <Copy color='#000' size={24} onClick={handleCopyLink} /></div>
                            </div>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPreview(false)}>关闭</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ImageTable;
