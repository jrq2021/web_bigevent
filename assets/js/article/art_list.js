$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)
        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDay())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero() {
        return n > 9 ? n : '0' + n
    }
    // 定义一个查询对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        // 页码值
        pagenum: 1,
        // 每页显示几条数据
        pagesize: 2,
        // 文章分页的ID
        cate_id: '',
        // 文章的发布状态
        state: ''
    }
    initTable()

    initCate()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败!')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    $('#form-search').on('submit', function(e) {
            e.preventDefaults()
            var cate_id = $('[name=cate_id]').val()
            var state = $('[name=status]').val()
            q.cate_id = cate_id
            q.state = state
            initTable()
        })
        // 定义渲染分页的方法
        // 触发jump回调有两种方式：
        // 1、点击页码的时候
        // 2、只要调用了laypage.render方法，就会出发jump回调
        // 可以通过first的值来判断是通过哪种方式触发jump回调的

    function renderPage(total) {
        laypage.render({
            elem: 'test1',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 4, 6, 8],
            jump: function(obj, first) {
                console.log(first);
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        });
    }
    $('.tbody').on('click', '.btn-delete', function() {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length

        // 获取文章的自定义属性ID
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')

                    // 当数据删除完成后，需要判断当前页面是否还剩余数据，如果没有数据了，页码值就需要减一
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })
})