# kui pagination

## 用于PC分页组件
- 只引入js，可将js和css文件放入同级目录，js将自动加载css文件

## 使用示例
- html 结构
```
	<div id="kuiPagination"></div>
```

- 引入js
```
	<script src="dist/pagination/pagination.min.js"></script>
```

- 调用
```js
	pagination.open({
        container: '#kuiPagination',
        // 总条数
        total: 1020,
        // 总页数
        pages: Math.floor(1020 / 23),
        // 每页条数
        skip: 23,
        // 当前第几页
        count: 1,
        // 回调
        callback: function (x, y) {
			// x:当前第几页;
			// y:跳过几条数据;
			console.log('x, y', x, y);
        }
	});
```
