# git push远程不存在的新分支

```shell
git push origin local_branch:remote_branch
```

此时只是将本地分支push到远程新分支, 还需要关联本地分支和远程分支

```shell
git branch --set-upstream-to=origin/remote_branch
# 查看关联关系
git branch -vv
```