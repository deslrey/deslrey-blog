import React, { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import {
    Button,
    TextField,
    Autocomplete,
    Chip,
    Popper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    FormHelperText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import styles from './index.module.scss';
import { OperateType, type ArticleDraft, type Category, type Draft, type Folder, type Tag } from '../../../interfaces';
import request from '../../../utils/request';
import { Message } from '../../../utils/message';
import { useSearchParams } from 'react-router-dom';
import { editArticleApi, folderApi, imageApi } from '../../../api';

const CustomPopper = styled(Popper)({
    '& .MuiAutocomplete-listbox': {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        maxHeight: 'none',
    },
    '& .MuiAutocomplete-option': {
        padding: 0,            // 去掉多余的 padding
        backgroundColor: 'transparent !important', // hover 背景透明
        '&:hover': {
            backgroundColor: 'transparent !important', // 禁用 hover 背景
        },
    },
});

const EditArticle: React.FC = () => {

    //  路由接收参数
    const [searchParams] = useSearchParams()

    const operateType = searchParams.get('type')
    const operateId = searchParams.get('id')

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<Category | null>(null);
    const [folder, setFolder] = useState<Folder | null>(null)
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');

    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const [folders, setFolders] = useState<Folder[]>([])

    //  弹窗状态（统一为一个确认弹窗）
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'save' | 'draft' | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const editorRef = React.useRef<HTMLDivElement>(null);

    //  校验函数
    const validateForm = (type: 'save' | 'draft') => {
        if (type === 'save') {
            if (!title.trim()) return Message.warning('请输入文章标题'), false;
            if (!category) return Message.warning('请选择文章分类'), false;
            if (selectedTagIds.length === 0) return Message.warning('请选择至少一个标签'), false;
            if (!description.trim()) return Message.warning('请输入文章描述'), false;
            if (!content.trim()) return Message.warning('请输入文章内容'), false;
            return true;
        } else {
            if (!title.trim() && !content.trim()) {
                Message.warning('请至少填写标题或内容');
                return false;
            }
            return true;
        }
    };

    const openConfirmDialog = (type: 'save' | 'draft') => {
        if (!validateForm(type)) return;
        setDialogType(type);
        setOpenDialog(true);
    };

    const handleConfirm = async () => {
        if (dialogType === 'save') {
            const payload = {
                id: '',
                title,
                content,
                categoryId: category?.id || null,
                tagIdList: selectedTagIds,
                des: description,
            };
            if (operateType === OperateType.article && operateId) payload.id = operateId;

            setSaving(true);
            try {
                const res = await request.post(editArticleApi.addArticle, payload);
                if (res && res.code === 200) {
                    Message.success(res.message);
                    setOpenDialog(false);
                } else {
                    Message.error(res.message || '保存失败');
                }
            } catch {
                Message.error('保存失败');
            } finally {
                setSaving(false);
            }
        } else if (dialogType === 'draft') {
            const payload = { id: '', title, content, des: description };
            if (operateId) payload.id = operateId;

            setSaving(true);
            try {
                const api = operateId ? editArticleApi.updateDraft : editArticleApi.addDraft;
                const res = await request.post(api, payload);
                if (res && res.code === 200) {
                    Message.success(res.message);
                    setOpenDialog(false);
                } else {
                    Message.error(res.message || '草稿保存失败');
                }
            } catch {
                Message.error('草稿保存失败');
            } finally {
                setSaving(false);
            }
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await request.get(editArticleApi.categoryArticleList);
            if (res.code === 200 && Array.isArray(res.data)) {
                setCategories(res.data);
            }
        } catch (error) {
            setCategories([]);
        }
    };

    const fetchTags = async () => {
        try {
            const res = await request.get(editArticleApi.tagNameList);
            if (res.code === 200) {
                setTags(res.data);
            }
        } catch (error) {
            setTags([]);
        }
    };

    const fetchEditArticleData = () => {
        if (operateType === OperateType.article && operateId) return fetchArticleData();
        if (operateId) return fetchDraftData();
        return Promise.resolve();
    };

    const fetchArticleData = async () => {
        try {
            const res = await request.get<ArticleDraft>(`${editArticleApi.editArticle}/${operateId}`);
            if (res.code !== 200) {
                Message.warning(res.message);
                return;
            }
            const data = res.data;
            setTitle(data.title);
            setContent(data.content);
            setDescription(data.des ?? '');
            setCategory(data.category ?? null);
            setSelectedTagIds(data.tagIdList ?? []);
        } catch {
            Message.error('获取文章数据失败');
        }
    };

    const fetchDraftData = async () => {
        try {
            const res = await request.get<Draft>(`${editArticleApi.draftDetail}/${operateId}`);
            if (res.code !== 200) {
                Message.warning(res.message);
                return;
            }
            const data = res.data;
            setTitle(data.title);
            setContent(data.content);
            setDescription(data.des ?? '');
        } catch {
            Message.error('获取草稿数据失败');
        }
    };

    const fetchFolders = async () => {
        try {
            const res = await request.get(folderApi.folderNameList);
            if (res.code === 200 && res.data) setFolders(res.data);
        } catch {
            setFolders([]);
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetchCategories(),
            fetchTags(),
            fetchFolders(),
            fetchEditArticleData(),
        ]).finally(() => setLoading(false));
    }, []);

    const handlePaste = async (event: React.ClipboardEvent<HTMLDivElement>) => {
        if (!folder || !folder.id) {
            Message.warning("请先选择文件夹再粘贴上传图片");
            return;
        }

        const items = event.clipboardData.items;
        for (const item of items) {
            if (item.type.indexOf("image") !== -1) {
                event.preventDefault();
                const file = item.getAsFile();
                if (file) {
                    uploadImage(file);
                }
            }
        }
    };

    const uploadImage = async (file: File) => {
        if (!folder || !folder.id) {
            Message.warning("请先选择文件夹再上传图片");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folderId", folder.id.toString());

        try {
            const res = await request.post(imageApi.uploadImage, formData);

            if (res?.code === 200 && res?.data != null) {
                const path = String(res.data);
                const url = (import.meta.env.VITE_IMAGE_API ?? "") + path;
                insertToEditor(url);
            } else {
                Message.error((res as { message?: string })?.message ?? "上传失败");
            }
        } catch (error: unknown) {
            const msg = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
                ?? (error as { message?: string })?.message
                ?? "上传失败";
            Message.error(msg);
        }
    };

    const insertToEditor = (url: string) => {
        if (!url) return;

        const insertText = `\n\n![image](${url})\n`;
        const editor = editorRef.current;
        const isDom = editor && typeof (editor as HTMLElement).querySelector === 'function';
        const textarea = isDom ? (editor as HTMLElement).querySelector('textarea') : null;

        if (textarea && typeof textarea.selectionStart === 'number') {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const before = content.substring(0, start);
            const after = content.substring(end);
            setContent(before + insertText + after);
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + insertText.length;
                textarea.focus();
            }, 0);
        } else {
            setContent((prev) => prev + insertText);
        }
    };

    const wordCount = content.replace(/\s/g, '').length;
    const descLength = description.length;

    return (
        <div className={styles.addArticleBox}>
            {loading && (
                <div className={styles.loadingMask}>
                    <CircularProgress />
                    <span>加载中…</span>
                </div>
            )}
            {/* 顶部输入区 */}
            <div className={styles.headerBox}>
                <TextField
                    label="文章标题"
                    placeholder="输入文章标题"
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                />
                {/* 分类选择 */}
                <Autocomplete
                    options={categories}
                    getOptionLabel={(option) => option.categoryTitle}
                    value={category}
                    onChange={(_, newValue) => setCategory(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="分类" variant="outlined" fullWidth />
                    )}
                    noOptionsText="暂无选择"
                    fullWidth
                    clearOnBlur
                    PopperComponent={CustomPopper}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            <Chip label={option.categoryTitle} />
                        </li>
                    )}
                />


                {/* 标签选择（多选） */}
                <Autocomplete
                    multiple
                    options={tags}
                    getOptionLabel={(option) => option.tagTitle}
                    value={tags.filter((tag) => selectedTagIds.includes(tag.id))}
                    onChange={(_, newValue) => setSelectedTagIds(newValue.map((tag) => tag.id))}
                    renderInput={(params) => (
                        <TextField {...params} label="标签" variant="outlined" fullWidth />
                    )}
                    noOptionsText="暂无选择"
                    fullWidth
                    PopperComponent={CustomPopper}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            <Chip label={option.tagTitle} />
                        </li>
                    )}
                />

                {/* 图片文件夹（用于粘贴/上传图片） */}
                <Autocomplete
                    options={folders}
                    getOptionLabel={(option) => option.folderName}
                    value={folder}
                    onChange={(_, newValue) => setFolder(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="图片文件夹"
                            variant="outlined"
                            fullWidth
                            placeholder="选择后可在编辑器中粘贴图片上传"
                        />
                    )}
                    noOptionsText="暂无文件夹，请先在图库中创建"
                    fullWidth
                    clearOnBlur
                    PopperComponent={CustomPopper}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            <Chip label={option.folderName} />
                        </li>
                    )}
                />
                {!folder && (
                    <FormHelperText sx={{ gridColumn: '1 / -1', mt: -1 }}>
                        选择「图片文件夹」后，在下方编辑器中可直接粘贴截图上传
                    </FormHelperText>
                )}

                <TextField
                    label="文章描述"
                    placeholder="简短描述文章内容，用于列表与摘要"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    minRows={2}
                    maxRows={4}
                    inputProps={{ maxLength: 200 }}
                    helperText={descLength > 0 ? `${descLength}/200 字` : '建议 200 字以内'}
                />
            </div>

            <div className={styles.butBox}>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={saving || loading}
                    onClick={() => openConfirmDialog('save')}
                    startIcon={saving ? <CircularProgress size={18} color="inherit" /> : null}
                >
                    {saving ? '保存中…' : '保存文章'}
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    disabled={saving || loading}
                    onClick={() => openConfirmDialog('draft')}
                    startIcon={saving ? <CircularProgress size={18} color="inherit" /> : null}
                >
                    {saving ? '保存中…' : '存为草稿'}
                </Button>
            </div>

            {/* Markdown 编辑器：用 div 包一层以便 ref 拿到 DOM，再在 insertToEditor 里 querySelector textarea */}
            <div className={styles.mdBox}>
                <div className={styles.editorHeader}>
                    <span className={styles.wordCount}>正文约 {wordCount} 字</span>
                </div>
                <div ref={editorRef} className={styles.editorWrap}>
                    <MDEditor
                        value={content}
                        onChange={(value = '') => setContent(value)}
                        height="100%"
                        data-color-mode="light"
                        onPaste={(e) => handlePaste(e)}
                    />
                </div>
            </div>

            {/* 统一确认弹窗 */}
            <Dialog open={openDialog} onClose={() => !saving && setOpenDialog(false)}>
                <DialogTitle sx={{ textAlign: 'center' }}>确认操作</DialogTitle>
                <DialogContent sx={{ textAlign: 'center', mt: 1 }}>
                    {dialogType === 'save'
                        ? '确定要保存该文章吗？保存后将更新前台展示。'
                        : '确定要保存为草稿吗？可稍后继续编辑再发布。'}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
                    <Button variant="outlined" onClick={() => setOpenDialog(false)} disabled={saving}>
                        取消
                    </Button>
                    <Button variant="contained" onClick={handleConfirm} disabled={saving}>
                        {saving ? '处理中…' : '确定'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EditArticle;